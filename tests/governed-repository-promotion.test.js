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

import {
  promoteWorkspaceFiles
} from '../backend/src/services/governed-repository-promotion-service.js'

function runGit(
  args,
  cwd,
  options = {}
) {
  return spawnSync(
    'git',
    args,
    {
      cwd,
      encoding: 'utf8',
      ...options
    }
  )
}

function gitOutput(
  args,
  cwd
) {
  const result =
    runGit(args, cwd)

  assert.equal(
    result.status,
    0,
    result.stderr
  )

  return result.stdout.trim()
}

function writeFile(
  root,
  relativePath,
  content
) {
  const target =
    path.join(
      root,
      relativePath
    )

  fs.mkdirSync(
    path.dirname(target),
    { recursive: true }
  )

  fs.writeFileSync(
    target,
    content,
    'utf8'
  )
}

function createTemporaryRepository() {
  const root =
    fs.mkdtempSync(
      path.join(
        os.tmpdir(),
        'eos-10.5.5-repo-'
      )
    )

  assert.equal(
    runGit(
      ['init', '-b', 'main'],
      root
    ).status,
    0
  )

  assert.equal(
    runGit(
      [
        'config',
        'user.email',
        'eos-test@example.invalid'
      ],
      root
    ).status,
    0
  )

  assert.equal(
    runGit(
      [
        'config',
        'user.name',
        'EOS Test'
      ],
      root
    ).status,
    0
  )

  writeFile(
    root,
    'package.json',
    JSON.stringify(
      {
        name:
          'eos-governed-promotion-test',
        version:
          '1.0.0',
        type:
          'module'
      },
      null,
      2
    ) + '\n'
  )

  writeFile(
    root,
    '.gitignore',
    [
      '# EOS autonomous engineering execution workspaces',
      '/backend/eos/engineering-workspaces/',
      '/backend/eos/evidence/',
      ''
    ].join('\n')
  )

  writeFile(
    root,
    'backend/src/existing.js',
    "export const value = 'before'\n"
  )

  writeFile(
    root,
    'backend/src/unrelated.js',
    "export const unrelated = 'untouched'\n"
  )

  writeFile(
    root,
    'backend/src/delete-me.js',
    "export const removeMe = true\n"
  )

  assert.equal(
    runGit(
      ['add', '.'],
      root
    ).status,
    0
  )

  assert.equal(
    runGit(
      [
        'commit',
        '-m',
        'Initial governed promotion fixture'
      ],
      root
    ).status,
    0
  )

  return root
}

function buildPackage() {
  return {
    packageId:
      'EOS-ENG-PKG-10.5.5-TEST',
    missionId:
      'EOS-10.5.5-TEST',
    provider:
      'EOS Deterministic Test Provider',
    generatedAt:
      new Date().toISOString(),
    summary:
      'Exercise governed repository promotion.',
    files: [
      {
        path:
          'backend/src/existing.js',
        action:
          'update',
        language:
          'javascript',
        content:
          "export const value = 'after'\n",
        reason:
          'Test governed update promotion.'
      },
      {
        path:
          'backend/src/promoted.js',
        action:
          'create',
        language:
          'javascript',
        content:
          "export const promoted = true\n",
        reason:
          'Test governed create promotion.'
      },
      {
        path:
          'backend/src/delete-me.js',
        action:
          'delete',
        language:
          'javascript',
        content:
          '',
        reason:
          'Test governed delete promotion.'
      }
    ],
    operations: [
      {
        type:
          'update_file',
        target:
          'backend/src/existing.js',
        description:
          'Update fixture.'
      },
      {
        type:
          'create_file',
        target:
          'backend/src/promoted.js',
        description:
          'Create fixture.'
      },
      {
        type:
          'delete_file',
        target:
          'backend/src/delete-me.js',
        description:
          'Delete fixture.'
      }
    ],
    tests: [
      {
        command:
          "node --check backend/src/existing.js",
        purpose:
          'Verify updated source syntax.',
        expectedResult:
          'Command exits with status 0.'
      },
      {
        command:
          "node --check backend/src/promoted.js",
        purpose:
          'Verify created source syntax.',
        expectedResult:
          'Command exits with status 0.'
      }
    ],
    risks: [
      {
        level:
          'low',
        description:
          'Deterministic isolated test repository only.',
        mitigation:
          'Temporary repository is removed after test.'
      }
    ],
    governance: {
      confidence:
        1,
      approvalRequired:
        true,
      approvedForAutonomousExecution:
        false,
      reviewer:
        'EOS Objective 10.5.5 Test'
    }
  }
}

function approvedGovernance() {
  return {
    decision:
      'Approved',
    reviewer:
      'EOS Test Executive',
    reviewedAt:
      new Date().toISOString()
  }
}

function repositoryFiles(pkg) {
  return pkg.files.map(file => ({
    path:
      file.path,
    repositoryPath:
      file.path,
    action:
      file.action
  }))
}

console.log(
  'Running Objective 10.5.5 governed repository promotion tests...'
)

const canonicalCwd =
  process.cwd()

const repositoryRoot =
  createTemporaryRepository()

let workspaceRoot = null

try {
  process.chdir(
    repositoryRoot
  )

  const packageDefinition =
    buildPackage()

  const headBefore =
    gitOutput(
      ['rev-parse', 'HEAD'],
      repositoryRoot
    )

  const unrelatedBefore =
    fs.readFileSync(
      path.join(
        repositoryRoot,
        'backend/src/unrelated.js'
      ),
      'utf8'
    )

  const workspace =
    applyEngineeringPackageToWorkspace(
      packageDefinition,
      {
        repositoryRoot
      }
    )

  assert.equal(
    workspace.success,
    true
  )

  workspaceRoot =
    workspace.workspaceRoot

  const verification =
    verifyEngineeringWorkspace({
      engineeringPackage:
        packageDefinition,
      workspaceRoot:
        workspace.workspaceRoot,
      repositoryRoot
    })

  assert.equal(
    verification.verdict,
    'PASS'
  )

  console.log(
    'PASS verified governed workspace prepared for promotion'
  )

  const withoutApproval =
    promoteWorkspaceFiles({
      governanceReview: {
        decision:
          'Human Review Required'
      },
      verification,
      workspaceRoot:
        workspace.workspaceRoot,
      files:
        repositoryFiles(
          packageDefinition
        ),
      repositoryRoot,
      execute:
        true
    })

  assert.equal(
    withoutApproval.success,
    false
  )

  assert.match(
    withoutApproval.reason,
    /Governance approval required/u
  )

  console.log(
    'PASS promotion rejected without explicit governance approval'
  )

  const failedVerification =
    promoteWorkspaceFiles({
      governanceReview:
        approvedGovernance(),
      verification: {
        ...verification,
        success:
          false,
        verdict:
          'FAIL'
      },
      workspaceRoot:
        workspace.workspaceRoot,
      files:
        repositoryFiles(
          packageDefinition
        ),
      repositoryRoot,
      execute:
        true
    })

  assert.equal(
    failedVerification.success,
    false
  )

  assert.match(
    failedVerification.reason,
    /verification must return PASS/i
  )

  console.log(
    'PASS promotion rejected without autonomous verification PASS'
  )

  const simulation =
    promoteWorkspaceFiles({
      governanceReview:
        approvedGovernance(),
      verification,
      workspaceRoot:
        workspace.workspaceRoot,
      files:
        repositoryFiles(
          packageDefinition
        ),
      repositoryRoot,
      execute:
        false
    })

  assert.equal(
    simulation.success,
    true
  )

  assert.equal(
    simulation.status,
    'Promotion Simulation'
  )

  assert.equal(
    simulation.promotionExecuted,
    false
  )

  const simulationTrackedDiff =
    runGit(
      [
        'diff',
        '--quiet',
        'HEAD',
        '--'
      ],
      repositoryRoot
    )

  assert.equal(
    simulationTrackedDiff.status,
    0,
    'Promotion simulation must not modify canonical tracked files.'
  )

  assert.equal(
    gitOutput(
      ['rev-parse', 'HEAD'],
      repositoryRoot
    ),
    headBefore
  )

  assert.equal(
    fs.readFileSync(
      path.join(
        repositoryRoot,
        'backend/src/existing.js'
      ),
      'utf8'
    ),
    "export const value = 'before'\n"
  )

  assert.equal(
    fs.existsSync(
      path.join(
        repositoryRoot,
        'backend/src/promoted.js'
      )
    ),
    false
  )

  assert.equal(
    fs.existsSync(
      path.join(
        repositoryRoot,
        'backend/src/delete-me.js'
      )
    ),
    true
  )

  console.log(
    'PASS promotion simulation leaves canonical tracked repository unchanged'
  )

  const promotion =
    promoteWorkspaceFiles({
      governanceReview:
        approvedGovernance(),
      verification,
      workspaceRoot:
        workspace.workspaceRoot,
      files:
        repositoryFiles(
          packageDefinition
        ),
      repositoryRoot,
      execute:
        true
    })

  assert.equal(
    promotion.success,
    true
  )

  assert.equal(
    promotion.status,
    'Files Promoted'
  )

  assert.equal(
    promotion.promotionExecuted,
    true
  )

  assert.equal(
    promotion.commitExecuted,
    false
  )

  assert.equal(
    fs.readFileSync(
      path.join(
        repositoryRoot,
        'backend/src/existing.js'
      ),
      'utf8'
    ),
    "export const value = 'after'\n"
  )

  assert.equal(
    fs.readFileSync(
      path.join(
        repositoryRoot,
        'backend/src/promoted.js'
      ),
      'utf8'
    ),
    "export const promoted = true\n"
  )

  assert.equal(
    fs.existsSync(
      path.join(
        repositoryRoot,
        'backend/src/delete-me.js'
      )
    ),
    false
  )

  assert.equal(
    fs.readFileSync(
      path.join(
        repositoryRoot,
        'backend/src/unrelated.js'
      ),
      'utf8'
    ),
    unrelatedBefore
  )

  assert.equal(
    gitOutput(
      ['rev-parse', 'HEAD'],
      repositoryRoot
    ),
    headBefore
  )

  console.log(
    'PASS exact approved file set promoted without Git commit'
  )

  console.log(
    'PASS unrelated canonical repository file remained unchanged'
  )

  console.log(
    'PASS canonical Git HEAD remained unchanged after promotion'
  )

  assert.equal(
    runGit(
      [
        'reset',
        '--hard',
        'HEAD'
      ],
      repositoryRoot
    ).status,
    0
  )

  assert.equal(
    runGit(
      ['clean', '-fd'],
      repositoryRoot
    ).status,
    0
  )

  const stalePackage =
    buildPackage()

  stalePackage.packageId =
    'EOS-ENG-PKG-10.5.5-STALE'

  stalePackage.missionId =
    'EOS-10.5.5-STALE'

  const staleWorkspace =
    applyEngineeringPackageToWorkspace(
      stalePackage,
      {
        repositoryRoot
      }
    )

  assert.equal(
    staleWorkspace.success,
    true
  )

  const staleVerification =
    verifyEngineeringWorkspace({
      engineeringPackage:
        stalePackage,
      workspaceRoot:
        staleWorkspace.workspaceRoot,
      repositoryRoot
    })

  assert.equal(
    staleVerification.verdict,
    'PASS'
  )

  writeFile(
    repositoryRoot,
    'repository-advance.txt',
    'advance canonical source\n'
  )

  assert.equal(
    runGit(
      [
        'add',
        'repository-advance.txt'
      ],
      repositoryRoot
    ).status,
    0
  )

  assert.equal(
    runGit(
      [
        'commit',
        '-m',
        'Advance canonical source'
      ],
      repositoryRoot
    ).status,
    0
  )

  const stalePromotion =
    promoteWorkspaceFiles({
      governanceReview:
        approvedGovernance(),
      verification:
        staleVerification,
      workspaceRoot:
        staleWorkspace.workspaceRoot,
      files:
        repositoryFiles(
          stalePackage
        ),
      repositoryRoot,
      execute:
        true
    })

  assert.equal(
    stalePromotion.success,
    false
  )

  assert.match(
    stalePromotion.reason,
    /HEAD changed after workspace creation/u
  )

  console.log(
    'PASS stale workspace rejected when canonical HEAD changed'
  )

  const traversalPromotion =
    promoteWorkspaceFiles({
      governanceReview:
        approvedGovernance(),
      verification:
        staleVerification,
      workspaceRoot:
        staleWorkspace.workspaceRoot,
      files: [
        {
          path:
            '../escape.js',
          action:
            'create'
        }
      ],
      repositoryRoot,
      execute:
        false
    })

  assert.equal(
    traversalPromotion.success,
    false
  )

  console.log(
    'PASS unsafe promotion path rejected'
  )

  console.log(
    'All Objective 10.5.5 governed repository promotion tests passed.'
  )
} finally {
  process.chdir(
    canonicalCwd
  )

  fs.rmSync(
    repositoryRoot,
    {
      recursive: true,
      force: true
    }
  )
}
