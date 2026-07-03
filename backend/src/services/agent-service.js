import { agents } from '../data/agents.js';

const agentRegistry = new Map(agents.map((agent) => [agent.id, agent]));

export function listAgents() {
  return Array.from(agentRegistry.values());
}

export function getAgentById(id) {
  return agentRegistry.get(id) ?? null;
}
