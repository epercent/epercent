import { getEngineeringMission } from './engineering-mission-orchestrator-service.js'

export function evaluateEngineeringState() {
  const mission = getEngineeringMission()

  const decision =
    mission.autonomousReady
      ? "Generate Next Mission"
      : "Continue Current Mission"

  return {
    timestamp: new Date().toISOString(),
    currentMission: mission,
    decision,
    rationale:
      decision === "Continue Current Mission"
        ? "Current engineering objective has not yet reached autonomous completion."
        : "Current engineering objective completed. Generate next mission.",
    nextAction:
      decision === "Continue Current Mission"
        ? mission.recommendedMission
        : "Generate engineering package"
  }
}
