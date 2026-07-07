import { Router } from 'express'
import { getEnterpriseIntelligencePipelineController } from '../controllers/enterprise-intelligence-pipeline.controller.js'

const router = Router()

router.get('/', getEnterpriseIntelligencePipelineController)

export default router
