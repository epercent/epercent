const strategyTimestamp = '2026-07-03T19:20:00.000Z';
const valuationDisclaimer = 'Internal EOS estimate only. Not financial advice. Not an audited valuation.';

function makeLiveStatus({
  status,
  lifecycleStatus,
  healthScore,
  progress,
  summary,
  requiresAttention,
  attentionLevel,
  recommendedAction,
  availableActions
}) {
  return {
    status,
    operationalStatus: status,
    lifecycleStatus,
    healthScore,
    progress,
    summary,
    lastActivity: strategyTimestamp,
    requiresAttention,
    attentionLevel,
    recommendedAction,
    availableActions
  };
}

export const strategicObjectives = [
  {
    id: 'EOS-SO-001',
    name: 'Establish EOS as the AI-native enterprise operating system.',
    owner: 'CEO',
    priority: 'Critical',
    linkedPrograms: ['EOS-PROG-ENGINEERING-FOUNDATION', 'EOS-PROG-EXECUTIVE-AI-WORKFORCE']
  },
  {
    id: 'EOS-SO-002',
    name: 'Create the Digital Twin Asset platform and reference implementation.',
    owner: 'Atlas',
    priority: 'High',
    linkedPrograms: ['EOS-PROG-DTAP', 'EOS-PROG-DTAM', 'EOS-PROG-DTAX']
  },
  {
    id: 'EOS-SO-003',
    name: 'Define and commercialize the Second Balance Sheet thesis.',
    owner: 'Athena',
    priority: 'High',
    linkedPrograms: ['EOS-PROG-SECOND-BALANCE-SHEET', 'EOS-PROG-RESEARCH-PUBLICATIONS']
  },
  {
    id: 'EOS-SO-004',
    name: 'Convert platform progress into investor-ready enterprise value evidence.',
    owner: 'CTO',
    priority: 'High',
    linkedPrograms: ['EOS-PROG-INVESTOR-READINESS', 'EOS-PROG-COMMERCIAL-LAUNCH']
  },
  {
    id: 'EOS-SO-005',
    name: 'Build governed opportunity intelligence and commercialization pathways.',
    owner: 'Mercury',
    priority: 'Medium',
    linkedPrograms: ['EOS-PROG-OPPORTUNITY-ENGINE', 'EOS-PROG-COMMERCIAL-LAUNCH']
  }
];

export const enterpriseStrategy = {
  id: 'EOS-ENTERPRISE-STRATEGY',
  name: 'ePercent / EOS Enterprise Strategy',
  owner: 'Eric Olo',
  status: 'Awaiting Governance Review',
  vision:
    'Build ePercent and EOS into a living digital enterprise where strategy, operations, knowledge, assets, and governance are managed through live Enterprise Objects.',
  mission:
    'Use EOS as the reference implementation for an AI-native enterprise operating system that creates, governs, and commercializes Digital Twin Assets and Second Balance Sheet value.',
  strategicObjectives,
  businessModel: {
    customerSegments: ['Enterprise transformation leaders', 'Governments', 'Institutional investors', 'Strategic partners'],
    revenueStreams: ['Platform licensing', 'Enterprise implementation', 'Digital Twin Asset services', 'Research and advisory'],
    valueProposition:
      'EOS connects executive governance, live operating state, knowledge assets, workflows, and valuation narratives in one governed platform.',
    commercializationPath: ['Alpha reference implementation', 'Investor readiness package', 'Enterprise pilot', 'Version 1.0 launch']
  },
  approvedBy: ['Eric Olo', 'Chief Technology Officer'],
  approvalStatus: 'Awaiting Review',
  effectiveDate: '2026-07-03',
  reviewCycle: 'Monthly',
  linkedPrograms: [
    'EOS-PROG-ENGINEERING-FOUNDATION',
    'EOS-PROG-EXECUTIVE-AI-WORKFORCE',
    'EOS-PROG-DTAP',
    'EOS-PROG-DTAM',
    'EOS-PROG-DTAX',
    'EOS-PROG-SECOND-BALANCE-SHEET',
    'EOS-PROG-OPPORTUNITY-ENGINE',
    'EOS-PROG-RESEARCH-PUBLICATIONS',
    'EOS-PROG-INVESTOR-READINESS',
    'EOS-PROG-COMMERCIAL-LAUNCH'
  ],
  linkedRoadmap: 'EOS-MASTER-ROADMAP',
  linkedGovernanceObjects: ['EOS-GOVERNANCE-COUNCIL', 'EOS-EXECUTIVE-COUNCIL', 'EOS-APPROVAL-QUEUE'],
  linkedValuationModel: 'EOS-DIGITAL-ENTERPRISE-VALUATION',
  linkedSecondBalanceSheet: 'EOS-SECOND-BALANCE-SHEET',
  liveStatus: makeLiveStatus({
    status: 'Amber',
    lifecycleStatus: 'Review',
    healthScore: 86,
    progress: 58,
    summary: 'Enterprise Strategy is defined and awaiting formal governance review.',
    requiresAttention: true,
    attentionLevel: 'Medium',
    recommendedAction: 'Review and approve strategic objectives before financial modeling or investment decisions.',
    availableActions: ['Review strategy', 'Review roadmap alignment', 'Request governance review']
  })
};

export const governanceCouncil = {
  id: 'EOS-GOVERNANCE-COUNCIL',
  name: 'EOS Governance Council',
  owner: 'CEO',
  status: 'Active Review',
  strategyApprovalStatus: 'Awaiting Review',
  roadmapApprovalStatus: 'Conditionally Approved',
  valuationApprovalStatus: 'Internal Estimate Only',
  secondBalanceSheetApprovalStatus: 'Draft Methodology',
  lastGovernanceReview: '2026-07-03',
  nextGovernanceReview: '2026-07-10',
  requiredApprovals: [
    { id: 'EOS-GOV-APPROVAL-STRATEGY', owner: 'Eric Olo', status: 'Awaiting Review' },
    { id: 'EOS-GOV-APPROVAL-VALUATION', owner: 'Chief Technology Officer', status: 'Pending Assessment' },
    { id: 'EOS-GOV-APPROVAL-SBS', owner: 'Athena', status: 'Draft' }
  ],
  openGovernanceItems: [
    'Approve enterprise strategy for Alpha.',
    'Review valuation assumptions before investor use.',
    'Confirm Second Balance Sheet methodology language.',
    'Define DTA governance checklist for commercial pilots.'
  ],
  approvedStrategicObjectives: ['EOS-SO-001'],
  liveStatus: makeLiveStatus({
    status: 'Amber',
    lifecycleStatus: 'Review',
    healthScore: 82,
    progress: 45,
    summary: 'Governance Council is active with strategy and valuation approvals pending.',
    requiresAttention: true,
    attentionLevel: 'Medium',
    recommendedAction: 'Schedule governance review for strategy, valuation assumptions, and DTA formation criteria.',
    availableActions: ['Review approvals', 'Review governance items', 'Approve strategic objective']
  })
};

export const digitalEnterpriseValuation = {
  id: 'EOS-DIGITAL-ENTERPRISE-VALUATION',
  name: 'EOS Digital Enterprise Valuation Foundation',
  valuationDate: '2026-07-03',
  currency: 'USD',
  estimateBasis: valuationDisclaimer,
  baseEnterpriseValue: 1000000,
  digitalEnterpriseValue: 2500000,
  secondBalanceSheetValue: 850000,
  knowledgeAssetValue: 250000,
  agentWorkforceValue: 300000,
  digitalTwinAssetValue: 500000,
  operationalEfficiencyValue: 200000,
  riskReductionValue: 150000,
  opportunityPipelineValue: 350000,
  valuationConfidence: 'Low',
  valuationMethod:
    'Internal directional estimate combining platform maturity, knowledge assets, agent workforce design, DTA formation, operational efficiency, risk reduction, and opportunity pipeline signals.',
  valueDrivers: [
    'Persistent platform data',
    'Live Enterprise Objects',
    'Executive AI Workforce',
    'Digital Twin Asset formation',
    'Research and IP pipeline',
    'Mission Control investor demonstration readiness'
  ],
  valuationNotes: [
    valuationDisclaimer,
    'Values are placeholders for governance alignment and should not be used for securities, investment, tax, or accounting decisions.',
    'Future capabilities must replace placeholders with approved assumptions, audit trails, and scenario modeling.'
  ],
  liveStatus: makeLiveStatus({
    status: 'Amber',
    lifecycleStatus: 'Draft',
    healthScore: 74,
    progress: 34,
    summary: 'Digital Enterprise Valuation model exists as an internal placeholder framework.',
    requiresAttention: true,
    attentionLevel: 'High',
    recommendedAction: 'Do not present values as audited valuation; review assumptions before investor use.',
    availableActions: ['Review valuation assumptions', 'Review value drivers', 'Request valuation governance']
  })
};

export const secondBalanceSheet = {
  id: 'EOS-SECOND-BALANCE-SHEET',
  name: 'EOS Second Balance Sheet Metrics',
  knowledgeAssets: 5,
  agentAssets: 7,
  liveEnterpriseObjects: 140,
  digitalTwinAssets: 3,
  researchAssets: 4,
  workflowAssets: 28,
  opportunityAssets: 1,
  governanceAssets: 8,
  estimatedDigitalAssetValue: 850000,
  currency: 'USD',
  confidenceLevel: 'Low',
  lastUpdated: strategyTimestamp,
  methodologyStatus: 'Draft Internal Methodology',
  estimateBasis: valuationDisclaimer,
  liveStatus: makeLiveStatus({
    status: 'Amber',
    lifecycleStatus: 'Draft',
    healthScore: 78,
    progress: 42,
    summary: 'Second Balance Sheet metrics are seeded as a draft internal operating-value framework.',
    requiresAttention: true,
    attentionLevel: 'Medium',
    recommendedAction: 'Review methodology before external reporting or financial interpretation.',
    availableActions: ['Review metrics', 'Review methodology', 'Prepare research note']
  })
};

export const dtaMonitoring = {
  id: 'EOS-DTA-MONITORING',
  name: 'Digital Twin Asset Monitoring',
  owner: 'Atlas',
  status: 'Operational',
  totalDigitalTwinAssets: 3,
  inFormation: 1,
  underReview: 1,
  underValuation: 0,
  activeMonitoring: 1,
  commercialized: 0,
  paused: 0,
  requiresAttention: 2,
  topDtaCandidates: ['DTA-EPERCENT-001', 'DTA-EOS-001', 'DTA-OIL-001'],
  liveStatus: makeLiveStatus({
    status: 'Amber',
    lifecycleStatus: 'In Progress',
    healthScore: 81,
    progress: 46,
    summary: 'DTA monitoring is active with ePercent in formation, EOS under active monitoring, and Oil & Gas seeded as a demonstration twin.',
    requiresAttention: true,
    attentionLevel: 'Medium',
    recommendedAction: 'Define DTA valuation criteria before commercialization.',
    availableActions: ['Review DTA candidates', 'Review valuation status', 'Request governance review']
  })
};

export const digitalTwinAssets = [
  {
    id: 'DTA-EPERCENT-001',
    name: 'ePercent Enterprise Digital Twin',
    status: 'Formation',
    owner: 'Eric Olo',
    description:
      'ePercent as the first enterprise running on EOS and serving as the reference implementation.',
    assetType: 'Enterprise Digital Twin',
    linkedEnterpriseObjects: ['EOS-ENTERPRISE-STRATEGY', 'EOS-MASTER-ROADMAP', 'EOS-DIGITAL-ENTERPRISE-VALUATION'],
    linkedPrograms: ['EOS-PROG-DTAP', 'EOS-PROG-SECOND-BALANCE-SHEET', 'EOS-PROG-COMMERCIAL-LAUNCH'],
    valuationStatus: 'Pending Assessment',
    commercializationStatus: 'Not Started',
    governanceStatus: 'Awaiting Review',
    lifecycleStage: 'Enterprise Model',
    lifecycleProgress: 38,
    liveStatus: makeLiveStatus({
      status: 'Amber',
      lifecycleStatus: 'Building',
      healthScore: 76,
      progress: 38,
      summary: 'ePercent Enterprise Digital Twin is in formation as the EOS reference implementation.',
      requiresAttention: true,
      attentionLevel: 'Medium',
      recommendedAction: 'Approve DTA formation criteria and define reference implementation scope.',
      availableActions: ['Review DTA scope', 'Review governance status', 'Prepare valuation assumptions']
    })
  },
  {
    id: 'DTA-EOS-001',
    name: 'EOS Platform Digital Twin',
    status: 'Active Monitoring',
    owner: 'EOS PMO',
    description:
      'EOS as a live platform asset and foundation for Digital Enterprise Headquarters.',
    assetType: 'Platform Digital Twin',
    linkedEnterpriseObjects: ['EOS-PERSISTENT-DATA-STORE', 'EOS-MC-001', 'EOS-DIGITAL-ENTERPRISE-HEADQUARTERS'],
    linkedPrograms: ['EOS-PROG-DTAP', 'EOS-PROG-INVESTOR-READINESS'],
    valuationStatus: 'Internal Estimate Only',
    commercializationStatus: 'Pilot Candidate',
    governanceStatus: 'Monitoring',
    lifecycleStage: 'Monitoring',
    lifecycleProgress: 62,
    liveStatus: makeLiveStatus({
      status: 'Green',
      lifecycleStatus: 'In Progress',
      healthScore: 88,
      progress: 62,
      summary: 'EOS Platform Digital Twin is actively monitored through live platform objects and Mission Control.',
      requiresAttention: false,
      attentionLevel: 'No Action Required',
      recommendedAction: 'Continue strengthening data persistence, governance, and valuation evidence.',
      availableActions: ['Review platform twin', 'Review storage health', 'Review investor readiness']
    })
  },
  {
    id: 'DTA-OIL-001',
    name: 'Example Oil & Gas Enterprise',
    status: 'Demonstration Model',
    owner: 'Atlas',
    description:
      'Seeded Oil & Gas enterprise visual twin used to demonstrate asset-heavy enterprise monitoring, data feeds, safety systems, production systems, commercial systems, and human approval points.',
    assetType: 'Industry Demonstration Digital Twin',
    linkedEnterpriseObjects: ['EOS-ENTERPRISE-VISUAL-MODEL', 'EOS-MASTER-MONITORING-VIEW', 'EOS-DIGITAL-TWIN-GENERATION-WORKFLOW'],
    linkedPrograms: ['EOS-PROG-DTAP', 'EOS-PROG-DTAM', 'EOS-PROG-COMMERCIAL-LAUNCH'],
    valuationStatus: 'Conceptual Internal Estimate',
    commercializationStatus: 'Demonstration Candidate',
    governanceStatus: 'Review Required',
    lifecycleStage: 'Digital Mirror',
    lifecycleProgress: 28,
    liveStatus: makeLiveStatus({
      status: 'Blue',
      lifecycleStatus: 'Defined',
      healthScore: 76,
      progress: 28,
      summary: 'Oil & Gas Digital Twin is seeded as a simulated industry demonstration model.',
      requiresAttention: true,
      attentionLevel: 'Low',
      recommendedAction: 'Use for visual demonstration only until real enterprise onboarding data is approved.',
      availableActions: ['Review enterprise home', 'Review asset map', 'Review data feed plan']
    })
  }
];
