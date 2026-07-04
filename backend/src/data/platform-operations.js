const createdAt = '2026-07-03T20:55:00.000Z';

export const platformOperations = {
  id: 'EOS-PLATFORM-OPERATIONS',
  name: 'EOS Platform Operations',
  owner: 'Argus',
  status: 'Operational',
  currentVersion: '0.25.0',
  environment: 'Local Development',
  backendStatus: 'Operational',
  frontendStatus: 'Operational',
  apiHealth: 'Operational',
  storageHealth: 'Operational',
  backupHealth: 'Operational',
  releaseVersion: '0.25.0',
  gitStatus: 'Local repository active; external synchronization not connected.',
  dataStoreStatus: 'Operational',
  registeredServices: ['EOS Core API', 'Mission Control'],
  activeApis: [
    '/api/platform',
    '/api/platform/status',
    '/api/platform/admin',
    '/api/platform/navigation',
    '/api/audit',
    '/api/admin-actions',
    '/api/agent-messages',
    '/api/agent-activity',
    '/api/agent-attention',
    '/api/agent-calendar',
    '/api/strategic-alignment',
    '/api/master-monitoring',
    '/api/enterprise-visuals',
    '/api/enterprise-telemetry',
    '/api/digital-twin-home',
    '/api/onboarding',
    '/api/onboarding-assimilation',
    '/api/digital-mirrors',
    '/api/dta-candidates',
    '/api/data-feed-requirements',
    '/api/human-validation',
    '/api/startup',
    '/api/identity-media',
    '/api/organization-intake',
    '/api/repository-links'
  ],
  runningUrls: ['http://127.0.0.1:3000', 'http://127.0.0.1:5173'],
  systemWarnings: [
    'Restore validation remains pending before backup confidence can be marked fully verified.',
    'Governed administration actions are registered but execution is disabled until authorization controls mature.'
  ],
  recommendedAdminActions: [
    'Run health check before every major capability build.',
    'Create a backup before risky platform changes.',
    'Validate restore flow before cloud synchronization.',
    'Review platform administration action policy before enabling execution.'
  ],
  liveStatus: {
    status: 'Amber',
    operationalStatus: 'Amber',
    lifecycleStatus: 'Building',
    healthScore: 88,
    progress: 64,
    summary: 'Platform operations are visible through the strategy-aligned Mission Control workspace, Platform Audit readiness center, Enterprise Onboarding foundation, DTA Assimilation pipeline, and Master Monitoring visual layer.',
    lastActivity: createdAt,
    requiresAttention: true,
    attentionLevel: 'Low',
    recommendedAction: 'Review the Platform Audit readiness matrix and approve the next strategic build program before enabling real data-source connectors.',
    availableActions: ['Refresh Status', 'Run Health Check', 'Run Backup', 'Open Audit Center', 'Open Master Monitoring', 'Open Enterprise Onboarding']
  }
};

export const platformNavigation = [
  {
    id: 'nav-headquarters',
    domain: 'Headquarters',
    items: [
      { id: 'cockpit', label: 'CEO Cockpit', route: 'cockpit', description: 'Executive overview of EOS value, health, priorities, and leadership attention.' },
      { id: 'council', label: 'Executive Council', route: 'council', description: 'Leadership roster, status, focus, and attention needs.' },
      { id: 'offices', label: 'Executive Offices', route: 'offices', description: 'Department operating spaces for each executive.' }
    ]
  },
  {
    id: 'nav-enterprise',
    domain: 'Enterprise',
    items: [
      { id: 'strategy', label: 'Strategy', route: 'strategy', description: 'Enterprise strategy and governance alignment.' },
      { id: 'investment-thesis', label: 'Investment Thesis', route: 'investment-thesis', description: 'Strategic alignment between EOS implementation, investment thesis, and commercialization roadmap.' },
      { id: 'governance', label: 'Governance', route: 'governance', description: 'Executive approval posture and governance readiness.' },
      { id: 'pmo', label: 'PMO', route: 'programs', description: 'Program Management Office operating view.' },
      { id: 'three-horizon-roadmap', label: 'Three-Horizon Roadmap', route: 'three-horizon-roadmap', description: 'Foundation, commercial scale, and digital economy roadmap.' },
      { id: 'roadmap', label: 'Roadmap', route: 'roadmap', description: 'Master Roadmap milestones, phases, risks, and current capability.' },
      { id: 'programs', label: 'Programs', route: 'programs', description: 'Strategic programs and delivery progress.' }
    ]
  },
  {
    id: 'nav-enterprise-value',
    domain: 'Enterprise Value',
    items: [
      { id: 'master-monitoring', label: 'Master Monitoring', route: 'master-monitoring', description: 'Premium visual monitoring layer for onboarded enterprises, DTAs, systems, feeds, alerts, governance, and approvals.' },
      { id: 'onboarded-enterprises', label: 'Onboarded Enterprises', route: 'onboarded-enterprises', description: 'Portfolio of onboarded enterprises and organizations with health, DTA readiness, feed readiness, agents, and validation status.' },
      { id: 'valuation', label: 'Valuation', route: 'valuation', description: 'Internal digital enterprise value estimates, not audited valuation.' },
      { id: 'technology-flywheel', label: 'Technology Flywheel', route: 'technology-flywheel', description: 'How knowledge, agents, objects, DTAs, decisions, and value reinforce each other.' },
      { id: 'revenue-engine', label: 'Revenue Engine', route: 'revenue-engine', description: 'Revenue opportunities, maturity, market potential, and dependencies.' },
      { id: 'second-balance-sheet', label: 'Second Balance Sheet', route: 'second-balance-sheet', description: 'Operational digital asset metrics and value thesis.' },
      { id: 'digital-twin-assets', label: 'Digital Twin Assets', route: 'digital-twin-assets', description: 'Digital Twin Asset monitoring and formation status.' },
      { id: 'enterprise-onboarding', label: 'Enterprise Onboarding', route: 'enterprise-onboarding', description: 'Enterprise intake, known structure, assigned agents, and onboarding progress.' },
      { id: 'assimilation-pipeline', label: 'Assimilation Pipeline', route: 'assimilation-pipeline', description: 'Enterprise intake through Digital Mirror, DTA candidate, data feed, validation, and formation stages.' },
      { id: 'digital-mirrors', label: 'Digital Mirrors', route: 'digital-mirrors', description: 'Pre-DTA enterprise mirrors with object, relationship, system, process, knowledge, and risk maps.' },
      { id: 'dta-candidates', label: 'DTA Candidates', route: 'dta-candidates', description: 'Candidate Digital Twin Assets, missing data, validation points, value potential, and risk.' },
      { id: 'data-feed-requirements', label: 'Feed Requirements', route: 'data-feed-requirements', description: 'Required fields, cadence, real-time needs, connection status, quality status, and fallback requirements.' },
      { id: 'human-validation', label: 'Human Validation', route: 'human-validation', description: 'Human checklist for identity, ownership, hierarchy, systems, feed availability, DTA candidates, valuation, and governance.' },
      { id: 'enterprise-home', label: 'Enterprise Home', route: 'enterprise-home', description: 'Visual home pages for onboarded enterprise Digital Twin Assets.' },
      { id: 'digital-twin-structure', label: 'Digital Twin Structure', route: 'digital-twin-structure', description: 'Layered enterprise architecture and future digital twin generation process.' },
      { id: 'data-feeds', label: 'Data Feeds', route: 'data-feeds', description: 'Simulated telemetry feeds with UTC timestamps and enterprise display timezone.' },
      { id: 'systems', label: 'Systems', route: 'systems', description: 'Operational systems, safety systems, production systems, and commercial systems.' },
      { id: 'enterprise-assets', label: 'Assets', route: 'enterprise-assets', description: 'Primary enterprise assets represented inside the visual twin model.' },
      { id: 'human-workflows', label: 'Human Workflows', route: 'human-workflows', description: 'Human approval points and governance interaction model.' },
      { id: 'dta-lifecycle', label: 'DTA Lifecycle', route: 'dta-lifecycle', description: 'Discovery through exchange listing lifecycle for Digital Twin Assets.' },
      { id: 'enterprise-profile', label: 'Enterprise Profile', route: 'enterprise-profile', description: 'ePercent as the first live enterprise running on EOS.' },
      { id: 'investor-readiness', label: 'Investor Readiness', route: 'investor-readiness', description: 'Investor readiness score, strengths, gaps, and recommended action.' },
      { id: 'commercial-readiness', label: 'Commercial Readiness', route: 'commercial-readiness', description: 'Commercial readiness score, strengths, gaps, and next action.' },
      { id: 'investor-centre', label: 'Investor Centre', route: 'investor-centre', description: 'Investor readiness notes and executive talking points.' }
    ]
  },
  {
    id: 'nav-ai-workforce',
    domain: 'AI Workforce',
    items: [
      { id: 'agents', label: 'Agents', route: 'agents', description: 'AI executive workforce roster and operating status.' },
      { id: 'communications', label: 'Communications', route: 'communications', description: 'Internal agent message threads and response requirements.' },
      { id: 'activity', label: 'Activity', route: 'activity', description: 'Live agent work, progress, and attention requests.' },
      { id: 'calendar', label: 'Calendar', route: 'calendar', description: 'Local agent operating calendar and review events.' },
      { id: 'performance', label: 'Performance', route: 'performance', description: 'Agent performance foundation and health indicators.' }
    ]
  },
  {
    id: 'nav-knowledge',
    domain: 'Knowledge',
    items: [
      { id: 'kipr', label: 'KIPR', route: 'kipr', description: 'Knowledge, Intellectual Property, Patents, and Research operating view.' },
      { id: 'knowledge-vault', label: 'Knowledge Vault', route: 'knowledge', description: 'Agent knowledge repositories and managed knowledge assets.' },
      { id: 'white-papers', label: 'White Papers', route: 'white-papers', description: 'White paper assets and publication readiness.' },
      { id: 'academic-papers', label: 'Academic Papers', route: 'academic-papers', description: 'Academic research assets and publication targets.' },
      { id: 'patents', label: 'Patents', route: 'patents', description: 'Patent draft opportunities and IP pipeline.' },
      { id: 'publications', label: 'Publications', route: 'publications', description: 'Publication portfolio and readiness state.' }
    ]
  },
  {
    id: 'nav-platform',
    domain: 'Platform',
    items: [
      { id: 'administration', label: 'Administration', route: 'administration', description: 'Platform administration center and governed admin actions.' },
      { id: 'audit', label: 'Audit', route: 'audit', description: 'Capability readiness, functional coverage, placeholder register, technical debt, and maturity scoring.' },
      { id: 'startup-experience', label: 'Startup Experience', route: 'startup-experience', description: 'Modern EOS operating-system startup screen and boot phases.' },
      { id: 'identity-media', label: 'Identity Media', route: 'identity-media', description: 'Human and agent avatars, profile images, company logos, and platform identity media.' },
      { id: 'organization-intake', label: 'Organization Intake', route: 'organization-intake', description: 'Import organization files, extract useful metadata, and store repository records.' },
      { id: 'repository-links', label: 'Repository Links', route: 'repository-links', description: 'External cloud-drive links for large organization repositories and media libraries.' },
      { id: 'storage', label: 'Storage', route: 'storage', description: 'Persistent data store health and collection visibility.' },
      { id: 'backups', label: 'Backups', route: 'backups', description: 'Backup status, archive metadata, and restore validation posture.' },
      { id: 'health', label: 'Health', route: 'health', description: 'Platform health, APIs, running URLs, and warnings.' },
      { id: 'releases', label: 'Releases', route: 'releases', description: 'Release version, notes, and readiness posture.' }
    ]
  },
  {
    id: 'nav-development',
    domain: 'Development',
    items: [
      { id: 'capabilities', label: 'Capabilities', route: 'assets', description: 'Registered capability Enterprise Objects.' },
      { id: 'industry-framework', label: 'Industry Framework', route: 'industry-framework', description: 'Cross-industry DTA templates, maturity, and opportunity maps.' },
      { id: 'architecture', label: 'Architecture', route: 'architecture', description: 'Architecture foundation and future architecture governance.' },
      { id: 'engineering', label: 'Engineering', route: 'engineering', description: 'Engineering standards, quality gates, and build controls.' }
    ]
  },
  {
    id: 'nav-workspace',
    domain: 'My Workspace',
    items: [
      { id: 'briefing', label: 'Briefing', route: 'briefing', description: 'Personal executive briefing and current priority.' },
      { id: 'tasks', label: 'Tasks', route: 'tasks', description: 'Future executive task queue and delegated work.' },
      { id: 'decisions', label: 'Decisions', route: 'decisions', description: 'Future decision queue and approval posture.' },
      { id: 'notes', label: 'Notes', route: 'notes', description: 'Future executive notes and saved operating context.' }
    ]
  }
];

function audit(event, summary, actor = 'EOS Platform') {
  return {
    timestamp: createdAt,
    actor,
    event,
    summary
  };
}

function adminAction({
  id,
  label,
  category,
  riskLevel,
  executionMode,
  requiresApproval,
  requiredRole,
  backupRequired,
  restoreValidationRequired,
  auditRequired,
  status,
  recommendedNextStep
}) {
  return {
    id,
    label,
    category,
    riskLevel,
    executionMode,
    requiresApproval,
    requiredRole,
    backupRequired,
    restoreValidationRequired,
    auditRequired,
    status,
    recommendedNextStep
  };
}

export const adminActions = [
  adminAction({
    id: 'EOS-ADMIN-ACTION-REFRESH-STATUS',
    label: 'Refresh Status',
    category: 'Safe Health Operation',
    riskLevel: 'Low',
    executionMode: 'Executable',
    requiresApproval: false,
    requiredRole: 'Platform Operator',
    backupRequired: false,
    restoreValidationRequired: false,
    auditRequired: true,
    status: 'Ready',
    recommendedNextStep: 'Refresh live platform status before reviewing administration actions.'
  }),
  adminAction({
    id: 'EOS-ADMIN-ACTION-RUN-HEALTH-CHECK',
    label: 'Run Health Check',
    category: 'Safe Health Operation',
    riskLevel: 'Low',
    executionMode: 'Executable',
    requiresApproval: false,
    requiredRole: 'Platform Operator',
    backupRequired: false,
    restoreValidationRequired: false,
    auditRequired: true,
    status: 'Ready',
    recommendedNextStep: 'Run health check before release, restore, or platform upgrade decisions.'
  }),
  adminAction({
    id: 'EOS-ADMIN-ACTION-RUN-BACKUP',
    label: 'Run Backup',
    category: 'Safe Resilience Operation',
    riskLevel: 'Low',
    executionMode: 'Executable',
    requiresApproval: false,
    requiredRole: 'Engineering Lead',
    backupRequired: false,
    restoreValidationRequired: false,
    auditRequired: true,
    status: 'Ready',
    recommendedNextStep: 'Create a backup before capability builds and release preparation.'
  }),
  adminAction({
    id: 'EOS-ADMIN-ACTION-VALIDATE-RESTORE',
    label: 'Validate Restore',
    category: 'Safe Resilience Operation',
    riskLevel: 'Medium',
    executionMode: 'Executable',
    requiresApproval: false,
    requiredRole: 'Engineering Lead',
    backupRequired: true,
    restoreValidationRequired: false,
    auditRequired: true,
    status: 'Ready',
    recommendedNextStep: 'Validate the latest archive before enabling cloud synchronization.'
  }),
  adminAction({
    id: 'EOS-ADMIN-ACTION-OPEN-STORAGE-STATUS',
    label: 'Open Storage Status',
    category: 'Safe Visibility Operation',
    riskLevel: 'Low',
    executionMode: 'Executable',
    requiresApproval: false,
    requiredRole: 'Platform Operator',
    backupRequired: false,
    restoreValidationRequired: false,
    auditRequired: false,
    status: 'Ready',
    recommendedNextStep: 'Review persistent collection health and warnings.'
  }),
  adminAction({
    id: 'EOS-ADMIN-ACTION-OPEN-BACKUP-STATUS',
    label: 'Open Backup Status',
    category: 'Safe Visibility Operation',
    riskLevel: 'Low',
    executionMode: 'Executable',
    requiresApproval: false,
    requiredRole: 'Platform Operator',
    backupRequired: false,
    restoreValidationRequired: false,
    auditRequired: false,
    status: 'Ready',
    recommendedNextStep: 'Review latest archive, checksum, backup count, and restore validation.'
  }),
  adminAction({
    id: 'EOS-ADMIN-ACTION-OPEN-RELEASE-NOTES',
    label: 'Open Release Notes',
    category: 'Safe Visibility Operation',
    riskLevel: 'Low',
    executionMode: 'Executable',
    requiresApproval: false,
    requiredRole: 'Platform Operator',
    backupRequired: false,
    restoreValidationRequired: false,
    auditRequired: false,
    status: 'Ready',
    recommendedNextStep: 'Review release notes before external communication.'
  }),
  adminAction({
    id: 'EOS-ADMIN-ACTION-VIEW-CONFIGURATION',
    label: 'View Configuration',
    category: 'Safe Visibility Operation',
    riskLevel: 'Low',
    executionMode: 'Executable',
    requiresApproval: false,
    requiredRole: 'Platform Operator',
    backupRequired: false,
    restoreValidationRequired: false,
    auditRequired: true,
    status: 'Ready',
    recommendedNextStep: 'Review configuration posture before connecting external systems.'
  }),
  adminAction({
    id: 'EOS-ADMIN-ACTION-STOP-PLATFORM',
    label: 'Stop Platform',
    category: 'Governed Platform Operation',
    riskLevel: 'High',
    executionMode: 'Governed Display Only',
    requiresApproval: true,
    requiredRole: 'Chief Technology Officer',
    backupRequired: true,
    restoreValidationRequired: true,
    auditRequired: true,
    status: 'Pending Approval',
    recommendedNextStep: 'Keep disabled until authorization, persistence, and audit controls are complete.'
  }),
  adminAction({
    id: 'EOS-ADMIN-ACTION-RESTART-PLATFORM',
    label: 'Restart Platform',
    category: 'Governed Platform Operation',
    riskLevel: 'High',
    executionMode: 'Governed Display Only',
    requiresApproval: true,
    requiredRole: 'Chief Technology Officer',
    backupRequired: true,
    restoreValidationRequired: true,
    auditRequired: true,
    status: 'Pending Approval',
    recommendedNextStep: 'Require approved maintenance window before execution is enabled.'
  }),
  adminAction({
    id: 'EOS-ADMIN-ACTION-CLONE-ENVIRONMENT',
    label: 'Clone Environment',
    category: 'Governed Infrastructure Operation',
    riskLevel: 'Medium',
    executionMode: 'Governed Display Only',
    requiresApproval: true,
    requiredRole: 'Chief Technology Officer',
    backupRequired: true,
    restoreValidationRequired: true,
    auditRequired: true,
    status: 'Pending Approval',
    recommendedNextStep: 'Define environment cloning policy before cloud execution.'
  }),
  adminAction({
    id: 'EOS-ADMIN-ACTION-SCALE-WORKERS',
    label: 'Scale Workers',
    category: 'Governed Workforce Operation',
    riskLevel: 'Medium',
    executionMode: 'Governed Display Only',
    requiresApproval: true,
    requiredRole: 'Chief Technology Officer',
    backupRequired: false,
    restoreValidationRequired: false,
    auditRequired: true,
    status: 'Pending Approval',
    recommendedNextStep: 'Define worker scaling limits before temporary agent creation.'
  }),
  adminAction({
    id: 'EOS-ADMIN-ACTION-RESTORE-BACKUP',
    label: 'Restore Backup',
    category: 'Governed Resilience Operation',
    riskLevel: 'Critical',
    executionMode: 'Governed Display Only',
    requiresApproval: true,
    requiredRole: 'Chief Technology Officer',
    backupRequired: true,
    restoreValidationRequired: true,
    auditRequired: true,
    status: 'Blocked',
    recommendedNextStep: 'Complete restore validation and require CTO approval before execution is enabled.'
  }),
  adminAction({
    id: 'EOS-ADMIN-ACTION-UPGRADE-PLATFORM',
    label: 'Upgrade Platform',
    category: 'Governed Release Operation',
    riskLevel: 'Critical',
    executionMode: 'Governed Display Only',
    requiresApproval: true,
    requiredRole: 'Chief Technology Officer',
    backupRequired: true,
    restoreValidationRequired: true,
    auditRequired: true,
    status: 'Pending Approval',
    recommendedNextStep: 'Require release manifest, backup, restore validation, and quality gates before execution.'
  })
];

export const authorizationPolicies = adminActions
  .filter((action) => action.requiresApproval)
  .map((action) => ({
    id: `EOS-POLICY-${action.id.replace('EOS-ADMIN-ACTION-', '')}`,
    actionId: action.id,
    actionType: action.category,
    requiredRole: action.requiredRole,
    approvalRequired: action.requiresApproval,
    backupRequired: action.backupRequired,
    restoreValidationRequired: action.restoreValidationRequired,
    auditRequired: action.auditRequired,
    executionEnabled: false,
    policyStatus: action.status === 'Blocked' ? 'Blocked' : 'Active',
    summary: `${action.label} requires ${action.requiredRole} approval before execution can be enabled.`
  }));

export const actionGovernanceRecords = adminActions.map((action) => ({
  id: `EOS-GOV-${action.id.replace('EOS-ADMIN-ACTION-', '')}`,
  actionType: action.category,
  label: action.label,
  requestedBy: 'Mission Control',
  owner: action.requiredRole,
  target: 'EOS Platform',
  status: action.status,
  approvalStatus: action.requiresApproval ? 'Pending' : 'Not Required',
  riskLevel: action.riskLevel,
  preconditions: [
    action.backupRequired ? 'Current backup required' : 'Backup not required for read-only execution',
    action.restoreValidationRequired ? 'Restore validation required' : 'Restore validation not required for this action',
    action.auditRequired ? 'Audit record required' : 'Audit record optional'
  ],
  authorizationPolicy: authorizationPolicies.find((policy) => policy.actionId === action.id)?.id ?? 'Safe operation policy',
  auditTrail: [
    audit('Action Registered', `${action.label} was registered in the Platform Administration Center.`),
    audit('Execution Guard Applied', `${action.label} execution mode is ${action.executionMode}.`)
  ],
  createdAt,
  updatedAt: createdAt,
  linkedWorkflow: 'EOS-WF-ACTION-AUTHORIZATION',
  linkedEvents: ['EOS-EVENT-ADMIN-ACTION-REGISTERED']
}));

export const agentMessages = [
  {
    id: 'EOS-MSG-CODEX-001',
    threadId: 'EOS-THREAD-CODEX-BUILD-001',
    from: 'Eric Olo',
    to: 'Codex',
    subject: 'CAP-0027 build readiness',
    body: 'Confirm pre-build backup, status validation, and implementation readiness for the AI Workforce Operations slice.',
    priority: 'High',
    status: 'Open',
    createdAt,
    updatedAt: createdAt,
    linkedAgent: 'EOS-AGENT-CODEX',
    linkedObject: 'EOS-CAP-0027',
    linkedWorkflow: 'EOS-WF-PLATFORM-OPERATIONS-GOVERNANCE',
    requiresResponse: true,
    responseDue: '2026-07-03T21:00:00.000Z',
    auditTrail: [audit('Message Created', 'CEO build readiness message created for Codex.', 'Mission Control')]
  },
  {
    id: 'EOS-MSG-CODEX-002',
    threadId: 'EOS-THREAD-CODEX-BUILD-001',
    from: 'Codex',
    to: 'Eric Olo',
    subject: 'CAP-0027 engineering controls',
    body: 'Pre-build controls are active. Destructive platform operations will remain disabled until governance controls mature.',
    priority: 'High',
    status: 'Read',
    createdAt: '2026-07-03T20:16:00.000Z',
    updatedAt: '2026-07-03T20:16:00.000Z',
    linkedAgent: 'EOS-AGENT-CODEX',
    linkedObject: 'EOS-CAP-0027',
    linkedWorkflow: 'EOS-WF-PLATFORM-OPERATIONS-GOVERNANCE',
    requiresResponse: false,
    responseDue: '2026-07-03T21:30:00.000Z',
    auditTrail: [audit('Message Updated', 'Codex acknowledged build controls.', 'Codex')]
  },
  {
    id: 'EOS-MSG-ATHENA-001',
    threadId: 'EOS-THREAD-ATHENA-RESEARCH-001',
    from: 'Eric Olo',
    to: 'Athena',
    subject: 'Research portfolio readiness',
    body: 'Prepare the research framing for AI Workforce Operations and Second Balance Sheet investor narrative.',
    priority: 'Medium',
    status: 'Open',
    createdAt,
    updatedAt: createdAt,
    linkedAgent: 'EOS-AGENT-ATHENA',
    linkedObject: 'RP-004',
    linkedWorkflow: 'EOS-WF-RESEARCH-PUBLICATION',
    requiresResponse: true,
    responseDue: '2026-07-04T10:00:00.000Z',
    auditTrail: [audit('Message Created', 'Research readiness message created for Athena.', 'Mission Control')]
  },
  {
    id: 'EOS-MSG-HERMES-001',
    threadId: 'EOS-THREAD-HERMES-KNOWLEDGE-001',
    from: 'Eric Olo',
    to: 'Hermes',
    subject: 'Knowledge Vault update',
    body: 'Prepare Genesis and Knowledge Vault updates for AI Workforce Operations and Platform Administration.',
    priority: 'Medium',
    status: 'Open',
    createdAt,
    updatedAt: createdAt,
    linkedAgent: 'EOS-AGENT-HERMES',
    linkedObject: 'EOS-AKR',
    linkedWorkflow: 'EOS-WF-KNOWLEDGE-MANAGEMENT',
    requiresResponse: true,
    responseDue: '2026-07-04T11:00:00.000Z',
    auditTrail: [audit('Message Created', 'Knowledge update message created for Hermes.', 'Mission Control')]
  },
  {
    id: 'EOS-MSG-ATLAS-001',
    threadId: 'EOS-THREAD-ATLAS-ARCHITECTURE-001',
    from: 'Eric Olo',
    to: 'Atlas',
    subject: 'Administration architecture review',
    body: 'Review the action governance model before executable administration controls are introduced.',
    priority: 'High',
    status: 'Open',
    createdAt,
    updatedAt: createdAt,
    linkedAgent: 'EOS-AGENT-ATLAS',
    linkedObject: 'EOS-ACTION-GOVERNANCE',
    linkedWorkflow: 'EOS-WF-ACTION-AUTHORIZATION',
    requiresResponse: true,
    responseDue: '2026-07-04T09:30:00.000Z',
    auditTrail: [audit('Message Created', 'Architecture review message created for Atlas.', 'Mission Control')]
  }
];

export const agentActivity = [
  {
    id: 'EOS-ACTIVITY-CODEX-0027',
    agentId: 'EOS-AGENT-CODEX',
    agentName: 'Codex',
    activityType: 'Capability Build',
    title: 'AI Workforce Operations & Platform Administration Center',
    summary: 'Building the Mission Control operations layer, platform administration APIs, and governed admin actions.',
    status: 'In Progress',
    progress: 62,
    startedAt: createdAt,
    updatedAt: createdAt,
    estimatedCompletion: '2026-07-03T22:00:00.000Z',
    linkedCapability: 'EOS-CAP-0027',
    linkedWorkflow: 'EOS-WF-PLATFORM-OPERATIONS-GOVERNANCE',
    linkedObjects: ['EOS-PLATFORM-ADMINISTRATION-CENTER', 'EOS-AI-WORKFORCE-OPERATIONS'],
    requiresHumanAttention: false,
    attentionLevel: 'No Action Required',
    recommendedAction: 'Monitor verification results after implementation.'
  },
  {
    id: 'EOS-ACTIVITY-ATHENA-RESEARCH',
    agentId: 'EOS-AGENT-ATHENA',
    agentName: 'Athena',
    activityType: 'Research Portfolio',
    title: 'AI-native enterprise workforce research',
    summary: 'Preparing research framing for executive AI workforces and enterprise operating systems.',
    status: 'In Progress',
    progress: 54,
    startedAt: '2026-07-03T19:40:00.000Z',
    updatedAt: createdAt,
    estimatedCompletion: '2026-07-04T12:00:00.000Z',
    linkedCapability: 'EOS-CAP-0015',
    linkedWorkflow: 'EOS-WF-RESEARCH-PUBLICATION',
    linkedObjects: ['RP-004', 'EOS-AKR'],
    requiresHumanAttention: true,
    attentionLevel: 'Low',
    recommendedAction: 'Review investor framing after the administration center is verified.'
  },
  {
    id: 'EOS-ACTIVITY-HERMES-KNOWLEDGE',
    agentId: 'EOS-AGENT-HERMES',
    agentName: 'Hermes',
    activityType: 'Knowledge Governance',
    title: 'Genesis and capability knowledge update',
    summary: 'Maintaining documentation and capability record alignment for the AI Workforce Operations layer.',
    status: 'In Progress',
    progress: 68,
    startedAt: '2026-07-03T19:50:00.000Z',
    updatedAt: createdAt,
    estimatedCompletion: '2026-07-03T22:30:00.000Z',
    linkedCapability: 'EOS-CAP-0027',
    linkedWorkflow: 'EOS-WF-KNOWLEDGE-MANAGEMENT',
    linkedObjects: ['EOS-KNOWLEDGE-GENESIS', 'EOS-AKR'],
    requiresHumanAttention: false,
    attentionLevel: 'No Action Required',
    recommendedAction: 'Publish documentation after verification passes.'
  },
  {
    id: 'EOS-ACTIVITY-ATLAS-ARCHITECTURE',
    agentId: 'EOS-AGENT-ATLAS',
    agentName: 'Atlas',
    activityType: 'Architecture Review',
    title: 'Action governance architecture review',
    summary: 'Reviewing authorization policy boundaries for future executable administration controls.',
    status: 'In Progress',
    progress: 48,
    startedAt: '2026-07-03T19:55:00.000Z',
    updatedAt: createdAt,
    estimatedCompletion: '2026-07-04T09:00:00.000Z',
    linkedCapability: 'EOS-CAP-0027',
    linkedWorkflow: 'EOS-WF-ACTION-AUTHORIZATION',
    linkedObjects: ['EOS-ACTION-GOVERNANCE'],
    requiresHumanAttention: true,
    attentionLevel: 'Medium',
    recommendedAction: 'Approve architecture policy before destructive actions are enabled.'
  }
];

export const agentAttentionQueue = [
  {
    id: 'EOS-ATTENTION-RESTORE-VALIDATION',
    sourceAgent: 'Argus',
    title: 'Restore validation required',
    reason: 'Backups are current, but restore validation is still pending.',
    priority: 'High',
    attentionLevel: 'Medium',
    status: 'Open',
    createdAt,
    dueAt: '2026-07-04T12:00:00.000Z',
    estimatedReviewTime: '8 minutes',
    recommendedAction: 'Run restore validation before enabling cloud backup synchronization.',
    availableActions: ['Review Backup Status', 'Validate Restore', 'Request Operations Review'],
    linkedObject: 'EOS-PLATFORM-ADMINISTRATION-CENTER',
    linkedWorkflow: 'EOS-WF-PLATFORM-OPERATIONS-GOVERNANCE'
  },
  {
    id: 'EOS-ATTENTION-ACTION-GOVERNANCE',
    sourceAgent: 'Atlas',
    title: 'Governed admin actions require approval policy',
    reason: 'Stop, restart, restore, upgrade, and scaling actions must remain disabled until authorization is complete.',
    priority: 'High',
    attentionLevel: 'High',
    status: 'Open',
    createdAt,
    dueAt: '2026-07-04T14:00:00.000Z',
    estimatedReviewTime: '12 minutes',
    recommendedAction: 'Review authorization policies before enabling any destructive execution.',
    availableActions: ['Review Policies', 'Review Audit Trail', 'Escalate To CTO'],
    linkedObject: 'EOS-ACTION-GOVERNANCE',
    linkedWorkflow: 'EOS-WF-ACTION-AUTHORIZATION'
  },
  {
    id: 'EOS-ATTENTION-ATHENA-RESEARCH',
    sourceAgent: 'Athena',
    title: 'Research narrative review recommended',
    reason: 'AI Workforce Operations creates publishable framing for AI-native enterprise headquarters.',
    priority: 'Medium',
    attentionLevel: 'Low',
    status: 'Open',
    createdAt,
    dueAt: '2026-07-05T10:00:00.000Z',
    estimatedReviewTime: '10 minutes',
    recommendedAction: 'Review research framing for investor and publication use.',
    availableActions: ['Review Research Portfolio', 'Create Investor Brief', 'Request White Paper Outline'],
    linkedObject: 'RP-004',
    linkedWorkflow: 'EOS-WF-RESEARCH-PUBLICATION'
  }
];

export const agentCalendar = [
  {
    id: 'EOS-CAL-CODEX-BUILD-SPRINT',
    agentId: 'EOS-AGENT-CODEX',
    title: 'Codex build sprint',
    type: 'Engineering Sprint',
    startTime: '2026-07-03T20:15:00.000Z',
    endTime: '2026-07-03T22:00:00.000Z',
    status: 'Scheduled',
    priority: 'High',
    linkedWorkflow: 'EOS-WF-PLATFORM-OPERATIONS-GOVERNANCE',
    linkedObject: 'EOS-CAP-0027',
    requiresHumanAttendance: false,
    recommendedPreparation: 'Review pre-build backup status and capability requirements.',
    location: 'Mission Control',
    meetingMode: 'Internal'
  },
  {
    id: 'EOS-CAL-ATHENA-RESEARCH-REVIEW',
    agentId: 'EOS-AGENT-ATHENA',
    title: 'Athena research review',
    type: 'Research Review',
    startTime: '2026-07-04T10:00:00.000Z',
    endTime: '2026-07-04T10:30:00.000Z',
    status: 'Scheduled',
    priority: 'Medium',
    linkedWorkflow: 'EOS-WF-RESEARCH-PUBLICATION',
    linkedObject: 'RP-004',
    requiresHumanAttendance: true,
    recommendedPreparation: 'Review AI Workforce Operations business impact.',
    location: 'Digital Enterprise Headquarters',
    meetingMode: 'Executive Review'
  },
  {
    id: 'EOS-CAL-HERMES-KNOWLEDGE-UPDATE',
    agentId: 'EOS-AGENT-HERMES',
    title: 'Hermes knowledge update',
    type: 'Knowledge Governance',
    startTime: '2026-07-04T11:00:00.000Z',
    endTime: '2026-07-04T11:20:00.000Z',
    status: 'Scheduled',
    priority: 'Medium',
    linkedWorkflow: 'EOS-WF-KNOWLEDGE-MANAGEMENT',
    linkedObject: 'EOS-KNOWLEDGE-GENESIS',
    requiresHumanAttendance: false,
    recommendedPreparation: 'Prepare Genesis and Knowledge Vault entries.',
    location: 'Knowledge Vault',
    meetingMode: 'Internal'
  },
  {
    id: 'EOS-CAL-ATLAS-ARCHITECTURE-REVIEW',
    agentId: 'EOS-AGENT-ATLAS',
    title: 'Atlas architecture review',
    type: 'Architecture Review',
    startTime: '2026-07-04T09:00:00.000Z',
    endTime: '2026-07-04T09:30:00.000Z',
    status: 'Scheduled',
    priority: 'High',
    linkedWorkflow: 'EOS-WF-ACTION-AUTHORIZATION',
    linkedObject: 'EOS-ACTION-GOVERNANCE',
    requiresHumanAttendance: true,
    recommendedPreparation: 'Review authorization policy and audit boundaries.',
    location: 'Architecture Office',
    meetingMode: 'Executive Review'
  },
  {
    id: 'EOS-CAL-MERCURY-OPPORTUNITY-SCAN',
    agentId: 'EOS-AGENT-MERCURY',
    title: 'Mercury opportunity scan',
    type: 'Opportunity Scan',
    startTime: '2026-07-04T13:00:00.000Z',
    endTime: '2026-07-04T13:30:00.000Z',
    status: 'Scheduled',
    priority: 'Medium',
    linkedWorkflow: 'EOS-WF-OPPORTUNITY-DISCOVERY',
    linkedObject: 'EOS-AGENT-MERCURY',
    requiresHumanAttendance: false,
    recommendedPreparation: 'Review investor readiness and market positioning.',
    location: 'Opportunity Office',
    meetingMode: 'Internal'
  },
  {
    id: 'EOS-CAL-ARGUS-HEALTH-CHECK',
    agentId: 'EOS-AGENT-ARGUS',
    title: 'Argus operations health check',
    type: 'Operations Review',
    startTime: '2026-07-04T08:30:00.000Z',
    endTime: '2026-07-04T08:50:00.000Z',
    status: 'Scheduled',
    priority: 'High',
    linkedWorkflow: 'EOS-WF-PLATFORM-OPERATIONS-GOVERNANCE',
    linkedObject: 'EOS-PLATFORM-ADMINISTRATION-CENTER',
    requiresHumanAttendance: false,
    recommendedPreparation: 'Review platform, storage, backup, and API status.',
    location: 'Operations Office',
    meetingMode: 'Internal'
  },
  {
    id: 'EOS-CAL-VULCAN-QA-REVIEW',
    agentId: 'EOS-AGENT-VULCAN',
    title: 'Vulcan QA review',
    type: 'Quality Review',
    startTime: '2026-07-04T12:00:00.000Z',
    endTime: '2026-07-04T12:30:00.000Z',
    status: 'Scheduled',
    priority: 'High',
    linkedWorkflow: 'EOS-WF-ACTION-AUTHORIZATION',
    linkedObject: 'EOS-CAP-0027',
    requiresHumanAttendance: false,
    recommendedPreparation: 'Review lint, build, endpoint, backup, and status verification results.',
    location: 'Quality Office',
    meetingMode: 'Internal'
  }
];
