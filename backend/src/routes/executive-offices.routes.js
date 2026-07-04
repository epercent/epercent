import { Router } from 'express';

import {
  getOffice,
  listOffices
} from '../controllers/executive-offices.controller.js';

const router = Router();

router.get('/', listOffices);
router.get('/:id', getOffice);

export default router;
