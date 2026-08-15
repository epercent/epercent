import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

import {
  createEngineeringGenerationMission,
  generateAICodeChange
} from '../backend/src/services/ai-code-change-generator-service.js'

function runGit(args, cwd) {
  const result = spawnSync(
    'git',
    args,
    {
      cwd,
      encoding: 'utf8'
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
        'eos-ai-code-change-'
      )
    )

  runGit(['init'], root)

  runGit(
    ['config', 'user.email', 'eos-test@example.com'],
    root
  )

  runGit(
    ['config', 'user.name', 'EOS Test'],
    root
  )

  fs.mkdirSync(
    path.join(root, 'backend', 'src'),
    {
      recursive: true
    }
  )

  fs.writeFileSync(
    path.join(
      root,
      'backend',
      'src',
      'canonical-proof.js'
    ),
    'export const canonicalProof = true\n',
    'utf8'
  )

  runGit(['add', '.'], root)

  runGit(
    ['commit', '-m', 'Canonical test source'],
    root
  )

  return root
}

function createMission() {
  return {
    id: 'EOS-MISSION-10.5.3-TEST',

    mission: {
      objective:
        'Create governed AI generated proof file.',

      priority:
        'Critical',

      assignedOffice:
        'AI Engineering Office',

      assignedAgent:
        'Hermes'
    },

    execution: {
      provider:
        'OpenAI Codex',

      mode:
        'Human Approved',

      autonomousReady:
        false
    }
  }
}

function createEngineeringPackage() {
  return {
    packageId:
      'EPS-10.5.3-TEST',

    missionId:
      'EOS-MISSION-10.5.3-TEST',

    provider:
      'OpenAI Codex',

    generatedAt:
      '2026-08-15T00:00:00.000Z',

    summary:
      'Create governed AI generated proof file.',

    files: [
      {
        path:
          'backend/src/ai-generated-proof.js',

        action:
          'create',

        language:
          'javascript',

        content:
          'export const aiGeneratedProof = true\n',

        reason:
          'Verify governed AI code generation.'
      }
    ],

    operations: [
      {
        type:
          'create_file',

        target:
          'backend/src/ai-generated-proof.js',

        description:
          'Create deterministic AI generated proof file.'
      }
    ],

    tests: [
      {
        command:
          'node --check backend/src/ai-generated-proof.js',

        purpose:
          'Verify generated JavaScript syntax.',

        expectedResult:
          'Exit code 0'
      }
    ],

    risks: [
      {
        level:
          'low',

        description:
          'Generated proof file is isolated.',

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
  'Running Objective 10.5.3 AI code change generation tests...'
)

const repositoryRoot =
  createRepository()

try {
  const mission =
    createMission()

  const generationMission =
    createEngineeringGenerationMission(
      mission
    )

  assert.equal(
    generationMission.engineeringExecution.mode,
    'Generate Engineering Package'
  )

  assert.equal(
    generationMission.engineeringExecution.canonicalRepositoryWriteAllowed,
    false
  )

  console.log(
    'PASS engineering generation mission requests governed package'
  )

  const canonicalFile =
    path.join(
      repositoryRoot,
      'backend',
      'src',
      'canonical-proof.js'
    )

  const canonicalBefore =
    fs.readFileSync(
      canonicalFile,
      'utf8'
    )

  const canonicalCommitBefore =
    runGit(
      ['rev-parse', 'HEAD'],
      repositoryRoot
    )

  const provider = {
    id:
      'AI-PROVIDER-OPENAI-CODEX',

    name:
      'OpenAI Codex',

    async submitMission(receivedMission) {
      assert.equal(
        receivedMission.engineeringExecution.mode,
        'Generate Engineering Package'
      )

      return {
        dispatched:
          true,

        provider:
          'OpenAI Codex',

        providerId:
          'AI-PROVIDER-OPENAI-CODEX',

        status:
          'Completed',

        artifact:
          JSON.stringify(
            createEngineeringPackage()
          )
      }
    }
  }

  const result =
    await generateAICodeChange({
      missionPackage:
        mission,

      provider,

      repositoryRoot
    })

  assert.equal(
    result.success,
    true
  )

  assert.equal(
    result.status,
    'AI Code Change Generated'
  )

  assert.equal(
    result.parsing.parsed,
    true
  )

  assert.equal(
    result.validation.valid,
    true
  )

  assert.equal(
    result.workspace.success,
    true
  )

  assert.equal(
    result.governance.workspaceOnly,
    true
  )

  assert.equal(
    result.governance.promotionExecuted,
    false
  )

  assert.equal(
    result.governance.commitExecuted,
    false
  )

  console.log(
    'PASS provider response parsed and validated as engineering package'
  )

  const generatedWorkspaceFile =
    path.join(
      result.workspace.workspaceRoot,
      'backend',
      'src',
      'ai-generated-proof.js'
    )

  assert.equal(
    fs.existsSync(
      generatedWorkspaceFile
    ),
    true
  )

  assert.equal(
    fs.readFileSync(
      generatedWorkspaceFile,
      'utf8'
    ),
    'export const aiGeneratedProof = true\n'
  )

  console.log(
    'PASS AI generated code materialized inside governed workspace'
  )

  assert.equal(
    fs.readFileSync(
      canonicalFile,
      'utf8'
    ),
    canonicalBefore
  )

  assert.equal(
    fs.existsSync(
      path.join(
        repositoryRoot,
        'backend',
        'src',
        'ai-generated-proof.js'
      )
    ),
    false
  )

  const canonicalCommitAfter =
    runGit(
      ['rev-parse', 'HEAD'],
      repositoryRoot
    )

  assert.equal(
    canonicalCommitAfter,
    canonicalCommitBefore
  )

  const trackedDiff =
    spawnSync(
      'git',
      ['diff', '--quiet', 'HEAD', '--'],
      {
        cwd: repositoryRoot,
        encoding: 'utf8'
      }
    )

  assert.equal(
    trackedDiff.status,
    0,
    'Canonical tracked files must remain unchanged.'
  )

  console.log(
    'PASS canonical tracked repository remained unchanged'
  )

  fs.rmSync(
    result.workspace.workspaceRoot,
    {
      recursive: true,
      force: true
    }
  )

  assert.equal(
    runGit(
      ['status', '--porcelain'],
      repositoryRoot
    ),
    ''
  )

  console.log(
    'PASS governed workspace cleanup restores clean repository state'
  )

  const malformedProvider = {
    id:
      'AI-PROVIDER-OPENAI-CODEX',

    name:
      'OpenAI Codex',

    async submitMission() {
      return {
        dispatched:
          true,

        provider:
          'OpenAI Codex',

        artifact:
          'This is not an engineering package.'
      }
    }
  }

  const malformedResult =
    await generateAICodeChange({
      missionPackage:
        mission,

      provider:
        malformedProvider,

      repositoryRoot
    })

  assert.equal(
    malformedResult.success,
    false
  )

  assert.equal(
    malformedResult.status,
    'Engineering Package Parse Failed'
  )

  console.log(
    'PASS malformed provider output rejected before workspace execution'
  )

  const failedProvider = {
    id:
      'AI-PROVIDER-OPENAI-CODEX',

    name:
      'OpenAI Codex',

    async submitMission() {
      return {
        dispatched:
          false,

        provider:
          'OpenAI Codex',

        status:
          'Provider Error',

        reason:
          'Deterministic provider failure'
      }
    }
  }

  const failedResult =
    await generateAICodeChange({
      missionPackage:
        mission,

      provider:
        failedProvider,

      repositoryRoot
    })

  assert.equal(
    failedResult.success,
    false
  )

  assert.equal(
    failedResult.status,
    'Provider Execution Failed'
  )

  console.log(
    'PASS provider failure stops engineering execution'
  )

  const rejectedMission =
    await generateAICodeChange({
      missionPackage:
        null,

      provider,

      repositoryRoot
    })

  assert.equal(
    rejectedMission.success,
    false
  )

  assert.equal(
    rejectedMission.status,
    'Mission Package Rejected'
  )

  console.log(
    'PASS invalid mission rejected before provider execution'
  )

  console.log(
    'All Objective 10.5.3 AI code change generation tests passed.'
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
