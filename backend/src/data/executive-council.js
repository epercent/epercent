const councilTimestamp = '2026-07-03T17:05:00.000Z';

const councilActions = [
  'Open Executive Office',
  'Request Briefing',
  'Prepare Executive Review Session',
  'Prepare Executive Communication',
  'Review Department Work',
  'Prepare Executive Assignment',
  'Escalate Executive Attention Item',
  'View Department Portfolio'
];

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
    lastActivity: councilTimestamp,
    requiresAttention,
    attentionLevel,
    recommendedAction,
    availableActions
  };
}

function initialsFor(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();
}

const executiveProfileSeed = [
  {
    id: 'EOS-EXEC-ERIC-OLO',
    name: 'Eric Olo',
    role: 'Founder, CEO & Chief Vision Architect',
    type: 'Human Executive',
    department: 'Executive',
    reportsTo: 'EOS Board',
    responsibilities: ['Vision', 'Strategy', 'Enterprise value', 'Investor alignment', 'Founder governance'],
    currentFocus: 'Define EOS strategic direction, commercialization path, and enterprise value thesis.',
    status: 'Active',
    healthScore: 94,
    progress: 72,
    attentionLevel: 'Low',
    requiresAttention: true,
    summary: 'CEO cockpit is active and directing EOS roadmap priorities.',
    recommendedAction: 'Review PMO roadmap priorities and approve the next execution sequence.',
    availableActions: councilActions,
    linkedEnterpriseObjects: ['EOS-EXECUTIVE-COUNCIL', 'EOS-DIGITAL-ENTERPRISE-HEADQUARTERS', 'EOS-MASTER-ROADMAP'],
    linkedPrograms: ['Investor Readiness', 'Commercial Launch', 'Second Balance Sheet'],
    lastActivity: councilTimestamp
  },
  {
    id: 'EOS-EXEC-CHATGPT',
    name: 'ChatGPT',
    role: 'Chief Technology Officer & Chief Systems Architect',
    type: 'AI Executive Advisor',
    department: 'Technology',
    reportsTo: 'Eric Olo',
    responsibilities: ['Technology strategy', 'Systems architecture', 'Capability governance', 'Executive advisory'],
    currentFocus: 'Translate CEO vision into system architecture, roadmap sequencing, and technical governance.',
    status: 'Active',
    healthScore: 91,
    progress: 68,
    attentionLevel: 'Low',
    requiresAttention: true,
    summary: 'CTO advisory layer is coordinating system strategy and execution priorities.',
    recommendedAction: 'Review dependency and prioritization engine requirements for the next capability.',
    availableActions: councilActions,
    linkedEnterpriseObjects: ['EOS-EXECUTIVE-COUNCIL', 'EOS-DIGITAL-ENTERPRISE-HEADQUARTERS', 'EOS-PMO'],
    linkedPrograms: ['Engineering Foundation', 'Agent Operating System (AOS)', 'Investor Readiness'],
    lastActivity: councilTimestamp
  },
  {
    id: 'EOS-AGENT-CODEX',
    name: 'Codex',
    role: 'Chief Engineering Officer',
    type: 'Engineering Agent',
    department: 'Engineering',
    reportsTo: 'Chief Technology Officer',
    responsibilities: ['Software engineering', 'Build verification', 'Refactoring', 'Release engineering'],
    currentFocus: 'Build EOS capabilities, maintain code quality, and verify every release path.',
    status: 'Active',
    healthScore: 95,
    progress: 76,
    attentionLevel: 'No Action Required',
    requiresAttention: false,
    summary: 'Engineering delivery is operational with lint, build, test, backup, and status verification.',
    recommendedAction: 'Continue implementation of prioritized PMO capabilities.',
    availableActions: councilActions,
    linkedEnterpriseObjects: ['EOS-AGENT-CODEX', 'EOS-CAP-0008', 'EOS-CAP-0020'],
    linkedPrograms: ['Engineering Foundation', 'Digital Twin Asset Platform (DTAP)'],
    lastActivity: councilTimestamp
  },
  {
    id: 'EOS-AGENT-ATHENA',
    name: 'Athena',
    role: 'Chief Research Officer',
    type: 'Research Agent',
    department: 'Research',
    reportsTo: 'Chief Technology Officer',
    responsibilities: ['Research', 'White papers', 'Academic publications', 'Patents', 'Business impact assessments'],
    currentFocus: 'Develop EOS research portfolio and Second Balance Sheet publication themes.',
    status: 'Active',
    healthScore: 88,
    progress: 61,
    attentionLevel: 'Medium',
    requiresAttention: true,
    summary: 'Research portfolio is active and needs reference expansion for publication readiness.',
    recommendedAction: 'Prioritize references for Digital Twin Asset and Second Balance Sheet research.',
    availableActions: councilActions,
    linkedEnterpriseObjects: ['EOS-AGENT-ATHENA', 'EOS-AKR', 'RP-001', 'RP-002', 'RP-003', 'RP-004'],
    linkedPrograms: ['Research & Publications', 'Second Balance Sheet', 'Investor Readiness'],
    lastActivity: councilTimestamp
  },
  {
    id: 'EOS-AGENT-HERMES',
    name: 'Hermes',
    role: 'Chief Knowledge Officer',
    type: 'Knowledge Agent',
    department: 'Knowledge',
    reportsTo: 'Chief Technology Officer',
    responsibilities: ['Knowledge Vault', 'Genesis', 'Enterprise Objects', 'Documentation', 'Change management'],
    currentFocus: 'Maintain knowledge governance, Enterprise Object links, and roadmap documentation.',
    status: 'Active',
    healthScore: 90,
    progress: 70,
    attentionLevel: 'No Action Required',
    requiresAttention: false,
    summary: 'Knowledge governance is operational across PMO, AKR, and Enterprise Object records.',
    recommendedAction: 'Continue linking roadmap capabilities to knowledge assets.',
    availableActions: councilActions,
    linkedEnterpriseObjects: ['EOS-AGENT-HERMES', 'EOS-KNOWLEDGE-GENESIS', 'EOS-WF-KNOWLEDGE-MANAGEMENT'],
    linkedPrograms: ['Research & Publications', 'Agent Operating System (AOS)'],
    lastActivity: councilTimestamp
  },
  {
    id: 'EOS-AGENT-ATLAS',
    name: 'Atlas',
    role: 'Chief Enterprise Architect',
    type: 'Architecture Agent',
    department: 'Architecture',
    reportsTo: 'Chief Technology Officer',
    responsibilities: ['Architecture', 'Capability dependencies', 'Technical debt', 'Scalability', 'Architecture reviews'],
    currentFocus: 'Prepare Digital Twin Asset architecture and future persistence boundaries.',
    status: 'Active',
    healthScore: 84,
    progress: 42,
    attentionLevel: 'Low',
    requiresAttention: true,
    summary: 'Architecture roadmap is defined but persistence and dependency models need design decisions.',
    recommendedAction: 'Review persistence and dependency visualization architecture.',
    availableActions: councilActions,
    linkedEnterpriseObjects: ['EOS-AGENT-ATLAS', 'EOS-WF-DIGITAL-TWIN-FORMATION', 'EOS-MASTER-ROADMAP'],
    linkedPrograms: ['Digital Twin Asset Platform (DTAP)', 'Digital Twin Asset Management (DTAM)'],
    lastActivity: councilTimestamp
  },
  {
    id: 'EOS-AGENT-MERCURY',
    name: 'Mercury',
    role: 'Chief Opportunity Officer',
    type: 'Opportunity Intelligence Agent',
    department: 'Opportunity',
    reportsTo: 'Chief Technology Officer',
    responsibilities: ['Market intelligence', 'Enterprise discovery', 'Opportunity scanning', 'Competitive analysis'],
    currentFocus: 'Prepare the future Opportunity Engine and market intelligence operating model.',
    status: 'Active',
    healthScore: 78,
    progress: 29,
    attentionLevel: 'Low',
    requiresAttention: true,
    summary: 'Opportunity program is defined and awaiting intelligence ingestion capability.',
    recommendedAction: 'Define initial market signal sources before Opportunity Engine implementation.',
    availableActions: councilActions,
    linkedEnterpriseObjects: ['EOS-AGENT-MERCURY', 'EOS-WF-OPPORTUNITY-DISCOVERY'],
    linkedPrograms: ['Opportunity Engine', 'Digital Twin Asset Exchange (DTAX)', 'Commercial Launch'],
    lastActivity: councilTimestamp
  },
  {
    id: 'EOS-AGENT-ARGUS',
    name: 'Argus',
    role: 'Chief Operations Officer',
    type: 'Operations Agent',
    department: 'Operations',
    reportsTo: 'Chief Technology Officer',
    responsibilities: ['Monitoring', 'Telemetry', 'Platform health', 'Alerts', 'Operations'],
    currentFocus: 'Track platform health and prepare operations telemetry requirements.',
    status: 'Active',
    healthScore: 82,
    progress: 36,
    attentionLevel: 'Low',
    requiresAttention: true,
    summary: 'Operations status is visible but telemetry and alerting are not implemented yet.',
    recommendedAction: 'Define telemetry and alert requirements for the operations layer.',
    availableActions: councilActions,
    linkedEnterpriseObjects: ['EOS-AGENT-ARGUS', 'EOS-PMO', 'EOS-MASTER-ROADMAP'],
    linkedPrograms: ['Agent Resource Management (ARM)', 'Engineering Foundation'],
    lastActivity: councilTimestamp
  },
  {
    id: 'EOS-AGENT-VULCAN',
    name: 'Vulcan',
    role: 'Chief Quality Officer',
    type: 'Quality, Security & Performance Agent',
    department: 'Quality',
    reportsTo: 'Chief Technology Officer',
    responsibilities: ['QA', 'Testing', 'Security', 'Performance', 'Compliance'],
    currentFocus: 'Maintain quality gates and prepare security/performance verification roadmap.',
    status: 'Active',
    healthScore: 89,
    progress: 64,
    attentionLevel: 'No Action Required',
    requiresAttention: false,
    summary: 'Quality gate verification is operational across lint, build, tests, backup, and status.',
    recommendedAction: 'Extend verification with security and performance checks in a future capability.',
    availableActions: councilActions,
    linkedEnterpriseObjects: ['EOS-AGENT-VULCAN', 'EOS-CAP-0014', 'EOS-WF-PROGRAM-MANAGEMENT'],
    linkedPrograms: ['Engineering Foundation', 'Commercial Launch'],
    lastActivity: councilTimestamp
  }
];

export const executiveProfiles = executiveProfileSeed.map((profile) => ({
  avatarUrl: '',
  avatarType: profile.type === 'Human Executive' ? 'human-initials' : 'agent-initials',
  fallbackInitials: initialsFor(profile.name),
  statusBadge: profile.status,
  roleImage: '',
  ...profile
}));

export const ceoCockpit = {
  platformVersion: '0.25.0',
  platformHealth: 89,
  currentSprint: 'Platform Audit & Capability Readiness Center',
  currentCapability: 'EOS-CAP-0033',
  executiveAttentionRequired: executiveProfiles.filter((profile) => profile.requiresAttention).length,
  topRecommendedAction: 'Review the audit readiness matrix, functional gaps, placeholder register, and recommended build sequence before the next strategic program.',
  activeExecutives: executiveProfiles.filter((profile) => profile.status === 'Active').length,
  currentRoadmapPhase: 'Alpha'
};

export const executiveCouncil = {
  id: 'EOS-EXECUTIVE-COUNCIL',
  name: 'EOS Executive Council',
  owner: 'Eric Olo',
  status: 'Operational',
  purpose: 'Represent the leadership structure of the AI-native enterprise inside EOS.',
  executiveCount: executiveProfiles.length,
  profiles: executiveProfiles,
  liveStatus: makeLiveStatus({
    status: 'Amber',
    lifecycleStatus: 'In Progress',
    healthScore: 88,
    progress: 58,
    summary: 'Executive Council is established and exposing leadership status in Mission Control.',
    requiresAttention: true,
    attentionLevel: 'Low',
    recommendedAction: 'Review executives requiring attention and approve the next operating layer.',
    availableActions: ['Open Council', 'Review executives', 'Review action governance', 'View portfolio']
  })
};

export const digitalEnterpriseHeadquarters = {
  id: 'EOS-DIGITAL-ENTERPRISE-HEADQUARTERS',
  name: 'EOS Digital Enterprise Headquarters',
  owner: 'Eric Olo',
  status: 'Operational',
  purpose: 'Provide the executive operating surface for the AI-native enterprise.',
  currentViews: [
    'CEO Cockpit',
    'Executive Council',
    'Executive Action Governance',
    'Executive Offices',
    'PMO View',
    'Portfolio Mode',
    'Operational Mode'
  ],
  liveStatus: makeLiveStatus({
    status: 'Amber',
    lifecycleStatus: 'Building',
    healthScore: 84,
    progress: 41,
    summary: 'Digital Enterprise Headquarters foundation is active in Mission Control.',
    requiresAttention: true,
    attentionLevel: 'Low',
    recommendedAction: 'Use action governance to review approvals while execution remains disabled.',
    availableActions: ['Open Headquarters', 'Review Council', 'Review actions', 'Open PMO View']
  })
};
