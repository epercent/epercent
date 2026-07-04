import { knowledgeObjects } from '../data/knowledge.js';
import { findRecordById, listRecords } from './storage-service.js';

export function listKnowledgeObjects() {
  return listRecords('knowledge-objects', knowledgeObjects);
}

export function getKnowledgeObjectById(id) {
  return findRecordById('knowledge-objects', id, knowledgeObjects);
}
