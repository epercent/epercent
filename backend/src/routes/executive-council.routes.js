import { Router } from 'express';

import {
  getExecutiveProfile,
  listExecutiveCouncil
} from '../controllers/executive-council.controller.js';

const router = Router();

router.get('/', listExecutiveCouncil);
router.get('/:id', getExecutiveProfile);

export default router;
