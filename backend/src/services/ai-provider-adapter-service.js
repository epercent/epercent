import { generatePrompt } from './prompt-generation-engine-service.js'

export function executeProvider(provider, missionPackage) {
  const prompt = generatePrompt(missionPackage)

  return {
    adapterId: `ADAPTER-${Date.now()}`,
    provider,
    missionId: missionPackage.id,
    status: 'Ready',
    executionMode: missionPackage.execution.mode,
    autonomousReady: missionPackage.execution.autonomousReady,
    submittedAt: new Date().toISOString(),
    prompt,

    nextStep: 'Generate Provider Prompt'
  }
}
