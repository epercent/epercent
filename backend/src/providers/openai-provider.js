import { AIProviderInterface } from './ai-provider-interface.js'
import { env } from '../config/env.js'

function extractOutputText(result) {
  if (typeof result?.output_text === 'string') {
    return result.output_text
  }

  if (!Array.isArray(result?.output)) {
    return ''
  }

  return result.output
    .flatMap((item) => Array.isArray(item?.content) ? item.content : [])
    .filter((content) => content?.type === 'output_text' && typeof content?.text === 'string')
    .map((content) => content.text)
    .join('\n')
}

export class OpenAIProvider extends AIProviderInterface {
  get id() {
    return 'AI-PROVIDER-OPENAI-CODEX'
  }

  get name() {
    return 'OpenAI Codex'
  }

  health() {
    return {
      providerId: this.id,
      provider: this.name,
      configured: Boolean(env.openaiApiKey),
      status: env.openaiApiKey ? 'Available' : 'Configuration Required',
      model: env.openaiModel
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
        providerId: this.id,
        model: env.openaiModel,
        status: 'Configuration Required',
        reason: 'OPENAI_API_KEY missing',
        missionPackage
      }
    }

    const engineeringPackageRequested =
      missionPackage?.engineeringExecution?.mode ===
      'Generate Engineering Package'

    const prompt = engineeringPackageRequested
      ? `
You are the EOS AI Development Office Build Agent.

Generate an implementation-ready EOS Engineering Package for the mission below.

Return ONLY one valid JSON object.
Do not use Markdown fences.
Do not include explanatory text before or after the JSON.

The JSON object must contain:

{
  "packageId": "string",
  "missionId": "string",
  "provider": "OpenAI Codex",
  "generatedAt": "ISO-8601 datetime",
  "summary": "string",
  "files": [
    {
      "path": "repository-relative path",
      "action": "create | update | delete",
      "language": "string",
      "content": "complete file content",
      "reason": "string"
    }
  ],
  "operations": [
    {
      "type": "create_file | update_file | delete_file | run_command",
      "target": "string",
      "description": "string"
    }
  ],
  "tests": [
    {
      "command": "string",
      "purpose": "string",
      "expectedResult": "string"
    }
  ],
  "risks": [
    {
      "level": "low | medium | high | critical",
      "description": "string",
      "mitigation": "string"
    }
  ],
  "governance": {
    "confidence": 0.0,
    "approvalRequired": true,
    "approvedForAutonomousExecution": false,
    "reviewer": "Governance Office"
  }
}

Rules:
- Modify only files necessary for the mission.
- File paths must be repository-relative.
- For create or update actions, return complete file content.
- Do not attempt to write to the canonical repository.
- Do not approve the package for autonomous execution.
- Set approvalRequired to true.
- Set approvedForAutonomousExecution to false.
- Tests must be explicit and reproducible.
- Preserve existing architecture unless the mission requires a change.

Mission:
${JSON.stringify(missionPackage, null, 2)}
`.trim()
      : `
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
`.trim()

    try {
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
          providerId: this.id,
          model: env.openaiModel,
          status: 'Provider Error',
          reason: result?.error?.message ?? `OpenAI returned HTTP ${response.status}`,
          httpStatus: response.status,
          missionPackage
        }
      }

      return {
        dispatched: true,
        provider: this.name,
        providerId: this.id,
        model: env.openaiModel,
        status: 'Completed',
        responseId: result?.id ?? null,
        rawStatus: result?.status ?? null,
        artifact: extractOutputText(result),
        missionPackage
      }
    } catch (error) {
      return {
        dispatched: false,
        provider: this.name,
        providerId: this.id,
        model: env.openaiModel,
        status: 'Runtime Error',
        reason: error instanceof Error ? error.message : String(error),
        missionPackage
      }
    }
  }

  missionStatus() {
    return {
      provider: this.name,
      status: env.openaiApiKey ? 'Provider execution available' : 'Configuration Required'
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
