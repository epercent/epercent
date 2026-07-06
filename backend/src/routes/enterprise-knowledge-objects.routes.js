import { Router } from 'express'
import {
  getEnterpriseKnowledgeObjectController,
  listEnterpriseKnowledgeObjectsController
} from '../controllers/enterprise-knowledge-objects.controller.js'

const router = Router()

router.get('/', listEnterpriseKnowledgeObjectsController)
router.get('/:id', getEnterpriseKnowledgeObjectController)

export default router
