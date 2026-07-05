import { Router } from 'express'
import { getEngineeringMissionOrchestrator } from '../controllers/engineering-mission-orchestrator.controller.js'

const router = Router()

router.get('/', getEngineeringMissionOrchestrator)

export default router
