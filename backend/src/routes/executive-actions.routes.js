import { Router } from 'express';

import {
  getAction,
  listActions,
  listPendingApproval
} from '../controllers/executive-actions.controller.js';

const router = Router();

router.get('/', listActions);
router.get('/pending-approval', listPendingApproval);
router.get('/:id', getAction);

export default router;
