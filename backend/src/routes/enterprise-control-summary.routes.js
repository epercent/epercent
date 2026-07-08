import { Router } from 'express'
import { getEnterpriseControlSummaryController } from '../controllers/enterprise-control-summary.controller.js'

const router = Router()

router.get('/', getEnterpriseControlSummaryController)

export default router
