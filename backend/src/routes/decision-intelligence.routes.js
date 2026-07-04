import { Router } from 'express';

import {
  createDecisionAssessment,
  getDecisionIntelligence
} from '../controllers/decision-intelligence.controller.js';

const router = Router();

router.get('/', getDecisionIntelligence);
router.post('/assess', createDecisionAssessment);

export default router;
