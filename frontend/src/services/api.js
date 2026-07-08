const API_BASE_URL =
  import.meta.env.VITE_EOS_API_BASE_URL ?? `${window.location.protocol}//${window.location.hostname}:3000`

export function resolveApiUrl(path) {
  if (!path) {
    return ''
  }

  if (/^https?:\/\//i.test(path)) {
    return path
  }

  return `${API_BASE_URL}${path}`
}

async function requestJson(path) {
  const response = await fetch(resolveApiUrl(path))

  if (!response.ok) {
    throw new Error(`EOS Core API returned ${response.status} for ${path}`)
  }

  return response.json()
}

async function sendJson(path, body) {
  const response = await fetch(resolveApiUrl(path), {
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })

  if (!response.ok) {
    throw new Error(`EOS Core API returned ${response.status} for ${path}`)
  }

  return response.json()
}

export function fetchCoreStatus() {
  return requestJson('/api/status')
}

export function fetchEnterpriseObjects() {
  return requestJson('/api/objects')
}

export function fetchAgents() {
  return requestJson('/api/agents')
}

export function fetchExecutiveCouncil() {
  return requestJson('/api/executive-council')
}

export function fetchExecutiveOffices() {
  return requestJson('/api/executive-offices')
}

export function fetchExecutiveActions() {
  return requestJson('/api/executive-actions')
}

export function fetchKnowledgeRepositories() {
  return requestJson('/api/knowledge-repositories')
}

export function fetchPmo() {
  return requestJson('/api/pmo')
}

export function fetchPlatform() {
  return requestJson('/api/platform')
}

export function fetchPlatformAdmin() {
  return requestJson('/api/platform/admin')
}

export function fetchAudit() {
  return requestJson('/api/audit')
}

export function fetchPlatformNavigation() {
  return requestJson('/api/platform/navigation')
}

export function fetchAdminActions() {
  return requestJson('/api/admin-actions')
}

export function fetchAgentMessages() {
  return requestJson('/api/agent-messages')
}

export function fetchAgentActivity() {
  return requestJson('/api/agent-activity')
}

export function fetchAgentAttention() {
  return requestJson('/api/agent-attention')
}

export function fetchAgentCalendar() {
  return requestJson('/api/agent-calendar')
}

export function fetchStorageStatus() {
  return requestJson('/api/storage/status')
}

export function fetchStorageCollections() {
  return requestJson('/api/storage/collections')
}

export function fetchStrategicAlignment() {
  return requestJson('/api/strategic-alignment')
}

export function fetchMasterMonitoring() {
  return requestJson('/api/master-monitoring')
}

export function fetchOnboardingAssimilation() {
  return requestJson('/api/onboarding-assimilation')
}

export function fetchStartupExperience() {
  return requestJson('/api/startup')
}

export function fetchIdentityMedia() {
  return requestJson('/api/identity-media')
}

export function fetchOrganizationIntake() {
  return requestJson('/api/organization-intake')
}

export function uploadIdentityMedia(payload) {
  return sendJson('/api/identity-media/upload', payload)
}

export function importOrganizationSource(payload) {
  return sendJson('/api/organization-intake/import', payload)
}

export function createRepositoryLink(payload) {
  return sendJson('/api/repository-links', payload)
}

export async function fetchStrategicLayer() {
  const [
    strategy,
    governance,
    valuation,
    secondBalanceSheet,
    digitalTwinAssets,
  ] = await Promise.all([
    requestJson('/api/strategy'),
    requestJson('/api/governance'),
    requestJson('/api/valuation'),
    requestJson('/api/second-balance-sheet'),
    requestJson('/api/digital-twin-assets'),
  ])

  return {
    strategy: strategy.strategy,
    roadmapAlignment: strategy.roadmapAlignment,
    governance: governance.governance,
    valuation: valuation.valuation,
    secondBalanceSheet: secondBalanceSheet.secondBalanceSheet,
    dtaMonitoring: digitalTwinAssets.monitoring,
    digitalTwinAssets: digitalTwinAssets.assets,
    strategicAlignment: null,
    investorReadinessNotes: [
      'Strategy, governance, valuation, and DTA monitoring are aligned for executive review.',
      valuation.valuation.estimateBasis,
      'Second Balance Sheet metrics require governance approval before external use.',
    ],
  }
}

export function fetchKnowledgeRepository(agent) {
  return requestJson(`/api/knowledge-repositories/${agent}`)
}

export function fetchKnowledgeObject(id) {
  return requestJson(`/api/knowledge-objects/${id}`)
}

export function fetchKernel() {
  return requestJson('/api/kernel')
}

export function fetchDecisionIntelligence() {
  return requestJson('/api/decision-intelligence')
}

export function fetchAiDevelopmentOffice() {
  return requestJson('/api/ai-development-office')
}

export function fetchAiWorkforceMembers() {
  return requestJson('/api/ai-workforce-members')
}

export function fetchAiWorkforceProviderHealth() {
  return requestJson('/api/ai-workforce-members/health')
}


export function fetchMissionControlRuntime(payload) {
  return sendJson('/api/enterprise-discovery', payload)
}


export function fetchEnterpriseControlSummary() {
  return requestJson('/api/enterprise-control-summary')
}

export function fetchSprintReport() {
  return requestJson('/api/sprint-report')
}
