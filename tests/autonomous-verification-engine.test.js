import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

import {
  applyEngineeringPackageToWorkspace
} from '../backend/src/services/governed-workspace-builder-service.js'

import {
  verifyEngineeringWorkspace
} from '../backend/src/services/autonomous-verification-engine-service.js'

function runGit(args, cwd) {
  const result =
    spawnSync(
      'git',
      args,
      {
        cwd,
        encoding:
          'utf8'
      }
    )

  assert.equal(
    result.status,
    0,
    result.stderr
  )

  return result.stdout.trim()
}

function createRepository() {
  const root =
    fs.mkdtempSync(
      path.join(
        os.tmpdir(),
        'eos-verification-'
      )
    )

  runGit(
    ['init'],
    root
  )

  runGit(
    [
      'config',
      'user.email',
      'eos-test@example.com'
    ],
    root
  )

  runGit(
    [
      'config',
      'user.name',
      'EOS Test'
    ],
    root
  )

  fs.mkdirSync(
    path.join(
      root,
      'backend',
      'src'
    ),
    {
      recursive: true
    }
  )

  fs.writeFileSync(
    path.join(
      root,
      'backend',
      'src',
      'baseline.js'
    ),
    'export const baseline = true\n',
    'utf8'
  )

  runGit(
    ['add', '.'],
    root
  )

  runGit(
    [
      'commit',
      '-m',
      'Verification baseline'
    ],
    root
  )

  return root
}

function createPackage({
  packageId,
  testCommand
}) {
  return {
    packageId,

    missionId:
      'EOS-MISSION-10.5.4-TEST',

    provider:
      'OpenAI Codex',

    generatedAt:
      '2026-08-15T00:00:00.000Z',

    summary:
      'Verify autonomous engineering quality gate.',

    files: [
      {
        path:
          'backend/src/verification-proof.js',

        action:
          'create',

        language:
          'javascript',

        content:
          'export const verificationProof = true\n',

        reason:
          'Objective 10.5.4 verification proof.'
      }
    ],

    operations: [],

    tests: [
      {
        command:
          testCommand,

        purpose:
          'Verify generated JavaScript.',

        expectedResult:
          'Exit code 0'
      }
    ],

    risks: [
      {
        level:
          'low',

        description:
          'Verification proof is isolated.',

        mitigation:
          'Governed workspace prevents canonical modification.'
      }
    ],

    governance: {
      confidence:
        0.95,

      approvalRequired:
        true,

      approvedForAutonomousExecution:
        false,

      reviewer:
        'Governance Office'
    }
  }
}

console.log(
  'Running Objective 10.5.4 autonomous verification tests...'
)

const repositoryRoot =
  createRepository()

try {
  const passingPackage =
    createPackage({
      packageId:
        'EPS-10.5.4-PASS',

      testCommand:
        'node --check backend/src/verification-proof.js'
    })

  const passingWorkspace =
    applyEngineeringPackageToWorkspace(
      passingPackage,
      {
        repositoryRoot
      }
    )

  assert.equal(
    passingWorkspace.success,
    true
  )

  const passed =
    verifyEngineeringWorkspace({
      engineeringPackage:
        passingPackage,

      workspaceRoot:
        passingWorkspace.workspaceRoot,

      repositoryRoot
    })

  assert.equal(
    passed.success,
    true
  )

  assert.equal(
    passed.verdict,
    'PASS'
  )

  assert.equal(
    passed.status,
    'Verification Passed'
  )

  assert.equal(
    passed.summary.totalTests,
    1
  )

  assert.equal(
    passed.summary.passedTests,
    1
  )

  assert.equal(
    passed.summary.failedTests,
    0
  )

  assert.equal(
    passed.isolation.governed,
    true
  )

  assert.equal(
    passed.isolation.canonicalRepositoryWritable,
    false
  )

  console.log(
    'PASS valid AI-generated workspace receives PASS verdict'
  )

  const failingPackage =
    createPackage({
      packageId:
        'EPS-10.5.4-FAIL',

      testCommand:
        'node --check backend/src/does-not-exist.js'
    })

  const failingWorkspace =
    applyEngineeringPackageToWorkspace(
      failingPackage,
      {
        repositoryRoot
      }
    )

  assert.equal(
    failingWorkspace.success,
    true
  )

  const failed =
    verifyEngineeringWorkspace({
      engineeringPackage:
        failingPackage,

      workspaceRoot:
        failingWorkspace.workspaceRoot,

      repositoryRoot
    })

  assert.equal(
    failed.success,
    false
  )

  assert.equal(
    failed.verdict,
    'FAIL'
  )

  assert.equal(
    failed.status,
    'Verification Failed'
  )

  assert.equal(
    failed.summary.failedTests,
    1
  )

  console.log(
    'PASS failing generated code receives FAIL verdict'
  )

  const noTestsPackage = {
    ...createPackage({
      packageId:
        'EPS-10.5.4-NO-TESTS',

      testCommand:
        'node --version'
    }),

    tests: []
  }

  const noTestsWorkspace =
    applyEngineeringPackageToWorkspace(
      noTestsPackage,
      {
        repositoryRoot
      }
    )

  assert.equal(
    noTestsWorkspace.success,
    true
  )

  const rejected =
    verifyEngineeringWorkspace({
      engineeringPackage:
        noTestsPackage,

      workspaceRoot:
        noTestsWorkspace.workspaceRoot,

      repositoryRoot
    })

  assert.equal(
    rejected.success,
    false
  )

  assert.equal(
    rejected.verdict,
    'REJECTED'
  )

  assert.equal(
    rejected.status,
    'Verification Rejected'
  )

  console.log(
    'PASS package without verification tests is rejected'
  )

  const outsideWorkspace =
    verifyEngineeringWorkspace({
      engineeringPackage:
        passingPackage,

      workspaceRoot:
        repositoryRoot,

      repositoryRoot
    })

  assert.equal(
    outsideWorkspace.success,
    false
  )

  assert.equal(
    outsideWorkspace.verdict,
    'REJECTED'
  )

  console.log(
    'PASS verification outside governed workspace is rejected'
  )

  assert.equal(
    runGit(
      [
        'status',
        '--porcelain',
        '--untracked-files=no'
      ],
      repositoryRoot
    ),
    ''
  )

  console.log(
    'PASS canonical tracked repository remains unchanged'
  )

  console.log(
    'All Objective 10.5.4 autonomous verification tests passed.'
  )
} finally {
  fs.rmSync(
    repositoryRoot,
    {
      recursive: true,
      force: true
    }
  )
}
