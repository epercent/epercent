import { createEnterpriseMission, listEnterpriseMissions } from '../services/enterprise-mission-registry-service.js'

export function listEnterpriseMissionsController(req, res) {
  res.json(listEnterpriseMissions())
}

export function createEnterpriseMissionController(req, res) {
  const mission = createEnterpriseMission(req.body ?? {})
  res.status(201).json(mission)
}
