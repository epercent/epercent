import { Router } from 'express';

import {
  getStorageCollection,
  getStorageStatus,
  listStorageCollections
} from '../controllers/storage.controller.js';

const router = Router();

router.get('/status', getStorageStatus);
router.get('/collections', listStorageCollections);
router.get('/collections/:name', getStorageCollection);

export default router;
