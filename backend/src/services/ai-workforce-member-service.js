import { aiWorkforceMembers } from '../data/ai-workforce-members.js'

export function listAiWorkforceMembers() {
  return {
    members: aiWorkforceMembers,
    summary: {
      total: aiWorkforceMembers.length,
      enabled: aiWorkforceMembers.filter((member) => member.enabled).length,
      connected: aiWorkforceMembers.filter((member) => member.connected).length,
      status: 'Operational'
    }
  }
}

export function getAiWorkforceMemberById(id) {
  return aiWorkforceMembers.find((member) => member.id === id) ?? null
}

export function getAiWorkforceProviderHealth() {
  return {
    status: 'Configuration Required',
    message: 'Provider registry is available. Credentials and live provider health checks are pending.',
    members: aiWorkforceMembers.map((member) => ({
      id: member.id,
      name: member.name,
      provider: member.provider,
      enabled: member.enabled,
      connected: member.connected,
      health: member.health,
      model: member.model
    }))
  }
}
