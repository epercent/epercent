import { Router } from 'express';

import { getAudit } from '../controllers/audit.controller.js';

const router = Router();

router.get('/', getAudit);

export default router;
