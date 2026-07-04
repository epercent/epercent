import { Router } from 'express';

import {
  getKnowledgeObject,
  getRepository,
  listKnowledgeObjects,
  listRepositories
} from '../controllers/agent-knowledge-repositories.controller.js';

const repositoriesRouter = Router();
const knowledgeObjectsRouter = Router();

repositoriesRouter.get('/', listRepositories);
repositoriesRouter.get('/:agent', getRepository);

knowledgeObjectsRouter.get('/', listKnowledgeObjects);
knowledgeObjectsRouter.get('/:id', getKnowledgeObject);

export { knowledgeObjectsRouter, repositoriesRouter };
