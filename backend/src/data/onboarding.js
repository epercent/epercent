const onboardingTimestamp = '2026-07-04T00:24:00.000Z';

function makeLiveStatus({
  status = 'Blue',
  lifecycleStatus = 'Defined',
  healthScore = 80,
  progress = 40,
  summary,
  requiresAttention = false,
  attentionLevel = 'No Action Required',
  recommendedAction = 'Review onboarding record.',
  availableActions = ['Open Onboarding']
}) {
  return {
    status,
    operationalStatus: status,
    lifecycleStatus,
    healthScore,
    progress,
    summary,
    lastActivity: onboardingTimestamp,
    requiresAttention,
    attentionLevel,
    recommendedAction,
    availableActions
  };
}

export const onboardingAgents = [
  { agentId: 'EOS-AGENT-HERMES', agentName: 'Hermes', assignment: 'Knowledge capture' },
  { agentId: 'EOS-AGENT-ATLAS', agentName: 'Atlas', assignment: 'Enterprise structure and architecture' },
  { agentId: 'EOS-AGENT-ATHENA', agentName: 'Athena', assignment: 'Research and documentation' },
  { agentId: 'EOS-AGENT-MERCURY', agentName: 'Mercury', assignment: 'Opportunity analysis' },
  { agentId: 'EOS-AGENT-ARGUS', agentName: 'Argus', assignment: 'Monitoring requirements' },
  { agentId: 'EOS-AGENT-VULCAN', agentName: 'Vulcan', assignment: 'Validation, QA, and compliance' },
  { agentId: 'EOS-AGENT-CODEX', agentName: 'Codex', assignment: 'Engineering integration requirements' }
];

export const humanValidationChecklistTemplate = [
  'Confirm enterprise identity',
  'Confirm asset ownership',
  'Confirm asset hierarchy',
  'Confirm systems list',
  'Confirm data feed availability',
  'Confirm approval owners',
  'Confirm DTA candidates',
  'Confirm valuation assumptions',
  'Confirm governance requirements'
];

function stage(stageId, name, {
  status = 'Pending Assessment',
  progress = 0,
  ownerAgent = 'EOS-AGENT-ATLAS',
  humanApprovalRequired = false,
  requiredInputs = [],
  outputs = [],
  risks = [],
  recommendedAction = 'Review stage inputs and outputs.'
}) {
  return {
    stageId,
    name,
    description: `${name} stage in the EOS enterprise onboarding and DTA assimilation pipeline.`,
    status,
    progress,
    requiredInputs,
    outputs,
    ownerAgent,
    humanApprovalRequired,
    risks,
    recommendedAction
  };
}

function pipelineFor({ id, enterpriseId, enterpriseName, activeIndex = 4 }) {
  const stages = [
    stage('STAGE-01', 'Enterprise Intake', {
      status: 'Completed',
      progress: 100,
      ownerAgent: 'EOS-AGENT-HERMES',
      requiredInputs: ['Enterprise name', 'Industry', 'Known assets', 'Known systems'],
      outputs: ['Initial enterprise profile'],
      recommendedAction: 'Confirm source scope before classification.'
    }),
    stage('STAGE-02', 'Source Classification', {
      status: activeIndex > 1 ? 'Completed' : 'In Progress',
      progress: activeIndex > 1 ? 100 : 60,
      ownerAgent: 'EOS-AGENT-HERMES',
      requiredInputs: ['Source documents', 'Source systems', 'Repository links'],
      outputs: ['Classified source inventory'],
      risks: ['Unlinked external repositories may delay extraction'],
      recommendedAction: 'Classify remaining source material before extraction.'
    }),
    stage('STAGE-03', 'Enterprise Object Extraction', {
      status: activeIndex > 2 ? 'Completed' : 'Pending Assessment',
      progress: activeIndex > 2 ? 100 : 20,
      ownerAgent: 'EOS-AGENT-ATLAS',
      requiredInputs: ['Classified sources'],
      outputs: ['Candidate Enterprise Objects'],
      risks: ['Extraction is currently structured and seeded, not AI-generated'],
      recommendedAction: 'Validate extracted object candidates with enterprise owners.'
    }),
    stage('STAGE-04', 'Relationship Mapping', {
      status: activeIndex > 3 ? 'Completed' : 'Pending Assessment',
      progress: activeIndex > 3 ? 100 : 15,
      ownerAgent: 'EOS-AGENT-ATLAS',
      requiredInputs: ['Candidate Enterprise Objects', 'Known relationships'],
      outputs: ['Relationship map'],
      recommendedAction: 'Review asset, system, process, and people relationships.'
    }),
    stage('STAGE-05', 'Digital Mirror Creation', {
      status: activeIndex === 4 ? 'In Progress' : activeIndex > 4 ? 'Completed' : 'Pending Assessment',
      progress: activeIndex === 4 ? 66 : activeIndex > 4 ? 100 : 0,
      ownerAgent: 'EOS-AGENT-ATLAS',
      requiredInputs: ['Object map', 'Relationship map', 'Systems map'],
      outputs: ['Digital Mirror'],
      humanApprovalRequired: true,
      risks: ['Mirror confidence requires human validation'],
      recommendedAction: 'Review the Digital Mirror and confirm missing relationships.'
    }),
    stage('STAGE-06', 'DTA Candidate Identification', {
      status: activeIndex > 5 ? 'Completed' : 'Pending Assessment',
      progress: activeIndex > 5 ? 100 : 35,
      ownerAgent: 'EOS-AGENT-MERCURY',
      requiredInputs: ['Digital Mirror', 'Value drivers', 'Operational assets'],
      outputs: ['DTA candidate list'],
      recommendedAction: 'Prioritize DTA candidates by value potential and data readiness.'
    }),
    stage('STAGE-07', 'Data Feed Requirement Mapping', {
      status: 'Pending Assessment',
      progress: 30,
      ownerAgent: 'EOS-AGENT-ARGUS',
      requiredInputs: ['DTA candidates', 'System inventory'],
      outputs: ['Data feed requirements'],
      risks: ['Real-time feeds are not connected yet'],
      recommendedAction: 'Confirm required fields, cadence, quality, and fallback owners.'
    }),
    stage('STAGE-08', 'Agent Assignment', {
      status: 'Defined',
      progress: 72,
      ownerAgent: 'EOS-AGENT-CODEX',
      requiredInputs: ['DTA candidates', 'Workflow scope'],
      outputs: ['Agent assignment plan'],
      recommendedAction: 'Review assigned agents and integration responsibilities.'
    }),
    stage('STAGE-09', 'Human Validation', {
      status: 'Awaiting Review',
      progress: 35,
      ownerAgent: 'EOS-AGENT-VULCAN',
      requiredInputs: ['Validation checklist', 'Approval owners'],
      outputs: ['Validated enterprise structure'],
      humanApprovalRequired: true,
      risks: ['DTA formation is blocked until validation is complete'],
      recommendedAction: 'Complete the human validation checklist.'
    }),
    stage('STAGE-10', 'DTA Formation', {
      status: 'Not Started',
      progress: 0,
      ownerAgent: 'EOS-AGENT-ATLAS',
      requiredInputs: ['Validated structure', 'Approved DTA candidates'],
      outputs: ['Governed Digital Twin Assets'],
      humanApprovalRequired: true,
      recommendedAction: 'Prepare formation package after validation.'
    }),
    stage('STAGE-11', 'Monitoring & Valuation', {
      status: 'Not Started',
      progress: 0,
      ownerAgent: 'EOS-AGENT-ARGUS',
      requiredInputs: ['Formed DTA', 'Data feeds', 'Valuation assumptions'],
      outputs: ['Monitoring and valuation readiness'],
      recommendedAction: 'Enable monitoring and valuation only after DTA formation.'
    })
  ];

  return {
    id,
    enterpriseId,
    enterpriseName,
    status: 'Running',
    currentStage: stages.find((item) => item.status === 'In Progress')?.name ?? 'Human Validation',
    progress: Math.round(stages.reduce((sum, item) => sum + item.progress, 0) / stages.length),
    stages,
    liveStatus: makeLiveStatus({
      status: 'Amber',
      lifecycleStatus: 'In Progress',
      healthScore: 82,
      progress: Math.round(stages.reduce((sum, item) => sum + item.progress, 0) / stages.length),
      summary: `${enterpriseName} onboarding pipeline is structured and awaiting human validation before DTA formation.`,
      requiresAttention: true,
      attentionLevel: 'Medium',
      recommendedAction: 'Review Digital Mirror confidence, DTA candidates, feed requirements, and validation gates.',
      availableActions: ['Review Pipeline', 'Review Digital Mirror', 'Review DTA Candidates', 'Review Human Validation']
    })
  };
}

export const enterpriseOnboarding = [
  {
    id: 'EOS-ONB-OIL-001',
    enterpriseName: 'Example Oil & Gas Enterprise',
    industry: 'Oil & Gas',
    enterpriseType: 'Asset-Intensive Enterprise',
    status: 'In Progress',
    stage: 'Digital Mirror Creation',
    owner: 'EOS PMO',
    createdAt: onboardingTimestamp,
    updatedAt: onboardingTimestamp,
    sourceDocuments: ['Enterprise overview', 'Asset register', 'Safety procedures', 'Production report'],
    sourceSystems: ['Production Systems', 'Safety Systems', 'Commercial Systems', 'Maintenance Systems'],
    knownAssets: [
      'Headquarters',
      'Offshore Rigs',
      'FPSO / Ships',
      'Pipelines',
      'Storage Facilities',
      'Wells',
      'Production Systems',
      'Safety Systems',
      'Commercial Systems'
    ],
    knownProcesses: ['Production planning', 'Safety inspection', 'Maintenance scheduling', 'Commercial lifting'],
    knownPeople: ['Operations Director', 'Asset Manager', 'HSE Lead', 'Commercial Manager'],
    knownDepartments: ['Operations', 'Safety', 'Engineering', 'Commercial', 'Finance'],
    knownLocations: ['Headquarters', 'Offshore Field', 'Pipeline Corridor', 'Storage Terminal'],
    knownContracts: ['Production sharing agreement', 'Pipeline operations agreement', 'Storage services agreement'],
    knownRisks: ['Safety incident', 'Production downtime', 'Pipeline integrity', 'Data feed availability'],
    knownOpportunities: ['Production optimization', 'Predictive maintenance', 'Safety analytics', 'Commercial planning'],
    humanValidationRequired: true,
    assignedAgents: onboardingAgents,
    linkedDigitalMirror: 'EOS-DM-OIL-001',
    linkedDtaCandidates: ['EOS-DTA-CAND-OIL-RIG', 'EOS-DTA-CAND-OIL-PIPELINE', 'EOS-DTA-CAND-OIL-PRODUCTION', 'EOS-DTA-CAND-OIL-STORAGE', 'EOS-DTA-CAND-OIL-HQ'],
    liveStatus: makeLiveStatus({
      status: 'Amber',
      lifecycleStatus: 'In Progress',
      healthScore: 78,
      progress: 48,
      summary: 'Oil and Gas onboarding is ready for Digital Mirror review and DTA candidate validation.',
      requiresAttention: true,
      attentionLevel: 'Medium',
      recommendedAction: 'Confirm asset hierarchy, systems list, and data feed availability.',
      availableActions: ['Review Pipeline', 'Review Digital Mirror', 'Review Data Feeds', 'Complete Human Validation']
    })
  },
  {
    id: 'EOS-ONB-EPERCENT-001',
    enterpriseName: 'ePercent',
    industry: 'AI-Native Enterprise',
    enterpriseType: 'Reference Enterprise',
    status: 'In Progress',
    stage: 'DTA Candidate Identification',
    owner: 'EOS PMO',
    createdAt: onboardingTimestamp,
    updatedAt: onboardingTimestamp,
    sourceDocuments: ['EOS strategy records', 'Mission Control state', 'Capability ledger'],
    sourceSystems: ['EOS Core API', 'Mission Control', 'KIPR', 'PMO', 'Persistent Data Store'],
    knownAssets: ['EOS Platform', 'Mission Control', 'Executive AI Workforce', 'KIPR', 'Second Balance Sheet'],
    knownProcesses: ['Capability development', 'Knowledge management', 'Backup and recovery', 'Program management'],
    knownPeople: ['Founder CEO', 'CTO Advisor', 'Executive Agents'],
    knownDepartments: ['Engineering', 'Research', 'Knowledge', 'Architecture', 'Operations'],
    knownLocations: ['Digital Enterprise Headquarters'],
    knownContracts: ['Pending commercial agreements'],
    knownRisks: ['Restore validation pending', 'External source connectors not enabled'],
    knownOpportunities: ['Reference implementation', 'Investor demonstration', 'DTA operating model evidence'],
    humanValidationRequired: true,
    assignedAgents: onboardingAgents,
    linkedDigitalMirror: 'EOS-DM-EPERCENT-001',
    linkedDtaCandidates: ['EOS-DTA-CAND-EPERCENT-ENTERPRISE'],
    liveStatus: makeLiveStatus({
      status: 'Amber',
      lifecycleStatus: 'In Progress',
      healthScore: 84,
      progress: 58,
      summary: 'ePercent onboarding connects the live EOS implementation to the reference enterprise Digital Mirror.',
      requiresAttention: true,
      attentionLevel: 'Low',
      recommendedAction: 'Validate governance requirements and Second Balance Sheet assumptions.',
      availableActions: ['Review Digital Mirror', 'Review Reference DTA', 'Review Governance Requirements']
    })
  },
  {
    id: 'EOS-ONB-EOS-001',
    enterpriseName: 'EOS Platform',
    industry: 'Enterprise Operating System',
    enterpriseType: 'Platform Asset',
    status: 'In Progress',
    stage: 'Data Feed Requirement Mapping',
    owner: 'Codex',
    createdAt: onboardingTimestamp,
    updatedAt: onboardingTimestamp,
    sourceDocuments: ['Release manifest', 'Capability documentation', 'Architecture documentation'],
    sourceSystems: ['EOS Core API', 'Mission Control', 'Persistent Store', 'Backup Service', 'Release Management'],
    knownAssets: ['Core API', 'Mission Control', 'Persistent Store', 'Backup Repository', 'Knowledge Repository'],
    knownProcesses: ['Build verification', 'Release management', 'Backup creation', 'Status reporting'],
    knownPeople: ['Engineering Agent', 'Executive Council'],
    knownDepartments: ['Engineering', 'Operations', 'Quality'],
    knownLocations: ['Local EOS Workspace'],
    knownContracts: ['Pending platform commercialization'],
    knownRisks: ['Local-only persistence', 'No cloud synchronization yet', 'No connector authentication yet'],
    knownOpportunities: ['Platform licensing', 'Enterprise onboarding engine', 'Agent workforce operations'],
    humanValidationRequired: true,
    assignedAgents: onboardingAgents,
    linkedDigitalMirror: 'EOS-DM-EOS-001',
    linkedDtaCandidates: ['EOS-DTA-CAND-EOS-PLATFORM'],
    liveStatus: makeLiveStatus({
      status: 'Blue',
      lifecycleStatus: 'In Progress',
      healthScore: 86,
      progress: 62,
      summary: 'EOS Platform onboarding prepares EOS itself as a platform Digital Twin Asset.',
      requiresAttention: false,
      attentionLevel: 'No Action Required',
      recommendedAction: 'Review platform feed requirements before connector implementation.',
      availableActions: ['Review Platform Mirror', 'Review Feed Requirements', 'Review Integration Requirements']
    })
  }
];

export const assimilationPipelines = [
  pipelineFor({
    id: 'EOS-PIPE-OIL-001',
    enterpriseId: 'EOS-ONB-OIL-001',
    enterpriseName: 'Example Oil & Gas Enterprise',
    activeIndex: 4
  }),
  pipelineFor({
    id: 'EOS-PIPE-EPERCENT-001',
    enterpriseId: 'EOS-ONB-EPERCENT-001',
    enterpriseName: 'ePercent',
    activeIndex: 5
  }),
  pipelineFor({
    id: 'EOS-PIPE-EOS-001',
    enterpriseId: 'EOS-ONB-EOS-001',
    enterpriseName: 'EOS Platform',
    activeIndex: 6
  })
];

export const digitalMirrors = [
  {
    id: 'EOS-DM-OIL-001',
    enterpriseId: 'EOS-ONB-OIL-001',
    name: 'Example Oil & Gas Enterprise Digital Mirror',
    industry: 'Oil & Gas',
    description: 'Structured representation of the example enterprise before governed DTA formation.',
    objectMap: ['Headquarters', 'Offshore Rigs', 'FPSO / Ships', 'Pipelines', 'Storage Facilities', 'Wells'],
    relationshipMap: ['Rigs produce through wells', 'Pipelines transport production', 'Storage facilities hold output', 'Headquarters governs approvals'],
    systemsMap: ['Production Systems', 'Safety Systems', 'Commercial Systems', 'Maintenance Systems'],
    assetMap: ['Rig fleet', 'Pipeline network', 'Storage estate', 'Enterprise headquarters'],
    processMap: ['Production planning', 'Safety inspection', 'Maintenance scheduling', 'Commercial lifting'],
    knowledgeMap: ['Asset register', 'Safety procedures', 'Production reporting', 'Commercial contracts'],
    riskMap: ['Safety incident', 'Production downtime', 'Pipeline integrity', 'Data quality'],
    confidenceScore: 68,
    validationStatus: 'Human Validation Required',
    recommendedNextStep: 'Validate asset ownership, hierarchy, and source system availability.',
    liveStatus: makeLiveStatus({
      status: 'Amber',
      lifecycleStatus: 'Review',
      healthScore: 74,
      progress: 66,
      summary: 'Oil and Gas Digital Mirror is structured but requires human validation.',
      requiresAttention: true,
      attentionLevel: 'Medium',
      recommendedAction: 'Review object, relationship, system, and risk maps with the enterprise owner.',
      availableActions: ['Review Object Map', 'Review Relationship Map', 'Request Human Validation']
    })
  },
  {
    id: 'EOS-DM-EPERCENT-001',
    enterpriseId: 'EOS-ONB-EPERCENT-001',
    name: 'ePercent Digital Mirror',
    industry: 'AI-Native Enterprise',
    description: 'Digital Mirror for the reference enterprise operating EOS.',
    objectMap: ['EOS Platform', 'Mission Control', 'Executive AI Workforce', 'KIPR', 'Second Balance Sheet'],
    relationshipMap: ['Mission Control operates EOS', 'Executive agents create knowledge', 'KIPR preserves knowledge assets'],
    systemsMap: ['EOS Core API', 'Persistent Store', 'Mission Control', 'Backup Service'],
    assetMap: ['Platform asset', 'Knowledge asset portfolio', 'Digital Twin Asset portfolio'],
    processMap: ['Capability delivery', 'Knowledge management', 'Backup and release'],
    knowledgeMap: ['Genesis', 'Capability docs', 'Architecture docs', 'Business impact assessments'],
    riskMap: ['Local-only persistence', 'Governance approval pending', 'Cloud sync not executed'],
    confidenceScore: 74,
    validationStatus: 'Awaiting Governance Review',
    recommendedNextStep: 'Validate governance and valuation assumptions.',
    liveStatus: makeLiveStatus({
      status: 'Amber',
      lifecycleStatus: 'Review',
      healthScore: 80,
      progress: 72,
      summary: 'ePercent Digital Mirror is ready for governance and valuation validation.',
      requiresAttention: true,
      attentionLevel: 'Low',
      recommendedAction: 'Review governance, valuation, and knowledge asset assumptions.',
      availableActions: ['Review Mirror', 'Review Governance', 'Review Valuation Assumptions']
    })
  },
  {
    id: 'EOS-DM-EOS-001',
    enterpriseId: 'EOS-ONB-EOS-001',
    name: 'EOS Platform Digital Mirror',
    industry: 'Enterprise Operating System',
    description: 'Digital Mirror of EOS as a platform asset and operating system.',
    objectMap: ['Core API', 'Mission Control', 'Persistent Store', 'Backup Repository', 'Release Metadata'],
    relationshipMap: ['Core API serves Mission Control', 'Persistent Store backs registries', 'Backup Service protects data'],
    systemsMap: ['Node API', 'React Mission Control', 'JSON Store', 'Backup Scripts'],
    assetMap: ['API asset', 'Frontend asset', 'Data asset', 'Knowledge asset'],
    processMap: ['Start', 'Status', 'Test', 'Build', 'Backup'],
    knowledgeMap: ['Engineering Standard', 'Development Guide', 'Architecture docs'],
    riskMap: ['No external database yet', 'No GitHub sync yet', 'Manual validation still required'],
    confidenceScore: 78,
    validationStatus: 'Technical Review Required',
    recommendedNextStep: 'Validate platform data feeds and release evidence.',
    liveStatus: makeLiveStatus({
      status: 'Blue',
      lifecycleStatus: 'Review',
      healthScore: 82,
      progress: 76,
      summary: 'EOS Platform Digital Mirror is available for technical review.',
      requiresAttention: false,
      attentionLevel: 'No Action Required',
      recommendedAction: 'Review platform feed requirements and release metadata.',
      availableActions: ['Review Platform Mirror', 'Review Feed Requirements']
    })
  }
];

export const dtaCandidates = [
  {
    id: 'EOS-DTA-CAND-OIL-RIG',
    enterpriseId: 'EOS-ONB-OIL-001',
    name: 'Offshore Rig DTA',
    assetType: 'Operational Asset',
    description: 'Candidate DTA representing offshore rig operations, safety status, maintenance, and production contribution.',
    stage: 'Candidate Identified',
    status: 'Requires Validation',
    sourceObjects: ['Offshore Rigs', 'Wells', 'Safety Systems', 'Production Systems'],
    requiredDataFeeds: ['EOS-FEED-OIL-PRODUCTION', 'EOS-FEED-OIL-SAFETY', 'EOS-FEED-OIL-MAINTENANCE'],
    missingData: ['Rig equipment hierarchy', 'Maintenance history', 'Safety incident history'],
    humanValidationPoints: ['Confirm asset ownership', 'Confirm asset hierarchy', 'Confirm data feed availability'],
    assignedAgents: ['EOS-AGENT-ATLAS', 'EOS-AGENT-ARGUS', 'EOS-AGENT-VULCAN'],
    valuationPotential: 'High',
    riskScore: 62,
    confidenceScore: 66,
    recommendedAction: 'Validate rig hierarchy and safety data availability.',
    liveStatus: makeLiveStatus({
      status: 'Amber',
      lifecycleStatus: 'Review',
      healthScore: 70,
      progress: 52,
      summary: 'Offshore Rig DTA candidate requires asset hierarchy and safety data validation.',
      requiresAttention: true,
      attentionLevel: 'Medium',
      recommendedAction: 'Confirm rig ownership, hierarchy, safety feeds, and monitoring owners.',
      availableActions: ['Review Candidate', 'Review Missing Data', 'Request Human Validation']
    })
  },
  {
    id: 'EOS-DTA-CAND-OIL-PIPELINE',
    enterpriseId: 'EOS-ONB-OIL-001',
    name: 'Pipeline Network DTA',
    assetType: 'Infrastructure Asset',
    description: 'Candidate DTA for pipeline integrity, flow, maintenance, and risk monitoring.',
    stage: 'Candidate Identified',
    status: 'Requires Validation',
    sourceObjects: ['Pipelines', 'Storage Facilities', 'Safety Systems'],
    requiredDataFeeds: ['EOS-FEED-OIL-PIPELINE', 'EOS-FEED-OIL-SAFETY'],
    missingData: ['Pipeline route map', 'Integrity inspection records', 'Flow telemetry'],
    humanValidationPoints: ['Confirm asset ownership', 'Confirm systems list', 'Confirm data feed availability'],
    assignedAgents: ['EOS-AGENT-ATLAS', 'EOS-AGENT-ARGUS', 'EOS-AGENT-VULCAN'],
    valuationPotential: 'High',
    riskScore: 68,
    confidenceScore: 64,
    recommendedAction: 'Confirm route map, integrity data, and safety workflows.',
    liveStatus: makeLiveStatus({
      status: 'Amber',
      lifecycleStatus: 'Review',
      healthScore: 68,
      progress: 50,
      summary: 'Pipeline Network DTA candidate has high value potential and requires integrity data validation.',
      requiresAttention: true,
      attentionLevel: 'High',
      recommendedAction: 'Prioritize pipeline data quality and governance review.',
      availableActions: ['Review Candidate', 'Review Risk Map', 'Review Feed Requirements']
    })
  },
  {
    id: 'EOS-DTA-CAND-OIL-PRODUCTION',
    enterpriseId: 'EOS-ONB-OIL-001',
    name: 'Production Operations DTA',
    assetType: 'Operations Asset',
    description: 'Candidate DTA for production planning, output, downtime, and operational efficiency.',
    stage: 'Candidate Identified',
    status: 'Defined',
    sourceObjects: ['Production Systems', 'Wells', 'Commercial Systems'],
    requiredDataFeeds: ['EOS-FEED-OIL-PRODUCTION', 'EOS-FEED-OIL-COMMERCIAL'],
    missingData: ['Production cadence', 'Downtime history', 'Commercial lifting schedule'],
    humanValidationPoints: ['Confirm systems list', 'Confirm valuation assumptions'],
    assignedAgents: ['EOS-AGENT-ARGUS', 'EOS-AGENT-MERCURY', 'EOS-AGENT-ATHENA'],
    valuationPotential: 'High',
    riskScore: 54,
    confidenceScore: 70,
    recommendedAction: 'Validate production metrics and commercial dependencies.',
    liveStatus: makeLiveStatus({
      status: 'Amber',
      lifecycleStatus: 'Defined',
      healthScore: 74,
      progress: 56,
      summary: 'Production Operations DTA candidate is defined and awaiting production feed mapping.',
      requiresAttention: true,
      attentionLevel: 'Medium',
      recommendedAction: 'Confirm production feed requirements and commercial dependencies.',
      availableActions: ['Review Candidate', 'Review Commercial Data', 'Review Feed Requirements']
    })
  },
  {
    id: 'EOS-DTA-CAND-OIL-STORAGE',
    enterpriseId: 'EOS-ONB-OIL-001',
    name: 'Storage Facility DTA',
    assetType: 'Infrastructure Asset',
    description: 'Candidate DTA for storage capacity, inventory, safety, and commercial availability.',
    stage: 'Candidate Identified',
    status: 'Defined',
    sourceObjects: ['Storage Facilities', 'Commercial Systems', 'Safety Systems'],
    requiredDataFeeds: ['EOS-FEED-OIL-STORAGE', 'EOS-FEED-OIL-COMMERCIAL'],
    missingData: ['Tank inventory data', 'Capacity constraints', 'Inspection records'],
    humanValidationPoints: ['Confirm asset hierarchy', 'Confirm data feed availability'],
    assignedAgents: ['EOS-AGENT-ATLAS', 'EOS-AGENT-ARGUS'],
    valuationPotential: 'Medium',
    riskScore: 46,
    confidenceScore: 62,
    recommendedAction: 'Validate storage inventory and safety data requirements.',
    liveStatus: makeLiveStatus({
      status: 'Blue',
      lifecycleStatus: 'Defined',
      healthScore: 72,
      progress: 48,
      summary: 'Storage Facility DTA candidate is defined for future data feed mapping.',
      requiresAttention: false,
      attentionLevel: 'No Action Required',
      recommendedAction: 'Review storage data requirements after primary operations candidates.',
      availableActions: ['Review Candidate', 'Review Missing Data']
    })
  },
  {
    id: 'EOS-DTA-CAND-OIL-HQ',
    enterpriseId: 'EOS-ONB-OIL-001',
    name: 'Enterprise Headquarters DTA',
    assetType: 'Governance Asset',
    description: 'Candidate DTA for enterprise governance, approvals, contracts, and decision workflows.',
    stage: 'Candidate Identified',
    status: 'Defined',
    sourceObjects: ['Headquarters', 'Commercial Systems', 'Contracts', 'Approval Owners'],
    requiredDataFeeds: ['EOS-FEED-OIL-GOVERNANCE', 'EOS-FEED-OIL-COMMERCIAL'],
    missingData: ['Approval matrix', 'Contract metadata', 'Governance policies'],
    humanValidationPoints: ['Confirm approval owners', 'Confirm governance requirements'],
    assignedAgents: ['EOS-AGENT-HERMES', 'EOS-AGENT-VULCAN', 'EOS-AGENT-MERCURY'],
    valuationPotential: 'Medium',
    riskScore: 38,
    confidenceScore: 60,
    recommendedAction: 'Confirm approval owners and governance requirements.',
    liveStatus: makeLiveStatus({
      status: 'Blue',
      lifecycleStatus: 'Defined',
      healthScore: 76,
      progress: 46,
      summary: 'Enterprise Headquarters DTA candidate prepares governance and approval workflow modeling.',
      requiresAttention: false,
      attentionLevel: 'No Action Required',
      recommendedAction: 'Review governance requirements and approval owners.',
      availableActions: ['Review Governance', 'Review Approval Matrix']
    })
  },
  {
    id: 'EOS-DTA-CAND-EPERCENT-ENTERPRISE',
    enterpriseId: 'EOS-ONB-EPERCENT-001',
    name: 'ePercent Enterprise DTA',
    assetType: 'Reference Enterprise Asset',
    description: 'Candidate DTA for ePercent as the first AI-native enterprise operating on EOS.',
    stage: 'Candidate Identified',
    status: 'Requires Governance Review',
    sourceObjects: ['EOS Platform', 'Mission Control', 'Executive AI Workforce', 'KIPR'],
    requiredDataFeeds: ['EOS-FEED-EPERCENT-PLATFORM', 'EOS-FEED-EPERCENT-KNOWLEDGE'],
    missingData: ['Governance approval evidence', 'Commercial readiness evidence'],
    humanValidationPoints: ['Confirm governance requirements', 'Confirm valuation assumptions'],
    assignedAgents: ['EOS-AGENT-ATHENA', 'EOS-AGENT-HERMES', 'EOS-AGENT-ATLAS'],
    valuationPotential: 'Transformational',
    riskScore: 44,
    confidenceScore: 70,
    recommendedAction: 'Validate governance and investor readiness assumptions.',
    liveStatus: makeLiveStatus({
      status: 'Amber',
      lifecycleStatus: 'Review',
      healthScore: 78,
      progress: 58,
      summary: 'ePercent Enterprise DTA candidate links platform evidence to the reference enterprise strategy.',
      requiresAttention: true,
      attentionLevel: 'Low',
      recommendedAction: 'Review governance, investor readiness, and Second Balance Sheet assumptions.',
      availableActions: ['Review Candidate', 'Review Investor Evidence', 'Review Governance']
    })
  },
  {
    id: 'EOS-DTA-CAND-EOS-PLATFORM',
    enterpriseId: 'EOS-ONB-EOS-001',
    name: 'EOS Platform DTA',
    assetType: 'Platform Asset',
    description: 'Candidate DTA for EOS as a platform asset, operating environment, and Digital Enterprise Headquarters foundation.',
    stage: 'Candidate Identified',
    status: 'Defined',
    sourceObjects: ['Core API', 'Mission Control', 'Persistent Store', 'Backup Repository'],
    requiredDataFeeds: ['EOS-FEED-EOS-STATUS', 'EOS-FEED-EOS-STORAGE', 'EOS-FEED-EOS-BACKUP'],
    missingData: ['Release governance evidence', 'Cloud sync evidence', 'Restore validation evidence'],
    humanValidationPoints: ['Confirm systems list', 'Confirm data feed availability', 'Confirm governance requirements'],
    assignedAgents: ['EOS-AGENT-CODEX', 'EOS-AGENT-ARGUS', 'EOS-AGENT-VULCAN'],
    valuationPotential: 'High',
    riskScore: 40,
    confidenceScore: 76,
    recommendedAction: 'Validate release, backup, and storage evidence.',
    liveStatus: makeLiveStatus({
      status: 'Blue',
      lifecycleStatus: 'Defined',
      healthScore: 82,
      progress: 62,
      summary: 'EOS Platform DTA candidate is defined and ready for platform evidence review.',
      requiresAttention: false,
      attentionLevel: 'No Action Required',
      recommendedAction: 'Review release and backup evidence before DTA formation.',
      availableActions: ['Review Candidate', 'Review Platform Feeds', 'Review Release Evidence']
    })
  }
];

export const dataFeedRequirements = [
  {
    id: 'EOS-FEED-OIL-PRODUCTION',
    enterpriseId: 'EOS-ONB-OIL-001',
    targetObject: 'Production Systems',
    targetDta: 'EOS-DTA-CAND-OIL-PRODUCTION',
    sourceType: 'Operational System',
    sourceName: 'Production historian',
    requiredFields: ['wellId', 'timestampUtc', 'productionRate', 'downtimeMinutes', 'operatingStatus'],
    frequency: 'Hourly',
    realTimeRequired: true,
    connectionStatus: 'Not Connected',
    dataQualityStatus: 'Pending Assessment',
    humanFallbackRequired: true,
    priority: 'Critical',
    notes: 'Required before Production Operations DTA can enter monitoring.'
  },
  {
    id: 'EOS-FEED-OIL-SAFETY',
    enterpriseId: 'EOS-ONB-OIL-001',
    targetObject: 'Safety Systems',
    targetDta: 'EOS-DTA-CAND-OIL-RIG',
    sourceType: 'Safety System',
    sourceName: 'HSE incident and inspection system',
    requiredFields: ['assetId', 'inspectionDate', 'incidentType', 'severity', 'openActions'],
    frequency: 'Daily',
    realTimeRequired: false,
    connectionStatus: 'Not Connected',
    dataQualityStatus: 'Pending Assessment',
    humanFallbackRequired: true,
    priority: 'High',
    notes: 'Safety evidence must be validated before asset monitoring is considered operational.'
  },
  {
    id: 'EOS-FEED-OIL-PIPELINE',
    enterpriseId: 'EOS-ONB-OIL-001',
    targetObject: 'Pipelines',
    targetDta: 'EOS-DTA-CAND-OIL-PIPELINE',
    sourceType: 'Telemetry Feed',
    sourceName: 'Pipeline integrity and flow telemetry',
    requiredFields: ['pipelineSegmentId', 'timestampUtc', 'pressure', 'flowRate', 'integrityStatus'],
    frequency: 'Near real time',
    realTimeRequired: true,
    connectionStatus: 'Not Connected',
    dataQualityStatus: 'Unknown',
    humanFallbackRequired: true,
    priority: 'Critical',
    notes: 'Pipeline route and telemetry mapping require human validation.'
  },
  {
    id: 'EOS-FEED-OIL-STORAGE',
    enterpriseId: 'EOS-ONB-OIL-001',
    targetObject: 'Storage Facilities',
    targetDta: 'EOS-DTA-CAND-OIL-STORAGE',
    sourceType: 'Inventory System',
    sourceName: 'Storage inventory ledger',
    requiredFields: ['facilityId', 'tankId', 'timestampUtc', 'inventoryVolume', 'capacity'],
    frequency: 'Daily',
    realTimeRequired: false,
    connectionStatus: 'Not Connected',
    dataQualityStatus: 'Pending Assessment',
    humanFallbackRequired: true,
    priority: 'Medium',
    notes: 'Inventory and capacity data required for commercial readiness.'
  },
  {
    id: 'EOS-FEED-OIL-COMMERCIAL',
    enterpriseId: 'EOS-ONB-OIL-001',
    targetObject: 'Commercial Systems',
    targetDta: 'EOS-DTA-CAND-OIL-HQ',
    sourceType: 'Commercial System',
    sourceName: 'Commercial lifting and contract system',
    requiredFields: ['contractId', 'counterparty', 'assetId', 'volume', 'deliveryWindow'],
    frequency: 'Daily',
    realTimeRequired: false,
    connectionStatus: 'Not Connected',
    dataQualityStatus: 'Pending Assessment',
    humanFallbackRequired: true,
    priority: 'Medium',
    notes: 'Commercial records support enterprise value and governance review.'
  },
  {
    id: 'EOS-FEED-OIL-GOVERNANCE',
    enterpriseId: 'EOS-ONB-OIL-001',
    targetObject: 'Headquarters',
    targetDta: 'EOS-DTA-CAND-OIL-HQ',
    sourceType: 'Governance Record',
    sourceName: 'Approval matrix and policy repository',
    requiredFields: ['approvalOwner', 'approvalScope', 'policyId', 'effectiveDate', 'reviewCycle'],
    frequency: 'On change',
    realTimeRequired: false,
    connectionStatus: 'Not Connected',
    dataQualityStatus: 'Pending Assessment',
    humanFallbackRequired: true,
    priority: 'High',
    notes: 'Human validation depends on approval owner confirmation.'
  },
  {
    id: 'EOS-FEED-EPERCENT-PLATFORM',
    enterpriseId: 'EOS-ONB-EPERCENT-001',
    targetObject: 'EOS Platform',
    targetDta: 'EOS-DTA-CAND-EPERCENT-ENTERPRISE',
    sourceType: 'EOS API',
    sourceName: 'EOS status and platform operations',
    requiredFields: ['platformStatus', 'buildVersion', 'storageStatus', 'backupStatus', 'activeAgents'],
    frequency: 'On demand',
    realTimeRequired: false,
    connectionStatus: 'Local API Available',
    dataQualityStatus: 'Operational',
    humanFallbackRequired: false,
    priority: 'High',
    notes: 'Uses existing EOS platform status APIs.'
  },
  {
    id: 'EOS-FEED-EPERCENT-KNOWLEDGE',
    enterpriseId: 'EOS-ONB-EPERCENT-001',
    targetObject: 'KIPR',
    targetDta: 'EOS-DTA-CAND-EPERCENT-ENTERPRISE',
    sourceType: 'Knowledge Repository',
    sourceName: 'Agent Knowledge Repository',
    requiredFields: ['knowledgeObjectId', 'ownerAgent', 'status', 'publicationReady', 'investorReady'],
    frequency: 'On change',
    realTimeRequired: false,
    connectionStatus: 'Local API Available',
    dataQualityStatus: 'Operational Foundation',
    humanFallbackRequired: false,
    priority: 'Medium',
    notes: 'Feeds knowledge asset readiness into the reference enterprise mirror.'
  },
  {
    id: 'EOS-FEED-EOS-STATUS',
    enterpriseId: 'EOS-ONB-EOS-001',
    targetObject: 'EOS Core API',
    targetDta: 'EOS-DTA-CAND-EOS-PLATFORM',
    sourceType: 'EOS API',
    sourceName: 'Core status endpoint',
    requiredFields: ['platform', 'version', 'status', 'activeAgents'],
    frequency: 'On demand',
    realTimeRequired: false,
    connectionStatus: 'Local API Available',
    dataQualityStatus: 'Operational',
    humanFallbackRequired: false,
    priority: 'High',
    notes: 'Used for platform DTA status evidence.'
  },
  {
    id: 'EOS-FEED-EOS-STORAGE',
    enterpriseId: 'EOS-ONB-EOS-001',
    targetObject: 'Persistent Store',
    targetDta: 'EOS-DTA-CAND-EOS-PLATFORM',
    sourceType: 'Storage API',
    sourceName: 'Storage health endpoint',
    requiredFields: ['storageStatus', 'collectionsFound', 'recordCounts', 'warnings'],
    frequency: 'On demand',
    realTimeRequired: false,
    connectionStatus: 'Local API Available',
    dataQualityStatus: 'Operational',
    humanFallbackRequired: false,
    priority: 'High',
    notes: 'Supports storage health evidence.'
  },
  {
    id: 'EOS-FEED-EOS-BACKUP',
    enterpriseId: 'EOS-ONB-EOS-001',
    targetObject: 'Backup Repository',
    targetDta: 'EOS-DTA-CAND-EOS-PLATFORM',
    sourceType: 'Backup Metadata',
    sourceName: 'Backup status file',
    requiredFields: ['latestBackupTimestamp', 'latestBackupStatus', 'latestBackupArchive', 'backupCount'],
    frequency: 'On backup',
    realTimeRequired: false,
    connectionStatus: 'Local File Available',
    dataQualityStatus: 'Operational',
    humanFallbackRequired: false,
    priority: 'Medium',
    notes: 'Restore validation remains a separate human-controlled control.'
  }
];

export const humanValidationItems = enterpriseOnboarding.flatMap((onboarding) =>
  humanValidationChecklistTemplate.map((item, index) => ({
    id: `${onboarding.id}-HV-${String(index + 1).padStart(2, '0')}`,
    enterpriseId: onboarding.id,
    enterpriseName: onboarding.enterpriseName,
    checklistItem: item,
    status: index < 2 && onboarding.id !== 'EOS-ONB-OIL-001' ? 'Ready for Review' : 'Pending Validation',
    priority: index >= 6 ? 'High' : 'Medium',
    owner: index >= 6 ? 'EOS Governance Council' : 'Enterprise Owner',
    assignedAgent: ['EOS-AGENT-HERMES', 'EOS-AGENT-ATLAS', 'EOS-AGENT-VULCAN'][index % 3],
    dueStage: index >= 6 ? 'Human Validation' : 'Digital Mirror Creation',
    recommendedAction: `Review and confirm: ${item}.`,
    liveStatus: makeLiveStatus({
      status: index >= 6 ? 'Amber' : 'Blue',
      lifecycleStatus: 'Review',
      healthScore: index >= 6 ? 70 : 78,
      progress: index < 2 && onboarding.id !== 'EOS-ONB-OIL-001' ? 45 : 20,
      summary: `${item} is required before ${onboarding.enterpriseName} can advance to governed DTA formation.`,
      requiresAttention: index >= 6,
      attentionLevel: index >= 6 ? 'Medium' : 'No Action Required',
      recommendedAction: `Confirm ${item.toLowerCase()} with the responsible owner.`,
      availableActions: ['Review Validation Item', 'Assign Owner', 'Record Approval Evidence']
    })
  }))
);
