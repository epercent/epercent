import { orchestrateEngineeringMission } from '../services/engineering-mission-orchestrator-service.js'

export function getEngineeringMissionOrchestrator(req, res) {
  res.json(orchestrateEngineeringMission())
}
