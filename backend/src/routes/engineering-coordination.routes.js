import { Router } from 'express'
import { getEngineeringCoordinationController } from '../controllers/engineering-coordination.controller.js'

const router = Router()

router.get('/', getEngineeringCoordinationController)

export default router
