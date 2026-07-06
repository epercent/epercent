import { generateMissionPackage } from './mission-package-service.js'
import { getProvider } from '../providers/provider-registry.js'

export async function dispatchMission() {
  const provider = getProvider()
  const mission = generateMissionPackage().missionPackage
  const result = await provider.submitMission(mission)

  return {
    dispatchStatus: result.dispatched ? 'DISPATCH_COMPLETED' : 'DISPATCH_FAILED',
    provider: provider.name,
    result
  }
}
