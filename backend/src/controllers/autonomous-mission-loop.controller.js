import { runAutonomousMissionLoop } from '../services/autonomous-mission-loop-service.js'

export function getAutonomousMissionLoopController(_req, res) {
  res.json(runAutonomousMissionLoop())
}
