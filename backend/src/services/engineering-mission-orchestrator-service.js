import { generateMissionPackage } from './mission-package-service.js'
import { resolveMissionCapability } from './capability-resolver-service.js'
import { dispatchMission } from './provider-dispatch-service.js'

export async function orchestrateEngineeringMission() {
  const missionPackage = generateMissionPackage()
  const capabilityResolution = resolveMissionCapability()
  const dispatch = await dispatchMission()

  return {
    orchestrator: {
      id: 'EOS-ENGINEERING-ORCHESTRATOR',
      version: '1.2.0',
      status: dispatch.result.dispatched ? 'DISPATCH_COMPLETED' : 'DISPATCH_FAILED'
    },
    workflow: [
      'Mission Generated',
      'Capability Resolved',
      'Provider Selected',
      'Mission Dispatched',
      'Provider Result Received'
    ],
    provider: capabilityResolution.primaryProvider,
    missionPackage: missionPackage.missionPackage,
    dispatch,
    dispatchStatus: {
      state: dispatch.result.dispatched ? 'AWAITING_GOVERNANCE_APPROVAL' : 'BLOCKED',
      nextAction: dispatch.result.dispatched
        ? 'Review provider output and approve repository update.'
        : dispatch.result.reason
    }
  }
}
