import { Router } from 'express'
import { getMissionPackage } from '../controllers/mission-package.controller.js'

const router = Router()

router.get('/', getMissionPackage)

export default router
