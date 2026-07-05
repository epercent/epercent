import { generateMissionPackage } from '../services/mission-package-service.js'

export function getMissionPackage(req, res) {
  res.json(generateMissionPackage())
}
