import { Router } from 'express';

import {
  getDigitalTwinHome,
  getEnterpriseTelemetry,
  getEnterpriseTelemetryForEnterprise,
  getEnterpriseVisual,
  getEnterpriseVisuals,
  getMasterMonitoring
} from '../controllers/enterprise-visuals.controller.js';

export const masterMonitoringRouter = Router();
export const enterpriseTelemetryRouter = Router();
export const enterpriseVisualsRouter = Router();
export const digitalTwinHomeRouter = Router();

masterMonitoringRouter.get('/', getMasterMonitoring);
enterpriseVisualsRouter.get('/', getEnterpriseVisuals);
enterpriseVisualsRouter.get('/:id', getEnterpriseVisual);
enterpriseTelemetryRouter.get('/', getEnterpriseTelemetry);
enterpriseTelemetryRouter.get('/:enterpriseId', getEnterpriseTelemetryForEnterprise);
digitalTwinHomeRouter.get('/:enterpriseId', getDigitalTwinHome);
