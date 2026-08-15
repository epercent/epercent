import assert from 'node:assert/strict'

process.env.AI_PROVIDER = 'OPENAI'
process.env.OPENAI_API_KEY = 'test-key-never-sent'
process.env.OPENAI_MODEL = 'gpt-test-model'

const originalFetch = globalThis.fetch

try {
  globalThis.fetch = async (url, options) => {
    const body = JSON.parse(options.body)

    assert.equal(url, 'https://api.openai.com/v1/responses')
    assert.equal(options.method, 'POST')
    assert.match(options.headers.Authorization, /^Bearer /)
    assert.equal(body.model, 'gpt-test-model')
    assert.match(body.input, /Execute approved EOS engineering mission/)

    return {
      ok: true,
      status: 200,
      async json() {
        return {
          id: 'resp_dispatch_1051',
          status: 'completed',
          output: [
            {
              type: 'message',
              content: [
                {
                  type: 'output_text',
                  text: 'EOS dispatch integration verified.'
                }
              ]
            }
          ]
        }
      }
    }
  }

  const {
    dispatchMission
  } = await import(
    '../backend/src/services/provider-dispatch-service.js'
  )

  console.log(
    'Running Objective 10.5.1 provider dispatch integration tests...'
  )

  const success = await dispatchMission({
    provider: 'OPENAI',
    assignmentId: 'ENG-ASSIGN-0001'
  })

  assert.equal(
    success.dispatchStatus,
    'DISPATCH_COMPLETED'
  )

  assert.equal(
    success.provider,
    'OpenAI Codex'
  )

  assert.equal(
    success.providerId,
    'AI-PROVIDER-OPENAI-CODEX'
  )

  assert.equal(
    success.providerHealth.configured,
    true
  )

  assert.equal(
    success.result.dispatched,
    true
  )

  assert.equal(
    success.result.status,
    'Completed'
  )

  assert.equal(
    success.result.responseId,
    'resp_dispatch_1051'
  )

  assert.equal(
    success.result.artifact,
    'EOS dispatch integration verified.'
  )

  console.log(
    'PASS mission package dispatched through canonical OpenAI provider'
  )

  globalThis.fetch = async () => ({
    ok: false,
    status: 429,
    async json() {
      return {
        error: {
          message: 'Synthetic rate limit'
        }
      }
    }
  })

  const providerFailure = await dispatchMission({
    provider: 'OPENAI',
    assignmentId: 'ENG-ASSIGN-0001'
  })

  assert.equal(
    providerFailure.dispatchStatus,
    'DISPATCH_FAILED'
  )

  assert.equal(
    providerFailure.result.dispatched,
    false
  )

  assert.equal(
    providerFailure.result.status,
    'Provider Error'
  )

  assert.equal(
    providerFailure.result.reason,
    'Synthetic rate limit'
  )

  console.log(
    'PASS provider failure propagates through dispatch contract'
  )

  const missionFailure = await dispatchMission({
    provider: 'OPENAI',
    assignmentId: 'DOES-NOT-EXIST'
  })

  assert.equal(
    missionFailure.dispatchStatus,
    'DISPATCH_FAILED'
  )

  assert.equal(
    missionFailure.result.status,
    'Mission Package Error'
  )

  console.log(
    'PASS invalid mission assignment rejected before provider execution'
  )

  console.log(
    'All Objective 10.5.1 provider dispatch integration tests passed.'
  )
} finally {
  globalThis.fetch = originalFetch
}
