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
        prompt: `
You are Hermes, the AI Engineering Agent for EOS.

Mission ID:
${mission.id}

Objective:
${mission.mission.objective}

Rationale:
${mission.mission.rationale}

Priority:
${mission.mission.priority}

Assigned Office:
${mission.mission.assignedOffice}

Assigned Agent:
${mission.mission.assignedAgent}

Required Capabilities:
${mission.requiredCapabilities.join(', ')}

Affected Areas:
${mission.affectedAreas.join(', ')}

Acceptance Criteria:
- ${mission.acceptanceCriteria.join('\n- ')}

Instructions:
Generate implementation-ready code or a precise implementation plan.
Do not ask for clarification unless the mission is impossible.
Do not modify unrelated files.
Return clear file-level recommendations.
        `.trim()
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
