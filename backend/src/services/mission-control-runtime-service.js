export function buildMissionControlRuntime(discoveryResult) {
  const profile = discoveryResult?.profile ?? {}

  return {
    runtime: {
      id: 'EOS-MISSION-CONTROL-RUNTIME',
      version: '0.1.0',
      status: 'ACTIVE'
    },

    enterprise: {
      name: profile.name ?? 'Unknown Entity',
      entityType: profile.entityType ?? 'Enterprise',
      source: profile.source ?? '',
      sourceType: profile.sourceType ?? ''
    },

    digitalIntelligenceProfile: {
      id: profile.id ?? '',
      status: profile.status ?? 'Generated',
      confidenceScore: profile.confidenceScore ?? 0,
      intelligenceSummary: profile.intelligenceSummary ?? '',
      discoveredSignals: profile.discoveredSignals ?? [],
      missingInformation: profile.missingInformation ?? []
    },

    discoveryStatus: {
      status: profile.status ?? 'Generated',
      confidenceScore: profile.confidenceScore ?? 0
    },

    aiWorkforceStatus: {
      recommendedActions: profile.recommendedNextActions ?? []
    },

    digitalTwinStatus: {
      status: 'Pending'
    },

    valueIntelligenceStatus: {
      status: 'Pending'
    },

    governanceStatus: {
      approvalRequired: true,
      status: 'Awaiting Review'
    },

    recommendedActions: profile.recommendedNextActions ?? [],

    currentWorkspace: 'enterprise-value',

    nextStage: 'Mission Control'
  }
}
