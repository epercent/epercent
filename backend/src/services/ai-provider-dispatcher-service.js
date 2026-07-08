export function dispatchMission(missionPackage) {
  return {
    dispatchId: `DISPATCH-${Date.now()}`,
    dispatchedAt: new Date().toISOString(),

    provider: "Codex",
    providerStatus: "Available",

    missionId: missionPackage.id,
    objective: missionPackage.mission.objective,

    assignedAgent: missionPackage.mission.assignedAgent,
    assignedOffice: missionPackage.mission.assignedOffice,

    execution: {
      state: "Queued",
      autonomousMode: missionPackage.execution.autonomousReady,
      approval: missionPackage.execution.mode
    },

    nextStep: "Submit mission to AI provider",

    status: "Ready"
  }
}
