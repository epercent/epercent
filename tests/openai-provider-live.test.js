import assert from 'node:assert/strict'

if (process.env.EOS_LIVE_PROVIDER_TEST !== '1') {
  console.error(
    'Live provider test blocked. Set EOS_LIVE_PROVIDER_TEST=1 explicitly.'
  )
  process.exit(2)
}

if (!process.env.OPENAI_API_KEY) {
  console.error(
    'Live provider test blocked. OPENAI_API_KEY is not configured.'
  )
  process.exit(2)
}

const {
  getProvider
} = await import(
  '../backend/src/providers/provider-registry.js'
)

const provider = getProvider('OPENAI')

console.log(
  'Running Objective 10.5.1 controlled live OpenAI connectivity test...'
)

console.log(`Provider: ${provider.name}`)
console.log(`Provider ID: ${provider.id}`)
console.log(`Model: ${provider.health().model}`)

const result = await provider.submitMission({
  missionId: 'EOS-LIVE-10.5.1',
  objective:
    'Connectivity verification only. Reply with exactly: EOS LIVE PROVIDER CONNECTED',
  governance: {
    mode: 'Connectivity Test',
    repositoryModificationAuthorized: false
  },
  deliverables: [
    'Return the requested connectivity confirmation only'
  ]
})

if (!result.dispatched) {
  console.error('LIVE PROVIDER TEST FAILED')
  console.error(`Status: ${result.status}`)
  console.error(`Reason: ${result.reason}`)
  process.exit(1)
}

assert.equal(
  result.status,
  'Completed'
)

assert.ok(
  result.responseId,
  'Live response must contain a response ID'
)

assert.ok(
  typeof result.artifact === 'string',
  'Live response must contain text output'
)

console.log('PASS live OpenAI request completed')
console.log(`Response ID: ${result.responseId}`)
console.log(`Model: ${result.model}`)
console.log(`Provider status: ${result.status}`)
console.log(`Output: ${result.artifact}`)
console.log(
  'All Objective 10.5.1 live OpenAI connectivity checks passed.'
)
