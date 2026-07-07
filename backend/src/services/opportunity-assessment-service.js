export function buildOpportunityAssessment(profile) {
  return {
    id: `OA-${Date.now()}`,
    status: 'Generated',

    enterprise: profile.name,

    enterpriseIntelligenceScore: 62,

    aiReadiness: {
      score: 58,
      level: 'Moderate'
    },

    commercializationPotential: {
      score: 81,
      level: 'High'
    },

    digitalTwinPotential: {
      score: 76,
      status: 'Recommended'
    },

    opportunities: [
      {
        title: 'Digital Twin Creation',
        priority: 'High'
      },
      {
        title: 'Enterprise Knowledge Consolidation',
        priority: 'High'
      },
      {
        title: 'AI Workforce Deployment',
        priority: 'Medium'
      },
      {
        title: 'Second Balance Sheet',
        priority: 'Strategic'
      }
    ],

    nextRecommendedMission:
      'Generate Initial Digital Twin'
  }
}
