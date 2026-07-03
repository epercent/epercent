import { Router } from 'express';

import { getEvent, listEventRegistry } from '../controllers/events.controller.js';

const router = Router();

router.get('/', listEventRegistry);
router.get('/:id', getEvent);

export default router;
