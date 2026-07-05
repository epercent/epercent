import { aiProviders } from '../data/ai-providers.js'
import { generateMissionPackage } from './mission-package-service.js'

export function resolveMissionCapability() {
  const mission = generateMissionPackage().missionPackage

  const capability = mission.requiredCapabilities[0]

  const matchingProviders = aiProviders.filter((provider) =>
    provider.capabilities.includes(capability)
  )

  return {
    status: "RESOLVED",
    capability,
    mission,
    recommendedProviders: matchingProviders,
    primaryProvider: matchingProviders[0] ?? null
  }
}
