import { Router } from 'express'
import { getQueue } from '../controllers/mission-queue.controller.js'

const router = Router()

router.get('/', getQueue)

export default router
