import { Router } from 'express';

import { getObjectById, listObjects } from '../controllers/objects.controller.js';

const router = Router();

router.get('/', listObjects);
router.get('/:id', getObjectById);

export default router;
