import { Router } from 'express'
import { getEnterpriseIntelligencePipelineRunRegistryController } from '../controllers/enterprise-intelligence-pipeline-run-registry.controller.js'

const router = Router()

router.get('/', getEnterpriseIntelligencePipelineRunRegistryController)

export default router
