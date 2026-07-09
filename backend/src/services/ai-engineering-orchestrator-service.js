import { generateMissionPackage } from './mission-package-generator-service.js'
import { dispatchMission } from './ai-provider-dispatcher-service.js'
import { executeLiveMission } from './ai-provider-gateway-service.js'

export async function orchestrateEngineeringCycle() {
  const mission = generateMissionPackage()

  const dispatch = dispatchMission(mission)

  const liveProviderResult = await executeLiveMission(
    mission.execution.provider,
    {
      ...mission,
      prompt: {
        missionId: mission.id,
        prompt: mission.mission.objective
      }
    }
  )

  return {
    orchestratorId: `ORCH-${Date.now()}`,
    startedAt: new Date().toISOString(),
    stage: "Mission Orchestration",
    status: "Running",

    mission,
    dispatch,
    liveProviderResult,

    pipeline: [
      "Mission Generation",
      "Provider Selection",
      "Prompt Generation",
      "Provider Execution",
      "Provider Response",
      "Testing",
      "Governance Review",
      "Commit",
      "Generate Next Mission"
    ],

    currentStep: "Mission Generation",
    nextStep: "Dispatch Mission"
  }
}
