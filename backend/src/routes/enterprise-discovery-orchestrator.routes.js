import { Router } from 'express'
import { runEnterpriseDiscoveryController } from '../controllers/enterprise-discovery-orchestrator.controller.js'

const router = Router()

router.post('/', runEnterpriseDiscoveryController)

export default router
