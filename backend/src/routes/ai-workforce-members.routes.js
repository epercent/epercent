import { Router } from 'express'
import {
  getAiWorkforceMemberController,
  getAiWorkforceProviderHealthController,
  listAiWorkforceMembersController
} from '../controllers/ai-workforce-members.controller.js'

const router = Router()

router.get('/', listAiWorkforceMembersController)
router.get('/health', getAiWorkforceProviderHealthController)
router.get('/:id', getAiWorkforceMemberController)

export default router
