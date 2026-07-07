import { Router } from 'express'
import { runEnterpriseIntelligencePipelineController } from '../controllers/enterprise-intelligence-pipeline-runtime.controller.js'

const router = Router()

router.post('/', runEnterpriseIntelligencePipelineController)

export default router
