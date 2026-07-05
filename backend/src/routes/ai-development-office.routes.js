import { Router } from 'express'
import { getAiDevelopmentOfficeController } from '../controllers/ai-development-office.controller.js'

const router = Router()

router.get('/', getAiDevelopmentOfficeController)

export default router
