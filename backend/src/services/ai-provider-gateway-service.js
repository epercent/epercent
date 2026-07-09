import { executeOpenAiPrompt } from './openai-provider-client-service.js'
import { executeProvider as executeProviderRuntime } from './provider-execution-runtime-service.js'

export function executeMission(provider, missionPackage) {
  const runtime = executeProviderRuntime({
    adapterId: `GATEWAY-${Date.now()}`,
    provider,
    missionId: missionPackage.id,
    executionMode: missionPackage.execution?.mode ?? 'Human Approved',
    autonomousReady: missionPackage.execution?.autonomousReady ?? false,
    prompt: missionPackage.prompt ?? { promptId: `PROMPT-${Date.now()}` }
  })

  return {
    executionId: `EXEC-${Date.now()}`,
    provider,
    missionId: missionPackage.id,
    status: runtime.status,
    executionMode: runtime.executionMode,
    autonomousReady: runtime.autonomousReady,
    submittedAt: new Date().toISOString(),
    runtime,
    nextStep: runtime.nextStep
  }
}

export function getProviderGateway() {
  return {
    id: 'EOS-AI-PROVIDER-GATEWAY',
    status: 'Operational',
    defaultProvider: 'Codex',
    providers: ['Codex', 'OpenAI', 'Claude', 'Gemini', 'Local Agent'],
    mode: 'Human Approved',
    autonomousReady: false
  }
}


export async function executeLiveMission(provider, missionPackage) {
  const promptPayload = missionPackage?.prompt ?? {
    missionId: missionPackage?.id ?? null,
    prompt: missionPackage?.mission?.objective ?? ''
  }

  if (provider === 'OpenAI' || provider === 'Codex') {
    return executeOpenAiPrompt(promptPayload)
  }

  return {
    provider,
    status: 'Provider Not Implemented',
    success: false,
    missionId: missionPackage?.id ?? null,
    error: `Provider ${provider} is not implemented yet`,
    nextStep: 'Add provider client'
  }
}
