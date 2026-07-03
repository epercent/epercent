import { getAgentById, listAgents } from '../services/agent-service.js';

export function listAgentRegistry(_request, response) {
  const agents = listAgents();

  response.status(200).json({
    capability: 'EOS-CAP-0005',
    count: agents.length,
    agents
  });
}

export function getAgent(request, response) {
  const agent = getAgentById(request.params.id);

  if (!agent) {
    return response.status(404).json({
      error: 'Agent not found',
      id: request.params.id
    });
  }

  return response.status(200).json(agent);
}
