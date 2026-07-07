import express from 'express'
import { getEnterpriseDiscoveryRegistry } from '../controllers/enterprise-discovery-registry.controller.js'

const router = express.Router()

router.get('/', getEnterpriseDiscoveryRegistry)

export default router
