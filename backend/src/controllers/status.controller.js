import { agents } from '../data/agents.js';

export function getStatus(_request, response) {
  response.status(200).json({
    platform: 'EOS',
    version: '0.7.0',
    status: 'Operational',
    uptime: 'Running',
    activeAgents: agents.filter((agent) => agent.status === 'Active').length
  });
}
