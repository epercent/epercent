import { Router } from 'express'
import { getAutonomousMissionLoopController } from '../controllers/autonomous-mission-loop.controller.js'

const router = Router()

router.get('/', getAutonomousMissionLoopController)

export default router
