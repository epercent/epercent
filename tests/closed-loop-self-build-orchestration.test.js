import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

import {
  runAutonomousEngineeringRuntime
} from '../backend/src/services/autonomous-engineering-runtime-service.js'

function runGit(
  args,
  cwd
) {
  const result =
    spawnSync(
      'git',
      args,
      {
        cwd,
        encoding:
          'utf8',
        maxBuffer:
          1024 * 1024
      }
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
      recursive:
        true
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
        'eos-10.5.7-'
      )
    )

  runGit(
    ['init', '-b', 'main'],
    root
  )

  runGit(
    [
      'config',
      'user.email',
      'eos-runtime-test@example.invalid'
    ],
    root
  )

  runGit(
    [
      'config',
      'user.name',
      'EOS Runtime Test'
    ],
    root
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
          'eos-closed-loop-runtime-test',
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
    'export const baseline = true\n'
  )

  writeFile(
    root,
    'backend/src/unrelated.js',
    'export const unrelated = true\n'
  )

  runGit(
    ['add', '.'],
    root
  )

  runGit(
    [
      'commit',
      '-m',
      'Create Objective 10.5.7 fixture'
    ],
    root
  )

  return root
}

function mission() {
  return {
    id:
      'EOS-MISSION-10.5.7-TEST',

    sprint:
      'Sprint 10.5',

    mission: {
      objective:
        'Create one governed deterministic proof file.',

      rationale:
        'Verify closed-loop EOS self-build orchestration.',

      priority:
        'Critical',

      assignedOffice:
        'AI Engineering Office',

      assignedAgent:
        'Hermes'
    },

    execution: {
      provider:
        'EOS Deterministic Provider',

      mode:
        'Human Approved',

      autonomousReady:
        false
    },

    requiredCapabilities: [
      'AI Code Generation',
      'Governed Workspace',
      'Autonomous Verification',
      'Governance',
      'Promotion',
      'Git Commit',
      'Mission Completion'
    ],

    affectedAreas: [
      'backend/src/closed-loop-proof.js'
    ],

    acceptanceCriteria: [
      'Exactly one file is created',
      'Verification returns PASS',
      'Governance approval is required',
      'Exact file scope is promoted',
      'Exact file scope is committed',
      'Mission completes',
      'No push occurs'
    ]
  }
}

function engineeringPackage() {
  return {
    packageId:
      'EOS-ENG-PKG-10.5.7-TEST',

    missionId:
      'EOS-MISSION-10.5.7-TEST',

    provider:
      'EOS Deterministic Provider',

    generatedAt:
      new Date().toISOString(),

    summary:
      'Create deterministic closed-loop proof.',

    files: [
      {
        path:
          'backend/src/closed-loop-proof.js',

        action:
          'create',

        language:
          'javascript',

        content:
          'export const closedLoopSelfBuild = true\n',

        reason:
          'Verify Objective 10.5.7 orchestration.'
      }
    ],

    operations: [
      {
        type:
          'create_file',

        target:
          'backend/src/closed-loop-proof.js',

        description:
          'Create deterministic closed-loop proof.'
      }
    ],

    tests: [
      {
        command:
          'node --check backend/src/closed-loop-proof.js',

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
          'Temporary repository removed after test.'
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
        'Objective 10.5.7 Test'
    }
  }
}

function deterministicProvider({
  invalidCode = false
} = {}) {
  return {
    id:
      'AI-PROVIDER-DETERMINISTIC-10.5.7',

    name:
      'EOS Deterministic Provider',

    health() {
      return {
        status:
          'Operational'
      }
    },

    async submitMission(
      submittedMission
    ) {
      const pkg =
        engineeringPackage()

      if (invalidCode) {
        pkg.files[0].content =
          'export const broken = \n'
      }

      return {
        dispatched:
          true,

        status:
          'Completed',

        provider:
          this.name,

        providerId:
          this.id,

        responseId:
          'EOS-TEST-RESPONSE-10.5.7',

        model:
          'deterministic-test',

        artifact:
          JSON.stringify(pkg),

        missionId:
          submittedMission
            ?.id ??
          null
      }
    }
  }
}

function approval() {
  return {
    decision:
      'Approved',

    reviewer:
      'Objective 10.5.7 Human Approval',

    reviewedAt:
      new Date().toISOString(),

    missionId:
      'EOS-MISSION-10.5.7-TEST',

    packageId:
      'EOS-ENG-PKG-10.5.7-TEST'
  }
}

console.log(
  'Running Objective 10.5.7 closed-loop self-build orchestration tests...'
)

const repositoryRoot =
  createRepository()

try {
  const headBefore =
    runGit(
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

  const awaitingApproval =
    await runAutonomousEngineeringRuntime({
      mission:
        mission(),

      provider:
        deterministicProvider(),

      providerName:
        'DETERMINISTIC',

      repositoryRoot,

      executePromotion:
        true,

      executeCommit:
        true
    })

  assert.equal(
    awaitingApproval.success,
    true
  )

  assert.equal(
    awaitingApproval.status,
    'Awaiting Human Approval'
  )

  assert.equal(
    runGit(
      ['rev-parse', 'HEAD'],
      repositoryRoot
    ),
    headBefore
  )

  assert.equal(
    fs.existsSync(
      path.join(
        repositoryRoot,
        'backend/src/closed-loop-proof.js'
      )
    ),
    false
  )

  console.log(
    'PASS closed-loop runtime stops at human approval gate'
  )

  let resumeProviderCalled =
    false

  const forbiddenResumeProvider = {
    id:
      'AI-PROVIDER-MUST-NOT-BE-CALLED',

    name:
      'Forbidden Resume Provider',

    async submitMission() {
      resumeProviderCalled =
        true

      throw new Error(
        'AI provider must not be called during governed runtime resume.'
      )
    }
  }

  const resumedPromotionSimulation =
    await runAutonomousEngineeringRuntime({
      mission:
        mission(),

      provider:
        forbiddenResumeProvider,

      providerName:
        'DETERMINISTIC',

      repositoryRoot,

      governanceApproval:
        approval(),

      resumeFrom:
        awaitingApproval,

      executePromotion:
        false,

      executeCommit:
        false,

      generateNextMission:
        false
    })

  assert.equal(
    resumeProviderCalled,
    false
  )

  assert.equal(
    resumedPromotionSimulation.success,
    true
  )

  assert.equal(
    resumedPromotionSimulation.status,
    'Promotion Simulation Complete'
  )

  assert.equal(
    resumedPromotionSimulation
      .engineeringPackage
      .packageId,
    awaitingApproval
      .engineeringPackage
      .packageId
  )

  assert.equal(
    resumedPromotionSimulation
      .verification
      .packageId,
    awaitingApproval
      .verification
      .packageId
  )

  assert.equal(
    resumedPromotionSimulation
      .auditTrail
      .some(
        event =>
          event.stage ===
            'Runtime Resume' &&
          event.status ===
            'PASS'
      ),
    true
  )

  assert.equal(
    runGit(
      ['rev-parse', 'HEAD'],
      repositoryRoot
    ),
    headBefore
  )

  console.log(
    'PASS approved runtime resumes exact verified package without regenerating'
  )

  const gitDependentProvider = {
    ...deterministicProvider(),

    async submitMission(
      submittedMission
    ) {
      const pkg =
        engineeringPackage()

      pkg.tests = [
        {
          command:
            'git status --short',

          purpose:
            'This deliberately invalid test depends on Git metadata.',

          expectedResult:
            'Must be rejected before governed verification.'
        }
      ]

      return {
        dispatched:
          true,

        status:
          'Completed',

        provider:
          this.name,

        providerId:
          this.id,

        responseId:
          'EOS-TEST-RESPONSE-10.5.7-GIT-POLICY',

        model:
          'deterministic-test',

        artifact:
          JSON.stringify(pkg),

        missionId:
          submittedMission
            ?.id ??
          null
      }
    }
  }

  const verificationPolicyRejection =
    await runAutonomousEngineeringRuntime({
      mission:
        mission(),

      provider:
        gitDependentProvider,

      providerName:
        'DETERMINISTIC',

      repositoryRoot,

      governanceApproval:
        approval(),

      executePromotion:
        true,

      executeCommit:
        true
    })

  assert.equal(
    verificationPolicyRejection.success,
    false
  )

  assert.equal(
    verificationPolicyRejection.status,
    'Engineering Package Verification Policy Rejected'
  )

  assert.equal(
    verificationPolicyRejection.verification,
    null
  )

  assert.equal(
    verificationPolicyRejection.promotion,
    null
  )

  assert.equal(
    verificationPolicyRejection.gitCommit,
    null
  )

  assert.equal(
    verificationPolicyRejection
      .verificationPolicy
      .valid,
    false
  )

  assert.match(
    verificationPolicyRejection
      .verificationPolicy
      .violations[0],
    /Git metadata/u
  )

  assert.equal(
    runGit(
      ['rev-parse', 'HEAD'],
      repositoryRoot
    ),
    headBefore
  )

  console.log(
    'PASS Git-dependent verification command rejected before execution'
  )

  const verificationFailure =
    await runAutonomousEngineeringRuntime({
      mission:
        mission(),

      provider:
        deterministicProvider({
          invalidCode:
            true
        }),

      providerName:
        'DETERMINISTIC',

      repositoryRoot,

      governanceApproval:
        approval(),

      executePromotion:
        true,

      executeCommit:
        true
    })

  assert.equal(
    verificationFailure.success,
    false
  )

  assert.equal(
    verificationFailure.status,
    'Autonomous Verification Failed'
  )

  assert.equal(
    verificationFailure.promotion,
    null
  )

  assert.equal(
    verificationFailure.gitCommit,
    null
  )

  assert.equal(
    runGit(
      ['rev-parse', 'HEAD'],
      repositoryRoot
    ),
    headBefore
  )

  console.log(
    'PASS verification failure stops orchestration before promotion'
  )

  const promotionSimulation =
    await runAutonomousEngineeringRuntime({
      mission:
        mission(),

      provider:
        deterministicProvider(),

      providerName:
        'DETERMINISTIC',

      repositoryRoot,

      governanceApproval:
        approval(),

      executePromotion:
        false,

      executeCommit:
        false
    })

  assert.equal(
    promotionSimulation.success,
    true
  )

  assert.equal(
    promotionSimulation.status,
    'Promotion Simulation Complete'
  )

  assert.equal(
    promotionSimulation
      .promotion
      .promotionExecuted,
    false
  )

  assert.equal(
    runGit(
      ['rev-parse', 'HEAD'],
      repositoryRoot
    ),
    headBefore
  )

  console.log(
    'PASS promotion simulation stops before canonical modification'
  )

  const completed =
    await runAutonomousEngineeringRuntime({
      mission:
        mission(),

      provider:
        deterministicProvider(),

      providerName:
        'DETERMINISTIC',

      repositoryRoot,

      governanceApproval:
        approval(),

      commitMessage:
        'Complete Objective 10.5.7 deterministic closed loop',

      executePromotion:
        true,

      executeCommit:
        true,

      generateNextMission:
        true
    })

  if (!completed.success) {
    console.error(
      JSON.stringify(
        completed,
        null,
        2
      )
    )
  }

  assert.equal(
    completed.success,
    true
  )

  assert.equal(
    completed.status,
    'Engineering Cycle Complete'
  )

  assert.equal(
    completed.verification.verdict,
    'PASS'
  )

  assert.equal(
    completed.governance.decision,
    'Approved'
  )

  assert.equal(
    completed.promotion.status,
    'Files Promoted'
  )

  assert.equal(
    completed.gitCommit.status,
    'Committed'
  )

  assert.equal(
    completed.gitCommit.pushExecuted,
    false
  )

  assert.equal(
    completed.completion.status,
    'Mission Complete'
  )

  assert.equal(
    completed.nextMission.status,
    'Mission Generated'
  )

  assert.equal(
    completed
      .nextMission
      .mission
      .predecessorCommit,
    completed.gitCommit.commit
  )

  assert.notEqual(
    completed.gitCommit.commit,
    headBefore
  )

  assert.deepEqual(
    completed.gitCommit.committedFiles,
    [
      'backend/src/closed-loop-proof.js'
    ]
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
    runGit(
      [
        'status',
        '--porcelain',
        '--untracked-files=all'
      ],
      repositoryRoot
    ),
    ''
  )

  console.log(
    'PASS one runtime transaction completed generation through mission completion'
  )

  console.log(
    'PASS exact governed file scope promoted and committed'
  )

  console.log(
    'PASS autonomous push remained disabled'
  )

  console.log(
    'PASS next engineering mission generated from completion evidence'
  )

  assert.equal(
    Array.isArray(
      completed.auditTrail
    ),
    true
  )

  const requiredStages = [
    'Mission Intake',
    'AI Code Generation',
    'Verification Policy',
    'Autonomous Verification',
    'Governance',
    'Governed Promotion',
    'Governed Git Commit',
    'Mission Completion',
    'Next Mission Generation'
  ]

  for (
    const stage of requiredStages
  ) {
    assert.equal(
      completed.auditTrail.some(
        event =>
          event.stage === stage &&
          event.status === 'PASS'
      ),
      true,
      `Missing PASS audit event: ${stage}`
    )
  }

  console.log(
    'PASS complete machine-readable audit trail recorded'
  )

  assert.equal(
    completed
      .runtimeEvidence
      .written,
    true
  )

  assert.equal(
    fs.existsSync(
      completed
        .runtimeEvidence
        .filePath
    ),
    true
  )

  const persistedEvidence =
    JSON.parse(
      fs.readFileSync(
        completed
          .runtimeEvidence
          .filePath,
        'utf8'
      )
    )

  assert.equal(
    persistedEvidence.objective,
    '10.5.7'
  )

  assert.equal(
    persistedEvidence.status,
    'Engineering Cycle Complete'
  )

  assert.equal(
    persistedEvidence.gitCommit.pushExecuted,
    false
  )

  assert.equal(
    persistedEvidence.missionCompletion.status,
    'Mission Complete'
  )

  console.log(
    'PASS runtime evidence persisted outside canonical source control'
  )

  console.log(
    'All Objective 10.5.7 closed-loop self-build orchestration tests passed.'
  )
} finally {
  fs.rmSync(
    repositoryRoot,
    {
      recursive:
        true,
      force:
        true
    }
  )
}
