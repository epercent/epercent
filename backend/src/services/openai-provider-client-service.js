export async function executeOpenAiPrompt(promptPayload) {
  const apiKey = process.env.OPENAI_API_KEY
  const model = process.env.OPENAI_MODEL ?? 'gpt-4.1-mini'

  if (!apiKey) {
    return {
      provider: 'OpenAI',
      status: 'Configuration Required',
      success: false,
      error: 'OPENAI_API_KEY is not configured',
      model,
      missionId: promptPayload?.missionId ?? null,
      nextStep: 'Configure OPENAI_API_KEY'
    }
  }

  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        input: promptPayload?.prompt ?? ''
      })
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        provider: 'OpenAI',
        status: 'Provider Error',
        success: false,
        model,
        missionId: promptPayload?.missionId ?? null,
        error: data?.error?.message ?? `OpenAI returned ${response.status}`,
        nextStep: 'Review provider error'
      }
    }

    return {
      provider: 'OpenAI',
      status: 'Completed',
      success: true,
      model,
      missionId: promptPayload?.missionId ?? null,
      responseId: data.id ?? null,
      outputText:
        data.output_text ??
        data.output?.[0]?.content?.[0]?.text ??
        '',
      rawStatus: data.status ?? null,
      nextStep: 'Create provider response'
    }
  } catch (error) {
    return {
      provider: 'OpenAI',
      status: 'Runtime Error',
      success: false,
      model,
      missionId: promptPayload?.missionId ?? null,
      error: error.message,
      nextStep: 'Retry or inspect network/runtime'
    }
  }
}
