import { aiWorkforceMembers } from '../data/ai-workforce-members.js'
import { getProvider } from '../providers/provider-registry.js'

function resolveProviderHealth(member) {
  if (member.provider !== 'OpenAI') {
    return {
      configured: false,
      connected: false,
      health: member.health ?? 'Unknown',
      providerStatus: 'Provider Not Implemented'
    }
  }

  try {
    const provider = getProvider('OPENAI')
    const providerHealth = provider.health()

    return {
      configured: providerHealth.configured === true,
      connected: providerHealth.configured === true,
      health:
        providerHealth.configured === true
          ? 'Available'
          : 'Configuration Required',
      providerStatus: providerHealth.status,
      providerId: provider.id,
      model: providerHealth.model
    }
  } catch (error) {
    return {
      configured: false,
      connected: false,
      health: 'Unavailable',
      providerStatus: 'Provider Error',
      error:
        error instanceof Error
          ? error.message
          : String(error)
    }
  }
}

function enrichMember(member) {
  const providerState =
    resolveProviderHealth(member)

  return {
    ...member,
    connected:
      member.enabled === true &&
      providerState.connected === true,
    health: providerState.health,
    providerStatus:
      providerState.providerStatus,
    providerId:
      providerState.providerId ?? null,
    configured:
      providerState.configured,
    model:
      providerState.model ??
      member.model,
    error:
      providerState.error ?? null
  }
}

export function listAiWorkforceMembers() {
  const members =
    aiWorkforceMembers.map(enrichMember)

  const connected =
    members.filter(
      (member) => member.connected
    ).length

  return {
    members,
    summary: {
      total: members.length,
      enabled:
        members.filter(
          (member) => member.enabled
        ).length,
      connected,
      status:
        connected > 0
          ? 'Operational'
          : 'Configuration Required'
    }
  }
}

export function getAiWorkforceMemberById(id) {
  const member =
    aiWorkforceMembers.find(
      (candidate) =>
        candidate.id === id
    )

  return member
    ? enrichMember(member)
    : null
}

export function getAiWorkforceProviderHealth() {
  const members =
    aiWorkforceMembers.map(enrichMember)

  const enabledMembers =
    members.filter(
      (member) => member.enabled
    )

  const connectedMembers =
    enabledMembers.filter(
      (member) => member.connected
    )

  return {
    status:
      connectedMembers.length > 0
        ? 'Operational'
        : 'Configuration Required',

    configuredProviders:
      connectedMembers.length,

    enabledProviders:
      enabledMembers.length,

    members: members.map(
      (member) => ({
        id: member.id,
        name: member.name,
        provider: member.provider,
        providerId:
          member.providerId,
        enabled: member.enabled,
        connected:
          member.connected,
        configured:
          member.configured,
        health: member.health,
        providerStatus:
          member.providerStatus,
        model: member.model,
        error: member.error
      })
    )
  }
}
