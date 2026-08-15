import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

import {
  getGovernedEngineeringRoot,
  isGovernedWorkspacePath,
  readGovernedWorkspaceManifest
} from './governed-workspace-builder-service.js'

export function runWorkspaceTests({
  workspaceRoot,
  tests = [],
  timeoutMs = 120000,
  repositoryRoot
}) {
  if (!workspaceRoot || !fs.existsSync(workspaceRoot)) {
    return {
      success: false,
      status: 'Rejected',
      errors: ['Workspace does not exist.'],
      results: [],
      nextStep: 'Rebuild Workspace'
    }
  }

  if (
    !isGovernedWorkspacePath(
      workspaceRoot,
      repositoryRoot
    )
  ) {
    return {
      success: false,
      status: 'Rejected',
      errors: [
        'Workspace is outside the governed engineering root.'
      ],
      results: [],
      nextStep: 'Governance Review'
    }
  }

  const manifest =
    readGovernedWorkspaceManifest(
      workspaceRoot,
      repositoryRoot
    )

  if (!manifest) {
    return {
      success: false,
      status: 'Rejected',
      errors: [
        'Governed workspace manifest is missing.'
      ],
      results: [],
      nextStep: 'Rebuild Workspace'
    }
  }

  if (
    manifest?.isolation?.governed !== true ||
    manifest?.isolation?.canonicalRepositoryWritable !== false
  ) {
    return {
      success: false,
      status: 'Rejected',
      errors: [
        'Workspace isolation contract is invalid.'
      ],
      results: [],
      manifest,
      nextStep: 'Governance Review'
    }
  }

  if (!Array.isArray(tests)) {
    return {
      success: false,
      status: 'Rejected',
      errors: ['tests must be an array.'],
      results: [],
      manifest,
      nextStep: 'Return package to Hermes'
    }
  }

  if (tests.length === 0) {
    return {
      success: false,
      status: 'Rejected',
      errors: [
        'At least one verification test is required.'
      ],
      results: [],
      manifest,
      nextStep: 'Return package to Hermes'
    }
  }

  const results = tests.map(
    (test, index) => {
      const command =
        test?.command?.trim()

      if (!command) {
        return {
          index,
          command: null,
          purpose:
            test?.purpose ?? '',
          expectedResult:
            test?.expectedResult ?? '',
          passed: false,
          exitCode: null,
          stdout: '',
          stderr:
            'Test command is required.',
          timedOut: false
        }
      }

      const execution =
        spawnSync(
          '/bin/zsh',
          ['-lc', command],
          {
            cwd:
              path.resolve(
                workspaceRoot
              ),
            encoding:
              'utf8',
            timeout:
              timeoutMs,
            maxBuffer:
              1024 * 1024
          }
        )

      const timedOut =
        execution.error?.code ===
        'ETIMEDOUT'

      return {
        index,
        command,
        purpose:
          test?.purpose ?? '',
        expectedResult:
          test?.expectedResult ?? '',
        passed:
          execution.status === 0 &&
          !execution.error,
        exitCode:
          execution.status,
        stdout:
          execution.stdout ?? '',
        stderr:
          execution.error?.message ??
          execution.stderr ??
          '',
        timedOut
      }
    }
  )

  const passed =
    results.every(
      (result) =>
        result.passed === true
    )

  return {
    success: passed,
    status:
      passed
        ? 'Tests Passed'
        : 'Tests Failed',

    testedAt:
      new Date().toISOString(),

    workspaceRoot:
      path.resolve(
        workspaceRoot
      ),

    governedRoot:
      getGovernedEngineeringRoot(
        repositoryRoot
      ),

    workspaceManifest: {
      workspaceId:
        manifest.workspaceId,
      missionId:
        manifest.missionId,
      packageId:
        manifest.packageId,
      sourceCommit:
        manifest.source?.commit ??
        null,
      sourceBranch:
        manifest.source?.branch ??
        null
    },

    totalTests:
      results.length,

    passedTests:
      results.filter(
        (result) =>
          result.passed
      ).length,

    failedTests:
      results.filter(
        (result) =>
          !result.passed
      ).length,

    results,

    nextStep:
      passed
        ? 'Autonomous Verification'
        : 'Return package to Hermes'
  }
}
