import { Router } from 'express';

import { getAgent, listAgentRegistry } from '../controllers/agents.controller.js';

const router = Router();

router.get('/', listAgentRegistry);
router.get('/:id', getAgent);

export default router;
