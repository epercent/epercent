import { Router } from 'express'
import { dispatchMissionController } from '../controllers/provider-dispatch.controller.js'

const router = Router()

router.post('/',dispatchMissionController)

export default router
