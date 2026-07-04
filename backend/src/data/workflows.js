import { events } from './events.js';

function eventsForWorkflow(workflowId) {
  return events.filter((event) => event.sourceWorkflowId === workflowId);
}

export const workflows = [
  {
    id: 'EOS-WF-RESEARCH-PUBLICATION',
    name: 'Research Publication',
    description: 'Coordinates source collection, synthesis, drafting, and publication of EOS research outputs.',
    status: 'Running',
    owner: 'Athena',
    steps: ['Collect sources', 'Synthesize findings', 'Draft publication', 'Publish output'],
    currentStep: 'Synthesize findings',
    progress: 58,
    trigger: 'New research brief requested',
    lastRun: '2026-07-03T12:10:00.000Z',
    linkedObjects: ['EOS-CAP-0007', 'EOS-CAP-0006', 'EOS-AGENT-ATHENA', 'EOS-KNOWLEDGE-GENESIS'],
    events: eventsForWorkflow('EOS-WF-RESEARCH-PUBLICATION')
  },
  {
    id: 'EOS-WF-KNOWLEDGE-UPDATE',
    name: 'Knowledge Update',
    description: 'Detects knowledge changes, updates registry records, reviews links, and publishes the new state.',
    status: 'Running',
    owner: 'Hermes',
    steps: ['Detect change', 'Update knowledge object', 'Review links', 'Publish registry change'],
    currentStep: 'Review links',
    progress: 72,
    trigger: 'Knowledge object changed',
    lastRun: '2026-07-03T12:12:00.000Z',
    linkedObjects: ['EOS-CAP-0007', 'EOS-CAP-0006', 'EOS-AGENT-HERMES', 'EOS-KNOWLEDGE-CORE-API'],
    events: eventsForWorkflow('EOS-WF-KNOWLEDGE-UPDATE')
  },
  {
    id: 'EOS-WF-AGENT-COORDINATION',
    name: 'Agent Coordination',
    description: 'Receives multi-agent tasks, assigns agents, coordinates handoffs, and reports execution state.',
    status: 'Running',
    owner: 'Hermes',
    steps: ['Receive task', 'Assign agents', 'Coordinate handoffs', 'Report completion'],
    currentStep: 'Coordinate handoffs',
    progress: 64,
    trigger: 'Multi-agent task created',
    lastRun: '2026-07-03T12:14:00.000Z',
    linkedObjects: [
      'EOS-CAP-0007',
      'EOS-CAP-0005',
      'EOS-AGENT-ATHENA',
      'EOS-AGENT-HERMES',
      'EOS-AGENT-ATLAS'
    ],
    events: eventsForWorkflow('EOS-WF-AGENT-COORDINATION')
  },
  {
    id: 'EOS-WF-OPPORTUNITY-DISCOVERY',
    name: 'Opportunity Discovery',
    description: 'Scans signals, scores opportunities, routes recommendations, and tracks executive decisions.',
    status: 'Completed',
    owner: 'Athena',
    steps: ['Scan signals', 'Score opportunities', 'Route recommendations', 'Track decisions'],
    currentStep: 'Track decisions',
    progress: 100,
    trigger: 'Market signal threshold reached',
    lastRun: '2026-07-03T12:16:00.000Z',
    linkedObjects: ['EOS-CAP-0007', 'EOS-CAP-0005', 'EOS-AGENT-ATHENA', 'EOS-MC-001'],
    events: eventsForWorkflow('EOS-WF-OPPORTUNITY-DISCOVERY')
  },
  {
    id: 'EOS-WF-DIGITAL-TWIN-FORMATION',
    name: 'Digital Twin Formation',
    description: 'Maps Enterprise Objects, creates twin models, validates relationships, and activates the twin.',
    status: 'Running',
    owner: 'Atlas',
    steps: ['Map source objects', 'Create twin model', 'Validate relationships', 'Activate twin'],
    currentStep: 'Create twin model',
    progress: 36,
    trigger: 'Enterprise Object relationship update',
    lastRun: '2026-07-03T12:18:00.000Z',
    linkedObjects: ['EOS-CAP-0007', 'EOS-API-001', 'EOS-AGENT-ATLAS'],
    events: eventsForWorkflow('EOS-WF-DIGITAL-TWIN-FORMATION')
  },
  {
    id: 'EOS-WF-DEVELOPMENT-FOUNDATION',
    name: 'Development Foundation',
    description: 'Bootstraps, starts, stops, statuses, tests, lints, and builds EOS from root workspace scripts.',
    status: 'Completed',
    owner: 'EOS Platform',
    steps: ['Initialize Git', 'Configure workspace scripts', 'Create workspace folders', 'Verify services', 'Publish developer docs'],
    currentStep: 'Publish developer docs',
    progress: 100,
    trigger: 'Developer environment setup requested',
    lastRun: '2026-07-03T12:30:00.000Z',
    linkedObjects: ['EOS-CAP-0008', 'EOS-CAP-0007', 'EOS-API-001', 'EOS-MC-001'],
    events: eventsForWorkflow('EOS-WF-DEVELOPMENT-FOUNDATION')
  },
  {
    id: 'EOS-WF-BACKUP-RECOVERY',
    name: 'Backup & Recovery',
    description: 'Creates versioned EOS archives, validates checksums, records metadata, and prepares restore reports.',
    status: 'Running',
    owner: 'EOS Platform',
    steps: ['Create timestamp', 'Archive workspace', 'Calculate checksum', 'Record metadata', 'Prepare restore report'],
    currentStep: 'Record metadata',
    progress: 88,
    trigger: 'Engineering backup requested',
    lastRun: '2026-07-03T12:45:00.000Z',
    linkedObjects: ['EOS-CAP-0009', 'EOS-CAP-0008', 'EOS-CAP-0007', 'EOS-API-001', 'EOS-MC-001'],
    events: eventsForWorkflow('EOS-WF-BACKUP-RECOVERY')
  },
  {
    id: 'EOS-WF-SOURCE-CONTROL-RELEASE',
    name: 'Source Control & Release Management',
    description: 'Inspects Git status, runs release verification, creates backups, updates release manifests, writes release notes, and prepares semantic tags.',
    status: 'Running',
    owner: 'Codex',
    steps: ['Inspect Git state', 'Run release verification', 'Create backup', 'Update release manifest', 'Prepare semantic tag'],
    currentStep: 'Update release manifest',
    progress: 82,
    trigger: 'Release preparation requested',
    lastRun: '2026-07-03T14:50:00.000Z',
    linkedObjects: [
      'EOS-CAP-0010',
      'EOS-CAP-0007',
      'EOS-CAP-0008',
      'EOS-CAP-0009',
      'EOS-API-001',
      'EOS-AGENT-CODEX',
      'EOS-AGENT-VULCAN'
    ],
    events: eventsForWorkflow('EOS-WF-SOURCE-CONTROL-RELEASE')
  },
  {
    id: 'EOS-WF-INITIAL-REPOSITORY-BASELINE',
    name: 'Initial Repository Baseline',
    description: 'Stages the EOS source tree, creates the Alpha Genesis commit, creates the local release tag, and verifies repository cleanliness.',
    status: 'Completed',
    owner: 'Codex',
    steps: ['Review repository', 'Stage source files', 'Create Genesis commit', 'Create local tag', 'Verify clean tree'],
    currentStep: 'Verify clean tree',
    progress: 100,
    trigger: 'Initial source control baseline requested',
    lastRun: '2026-07-03T15:05:00.000Z',
    linkedObjects: [
      'EOS-CAP-0011',
      'EOS-CAP-0010',
      'EOS-CAP-0007',
      'EOS-CAP-0008',
      'EOS-API-001',
      'EOS-AGENT-CODEX',
      'EOS-AGENT-VULCAN'
    ],
    events: eventsForWorkflow('EOS-WF-INITIAL-REPOSITORY-BASELINE')
  },
  {
    id: 'EOS-WF-GOOGLE-DRIVE-BACKUP-PREPARATION',
    name: 'Google Drive Backup Preparation',
    description: 'Validates local backup synchronization configuration, documents Google Drive readiness, and prepares future cloud backup integration without connecting to Google Drive.',
    status: 'Completed',
    owner: 'Codex',
    steps: [
      'Create credential-free Drive template',
      'Create local backup synchronization policy',
      'Validate backup compatibility',
      'Publish readiness report'
    ],
    currentStep: 'Publish readiness report',
    progress: 100,
    trigger: 'Cloud backup readiness requested',
    lastRun: '2026-07-03T15:21:00.000Z',
    linkedObjects: [
      'EOS-CAP-0013',
      'EOS-CAP-0009',
      'EOS-CAP-0012',
      'EOS-API-001',
      'EOS-AGENT-CODEX',
      'EOS-AGENT-VULCAN'
    ],
    events: eventsForWorkflow('EOS-WF-GOOGLE-DRIVE-BACKUP-PREPARATION')
  },
  {
    id: 'EOS-WF-LIVE-OBJECT-STATUS-LAYER',
    name: 'Live Object Status Layer',
    description: 'Creates, validates, updates, and displays live Enterprise Object health, progress, attention, and action metadata.',
    status: 'Completed',
    owner: 'Codex',
    steps: [
      'Define live status interface',
      'Attach live status to Enterprise Objects',
      'Validate attention rules',
      'Display status in Mission Control',
      'Publish live status documentation'
    ],
    currentStep: 'Publish live status documentation',
    progress: 100,
    trigger: 'Enterprise Object action console requested',
    lastRun: '2026-07-03T15:37:00.000Z',
    linkedObjects: [
      'EOS-CAP-0014',
      'EOS-CAP-0007',
      'EOS-CAP-0009',
      'EOS-API-001',
      'EOS-MC-001',
      'EOS-AGENT-CODEX',
      'EOS-AGENT-ARGUS',
      'EOS-AGENT-VULCAN'
    ],
    events: eventsForWorkflow('EOS-WF-LIVE-OBJECT-STATUS-LAYER')
  },
  {
    id: 'EOS-WF-KNOWLEDGE-MANAGEMENT',
    name: 'Knowledge Management',
    description: 'Creates, indexes, updates, reviews, and publishes agent-owned research and operational knowledge.',
    status: 'Running',
    owner: 'Hermes',
    steps: [
      'Capture agent knowledge',
      'Index repository objects',
      'Review publication readiness',
      'Assess patent potential',
      'Publish repository updates'
    ],
    currentStep: 'Review publication readiness',
    progress: 66,
    trigger: 'Agent knowledge repository initialized',
    lastRun: '2026-07-03T15:47:00.000Z',
    linkedObjects: [
      'EOS-CAP-0015',
      'EOS-CAP-0016',
      'EOS-CAP-0007',
      'EOS-AKR',
      'EOS-ASSET-EXPLORER',
      'RP-001',
      'RP-002',
      'RP-003',
      'RP-004',
      'EOS-AGENT-HERMES',
      'EOS-AGENT-ATHENA'
    ],
    events: eventsForWorkflow('EOS-WF-KNOWLEDGE-MANAGEMENT')
  },
  {
    id: 'EOS-WF-KNOWLEDGE-ASSET-VIEWER',
    name: 'Knowledge Asset Viewer',
    description:
      'Surfaces Live Knowledge Objects in Mission Control, displays preview content, separates operational and lifecycle status, and prepares future asset actions.',
    status: 'Running',
    owner: 'Hermes',
    steps: [
      'Load agent repositories',
      'Select knowledge asset',
      'Display live status',
      'Review preview content',
      'Route future asset action'
    ],
    currentStep: 'Display live status',
    progress: 74,
    trigger: 'Mission Control asset explorer requested',
    lastRun: '2026-07-03T16:10:00.000Z',
    linkedObjects: [
      'EOS-CAP-0016',
      'EOS-CAP-0015',
      'EOS-CAP-0007',
      'EOS-MC-001',
      'EOS-AKR',
      'EOS-ASSET-EXPLORER',
      'RP-001',
      'RP-002',
      'RP-003',
      'RP-004',
      'EOS-AGENT-HERMES',
      'EOS-AGENT-ATHENA',
      'EOS-AGENT-CODEX'
    ],
    events: eventsForWorkflow('EOS-WF-KNOWLEDGE-ASSET-VIEWER')
  },
  {
    id: 'EOS-WF-PROGRAM-MANAGEMENT',
    name: 'Program Management',
    description:
      'Creates programs, updates roadmap state, tracks milestones, starts and completes sprints, and reports PMO health.',
    status: 'Running',
    owner: 'CTO',
    steps: [
      'Establish PMO',
      'Publish Master Roadmap',
      'Map programs and capabilities',
      'Review dependencies and risks',
      'Report executive roadmap status'
    ],
    currentStep: 'Review dependencies and risks',
    progress: 62,
    trigger: 'EOS Master Roadmap requested',
    lastRun: '2026-07-03T16:40:00.000Z',
    linkedObjects: [
      'EOS-CAP-0020',
      'EOS-CAP-0007',
      'EOS-PMO',
      'EOS-MASTER-ROADMAP',
      'EOS-MC-001',
      'EOS-API-001',
      'EOS-AGENT-CODEX',
      'EOS-AGENT-HERMES',
      'EOS-AGENT-ATHENA',
      'EOS-AGENT-ATLAS',
      'EOS-AGENT-MERCURY',
      'EOS-AGENT-ARGUS',
      'EOS-AGENT-VULCAN'
    ],
    events: eventsForWorkflow('EOS-WF-PROGRAM-MANAGEMENT')
  },
  {
    id: 'EOS-WF-EXECUTIVE-COUNCIL-GOVERNANCE',
    name: 'Executive Council Governance',
    description:
      'Creates the Executive Council, updates executive profiles, tracks attention needs, updates the CEO cockpit, and activates the Digital Enterprise Headquarters layer.',
    status: 'Running',
    owner: 'Eric Olo',
    steps: [
      'Create Executive Council',
      'Register executive profiles',
      'Update CEO cockpit',
      'Surface attention needs',
      'Activate headquarters view'
    ],
    currentStep: 'Activate headquarters view',
    progress: 68,
    trigger: 'Digital Enterprise Headquarters requested',
    lastRun: '2026-07-03T17:05:00.000Z',
    linkedObjects: [
      'EOS-CAP-0021',
      'EOS-CAP-0007',
      'EOS-EXECUTIVE-COUNCIL',
      'EOS-DIGITAL-ENTERPRISE-HEADQUARTERS',
      'EOS-MC-001',
      'EOS-PMO',
      'EOS-MASTER-ROADMAP',
      'EOS-AGENT-CODEX',
      'EOS-AGENT-HERMES',
      'EOS-AGENT-ATHENA',
      'EOS-AGENT-ATLAS',
      'EOS-AGENT-MERCURY',
      'EOS-AGENT-ARGUS',
      'EOS-AGENT-VULCAN'
    ],
    events: eventsForWorkflow('EOS-WF-EXECUTIVE-COUNCIL-GOVERNANCE')
  },
  {
    id: 'EOS-WF-EXECUTIVE-ACTION-GOVERNANCE',
    name: 'Executive Action Governance',
    description:
      'Records executive actions, routes governance decisions, preserves audit history, and prevents execution until permissions, persistence, and audit controls are implemented.',
    status: 'Running',
    owner: 'Eric Olo',
    steps: [
      'Record executive action',
      'Classify risk',
      'Route approval decision',
      'Preserve audit trail',
      'Keep execution disabled'
    ],
    currentStep: 'Route approval decision',
    progress: 54,
    trigger: 'Executive action governance requested',
    lastRun: '2026-07-03T17:32:00.000Z',
    linkedObjects: [
      'EOS-CAP-0022',
      'EOS-CAP-0007',
      'EOS-EXECUTIVE-ACTION-FRAMEWORK',
      'EOS-APPROVAL-QUEUE',
      'EOS-EXECUTIVE-COUNCIL',
      'EOS-DIGITAL-ENTERPRISE-HEADQUARTERS',
      'EOS-MC-001',
      'EOS-PMO',
      'EOS-MASTER-ROADMAP',
      'EOS-AGENT-CODEX',
      'EOS-AGENT-VULCAN'
    ],
    events: eventsForWorkflow('EOS-WF-EXECUTIVE-ACTION-GOVERNANCE')
  },
  {
    id: 'EOS-WF-EXECUTIVE-OFFICE-MANAGEMENT',
    name: 'Executive Office Management',
    description:
      'Opens Executive Offices, updates executive briefings, tracks department status, and routes office navigation inside Mission Control.',
    status: 'Running',
    owner: 'Eric Olo',
    steps: [
      'Create office framework',
      'Register executive offices',
      'Attach department portfolios',
      'Update executive briefings',
      'Route Mission Control navigation'
    ],
    currentStep: 'Route Mission Control navigation',
    progress: 61,
    trigger: 'Executive Office Framework requested',
    lastRun: '2026-07-03T17:58:00.000Z',
    linkedObjects: [
      'EOS-CAP-0023',
      'EOS-CAP-0007',
      'EOS-CAP-0021',
      'EOS-CAP-0022',
      'EOS-EXECUTIVE-OFFICE-FRAMEWORK',
      'EOS-EXECUTIVE-COUNCIL',
      'EOS-DIGITAL-ENTERPRISE-HEADQUARTERS',
      'EOS-EXECUTIVE-ACTION-FRAMEWORK',
      'EOS-MC-001',
      'EOS-PMO',
      'EOS-MASTER-ROADMAP',
      'EOS-AGENT-CODEX',
      'EOS-AGENT-HERMES',
      'EOS-AGENT-ATHENA',
      'EOS-AGENT-ATLAS',
      'EOS-AGENT-MERCURY',
      'EOS-AGENT-ARGUS',
      'EOS-AGENT-VULCAN'
    ],
    events: eventsForWorkflow('EOS-WF-EXECUTIVE-OFFICE-MANAGEMENT')
  },
  {
    id: 'EOS-WF-DESIGN-GOVERNANCE',
    name: 'Design Governance',
    description:
      'Maintains the EOS Enterprise Design System, UX audit scoring, presentation mode, hover intelligence, executive language, and five capability quality gates.',
    status: 'Running',
    owner: 'EOS Engineering Department',
    steps: [
      'Define EDS standards',
      'Apply executive language',
      'Register hover intelligence',
      'Enable presentation mode',
      'Complete UX audit',
      'Enforce five quality gates'
    ],
    currentStep: 'Enforce five quality gates',
    progress: 72,
    trigger: 'Enterprise Design System requested',
    lastRun: '2026-07-03T18:24:00.000Z',
    linkedObjects: [
      'EOS-CAP-0024',
      'EOS-CAP-0007',
      'EOS-CAP-0023',
      'EOS-ENTERPRISE-DESIGN-SYSTEM',
      'EOS-EXECUTIVE-PRESENTATION-MODE',
      'EOS-UX-AUDIT',
      'EOS-MC-001',
      'EOS-DIGITAL-ENTERPRISE-HEADQUARTERS',
      'EOS-EXECUTIVE-OFFICE-FRAMEWORK',
      'EOS-PMO',
      'EOS-MASTER-ROADMAP',
      'EOS-AGENT-CODEX',
      'EOS-AGENT-VULCAN'
    ],
    events: eventsForWorkflow('EOS-WF-DESIGN-GOVERNANCE')
  },
  {
    id: 'EOS-WF-PERSISTENT-DATA-MANAGEMENT',
    name: 'Persistent Data Management',
    description:
      'Initializes local JSON collections, preserves seed fallback behavior, reports storage health, and prepares EOS for future PostgreSQL migration.',
    status: 'Running',
    owner: 'EOS Engineering Department',
    steps: [
      'Create data directories',
      'Initialize collections from seed registries',
      'Expose storage health endpoints',
      'Wire read services to storage',
      'Include data in backups',
      'Document future database migration'
    ],
    currentStep: 'Document future database migration',
    progress: 68,
    trigger: 'Persistent Data Store Foundation requested',
    lastRun: '2026-07-03T18:55:00.000Z',
    linkedObjects: [
      'EOS-CAP-0025',
      'EOS-CAP-0007',
      'EOS-PERSISTENT-DATA-STORE',
      'EOS-STORAGE-HEALTH',
      'EOS-API-001',
      'EOS-MC-001',
      'EOS-PMO',
      'EOS-MASTER-ROADMAP',
      'EOS-AGENT-CODEX',
      'EOS-AGENT-ATLAS',
      'EOS-AGENT-ARGUS',
      'EOS-AGENT-VULCAN'
    ],
    events: eventsForWorkflow('EOS-WF-PERSISTENT-DATA-MANAGEMENT')
  },
  {
    id: 'EOS-WF-STRATEGY-GOVERNANCE-VALUATION',
    name: 'Strategy Governance Valuation',
    description:
      'Aligns enterprise strategy, governance approvals, roadmap programs, valuation assumptions, Second Balance Sheet metrics, and Digital Twin Asset monitoring.',
    status: 'Running',
    owner: 'EOS Executive Office',
    steps: [
      'Create enterprise strategy',
      'Review governance approvals',
      'Align roadmap programs',
      'Publish internal valuation foundation',
      'Update Second Balance Sheet metrics',
      'Monitor Digital Twin Assets'
    ],
    currentStep: 'Review governance approvals',
    progress: 52,
    trigger: 'Enterprise strategy and valuation alignment requested',
    lastRun: '2026-07-03T19:20:00.000Z',
    linkedObjects: [
      'EOS-CAP-0026',
      'EOS-CAP-0007',
      'EOS-ENTERPRISE-STRATEGY',
      'EOS-GOVERNANCE-COUNCIL',
      'EOS-DIGITAL-ENTERPRISE-VALUATION',
      'EOS-SECOND-BALANCE-SHEET',
      'EOS-DTA-MONITORING',
      'DTA-EPERCENT-001',
      'DTA-EOS-001',
      'EOS-PMO',
      'EOS-MASTER-ROADMAP',
      'EOS-EXECUTIVE-COUNCIL',
      'EOS-AGENT-ATHENA',
      'EOS-AGENT-ATLAS',
      'EOS-AGENT-MERCURY'
    ],
    events: eventsForWorkflow('EOS-WF-STRATEGY-GOVERNANCE-VALUATION')
  },
  {
    id: 'EOS-WF-PLATFORM-OPERATIONS-GOVERNANCE',
    name: 'Platform Operations Governance',
    description:
      'Reviews platform status, backup posture, storage health, system warnings, and governed administration actions.',
    status: 'Running',
    owner: 'Argus',
    steps: [
      'Review platform status',
      'Review backup posture',
      'Review storage health',
      'Register admin actions',
      'Apply authorization policy',
      'Report administration readiness'
    ],
    currentStep: 'Apply authorization policy',
    progress: 62,
    trigger: 'Platform administration center requested',
    lastRun: '2026-07-03T20:15:00.000Z',
    linkedObjects: [
      'EOS-CAP-0027',
      'EOS-PLATFORM-ADMINISTRATION-CENTER',
      'EOS-ACTION-GOVERNANCE',
      'EOS-PERSISTENT-DATA-STORE',
      'EOS-STORAGE-HEALTH',
      'EOS-AGENT-ARGUS',
      'EOS-AGENT-CODEX',
      'EOS-AGENT-VULCAN'
    ],
    events: eventsForWorkflow('EOS-WF-PLATFORM-OPERATIONS-GOVERNANCE')
  },
  {
    id: 'EOS-WF-AGENT-COMMUNICATION',
    name: 'Agent Communication',
    description:
      'Creates local agent message threads, tracks response requirements, links messages to work, and preserves audit history.',
    status: 'Running',
    owner: 'Hermes',
    steps: ['Create message', 'Route to agent', 'Track response requirement', 'Link work item', 'Preserve audit trail'],
    currentStep: 'Track response requirement',
    progress: 48,
    trigger: 'Mission Control agent communication requested',
    lastRun: '2026-07-03T20:16:00.000Z',
    linkedObjects: [
      'EOS-CAP-0027',
      'EOS-AGENT-COMMUNICATION-LAYER',
      'EOS-AI-WORKFORCE-OPERATIONS',
      'EOS-AGENT-HERMES',
      'EOS-AGENT-CODEX',
      'EOS-AGENT-ATHENA',
      'EOS-AGENT-ATLAS'
    ],
    events: eventsForWorkflow('EOS-WF-AGENT-COMMUNICATION')
  },
  {
    id: 'EOS-WF-AGENT-ACTIVITY-MONITORING',
    name: 'Agent Activity Monitoring',
    description:
      'Tracks agent work, activity status, progress, attention requests, executive review time, and recommended actions.',
    status: 'Running',
    owner: 'Argus',
    steps: ['Capture activity', 'Score progress', 'Identify attention needs', 'Estimate review time', 'Report recommended action'],
    currentStep: 'Identify attention needs',
    progress: 54,
    trigger: 'AI workforce activity view requested',
    lastRun: '2026-07-03T20:17:00.000Z',
    linkedObjects: [
      'EOS-CAP-0027',
      'EOS-AGENT-ACTIVITY-QUEUE',
      'EOS-AI-WORKFORCE-OPERATIONS',
      'EOS-AGENT-ARGUS',
      'EOS-AGENT-ATLAS',
      'EOS-AGENT-CODEX'
    ],
    events: eventsForWorkflow('EOS-WF-AGENT-ACTIVITY-MONITORING')
  },
  {
    id: 'EOS-WF-AGENT-CALENDAR-MANAGEMENT',
    name: 'Agent Calendar Management',
    description:
      'Maintains local agent operating events, review sessions, preparation notes, and future external calendar readiness.',
    status: 'Running',
    owner: 'Argus',
    steps: ['Create local event', 'Link workflow', 'Link object', 'Identify attendance needs', 'Report preparation'],
    currentStep: 'Report preparation',
    progress: 44,
    trigger: 'Agent calendar foundation requested',
    lastRun: '2026-07-03T20:18:00.000Z',
    linkedObjects: [
      'EOS-CAP-0027',
      'EOS-AGENT-CALENDAR',
      'EOS-AI-WORKFORCE-OPERATIONS',
      'EOS-AGENT-ARGUS',
      'EOS-AGENT-HERMES',
      'EOS-AGENT-VULCAN'
    ],
    events: eventsForWorkflow('EOS-WF-AGENT-CALENDAR-MANAGEMENT')
  },
  {
    id: 'EOS-WF-ACTION-AUTHORIZATION',
    name: 'Action Authorization',
    description:
      'Registers governed administration actions, classifies risk, applies authorization policy, tracks approvals, and preserves audit trails while execution remains disabled.',
    status: 'Running',
    owner: 'Chief Technology Officer',
    steps: ['Register action', 'Classify risk', 'Check preconditions', 'Apply authorization policy', 'Preserve audit trail'],
    currentStep: 'Apply authorization policy',
    progress: 50,
    trigger: 'Governed platform administration action requested',
    lastRun: '2026-07-03T20:19:00.000Z',
    linkedObjects: [
      'EOS-CAP-0027',
      'EOS-ACTION-GOVERNANCE',
      'EOS-PLATFORM-ADMINISTRATION-CENTER',
      'EOS-EXECUTIVE-ACTION-FRAMEWORK',
      'EOS-APPROVAL-QUEUE',
      'EOS-GOVERNANCE-COUNCIL',
      'EOS-AGENT-ATLAS',
      'EOS-AGENT-VULCAN'
    ],
    events: eventsForWorkflow('EOS-WF-ACTION-AUTHORIZATION')
  },
  {
    id: 'EOS-WF-MISSION-CONTROL-EXPERIENCE-GOVERNANCE',
    name: 'Mission Control Experience Governance',
    description:
      'Governs Mission Control navigation, Digital Headquarters lobby, command palette foundation, workspace rail, context navigation, and UX audit completion.',
    status: 'Running',
    owner: 'Codex',
    steps: [
      'Assess current navigation',
      'Define workspace model',
      'Implement command bar and rail',
      'Validate executive interaction flow',
      'Record UX audit'
    ],
    currentStep: 'Record UX audit',
    progress: 76,
    trigger: 'Mission Control navigation redesign requested',
    lastRun: '2026-07-03T20:55:00.000Z',
    linkedObjects: [
      'EOS-CAP-0028',
      'EOS-MISSION-CONTROL-NAVIGATION',
      'EOS-DIGITAL-HEADQUARTERS-LOBBY',
      'EOS-COMMAND-PALETTE',
      'EOS-WORKSPACE-RAIL',
      'EOS-ENTERPRISE-DESIGN-SYSTEM',
      'EOS-UX-AUDIT',
      'EOS-AGENT-CODEX',
      'EOS-AGENT-ATLAS',
      'EOS-AGENT-HERMES'
    ],
    events: eventsForWorkflow('EOS-WF-MISSION-CONTROL-EXPERIENCE-GOVERNANCE')
  },
  {
    id: 'EOS-WF-STRATEGIC-ALIGNMENT',
    name: 'Strategic Alignment',
    description:
      'Aligns investment thesis, technology flywheel, Three-Horizon Roadmap, revenue model, DTA lifecycle, KIPR, enterprise profile, and readiness assessments with EOS execution.',
    status: 'Running',
    owner: 'EOS Executive Office',
    steps: [
      'Review investment thesis',
      'Map strategic concepts to platform objects',
      'Update flywheel and roadmap',
      'Assess revenue and readiness',
      'Publish strategic alignment report'
    ],
    currentStep: 'Publish strategic alignment report',
    progress: 72,
    trigger: 'Investment thesis alignment requested',
    lastRun: '2026-07-03T21:20:00.000Z',
    linkedObjects: [
      'EOS-CAP-0029',
      'EOS-INVESTMENT-THESIS',
      'EOS-TECHNOLOGY-FLYWHEEL',
      'EOS-THREE-HORIZON-ROADMAP',
      'EOS-REVENUE-ENGINE',
      'EOS-DTA-LIFECYCLE',
      'EOS-KIPR',
      'EOS-ENTERPRISE-PROFILE',
      'EOS-INDUSTRY-FRAMEWORK',
      'EOS-ENTERPRISE-STRATEGY',
      'EOS-MASTER-ROADMAP'
    ],
    events: eventsForWorkflow('EOS-WF-STRATEGIC-ALIGNMENT')
  },
  {
    id: 'EOS-WF-ENTERPRISE-DIGITAL-TWIN-VISUALIZATION',
    name: 'Enterprise Digital Twin Visualization',
    description:
      'Coordinates Master Monitoring, enterprise visual models, digital twin homes, simulated telemetry, timezone standards, and future digital twin generation workflow display.',
    status: 'Running',
    owner: 'EOS Engineering Department',
    steps: [
      'Create Master Monitoring view',
      'Model layered enterprise architecture',
      'Seed enterprise visual homes',
      'Register simulated telemetry updates',
      'Apply timezone timestamp standard',
      'Publish digital twin generation workflow placeholder'
    ],
    currentStep: 'Publish digital twin generation workflow placeholder',
    progress: 68,
    trigger: 'Enterprise Digital Twin visual layer requested',
    lastRun: '2026-07-03T21:50:00.000Z',
    linkedObjects: [
      'EOS-CAP-0030',
      'EOS-MASTER-MONITORING-VIEW',
      'EOS-ENTERPRISE-DIGITAL-TWIN-HOME',
      'EOS-ENTERPRISE-VISUAL-MODEL',
      'EOS-REAL-TIME-TELEMETRY-FOUNDATION',
      'EOS-DIGITAL-TWIN-GENERATION-WORKFLOW',
      'DTA-EPERCENT-001',
      'DTA-OIL-001',
      'EOS-AGENT-ATLAS',
      'EOS-AGENT-ARGUS',
      'EOS-AGENT-VULCAN'
    ],
    events: eventsForWorkflow('EOS-WF-ENTERPRISE-DIGITAL-TWIN-VISUALIZATION')
  },
  {
    id: 'EOS-WF-ORGANIZATION-INTAKE',
    name: 'Organization Intake',
    description:
      'Coordinates profile media registration, company logo handling, organization source import, metadata extraction, external repository links, and future enterprise object mapping.',
    status: 'Running',
    owner: 'Hermes',
    steps: [
      'Register profile or organization identity',
      'Upload avatar or logo where approved',
      'Import organization source material',
      'Extract useful metadata and preview text where practical',
      'Link external cloud repository when source size exceeds local best practice',
      'Prepare enterprise object and knowledge candidates'
    ],
    currentStep: 'Prepare enterprise object and knowledge candidates',
    progress: 52,
    trigger: 'Organization information import requested',
    lastRun: '2026-07-03T22:25:00.000Z',
    linkedObjects: [
      'EOS-CAP-0031',
      'EOS-IDENTITY-MEDIA-REGISTRY',
      'EOS-MEDIA-ASSET-STORE',
      'EOS-ORGANIZATION-INTAKE',
      'EOS-EXTERNAL-REPOSITORY-LINKS',
      'EOS-STARTUP-EXPERIENCE',
      'EOS-KIPR',
      'EOS-ENTERPRISE-PROFILE',
      'DTA-EPERCENT-001',
      'EOS-AGENT-HERMES',
      'EOS-AGENT-CODEX',
      'EOS-AGENT-ATLAS'
    ],
    events: eventsForWorkflow('EOS-WF-ORGANIZATION-INTAKE')
  },
  {
    id: 'EOS-WF-ENTERPRISE-ONBOARDING',
    name: 'Enterprise Onboarding',
    description:
      'Coordinates enterprise intake, source classification, known asset capture, agent assignment, and preparation for Digital Mirror creation.',
    status: 'Running',
    owner: 'EOS PMO',
    steps: [
      'Create onboarding record',
      'Classify sources',
      'Capture known enterprise structure',
      'Assign executive agents',
      'Prepare Digital Mirror inputs'
    ],
    currentStep: 'Prepare Digital Mirror inputs',
    progress: 62,
    trigger: 'Enterprise onboarding and DTA assimilation requested',
    lastRun: '2026-07-04T00:24:00.000Z',
    linkedObjects: [
      'EOS-CAP-0032',
      'EOS-ENTERPRISE-ONBOARDING',
      'EOS-DTA-ASSIMILATION-ENGINE',
      'EOS-DIGITAL-MIRROR',
      'EOS-AGENT-HERMES',
      'EOS-AGENT-ATLAS',
      'EOS-AGENT-CODEX'
    ],
    events: eventsForWorkflow('EOS-WF-ENTERPRISE-ONBOARDING')
  },
  {
    id: 'EOS-WF-DTA-ASSIMILATION',
    name: 'DTA Assimilation',
    description:
      'Creates Digital Mirrors, identifies Digital Twin Asset candidates, maps data feed requirements, and prepares governed DTA formation packages.',
    status: 'Running',
    owner: 'Atlas',
    steps: [
      'Extract enterprise object candidates',
      'Map relationships',
      'Create Digital Mirror',
      'Identify DTA candidates',
      'Map data feed requirements'
    ],
    currentStep: 'Map data feed requirements',
    progress: 58,
    trigger: 'Onboarding record reached Digital Mirror stage',
    lastRun: '2026-07-04T00:25:00.000Z',
    linkedObjects: [
      'EOS-CAP-0032',
      'EOS-DTA-ASSIMILATION-ENGINE',
      'EOS-DIGITAL-MIRROR',
      'EOS-DTA-CANDIDATE-REGISTRY',
      'EOS-DATA-FEED-REQUIREMENTS',
      'EOS-MASTER-MONITORING-VIEW',
      'EOS-ENTERPRISE-DIGITAL-TWIN-HOME',
      'EOS-AGENT-ATLAS',
      'EOS-AGENT-ARGUS',
      'EOS-AGENT-MERCURY'
    ],
    events: eventsForWorkflow('EOS-WF-DTA-ASSIMILATION')
  },
  {
    id: 'EOS-WF-HUMAN-VALIDATION',
    name: 'Human Validation',
    description:
      'Tracks enterprise identity, ownership, hierarchy, systems, feed availability, DTA candidates, valuation assumptions, and governance validation before DTA formation.',
    status: 'Awaiting Review',
    owner: 'Vulcan',
    steps: [
      'Create validation checklist',
      'Assign owners',
      'Review evidence',
      'Record validation status',
      'Prepare DTA formation approval'
    ],
    currentStep: 'Review evidence',
    progress: 34,
    trigger: 'Digital Mirror or DTA candidate requires human validation',
    lastRun: '2026-07-04T00:27:00.000Z',
    linkedObjects: [
      'EOS-CAP-0032',
      'EOS-HUMAN-VALIDATION-GATE',
      'EOS-DTA-CANDIDATE-REGISTRY',
      'EOS-GOVERNANCE-COUNCIL',
      'EOS-AGENT-VULCAN',
      'EOS-AGENT-HERMES',
      'EOS-AGENT-ATLAS'
    ],
    events: eventsForWorkflow('EOS-WF-HUMAN-VALIDATION')
  },
  {
    id: 'EOS-WF-PLATFORM-AUDIT-READINESS',
    name: 'Platform Audit Readiness',
    description:
      'Generates EOS platform audits, classifies capability maturity, reports functional coverage, identifies placeholder and technical debt gaps, and recommends the next build sequence.',
    status: 'Completed',
    owner: 'Codex',
    steps: [
      'Collect capability registry',
      'Classify functional readiness',
      'Audit API and frontend coverage',
      'Assess persistence and technical debt',
      'Score release maturity',
      'Publish audit report'
    ],
    currentStep: 'Publish audit report',
    progress: 100,
    trigger: 'Platform functional audit requested',
    lastRun: '2026-07-04T01:20:00.000Z',
    linkedObjects: [
      'EOS-CAP-0033',
      'EOS-PLATFORM-AUDIT-CENTER',
      'EOS-CAPABILITY-READINESS-MATRIX',
      'EOS-FUNCTIONAL-COVERAGE-REPORT',
      'EOS-AUDIT-READINESS-SCORE',
      'EOS-PERSISTENT-DATA-STORE',
      'EOS-MISSION-CONTROL-NAVIGATION',
      'EOS-AGENT-CODEX',
      'EOS-AGENT-VULCAN',
      'EOS-AGENT-ATLAS'
    ],
    events: eventsForWorkflow('EOS-WF-PLATFORM-AUDIT-READINESS')
  }
];
