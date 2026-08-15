import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { validateEngineeringPackage } from './engineering-package-validator-service.js'

export const GOVERNED_WORKSPACE_MANIFEST = '.eos-workspace.json'

function runGit(args, cwd = process.cwd()) {
  const result = spawnSync(
    'git',
    args,
    {
      cwd,
      encoding: 'utf8'
    }
  )

  if (result.status !== 0) {
    return {
      success: false,
      stdout: result.stdout?.trim() ?? '',
      stderr: result.stderr?.trim() ?? '',
      status: result.status
    }
  }

  return {
    success: true,
    stdout: result.stdout?.trim() ?? '',
    stderr: result.stderr?.trim() ?? '',
    status: result.status
  }
}

export function getRepositoryProvenance(
  startDirectory = process.cwd()
) {
  const rootResult = runGit(
    ['rev-parse', '--show-toplevel'],
    startDirectory
  )

  if (!rootResult.success) {
    return {
      available: false,
      repositoryRoot: path.resolve(startDirectory),
      branch: null,
      commit: null,
      clean: null
    }
  }

  const repositoryRoot =
    path.resolve(rootResult.stdout)

  const branchResult = runGit(
    ['rev-parse', '--abbrev-ref', 'HEAD'],
    repositoryRoot
  )

  const commitResult = runGit(
    ['rev-parse', 'HEAD'],
    repositoryRoot
  )

  const statusResult = runGit(
    ['status', '--porcelain'],
    repositoryRoot
  )

  return {
    available:
      commitResult.success &&
      Boolean(commitResult.stdout),

    repositoryRoot,

    branch:
      branchResult.success
        ? branchResult.stdout
        : null,

    commit:
      commitResult.success
        ? commitResult.stdout
        : null,

    clean:
      statusResult.success
        ? statusResult.stdout === ''
        : null
  }
}

export function getGovernedEngineeringRoot(
  repositoryRoot
) {
  const provenance =
    getRepositoryProvenance(
      repositoryRoot ?? process.cwd()
    )

  const canonicalRoot =
    provenance.available
      ? provenance.repositoryRoot
      : path.resolve(
          repositoryRoot ??
          process.cwd()
        )

  return path.join(
    canonicalRoot,
    'backend',
    'eos',
    'engineering-workspaces'
  )
}

function resolveSafePath(
  workspaceRoot,
  relativePath
) {
  const normalizedRoot =
    path.resolve(workspaceRoot)

  const targetPath =
    path.resolve(
      normalizedRoot,
      relativePath
    )

  if (
    targetPath !== normalizedRoot &&
    !targetPath.startsWith(
      `${normalizedRoot}${path.sep}`
    )
  ) {
    throw new Error(
      `Unsafe workspace path: ${relativePath}`
    )
  }

  return targetPath
}

export function isGovernedWorkspacePath(
  workspaceRoot,
  repositoryRoot
) {
  if (!workspaceRoot) {
    return false
  }

  const resolved =
    path.resolve(workspaceRoot)

  const governedRoot =
    path.resolve(
      getGovernedEngineeringRoot(
        repositoryRoot
      )
    )

  return (
    resolved !== governedRoot &&
    resolved.startsWith(
      `${governedRoot}${path.sep}`
    )
  )
}

function extractRepositorySnapshot({
  repositoryRoot,
  commit,
  destination
}) {
  const temporaryArchive =
    path.join(
      os.tmpdir(),
      `eos-workspace-${process.pid}-${Date.now()}.tar`
    )

  try {
    const archiveResult =
      spawnSync(
        'git',
        [
          'archive',
          '--format=tar',
          `--output=${temporaryArchive}`,
          commit
        ],
        {
          cwd: repositoryRoot,
          encoding: 'utf8'
        }
      )

    if (archiveResult.status !== 0) {
      throw new Error(
        archiveResult.stderr?.trim() ||
        'Unable to create Git source archive.'
      )
    }

    fs.mkdirSync(
      destination,
      { recursive: true }
    )

    const extractResult =
      spawnSync(
        'tar',
        [
          '-xf',
          temporaryArchive,
          '-C',
          destination
        ],
        {
          encoding: 'utf8'
        }
      )

    if (extractResult.status !== 0) {
      throw new Error(
        extractResult.stderr?.trim() ||
        'Unable to extract Git source archive.'
      )
    }
  } finally {
    fs.rmSync(
      temporaryArchive,
      { force: true }
    )
  }
}

function createWorkspaceManifest({
  pkg,
  workspaceRoot,
  provenance,
  applied
}) {
  const now =
    new Date().toISOString()

  return {
    schema:
      'EOS Governed Engineering Workspace',

    schemaVersion:
      '1.1.0',

    workspaceId:
      pkg.packageId,

    packageId:
      pkg.packageId,

    missionId:
      pkg.missionId,

    provider:
      pkg.provider,

    workspaceRoot:
      path.resolve(workspaceRoot),

    governedRoot:
      getGovernedEngineeringRoot(
        provenance.repositoryRoot
      ),

    lifecycle: {
      state: 'Built',
      createdAt: now,
      updatedAt: now
    },

    source: {
      repositoryRoot:
        provenance.repositoryRoot,

      branch:
        provenance.branch,

      commit:
        provenance.commit,

      clean:
        provenance.clean,

      snapshotType:
        'git-archive',

      immutableSource:
        true
    },

    isolation: {
      governed: true,
      isolatedFromCanonicalRepository: true,
      canonicalRepositoryWritable: false,
      promotionRequired: true,
      directCommitAllowed: false,
      gitMetadataIncluded: false
    },

    appliedFiles:
      applied,

    nextStep:
      'Run Workspace Tests'
  }
}

function writeWorkspaceManifest(
  workspaceRoot,
  manifest
) {
  const manifestPath =
    resolveSafePath(
      workspaceRoot,
      GOVERNED_WORKSPACE_MANIFEST
    )

  fs.writeFileSync(
    manifestPath,
    `${JSON.stringify(
      manifest,
      null,
      2
    )}\n`,
    'utf8'
  )

  return manifestPath
}

export function readGovernedWorkspaceManifest(
  workspaceRoot,
  repositoryRoot
) {
  if (
    !isGovernedWorkspacePath(
      workspaceRoot,
      repositoryRoot
    )
  ) {
    return null
  }

  const manifestPath =
    resolveSafePath(
      workspaceRoot,
      GOVERNED_WORKSPACE_MANIFEST
    )

  if (
    !fs.existsSync(
      manifestPath
    )
  ) {
    return null
  }

  return JSON.parse(
    fs.readFileSync(
      manifestPath,
      'utf8'
    )
  )
}

export function applyEngineeringPackageToWorkspace(
  pkg,
  options = {}
) {
  const validation =
    validateEngineeringPackage(pkg)

  if (!validation.valid) {
    return {
      success: false,
      status: 'Rejected',
      packageId:
        pkg?.packageId ?? null,
      errors:
        validation.errors,
      nextStep:
        'Return package to Hermes'
    }
  }

  const provenance =
    getRepositoryProvenance(
      options.repositoryRoot ??
      process.cwd()
    )

  if (!provenance.available) {
    return {
      success: false,
      status: 'Rejected',
      packageId:
        pkg.packageId,
      errors: [
        'Canonical Git repository provenance could not be established.'
      ],
      nextStep:
        'Repository Verification'
    }
  }

  const governedRoot =
    getGovernedEngineeringRoot(
      provenance.repositoryRoot
    )

  const workspaceRoot =
    path.resolve(
      options.workspaceRoot ??
      path.join(
        governedRoot,
        pkg.packageId
      )
    )

  if (
    !isGovernedWorkspacePath(
      workspaceRoot,
      provenance.repositoryRoot
    )
  ) {
    return {
      success: false,
      status: 'Rejected',
      packageId:
        pkg.packageId,
      errors: [
        'Workspace must be inside the governed engineering root.'
      ],
      nextStep:
        'Governance Review'
    }
  }

  if (
    workspaceRoot ===
    provenance.repositoryRoot
  ) {
    return {
      success: false,
      status: 'Rejected',
      packageId:
        pkg.packageId,
      errors: [
        'Canonical repository cannot be used as an engineering workspace.'
      ],
      nextStep:
        'Governance Review'
    }
  }

  try {
    fs.rmSync(
      workspaceRoot,
      {
        recursive: true,
        force: true
      }
    )

    extractRepositorySnapshot({
      repositoryRoot:
        provenance.repositoryRoot,

      commit:
        provenance.commit,

      destination:
        workspaceRoot
    })

    const applied = []

    for (
      const file of pkg.files
    ) {
      const targetPath =
        resolveSafePath(
          workspaceRoot,
          file.path
        )

      if (
        file.action === 'create' ||
        file.action === 'update'
      ) {
        fs.mkdirSync(
          path.dirname(
            targetPath
          ),
          {
            recursive: true
          }
        )

        fs.writeFileSync(
          targetPath,
          file.content ?? '',
          'utf8'
        )

        applied.push({
          action:
            file.action,
          path:
            file.path,
          status:
            'Applied'
        })

        continue
      }

      if (
        file.action === 'delete'
      ) {
        if (
          fs.existsSync(
            targetPath
          )
        ) {
          fs.rmSync(
            targetPath,
            {
              recursive: true,
              force: true
            }
          )
        }

        applied.push({
          action:
            file.action,
          path:
            file.path,
          status:
            'Applied'
        })

        continue
      }

      throw new Error(
        `Unsupported file action: ${file.action}`
      )
    }

    const manifest =
      createWorkspaceManifest({
        pkg,
        workspaceRoot,
        provenance,
        applied
      })

    const manifestPath =
      writeWorkspaceManifest(
        workspaceRoot,
        manifest
      )

    return {
      success: true,
      status:
        'Workspace Built',

      workspaceId:
        pkg.packageId,

      packageId:
        pkg.packageId,

      missionId:
        pkg.missionId,

      workspaceRoot,

      governedRoot,

      manifestPath,

      manifest,

      provenance,

      applied,

      sourceSnapshot: {
        type:
          'git-archive',
        commit:
          provenance.commit,
        branch:
          provenance.branch
      },

      appliedAt:
        manifest.lifecycle.createdAt,

      nextStep:
        'Run Workspace Tests'
    }
  } catch (error) {
    return {
      success: false,
      status:
        'Workspace Build Failed',

      workspaceId:
        pkg.packageId,

      packageId:
        pkg.packageId,

      missionId:
        pkg.missionId,

      workspaceRoot,

      errors: [
        error instanceof Error
          ? error.message
          : 'Unknown workspace build failure.'
      ],

      nextStep:
        'Return package to Hermes'
    }
  }
}
