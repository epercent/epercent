import fs from 'node:fs'
import path from 'node:path'
import { validateEngineeringPackage } from './engineering-package-validator-service.js'

function resolveSafePath(workspaceRoot, relativePath) {
  const normalizedRoot = path.resolve(workspaceRoot)
  const targetPath = path.resolve(normalizedRoot, relativePath)

  if (
    targetPath !== normalizedRoot &&
    !targetPath.startsWith(`${normalizedRoot}${path.sep}`)
  ) {
    throw new Error(`Unsafe workspace path: ${relativePath}`)
  }

  return targetPath
}

export function applyEngineeringPackageToWorkspace(pkg, options = {}) {
  const validation = validateEngineeringPackage(pkg)

  if (!validation.valid) {
    return {
      success: false,
      status: 'Rejected',
      packageId: pkg?.packageId ?? null,
      errors: validation.errors,
      nextStep: 'Return package to Hermes'
    }
  }

  const workspaceRoot = path.resolve(
    options.workspaceRoot ??
      path.join(process.cwd(), 'eos', 'engineering-workspaces', pkg.packageId)
  )

  fs.mkdirSync(workspaceRoot, { recursive: true })

  const applied = []

  for (const file of pkg.files) {
    const targetPath = resolveSafePath(workspaceRoot, file.path)

    if (file.action === 'create' || file.action === 'update') {
      fs.mkdirSync(path.dirname(targetPath), { recursive: true })
      fs.writeFileSync(targetPath, file.content ?? '', 'utf8')

      applied.push({
        action: file.action,
        path: file.path,
        status: 'Applied'
      })

      continue
    }

    if (file.action === 'delete') {
      if (fs.existsSync(targetPath)) {
        fs.rmSync(targetPath, { recursive: true, force: true })
      }

      applied.push({
        action: file.action,
        path: file.path,
        status: 'Applied'
      })

      continue
    }

    throw new Error(`Unsupported file action: ${file.action}`)
  }

  return {
    success: true,
    status: 'Workspace Built',
    packageId: pkg.packageId,
    missionId: pkg.missionId,
    workspaceRoot,
    applied,
    appliedAt: new Date().toISOString(),
    nextStep: 'Run Workspace Tests'
  }
}
