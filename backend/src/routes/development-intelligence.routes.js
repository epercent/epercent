import { Router } from 'express'
import { getDevelopmentIntelligenceController } from '../controllers/development-intelligence.controller.js'

const router = Router()

router.get('/', getDevelopmentIntelligenceController)

export default router
