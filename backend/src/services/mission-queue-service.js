import { generateEngineeringMissions } from './mission-generator-service.js'
import { engineeringChangeRequests } from '../data/engineering-change-requests.js'

export function getMissionQueue() {
  const generated = generateEngineeringMissions(engineeringChangeRequests)

  return {
    queueStatus: "READY",
    totalMissions: generated.totalMissions,
    readyForDispatch: generated.totalMissions,
    inProgress: 0,
    awaitingApproval: 0,
    completed: 0,
    missions: generated.missions
  }
}
