import {
  getAgentKnowledgeObjectById,
  getKnowledgeRepositoryByAgent,
  listAgentKnowledgeObjects,
  listKnowledgeRepositories
} from '../services/agent-knowledge-repository-service.js';

export function listRepositories(_request, response) {
  const repositories = listKnowledgeRepositories();

  response.status(200).json({
    capability: 'EOS-CAP-0015',
    repository: 'EOS-AKR',
    count: repositories.length,
    repositories
  });
}

export function getRepository(request, response) {
  const repository = getKnowledgeRepositoryByAgent(request.params.agent);

  if (!repository) {
    return response.status(404).json({
      error: 'Agent Knowledge Repository not found',
      agent: request.params.agent
    });
  }

  return response.status(200).json(repository);
}

export function listKnowledgeObjects(_request, response) {
  const knowledgeObjects = listAgentKnowledgeObjects();

  response.status(200).json({
    capability: 'EOS-CAP-0015',
    repository: 'EOS-AKR',
    count: knowledgeObjects.length,
    knowledgeObjects
  });
}

export function getKnowledgeObject(request, response) {
  const knowledgeObject = getAgentKnowledgeObjectById(request.params.id);

  if (!knowledgeObject) {
    return response.status(404).json({
      error: 'Agent Knowledge Object not found',
      id: request.params.id
    });
  }

  return response.status(200).json(knowledgeObject);
}
