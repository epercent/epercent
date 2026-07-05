import { Router } from 'express'
import { getGeneratedMissions } from '../controllers/mission-generator.controller.js'

const router = Router()

router.get('/', getGeneratedMissions)

export default router
