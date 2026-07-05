import { Router } from 'express'
import { getAssignmentEngineController } from '../controllers/assignment-engine.controller.js'

const router = Router()

router.get('/', getAssignmentEngineController)

export default router
