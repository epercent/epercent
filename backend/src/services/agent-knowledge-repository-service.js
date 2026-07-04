import {
  agentKnowledgeObjects,
  agentKnowledgeRepositories
} from '../data/agent-knowledge-repositories.js';
import { findRecordById, listRecords } from './storage-service.js';

export function listKnowledgeRepositories() {
  return listRecords('agent-knowledge-repositories', agentKnowledgeRepositories);
}

export function getKnowledgeRepositoryByAgent(agent) {
  const requestedAgent = agent.toLowerCase();

  return (
    listKnowledgeRepositories().find(
      (repository) =>
        repository.agentName.toLowerCase() === requestedAgent ||
        repository.agentId.toLowerCase() === requestedAgent
    ) ?? null
  );
}

export function listAgentKnowledgeObjects() {
  return listRecords('agent-knowledge-objects', agentKnowledgeObjects);
}

export function getAgentKnowledgeObjectById(id) {
  return findRecordById('agent-knowledge-objects', id, agentKnowledgeObjects);
}
