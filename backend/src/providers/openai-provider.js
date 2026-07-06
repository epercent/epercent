import { AIProviderInterface } from './ai-provider-interface.js'
import { env } from '../config/env.js'

export class OpenAIProvider extends AIProviderInterface {
  get id() {
    return 'AI-PROVIDER-OPENAI-CODEX'
  }

  get name() {
    return 'OpenAI Codex'
  }

  health() {
    return {
      status: env.openaiApiKey ? 'Available' : 'Missing API Key'
    }
  }

  capabilities() {
    return [
      'Backend Development',
      'Frontend Development',
      'Refactoring',
      'Documentation',
      'Unit Testing'
    ]
  }

  async submitMission(missionPackage) {
    if (!env.openaiApiKey) {
      return {
        dispatched: false,
        provider: this.name,
        reason: 'OPENAI_API_KEY missing',
        missionPackage
      }
    }

    const prompt = `
You are the EOS AI Development Office Build Agent.

Execute this engineering mission.

Return:
1. Summary
2. Files to create or modify
3. Code
4. Tests
5. Documentation updates

Mission:
${JSON.stringify(missionPackage, null, 2)}
`

    const response = await fetch(
      'https://api.openai.com/v1/responses',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.openaiApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: env.openaiModel,
          input: prompt
        })
      }
    )

    const result = await response.json()

    if (!response.ok) {
      return {
        dispatched: false,
        provider: this.name,
        reason: result.error?.message ?? 'OpenAI request failed',
        missionPackage
      }
    }

    return {
      dispatched: true,
      provider: this.name,
      model: env.openaiModel,
      responseId: result.id,
      artifact:
        result.output_text ??
        result.output?.map((item) =>
          item.content?.map((content) => content.text).join('\n')
        ).join('\n') ??
        JSON.stringify(result, null, 2),
      missionPackage
    }
  }

  missionStatus() {
    return {
      status: 'Provider execution available'
    }
  }

  retrieveArtifacts() {
    return {
      artifacts: []
    }
  }

  cancelMission() {
    return {
      cancelled: true
    }
  }
}
