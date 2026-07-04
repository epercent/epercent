import { Router } from 'express';

import {
  getMessage,
  getMessageThread,
  getNavigation,
  getPlatform,
  getPlatformAdmin,
  getPlatformAdminAction,
  getPlatformStatus,
  listActivity,
  listAttention,
  listCalendar,
  listMessages,
  listPlatformAdminActions
} from '../controllers/platform-operations.controller.js';

export const platformRouter = Router();
platformRouter.get('/', getPlatform);
platformRouter.get('/status', getPlatformStatus);
platformRouter.get('/admin', getPlatformAdmin);
platformRouter.get('/navigation', getNavigation);

export const adminActionsRouter = Router();
adminActionsRouter.get('/', listPlatformAdminActions);
adminActionsRouter.get('/:id', getPlatformAdminAction);

export const agentMessagesRouter = Router();
agentMessagesRouter.get('/', listMessages);
agentMessagesRouter.get('/threads/:threadId', getMessageThread);
agentMessagesRouter.get('/:id', getMessage);

export const agentActivityRouter = Router();
agentActivityRouter.get('/', listActivity);

export const agentAttentionRouter = Router();
agentAttentionRouter.get('/', listAttention);

export const agentCalendarRouter = Router();
agentCalendarRouter.get('/', listCalendar);
