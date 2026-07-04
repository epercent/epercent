import { Router } from 'express';

import { getKernelManifest } from '../controllers/kernel.controller.js';

const router = Router();

router.get('/', getKernelManifest);

export default router;
