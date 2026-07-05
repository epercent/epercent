import { getAssignmentEngine } from '../services/assignment-engine-service.js'

export function getAssignmentEngineController(req, res) {
  res.json(getAssignmentEngine())
}
