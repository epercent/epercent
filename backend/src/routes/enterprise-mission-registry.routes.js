import { Router } from 'express'
import {
  createEnterpriseMissionController,
  listEnterpriseMissionsController
} from '../controllers/enterprise-mission-registry.controller.js'

const router = Router()

router.get('/', listEnterpriseMissionsController)
router.post('/', createEnterpriseMissionController)

export default router
