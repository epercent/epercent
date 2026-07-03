import {
  getKnowledgeObjectById,
  listKnowledgeObjects
} from '../services/knowledge-service.js';

export function listKnowledgeRegistry(_request, response) {
  const knowledge = listKnowledgeObjects();

  response.status(200).json({
    capability: 'EOS-CAP-0006',
    count: knowledge.length,
    knowledge
  });
}

export function getKnowledgeObject(request, response) {
  const knowledgeObject = getKnowledgeObjectById(request.params.id);

  if (!knowledgeObject) {
    return response.status(404).json({
      error: 'Knowledge Object not found',
      id: request.params.id
    });
  }

  return response.status(200).json(knowledgeObject);
}
