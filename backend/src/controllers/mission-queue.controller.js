import { getMissionQueue } from '../services/mission-queue-service.js'

export function getQueue(req, res) {
  res.json(getMissionQueue())
}
