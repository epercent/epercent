import { getEngineeringCoordinationOverview } from '../services/engineering-coordination-service.js'

export function getEngineeringCoordinationController(req, res) {
  res.json(getEngineeringCoordinationOverview())
}
