import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

import agentsRoutes from './routes/agents.routes.js';
import eventsRoutes from './routes/events.routes.js';
import knowledgeRoutes from './routes/knowledge.routes.js';
import objectsRoutes from './routes/objects.routes.js';
import statusRoutes from './routes/status.routes.js';
import workflowsRoutes from './routes/workflows.routes.js';
import { notFound } from './middleware/not-found.js';
import { errorHandler } from './middleware/error-handler.js';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(morgan('combined'));

  app.use('/api/agents', agentsRoutes);
  app.use('/api/events', eventsRoutes);
  app.use('/api/knowledge', knowledgeRoutes);
  app.use('/api/status', statusRoutes);
  app.use('/api/objects', objectsRoutes);
  app.use('/api/workflows', workflowsRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
