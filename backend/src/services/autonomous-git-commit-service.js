import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

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
  const result =
    runGit(
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

function getHead(repositoryRoot) {
  const result =
    runGit(
      ['rev-parse', 'HEAD'],
      repositoryRoot
    )

  if (result.status !== 0) {
    throw new Error(
      result.stderr?.trim() ||
      'Unable to determine repository HEAD.'
    )
  }

  return result.stdout.trim()
}

function getBranch(repositoryRoot) {
  const result =
    runGit(
      ['branch', '--show-current'],
      repositoryRoot
    )

  if (result.status !== 0) {
    throw new Error(
      result.stderr?.trim() ||
      'Unable to determine repository branch.'
    )
  }

  return result.stdout.trim()
}

function getCanonicalWorktreeChanges(repositoryRoot) {
  const trackedResult =
    runGit(
      ['diff', '--name-only'],
      repositoryRoot
    )

  if (trackedResult.status !== 0) {
    throw new Error(
      trackedResult.stderr?.trim() ||
      'Unable to inspect tracked repository changes.'
    )
  }

  const untrackedResult =
    runGit(
      [
        'ls-files',
        '--others',
        '--exclude-standard'
      ],
      repositoryRoot
    )

  if (untrackedResult.status !== 0) {
    throw new Error(
      untrackedResult.stderr?.trim() ||
      'Unable to inspect untracked repository changes.'
    )
  }

  const tracked =
    trackedResult.stdout
      .trim()
      .split('\n')
      .filter(Boolean)

  const untracked =
    untrackedResult.stdout
      .trim()
      .split('\n')
      .filter(Boolean)

  return [
    ...new Set([
      ...tracked,
      ...untracked
    ])
  ].sort()
}

function getStagedFiles(repositoryRoot) {
  const result =
    runGit(
      [
        'diff',
        '--cached',
        '--name-only',
        '--diff-filter=ACDMRTUXB'
      ],
      repositoryRoot
    )

  if (result.status !== 0) {
    throw new Error(
      result.stderr?.trim() ||
      'Unable to inspect staged file set.'
    )
  }

  return result.stdout
    .trim()
    .split('\n')
    .filter(Boolean)
}

function getCommitFiles(
  repositoryRoot,
  commit
) {
  const result =
    runGit(
      [
        'diff-tree',
        '--no-commit-id',
        '--name-only',
        '-r',
        commit
      ],
      repositoryRoot
    )

  if (result.status !== 0) {
    throw new Error(
      result.stderr?.trim() ||
      'Unable to inspect committed file set.'
    )
  }

  return result.stdout
    .trim()
    .split('\n')
    .filter(Boolean)
}

function normalizeApprovedFiles(
  repositoryRoot,
  files
) {
  if (
    !Array.isArray(files) ||
    files.length === 0
  ) {
    throw new Error(
      'No approved files supplied.'
    )
  }

  const normalized =
    files.map(file => {
      if (
        typeof file !== 'string' ||
        file.trim() === ''
      ) {
        throw new Error(
          'Every approved file must be a non-empty string.'
        )
      }

      const requested =
        file.trim()

      const absolutePath =
        path.resolve(
          repositoryRoot,
          requested
        )

      if (
        absolutePath !== repositoryRoot &&
        !absolutePath.startsWith(
          `${repositoryRoot}${path.sep}`
        )
      ) {
        throw new Error(
          `Unsafe repository path: ${requested}`
        )
      }

      return path.relative(
        repositoryRoot,
        absolutePath
      )
    })

  return [
    ...new Set(normalized)
  ].sort()
}

function normalizePromotedFiles(
  promotion
) {
  if (
    !promotion ||
    promotion.success !== true ||
    promotion.promotionExecuted !== true ||
    promotion.status !== 'Files Promoted'
  ) {
    throw new Error(
      'Successful governed promotion evidence is required before commit.'
    )
  }

  if (
    promotion.commitExecuted === true
  ) {
    throw new Error(
      'Promotion evidence indicates a commit was already executed.'
    )
  }

  if (
    !Array.isArray(
      promotion.promoted
    ) ||
    promotion.promoted.length === 0
  ) {
    throw new Error(
      'Promotion evidence does not contain promoted files.'
    )
  }

  return promotion.promoted
    .map(item => {
      if (
        !item?.repositoryPath
      ) {
        throw new Error(
          'Promotion evidence contains a promoted file without repositoryPath.'
        )
      }

      return String(
        item.repositoryPath
      )
    })
    .sort()
}

function verifyVerificationEvidence(
  verification
) {
  if (
    !verification ||
    verification.success !== true ||
    verification.verdict !== 'PASS'
  ) {
    throw new Error(
      'Autonomous verification PASS is required before commit.'
    )
  }

  if (
    verification?.isolation?.governed !== true
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
    missionId:
      verification.missionId ??
      null,
    packageId:
      verification.packageId ??
      null,
    verdict:
      verification.verdict
  }
}

function compareFileSets(
  actual,
  expected,
  label
) {
  const actualSorted =
    [...actual].sort()

  const expectedSorted =
    [...expected].sort()

  if (
    actualSorted.length !==
    expectedSorted.length
  ) {
    throw new Error(
      `${label} file count mismatch.`
    )
  }

  for (
    let index = 0;
    index < expectedSorted.length;
    index += 1
  ) {
    if (
      actualSorted[index] !==
      expectedSorted[index]
    ) {
      throw new Error(
        `${label} file set does not match authorized scope.`
      )
    }
  }

  return true
}

function clearAuthorizedStaging(
  repositoryRoot,
  approvedFiles
) {
  const result =
    runGit(
      [
        'reset',
        '--quiet',
        'HEAD',
        '--',
        ...approvedFiles
      ],
      repositoryRoot
    )

  if (
    result.status !== 0
  ) {
    return false
  }

  return true
}

export function createAutonomousCommit({
  governanceReview,
  verification,
  promotion,
  files = [],
  message,
  expectedHead,
  expectedBranch,
  execute = false,
  repositoryRoot
}) {
  if (
    !governanceReview ||
    governanceReview.decision !==
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
    typeof message !== 'string' ||
    message.trim() === ''
  ) {
    return {
      success: false,
      status: 'Rejected',
      reason:
        'Commit message is required.',
      nextStep:
        'Return package to Hermes'
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

    const approvedFiles =
      normalizeApprovedFiles(
        repoRoot,
        files
      )

    const promotedFiles =
      normalizePromotedFiles(
        promotion
      )

    const verificationGate =
      verifyVerificationEvidence(
        verification
      )

    compareFileSets(
      approvedFiles,
      promotedFiles,
      'Promotion'
    )

    if (
      verificationGate.packageId &&
      promotion?.verification
        ?.packageId &&
      verificationGate.packageId !==
        promotion.verification.packageId
    ) {
      throw new Error(
        'Verification package does not match promotion package.'
      )
    }

    if (
      verificationGate.missionId &&
      promotion?.verification
        ?.missionId &&
      verificationGate.missionId !==
        promotion.verification.missionId
    ) {
      throw new Error(
        'Verification mission does not match promotion mission.'
      )
    }

    const headBefore =
      getHead(
        repoRoot
      )

    const branchBefore =
      getBranch(
        repoRoot
      )

    if (
      expectedHead &&
      headBefore !==
        expectedHead
    ) {
      throw new Error(
        `Canonical HEAD mismatch. Expected ${expectedHead}; actual ${headBefore}.`
      )
    }

    if (
      expectedBranch &&
      branchBefore !==
        expectedBranch
    ) {
      throw new Error(
        `Canonical branch mismatch. Expected ${expectedBranch}; actual ${branchBefore}.`
      )
    }

    if (
      promotion?.provenance
        ?.canonicalCommit &&
      promotion.provenance
        .canonicalCommit !==
        headBefore
    ) {
      throw new Error(
        'Promotion provenance no longer matches canonical HEAD.'
      )
    }

    const canonicalChanges =
      getCanonicalWorktreeChanges(
        repoRoot
      )

    compareFileSets(
      canonicalChanges,
      approvedFiles,
      'Canonical worktree'
    )

    if (!execute) {
      return {
        success: true,
        status: 'Simulation',
        repositoryRoot:
          repoRoot,
        files:
          approvedFiles,
        commitMessage:
          message.trim(),
        headBefore,
        branch:
          branchBefore,
        verification:
          verificationGate,
        promotionVerified:
          true,
        commitExecuted:
          false,
        nextStep:
          'Human Approval'
      }
    }

    const stagedBefore =
      getStagedFiles(
        repoRoot
      )

    if (
      stagedBefore.length > 0
    ) {
      throw new Error(
        'Git index must be clean before autonomous staging.'
      )
    }

    const addResult =
      runGit(
        [
          'add',
          '--',
          ...approvedFiles
        ],
        repoRoot
      )

    if (
      addResult.status !== 0
    ) {
      throw new Error(
        addResult.stderr?.trim() ||
        'Git staging failed.'
      )
    }

    const stagedFiles =
      getStagedFiles(
        repoRoot
      )

    try {
      compareFileSets(
        stagedFiles,
        approvedFiles,
        'Staged'
      )
    } catch (error) {
      clearAuthorizedStaging(
        repoRoot,
        approvedFiles
      )

      throw error
    }

    const diffResult =
      runGit(
        [
          'diff',
          '--cached',
          '--quiet'
        ],
        repoRoot
      )

    if (
      diffResult.status === 0
    ) {
      clearAuthorizedStaging(
        repoRoot,
        approvedFiles
      )

      return {
        success: false,
        status: 'Rejected',
        reason:
          'Approved files produced no staged changes.',
        commitExecuted:
          false,
        nextStep:
          'Return package to Hermes'
      }
    }

    if (
      diffResult.status !== 1
    ) {
      clearAuthorizedStaging(
        repoRoot,
        approvedFiles
      )

      throw new Error(
        diffResult.stderr?.trim() ||
        'Unable to verify staged changes.'
      )
    }

    const commitResult =
      runGit(
        [
          'commit',
          '-m',
          message.trim(),
          '--',
          ...approvedFiles
        ],
        repoRoot
      )

    if (
      commitResult.status !== 0
    ) {
      clearAuthorizedStaging(
        repoRoot,
        approvedFiles
      )

      throw new Error(
        commitResult.stderr?.trim() ||
        'Git commit failed.'
      )
    }

    const commit =
      getHead(
        repoRoot
      )

    if (
      commit === headBefore
    ) {
      throw new Error(
        'Git commit completed without advancing HEAD.'
      )
    }

    const committedFiles =
      getCommitFiles(
        repoRoot,
        commit
      )

    compareFileSets(
      committedFiles,
      approvedFiles,
      'Committed'
    )

    const stagedAfter =
      getStagedFiles(
        repoRoot
      )

    if (
      stagedAfter.length !== 0
    ) {
      throw new Error(
        'Git index is not clean after commit.'
      )
    }

    return {
      success: true,
      status: 'Committed',
      repositoryRoot:
        repoRoot,
      files:
        approvedFiles,
      commit,
      previousCommit:
        headBefore,
      branch:
        branchBefore,
      commitMessage:
        message.trim(),
      committedFiles,
      verification:
        verificationGate,
      promotionVerified:
        true,
      commitExecuted:
        true,
      pushExecuted:
        false,
      nextStep:
        'Mission Complete'
    }
  } catch (error) {
    return {
      success: false,
      status: 'Commit Failed',
      reason:
        error instanceof Error
          ? error.message
          : 'Unknown Git execution error.',
      commitExecuted:
        false,
      pushExecuted:
        false,
      nextStep:
        'Return package to Hermes'
    }
  }
}
