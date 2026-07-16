import { validateEngineeringPackage } from './engineering-package-validator-service.js'
import { applyEngineeringPackageToWorkspace } from './governed-workspace-builder-service.js'
import { runWorkspaceTests } from './workspace-test-runner-service.js'
import { reviewEngineeringPackage } from './governance-review-service.js'
import { promoteWorkspaceFiles } from './governed-repository-promotion-service.js'
import { createAutonomousCommit } from './autonomous-git-commit-service.js'
import { completeMission } from './mission-completion-service.js'
import { generateNextEngineeringMission } from './autonomous-mission-generator-service.js'

export function runAutonomousEngineeringRuntime({
  mission,
  engineeringPackage,
  repositoryFiles = [],
  commitMessage = 'EOS autonomous engineering mission',
  executePromotion = false,
  executeCommit = false
}) {
  const startedAt = new Date().toISOString()

  const validation = validateEngineeringPackage(engineeringPackage)

  if (!validation.valid) {
    return {
      success: false,
      status: 'Validation Failed',
      startedAt,
      validation,
      nextStep: 'Return package to Hermes'
    }
  }

  const workspace = applyEngineeringPackageToWorkspace(
    engineeringPackage
  )

  if (!workspace.success) {
    return {
      success: false,
      status: 'Workspace Build Failed',
      startedAt,
      validation,
      workspace,
      nextStep: workspace.nextStep
    }
  }

  const tests = runWorkspaceTests({
    workspaceRoot: workspace.workspaceRoot,
    tests: engineeringPackage.tests
  })

  const governance = reviewEngineeringPackage({
    validation,
    workspace,
    tests,
    governance: engineeringPackage.governance
  })

  if (governance.decision === 'Rejected') {
    return {
      success: false,
      status: 'Governance Rejected',
      startedAt,
      validation,
      workspace,
      tests,
      governance,
      nextStep: governance.nextStep
    }
  }

  if (governance.decision === 'Human Review Required') {
    return {
      success: true,
      status: 'Awaiting Human Approval',
      startedAt,
      validation,
      workspace,
      tests,
      governance,
      nextStep: 'Executive Approval'
    }
  }

  const promotion = promoteWorkspaceFiles({
    governanceReview: governance,
    workspaceRoot: workspace.workspaceRoot,
    files: repositoryFiles,
    execute: executePromotion
  })

  if (!promotion.success) {
    return {
      success: false,
      status: 'Promotion Failed',
      startedAt,
      validation,
      workspace,
      tests,
      governance,
      promotion,
      nextStep: promotion.nextStep
    }
  }

  const gitCommit = createAutonomousCommit({
    governanceReview: governance,
    files: repositoryFiles.map(file => file.repositoryPath ?? file.path),
    message: commitMessage,
    execute: executeCommit
  })

  if (!gitCommit.success) {
    return {
      success: false,
      status: 'Git Stage Failed',
      startedAt,
      validation,
      workspace,
      tests,
      governance,
      promotion,
      gitCommit,
      nextStep: gitCommit.nextStep
    }
  }

  if (!executeCommit) {
    return {
      success: true,
      status: 'Governed Simulation Complete',
      startedAt,
      validation,
      workspace,
      tests,
      governance,
      promotion,
      gitCommit,
      nextStep: 'Human Approval for Repository Execution'
    }
  }

  const completion = completeMission({
    mission,
    engineeringPackage,
    governanceReview: governance,
    gitCommit
  })

  const nextMission = completion.success
    ? generateNextEngineeringMission({
        completedMission: completion,
        currentSprint: mission?.sprint ?? 'Sprint 10',
        currentObjective: 'Continue governed eOS development'
      })
    : null

  return {
    success: completion.success,
    status: completion.success
      ? 'Engineering Cycle Complete'
      : 'Mission Completion Failed',
    startedAt,
    completedAt: new Date().toISOString(),
    validation,
    workspace,
    tests,
    governance,
    promotion,
    gitCommit,
    completion,
    nextMission,
    nextStep: completion.nextStep
  }
}
