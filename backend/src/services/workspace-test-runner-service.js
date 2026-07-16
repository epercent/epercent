import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

function isSafeWorkspace(workspaceRoot) {
  const resolved = path.resolve(workspaceRoot)
  const expectedRoot = path.resolve(
    process.cwd(),
    'eos',
    'engineering-workspaces'
  )

  return (
    resolved === expectedRoot ||
    resolved.startsWith(`${expectedRoot}${path.sep}`)
  )
}

export function runWorkspaceTests({
  workspaceRoot,
  tests = [],
  timeoutMs = 120000
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

  if (!isSafeWorkspace(workspaceRoot)) {
    return {
      success: false,
      status: 'Rejected',
      errors: ['Workspace is outside the governed engineering root.'],
      results: [],
      nextStep: 'Governance Review'
    }
  }

  if (!Array.isArray(tests)) {
    return {
      success: false,
      status: 'Rejected',
      errors: ['tests must be an array.'],
      results: [],
      nextStep: 'Return package to Hermes'
    }
  }

  const results = tests.map((test, index) => {
    const command = test?.command?.trim()

    if (!command) {
      return {
        index,
        command: null,
        purpose: test?.purpose ?? '',
        passed: false,
        exitCode: null,
        stdout: '',
        stderr: 'Test command is required.'
      }
    }

    const execution = spawnSync('/bin/zsh', ['-lc', command], {
      cwd: workspaceRoot,
      encoding: 'utf8',
      timeout: timeoutMs,
      maxBuffer: 1024 * 1024
    })

    return {
      index,
      command,
      purpose: test?.purpose ?? '',
      expectedResult: test?.expectedResult ?? '',
      passed: execution.status === 0 && !execution.error,
      exitCode: execution.status,
      stdout: execution.stdout ?? '',
      stderr: execution.error?.message ?? execution.stderr ?? ''
    }
  })

  const passed = results.every(result => result.passed)

  return {
    success: passed,
    status: passed ? 'Tests Passed' : 'Tests Failed',
    testedAt: new Date().toISOString(),
    workspaceRoot: path.resolve(workspaceRoot),
    totalTests: results.length,
    passedTests: results.filter(result => result.passed).length,
    failedTests: results.filter(result => !result.passed).length,
    results,
    nextStep: passed
      ? 'Governance Review'
      : 'Return package to Hermes'
  }
}
