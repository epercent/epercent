import { executeMission } from './ai-provider-gateway-service.js'

export function dispatchMission(missionPackage) {
  const provider = missionPackage?.execution?.provider ?? 'Codex'
  const execution = executeMission(provider, missionPackage)

  return {
    dispatchId: `DISPATCH-${Date.now()}`,
    dispatchedAt: new Date().toISOString(),

    provider: execution.provider,
    providerStatus: 'Available',

    missionId: missionPackage.id,
    objective: missionPackage.mission.objective,

    assignedAgent: missionPackage.mission.assignedAgent,
    assignedOffice: missionPackage.mission.assignedOffice,

    execution: {
      executionId: execution.executionId,
      state: 'Queued',
      autonomousMode: missionPackage.execution.autonomousReady,
      approval: missionPackage.execution.mode,
      gatewayStatus: execution.status,
      runtime: execution.runtime
    },

    nextStep: execution.nextStep,

    status: 'Ready'
  }
}
