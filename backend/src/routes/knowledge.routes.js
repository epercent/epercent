import { Router } from 'express';

import {
  getKnowledgeObject,
  listKnowledgeRegistry
} from '../controllers/knowledge.controller.js';

const router = Router();

router.get('/', listKnowledgeRegistry);
router.get('/:id', getKnowledgeObject);

export default router;
