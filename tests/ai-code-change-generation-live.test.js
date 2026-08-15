import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

if (process.env.EOS_LIVE_AI_CODE_CHANGE_TEST !== '1') {
  console.error(
    'Live AI code generation test blocked. Set EOS_LIVE_AI_CODE_CHANGE_TEST=1 explicitly.'
  )
  process.exit(2)
}

if (!process.env.OPENAI_API_KEY) {
  console.error(
    'Live AI code generation test blocked. OPENAI_API_KEY is not configured.'
  )
  process.exit(2)
}

const {
  generateAICodeChange
} = await import(
  '../backend/src/services/ai-code-change-generator-service.js'
)

function runGit(args, cwd) {
  const result = spawnSync(
    'git',
    args,
    {
      cwd,
      encoding: 'utf8'
    }
  )

  if (result.status !== 0) {
    throw new Error(
      result.stderr?.trim() ||
      `git ${args.join(' ')} failed`
    )
  }

  return result.stdout.trim()
}

const repositoryRoot =
  runGit(
    ['rev-parse', '--show-toplevel'],
    process.cwd()
  )

const requestedFile =
  'backend/src/live-ai-generation-proof.js'

const canonicalTarget =
  path.join(
    repositoryRoot,
    requestedFile
  )

const headBefore =
  runGit(
    ['rev-parse', 'HEAD'],
    repositoryRoot
  )

const statusBefore =
  runGit(
    [
      'status',
      '--porcelain',
      '--untracked-files=all'
    ],
    repositoryRoot
  )

assert.equal(
  fs.existsSync(canonicalTarget),
  false,
  'Canonical proof target must not already exist.'
)

const mission = {
  id: 'EOS-LIVE-10.5.3',

  mission: {
    objective:
      'Create exactly one new JavaScript proof file at backend/src/live-ai-generation-proof.js. The complete file content must be: export const eosLiveAIGenerationProof = true followed by a newline. Do not modify, delete, or create any other source file.',

    rationale:
      'Verify that EOS can receive a real AI-generated Engineering Package and materialize it only inside a governed engineering workspace.',

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
  },

  requiredCapabilities: [
    'Backend Development',
    'Governed Engineering Workspace',
    'Engineering Package Generation'
  ],

  affectedAreas: [
    requestedFile
  ],

  acceptanceCriteria: [
    'Return one valid EOS Engineering Package JSON object',
    `Create only ${requestedFile}`,
    'Do not modify canonical EOS',
    'approvalRequired must be true',
    'approvedForAutonomousExecution must be false',
    'Include a node --check syntax test for the generated file'
  ]
}

console.log(
  'Running Objective 10.5.3 controlled live AI code generation test...'
)

console.log(`Canonical repository: ${repositoryRoot}`)
console.log(`Canonical HEAD: ${headBefore}`)
console.log(`Requested file: ${requestedFile}`)

const result =
  await generateAICodeChange({
    missionPackage: mission,
    providerName: 'OPENAI',
    repositoryRoot
  })

if (!result.success) {
  console.error('')
  console.error('LIVE AI CODE GENERATION FAILED')
  console.error(`Status: ${result.status}`)

  if (result.error) {
    console.error(`Error: ${result.error}`)
  }

  if (result.providerResult?.reason) {
    console.error(
      `Provider reason: ${result.providerResult.reason}`
    )
  }

  if (result.parsing?.error) {
    console.error(
      `Parsing error: ${result.parsing.error}`
    )
  }

  if (result.validation?.errors?.length) {
    console.error(
      `Validation errors: ${result.validation.errors.join('; ')}`
    )
  }

  process.exit(1)
}

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

console.log('PASS live provider returned a valid Engineering Package')

const generatedFiles =
  result.engineeringPackage.files

assert.ok(
  Array.isArray(generatedFiles)
)

assert.equal(
  generatedFiles.length,
  1,
  'Live proof mission must generate exactly one file.'
)

assert.equal(
  generatedFiles[0].path,
  requestedFile
)

assert.equal(
  generatedFiles[0].action,
  'create'
)

console.log('PASS AI package contains exactly the governed proof change')

const workspaceTarget =
  path.join(
    result.workspace.workspaceRoot,
    requestedFile
  )

assert.equal(
  fs.existsSync(workspaceTarget),
  true
)

const workspaceContent =
  fs.readFileSync(
    workspaceTarget,
    'utf8'
  )

assert.equal(
  workspaceContent,
  'export const eosLiveAIGenerationProof = true\n'
)

console.log('PASS real AI-generated code exists inside governed workspace')

assert.equal(
  fs.existsSync(canonicalTarget),
  false,
  'AI-generated proof file must not exist in canonical repository.'
)

const headAfter =
  runGit(
    ['rev-parse', 'HEAD'],
    repositoryRoot
  )

assert.equal(
  headAfter,
  headBefore,
  'Canonical HEAD must not change.'
)

const statusAfter =
  runGit(
    [
      'status',
      '--porcelain',
      '--untracked-files=all'
    ],
    repositoryRoot
  )

assert.equal(
  statusAfter,
  statusBefore,
  'Canonical repository worktree must remain exactly as it was before live AI execution.'
)

console.log('PASS canonical eOS repository remained unchanged')

assert.equal(
  result.workspace.manifest.source.commit,
  headBefore
)

assert.equal(
  result.workspace.manifest.source.immutableSource,
  true
)

assert.equal(
  result.workspace.manifest.isolation.canonicalRepositoryWritable,
  false
)

assert.equal(
  result.workspace.manifest.isolation.promotionRequired,
  true
)

assert.equal(
  result.workspace.manifest.isolation.directCommitAllowed,
  false
)

console.log('PASS governed workspace provenance and isolation verified')

const evidence = {
  objective: '10.5.3',
  test: 'Controlled Live AI Code Generation',
  executedAt: new Date().toISOString(),

  provider: {
    name: result.provider,
    id: result.providerId,
    responseId:
      result.providerResult?.responseId ?? null,
    model:
      result.providerResult?.model ?? null
  },

  missionId:
    result.missionId,

  engineeringPackage: {
    packageId:
      result.engineeringPackage.packageId,
    fileCount:
      result.engineeringPackage.files.length,
    files:
      result.engineeringPackage.files.map(
        (file) => ({
          path: file.path,
          action: file.action
        })
      ),
    validation:
      result.validation.valid
  },

  workspace: {
    workspaceRoot:
      result.workspace.workspaceRoot,
    sourceCommit:
      result.workspace.manifest.source.commit,
    sourceBranch:
      result.workspace.manifest.source.branch,
    immutableSource:
      result.workspace.manifest.source.immutableSource,
    canonicalRepositoryWritable:
      result.workspace.manifest.isolation.canonicalRepositoryWritable,
    promotionRequired:
      result.workspace.manifest.isolation.promotionRequired
  },

  governance: result.governance,

  canonicalRepository: {
    headBefore,
    headAfter,
    unchanged:
      headBefore === headAfter &&
      statusBefore === statusAfter
  },

  status: 'PASS'
}

const evidenceFile =
  '/tmp/eos-10.5.3-live-ai-generation.json'

fs.writeFileSync(
  evidenceFile,
  `${JSON.stringify(evidence, null, 2)}\n`,
  'utf8'
)

console.log('')
console.log('PASS controlled live AI code generation completed')
console.log(`Provider: ${result.provider}`)
console.log(`Provider ID: ${result.providerId}`)
console.log(
  `Response ID: ${result.providerResult?.responseId ?? 'Unavailable'}`
)
console.log(
  `Model: ${result.providerResult?.model ?? 'Unavailable'}`
)
console.log(
  `Engineering Package: ${result.engineeringPackage.packageId}`
)
console.log(
  `Workspace: ${result.workspace.workspaceRoot}`
)
console.log(
  `Generated File: ${workspaceTarget}`
)
console.log(
  `Evidence: ${evidenceFile}`
)

console.log('')
console.log(
  'All Objective 10.5.3 controlled live AI code generation checks passed.'
)
