import { workflows } from '../data/workflows.js';
import { findRecordById, listRecords } from './storage-service.js';

export function listWorkflows() {
  return listRecords('workflows', workflows);
}

export function getWorkflowById(id) {
  return findRecordById('workflows', id, workflows);
}
