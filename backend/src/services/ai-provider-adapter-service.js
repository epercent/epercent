import { generatePrompt } from './prompt-generation-engine-service.js'
import { executeProvider as executeProviderRuntime } from './provider-execution-runtime-service.js'

export function executeProvider(provider, missionPackage) {
  const prompt = generatePrompt(missionPackage)
  const runtime = executeProviderRuntime({
    adapterId: `ADAPTER-${Date.now()}`,
    provider,
    missionId: missionPackage.id,
    executionMode: missionPackage.execution.mode,
    autonomousReady: missionPackage.execution.autonomousReady,
    prompt
  })

  return {
    adapterId: `ADAPTER-${Date.now()}`,
    provider,
    missionId: missionPackage.id,
    status: 'Ready',
    executionMode: missionPackage.execution.mode,
    autonomousReady: missionPackage.execution.autonomousReady,
    submittedAt: new Date().toISOString(),
    prompt,

    runtime,

    nextStep: 'Submit to Provider Execution Runtime'
  }
}
