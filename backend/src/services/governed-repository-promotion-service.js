import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import {
  readGovernedWorkspaceManifest
} from './governed-workspace-builder-service.js'

function runGit(args, cwd) {
  return spawnSync(
    'git',
    args,
    {
      cwd,
      encoding: 'utf8',
      maxBuffer: 1024 * 1024
    }
  )
}

function resolveRepositoryRoot(startDirectory) {
  const result = runGit(
    ['rev-parse', '--show-toplevel'],
    startDirectory
  )

  if (result.status !== 0) {
    throw new Error(
      result.stderr?.trim() ||
      'Unable to locate Git repository.'
    )
  }

  return path.resolve(
    result.stdout.trim()
  )
}

function getRepositoryHead(repositoryRoot) {
  const result = runGit(
    ['rev-parse', 'HEAD'],
    repositoryRoot
  )

  if (result.status !== 0) {
    throw new Error(
      result.stderr?.trim() ||
      'Unable to determine canonical repository HEAD.'
    )
  }

  return result.stdout.trim()
}

function getRepositoryBranch(repositoryRoot) {
  const result = runGit(
    ['branch', '--show-current'],
    repositoryRoot
  )

  if (result.status !== 0) {
    throw new Error(
      result.stderr?.trim() ||
      'Unable to determine canonical repository branch.'
    )
  }

  return result.stdout.trim()
}

function getRepositoryStatus(repositoryRoot) {
  const result = runGit(
    ['status', '--porcelain'],
    repositoryRoot
  )

  if (result.status !== 0) {
    throw new Error(
      result.stderr?.trim() ||
      'Unable to inspect canonical repository status.'
    )
  }

  return result.stdout.trim()
}

function resolveContainedPath(
  root,
  relativePath,
  label
) {
  const resolvedRoot =
    path.resolve(root)

  const resolvedTarget =
    path.resolve(
      resolvedRoot,
      relativePath
    )

  if (
    resolvedTarget !== resolvedRoot &&
    !resolvedTarget.startsWith(
      `${resolvedRoot}${path.sep}`
    )
  ) {
    throw new Error(
      `Unsafe ${label} path: ${relativePath}`
    )
  }

  return resolvedTarget
}

function verifyWorkspaceManifest({
  workspaceRoot,
  repositoryRoot
}) {
  const manifest =
    readGovernedWorkspaceManifest(
      workspaceRoot,
      repositoryRoot
    )

  if (!manifest) {
    throw new Error(
      'Governed workspace manifest is unavailable.'
    )
  }

  if (
    manifest?.isolation?.governed !== true
  ) {
    throw new Error(
      'Workspace is not marked as governed.'
    )
  }

  if (
    manifest?.isolation
      ?.isolatedFromCanonicalRepository !== true
  ) {
    throw new Error(
      'Workspace isolation from canonical repository is not verified.'
    )
  }

  if (
    manifest?.isolation
      ?.canonicalRepositoryWritable !== false
  ) {
    throw new Error(
      'Canonical repository must be non-writable from the governed workspace.'
    )
  }

  if (
    manifest?.isolation
      ?.promotionRequired !== true
  ) {
    throw new Error(
      'Workspace does not require governed promotion.'
    )
  }

  if (
    manifest?.source
      ?.immutableSource !== true
  ) {
    throw new Error(
      'Workspace source is not immutable.'
    )
  }

  if (
    !manifest?.source?.commit
  ) {
    throw new Error(
      'Workspace source commit is unavailable.'
    )
  }

  return manifest
}

function verifySourceProvenance({
  manifest,
  repositoryRoot
}) {
  const currentHead =
    getRepositoryHead(
      repositoryRoot
    )

  const currentBranch =
    getRepositoryBranch(
      repositoryRoot
    )

  if (
    manifest.source.commit !==
    currentHead
  ) {
    throw new Error(
      `Canonical repository HEAD changed after workspace creation. ` +
      `Workspace source ${manifest.source.commit}; ` +
      `canonical HEAD ${currentHead}.`
    )
  }

  if (
    manifest.source.branch &&
    currentBranch &&
    manifest.source.branch !==
      currentBranch
  ) {
    throw new Error(
      `Canonical repository branch changed after workspace creation. ` +
      `Workspace branch ${manifest.source.branch}; ` +
      `canonical branch ${currentBranch}.`
    )
  }

  return {
    sourceCommit:
      manifest.source.commit,
    canonicalCommit:
      currentHead,
    sourceBranch:
      manifest.source.branch ?? null,
    canonicalBranch:
      currentBranch || null,
    immutableSource:
      manifest.source
        .immutableSource === true,
    aligned:
      true
  }
}

function verifyVerificationGate(
  verification
) {
  if (!verification) {
    throw new Error(
      'Autonomous verification evidence is required before promotion.'
    )
  }

  if (
    verification.verdict !== 'PASS' ||
    verification.success !== true
  ) {
    throw new Error(
      'Autonomous verification must return PASS before promotion.'
    )
  }

  if (
    verification?.isolation
      ?.governed !== true
  ) {
    throw new Error(
      'Verification evidence does not confirm governed workspace isolation.'
    )
  }

  if (
    verification?.isolation
      ?.canonicalRepositoryWritable !== false
  ) {
    throw new Error(
      'Verification evidence does not confirm canonical repository isolation.'
    )
  }

  return {
    verdict:
      verification.verdict,
    verified:
      true,
    missionId:
      verification.missionId ??
      null,
    packageId:
      verification.packageId ??
      null,
    completedAt:
      verification.completedAt ??
      null
  }
}

function validatePromotionFiles({
  files,
  workspace,
  repositoryRoot
}) {
  if (
    !Array.isArray(files) ||
    files.length === 0
  ) {
    throw new Error(
      'No approved files supplied.'
    )
  }

  return files.map(file => {
    if (
      !file?.path ||
      typeof file.path !== 'string'
    ) {
      throw new Error(
        'Every approved file requires a path.'
      )
    }

    const action =
      file.action ?? 'update'

    if (
      ![
        'create',
        'update',
        'delete'
      ].includes(action)
    ) {
      throw new Error(
        `Unsupported promotion action: ${action}`
      )
    }

    const sourcePath =
      resolveContainedPath(
        workspace,
        file.path,
        'workspace'
      )

    const repositoryPath =
      file.repositoryPath ??
      file.path

    const destinationPath =
      resolveContainedPath(
        repositoryRoot,
        repositoryPath,
        'repository'
      )

    if (
      action !== 'delete' &&
      !fs.existsSync(sourcePath)
    ) {
      throw new Error(
        `Workspace source file does not exist: ${file.path}`
      )
    }

    return {
      action,
      workspacePath:
        file.path,
      repositoryPath,
      sourcePath,
      destinationPath
    }
  })
}

function captureFileState(
  repositoryRoot,
  plan
) {
  return plan.map(item => {
    const exists =
      fs.existsSync(
        item.destinationPath
      )

    return {
      repositoryPath:
        item.repositoryPath,
      existedBefore:
        exists,
      contentBefore:
        exists &&
        fs.statSync(
          item.destinationPath
        ).isFile()
          ? fs.readFileSync(
              item.destinationPath
            )
          : null
    }
  })
}

function rollbackPromotion(
  states,
  repositoryRoot
) {
  for (const state of states) {
    const target =
      resolveContainedPath(
        repositoryRoot,
        state.repositoryPath,
        'repository rollback'
      )

    if (
      state.existedBefore &&
      state.contentBefore !== null
    ) {
      fs.mkdirSync(
        path.dirname(target),
        { recursive: true }
      )

      fs.writeFileSync(
        target,
        state.contentBefore
      )
    } else if (
      !state.existedBefore
    ) {
      fs.rmSync(
        target,
        {
          recursive: true,
          force: true
        }
      )
    }
  }
}

export function promoteWorkspaceFiles({
  governanceReview,
  verification,
  workspaceRoot,
  files = [],
  repositoryRoot,
  execute = false
}) {
  if (
    governanceReview?.decision !==
    'Approved'
  ) {
    return {
      success: false,
      status: 'Rejected',
      reason:
        'Governance approval required.',
      nextStep:
        'Return package to Governance'
    }
  }

  if (
    !workspaceRoot ||
    !fs.existsSync(workspaceRoot)
  ) {
    return {
      success: false,
      status: 'Rejected',
      reason:
        'Governed workspace does not exist.',
      nextStep:
        'Rebuild Workspace'
    }
  }

  try {
    const repoRoot =
      repositoryRoot
        ? path.resolve(
            repositoryRoot
          )
        : resolveRepositoryRoot(
            process.cwd()
          )

    const workspace =
      path.resolve(
        workspaceRoot
      )

    const manifest =
      verifyWorkspaceManifest({
        workspaceRoot:
          workspace,
        repositoryRoot:
          repoRoot
      })

    const governedRoot =
      path.resolve(
        manifest.governedRoot
      )

    if (
      workspace !== governedRoot &&
      !workspace.startsWith(
        `${governedRoot}${path.sep}`
      )
    ) {
      throw new Error(
        'Workspace is outside the governed engineering root.'
      )
    }

    const verificationGate =
      verifyVerificationGate(
        verification
      )

    if (
      verificationGate.packageId &&
      manifest.packageId &&
      verificationGate.packageId !==
        manifest.packageId
    ) {
      throw new Error(
        'Verification package does not match governed workspace package.'
      )
    }

    if (
      verificationGate.missionId &&
      manifest.missionId &&
      verificationGate.missionId !==
        manifest.missionId
    ) {
      throw new Error(
        'Verification mission does not match governed workspace mission.'
      )
    }

    const provenance =
      verifySourceProvenance({
        manifest,
        repositoryRoot:
          repoRoot
      })

    const repositoryStatusBefore =
      getRepositoryStatus(
        repoRoot
      )

    if (
      execute &&
      repositoryStatusBefore !== ''
    ) {
      throw new Error(
        'Canonical repository must be clean before governed promotion.'
      )
    }

    const plan =
      validatePromotionFiles({
        files,
        workspace,
        repositoryRoot:
          repoRoot
      })

    if (!execute) {
      return {
        success: true,
        status:
          'Promotion Simulation',
        repositoryRoot:
          repoRoot,
        workspaceRoot:
          workspace,
        verification:
          verificationGate,
        provenance,
        files:
          plan.map(item => ({
            action:
              item.action,
            workspacePath:
              item.workspacePath,
            repositoryPath:
              item.repositoryPath
          })),
        promotionExecuted:
          false,
        commitExecuted:
          false,
        nextStep:
          'Human Approval'
      }
    }

    const originalStates =
      captureFileState(
        repoRoot,
        plan
      )

    const promoted = []

    try {
      for (const item of plan) {
        if (
          item.action === 'delete'
        ) {
          fs.rmSync(
            item.destinationPath,
            {
              recursive: true,
              force: true
            }
          )
        } else {
          fs.mkdirSync(
            path.dirname(
              item.destinationPath
            ),
            { recursive: true }
          )

          fs.copyFileSync(
            item.sourcePath,
            item.destinationPath
          )
        }

        promoted.push({
          action:
            item.action,
          repositoryPath:
            item.repositoryPath,
          status:
            'Promoted'
        })
      }
    } catch (promotionError) {
      rollbackPromotion(
        originalStates,
        repoRoot
      )

      throw promotionError
    }

    const headAfter =
      getRepositoryHead(
        repoRoot
      )

    if (
      headAfter !==
      provenance.canonicalCommit
    ) {
      rollbackPromotion(
        originalStates,
        repoRoot
      )

      throw new Error(
        'Canonical Git HEAD changed during file promotion.'
      )
    }

    return {
      success: true,
      status:
        'Files Promoted',
      repositoryRoot:
        repoRoot,
      workspaceRoot:
        workspace,
      verification:
        verificationGate,
      provenance,
      promoted,
      promotedAt:
        new Date().toISOString(),
      repositoryIntegrity: {
        headUnchanged:
          true,
        head:
          headAfter,
        onlyApprovedFilesPromoted:
          true
      },
      promotionExecuted:
        true,
      commitExecuted:
        false,
      nextStep:
        'Git Commit'
    }
  } catch (error) {
    return {
      success: false,
      status:
        'Promotion Failed',
      reason:
        error instanceof Error
          ? error.message
          : 'Unknown repository promotion error.',
      promotionExecuted:
        false,
      commitExecuted:
        false,
      nextStep:
        'Return package to Hermes'
    }
  }
}
