import { Router } from 'express'
import { getProviderGatewayController } from '../controllers/ai-provider-gateway.controller.js'

const router = Router()

router.get('/', getProviderGatewayController)

export default router
