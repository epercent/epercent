import { Router } from 'express';

import {
  getDta,
  getGovernance,
  getSecondBalanceSheetOverview,
  getStrategicLayer,
  getStrategicAlignmentOverview,
  getStrategy,
  getValuation,
  listDtas
} from '../controllers/strategy.controller.js';

export const strategyRouter = Router();
export const governanceRouter = Router();
export const valuationRouter = Router();
export const secondBalanceSheetRouter = Router();
export const digitalTwinAssetsRouter = Router();
export const strategicLayerRouter = Router();
export const strategicAlignmentRouter = Router();

strategyRouter.get('/', getStrategy);
governanceRouter.get('/', getGovernance);
valuationRouter.get('/', getValuation);
secondBalanceSheetRouter.get('/', getSecondBalanceSheetOverview);
digitalTwinAssetsRouter.get('/', listDtas);
digitalTwinAssetsRouter.get('/:id', getDta);
strategicLayerRouter.get('/', getStrategicLayer);
strategicAlignmentRouter.get('/', getStrategicAlignmentOverview);
