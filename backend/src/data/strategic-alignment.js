const alignmentTimestamp = '2026-07-03T21:20:00.000Z';
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
    lastActivity: alignmentTimestamp,
    requiresAttention,
    attentionLevel,
    recommendedAction,
    availableActions
  };
}

const linkedCoreObjects = [
  'EOS-ENTERPRISE-STRATEGY',
  'EOS-MASTER-ROADMAP',
  'EOS-DIGITAL-ENTERPRISE-VALUATION',
  'EOS-SECOND-BALANCE-SHEET',
  'EOS-DTA-MONITORING',
  'EOS-AKR',
  'EOS-AI-WORKFORCE-OPERATIONS'
];

export const investmentThesisAlignment = {
  id: 'EOS-INVESTMENT-THESIS-ALIGNMENT',
  name: 'ePercent / EOS Investment Thesis Alignment',
  owner: 'Eric Olo',
  status: 'In Progress',
  sourcePresentations: [
    {
      name: 'Enterprise Operating System presentation',
      repositoryStatus: 'Source presentation not found in repository',
      alignmentStatus: 'Mapped from existing EOS strategy records and capability scope'
    },
    {
      name: 'AI Operating System presentation',
      repositoryStatus: 'Source presentation not found in repository',
      alignmentStatus: 'Mapped from AI Workforce, AOS, ARM, PMO, and agent registry records'
    },
    {
      name: 'EOS Enterprise Operating System presentation',
      repositoryStatus: 'Source presentation not found in repository',
      alignmentStatus: 'Mapped from Enterprise Strategy, Mission Control, DTA, valuation, KIPR, and PMO records'
    }
  ],
  alreadyImplemented: [
    {
      concept: 'Enterprise Objects',
      evidence: 'Enterprise Object Registry, Live Object Status Layer, persistent object storage, Mission Control object views.',
      linkedCapabilities: ['EOS-CAP-0003', 'EOS-CAP-0014', 'EOS-CAP-0025']
    },
    {
      concept: 'Executive AI Workforce',
      evidence: 'Executive Council, executive agents, Executive Offices, AI Workforce Operations, attention queue, communications, calendar.',
      linkedCapabilities: ['EOS-CAP-0005', 'EOS-CAP-0021', 'EOS-CAP-0023', 'EOS-CAP-0027']
    },
    {
      concept: 'Mission Control / Digital Enterprise Headquarters',
      evidence: 'CEO Cockpit, Digital Headquarters Lobby, workspace rail, command bar, PMO, strategy, valuation, knowledge, and platform views.',
      linkedCapabilities: ['EOS-CAP-0021', 'EOS-CAP-0024', 'EOS-CAP-0028']
    },
    {
      concept: 'Second Balance Sheet foundation',
      evidence: 'Second Balance Sheet metrics and Digital Enterprise Valuation foundation exist as internal estimate records.',
      linkedCapabilities: ['EOS-CAP-0026']
    },
    {
      concept: 'Persistent platform memory',
      evidence: 'Local JSON persistence, backup status, release metadata, and storage health are operational.',
      linkedCapabilities: ['EOS-CAP-0025']
    }
  ],
  partiallyImplemented: [
    {
      concept: 'Digital Twin Asset Platform (DTAP)',
      gap: 'DTA monitoring exists, but lifecycle governance, templates, and enterprise formation workflows need expansion.',
      recommendedFutureCapability: 'DTA Lifecycle Management'
    },
    {
      concept: 'Digital Twin Asset Management (DTAM)',
      gap: 'Portfolio management is represented in roadmap data but not yet operational as a management layer.',
      recommendedFutureCapability: 'DTAM Portfolio Governance'
    },
    {
      concept: 'Digital Twin Asset Exchange (DTAX)',
      gap: 'Exchange concept exists in PMO, but listing criteria, exchange governance, and market mechanics are not implemented.',
      recommendedFutureCapability: 'DTAX Readiness Model'
    },
    {
      concept: 'KIPR',
      gap: 'Agent Knowledge Repository exists; it now needs explicit Knowledge, IP, Patents, and Research positioning.',
      recommendedFutureCapability: 'KIPR Publication & IP Governance'
    },
    {
      concept: 'Revenue Engine',
      gap: 'Revenue streams are modeled in this capability but not yet connected to CRM, finance, contracts, or customer workflows.',
      recommendedFutureCapability: 'Commercial Pipeline Execution'
    }
  ],
  notYetImplemented: [
    {
      concept: 'Agent Marketplace',
      reason: 'Requires agent hiring, performance, governance, packaging, and customer-facing marketplace rules.'
    },
    {
      concept: 'Capital Markets / Investment Banking execution',
      reason: 'Requires legal, compliance, regulated workflows, external market data, and audited valuation controls.'
    },
    {
      concept: 'Enterprise Intelligence Network',
      reason: 'Requires multi-enterprise data boundaries, tenant model, integrations, security, and governance.'
    },
    {
      concept: 'Customer revenue operations',
      reason: 'Requires customer model, contracts, pricing, onboarding, billing, and support workflows.'
    }
  ],
  recommendedFutureCapabilities: [
    'DTA Lifecycle Management',
    'Valuation Engine Expansion',
    'KIPR Publication & IP Governance',
    'Commercial Pipeline Execution',
    'Persistent Write API & Governance Audit Ledger',
    'Enterprise Integration Framework'
  ],
  liveStatus: makeLiveStatus({
    status: 'Amber',
    lifecycleStatus: 'Review',
    healthScore: 84,
    progress: 63,
    summary: 'Investment thesis alignment is active with presentation-source gaps documented and platform concepts mapped.',
    requiresAttention: true,
    attentionLevel: 'Medium',
    recommendedAction: 'Add official presentation source files and approve strategic narrative language before external investor use.',
    availableActions: ['Review alignment report', 'Review future capabilities', 'Request governance review']
  })
};

export const technologyFlywheel = {
  id: 'EOS-TECHNOLOGY-FLYWHEEL',
  name: 'EOS Technology Flywheel',
  owner: 'Atlas',
  status: 'Operational Model',
  overallMaturity: 48,
  overallHealth: 84,
  steps: [
    ['Knowledge', 62, 'Captures research, documentation, decisions, and strategic context.', 'High', ['EOS-KIPR', 'EOS-AKR']],
    ['Enterprise Memory', 52, 'Turns knowledge into persistent institutional operating memory.', 'High', ['EOS-PERSISTENT-DATA-STORE']],
    ['AI Workforce', 56, 'Agents use memory and work queues to support executive functions.', 'High', ['EOS-AI-WORKFORCE-OPERATIONS']],
    ['Enterprise Objects', 72, 'Live records create operational state across capabilities, assets, workflows, and agents.', 'High', ['EOS-MC-001']],
    ['Digital Twin Assets', 38, 'Operational state forms reference DTAs for ePercent and EOS.', 'Transformational', ['EOS-DTA-MONITORING']],
    ['Operational Intelligence', 34, 'Platform signals become intelligence for decisions, risks, and opportunity scanning.', 'High', ['EOS-AGENT-MERCURY']],
    ['Enterprise Decisions', 42, 'Governed executive actions and PMO data route attention and decisions.', 'High', ['EOS-EXECUTIVE-ACTION-FRAMEWORK']],
    ['Enterprise Value', 35, 'Value drivers connect operations, knowledge, agents, DTAs, and strategy.', 'High', ['EOS-DIGITAL-ENTERPRISE-VALUATION']],
    ['Second Balance Sheet', 42, 'Digital assets become a measurable internal value framework.', 'Transformational', ['EOS-SECOND-BALANCE-SHEET']],
    ['Investment Capacity', 20, 'Investor readiness improves when value evidence, governance, and strategy align.', 'High', ['EOS-INVESTMENT-THESIS']],
    ['More Knowledge', 58, 'Investment and execution generate new knowledge for the next cycle.', 'High', ['EOS-KIPR']]
  ].map(([name, maturity, currentContribution, enterpriseValueContribution, dependencies], index) => ({
    id: `EOS-FLYWHEEL-${String(index + 1).padStart(2, '0')}`,
    name,
    currentMaturity: maturity,
    currentContribution,
    currentHealth: maturity >= 60 ? 'Healthy' : maturity >= 40 ? 'Building' : 'Requires Investment',
    dependencies,
    enterpriseValueContribution
  })),
  liveStatus: makeLiveStatus({
    status: 'Amber',
    lifecycleStatus: 'Defined',
    healthScore: 84,
    progress: 48,
    summary: 'Technology Flywheel is modeled and visible in Mission Control, with several downstream stages still early.',
    requiresAttention: true,
    attentionLevel: 'Low',
    recommendedAction: 'Prioritize DTA lifecycle and valuation expansion to strengthen downstream flywheel stages.',
    availableActions: ['Review flywheel', 'Review dependencies', 'Review value contribution']
  })
};

export const threeHorizonRoadmap = {
  id: 'EOS-THREE-HORIZON-ROADMAP',
  name: 'EOS Three-Horizon Roadmap',
  owner: 'EOS PMO',
  status: 'In Progress',
  horizons: [
    {
      id: 'H1',
      name: 'Horizon 1',
      theme: 'Foundation',
      progress: 64,
      investmentReadiness: 'Alpha investor narrative forming',
      focusAreas: ['Current Engineering', 'Current Commercial Readiness', 'Current Customers', 'Current DTAs', 'Current Revenue'],
      milestones: ['Mission Control Alpha', 'Persistent Data Store', 'Strategic Alignment', 'DTA Lifecycle Foundation'],
      dependencies: ['EOS-CAP-0025', 'EOS-CAP-0028', 'EOS-CAP-0029']
    },
    {
      id: 'H2',
      name: 'Horizon 2',
      theme: 'Commercial Scale',
      progress: 22,
      investmentReadiness: 'Partner and pilot readiness pending',
      focusAreas: ['Enterprise Rollout', 'Partner Ecosystem', 'Marketplace', 'Agent Marketplace', 'DTAM', 'Enterprise Integrations'],
      milestones: ['Pilot Enterprise Onboarding', 'Agent Marketplace Concept', 'DTAM Governance', 'Integration Framework'],
      dependencies: ['DTA Lifecycle Management', 'Persistent Write API', 'Commercial Pipeline Execution']
    },
    {
      id: 'H3',
      name: 'Horizon 3',
      theme: 'Digital Economy',
      progress: 8,
      investmentReadiness: 'Long-range strategic option',
      focusAreas: ['DTAX', 'Enterprise Exchange', 'Capital Markets', 'Industry Intelligence', 'Global Enterprise Network', 'Enterprise Intelligence Network'],
      milestones: ['DTAX Readiness', 'Exchange Governance', 'Enterprise Intelligence Network'],
      dependencies: ['DTAM Portfolio Governance', 'Valuation Assurance', 'Regulatory Review']
    }
  ],
  liveStatus: makeLiveStatus({
    status: 'Amber',
    lifecycleStatus: 'In Progress',
    healthScore: 82,
    progress: 42,
    summary: 'Three-Horizon Roadmap is modeled from foundation through commercial scale to digital economy expansion.',
    requiresAttention: true,
    attentionLevel: 'Low',
    recommendedAction: 'Keep Horizon 1 focused on DTA lifecycle, valuation evidence, and commercial readiness.',
    availableActions: ['Review horizons', 'Review milestones', 'Review investment readiness']
  })
};

const revenueStreamNames = [
  'Enterprise Licensing',
  'SaaS',
  'Professional Services',
  'Enterprise Onboarding',
  'Digital Twin Formation',
  'DTAP',
  'DTAM',
  'DTAX',
  'Agent Marketplace',
  'AI Workforce Services',
  'Enterprise Advisory',
  'Capital Markets',
  'Investment Banking',
  'Asset Management',
  'Knowledge Licensing',
  'Research Licensing',
  'Training',
  'Executive Education',
  'Enterprise Analytics'
];

export const revenueEngine = {
  id: 'EOS-REVENUE-ENGINE',
  name: 'EOS Revenue Engine',
  owner: 'Mercury',
  status: 'Foundation',
  streams: revenueStreamNames.map((name, index) => ({
    id: `EOS-REV-${String(index + 1).padStart(2, '0')}`,
    name,
    status: index < 5 ? 'Foundation' : index < 12 ? 'Defined' : 'Future Option',
    estimatedMaturity: index < 5 ? 38 : index < 12 ? 24 : 12,
    potentialMarket: index < 5 ? 'Enterprise transformation and platform buyers' : index < 12 ? 'Enterprise ecosystem and partner markets' : 'Regulated or future strategic markets',
    linkedCapabilities: ['EOS-CAP-0026', 'EOS-CAP-0028', 'EOS-CAP-0029'],
    dependencies: index < 5 ? ['Commercial readiness', 'Enterprise onboarding'] : ['DTA lifecycle', 'Governance', 'External integrations']
  })),
  liveStatus: makeLiveStatus({
    status: 'Amber',
    lifecycleStatus: 'Defined',
    healthScore: 76,
    progress: 28,
    summary: 'Revenue Engine is modeled with initial revenue streams but not connected to customer or finance workflows.',
    requiresAttention: true,
    attentionLevel: 'Medium',
    recommendedAction: 'Prioritize commercial pipeline execution after DTA lifecycle and valuation expansion.',
    availableActions: ['Review revenue streams', 'Review dependencies', 'Review commercial readiness']
  })
};

export const dtaLifecycle = {
  id: 'EOS-DTA-LIFECYCLE',
  name: 'Digital Twin Asset Lifecycle',
  owner: 'Atlas',
  status: 'Defined',
  stages: [
    'Discovery',
    'Assessment',
    'Digital Mirror',
    'Enterprise Model',
    'Digital Twin Asset',
    'Monitoring',
    'Optimization',
    'Valuation',
    'Commercialization',
    'Asset Management',
    'Exchange Listing'
  ].map((name, index) => ({
    id: `EOS-DTA-STAGE-${String(index + 1).padStart(2, '0')}`,
    name,
    sequence: index + 1,
    futureDtax: name === 'Exchange Listing',
    governanceRequired: index >= 1,
    valuationRequired: index >= 7
  })),
  assets: [
    {
      id: 'DTA-EPERCENT-001',
      name: 'ePercent Enterprise Digital Twin',
      lifecycleStage: 'Enterprise Model',
      progress: 38,
      recommendedAction: 'Approve DTA formation criteria and complete Digital Mirror evidence.'
    },
    {
      id: 'DTA-EOS-001',
      name: 'EOS Platform Digital Twin',
      lifecycleStage: 'Monitoring',
      progress: 62,
      recommendedAction: 'Continue strengthening live platform telemetry and valuation evidence.'
    },
    {
      id: 'DTA-OIL-001',
      name: 'Example Oil & Gas Enterprise',
      lifecycleStage: 'Digital Mirror',
      progress: 28,
      recommendedAction: 'Use as a visual demonstration model until real enterprise onboarding data is approved.'
    }
  ],
  liveStatus: makeLiveStatus({
    status: 'Amber',
    lifecycleStatus: 'Defined',
    healthScore: 78,
    progress: 36,
    summary: 'DTA lifecycle is defined for Mission Control, with operational lifecycle workflows still pending.',
    requiresAttention: true,
    attentionLevel: 'Medium',
    recommendedAction: 'Build DTA lifecycle management next to make lifecycle stages operational.',
    availableActions: ['Review lifecycle', 'Review DTA stages', 'Review governance requirements']
  })
};

export const kipr = {
  id: 'EOS-KIPR',
  name: 'Knowledge, Intellectual Property, Patents, and Research',
  owner: 'Athena',
  status: 'Foundation',
  areas: [
    'Knowledge Assets',
    'White Papers',
    'Academic Papers',
    'Patents',
    'Research Projects',
    'Investor Briefs',
    'Conference Papers',
    'Doctoral Research',
    'Publications',
    'Commercial IP',
    'Future Books'
  ].map((name, index) => ({
    id: `EOS-KIPR-AREA-${String(index + 1).padStart(2, '0')}`,
    name,
    status: index < 5 ? 'Active' : 'Defined',
    reviewCycle: 'Monthly',
    publicationReadiness: index < 3 ? 'Drafting' : 'Pending Assessment',
    commercialValue: index < 5 ? 'High' : 'Medium',
    researchValue: 'High',
    investorRelevance: index < 7 ? 'High' : 'Medium'
  })),
  documents: [
    {
      id: 'RP-001',
      title: 'The Live Enterprise Object Model',
      owner: 'Athena',
      status: 'Draft',
      linkedEnterpriseObjects: ['EOS-MISSION-CONTROL-NAVIGATION', 'EOS-TECHNOLOGY-FLYWHEEL'],
      linkedDtas: ['DTA-EOS-001'],
      linkedAgents: ['EOS-AGENT-ATHENA']
    },
    {
      id: 'RP-002',
      title: 'The Operational Digital Twin',
      owner: 'Athena',
      status: 'Draft',
      linkedEnterpriseObjects: ['EOS-DTA-LIFECYCLE', 'EOS-DTA-MONITORING'],
      linkedDtas: ['DTA-EPERCENT-001', 'DTA-EOS-001'],
      linkedAgents: ['EOS-AGENT-ATHENA', 'EOS-AGENT-ATLAS']
    },
    {
      id: 'RP-003',
      title: 'The Second Balance Sheet',
      owner: 'Athena',
      status: 'Draft',
      linkedEnterpriseObjects: ['EOS-SECOND-BALANCE-SHEET', 'EOS-DIGITAL-ENTERPRISE-VALUATION'],
      linkedDtas: ['DTA-EPERCENT-001'],
      linkedAgents: ['EOS-AGENT-ATHENA']
    }
  ],
  liveStatus: makeLiveStatus({
    status: 'Amber',
    lifecycleStatus: 'Building',
    healthScore: 83,
    progress: 55,
    summary: 'KIPR extends the Agent Knowledge Repository into IP, patents, research, publications, and investor knowledge assets.',
    requiresAttention: true,
    attentionLevel: 'Low',
    recommendedAction: 'Define publication review cycles and IP governance before external publication.',
    availableActions: ['Review KIPR', 'Review research assets', 'Review patent opportunities']
  })
};

export const enterpriseProfile = {
  id: 'EOS-ENTERPRISE-PROFILE',
  company: 'ePercent',
  role: ['Developer', 'Owner', 'Operator', 'Reference Enterprise'],
  status: 'Running on EOS',
  logoUrl: '',
  brandColor: '#20c997',
  industry: 'AI-Native Enterprise',
  enterpriseType: 'Reference Enterprise',
  visualTheme: 'dark-teal-command',
  eosPlatform: 'Operational Alpha',
  executiveAiWorkforce: 'Active organizational model',
  enterpriseValue: 2500000,
  enterpriseValueBasis: valuationDisclaimer,
  digitalTwinStatus: 'Reference enterprise in formation',
  secondBalanceSheet: 'Draft internal methodology',
  knowledgeAssets: 5,
  researchAssets: 4,
  commercialReadiness: 'Foundation',
  investorReadiness: 'In Progress',
  linkedEnterpriseObjects: linkedCoreObjects,
  liveStatus: makeLiveStatus({
    status: 'Amber',
    lifecycleStatus: 'In Progress',
    healthScore: 82,
    progress: 52,
    summary: 'ePercent is represented as the first live enterprise running on EOS.',
    requiresAttention: true,
    attentionLevel: 'Low',
    recommendedAction: 'Complete DTA lifecycle and commercial readiness evidence before external enterprise pilots.',
    availableActions: ['Review enterprise profile', 'Review DTA status', 'Review commercial readiness']
  })
};

const industries = [
  'Government',
  'Infrastructure',
  'Energy',
  'Oil & Gas',
  'Healthcare',
  'Finance',
  'Banking',
  'Insurance',
  'Education',
  'Universities',
  'Manufacturing',
  'Mining',
  'Transportation',
  'Telecommunications',
  'Capital Markets',
  'Sovereign Wealth Funds',
  'Ports',
  'Airports',
  'Rail',
  'Utilities',
  'Real Estate',
  'Agriculture'
];

export const industryFramework = {
  id: 'EOS-INDUSTRY-FRAMEWORK',
  name: 'EOS Cross Industry Framework',
  owner: 'Mercury',
  status: 'Defined',
  industries: industries.map((name, index) => ({
    id: `EOS-IND-${String(index + 1).padStart(2, '0')}`,
    name,
    currentMaturity: index < 4 ? 'Exploratory' : 'Template Candidate',
    templates: index < 6 ? ['Enterprise Object Map', 'DTA Candidate Map'] : ['Opportunity Template'],
    enterpriseObjects: ['Strategy Object', 'Operations Object', 'Knowledge Object'],
    potentialDtas: [`${name} Enterprise Digital Twin`, `${name} Asset Portfolio Twin`],
    exampleOpportunities: [
      `${name} operating model modernization`,
      `${name} digital asset governance`,
      `${name} intelligence and valuation layer`
    ]
  })),
  liveStatus: makeLiveStatus({
    status: 'Blue',
    lifecycleStatus: 'Defined',
    healthScore: 79,
    progress: 30,
    summary: 'Cross Industry Framework is defined for future industry templates and opportunity scanning.',
    requiresAttention: false,
    attentionLevel: 'No Action Required',
    recommendedAction: 'Prioritize industry templates after DTA lifecycle and opportunity engine expansion.',
    availableActions: ['Review industries', 'Review DTA candidates', 'Review opportunities']
  })
};

export const readinessAssessments = {
  investor: {
    id: 'EOS-INVESTOR-READINESS-ASSESSMENT',
    status: 'In Progress',
    score: 62,
    strengths: ['Clear strategic thesis', 'Live Mission Control demo', 'DTA and Second Balance Sheet narrative'],
    gaps: ['Audited valuation absent', 'Customer traction not represented', 'Presentation source files missing'],
    recommendedAction: 'Package strategic narrative, DTA lifecycle, and valuation assumptions into a governed investor update.'
  },
  commercial: {
    id: 'EOS-COMMERCIAL-READINESS-ASSESSMENT',
    status: 'Foundation',
    score: 44,
    strengths: ['Platform architecture visible', 'Revenue streams modeled', 'Enterprise profile exists'],
    gaps: ['No customer onboarding workflow', 'No pricing model', 'No contract or billing integration'],
    recommendedAction: 'Build commercial pipeline execution and enterprise onboarding after DTA lifecycle.'
  },
  research: {
    id: 'EOS-RESEARCH-READINESS-ASSESSMENT',
    status: 'Strong Foundation',
    score: 70,
    strengths: ['KIPR model', 'Seeded Athena research projects', 'Second Balance Sheet and Live Object research themes'],
    gaps: ['Formal literature references not attached', 'Publication review workflow incomplete', 'Patent claims not drafted'],
    recommendedAction: 'Create KIPR publication and IP governance workflow.'
  }
};

export const strategicAlignment = {
  id: 'EOS-STRATEGIC-ALIGNMENT',
  name: 'EOS Strategic Alignment Layer',
  capability: 'EOS-CAP-0029',
  owner: 'Eric Olo',
  status: 'Operational Foundation',
  thesis: investmentThesisAlignment,
  technologyFlywheel,
  threeHorizonRoadmap,
  revenueEngine,
  dtaLifecycle,
  kipr,
  enterpriseProfile,
  industryFramework,
  readinessAssessments,
  linkedEnterpriseObjects: [
    ...linkedCoreObjects,
    'EOS-INVESTMENT-THESIS',
    'EOS-TECHNOLOGY-FLYWHEEL',
    'EOS-THREE-HORIZON-ROADMAP',
    'EOS-REVENUE-ENGINE',
    'EOS-DTA-LIFECYCLE',
    'EOS-KIPR',
    'EOS-ENTERPRISE-PROFILE',
    'EOS-INDUSTRY-FRAMEWORK'
  ],
  liveStatus: makeLiveStatus({
    status: 'Amber',
    lifecycleStatus: 'In Progress',
    healthScore: 84,
    progress: 58,
    summary: 'Strategic alignment layer is live and connecting investment thesis concepts to EOS platform objects.',
    requiresAttention: true,
    attentionLevel: 'Medium',
    recommendedAction: 'Approve strategic narrative language and source presentation mapping before investor use.',
    availableActions: ['Review investment thesis', 'Review flywheel', 'Review revenue engine', 'Review readiness']
  })
};
