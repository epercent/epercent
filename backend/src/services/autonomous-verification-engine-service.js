import { validateEngineeringPackage } from './engineering-package-validator-service.js'
import { readGovernedWorkspaceManifest } from './governed-workspace-builder-service.js'
import { runWorkspaceTests } from './workspace-test-runner-service.js'

function buildVerdict({
  packageValidation,
  workspaceManifest,
  testExecution
}) {
  if (!packageValidation?.valid) {
    return {
      verdict: 'REJECTED',
      reason:
        'Engineering package validation failed.'
    }
  }

  if (!workspaceManifest) {
    return {
      verdict: 'REJECTED',
      reason:
        'Governed workspace manifest is unavailable.'
    }
  }

  if (
    workspaceManifest?.isolation?.governed !== true ||
    workspaceManifest?.isolation?.canonicalRepositoryWritable !== false
  ) {
    return {
      verdict: 'REJECTED',
      reason:
        'Workspace isolation contract is invalid.'
    }
  }

  if (
    testExecution?.status ===
    'Rejected'
  ) {
    return {
      verdict: 'REJECTED',
      reason:
        testExecution?.errors?.join('; ') ||
        'Verification execution rejected.'
    }
  }

  if (!testExecution?.success) {
    return {
      verdict: 'FAIL',
      reason:
        'One or more governed workspace tests failed.'
    }
  }

  return {
    verdict: 'PASS',
    reason:
      'Engineering package and governed workspace tests passed.'
  }
}

export function verifyEngineeringWorkspace({
  engineeringPackage,
  workspaceRoot,
  repositoryRoot,
  timeoutMs = 120000
} = {}) {
  const startedAt =
    new Date().toISOString()

  const packageValidation =
    validateEngineeringPackage(
      engineeringPackage ?? {}
    )

  if (!packageValidation.valid) {
    return {
      success: false,
      status:
        'Verification Rejected',
      verdict:
        'REJECTED',
      startedAt,
      completedAt:
        new Date().toISOString(),
      packageValidation,
      workspaceManifest:
        null,
      testExecution:
        null,
      reason:
        'Engineering package validation failed.',
      nextStep:
        'Return package to Hermes'
    }
  }

  const workspaceManifest =
    readGovernedWorkspaceManifest(
      workspaceRoot,
      repositoryRoot
    )

  const testExecution =
    runWorkspaceTests({
      workspaceRoot,
      tests:
        engineeringPackage.tests,
      timeoutMs,
      repositoryRoot
    })

  const decision =
    buildVerdict({
      packageValidation,
      workspaceManifest,
      testExecution
    })

  return {
    success:
      decision.verdict ===
      'PASS',

    status:
      decision.verdict === 'PASS'
        ? 'Verification Passed'
        : decision.verdict === 'FAIL'
          ? 'Verification Failed'
          : 'Verification Rejected',

    verdict:
      decision.verdict,

    reason:
      decision.reason,

    startedAt,

    completedAt:
      new Date().toISOString(),

    missionId:
      engineeringPackage.missionId ??
      null,

    packageId:
      engineeringPackage.packageId ??
      null,

    workspaceRoot:
      workspaceRoot ?? null,

    source: {
      branch:
        workspaceManifest?.source?.branch ??
        null,
      commit:
        workspaceManifest?.source?.commit ??
        null,
      immutable:
        workspaceManifest?.source?.immutableSource ??
        null
    },

    isolation: {
      governed:
        workspaceManifest?.isolation?.governed ??
        false,

      canonicalRepositoryWritable:
        workspaceManifest?.isolation?.canonicalRepositoryWritable ??
        null,

      promotionRequired:
        workspaceManifest?.isolation?.promotionRequired ??
        null
    },

    packageValidation,

    workspaceManifest,

    testExecution,

    summary: {
      totalTests:
        testExecution?.totalTests ??
        0,

      passedTests:
        testExecution?.passedTests ??
        0,

      failedTests:
        testExecution?.failedTests ??
        0
    },

    nextStep:
      decision.verdict === 'PASS'
        ? 'Governance Review'
        : decision.verdict === 'FAIL'
          ? 'Return package to Hermes'
          : 'Governance Review'
  }
}
