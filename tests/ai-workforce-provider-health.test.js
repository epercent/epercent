import assert from 'node:assert/strict'

process.env.AI_PROVIDER = 'OPENAI'
process.env.OPENAI_API_KEY =
  'synthetic-test-key-never-sent'
process.env.OPENAI_MODEL =
  'gpt-test-model'

const {
  getAiWorkforceMemberById,
  getAiWorkforceProviderHealth,
  listAiWorkforceMembers
} = await import(
  '../backend/src/services/ai-workforce-member-service.js'
)

console.log(
  'Running Objective 10.5.1 AI Workforce provider health tests...'
)

const workforce =
  listAiWorkforceMembers()

assert.equal(
  workforce.summary.total,
  3
)

assert.equal(
  workforce.summary.enabled,
  1
)

assert.equal(
  workforce.summary.connected,
  1
)

assert.equal(
  workforce.summary.status,
  'Operational'
)

console.log(
  'PASS workforce summary reflects configured provider'
)

const codex =
  getAiWorkforceMemberById(
    'AIWF-001'
  )

assert.ok(codex)

assert.equal(
  codex.provider,
  'OpenAI'
)

assert.equal(
  codex.providerId,
  'AI-PROVIDER-OPENAI-CODEX'
)

assert.equal(
  codex.enabled,
  true
)

assert.equal(
  codex.connected,
  true
)

assert.equal(
  codex.configured,
  true
)

assert.equal(
  codex.health,
  'Available'
)

assert.equal(
  codex.providerStatus,
  'Available'
)

assert.equal(
  codex.model,
  'gpt-test-model'
)

console.log(
  'PASS Codex workforce member reflects canonical OpenAI health'
)

const health =
  getAiWorkforceProviderHealth()

assert.equal(
  health.status,
  'Operational'
)

assert.equal(
  health.configuredProviders,
  1
)

assert.equal(
  health.enabledProviders,
  1
)

const healthCodex =
  health.members.find(
    (member) =>
      member.id === 'AIWF-001'
  )

assert.ok(healthCodex)
assert.equal(
  healthCodex.connected,
  true
)

console.log(
  'PASS workforce health endpoint reports operational provider'
)

const claude =
  health.members.find(
    (member) =>
      member.id === 'AIWF-002'
  )

assert.ok(claude)
assert.equal(
  claude.connected,
  false
)

console.log(
  'PASS unimplemented providers remain disconnected'
)

console.log(
  'All Objective 10.5.1 AI Workforce provider health tests passed.'
)
