import { getWorkflowById, listWorkflows } from '../services/workflow-service.js';
import { listEventTypes } from '../services/event-service.js';

export function listWorkflowRegistry(_request, response) {
  const workflows = listWorkflows();

  response.status(200).json({
    capability: 'EOS-CAP-0007',
    eventModel: 'EOS Events',
    eventTypes: listEventTypes(),
    count: workflows.length,
    workflows
  });
}

export function getWorkflow(request, response) {
  const workflow = getWorkflowById(request.params.id);

  if (!workflow) {
    return response.status(404).json({
      error: 'Workflow not found',
      id: request.params.id
    });
  }

  return response.status(200).json(workflow);
}
