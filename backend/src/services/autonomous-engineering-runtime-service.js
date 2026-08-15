import fs from 'node:fs'
import path from 'node:path'

import {
  generateAICodeChange
} from './ai-code-change-generator-service.js'

import {
  verifyEngineeringWorkspace
} from './autonomous-verification-engine-service.js'

import {
  reviewEngineeringPackage
} from './governance-review-service.js'

import {
  promoteWorkspaceFiles
} from './governed-repository-promotion-service.js'

import {
  createAutonomousCommit
} from './autonomous-git-commit-service.js'

import {
  completeMission
} from './mission-completion-service.js'

import {
  generateNextEngineeringMission
} from './autonomous-mission-generator-service.js'

function createRunId(missionId) {
  const safeMissionId =
    String(
      missionId ??
      'UNKNOWN-MISSION'
    )
      .replace(
        /[^A-Za-z0-9._-]/gu,
        '-'
      )

  return [
    safeMissionId,
    Date.now()
  ].join('-')
}

function createStageRecorder(
  initialStages = []
) {
  const stages =
    Array.isArray(initialStages)
      ? initialStages.map(
          stage => ({
            ...stage
          })
        )
      : []

  function record(
    stage,
    status,
    details = {}
  ) {
    const event = {
      stage,
      status,
      timestamp:
        new Date().toISOString(),
      ...details
    }

    stages.push(event)

    return event
  }

  return {
    stages,
    record
  }
}

function persistRuntimeEvidence({
  repositoryRoot,
  evidence
}) {
  if (!repositoryRoot) {
    return {
      written: false,
      filePath: null,
      reason:
        'Repository root unavailable.'
    }
  }

  try {
    const evidenceDirectory =
      path.join(
        path.resolve(repositoryRoot),
        'backend',
        'eos',
        'evidence',
        'self-build-runs'
      )

    fs.mkdirSync(
      evidenceDirectory,
      {
        recursive: true
      }
    )

    const fileName =
      `${evidence.runId}.json`

    const filePath =
      path.join(
        evidenceDirectory,
        fileName
      )

    fs.writeFileSync(
      filePath,
      `${JSON.stringify(
        evidence,
        null,
        2
      )}\n`,
      'utf8'
    )

    return {
      written: true,
      fileName,
      filePath
    }
  } catch (error) {
    return {
      written: false,
      filePath: null,
      reason:
        error instanceof Error
          ? error.message
          : 'Unable to persist runtime evidence.'
    }
  }
}

function buildRuntimeEvidence({
  runId,
  mission,
  startedAt,
  completedAt,
  stages,
  generation,
  verification,
  governance,
  promotion,
  gitCommit,
  completion,
  nextMission,
  finalStatus,
  success
}) {
  return {
    schema:
      'EOS Closed-Loop Self-Build Runtime Evidence',

    schemaVersion:
      '1.0.0',

    objective:
      '10.5.7',

    runId,

    missionId:
      mission?.id ??
      mission?.missionId ??
      null,

    startedAt,

    completedAt,

    success,

    status:
      finalStatus,

    provider: {
      name:
        generation?.provider ??
        null,

      id:
        generation?.providerId ??
        null,

      responseId:
        generation
          ?.providerResult
          ?.responseId ??
        null,

      model:
        generation
          ?.providerResult
          ?.model ??
        null
    },

    engineeringPackage: {
      packageId:
        generation
          ?.engineeringPackage
          ?.packageId ??
        null,

      fileCount:
        generation
          ?.engineeringPackage
          ?.files
          ?.length ??
        0,

      files:
        generation
          ?.engineeringPackage
          ?.files
          ?.map(file => ({
            path:
              file.path,
            action:
              file.action
          })) ??
        []
    },

    verification: verification
      ? {
          success:
            verification.success,
          status:
            verification.status,
          verdict:
            verification.verdict,
          totalTests:
            verification.summary
              ?.totalTests ??
            0,
          passedTests:
            verification.summary
              ?.passedTests ??
            0,
          failedTests:
            verification.summary
              ?.failedTests ??
            0
        }
      : null,

    governance: governance
      ? {
          decision:
            governance.decision ??
            null,
          reviewer:
            governance.reviewer ??
            null,
          reviewedAt:
            governance.reviewedAt ??
            null
        }
      : null,

    promotion: promotion
      ? {
          success:
            promotion.success,
          status:
            promotion.status,
          promotionExecuted:
            promotion.promotionExecuted ??
            false,
          promoted:
            promotion.promoted ??
            []
        }
      : null,

    gitCommit: gitCommit
      ? {
          success:
            gitCommit.success,
          status:
            gitCommit.status,
          previousCommit:
            gitCommit.previousCommit ??
            null,
          commit:
            gitCommit.commit ??
            null,
          branch:
            gitCommit.branch ??
            null,
          committedFiles:
            gitCommit.committedFiles ??
            [],
          commitExecuted:
            gitCommit.commitExecuted ??
            false,
          pushExecuted:
            gitCommit.pushExecuted ??
            false
        }
      : null,

    missionCompletion: completion
      ? {
          success:
            completion.success,
          status:
            completion.status,
          completedAt:
            completion.completedAt ??
            null
        }
      : null,

    nextMission: nextMission
      ? {
          success:
            nextMission.success,
          status:
            nextMission.status,
          missionId:
            nextMission
              ?.mission
              ?.id ??
            null
        }
      : null,

    stages
  }
}

function validateWorkspaceVerificationPolicy(
  engineeringPackage
) {
  const tests =
    engineeringPackage?.tests

  if (
    !Array.isArray(tests) ||
    tests.length === 0
  ) {
    return {
      valid: false,
      violations: [
        'Engineering Package must contain at least one governed workspace verification test.'
      ]
    }
  }

  const violations = []

  tests.forEach(
    (test, index) => {
      const command =
        String(
          test?.command ??
          ''
        ).trim()

      if (!command) {
        violations.push(
          `Verification test ${index + 1} has no command.`
        )

        return
      }

      if (
        /(^|[;&|()\s])git(\s|$)/u.test(
          command
        )
      ) {
        violations.push(
          `Verification test ${index + 1} depends on Git metadata: ${command}`
        )
      }

      if (
        command.includes(
          '.git/'
        ) ||
        command.includes(
          '.git '
        )
      ) {
        violations.push(
          `Verification test ${index + 1} references prohibited .git metadata.`
        )
      }
    }
  )

  return {
    valid:
      violations.length === 0,

    violations
  }
}

function selectGovernance({
  generatedPackage,
  generation,
  verification,
  explicitApproval
}) {
  const reviewed =
    reviewEngineeringPackage({
      validation:
        generation.validation,

      workspace:
        generation.workspace,

      tests:
        verification.testExecution,

      governance:
        generatedPackage.governance
    })

  if (
    reviewed.decision ===
    'Rejected'
  ) {
    return reviewed
  }

  if (!explicitApproval) {
    return reviewed
  }

  if (
    explicitApproval.decision !==
    'Approved'
  ) {
    return {
      ...reviewed,
      ...explicitApproval,
      decision:
        explicitApproval.decision
    }
  }

  if (
    explicitApproval.missionId &&
    explicitApproval.missionId !==
      generatedPackage.missionId
  ) {
    return {
      ...explicitApproval,
      decision:
        'Rejected',
      errors: [
        'Governance approval mission does not match Engineering Package mission.'
      ],
      nextStep:
        'Executive Approval'
    }
  }

  if (
    explicitApproval.packageId &&
    explicitApproval.packageId !==
      generatedPackage.packageId
  ) {
    return {
      ...explicitApproval,
      decision:
        'Rejected',
      errors: [
        'Governance approval package does not match Engineering Package.'
      ],
      nextStep:
        'Executive Approval'
    }
  }

  return {
    ...reviewed,
    ...explicitApproval,
    decision:
      'Approved',

    reviewedAt:
      explicitApproval.reviewedAt ??
      new Date().toISOString(),

    approvalRequired:
      true,

    explicitApproval:
      true,

    nextStep:
      'Governed Promotion'
  }
}

export async function runAutonomousEngineeringRuntime({
  mission,
  providerName = 'OPENAI',
  provider,
  repositoryRoot,
  governanceApproval,
  commitMessage =
    'EOS autonomous engineering mission',
  executePromotion = false,
  executeCommit = false,
  generateNextMission = true,
  resumeFrom = null
} = {}) {
  const startedAt =
    new Date().toISOString()

  const missionId =
    mission?.id ??
    mission?.missionId ??
    null

  const runId =
    createRunId(
      missionId
    )

  const recorder =
    createStageRecorder(
      resumeFrom?.auditTrail
    )

  const state = {
    generation:
      resumeFrom?.generation ??
      null,

    verification:
      resumeFrom?.verification ??
      null,

    governance:
      null,
    promotion:
      null,
    gitCommit:
      null,
    completion:
      null,
    nextMission:
      null
  }

  function finish({
    success,
    status,
    nextStep,
    extra = {}
  }) {
    const completedAt =
      new Date().toISOString()

    const evidence =
      buildRuntimeEvidence({
        runId,
        mission,
        startedAt,
        completedAt,
        stages:
          recorder.stages,
        generation:
          state.generation,
        verification:
          state.verification,
        governance:
          state.governance,
        promotion:
          state.promotion,
        gitCommit:
          state.gitCommit,
        completion:
          state.completion,
        nextMission:
          state.nextMission,
        finalStatus:
          status,
        success
      })

    const evidenceRecord =
      persistRuntimeEvidence({
        repositoryRoot,
        evidence
      })

    return {
      success,
      status,
      runId,
      startedAt,
      completedAt,

      generation:
        state.generation,

      validation:
        state.generation
          ?.validation ??
        null,

      engineeringPackage:
        state.generation
          ?.engineeringPackage ??
        null,

      workspace:
        state.generation
          ?.workspace ??
        null,

      verification:
        state.verification,

      governance:
        state.governance,

      promotion:
        state.promotion,

      gitCommit:
        state.gitCommit,

      completion:
        state.completion,

      nextMission:
        state.nextMission,

      auditTrail:
        recorder.stages,

      runtimeEvidence:
        evidenceRecord,

      nextStep,

      ...extra
    }
  }

  if (
    !mission ||
    typeof mission !==
      'object' ||
    !missionId
  ) {
    recorder.record(
      'Mission Intake',
      'REJECTED',
      {
        reason:
          'Mission requires id or missionId.'
      }
    )

    return finish({
      success:
        false,

      status:
        'Mission Rejected',

      nextStep:
        'Mission Generation'
    })
  }

  recorder.record(
    'Mission Intake',
    'PASS',
    {
      missionId
    }
  )

  if (resumeFrom) {
    const resumedMissionId =
      resumeFrom
        ?.engineeringPackage
        ?.missionId ??
      resumeFrom
        ?.generation
        ?.engineeringPackage
        ?.missionId ??
      null

    const resumedPackageId =
      resumeFrom
        ?.engineeringPackage
        ?.packageId ??
      resumeFrom
        ?.generation
        ?.engineeringPackage
        ?.packageId ??
      null

    if (
      resumeFrom.success !== true ||
      resumeFrom.status !==
        'Awaiting Human Approval'
    ) {
      recorder.record(
        'Runtime Resume',
        'REJECTED',
        {
          reason:
            'Only a successful Awaiting Human Approval transaction may be resumed.'
        }
      )

      return finish({
        success:
          false,

        status:
          'Runtime Resume Rejected',

        nextStep:
          'Restart Engineering Mission'
      })
    }

    if (
      resumedMissionId !==
      missionId
    ) {
      recorder.record(
        'Runtime Resume',
        'REJECTED',
        {
          reason:
            'Resumed transaction mission does not match requested mission.'
        }
      )

      return finish({
        success:
          false,

        status:
          'Runtime Resume Rejected',

        nextStep:
          'Restart Engineering Mission'
      })
    }

    if (
      !resumedPackageId ||
      !state.generation?.success ||
      !state.generation
        ?.engineeringPackage ||
      state.generation
        .engineeringPackage
        .packageId !==
        resumedPackageId
    ) {
      recorder.record(
        'Runtime Resume',
        'REJECTED',
        {
          reason:
            'Resumed Engineering Package identity is invalid.'
        }
      )

      return finish({
        success:
          false,

        status:
          'Runtime Resume Rejected',

        nextStep:
          'Restart Engineering Mission'
      })
    }

    if (
      !state.verification?.success ||
      state.verification
        ?.verdict !== 'PASS' ||
      state.verification
        ?.packageId !==
        resumedPackageId ||
      state.verification
        ?.missionId !==
        missionId
    ) {
      recorder.record(
        'Runtime Resume',
        'REJECTED',
        {
          reason:
            'Resumed autonomous verification evidence is invalid.'
        }
      )

      return finish({
        success:
          false,

        status:
          'Runtime Resume Rejected',

        nextStep:
          'Restart Engineering Mission'
      })
    }

    const resumedWorkspace =
      state.generation
        ?.workspace

    if (
      !resumedWorkspace?.success ||
      !resumedWorkspace
        ?.workspaceRoot ||
      resumedWorkspace
        ?.packageId !==
        resumedPackageId ||
      resumedWorkspace
        ?.missionId !==
        missionId
    ) {
      recorder.record(
        'Runtime Resume',
        'REJECTED',
        {
          reason:
            'Resumed governed workspace identity is invalid.'
        }
      )

      return finish({
        success:
          false,

        status:
          'Runtime Resume Rejected',

        nextStep:
          'Restart Engineering Mission'
      })
    }

    recorder.record(
      'Runtime Resume',
      'PASS',
      {
        missionId,
        packageId:
          resumedPackageId,

        providerReused:
          true,

        generationReused:
          true,

        verificationReused:
          true
      }
    )
  } else {
    state.generation =
      await generateAICodeChange({
        missionPackage:
          mission,

        providerName,

        provider,

        repositoryRoot
      })

    if (
      !state.generation
        ?.success
    ) {
      recorder.record(
        'AI Code Generation',
        'FAIL',
        {
          status:
            state.generation
              ?.status ??
            null
        }
      )

      return finish({
        success:
          false,

        status:
          'AI Code Generation Failed',

        nextStep:
          state.generation
            ?.nextStep ??
          'Return package to Hermes'
      })
    }

    recorder.record(
      'AI Code Generation',
      'PASS',
      {
        packageId:
          state.generation
            .engineeringPackage
            .packageId,

        provider:
          state.generation.provider
      }
    )

    const generatedPackage =
      state.generation
        .engineeringPackage

    const verificationPolicy =
      validateWorkspaceVerificationPolicy(
        generatedPackage
      )

    if (!verificationPolicy.valid) {
      recorder.record(
        'Verification Policy',
        'REJECTED',
        {
          violations:
            verificationPolicy
              .violations
        }
      )

      return finish({
        success:
          false,

        status:
          'Engineering Package Verification Policy Rejected',

        nextStep:
          'Return package to Hermes',

        extra: {
          verificationPolicy
        }
      })
    }

    recorder.record(
      'Verification Policy',
      'PASS'
    )

    state.verification =
      verifyEngineeringWorkspace({
        engineeringPackage:
          generatedPackage,

        workspaceRoot:
          state.generation
            .workspace
            .workspaceRoot,

        repositoryRoot
      })

    if (
      !state.verification
        ?.success ||
      state.verification
        ?.verdict !== 'PASS'
    ) {
      recorder.record(
        'Autonomous Verification',
        state.verification
          ?.verdict ??
          'FAIL',
        {
          status:
            state.verification
              ?.status ??
            null
        }
      )

      return finish({
        success:
          false,

        status:
          'Autonomous Verification Failed',

        nextStep:
          state.verification
            ?.nextStep ??
          'Return package to Hermes'
      })
    }

    recorder.record(
      'Autonomous Verification',
      'PASS',
      {
        totalTests:
          state.verification
            .summary
            .totalTests,

        passedTests:
          state.verification
            .summary
            .passedTests
      }
    )
  }

  const engineeringPackage =
    state.generation
      .engineeringPackage

  state.governance =
    selectGovernance({
      generatedPackage:
        engineeringPackage,

      generation:
        state.generation,

      verification:
        state.verification,

      explicitApproval:
        governanceApproval
    })

  if (
    state.governance
      .decision ===
    'Rejected'
  ) {
    recorder.record(
      'Governance',
      'REJECTED'
    )

    return finish({
      success:
        false,

      status:
        'Governance Rejected',

      nextStep:
        state.governance
          .nextStep ??
        'Executive Approval'
    })
  }

  if (
    state.governance
      .decision !==
    'Approved'
  ) {
    recorder.record(
      'Governance',
      'PENDING',
      {
        decision:
          state.governance
            .decision
      }
    )

    return finish({
      success:
        true,

      status:
        'Awaiting Human Approval',

      nextStep:
        'Executive Approval'
    })
  }

  recorder.record(
    'Governance',
    'PASS',
    {
      decision:
        state.governance
          .decision,

      reviewer:
        state.governance
          .reviewer ??
        null
    }
  )

  const repositoryFiles =
    engineeringPackage
      .files
      .map(file => ({
        path:
          file.path,

        repositoryPath:
          file.path,

        action:
          file.action
      }))

  state.promotion =
    promoteWorkspaceFiles({
      governanceReview:
        state.governance,

      verification:
        state.verification,

      workspaceRoot:
        state.generation
          .workspace
          .workspaceRoot,

      files:
        repositoryFiles,

      repositoryRoot,

      execute:
        executePromotion
    })

  if (
    !state.promotion
      ?.success
  ) {
    recorder.record(
      'Governed Promotion',
      'FAIL',
      {
        reason:
          state.promotion
            ?.reason ??
          null
      }
    )

    return finish({
      success:
        false,

      status:
        'Promotion Failed',

      nextStep:
        state.promotion
          ?.nextStep ??
        'Return package to Hermes'
    })
  }

  if (!executePromotion) {
    recorder.record(
      'Governed Promotion',
      'SIMULATION'
    )

    return finish({
      success:
        true,

      status:
        'Promotion Simulation Complete',

      nextStep:
        'Authorize Repository Promotion'
    })
  }

  recorder.record(
    'Governed Promotion',
    'PASS',
    {
      promotedFiles:
        state.promotion
          .promoted
          ?.length ??
        0
    }
  )

  const expectedHead =
    state.generation
      ?.workspace
      ?.manifest
      ?.source
      ?.commit ??
    state.verification
      ?.source
      ?.commit ??
    state.promotion
      ?.provenance
      ?.canonicalCommit ??
    null

  const expectedBranch =
    state.generation
      ?.workspace
      ?.manifest
      ?.source
      ?.branch ??
    state.verification
      ?.source
      ?.branch ??
    state.promotion
      ?.provenance
      ?.canonicalBranch ??
    null

  state.gitCommit =
    createAutonomousCommit({
      governanceReview:
        state.governance,

      verification:
        state.verification,

      promotion:
        state.promotion,

      files:
        repositoryFiles
          .map(
            file =>
              file.repositoryPath
          ),

      message:
        commitMessage,

      expectedHead,

      expectedBranch,

      execute:
        executeCommit,

      repositoryRoot
    })

  if (
    !state.gitCommit
      ?.success
  ) {
    recorder.record(
      'Governed Git Commit',
      'FAIL',
      {
        reason:
          state.gitCommit
            ?.reason ??
          null
      }
    )

    return finish({
      success:
        false,

      status:
        'Governed Commit Failed',

      nextStep:
        state.gitCommit
          ?.nextStep ??
        'Return package to Hermes'
    })
  }

  if (!executeCommit) {
    recorder.record(
      'Governed Git Commit',
      'SIMULATION'
    )

    return finish({
      success:
        true,

      status:
        'Commit Simulation Complete',

      nextStep:
        'Authorize Governed Commit'
    })
  }

  recorder.record(
    'Governed Git Commit',
    'PASS',
    {
      commit:
        state.gitCommit
          .commit,

      committedFiles:
        state.gitCommit
          .committedFiles
          ?.length ??
        0,

      pushExecuted:
        state.gitCommit
          .pushExecuted ??
        false
    }
  )

  state.completion =
    completeMission({
      mission,

      engineeringPackage,

      governanceReview:
        state.governance,

      verification:
        state.verification,

      promotion:
        state.promotion,

      gitCommit:
        state.gitCommit
    })

  if (
    !state.completion
      ?.success
  ) {
    recorder.record(
      'Mission Completion',
      'FAIL'
    )

    return finish({
      success:
        false,

      status:
        'Mission Completion Failed',

      nextStep:
        state.completion
          ?.nextStep ??
        'Return to Hermes'
    })
  }

  recorder.record(
    'Mission Completion',
    'PASS',
    {
      commit:
        state.completion
          .commit
    }
  )

  if (generateNextMission) {
    state.nextMission =
      generateNextEngineeringMission({
        completedMission:
          state.completion,

        currentSprint:
          mission?.sprint ??
          'Sprint 10.5',

        currentObjective:
          'Continue governed eOS development'
      })

    if (
      state.nextMission
        ?.success
    ) {
      recorder.record(
        'Next Mission Generation',
        'PASS',
        {
          nextMissionId:
            state.nextMission
              ?.mission
              ?.id ??
            null
        }
      )
    } else {
      recorder.record(
        'Next Mission Generation',
        'FAIL'
      )

      return finish({
        success:
          false,

        status:
          'Next Mission Generation Failed',

        nextStep:
          state.nextMission
            ?.nextStep ??
          'Mission Generation Recovery'
      })
    }
  }

  return finish({
    success:
      true,

    status:
      'Engineering Cycle Complete',

    nextStep:
      generateNextMission
        ? 'Dispatch Next Mission'
        : 'Mission Closed'
  })
}
