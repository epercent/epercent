import { Router } from 'express';

import { getWorkflow, listWorkflowRegistry } from '../controllers/workflows.controller.js';

const router = Router();

router.get('/', listWorkflowRegistry);
router.get('/:id', getWorkflow);

export default router;
