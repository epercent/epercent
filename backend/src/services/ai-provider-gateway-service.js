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
