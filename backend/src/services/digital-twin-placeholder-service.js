export function buildDigitalTwinPlaceholder(profile, opportunityAssessment, aiWorkforceRecommendation) {
  return {
    id: `DTP-${Date.now()}`,
    status: 'Initialized',
    enterprise: profile.name,

    twinType: 'Enterprise Digital Twin',
    maturity: 'Foundation',

    layers: [
      { name: 'Identity Layer', status: 'Started' },
      { name: 'Knowledge Layer', status: 'Started' },
      { name: 'Process Layer', status: 'Pending Data' },
      { name: 'System Layer', status: 'Pending Connection' },
      { name: 'Asset Layer', status: 'Pending Validation' },
      { name: 'Value Layer', status: 'Pending Assessment' }
    ],

    buildReadiness: {
      score: opportunityAssessment?.digitalTwinPotential?.score ?? 0,
      status: opportunityAssessment?.digitalTwinPotential?.status ?? 'Pending'
    },

    assignedWorkforce: aiWorkforceRecommendation?.recommendedAgents ?? [],

    nextAction: 'Approve Digital Twin foundation build mission'
  }
}
