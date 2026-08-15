import assert from 'node:assert/strict'

process.env.AI_PROVIDER = 'OPENAI'
process.env.OPENAI_API_KEY = 'test-key-not-sent-to-openai'
process.env.OPENAI_MODEL = 'gpt-test-model'

const originalFetch = globalThis.fetch

try {
  const { getProvider } = await import('../backend/src/providers/provider-registry.js')

  console.log('Running Objective 10.5.1 OpenAI provider connection tests...')

  const provider = getProvider('OPENAI')

  assert.equal(provider.id, 'AI-PROVIDER-OPENAI-CODEX')
  assert.equal(provider.name, 'OpenAI Codex')
  assert.equal(provider.health().configured, true)
  assert.equal(provider.health().status, 'Available')
  console.log('PASS provider registry resolves canonical OpenAI provider')

  assert.throws(
    () => getProvider('UNSUPPORTED'),
    /Unsupported AI provider/
  )
  console.log('PASS unsupported provider rejected')

  let capturedRequest = null

  globalThis.fetch = async (url, options) => {
    capturedRequest = { url, options }

    return {
      ok: true,
      status: 200,
      async json() {
        return {
          id: 'resp_test_1051',
          status: 'completed',
          output: [
            {
              type: 'message',
              content: [
                {
                  type: 'output_text',
                  text: 'EOS provider connection verified.'
                }
              ]
            }
          ]
        }
      }
    }
  }

  const success = await provider.submitMission({
    missionId: 'EOS-TEST-10.5.1',
    objective: 'Verify canonical provider execution.'
  })

  assert.equal(success.dispatched, true)
  assert.equal(success.status, 'Completed')
  assert.equal(success.responseId, 'resp_test_1051')
  assert.equal(success.artifact, 'EOS provider connection verified.')
  assert.equal(success.model, 'gpt-test-model')
  assert.equal(capturedRequest.url, 'https://api.openai.com/v1/responses')
  assert.equal(capturedRequest.options.method, 'POST')
  assert.match(capturedRequest.options.headers.Authorization, /^Bearer /)

  const requestBody = JSON.parse(capturedRequest.options.body)
  assert.equal(requestBody.model, 'gpt-test-model')
  assert.match(requestBody.input, /EOS-TEST-10\.5\.1/)

  console.log('PASS successful OpenAI response normalized')

  globalThis.fetch = async () => ({
    ok: false,
    status: 401,
    async json() {
      return {
        error: {
          message: 'Synthetic authentication failure'
        }
      }
    }
  })

  const providerFailure = await provider.submitMission({
    missionId: 'EOS-TEST-10.5.1-ERROR'
  })

  assert.equal(providerFailure.dispatched, false)
  assert.equal(providerFailure.status, 'Provider Error')
  assert.equal(providerFailure.reason, 'Synthetic authentication failure')
  assert.equal(providerFailure.httpStatus, 401)

  console.log('PASS provider HTTP failure normalized')

  globalThis.fetch = async () => {
    throw new Error('Synthetic network failure')
  }

  const runtimeFailure = await provider.submitMission({
    missionId: 'EOS-TEST-10.5.1-RUNTIME'
  })

  assert.equal(runtimeFailure.dispatched, false)
  assert.equal(runtimeFailure.status, 'Runtime Error')
  assert.equal(runtimeFailure.reason, 'Synthetic network failure')

  console.log('PASS provider runtime failure normalized')
  console.log('All Objective 10.5.1 OpenAI provider connection tests passed.')
} finally {
  globalThis.fetch = originalFetch
}
