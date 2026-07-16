import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

function runGit(args, cwd) {
  return spawnSync('git', args, {
    cwd,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024
  })
}

function resolveRepositoryRoot(startDirectory) {
  const result = runGit(
    ['rev-parse', '--show-toplevel'],
    startDirectory
  )

  if (result.status !== 0) {
    throw new Error(
      result.stderr?.trim() || 'Unable to locate Git repository.'
    )
  }

  return path.resolve(result.stdout.trim())
}

function validateApprovedFiles(repositoryRoot, files) {
  return files.map(file => {
    if (typeof file !== 'string' || file.trim() === '') {
      throw new Error('Every approved file must be a non-empty string.')
    }

    const normalizedFile = file.trim()
    const absolutePath = path.resolve(repositoryRoot, normalizedFile)

    if (
      absolutePath !== repositoryRoot &&
      !absolutePath.startsWith(`${repositoryRoot}${path.sep}`)
    ) {
      throw new Error(`Unsafe repository path: ${normalizedFile}`)
    }

    if (!fs.existsSync(absolutePath)) {
      throw new Error(`Approved file does not exist: ${normalizedFile}`)
    }

    return path.relative(repositoryRoot, absolutePath)
  })
}

export function createAutonomousCommit({
  governanceReview,
  files = [],
  message,
  execute = false,
  repositoryRoot
}) {
  if (!governanceReview || governanceReview.decision !== 'Approved') {
    return {
      success: false,
      status: 'Rejected',
      reason: 'Governance approval required.',
      nextStep: 'Return package to Governance'
    }
  }

  if (!Array.isArray(files) || files.length === 0) {
    return {
      success: false,
      status: 'Rejected',
      reason: 'No approved files supplied.',
      nextStep: 'Return package to Hermes'
    }
  }

  if (typeof message !== 'string' || message.trim() === '') {
    return {
      success: false,
      status: 'Rejected',
      reason: 'Commit message is required.',
      nextStep: 'Return package to Hermes'
    }
  }

  try {
    const repoRoot = repositoryRoot
      ? path.resolve(repositoryRoot)
      : resolveRepositoryRoot(process.cwd())

    const approvedFiles = execute
      ? validateApprovedFiles(repoRoot, files)
      : files.map(file => String(file))

    if (!execute) {
      return {
        success: true,
        status: 'Simulation',
        repositoryRoot: repoRoot,
        files: approvedFiles,
        commitMessage: message.trim(),
        nextStep: 'Human Approval'
      }
    }

    const addResult = runGit(
      ['add', '--', ...approvedFiles],
      repoRoot
    )

    if (addResult.status !== 0) {
      throw new Error(
        addResult.stderr?.trim() || 'Git staging failed.'
      )
    }

    const diffResult = runGit(
      ['diff', '--cached', '--quiet'],
      repoRoot
    )

    if (diffResult.status === 0) {
      return {
        success: false,
        status: 'Rejected',
        reason: 'Approved files produced no staged changes.',
        nextStep: 'Return package to Hermes'
      }
    }

    if (diffResult.status !== 1) {
      throw new Error(
        diffResult.stderr?.trim() ||
        'Unable to verify staged changes.'
      )
    }

    const commitResult = runGit(
      ['commit', '-m', message.trim(), '--', ...approvedFiles],
      repoRoot
    )

    if (commitResult.status !== 0) {
      throw new Error(
        commitResult.stderr?.trim() || 'Git commit failed.'
      )
    }

    const shaResult = runGit(
      ['rev-parse', 'HEAD'],
      repoRoot
    )

    if (shaResult.status !== 0) {
      throw new Error(
        shaResult.stderr?.trim() ||
        'Unable to retrieve commit SHA.'
      )
    }

    return {
      success: true,
      status: 'Committed',
      repositoryRoot: repoRoot,
      files: approvedFiles,
      commit: shaResult.stdout.trim(),
      commitMessage: message.trim(),
      nextStep: 'Mission Complete'
    }
  } catch (error) {
    return {
      success: false,
      status: 'Commit Failed',
      reason:
        error instanceof Error
          ? error.message
          : 'Unknown Git execution error.',
      nextStep: 'Return package to Hermes'
    }
  }
}
