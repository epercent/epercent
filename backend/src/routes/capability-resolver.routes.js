import { Router } from 'express'
import { getCapabilityResolution } from '../controllers/capability-resolver.controller.js'

const router = Router()

router.get('/', getCapabilityResolution)

export default router
