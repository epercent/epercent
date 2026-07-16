import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

function resolveRepositoryRoot(startDirectory) {
  const result = spawnSync(
    'git',
    ['rev-parse', '--show-toplevel'],
    {
      cwd: startDirectory,
      encoding: 'utf8'
    }
  )

  if (result.status !== 0) {
    throw new Error(
      result.stderr?.trim() || 'Unable to locate Git repository.'
    )
  }

  return path.resolve(result.stdout.trim())
}

function resolveContainedPath(root, relativePath, label) {
  const resolvedRoot = path.resolve(root)
  const resolvedTarget = path.resolve(resolvedRoot, relativePath)

  if (
    resolvedTarget !== resolvedRoot &&
    !resolvedTarget.startsWith(`${resolvedRoot}${path.sep}`)
  ) {
    throw new Error(`Unsafe ${label} path: ${relativePath}`)
  }

  return resolvedTarget
}

export function promoteWorkspaceFiles({
  governanceReview,
  workspaceRoot,
  files = [],
  repositoryRoot,
  execute = false
}) {
  if (governanceReview?.decision !== 'Approved') {
    return {
      success: false,
      status: 'Rejected',
      reason: 'Governance approval required.',
      nextStep: 'Return package to Governance'
    }
  }

  if (!workspaceRoot || !fs.existsSync(workspaceRoot)) {
    return {
      success: false,
      status: 'Rejected',
      reason: 'Governed workspace does not exist.',
      nextStep: 'Rebuild Workspace'
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

  try {
    const repoRoot = repositoryRoot
      ? path.resolve(repositoryRoot)
      : resolveRepositoryRoot(process.cwd())

    const workspace = path.resolve(workspaceRoot)

    const engineeringRoot = path.resolve(
      process.cwd(),
      'eos',
      'engineering-workspaces'
    )

    if (
      workspace !== engineeringRoot &&
      !workspace.startsWith(`${engineeringRoot}${path.sep}`)
    ) {
      throw new Error(
        'Workspace is outside the governed engineering root.'
      )
    }

    const plan = files.map(file => {
      if (!file?.path || typeof file.path !== 'string') {
        throw new Error('Every approved file requires a path.')
      }

      const sourcePath = resolveContainedPath(
        workspace,
        file.path,
        'workspace'
      )

      const repositoryPath = file.repositoryPath ?? file.path

      const destinationPath = resolveContainedPath(
        repoRoot,
        repositoryPath,
        'repository'
      )

      if (
        file.action !== 'delete' &&
        !fs.existsSync(sourcePath)
      ) {
        throw new Error(
          `Workspace source file does not exist: ${file.path}`
        )
      }

      return {
        action: file.action,
        workspacePath: file.path,
        repositoryPath,
        sourcePath,
        destinationPath
      }
    })

    if (!execute) {
      return {
        success: true,
        status: 'Promotion Simulation',
        repositoryRoot: repoRoot,
        workspaceRoot: workspace,
        files: plan.map(item => ({
          action: item.action,
          workspacePath: item.workspacePath,
          repositoryPath: item.repositoryPath
        })),
        nextStep: 'Human Approval'
      }
    }

    const promoted = []

    for (const item of plan) {
      if (item.action === 'delete') {
        fs.rmSync(item.destinationPath, {
          recursive: true,
          force: true
        })
      } else {
        fs.mkdirSync(
          path.dirname(item.destinationPath),
          { recursive: true }
        )

        fs.copyFileSync(
          item.sourcePath,
          item.destinationPath
        )
      }

      promoted.push({
        action: item.action,
        repositoryPath: item.repositoryPath,
        status: 'Promoted'
      })
    }

    return {
      success: true,
      status: 'Files Promoted',
      repositoryRoot: repoRoot,
      workspaceRoot: workspace,
      promoted,
      promotedAt: new Date().toISOString(),
      nextStep: 'Git Commit'
    }
  } catch (error) {
    return {
      success: false,
      status: 'Promotion Failed',
      reason:
        error instanceof Error
          ? error.message
          : 'Unknown repository promotion error.',
      nextStep: 'Return package to Hermes'
    }
  }
}
