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

import {
  createAutonomousCommit
} from '../backend/src/services/autonomous-git-commit-service.js'

import {
  completeMission
} from '../backend/src/services/mission-completion-service.js'

function runGit(
  args,
  cwd
) {
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

function gitOutput(
  args,
  cwd
) {
  const result =
    runGit(
      args,
      cwd
    )

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
    {
      recursive: true
    }
  )

  fs.writeFileSync(
    target,
    content,
    'utf8'
  )
}

function createRepository() {
  const root =
    fs.mkdtempSync(
      path.join(
        os.tmpdir(),
        'eos-10.5.6-'
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
    '.gitignore',
    [
      '/backend/eos/engineering-workspaces/',
      '/backend/eos/evidence/',
      ''
    ].join('\n')
  )

  writeFile(
    root,
    'package.json',
    JSON.stringify(
      {
        name:
          'eos-governed-commit-test',
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
    'backend/src/baseline.js',
    "export const baseline = 'before'\n"
  )

  writeFile(
    root,
    'backend/src/unrelated.js',
    "export const unrelated = true\n"
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
        'Create Objective 10.5.6 fixture'
      ],
      root
    ).status,
    0
  )

  return root
}

function createPackage() {
  return {
    packageId:
      'EOS-ENG-PKG-10.5.6-TEST',

    missionId:
      'EOS-MISSION-10.5.6-TEST',

    provider:
      'EOS Deterministic Test Provider',

    generatedAt:
      new Date().toISOString(),

    summary:
      'Verify governed autonomous commit.',

    files: [
      {
        path:
          'backend/src/baseline.js',

        action:
          'update',

        language:
          'javascript',

        content:
          "export const baseline = 'after'\n",

        reason:
          'Verify governed commit scope.'
      }
    ],

    operations: [
      {
        type:
          'update_file',

        target:
          'backend/src/baseline.js',

        description:
          'Update deterministic fixture.'
      }
    ],

    tests: [
      {
        command:
          'node --check backend/src/baseline.js',

        purpose:
          'Verify generated JavaScript syntax.',

        expectedResult:
          'Exit code 0.'
      }
    ],

    risks: [
      {
        level:
          'low',

        description:
          'Temporary deterministic repository only.',

        mitigation:
          'Repository is deleted after test.'
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
        'EOS Objective 10.5.6 Test'
    }
  }
}

function approval() {
  return {
    decision:
      'Approved',

    reviewer:
      'EOS Test Executive',

    reviewedAt:
      new Date().toISOString()
  }
}

console.log(
  'Running Objective 10.5.6 governed autonomous Git commit tests...'
)

const repositoryRoot =
  createRepository()

try {
  const mission = {
    id:
      'EOS-MISSION-10.5.6-TEST',
    sprint:
      'Sprint 10.5'
  }

  const engineeringPackage =
    createPackage()

  const headBefore =
    gitOutput(
      ['rev-parse', 'HEAD'],
      repositoryRoot
    )

  const branchBefore =
    gitOutput(
      ['branch', '--show-current'],
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
      engineeringPackage,
      {
        repositoryRoot
      }
    )

  assert.equal(
    workspace.success,
    true
  )

  const verification =
    verifyEngineeringWorkspace({
      engineeringPackage,
      workspaceRoot:
        workspace.workspaceRoot,
      repositoryRoot
    })

  assert.equal(
    verification.verdict,
    'PASS'
  )

  const promotion =
    promoteWorkspaceFiles({
      governanceReview:
        approval(),

      verification,

      workspaceRoot:
        workspace.workspaceRoot,

      files: [
        {
          path:
            'backend/src/baseline.js',
          repositoryPath:
            'backend/src/baseline.js',
          action:
            'update'
        }
      ],

      repositoryRoot,

      execute:
        true
    })

  assert.equal(
    promotion.success,
    true
  )

  assert.equal(
    promotion.promotionExecuted,
    true
  )

  assert.equal(
    promotion.commitExecuted,
    false
  )

  console.log(
    'PASS verified and approved promoted change prepared for commit'
  )

  const withoutApproval =
    createAutonomousCommit({
      governanceReview: {
        decision:
          'Human Review Required'
      },

      verification,
      promotion,

      files: [
        'backend/src/baseline.js'
      ],

      message:
        'Complete Objective 10.5.6 test',

      expectedHead:
        headBefore,

      expectedBranch:
        branchBefore,

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
    'PASS commit rejected without governance approval'
  )

  const withoutVerification =
    createAutonomousCommit({
      governanceReview:
        approval(),

      verification: {
        ...verification,
        success:
          false,
        verdict:
          'FAIL'
      },

      promotion,

      files: [
        'backend/src/baseline.js'
      ],

      message:
        'Complete Objective 10.5.6 test',

      expectedHead:
        headBefore,

      expectedBranch:
        branchBefore,

      repositoryRoot,

      execute:
        true
    })

  assert.equal(
    withoutVerification.success,
    false
  )

  assert.match(
    withoutVerification.reason,
    /verification PASS/i
  )

  console.log(
    'PASS commit rejected without autonomous verification PASS'
  )

  const wrongScope =
    createAutonomousCommit({
      governanceReview:
        approval(),

      verification,
      promotion,

      files: [
        'backend/src/unrelated.js'
      ],

      message:
        'Complete Objective 10.5.6 test',

      expectedHead:
        headBefore,

      expectedBranch:
        branchBefore,

      repositoryRoot,

      execute:
        true
    })

  assert.equal(
    wrongScope.success,
    false
  )

  assert.match(
    wrongScope.reason,
    /Promotion file set/u
  )

  console.log(
    'PASS commit rejected when approved scope differs from promoted scope'
  )

  const staleHead =
    createAutonomousCommit({
      governanceReview:
        approval(),

      verification,
      promotion,

      files: [
        'backend/src/baseline.js'
      ],

      message:
        'Complete Objective 10.5.6 test',

      expectedHead:
        '0000000000000000000000000000000000000000',

      expectedBranch:
        branchBefore,

      repositoryRoot,

      execute:
        true
    })

  assert.equal(
    staleHead.success,
    false
  )

  assert.match(
    staleHead.reason,
    /HEAD mismatch/u
  )

  console.log(
    'PASS commit rejected when expected HEAD does not match'
  )

  const simulation =
    createAutonomousCommit({
      governanceReview:
        approval(),

      verification,
      promotion,

      files: [
        'backend/src/baseline.js'
      ],

      message:
        'Complete Objective 10.5.6 test',

      expectedHead:
        headBefore,

      expectedBranch:
        branchBefore,

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
    'Simulation'
  )

  assert.equal(
    simulation.commitExecuted,
    false
  )

  assert.equal(
    gitOutput(
      ['rev-parse', 'HEAD'],
      repositoryRoot
    ),
    headBefore
  )

  console.log(
    'PASS commit simulation leaves Git HEAD unchanged'
  )

  const commit =
    createAutonomousCommit({
      governanceReview:
        approval(),

      verification,
      promotion,

      files: [
        'backend/src/baseline.js'
      ],

      message:
        'Complete Objective 10.5.6 governed commit test',

      expectedHead:
        headBefore,

      expectedBranch:
        branchBefore,

      repositoryRoot,

      execute:
        true
    })

  assert.equal(
    commit.success,
    true
  )

  assert.equal(
    commit.status,
    'Committed'
  )

  assert.equal(
    commit.commitExecuted,
    true
  )

  assert.equal(
    commit.pushExecuted,
    false
  )

  assert.notEqual(
    commit.commit,
    headBefore
  )

  assert.deepEqual(
    commit.committedFiles,
    [
      'backend/src/baseline.js'
    ]
  )

  console.log(
    'PASS exact promoted file committed under governed scope'
  )

  console.log(
    'PASS autonomous commit advanced HEAD exactly once'
  )

  console.log(
    'PASS autonomous commit did not push'
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

  console.log(
    'PASS unrelated canonical source remained unchanged'
  )

  assert.equal(
    gitOutput(
      [
        'diff',
        '--cached',
        '--name-only'
      ],
      repositoryRoot
    ),
    ''
  )

  console.log(
    'PASS Git staging area clean after governed commit'
  )

  const completion =
    completeMission({
      mission,
      engineeringPackage,
      governanceReview:
        approval(),
      verification,
      promotion,
      gitCommit:
        commit
    })

  assert.equal(
    completion.success,
    true
  )

  assert.equal(
    completion.status,
    'Mission Complete'
  )

  assert.equal(
    completion.commit,
    commit.commit
  )

  assert.deepEqual(
    completion.committedFiles,
    [
      'backend/src/baseline.js'
    ]
  )

  assert.equal(
    completion.engineeringSummary.pushed,
    false
  )

  console.log(
    'PASS mission completed only after successful governed commit'
  )

  const incompleteMission =
    completeMission({
      mission,
      engineeringPackage,
      governanceReview:
        approval(),
      verification,
      promotion,
      gitCommit: {
        ...commit,
        success:
          false,
        status:
          'Commit Failed',
        commitExecuted:
          false
      }
    })

  assert.equal(
    incompleteMission.success,
    false
  )

  assert.equal(
    incompleteMission.status,
    'Mission Incomplete'
  )

  console.log(
    'PASS mission remains incomplete when commit fails'
  )

  const createOnlyHeadBefore =
    gitOutput(
      ['rev-parse', 'HEAD'],
      repositoryRoot
    )

  const createOnlyBranch =
    gitOutput(
      ['branch', '--show-current'],
      repositoryRoot
    )

  const createOnlyPackage = {
    ...createPackage(),

    packageId:
      'EOS-ENG-PKG-10.5.6-CREATE',

    missionId:
      'EOS-MISSION-10.5.6-CREATE',

    summary:
      'Verify governed autonomous commit of a newly created file.',

    files: [
      {
        path:
          'backend/src/newly-created-proof.js',

        action:
          'create',

        language:
          'javascript',

        content:
          'export const newlyCreatedProof = true\n',

        reason:
          'Verify create-file commit scope.'
      }
    ],

    operations: [
      {
        type:
          'create_file',

        target:
          'backend/src/newly-created-proof.js',

        description:
          'Create deterministic commit proof.'
      }
    ],

    tests: [
      {
        command:
          'node --check backend/src/newly-created-proof.js',

        purpose:
          'Verify newly created JavaScript syntax.',

        expectedResult:
          'Exit code 0.'
      }
    ]
  }

  const createOnlyWorkspace =
    applyEngineeringPackageToWorkspace(
      createOnlyPackage,
      {
        repositoryRoot
      }
    )

  assert.equal(
    createOnlyWorkspace.success,
    true
  )

  const createOnlyVerification =
    verifyEngineeringWorkspace({
      engineeringPackage:
        createOnlyPackage,

      workspaceRoot:
        createOnlyWorkspace.workspaceRoot,

      repositoryRoot
    })

  assert.equal(
    createOnlyVerification.verdict,
    'PASS'
  )

  const createOnlyPromotion =
    promoteWorkspaceFiles({
      governanceReview:
        approval(),

      verification:
        createOnlyVerification,

      workspaceRoot:
        createOnlyWorkspace.workspaceRoot,

      files: [
        {
          path:
            'backend/src/newly-created-proof.js',

          repositoryPath:
            'backend/src/newly-created-proof.js',

          action:
            'create'
        }
      ],

      repositoryRoot,

      execute:
        true
    })

  assert.equal(
    createOnlyPromotion.success,
    true
  )

  assert.equal(
    fs.existsSync(
      path.join(
        repositoryRoot,
        'backend/src/newly-created-proof.js'
      )
    ),
    true
  )

  const createOnlyCommit =
    createAutonomousCommit({
      governanceReview:
        approval(),

      verification:
        createOnlyVerification,

      promotion:
        createOnlyPromotion,

      files: [
        'backend/src/newly-created-proof.js'
      ],

      message:
        'Verify governed create-file autonomous commit',

      expectedHead:
        createOnlyHeadBefore,

      expectedBranch:
        createOnlyBranch,

      repositoryRoot,

      execute:
        true
    })

  assert.equal(
    createOnlyCommit.success,
    true
  )

  assert.equal(
    createOnlyCommit.status,
    'Committed'
  )

  assert.equal(
    createOnlyCommit.commitExecuted,
    true
  )

  assert.equal(
    createOnlyCommit.pushExecuted,
    false
  )

  assert.deepEqual(
    createOnlyCommit.committedFiles,
    [
      'backend/src/newly-created-proof.js'
    ]
  )

  assert.notEqual(
    createOnlyCommit.commit,
    createOnlyHeadBefore
  )

  console.log(
    'PASS newly created promoted file commits under exact governed scope'
  )

  const unexpectedFile =
    path.join(
      repositoryRoot,
      'backend/src/unexpected-untracked.js'
    )

  fs.writeFileSync(
    unexpectedFile,
    'export const unexpected = true\n',
    'utf8'
  )

  const extraScopeAttempt =
    createAutonomousCommit({
      governanceReview:
        approval(),

      verification:
        createOnlyVerification,

      promotion: {
        ...createOnlyPromotion,

        provenance: {
          ...createOnlyPromotion.provenance,

          canonicalCommit:
            createOnlyCommit.commit
        }
      },

      files: [
        'backend/src/newly-created-proof.js'
      ],

      message:
        'This commit must be rejected',

      expectedHead:
        createOnlyCommit.commit,

      expectedBranch:
        createOnlyBranch,

      repositoryRoot,

      execute:
        true
    })

  assert.equal(
    extraScopeAttempt.success,
    false
  )

  assert.match(
    extraScopeAttempt.reason,
    /Canonical worktree/u
  )

  fs.rmSync(
    unexpectedFile,
    {
      force: true
    }
  )

  console.log(
    'PASS unexpected untracked canonical file blocks autonomous commit'
  )

  console.log(
    'All Objective 10.5.6 governed autonomous Git commit tests passed.'
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
