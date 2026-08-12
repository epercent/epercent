import { Router } from 'express';

import { getRuntimeEnvironmentValidation } from '../controllers/runtime-environment-validation.controller.js';

const router = Router();

router.get('/', getRuntimeEnvironmentValidation);

export default router;
