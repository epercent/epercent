import { Router } from 'express';

import { getPmoOverview, getRoadmap } from '../controllers/pmo.controller.js';

const router = Router();

router.get('/', getPmoOverview);
router.get('/master-roadmap', getRoadmap);

export default router;
