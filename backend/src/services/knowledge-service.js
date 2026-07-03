import { knowledgeObjects } from '../data/knowledge.js';

const knowledgeRegistry = new Map(
  knowledgeObjects.map((knowledgeObject) => [knowledgeObject.id, knowledgeObject])
);

export function listKnowledgeObjects() {
  return Array.from(knowledgeRegistry.values());
}

export function getKnowledgeObjectById(id) {
  return knowledgeRegistry.get(id) ?? null;
}
