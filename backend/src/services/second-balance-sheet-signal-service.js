export function buildSecondBalanceSheetSignal(
  profile,
  opportunityAssessment,
  digitalTwinPlaceholder
) {
  return {
    id: `SBS-${Date.now()}`,
    status: 'Signal Generated',

    enterprise: profile.name,

    potentialAssetClass: 'Enterprise Digital Twin Asset',

    estimatedReadiness: {
      score: 71,
      level: 'Emerging'
    },

    valueDrivers: [
      'Enterprise Knowledge',
      'Business Processes',
      'AI Workforce',
      'Digital Twin',
      'Enterprise Data'
    ],

    strategicSignals: [
      'Potential Digital Twin Asset',
      'Potential Enterprise Knowledge Asset',
      'Potential AI Operating Model',
      'Potential Commercialization Pipeline'
    ],

    recommendedNextPhase:
      'Enterprise Digital Twin Generation',

    governance: {
      approvalRequired: true,
      status: 'Awaiting Executive Review'
    }
  }
}
