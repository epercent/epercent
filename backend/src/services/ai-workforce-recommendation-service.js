export function buildAiWorkforceRecommendation(profile, opportunityAssessment) {
  return {
    id: `AWR-${Date.now()}`,
    status: 'Generated',
    enterprise: profile.name,

    recommendedOffices: [
      {
        office: 'Architecture Office',
        priority: 'High',
        mission: 'Map enterprise structure and define initial Digital Twin architecture.'
      },
      {
        office: 'Knowledge Office',
        priority: 'High',
        mission: 'Organize discovered intelligence into reusable enterprise knowledge.'
      },
      {
        office: 'Engineering Office',
        priority: 'Medium',
        mission: 'Prepare integrations, data pipelines, and automation workflows.'
      },
      {
        office: 'Commercialization Office',
        priority: 'Strategic',
        mission: 'Identify monetizable Digital Twin Asset opportunities.'
      }
    ],

    recommendedAgents: [
      'Atlas — Enterprise Architecture',
      'Hermes — Knowledge Structuring',
      'Athena — Research and Intelligence',
      'Codex — Engineering Automation',
      'Mercury — Opportunity Development'
    ],

    firstMission: opportunityAssessment?.nextRecommendedMission ?? 'Generate Initial Digital Twin',

    governance: {
      approvalRequired: true,
      status: 'Awaiting Human Approval'
    }
  }
}
