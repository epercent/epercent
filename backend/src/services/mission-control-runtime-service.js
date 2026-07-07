export function buildMissionControlRuntime(discoveryResult) {
  const profile = discoveryResult?.profile ?? {}
  const opportunityAssessment = discoveryResult?.opportunityAssessment ?? null
  const aiWorkforceRecommendation = discoveryResult?.aiWorkforceRecommendation ?? null
  const digitalTwinPlaceholder = discoveryResult?.digitalTwinPlaceholder ?? null
  const secondBalanceSheetSignal = discoveryResult?.secondBalanceSheetSignal ?? null

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
      status: aiWorkforceRecommendation ? 'Recommended' : 'Pending',
      recommendedActions: profile.recommendedNextActions ?? [],
      recommendedOffices: aiWorkforceRecommendation?.recommendedOffices ?? [],
      recommendedAgents: aiWorkforceRecommendation?.recommendedAgents ?? [],
      firstMission: aiWorkforceRecommendation?.firstMission ?? null
    },

    digitalTwinStatus: {
      status: digitalTwinPlaceholder?.status ?? 'Pending',
      twinType: digitalTwinPlaceholder?.twinType ?? 'Enterprise Digital Twin',
      maturity: digitalTwinPlaceholder?.maturity ?? 'Pending',
      buildReadiness: digitalTwinPlaceholder?.buildReadiness ?? null,
      layers: digitalTwinPlaceholder?.layers ?? []
    },

    valueIntelligenceStatus: {
      status: opportunityAssessment ? 'Generated' : 'Pending',
      enterpriseIntelligenceScore: opportunityAssessment?.enterpriseIntelligenceScore ?? 0,
      aiReadiness: opportunityAssessment?.aiReadiness ?? null,
      commercializationPotential: opportunityAssessment?.commercializationPotential ?? null
    },

    secondBalanceSheetStatus: {
      status: secondBalanceSheetSignal?.status ?? 'Pending',
      readiness: secondBalanceSheetSignal?.estimatedReadiness ?? null,
      assetClass: secondBalanceSheetSignal?.potentialAssetClass ?? null,
      valueDrivers: secondBalanceSheetSignal?.valueDrivers ?? [],
      strategicSignals: secondBalanceSheetSignal?.strategicSignals ?? []
    },

    opportunityAssessment,

    aiWorkforceRecommendation,

    digitalTwinPlaceholder,

    secondBalanceSheetSignal,

    governanceStatus: {
      approvalRequired: true,
      status: 'Awaiting Review'
    },

    recommendedActions: profile.recommendedNextActions ?? [],

    currentWorkspace: 'enterprise-value',

    nextStage: 'Mission Control'
  }
}
