import { agents } from '../data/agents.js';
import { findRecordById, listRecords } from './storage-service.js';

export function listAgents() {
  return listRecords('agents', agents);
}

export function getAgentById(id) {
  return findRecordById('agents', id, agents);
}
