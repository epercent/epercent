import { generateMissionPackage } from './mission-package-service.js'
import { getProvider } from '../providers/provider-registry.js'

export async function dispatchMission(options = {}) {
  const provider = getProvider(options.provider)
  const generatedMission = generateMissionPackage(options.assignmentId)

  if (generatedMission?.status !== 'READY' || !generatedMission?.missionPackage) {
    return {
      dispatchStatus: 'DISPATCH_FAILED',
      provider: provider.name,
      result: {
        dispatched: false,
        status: 'Mission Package Error',
        reason: 'Mission package could not be generated'
      }
    }
  }

  const result = await provider.submitMission(generatedMission.missionPackage)

  return {
    dispatchStatus: result.dispatched ? 'DISPATCH_COMPLETED' : 'DISPATCH_FAILED',
    provider: provider.name,
    providerId: provider.id,
    providerHealth: provider.health(),
    missionId: generatedMission.missionPackage.missionId ?? null,
    result
  }
}
