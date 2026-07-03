import { workflows } from '../data/workflows.js';

const workflowRegistry = new Map(workflows.map((workflow) => [workflow.id, workflow]));

export function listWorkflows() {
  return Array.from(workflowRegistry.values());
}

export function getWorkflowById(id) {
  return workflowRegistry.get(id) ?? null;
}
