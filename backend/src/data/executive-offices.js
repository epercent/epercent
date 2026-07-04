import { executiveActions } from './executive-actions.js';
import { executiveProfiles } from './executive-council.js';

export const officeTimestamp = '2026-07-03T17:58:00.000Z';

const standardActions = [
  'Inspect Enterprise Object',
  'Review Knowledge Asset',
  'Review Workflow Status',
  'Prepare Executive Assignment (display only)',
  'Request Executive Review (display only)',
  'Prepare Review Session (future capability)',
  'Prepare Executive Briefing (future capability)'
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
    lastActivity: officeTimestamp,
    requiresAttention,
    attentionLevel,
    recommendedAction,
    availableActions
  };
}

function officeIdFor(profile) {
  return `EOS-OFFICE-${profile.name.toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
}

const officeBlueprints = {
  'EOS-EXEC-ERIC-OLO': {
    briefing: 'Founder office focused on enterprise vision, investor narrative, strategic sequencing, and CEO decisions.',
    todaysSummary: 'EOS has active executive visibility, governed actions, roadmap control, and emerging office infrastructure.',
    currentPriorities: ['Approve execution sequencing', 'Review investor-ready platform narrative', 'Prioritize persistence before execution'],
    attentionItems: ['Approve persistent governance data store', 'Review action execution risk posture'],
    reviewTime: '18 minutes',
    departmentHealth: 92,
    kpis: [
      { label: 'Strategic Clarity', value: '92%', trend: 'Stable' },
      { label: 'Investor Readiness', value: '58%', trend: 'Rising' },
      { label: 'Decision Queue', value: '6', trend: 'Needs Review' }
    ],
    projects: ['Digital Enterprise Headquarters', 'Second Balance Sheet thesis', 'Investor roadmap package'],
    capabilities: ['EOS-CAP-0020', 'EOS-CAP-0021', 'EOS-CAP-0024'],
    programs: ['Investor Readiness', 'Commercial Launch', 'Second Balance Sheet'],
    objects: ['EOS-EXECUTIVE-COUNCIL', 'EOS-DIGITAL-ENTERPRISE-HEADQUARTERS', 'EOS-MASTER-ROADMAP'],
    knowledge: ['EOS-KNOWLEDGE-GENESIS', 'RP-003'],
    workflows: ['EOS-WF-PROGRAM-MANAGEMENT', 'EOS-WF-EXECUTIVE-ACTION-GOVERNANCE'],
    events: ['EOS-EVENT-CEO-COCKPIT-UPDATED', 'EOS-EVENT-EXECUTIVE-ACTION-REVIEW-REQUESTED'],
    portfolio: ['Enterprise value thesis', 'Commercial roadmap', 'Investor narrative'],
    widgets: [
      { title: 'CEO Cockpit', metrics: ['Platform health', 'Executive attention', 'Current capability'] },
      { title: 'Investor View', metrics: ['Roadmap proof', 'Research assets', 'Governed actions'] }
    ]
  },
  'EOS-EXEC-CHATGPT': {
    briefing: 'CTO office focused on systems strategy, technical sequencing, capability design, and architecture governance.',
    todaysSummary: 'Technology strategy is aligning Executive Council, PMO, Mission Control, and action governance.',
    currentPriorities: ['Sequence persistence architecture', 'Prepare permission model', 'Review platform navigation structure'],
    attentionItems: ['Confirm persistence scope', 'Approve API mutation boundaries'],
    reviewTime: '14 minutes',
    departmentHealth: 90,
    kpis: [
      { label: 'Architecture Readiness', value: '71%', trend: 'Rising' },
      { label: 'Capability Alignment', value: '88%', trend: 'Stable' },
      { label: 'Open Design Decisions', value: '4', trend: 'Review' }
    ],
    projects: ['Governed action architecture', 'Persistence design', 'Mission Control navigation'],
    capabilities: ['EOS-CAP-0021', 'EOS-CAP-0023', 'EOS-CAP-0024'],
    programs: ['Engineering Foundation', 'Agent Operating System (AOS)', 'Investor Readiness'],
    objects: ['EOS-PMO', 'EOS-MASTER-ROADMAP', 'EOS-EXECUTIVE-ACTION-FRAMEWORK'],
    knowledge: ['EOS-KNOWLEDGE-CORE-API', 'EOS-KNOWLEDGE-MISSION-CONTROL'],
    workflows: ['EOS-WF-PROGRAM-MANAGEMENT', 'EOS-WF-EXECUTIVE-OFFICE-MANAGEMENT'],
    events: ['EOS-EVENT-DEPARTMENT-STATUS-UPDATED', 'EOS-EVENT-EXECUTIVE-BRIEFING-UPDATED'],
    portfolio: ['System architecture', 'Capability governance', 'Technical roadmap'],
    widgets: [
      { title: 'Technology Strategy', metrics: ['Architecture readiness', 'Capability sequence', 'Risk controls'] },
      { title: 'Systems Review', metrics: ['API scope', 'Data boundaries', 'Verification depth'] }
    ]
  },
  'EOS-AGENT-CODEX': {
    briefing: 'Engineering office responsible for implementation, code quality, build health, release readiness, and automation.',
    todaysSummary: 'Engineering is stable with lint, build, test, backup, and status verification active.',
    currentPriorities: ['Implement Strategy Governance Alignment', 'Verify persistent strategy records', 'Prepare governed write path'],
    attentionItems: ['Review valuation disclaimer coverage', 'Approve strategy endpoint verification'],
    reviewTime: '12 minutes',
    departmentHealth: 95,
    kpis: [
      { label: 'Build Health', value: 'Passing', trend: 'Stable' },
      { label: 'Verification Coverage', value: 'High', trend: 'Rising' },
      { label: 'Technical Debt', value: 'Medium', trend: 'Watch' }
    ],
    projects: ['Mission Control offices', 'EOS Core API registry expansion', 'Automated verification'],
    capabilities: ['EOS-CAP-0008', 'EOS-CAP-0025', 'EOS-CAP-0026'],
    programs: ['Engineering Foundation', 'Investor Readiness', 'Digital Twin Asset Platform (DTAP)'],
    objects: ['EOS-AGENT-CODEX', 'EOS-API-001', 'EOS-MC-001'],
    knowledge: ['EOS-KNOWLEDGE-CORE-API'],
    workflows: ['EOS-WF-SOURCE-CONTROL-RELEASE', 'EOS-WF-EXECUTIVE-OFFICE-MANAGEMENT'],
    events: ['EOS-EVENT-EXECUTIVE-OFFICE-OPENED', 'EOS-EVENT-DEPARTMENT-STATUS-UPDATED'],
    portfolio: ['Engineering Dashboard', 'Current Sprint', 'Current Capability', 'Technical Debt', 'Build Health', 'Release Queue', 'Architecture Backlog'],
    widgets: [
      { title: 'Engineering Dashboard', metrics: ['Current Sprint', 'Current Capability', 'Build Health'] },
      { title: 'Technical Debt', metrics: ['Persistence', 'Navigation', 'Permissions'] },
      { title: 'Release Queue', metrics: ['Version 0.18.0', 'Backup required', 'Verification required'] }
    ]
  },
  'EOS-AGENT-ATHENA': {
    briefing: 'Research office managing publications, investor briefs, patents, white papers, and the EOS research pipeline.',
    todaysSummary: 'Research portfolio is active and aligned to Live Enterprise Objects, Digital Twin Assets, and Second Balance Sheet IP.',
    currentPriorities: ['Advance Second Balance Sheet brief', 'Expand Live Enterprise Object references', 'Prepare investor-ready research summary'],
    attentionItems: ['Approve research prioritization', 'Assign reference collection'],
    reviewTime: '16 minutes',
    departmentHealth: 88,
    kpis: [
      { label: 'Publication Readiness', value: '42%', trend: 'Rising' },
      { label: 'Patent Opportunities', value: '2', trend: 'Review' },
      { label: 'Investor Briefs', value: '1', trend: 'Draft' }
    ],
    projects: ['Live Enterprise Object Model', 'Operational Digital Twin', 'Second Balance Sheet'],
    capabilities: ['EOS-CAP-0015', 'EOS-CAP-0016', 'EOS-CAP-0024'],
    programs: ['Research & Publications', 'Second Balance Sheet', 'Investor Readiness'],
    objects: ['EOS-AGENT-ATHENA', 'EOS-AKR', 'RP-001', 'RP-002', 'RP-003', 'RP-004'],
    knowledge: ['RP-001', 'RP-002', 'RP-003', 'RP-004'],
    workflows: ['EOS-WF-RESEARCH-PUBLICATION', 'EOS-WF-KNOWLEDGE-MANAGEMENT'],
    events: ['EOS-EVENT-AKR-PUBLICATION-READY', 'EOS-EVENT-AKR-PATENT-IDENTIFIED'],
    portfolio: ['Research Portfolio', 'White Papers', 'Academic Papers', 'Investor Briefs', 'Patents', 'Research Pipeline', 'Publication Readiness', 'Knowledge Graph'],
    widgets: [
      { title: 'Research Portfolio', metrics: ['4 active projects', '2 patent candidates', '1 investor brief'] },
      { title: 'Publication Readiness', metrics: ['RP-001 draft', 'RP-002 draft', 'RP-003 investor ready'] },
      { title: 'Knowledge Graph', metrics: ['Live objects', 'Research links', 'Capability links'] }
    ]
  },
  'EOS-AGENT-HERMES': {
    briefing: 'Knowledge office governing Genesis, Enterprise Objects, documentation, institutional memory, and cross references.',
    todaysSummary: 'Knowledge governance is active across capability docs, Enterprise Objects, AKR, and Genesis updates.',
    currentPriorities: ['Maintain capability documentation', 'Improve cross references', 'Prepare Knowledge Vault structure'],
    attentionItems: ['Review knowledge taxonomy', 'Approve Genesis entry format'],
    reviewTime: '10 minutes',
    departmentHealth: 90,
    kpis: [
      { label: 'Knowledge Objects', value: '5', trend: 'Stable' },
      { label: 'Capability Docs', value: 'Active', trend: 'Rising' },
      { label: 'Cross References', value: 'Growing', trend: 'Review' }
    ],
    projects: ['Knowledge Vault', 'Decision records', 'Genesis index'],
    capabilities: ['EOS-CAP-0006', 'EOS-CAP-0015', 'EOS-CAP-0023'],
    programs: ['Research & Publications', 'Agent Operating System (AOS)'],
    objects: ['EOS-AGENT-HERMES', 'EOS-KNOWLEDGE-GENESIS', 'EOS-AKR'],
    knowledge: ['EOS-KNOWLEDGE-GENESIS', 'EOS-KNOWLEDGE-MISSION-CONTROL'],
    workflows: ['EOS-WF-KNOWLEDGE-UPDATE', 'EOS-WF-KNOWLEDGE-MANAGEMENT'],
    events: ['EOS-EVENT-KNOWLEDGE-UPDATED', 'EOS-EVENT-AKR-KNOWLEDGE-UPDATED'],
    portfolio: ['Knowledge Vault', 'Knowledge Objects', 'Decision Records', 'Genesis', 'Cross References', 'Institutional Memory'],
    widgets: [
      { title: 'Knowledge Vault', metrics: ['Genesis', 'Capability docs', 'Decision records'] },
      { title: 'Cross References', metrics: ['Enterprise Objects', 'Workflows', 'Events'] }
    ]
  },
  'EOS-AGENT-ATLAS': {
    briefing: 'Architecture office managing capability maps, dependency graphs, Enterprise Objects, and platform architecture.',
    todaysSummary: 'Architecture is focused on durable persistence boundaries and Digital Twin Asset structure.',
    currentPriorities: ['Define persistence architecture', 'Map capability dependencies', 'Prepare Digital Twin Asset model'],
    attentionItems: ['Approve storage boundary decision', 'Review dependency visualization scope'],
    reviewTime: '13 minutes',
    departmentHealth: 84,
    kpis: [
      { label: 'Architecture Readiness', value: '64%', trend: 'Rising' },
      { label: 'Dependency Clarity', value: 'Medium', trend: 'Review' },
      { label: 'Platform Debt', value: 'Medium', trend: 'Watch' }
    ],
    projects: ['Persistent store design', 'Capability map', 'Digital Twin Asset architecture'],
    capabilities: ['EOS-CAP-0014', 'EOS-CAP-0020', 'EOS-CAP-0023'],
    programs: ['Digital Twin Asset Platform (DTAP)', 'Digital Twin Asset Management (DTAM)'],
    objects: ['EOS-AGENT-ATLAS', 'EOS-MASTER-ROADMAP', 'EOS-WF-DIGITAL-TWIN-FORMATION'],
    knowledge: ['EOS-KNOWLEDGE-ENTERPRISE-OBJECT-REGISTRY', 'RP-002'],
    workflows: ['EOS-WF-DIGITAL-TWIN-FORMATION', 'EOS-WF-PROGRAM-MANAGEMENT'],
    events: ['EOS-EVENT-DIGITAL-TWIN-FORMATION-STARTED', 'EOS-EVENT-PMO-ROADMAP-UPDATED'],
    portfolio: ['Enterprise Architecture', 'Capability Map', 'Dependency Graph', 'Enterprise Objects', 'Platform Architecture'],
    widgets: [
      { title: 'Enterprise Architecture', metrics: ['Capability map', 'Dependency graph', 'Platform architecture'] },
      { title: 'Digital Twin Foundation', metrics: ['Object model', 'Relationship map', 'Asset lifecycle'] }
    ]
  },
  'EOS-AGENT-MERCURY': {
    briefing: 'Opportunity office preparing market intelligence, enterprise opportunities, and Digital Twin Asset commercialization paths.',
    todaysSummary: 'Opportunity Engine is defined but awaits signal ingestion and market intelligence sources.',
    currentPriorities: ['Define market signals', 'Map enterprise opportunity pipeline', 'Prepare DTAX opportunity model'],
    attentionItems: ['Approve initial market categories', 'Select signal sources'],
    reviewTime: '9 minutes',
    departmentHealth: 78,
    kpis: [
      { label: 'Opportunity Pipeline', value: 'Defined', trend: 'Early' },
      { label: 'Signal Sources', value: 'Pending', trend: 'Needs Input' },
      { label: 'Commercial Readiness', value: '22%', trend: 'Rising' }
    ],
    projects: ['Opportunity scanner', 'Industry intelligence', 'Capital opportunities'],
    capabilities: ['EOS-CAP-0007', 'EOS-CAP-0020', 'EOS-CAP-0023'],
    programs: ['Opportunity Engine', 'Digital Twin Asset Exchange (DTAX)', 'Commercial Launch'],
    objects: ['EOS-AGENT-MERCURY', 'EOS-WF-OPPORTUNITY-DISCOVERY'],
    knowledge: ['RP-004'],
    workflows: ['EOS-WF-OPPORTUNITY-DISCOVERY'],
    events: ['EOS-EVENT-OPPORTUNITY-DISCOVERY-STARTED', 'EOS-EVENT-OPPORTUNITY-DISCOVERY-COMPLETED'],
    portfolio: ['Opportunity Scanner', 'Industry Intelligence', 'Enterprise Opportunities', 'Potential Digital Twin Assets', 'Capital Opportunities'],
    widgets: [
      { title: 'Opportunity Scanner', metrics: ['Market signals', 'Enterprise prospects', 'Capital opportunities'] },
      { title: 'Digital Twin Assets', metrics: ['Potential assets', 'Commercial fit', 'Exchange readiness'] }
    ]
  },
  'EOS-AGENT-ARGUS': {
    briefing: 'Operations office monitoring platform health, workflow queues, telemetry needs, and availability.',
    todaysSummary: 'Operations status is visible while telemetry and alerting remain future capabilities.',
    currentPriorities: ['Define telemetry model', 'Prepare alerting requirements', 'Track workflow queue health'],
    attentionItems: ['Approve operations telemetry scope', 'Review alert thresholds'],
    reviewTime: '8 minutes',
    departmentHealth: 82,
    kpis: [
      { label: 'Platform Availability', value: 'Operational', trend: 'Stable' },
      { label: 'Telemetry Coverage', value: 'Planned', trend: 'Pending' },
      { label: 'Workflow Queue', value: '16', trend: 'Active' }
    ],
    projects: ['Operations dashboard', 'Workflow queue', 'Platform availability'],
    capabilities: ['EOS-CAP-0014', 'EOS-CAP-0020', 'EOS-CAP-0023'],
    programs: ['Agent Resource Management (ARM)', 'Engineering Foundation'],
    objects: ['EOS-AGENT-ARGUS', 'EOS-PMO', 'EOS-MASTER-ROADMAP'],
    knowledge: ['EOS-KNOWLEDGE-CORE-API'],
    workflows: ['EOS-WF-PROGRAM-MANAGEMENT', 'EOS-WF-LIVE-OBJECT-STATUS-LAYER'],
    events: ['EOS-EVENT-LIVE-OBJECT-STATUS-UPDATED', 'EOS-EVENT-DEPARTMENT-STATUS-UPDATED'],
    portfolio: ['Operations Dashboard', 'Operations Health', 'Workflow Queue', 'Platform Availability'],
    widgets: [
      { title: 'Operations Dashboard', metrics: ['Availability', 'Workflow queue', 'Telemetry readiness'] },
      { title: 'Platform Health', metrics: ['API status', 'Mission Control', 'Backup status'] }
    ]
  },
  'EOS-AGENT-VULCAN': {
    briefing: 'Quality office managing testing, security, performance, compliance, and release quality gates.',
    todaysSummary: 'Quality verification is passing across lint, build, tests, backup, and status checks.',
    currentPriorities: ['Expand security checks', 'Add performance verification', 'Prepare compliance checklist'],
    attentionItems: ['Approve security baseline scope', 'Review performance thresholds'],
    reviewTime: '11 minutes',
    departmentHealth: 89,
    kpis: [
      { label: 'Test Status', value: 'Passing', trend: 'Stable' },
      { label: 'Security Baseline', value: 'Planned', trend: 'Pending' },
      { label: 'Compliance Readiness', value: 'Defined', trend: 'Rising' }
    ],
    projects: ['Quality dashboard', 'Security baseline', 'Performance checks'],
    capabilities: ['EOS-CAP-0014', 'EOS-CAP-0022', 'EOS-CAP-0023'],
    programs: ['Engineering Foundation', 'Commercial Launch'],
    objects: ['EOS-AGENT-VULCAN', 'EOS-EXECUTIVE-ACTION-FRAMEWORK'],
    knowledge: ['EOS-KNOWLEDGE-CORE-API'],
    workflows: ['EOS-WF-SOURCE-CONTROL-RELEASE', 'EOS-WF-EXECUTIVE-ACTION-GOVERNANCE'],
    events: ['EOS-EVENT-SOURCE-CONTROL-RELEASE-COMPLETED', 'EOS-EVENT-DEPARTMENT-STATUS-UPDATED'],
    portfolio: ['Quality Dashboard', 'Testing', 'Security', 'Performance', 'Compliance'],
    widgets: [
      { title: 'Quality Dashboard', metrics: ['Lint', 'Build', 'Tests'] },
      { title: 'Security & Performance', metrics: ['Security baseline', 'Performance checks', 'Compliance'] }
    ]
  }
};

function officeForProfile(profile) {
  const blueprint = officeBlueprints[profile.id];
  const approvalsWaiting = executiveActions
    .filter((action) => action.sourceExecutive === profile.id && ['Pending', 'Escalated'].includes(action.approvalStatus))
    .slice(0, 4);

  return {
    id: officeIdFor(profile),
    executiveId: profile.id,
    executiveName: profile.name,
    executiveRole: profile.role,
    department: profile.department,
    status: profile.status,
    healthScore: profile.healthScore,
    currentFocus: profile.currentFocus,
    executiveBriefing: blueprint.briefing,
    todaysSummary: blueprint.todaysSummary,
    currentPriorities: blueprint.currentPriorities,
    itemsRequiringCeoAttention: blueprint.attentionItems,
    recommendedActions: profile.recommendedAction ? [profile.recommendedAction, ...standardActions.slice(0, 3)] : standardActions.slice(0, 3),
    estimatedCeoReviewTime: blueprint.reviewTime,
    departmentHealth: blueprint.departmentHealth,
    kpis: blueprint.kpis,
    currentProjects: blueprint.projects,
    currentCapabilities: blueprint.capabilities,
    currentPrograms: blueprint.programs,
    liveEnterpriseObjects: blueprint.objects,
    knowledgeAssets: blueprint.knowledge,
    workflows: blueprint.workflows,
    recentEvents: blueprint.events,
    recentActivityTimeline: [
      { timestamp: officeTimestamp, activity: 'Executive Office opened for Mission Control routing.' },
      { timestamp: profile.lastActivity, activity: profile.summary }
    ],
    departmentPortfolio: blueprint.portfolio,
    approvalsWaiting,
    messages: {
      status: 'Future Capability',
      summary: 'Messaging is not implemented. No messages are sent from Executive Offices.'
    },
    meetings: {
      status: 'Future Capability',
      summary: 'Meeting scheduling is not implemented. No calendar events are created from Executive Offices.'
    },
    calendar: {
      status: 'Future Capability',
      summary: 'Calendar integration is not implemented.'
    },
    temporaryAgents: {
      status: 'Future Capability',
      summary: 'Temporary agent allocation is not implemented.'
    },
    permanentAgents: profile.id.startsWith('EOS-AGENT-') ? [profile.id] : ['EOS-AGENT-CODEX', 'EOS-AGENT-HERMES', 'EOS-AGENT-ATHENA'],
    availableActions: standardActions,
    specificWidgets: blueprint.widgets,
    businessValue:
      'Converts executive accountability into an inspectable operating surface for CEO review and investor-ready demonstrations.',
    liveStatus: makeLiveStatus({
      status: profile.requiresAttention ? 'Amber' : 'Green',
      lifecycleStatus: 'Building',
      healthScore: profile.healthScore,
      progress: profile.progress,
      summary: `${profile.name} office is available in Mission Control with portfolio, briefing, approvals, and placeholders.`,
      requiresAttention: profile.requiresAttention,
      attentionLevel: profile.attentionLevel,
      recommendedAction: profile.recommendedAction,
      availableActions: standardActions
    })
  };
}

export const executiveOffices = executiveProfiles.map(officeForProfile);

export const executiveOfficeFramework = {
  id: 'EOS-EXECUTIVE-OFFICE-FRAMEWORK',
  name: 'EOS Executive Office Framework',
  owner: 'Eric Olo',
  status: 'Operational',
  purpose:
    'Transform the Executive Council into a gateway for detailed Executive Offices inside the Digital Enterprise Headquarters.',
  officeCount: executiveOffices.length,
  liveStatus: makeLiveStatus({
    status: 'Amber',
    lifecycleStatus: 'Building',
    healthScore: 87,
    progress: 57,
    summary: 'Executive Office Framework is active with reusable office routing and department-specific office data.',
    requiresAttention: true,
    attentionLevel: 'Low',
    recommendedAction: 'Review executive offices and prioritize persistence before editable office operations.',
    availableActions: ['Open Executive Offices', 'Review CEO attention', 'Review department portfolios']
  })
};
