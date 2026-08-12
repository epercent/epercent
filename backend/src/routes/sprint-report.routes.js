import { Router } from 'express'
import { getSprintReport } from '../controllers/sprint-report.controller.js'

const router = Router()

router.get('/',getSprintReport)

export default router
