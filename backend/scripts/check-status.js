import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';

const port = process.env.PORT ?? '3000';
const host = process.env.HOST ?? '127.0.0.1';
const requestHost = host === '0.0.0.0' ? '127.0.0.1' : host;
const baseUrl = `http://${requestHost}:${port}`;

const expectedStatus = {
  platform: 'EOS',
  version: '0.25.0',
  status: 'Operational',
  uptime: 'Running',
  activeAgents: 7
};

const expectedObjectIds = [
  'EOS-MC-001',
  'EOS-API-001',
  'EOS-CAP-0005',
  'EOS-CAP-0006',
  'EOS-CAP-0007',
  'EOS-CAP-0008',
  'EOS-CAP-0009',
  'EOS-CAP-0010',
  'EOS-CAP-0011',
  'EOS-CAP-0012',
  'EOS-CAP-0013',
  'EOS-CAP-0014',
  'EOS-CAP-0015',
  'EOS-CAP-0016',
  'EOS-CAP-0020',
  'EOS-CAP-0021',
  'EOS-CAP-0022',
  'EOS-CAP-0023',
  'EOS-CAP-0024',
  'EOS-CAP-0025',
  'EOS-CAP-0026',
  'EOS-CAP-0027',
  'EOS-CAP-0028',
  'EOS-CAP-0029',
  'EOS-CAP-0030',
  'EOS-CAP-0031',
  'EOS-CAP-0032',
  'EOS-CAP-0033',
  'EOS-STARTUP-EXPERIENCE',
  'EOS-IDENTITY-MEDIA-REGISTRY',
  'EOS-MEDIA-ASSET-STORE',
  'EOS-ORGANIZATION-INTAKE',
  'EOS-EXTERNAL-REPOSITORY-LINKS',
  'EOS-ORG-DIR-001',
  'EOS-ORG-DIR-002',
  'EOS-EXEC-LEADERSHIP-TEAM',
  'EOS-AKR',
  'EOS-ASSET-EXPLORER',
  'EOS-PMO',
  'EOS-MASTER-ROADMAP',
  'EOS-EXECUTIVE-COUNCIL',
  'EOS-DIGITAL-ENTERPRISE-HEADQUARTERS',
  'EOS-EXECUTIVE-ACTION-FRAMEWORK',
  'EOS-APPROVAL-QUEUE',
  'EOS-EXECUTIVE-OFFICE-FRAMEWORK',
  'EOS-ENTERPRISE-DESIGN-SYSTEM',
  'EOS-EXECUTIVE-PRESENTATION-MODE',
  'EOS-UX-AUDIT',
  'EOS-PERSISTENT-DATA-STORE',
  'EOS-STORAGE-HEALTH',
  'EOS-ENTERPRISE-STRATEGY',
  'EOS-GOVERNANCE-COUNCIL',
  'EOS-DIGITAL-ENTERPRISE-VALUATION',
  'EOS-SECOND-BALANCE-SHEET',
  'EOS-DTA-MONITORING',
  'DTA-EPERCENT-001',
  'DTA-EOS-001',
  'DTA-OIL-001',
  'EOS-PLATFORM-ADMINISTRATION-CENTER',
  'EOS-AI-WORKFORCE-OPERATIONS',
  'EOS-AGENT-COMMUNICATION-LAYER',
  'EOS-AGENT-ACTIVITY-QUEUE',
  'EOS-AGENT-CALENDAR',
  'EOS-ACTION-GOVERNANCE',
  'EOS-MISSION-CONTROL-NAVIGATION',
  'EOS-DIGITAL-HEADQUARTERS-LOBBY',
  'EOS-COMMAND-PALETTE',
  'EOS-WORKSPACE-RAIL',
  'EOS-INVESTMENT-THESIS',
  'EOS-TECHNOLOGY-FLYWHEEL',
  'EOS-THREE-HORIZON-ROADMAP',
  'EOS-REVENUE-ENGINE',
  'EOS-DTA-LIFECYCLE',
  'EOS-KIPR',
  'EOS-ENTERPRISE-PROFILE',
  'EOS-INDUSTRY-FRAMEWORK',
  'EOS-MASTER-MONITORING-VIEW',
  'EOS-ENTERPRISE-DIGITAL-TWIN-HOME',
  'EOS-ENTERPRISE-VISUAL-MODEL',
  'EOS-REAL-TIME-TELEMETRY-FOUNDATION',
  'EOS-DIGITAL-TWIN-GENERATION-WORKFLOW',
  'EOS-ENTERPRISE-ONBOARDING',
  'EOS-DTA-ASSIMILATION-ENGINE',
  'EOS-DIGITAL-MIRROR',
  'EOS-DTA-CANDIDATE-REGISTRY',
  'EOS-DATA-FEED-REQUIREMENTS',
  'EOS-HUMAN-VALIDATION-GATE',
  'EOS-PLATFORM-AUDIT-CENTER',
  'EOS-CAPABILITY-READINESS-MATRIX',
  'EOS-FUNCTIONAL-COVERAGE-REPORT',
  'EOS-AUDIT-READINESS-SCORE',
  'EOS-KNOWLEDGE-GENESIS',
  'EOS-KNOWLEDGE-MISSION-CONTROL',
  'EOS-KNOWLEDGE-CORE-API',
  'EOS-KNOWLEDGE-ENTERPRISE-OBJECT-REGISTRY',
  'EOS-KNOWLEDGE-AGENT-SERVICE',
  'RP-001',
  'RP-002',
  'RP-003',
  'RP-004',
  'EOS-WF-RESEARCH-PUBLICATION',
  'EOS-WF-OPPORTUNITY-DISCOVERY',
  'EOS-WF-DIGITAL-TWIN-FORMATION',
  'EOS-WF-KNOWLEDGE-UPDATE',
  'EOS-WF-AGENT-COORDINATION',
  'EOS-WF-DEVELOPMENT-FOUNDATION',
  'EOS-WF-BACKUP-RECOVERY',
  'EOS-WF-SOURCE-CONTROL-RELEASE',
  'EOS-WF-INITIAL-REPOSITORY-BASELINE',
  'EOS-WF-GOOGLE-DRIVE-BACKUP-PREPARATION',
  'EOS-WF-LIVE-OBJECT-STATUS-LAYER',
  'EOS-WF-KNOWLEDGE-MANAGEMENT',
  'EOS-WF-KNOWLEDGE-ASSET-VIEWER',
  'EOS-WF-PROGRAM-MANAGEMENT',
  'EOS-WF-EXECUTIVE-COUNCIL-GOVERNANCE',
  'EOS-WF-EXECUTIVE-ACTION-GOVERNANCE',
  'EOS-WF-EXECUTIVE-OFFICE-MANAGEMENT',
  'EOS-WF-DESIGN-GOVERNANCE',
  'EOS-WF-PERSISTENT-DATA-MANAGEMENT',
  'EOS-WF-STRATEGY-GOVERNANCE-VALUATION',
  'EOS-WF-PLATFORM-OPERATIONS-GOVERNANCE',
  'EOS-WF-AGENT-COMMUNICATION',
  'EOS-WF-AGENT-ACTIVITY-MONITORING',
  'EOS-WF-AGENT-CALENDAR-MANAGEMENT',
  'EOS-WF-ACTION-AUTHORIZATION',
  'EOS-WF-MISSION-CONTROL-EXPERIENCE-GOVERNANCE',
  'EOS-WF-STRATEGIC-ALIGNMENT',
  'EOS-WF-ENTERPRISE-DIGITAL-TWIN-VISUALIZATION',
  'EOS-WF-ORGANIZATION-INTAKE',
  'EOS-WF-ENTERPRISE-ONBOARDING',
  'EOS-WF-DTA-ASSIMILATION',
  'EOS-WF-HUMAN-VALIDATION',
  'EOS-WF-PLATFORM-AUDIT-READINESS',
  'EOS-AGENT-ATHENA',
  'EOS-AGENT-HERMES',
  'EOS-AGENT-ATLAS',
  'EOS-AGENT-CODEX',
  'EOS-AGENT-MERCURY',
  'EOS-AGENT-ARGUS',
  'EOS-AGENT-VULCAN'
];

const expectedAgentIds = [
  'EOS-AGENT-ATHENA',
  'EOS-AGENT-HERMES',
  'EOS-AGENT-ATLAS',
  'EOS-AGENT-CODEX',
  'EOS-AGENT-MERCURY',
  'EOS-AGENT-ARGUS',
  'EOS-AGENT-VULCAN'
];

const expectedExecutiveAgentRoles = {
  'EOS-AGENT-ATHENA': 'Chief Research Officer',
  'EOS-AGENT-HERMES': 'Chief Knowledge Officer',
  'EOS-AGENT-ATLAS': 'Chief Enterprise Architect',
  'EOS-AGENT-CODEX': 'Chief Engineering Officer',
  'EOS-AGENT-MERCURY': 'Chief Opportunity Officer',
  'EOS-AGENT-ARGUS': 'Chief Operations Officer',
  'EOS-AGENT-VULCAN': 'Chief Quality Officer'
};

const expectedKnowledgeIds = [
  'EOS-KNOWLEDGE-GENESIS',
  'EOS-KNOWLEDGE-MISSION-CONTROL',
  'EOS-KNOWLEDGE-CORE-API',
  'EOS-KNOWLEDGE-ENTERPRISE-OBJECT-REGISTRY',
  'EOS-KNOWLEDGE-AGENT-SERVICE'
];

const expectedWorkflowIds = [
  'EOS-WF-RESEARCH-PUBLICATION',
  'EOS-WF-KNOWLEDGE-UPDATE',
  'EOS-WF-AGENT-COORDINATION',
  'EOS-WF-OPPORTUNITY-DISCOVERY',
  'EOS-WF-DIGITAL-TWIN-FORMATION',
  'EOS-WF-DEVELOPMENT-FOUNDATION',
  'EOS-WF-BACKUP-RECOVERY',
  'EOS-WF-SOURCE-CONTROL-RELEASE',
  'EOS-WF-INITIAL-REPOSITORY-BASELINE',
  'EOS-WF-GOOGLE-DRIVE-BACKUP-PREPARATION',
  'EOS-WF-LIVE-OBJECT-STATUS-LAYER',
  'EOS-WF-KNOWLEDGE-MANAGEMENT',
  'EOS-WF-KNOWLEDGE-ASSET-VIEWER',
  'EOS-WF-PROGRAM-MANAGEMENT',
  'EOS-WF-EXECUTIVE-COUNCIL-GOVERNANCE',
  'EOS-WF-EXECUTIVE-ACTION-GOVERNANCE',
  'EOS-WF-EXECUTIVE-OFFICE-MANAGEMENT',
  'EOS-WF-DESIGN-GOVERNANCE',
  'EOS-WF-PERSISTENT-DATA-MANAGEMENT',
  'EOS-WF-STRATEGY-GOVERNANCE-VALUATION',
  'EOS-WF-PLATFORM-OPERATIONS-GOVERNANCE',
  'EOS-WF-AGENT-COMMUNICATION',
  'EOS-WF-AGENT-ACTIVITY-MONITORING',
  'EOS-WF-AGENT-CALENDAR-MANAGEMENT',
  'EOS-WF-ACTION-AUTHORIZATION',
  'EOS-WF-MISSION-CONTROL-EXPERIENCE-GOVERNANCE',
  'EOS-WF-STRATEGIC-ALIGNMENT',
  'EOS-WF-ENTERPRISE-DIGITAL-TWIN-VISUALIZATION',
  'EOS-WF-ORGANIZATION-INTAKE',
  'EOS-WF-ENTERPRISE-ONBOARDING',
  'EOS-WF-DTA-ASSIMILATION',
  'EOS-WF-HUMAN-VALIDATION',
  'EOS-WF-PLATFORM-AUDIT-READINESS'
];

const expectedEventTypes = [
  'WORKFLOW_STARTED',
  'WORKFLOW_COMPLETED',
  'AGENT_STARTED',
  'AGENT_COMPLETED',
  'KNOWLEDGE_UPDATED',
  'OBJECT_CREATED',
  'LIVE_OBJECT_STATUS_CREATED',
  'LIVE_OBJECT_STATUS_UPDATED',
  'ATTENTION_REQUIRED',
  'KNOWLEDGE_OBJECT_CREATED',
  'PUBLICATION_READY',
  'PATENT_IDENTIFIED',
  'INVESTOR_BRIEF_READY',
  'KNOWLEDGE_ASSET_VIEWED',
  'KNOWLEDGE_ASSET_STATUS_UPDATED',
  'KNOWLEDGE_ASSET_REVIEW_REQUESTED',
  'INVESTOR_BRIEF_AVAILABLE',
  'PUBLICATION_DRAFT_AVAILABLE',
  'PROGRAM_CREATED',
  'PROGRAM_UPDATED',
  'MILESTONE_COMPLETED',
  'ROADMAP_UPDATED',
  'SPRINT_STARTED',
  'SPRINT_COMPLETED',
  'EXECUTIVE_COUNCIL_CREATED',
  'EXECUTIVE_PROFILE_UPDATED',
  'EXECUTIVE_ATTENTION_REQUIRED',
  'CEO_COCKPIT_UPDATED',
  'DIGITAL_HEADQUARTERS_CREATED',
  'EXECUTIVE_ACTION_CREATED',
  'EXECUTIVE_ACTION_REVIEW_REQUESTED',
  'EXECUTIVE_ACTION_APPROVED',
  'EXECUTIVE_ACTION_REJECTED',
  'EXECUTIVE_ACTION_ESCALATED',
  'EXECUTIVE_ACTION_DEFERRED',
  'EXECUTIVE_OFFICE_OPENED',
  'EXECUTIVE_BRIEFING_UPDATED',
  'DEPARTMENT_STATUS_UPDATED',
  'DESIGN_SYSTEM_CREATED',
  'UX_AUDIT_COMPLETED',
  'PRESENTATION_MODE_ENABLED',
  'TOOLTIP_REGISTERED',
  'DESIGN_STANDARD_UPDATED',
  'PERSISTENT_STORE_CREATED',
  'COLLECTION_INITIALIZED',
  'COLLECTION_UPDATED',
  'STORAGE_SNAPSHOT_CREATED',
  'STORAGE_HEALTH_CHECK_COMPLETED',
  'STRATEGY_CREATED',
  'STRATEGY_APPROVAL_REQUIRED',
  'ROADMAP_ALIGNED_TO_STRATEGY',
  'VALUATION_UPDATED',
  'SECOND_BALANCE_SHEET_UPDATED',
  'DTA_CREATED',
  'DTA_STATUS_UPDATED',
  'GOVERNANCE_REVIEW_REQUIRED',
  'PLATFORM_ADMIN_CENTER_CREATED',
  'ADMIN_ACTION_REGISTERED',
  'ADMIN_ACTION_AUTHORIZATION_REQUIRED',
  'ADMIN_ACTION_COMPLETED',
  'AGENT_MESSAGE_CREATED',
  'AGENT_MESSAGE_UPDATED',
  'AGENT_ACTIVITY_UPDATED',
  'AGENT_ATTENTION_REQUIRED',
  'AGENT_CALENDAR_EVENT_CREATED',
  'ACTION_GOVERNANCE_POLICY_CREATED',
  'MISSION_CONTROL_NAVIGATION_REDESIGNED',
  'DIGITAL_HEADQUARTERS_LOBBY_CREATED',
  'WORKSPACE_RAIL_CREATED',
  'COMMAND_PALETTE_CREATED',
  'UX_NAVIGATION_AUDIT_COMPLETED',
  'INVESTMENT_THESIS_UPDATED',
  'TECHNOLOGY_FLYWHEEL_UPDATED',
  'REVENUE_MODEL_UPDATED',
  'DTA_LIFECYCLE_UPDATED',
  'KIPR_UPDATED',
  'ENTERPRISE_PROFILE_UPDATED',
  'MASTER_MONITORING_VIEW_CREATED',
  'ENTERPRISE_VISUAL_MODEL_CREATED',
  'DIGITAL_TWIN_HOME_CREATED',
  'TELEMETRY_UPDATE_RECEIVED',
  'TIMEZONE_STANDARD_APPLIED',
  'DIGITAL_TWIN_STRUCTURE_GENERATED',
  'STARTUP_EXPERIENCE_LOADED',
  'PROFILE_MEDIA_UPLOADED',
  'ORGANIZATION_LOGO_REGISTERED',
  'ORGANIZATION_IMPORT_RECEIVED',
  'INTAKE_EXTRACTION_COMPLETED',
  'ORGANIZATION_REPOSITORY_LINKED',
  'ENTERPRISE_ONBOARDING_STARTED',
  'SOURCE_CLASSIFICATION_COMPLETED',
  'ENTERPRISE_OBJECTS_EXTRACTED',
  'DIGITAL_MIRROR_CREATED',
  'DTA_CANDIDATE_IDENTIFIED',
  'DATA_FEED_REQUIREMENT_CREATED',
  'HUMAN_VALIDATION_REQUIRED',
  'DTA_FORMATION_READY',
  'PLATFORM_AUDIT_CREATED',
  'CAPABILITY_READINESS_UPDATED',
  'FUNCTIONAL_GAP_IDENTIFIED',
  'READINESS_SCORE_UPDATED',
  'AUDIT_REPORT_GENERATED'
];

const expectedEventIds = [
  'EOS-EVENT-RESEARCH-PUBLICATION-STARTED',
  'EOS-EVENT-RESEARCH-PUBLICATION-AGENT-STARTED',
  'EOS-EVENT-KNOWLEDGE-UPDATE-STARTED',
  'EOS-EVENT-KNOWLEDGE-UPDATED',
  'EOS-EVENT-AGENT-COORDINATION-STARTED',
  'EOS-EVENT-AGENT-COORDINATION-COMPLETED',
  'EOS-EVENT-OPPORTUNITY-DISCOVERY-STARTED',
  'EOS-EVENT-OPPORTUNITY-DISCOVERY-COMPLETED',
  'EOS-EVENT-DIGITAL-TWIN-FORMATION-STARTED',
  'EOS-EVENT-DIGITAL-TWIN-OBJECT-CREATED',
  'EOS-EVENT-DEVELOPMENT-FOUNDATION-STARTED',
  'EOS-EVENT-DEVELOPMENT-FOUNDATION-COMPLETED',
  'EOS-EVENT-BACKUP-RECOVERY-STARTED',
  'EOS-EVENT-BACKUP-ARCHIVE-CREATED',
  'EOS-EVENT-BACKUP-RECOVERY-COMPLETED',
  'EOS-EVENT-SOURCE-CONTROL-RELEASE-STARTED',
  'EOS-EVENT-RELEASE-MANIFEST-CREATED',
  'EOS-EVENT-SOURCE-CONTROL-RELEASE-COMPLETED',
  'EOS-EVENT-INITIAL-BASELINE-STARTED',
  'EOS-EVENT-GENESIS-COMMIT-CREATED',
  'EOS-EVENT-LOCAL-RELEASE-TAG-CREATED',
  'EOS-EVENT-INITIAL-BASELINE-COMPLETED',
  'EOS-EVENT-GOOGLE-DRIVE-PREP-STARTED',
  'EOS-EVENT-GOOGLE-DRIVE-CONFIG-CREATED',
  'EOS-EVENT-GOOGLE-DRIVE-PREP-COMPLETED',
  'EOS-EVENT-LIVE-STATUS-LAYER-STARTED',
  'EOS-EVENT-LIVE-OBJECT-STATUS-CREATED',
  'EOS-EVENT-LIVE-OBJECT-STATUS-UPDATED',
  'EOS-EVENT-BACKUP-RESTORE-ATTENTION-REQUIRED',
  'EOS-EVENT-LIVE-STATUS-LAYER-COMPLETED',
  'EOS-EVENT-AKR-KNOWLEDGE-OBJECT-CREATED',
  'EOS-EVENT-AKR-KNOWLEDGE-UPDATED',
  'EOS-EVENT-AKR-PUBLICATION-READY',
  'EOS-EVENT-AKR-PATENT-IDENTIFIED',
  'EOS-EVENT-AKR-INVESTOR-BRIEF-READY',
  'EOS-EVENT-KNOWLEDGE-ASSET-VIEWED',
  'EOS-EVENT-KNOWLEDGE-ASSET-STATUS-UPDATED',
  'EOS-EVENT-KNOWLEDGE-ASSET-REVIEW-REQUESTED',
  'EOS-EVENT-INVESTOR-BRIEF-AVAILABLE',
  'EOS-EVENT-PUBLICATION-DRAFT-AVAILABLE',
  'EOS-EVENT-PMO-PROGRAM-CREATED',
  'EOS-EVENT-PMO-PROGRAM-UPDATED',
  'EOS-EVENT-PMO-MILESTONE-COMPLETED',
  'EOS-EVENT-PMO-ROADMAP-UPDATED',
  'EOS-EVENT-PMO-SPRINT-STARTED',
  'EOS-EVENT-PMO-SPRINT-COMPLETED',
  'EOS-EVENT-EXECUTIVE-COUNCIL-CREATED',
  'EOS-EVENT-EXECUTIVE-PROFILE-UPDATED',
  'EOS-EVENT-EXECUTIVE-ATTENTION-REQUIRED',
  'EOS-EVENT-CEO-COCKPIT-UPDATED',
  'EOS-EVENT-DIGITAL-HEADQUARTERS-CREATED',
  'EOS-EVENT-EXECUTIVE-ACTION-CREATED',
  'EOS-EVENT-EXECUTIVE-ACTION-REVIEW-REQUESTED',
  'EOS-EVENT-EXECUTIVE-ACTION-APPROVED',
  'EOS-EVENT-EXECUTIVE-ACTION-REJECTED',
  'EOS-EVENT-EXECUTIVE-ACTION-ESCALATED',
  'EOS-EVENT-EXECUTIVE-ACTION-DEFERRED',
  'EOS-EVENT-EXECUTIVE-OFFICE-OPENED',
  'EOS-EVENT-EXECUTIVE-BRIEFING-UPDATED',
  'EOS-EVENT-DEPARTMENT-STATUS-UPDATED',
  'EOS-EVENT-DESIGN-SYSTEM-CREATED',
  'EOS-EVENT-UX-AUDIT-COMPLETED',
  'EOS-EVENT-PRESENTATION-MODE-ENABLED',
  'EOS-EVENT-TOOLTIP-REGISTERED',
  'EOS-EVENT-DESIGN-STANDARD-UPDATED',
  'EOS-EVENT-PERSISTENT-STORE-CREATED',
  'EOS-EVENT-COLLECTION-INITIALIZED',
  'EOS-EVENT-COLLECTION-UPDATED',
  'EOS-EVENT-STORAGE-SNAPSHOT-CREATED',
  'EOS-EVENT-STORAGE-HEALTH-CHECK-COMPLETED',
  'EOS-EVENT-STRATEGY-CREATED',
  'EOS-EVENT-STRATEGY-APPROVAL-REQUIRED',
  'EOS-EVENT-ROADMAP-ALIGNED-TO-STRATEGY',
  'EOS-EVENT-VALUATION-UPDATED',
  'EOS-EVENT-SECOND-BALANCE-SHEET-UPDATED',
  'EOS-EVENT-DTA-EPERCENT-CREATED',
  'EOS-EVENT-DTA-EOS-STATUS-UPDATED',
  'EOS-EVENT-GOVERNANCE-REVIEW-REQUIRED',
  'EOS-EVENT-PLATFORM-ADMIN-CENTER-CREATED',
  'EOS-EVENT-ADMIN-ACTION-REGISTERED',
  'EOS-EVENT-ADMIN-ACTION-AUTHORIZATION-REQUIRED',
  'EOS-EVENT-ADMIN-ACTION-COMPLETED',
  'EOS-EVENT-AGENT-MESSAGE-CREATED',
  'EOS-EVENT-AGENT-MESSAGE-UPDATED',
  'EOS-EVENT-AGENT-ACTIVITY-UPDATED',
  'EOS-EVENT-AGENT-ATTENTION-REQUIRED',
  'EOS-EVENT-AGENT-CALENDAR-EVENT-CREATED',
  'EOS-EVENT-ACTION-GOVERNANCE-POLICY-CREATED',
  'EOS-EVENT-MISSION-CONTROL-NAVIGATION-REDESIGNED',
  'EOS-EVENT-DIGITAL-HEADQUARTERS-LOBBY-CREATED',
  'EOS-EVENT-WORKSPACE-RAIL-CREATED',
  'EOS-EVENT-COMMAND-PALETTE-CREATED',
  'EOS-EVENT-UX-NAVIGATION-AUDIT-COMPLETED',
  'EOS-EVENT-INVESTMENT-THESIS-UPDATED',
  'EOS-EVENT-TECHNOLOGY-FLYWHEEL-UPDATED',
  'EOS-EVENT-REVENUE-MODEL-UPDATED',
  'EOS-EVENT-DTA-LIFECYCLE-UPDATED',
  'EOS-EVENT-KIPR-UPDATED',
  'EOS-EVENT-ENTERPRISE-PROFILE-UPDATED',
  'EOS-EVENT-MASTER-MONITORING-VIEW-CREATED',
  'EOS-EVENT-ENTERPRISE-VISUAL-MODEL-CREATED',
  'EOS-EVENT-DIGITAL-TWIN-HOME-CREATED',
  'EOS-EVENT-TELEMETRY-UPDATE-RECEIVED',
  'EOS-EVENT-TIMEZONE-STANDARD-APPLIED',
  'EOS-EVENT-DIGITAL-TWIN-STRUCTURE-GENERATED',
  'EOS-EVENT-STARTUP-EXPERIENCE-LOADED',
  'EOS-EVENT-PROFILE-MEDIA-UPLOADED',
  'EOS-EVENT-ORGANIZATION-LOGO-REGISTERED',
  'EOS-EVENT-ORGANIZATION-IMPORT-RECEIVED',
  'EOS-EVENT-INTAKE-EXTRACTION-COMPLETED',
  'EOS-EVENT-ORGANIZATION-REPOSITORY-LINKED',
  'EOS-EVENT-ENTERPRISE-ONBOARDING-STARTED',
  'EOS-EVENT-SOURCE-CLASSIFICATION-COMPLETED',
  'EOS-EVENT-ENTERPRISE-OBJECTS-EXTRACTED',
  'EOS-EVENT-DIGITAL-MIRROR-CREATED',
  'EOS-EVENT-DTA-CANDIDATE-IDENTIFIED',
  'EOS-EVENT-DATA-FEED-REQUIREMENT-CREATED',
  'EOS-EVENT-HUMAN-VALIDATION-REQUIRED',
  'EOS-EVENT-DTA-FORMATION-READY',
  'EOS-EVENT-PLATFORM-AUDIT-CREATED',
  'EOS-EVENT-CAPABILITY-READINESS-UPDATED',
  'EOS-EVENT-FUNCTIONAL-GAP-IDENTIFIED',
  'EOS-EVENT-READINESS-SCORE-UPDATED',
  'EOS-EVENT-AUDIT-REPORT-GENERATED'
];

const expectedStorageCollections = [
  'enterprise-objects',
  'agents',
  'knowledge-objects',
  'agent-knowledge-repositories',
  'agent-knowledge-objects',
  'workflows',
  'events',
  'event-types',
  'pmo',
  'master-roadmap',
  'executive-council',
  'digital-enterprise-headquarters',
  'ceo-cockpit',
  'executive-profiles',
  'executive-actions',
  'executive-office-framework',
  'executive-offices',
  'enterprise-strategy',
  'governance-council',
  'valuation-models',
  'second-balance-sheet',
  'dta-monitoring',
  'digital-twin-assets',
  'strategic-alignment',
  'master-monitoring',
  'enterprise-visuals',
  'enterprise-telemetry',
  'digital-twin-homes',
  'digital-twin-generation-workflows',
  'enterprise-architecture-layers',
  'enterprise-onboarding',
  'assimilation-pipelines',
  'digital-mirrors',
  'dta-candidates',
  'data-feed-requirements',
  'human-validation-items',
  'startup-experience',
  'profile-identities',
  'media-assets',
  'organization-intake-records',
  'organization-repository-links',
  'media-extraction-rules',
  'platform-operations',
  'platform-navigation',
  'admin-actions',
  'authorization-policies',
  'action-governance',
  'agent-messages',
  'agent-activity',
  'agent-attention-queue',
  'agent-calendar',
  'backup-status',
  'release-metadata'
];

const requiredObjectFields = [
  'id',
  'name',
  'type',
  'status',
  'owner',
  'layer',
  'version',
  'description',
  'linkedObjects',
  'liveStatus'
];

const requiredLiveStatusFields = [
  'status',
  'operationalStatus',
  'lifecycleStatus',
  'healthScore',
  'progress',
  'summary',
  'lastActivity',
  'requiresAttention',
  'attentionLevel',
  'recommendedAction',
  'availableActions'
];

const validLiveStatuses = ['Green', 'Amber', 'Red', 'Blue', 'Grey'];
const validAttentionLevels = ['No Action Required', 'Low', 'Medium', 'High', 'Critical'];
const validLifecycleStatuses = [
  'Idea',
  'Defined',
  'Draft',
  'Research',
  'Building',
  'Testing',
  'Verified',
  'Review',
  'Approved',
  'Published',
  'Archived',
  'Not Started',
  'In Progress',
  'Pending Assessment'
];

const requiredAgentFields = [
  'id',
  'name',
  'role',
  'status',
  'currentTask',
  'progress',
  'health',
  'lastUpdate',
  'capabilities',
  'department',
  'reportsTo',
  'responsibilities',
  'executiveMetadata',
  'avatarUrl',
  'avatarType',
  'fallbackInitials',
  'statusBadge',
  'roleImage'
];

const requiredKnowledgeFields = [
  'id',
  'title',
  'category',
  'status',
  'owner',
  'version',
  'summary',
  'lastUpdate',
  'linkedObjects'
];

const requiredAgentKnowledgeObjectFields = [
  'id',
  'title',
  'ownerAgent',
  'type',
  'summary',
  'lifecycleStatus',
  'status',
  'progress',
  'created',
  'lastUpdated',
  'relatedCapabilities',
  'relatedEnterpriseObjects',
  'relatedWorkflows',
  'relatedEvents',
  'tags',
  'publicationTarget',
  'patentPotential',
  'investorReady',
  'publicationReady',
  'linkedDocuments',
  'previewContent',
  'liveStatus'
];

const expectedRepositoryAgents = ['Codex', 'Athena', 'Hermes', 'Atlas', 'Mercury', 'Argus', 'Vulcan'];
const expectedAgentKnowledgeObjectIds = ['RP-001', 'RP-002', 'RP-003', 'RP-004'];

const requiredWorkflowFields = [
  'id',
  'name',
  'description',
  'status',
  'steps',
  'owner',
  'currentStep',
  'progress',
  'linkedObjects',
  'trigger',
  'lastRun',
  'events'
];

const requiredEventFields = [
  'id',
  'type',
  'sourceWorkflowId',
  'status',
  'emittedAt',
  'payload'
];

const requiredPmoFields = [
  'id',
  'name',
  'owner',
  'status',
  'executiveOwner',
  'purpose',
  'responsibilities',
  'liveStatus'
];

const requiredRoadmapFields = [
  'id',
  'name',
  'owner',
  'vision',
  'mission',
  'strategicObjectives',
  'programs',
  'phases',
  'milestones',
  'capabilities',
  'dependencies',
  'risks',
  'executiveOwner',
  'businessValue',
  'researchValue',
  'investorValue',
  'estimatedCompletion',
  'status',
  'progress',
  'health',
  'currentSprint',
  'currentCapability',
  'upcomingMilestones',
  'recommendedAction',
  'availableActions',
  'liveStatus'
];

const expectedProgramNames = [
  'Engineering Foundation',
  'Executive AI Workforce',
  'Agent Operating System (AOS)',
  'Agent Resource Management (ARM)',
  'Digital Twin Asset Platform (DTAP)',
  'Digital Twin Asset Management (DTAM)',
  'Digital Twin Asset Exchange (DTAX)',
  'Second Balance Sheet',
  'Opportunity Engine',
  'Research & Publications',
  'Investor Readiness',
  'Commercial Launch'
];

const expectedExecutiveProfileIds = [
  'EOS-EXEC-ERIC-OLO',
  'EOS-EXEC-CHATGPT',
  'EOS-AGENT-CODEX',
  'EOS-AGENT-ATHENA',
  'EOS-AGENT-HERMES',
  'EOS-AGENT-ATLAS',
  'EOS-AGENT-MERCURY',
  'EOS-AGENT-ARGUS',
  'EOS-AGENT-VULCAN'
];

const requiredExecutiveProfileFields = [
  'id',
  'name',
  'role',
  'type',
  'department',
  'reportsTo',
  'responsibilities',
  'currentFocus',
  'status',
  'healthScore',
  'progress',
  'attentionLevel',
  'requiresAttention',
  'summary',
  'recommendedAction',
  'availableActions',
  'linkedEnterpriseObjects',
  'linkedPrograms',
  'lastActivity',
  'avatarUrl',
  'avatarType',
  'fallbackInitials',
  'statusBadge',
  'roleImage'
];

const requiredCeoCockpitFields = [
  'platformVersion',
  'platformHealth',
  'currentSprint',
  'currentCapability',
  'executiveAttentionRequired',
  'topRecommendedAction',
  'activeExecutives',
  'currentRoadmapPhase'
];

const expectedExecutiveActionLabels = [
  'Request Briefing',
  'Prepare Executive Review Session',
  'Prepare Executive Communication',
  'Review Department Work',
  'Prepare Executive Assignment',
  'Escalate Executive Attention Item',
  'View Department Portfolio',
  'Open Executive Office'
];

const validExecutiveActionStatuses = [
  'Draft',
  'Pending Review',
  'Awaiting Approval',
  'Approved',
  'Rejected',
  'Deferred',
  'Cancelled',
  'Completed'
];

const validApprovalStatuses = ['Not Required', 'Pending', 'Approved', 'Rejected', 'Escalated'];
const validRiskLevels = ['Low', 'Medium', 'High', 'Critical'];

const requiredExecutiveActionFields = [
  'id',
  'label',
  'description',
  'owner',
  'requester',
  'targetObject',
  'targetType',
  'sourceExecutive',
  'status',
  'approvalRequired',
  'approvalStatus',
  'riskLevel',
  'createdAt',
  'updatedAt',
  'linkedWorkflow',
  'linkedEvents',
  'auditTrail',
  'availableDecisionActions',
  'recommendedNextStep',
  'executionEnabled',
  'executionStatus'
];

const requiredAuditTrailFields = ['timestamp', 'actor', 'event', 'summary'];

const expectedAdminActionIds = [
  'EOS-ADMIN-ACTION-REFRESH-STATUS',
  'EOS-ADMIN-ACTION-RUN-HEALTH-CHECK',
  'EOS-ADMIN-ACTION-RUN-BACKUP',
  'EOS-ADMIN-ACTION-VALIDATE-RESTORE',
  'EOS-ADMIN-ACTION-OPEN-STORAGE-STATUS',
  'EOS-ADMIN-ACTION-OPEN-BACKUP-STATUS',
  'EOS-ADMIN-ACTION-OPEN-RELEASE-NOTES',
  'EOS-ADMIN-ACTION-VIEW-CONFIGURATION',
  'EOS-ADMIN-ACTION-STOP-PLATFORM',
  'EOS-ADMIN-ACTION-RESTART-PLATFORM',
  'EOS-ADMIN-ACTION-CLONE-ENVIRONMENT',
  'EOS-ADMIN-ACTION-SCALE-WORKERS',
  'EOS-ADMIN-ACTION-RESTORE-BACKUP',
  'EOS-ADMIN-ACTION-UPGRADE-PLATFORM'
];

const requiredAdminActionFields = [
  'id',
  'label',
  'category',
  'riskLevel',
  'executionMode',
  'requiresApproval',
  'requiredRole',
  'backupRequired',
  'restoreValidationRequired',
  'auditRequired',
  'status',
  'recommendedNextStep'
];

const validAdminActionStatuses = ['Draft', 'Ready', 'Pending Approval', 'Approved', 'Rejected', 'Blocked', 'Completed', 'Failed'];
const validAdminExecutionModes = ['Executable', 'Governed Display Only'];

const requiredActionGovernanceFields = [
  'id',
  'actionType',
  'label',
  'requestedBy',
  'owner',
  'target',
  'status',
  'approvalStatus',
  'riskLevel',
  'preconditions',
  'authorizationPolicy',
  'auditTrail',
  'createdAt',
  'updatedAt',
  'linkedWorkflow',
  'linkedEvents'
];

const requiredAgentMessageFields = [
  'id',
  'threadId',
  'from',
  'to',
  'subject',
  'body',
  'priority',
  'status',
  'createdAt',
  'updatedAt',
  'linkedAgent',
  'linkedObject',
  'linkedWorkflow',
  'requiresResponse',
  'responseDue',
  'auditTrail'
];

const requiredAgentActivityFields = [
  'id',
  'agentId',
  'agentName',
  'activityType',
  'title',
  'summary',
  'status',
  'progress',
  'startedAt',
  'updatedAt',
  'estimatedCompletion',
  'linkedCapability',
  'linkedWorkflow',
  'linkedObjects',
  'requiresHumanAttention',
  'attentionLevel',
  'recommendedAction'
];

const requiredAttentionFields = [
  'id',
  'sourceAgent',
  'title',
  'reason',
  'priority',
  'attentionLevel',
  'status',
  'createdAt',
  'dueAt',
  'estimatedReviewTime',
  'recommendedAction',
  'availableActions',
  'linkedObject',
  'linkedWorkflow'
];

const requiredCalendarFields = [
  'id',
  'agentId',
  'title',
  'type',
  'startTime',
  'endTime',
  'status',
  'priority',
  'linkedWorkflow',
  'linkedObject',
  'requiresHumanAttendance',
  'recommendedPreparation',
  'location',
  'meetingMode'
];

const requiredExecutiveOfficeFields = [
  'id',
  'executiveId',
  'executiveName',
  'executiveRole',
  'department',
  'status',
  'healthScore',
  'currentFocus',
  'executiveBriefing',
  'todaysSummary',
  'currentPriorities',
  'itemsRequiringCeoAttention',
  'recommendedActions',
  'estimatedCeoReviewTime',
  'departmentHealth',
  'kpis',
  'currentProjects',
  'currentCapabilities',
  'currentPrograms',
  'liveEnterpriseObjects',
  'knowledgeAssets',
  'workflows',
  'recentEvents',
  'recentActivityTimeline',
  'departmentPortfolio',
  'approvalsWaiting',
  'messages',
  'meetings',
  'calendar',
  'temporaryAgents',
  'permanentAgents',
  'availableActions',
  'specificWidgets',
  'businessValue',
  'liveStatus'
];

const expectedExecutiveOfficeActions = [
  'Inspect Enterprise Object',
  'Review Knowledge Asset',
  'Review Workflow Status',
  'Prepare Executive Assignment (display only)',
  'Request Executive Review (display only)',
  'Prepare Review Session (future capability)',
  'Prepare Executive Briefing (future capability)'
];

let server = null;
let serverOutput = '';
let serverExit = new Promise(() => {});

async function isBackendAlreadyRunning() {
  try {
    const response = await fetch(`${baseUrl}/api/status`);
    return response.ok;
  } catch {
    return false;
  }
}

if (!(await isBackendAlreadyRunning())) {
  server = spawn(process.execPath, ['src/server.js'], {
    cwd: new URL('..', import.meta.url),
    env: {
      ...process.env,
      HOST: host,
      PORT: port
    },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  server.stdout.on('data', (chunk) => {
    serverOutput += chunk.toString();
  });

  server.stderr.on('data', (chunk) => {
    serverOutput += chunk.toString();
  });

  serverExit = new Promise((resolve) => {
    server.on('exit', (code, signal) => {
      resolve({ code, signal });
    });
  });
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function requestJson(path) {
  const url = `${baseUrl}${path}`;

  for (let attempt = 0; attempt < 20; attempt += 1) {
    if (server && server.exitCode !== null) {
      throw new Error(`Server exited before responding. Output: ${serverOutput.trim()}`);
    }

    try {
      const response = await fetch(url);
      const body = await response.json();

      return { body, response, url };
    } catch {
      await wait(150);
    }
  }

  throw new Error(`Could not reach ${url}`);
}

async function postJson(path, body) {
  const url = `${baseUrl}${path}`;
  const response = await fetch(url, {
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST'
  });
  const responseBody = await response.json();

  return { body: responseBody, response, url };
}

async function requestRaw(path) {
  const url = `${baseUrl}${path}`;
  const response = await fetch(url);

  return { response, url };
}

function assertOk({ response, url }) {
  if (!response.ok) {
    throw new Error(`Expected 2xx response from ${url}, received ${response.status}`);
  }
}

function assertEqual(actual, expected, label) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`${label} mismatch. Expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`);
  }
}

function assertSameMembers(actual, expected, label) {
  assertEqual([...actual].sort(), [...expected].sort(), label);
}

async function readBackupStatus() {
  try {
    return JSON.parse(await readFile(new URL('../../backups/backup-status.json', import.meta.url), 'utf8'));
  } catch {
    return null;
  }
}

function assertEnterpriseObject(enterpriseObject) {
  for (const field of requiredObjectFields) {
    if (!(field in enterpriseObject)) {
      throw new Error(`Enterprise Object ${enterpriseObject.id ?? 'unknown'} is missing ${field}`);
    }
  }

  if (!Array.isArray(enterpriseObject.linkedObjects)) {
    throw new Error(`Enterprise Object ${enterpriseObject.id} linkedObjects must be an array`);
  }

  assertLiveStatus(enterpriseObject.id, enterpriseObject.liveStatus);
}

function assertLiveStatus(objectId, liveStatus) {
  if (!liveStatus || typeof liveStatus !== 'object') {
    throw new Error(`Enterprise Object ${objectId} liveStatus must be an object`);
  }

  for (const field of requiredLiveStatusFields) {
    if (!(field in liveStatus)) {
      throw new Error(`Enterprise Object ${objectId} liveStatus is missing ${field}`);
    }
  }

  if (!validLiveStatuses.includes(liveStatus.status)) {
    throw new Error(`Enterprise Object ${objectId} liveStatus status is invalid: ${liveStatus.status}`);
  }

  if (liveStatus.operationalStatus !== liveStatus.status) {
    throw new Error(`Enterprise Object ${objectId} liveStatus operationalStatus must match status`);
  }

  if (!validLiveStatuses.includes(liveStatus.operationalStatus)) {
    throw new Error(
      `Enterprise Object ${objectId} liveStatus operationalStatus is invalid: ${liveStatus.operationalStatus}`
    );
  }

  if (!validLifecycleStatuses.includes(liveStatus.lifecycleStatus)) {
    throw new Error(
      `Enterprise Object ${objectId} liveStatus lifecycleStatus is invalid: ${liveStatus.lifecycleStatus}`
    );
  }

  if (!Number.isInteger(liveStatus.healthScore) || liveStatus.healthScore < 0 || liveStatus.healthScore > 100) {
    throw new Error(`Enterprise Object ${objectId} liveStatus healthScore must be an integer from 0 to 100`);
  }

  if (!Number.isInteger(liveStatus.progress) || liveStatus.progress < 0 || liveStatus.progress > 100) {
    throw new Error(`Enterprise Object ${objectId} liveStatus progress must be an integer from 0 to 100`);
  }

  if (typeof liveStatus.summary !== 'string' || liveStatus.summary.length === 0) {
    throw new Error(`Enterprise Object ${objectId} liveStatus summary must be a non-empty string`);
  }

  if (typeof liveStatus.lastActivity !== 'string' || liveStatus.lastActivity.length === 0) {
    throw new Error(`Enterprise Object ${objectId} liveStatus lastActivity must be a non-empty string`);
  }

  if (typeof liveStatus.requiresAttention !== 'boolean') {
    throw new Error(`Enterprise Object ${objectId} liveStatus requiresAttention must be a boolean`);
  }

  if (!validAttentionLevels.includes(liveStatus.attentionLevel)) {
    throw new Error(`Enterprise Object ${objectId} liveStatus attentionLevel is invalid: ${liveStatus.attentionLevel}`);
  }

  if (liveStatus.attentionLevel === 'None') {
    throw new Error(`Enterprise Object ${objectId} liveStatus attentionLevel must use executive-ready status language`);
  }

  if (typeof liveStatus.recommendedAction !== 'string' || liveStatus.recommendedAction.length === 0) {
    throw new Error(`Enterprise Object ${objectId} liveStatus recommendedAction must be a non-empty string`);
  }

  if (!Array.isArray(liveStatus.availableActions) || liveStatus.availableActions.length === 0) {
    throw new Error(`Enterprise Object ${objectId} liveStatus availableActions must be a non-empty array`);
  }
}

function assertAgent(agent) {
  for (const field of requiredAgentFields) {
    if (!(field in agent)) {
      throw new Error(`Agent ${agent.id ?? 'unknown'} is missing ${field}`);
    }
  }

  if (!Number.isInteger(agent.progress) || agent.progress < 0 || agent.progress > 100) {
    throw new Error(`Agent ${agent.id} progress must be an integer from 0 to 100`);
  }

  if (!Array.isArray(agent.capabilities)) {
    throw new Error(`Agent ${agent.id} capabilities must be an array`);
  }

  if (agent.reportsTo !== 'Chief Technology Officer') {
    throw new Error(`Agent ${agent.id} must report to the Chief Technology Officer`);
  }

  if (!Array.isArray(agent.responsibilities) || agent.responsibilities.length === 0) {
    throw new Error(`Agent ${agent.id} responsibilities must be a non-empty array`);
  }

  if (
    !agent.executiveMetadata ||
    agent.executiveMetadata.leadershipTeam !== 'EOS Executive Leadership Team' ||
    agent.executiveMetadata.reportingLine !== 'Chief Technology Officer'
  ) {
    throw new Error(`Agent ${agent.id} must include EOS Executive Leadership Team metadata`);
  }

  if (!Array.isArray(agent.executiveMetadata.directiveIds) || !agent.executiveMetadata.directiveIds.includes('EOS-ORG-DIR-002')) {
    throw new Error(`Agent ${agent.id} must reference EOS-ORG-DIR-002 in executive metadata`);
  }
}

function assertKnowledgeObject(knowledgeObject) {
  for (const field of requiredKnowledgeFields) {
    if (!(field in knowledgeObject)) {
      throw new Error(`Knowledge Object ${knowledgeObject.id ?? 'unknown'} is missing ${field}`);
    }
  }

  if (!Array.isArray(knowledgeObject.linkedObjects)) {
    throw new Error(`Knowledge Object ${knowledgeObject.id} linkedObjects must be an array`);
  }
}

function assertAgentKnowledgeObject(knowledgeObject) {
  for (const field of requiredAgentKnowledgeObjectFields) {
    if (!(field in knowledgeObject)) {
      throw new Error(`Agent Knowledge Object ${knowledgeObject.id ?? 'unknown'} is missing ${field}`);
    }
  }

  if (!Number.isInteger(knowledgeObject.progress) || knowledgeObject.progress < 0 || knowledgeObject.progress > 100) {
    throw new Error(`Agent Knowledge Object ${knowledgeObject.id} progress must be an integer from 0 to 100`);
  }

  if (!validLifecycleStatuses.includes(knowledgeObject.lifecycleStatus)) {
    throw new Error(`Agent Knowledge Object ${knowledgeObject.id} lifecycleStatus is invalid`);
  }

  for (const field of [
    'relatedCapabilities',
    'relatedEnterpriseObjects',
    'relatedWorkflows',
    'relatedEvents',
    'tags',
    'linkedDocuments'
  ]) {
    if (!Array.isArray(knowledgeObject[field])) {
      throw new Error(`Agent Knowledge Object ${knowledgeObject.id} ${field} must be an array`);
    }
  }

  if (typeof knowledgeObject.patentPotential !== 'boolean') {
    throw new Error(`Agent Knowledge Object ${knowledgeObject.id} patentPotential must be a boolean`);
  }

  if (typeof knowledgeObject.investorReady !== 'boolean') {
    throw new Error(`Agent Knowledge Object ${knowledgeObject.id} investorReady must be a boolean`);
  }

  if (typeof knowledgeObject.publicationReady !== 'boolean') {
    throw new Error(`Agent Knowledge Object ${knowledgeObject.id} publicationReady must be a boolean`);
  }

  if (!knowledgeObject.previewContent || typeof knowledgeObject.previewContent !== 'object') {
    throw new Error(`Agent Knowledge Object ${knowledgeObject.id} previewContent must be an object`);
  }

  for (const field of [
    'executiveSummary',
    'coreArgument',
    'researchQuestions',
    'commercialRelevance',
    'relatedEOSCapability',
    'nextDraftingStep'
  ]) {
    if (!(field in knowledgeObject.previewContent)) {
      throw new Error(`Agent Knowledge Object ${knowledgeObject.id} previewContent is missing ${field}`);
    }
  }

  if (!Array.isArray(knowledgeObject.previewContent.researchQuestions)) {
    throw new Error(`Agent Knowledge Object ${knowledgeObject.id} previewContent researchQuestions must be an array`);
  }

  assertLiveStatus(knowledgeObject.id, knowledgeObject.liveStatus);
}

function assertKnowledgeRepository(repository) {
  for (const field of [
    'id',
    'agentId',
    'agentName',
    'role',
    'status',
    'knowledgeObjectCount',
    'researchProjectCount',
    'publicationReadyCount',
    'investorReadyCount',
    'patentOpportunityCount',
    'recentActivity',
    'attentionLevel',
    'knowledgeObjects',
    'liveStatus'
  ]) {
    if (!(field in repository)) {
      throw new Error(`Agent Knowledge Repository ${repository.id ?? 'unknown'} is missing ${field}`);
    }
  }

  if (!Array.isArray(repository.knowledgeObjects)) {
    throw new Error(`Agent Knowledge Repository ${repository.id} knowledgeObjects must be an array`);
  }

  if (repository.attentionLevel === 'None') {
    throw new Error(`Agent Knowledge Repository ${repository.id} must use executive-ready attention language`);
  }

  assertLiveStatus(repository.id, repository.liveStatus);

  for (const knowledgeObject of repository.knowledgeObjects) {
    assertAgentKnowledgeObject(knowledgeObject);
  }
}

function assertPmo(pmo) {
  for (const field of requiredPmoFields) {
    if (!(field in pmo)) {
      throw new Error(`EOS PMO is missing ${field}`);
    }
  }

  if (pmo.id !== 'EOS-PMO') {
    throw new Error(`Expected EOS-PMO id, received ${pmo.id}`);
  }

  if (pmo.owner !== 'CTO') {
    throw new Error('EOS-PMO owner must be CTO');
  }

  if (!Array.isArray(pmo.responsibilities) || pmo.responsibilities.length === 0) {
    throw new Error('EOS PMO responsibilities must be a non-empty array');
  }

  assertLiveStatus(pmo.id, pmo.liveStatus);
}

function assertRoadmapProgram(program) {
  for (const field of [
    'id',
    'name',
    'objectives',
    'milestones',
    'capabilities',
    'progress',
    'dependencies',
    'executiveOwner',
    'businessImpact',
    'strategicObjective',
    'businessPlanAlignment',
    'governanceApprovalStatus',
    'investorRelevance',
    'enterpriseValueContribution',
    'secondBalanceSheetImpact'
  ]) {
    if (!(field in program)) {
      throw new Error(`Roadmap program ${program.id ?? 'unknown'} is missing ${field}`);
    }
  }

  for (const field of ['objectives', 'milestones', 'capabilities', 'dependencies']) {
    if (!Array.isArray(program[field])) {
      throw new Error(`Roadmap program ${program.id} ${field} must be an array`);
    }
  }

  if (!Number.isInteger(program.progress) || program.progress < 0 || program.progress > 100) {
    throw new Error(`Roadmap program ${program.id} progress must be an integer from 0 to 100`);
  }
}

function assertRoadmapCapability(capability) {
  for (const field of [
    'id',
    'name',
    'program',
    'phase',
    'milestone',
    'owner',
    'businessImpact',
    'researchImpact',
    'investorImpact',
    'relatedEnterpriseObjects',
    'relatedKnowledgeObjects'
  ]) {
    if (!(field in capability)) {
      throw new Error(`Roadmap capability ${capability.id ?? 'unknown'} is missing ${field}`);
    }
  }

  if (!expectedProgramNames.includes(capability.program)) {
    throw new Error(`Roadmap capability ${capability.id} references unknown program ${capability.program}`);
  }

  for (const field of ['relatedEnterpriseObjects', 'relatedKnowledgeObjects']) {
    if (!Array.isArray(capability[field])) {
      throw new Error(`Roadmap capability ${capability.id} ${field} must be an array`);
    }
  }
}

function assertMasterRoadmap(roadmap) {
  for (const field of requiredRoadmapFields) {
    if (!(field in roadmap)) {
      throw new Error(`EOS Master Roadmap is missing ${field}`);
    }
  }

  if (roadmap.id !== 'EOS-MASTER-ROADMAP') {
    throw new Error(`Expected EOS-MASTER-ROADMAP id, received ${roadmap.id}`);
  }

  if (roadmap.owner !== 'EOS PMO') {
    throw new Error('EOS Master Roadmap owner must be EOS PMO');
  }

  for (const field of [
    'strategicObjectives',
    'programs',
    'phases',
    'milestones',
    'capabilities',
    'dependencies',
    'risks',
    'upcomingMilestones',
    'availableActions'
  ]) {
    if (!Array.isArray(roadmap[field]) || roadmap[field].length === 0) {
      throw new Error(`EOS Master Roadmap ${field} must be a non-empty array`);
    }
  }

  if (!Number.isInteger(roadmap.progress) || roadmap.progress < 0 || roadmap.progress > 100) {
    throw new Error('EOS Master Roadmap progress must be an integer from 0 to 100');
  }

  if (!Number.isInteger(roadmap.health) || roadmap.health < 0 || roadmap.health > 100) {
    throw new Error('EOS Master Roadmap health must be an integer from 0 to 100');
  }

  const actualProgramNames = roadmap.programs.map((program) => program.name);
  assertEqual(actualProgramNames, expectedProgramNames, 'EOS Master Roadmap program names');

  for (const program of roadmap.programs) {
    assertRoadmapProgram(program);
  }

  for (const capability of roadmap.capabilities) {
    assertRoadmapCapability(capability);
  }

  assertLiveStatus(roadmap.id, roadmap.liveStatus);
}

function assertCeoCockpit(cockpit) {
  for (const field of requiredCeoCockpitFields) {
    if (!(field in cockpit)) {
      throw new Error(`CEO Cockpit is missing ${field}`);
    }
  }

  if (cockpit.platformVersion !== expectedStatus.version) {
    throw new Error(`CEO Cockpit platformVersion must be ${expectedStatus.version}`);
  }

  if (cockpit.currentCapability !== 'EOS-CAP-0033') {
    throw new Error('CEO Cockpit currentCapability must be EOS-CAP-0033');
  }

  if (!Number.isInteger(cockpit.platformHealth) || cockpit.platformHealth < 0 || cockpit.platformHealth > 100) {
    throw new Error('CEO Cockpit platformHealth must be an integer from 0 to 100');
  }
}

function assertExecutiveProfile(profile) {
  for (const field of requiredExecutiveProfileFields) {
    if (!(field in profile)) {
      throw new Error(`Executive profile ${profile.id ?? 'unknown'} is missing ${field}`);
    }
  }

  if (!Number.isInteger(profile.healthScore) || profile.healthScore < 0 || profile.healthScore > 100) {
    throw new Error(`Executive profile ${profile.id} healthScore must be an integer from 0 to 100`);
  }

  if (!Number.isInteger(profile.progress) || profile.progress < 0 || profile.progress > 100) {
    throw new Error(`Executive profile ${profile.id} progress must be an integer from 0 to 100`);
  }

  if (!validAttentionLevels.includes(profile.attentionLevel)) {
    throw new Error(`Executive profile ${profile.id} attentionLevel is invalid: ${profile.attentionLevel}`);
  }

  if (typeof profile.requiresAttention !== 'boolean') {
    throw new Error(`Executive profile ${profile.id} requiresAttention must be boolean`);
  }

  for (const field of ['responsibilities', 'availableActions', 'linkedEnterpriseObjects', 'linkedPrograms']) {
    if (!Array.isArray(profile[field]) || profile[field].length === 0) {
      throw new Error(`Executive profile ${profile.id} ${field} must be a non-empty array`);
    }
  }

  for (const action of expectedExecutiveActionLabels) {
    if (!profile.availableActions.includes(action)) {
      throw new Error(`Executive profile ${profile.id} must include action ${action}`);
    }
  }

  if (profile.id.startsWith('EOS-AGENT-') && !profile.linkedEnterpriseObjects.includes(profile.id)) {
    throw new Error(`Executive profile ${profile.id} must link to its Agent Enterprise Object`);
  }
}

function assertExecutiveCouncilPayload(payload) {
  if (payload.capability !== 'EOS-CAP-0021') {
    throw new Error(`Expected EOS-CAP-0021 capability, received ${payload.capability}`);
  }

  for (const field of ['council', 'headquarters', 'ceoCockpit', 'count', 'executives']) {
    if (!(field in payload)) {
      throw new Error(`Executive Council payload is missing ${field}`);
    }
  }

  if (payload.count !== expectedExecutiveProfileIds.length) {
    throw new Error(`Expected ${expectedExecutiveProfileIds.length} executives, received ${payload.count}`);
  }

  if (!Array.isArray(payload.executives)) {
    throw new Error('Executive Council payload executives must be an array');
  }

  assertLiveStatus(payload.council.id, payload.council.liveStatus);
  assertLiveStatus(payload.headquarters.id, payload.headquarters.liveStatus);
  assertCeoCockpit(payload.ceoCockpit);

  const actualExecutiveIds = payload.executives.map((profile) => profile.id);
  assertEqual(actualExecutiveIds, expectedExecutiveProfileIds, 'Executive profile ids');

  for (const profile of payload.executives) {
    assertExecutiveProfile(profile);
  }
}

function assertAuditTrailEntry(actionId, entry) {
  for (const field of requiredAuditTrailFields) {
    if (!(field in entry)) {
      throw new Error(`Executive Action ${actionId} auditTrail entry is missing ${field}`);
    }
  }

  for (const field of requiredAuditTrailFields) {
    if (typeof entry[field] !== 'string' || entry[field].length === 0) {
      throw new Error(`Executive Action ${actionId} auditTrail ${field} must be a non-empty string`);
    }
  }
}

function assertExecutiveAction(action) {
  for (const field of requiredExecutiveActionFields) {
    if (!(field in action)) {
      throw new Error(`Executive Action ${action.id ?? 'unknown'} is missing ${field}`);
    }
  }

  if (!expectedExecutiveActionLabels.includes(action.label)) {
    throw new Error(`Executive Action ${action.id} label is invalid: ${action.label}`);
  }

  if (!expectedExecutiveProfileIds.includes(action.sourceExecutive)) {
    throw new Error(`Executive Action ${action.id} sourceExecutive is invalid: ${action.sourceExecutive}`);
  }

  if (!validExecutiveActionStatuses.includes(action.status)) {
    throw new Error(`Executive Action ${action.id} status is invalid: ${action.status}`);
  }

  if (!validApprovalStatuses.includes(action.approvalStatus)) {
    throw new Error(`Executive Action ${action.id} approvalStatus is invalid: ${action.approvalStatus}`);
  }

  if (!validRiskLevels.includes(action.riskLevel)) {
    throw new Error(`Executive Action ${action.id} riskLevel is invalid: ${action.riskLevel}`);
  }

  if (typeof action.approvalRequired !== 'boolean') {
    throw new Error(`Executive Action ${action.id} approvalRequired must be boolean`);
  }

  if (action.linkedWorkflow !== 'EOS-WF-EXECUTIVE-ACTION-GOVERNANCE') {
    throw new Error(`Executive Action ${action.id} must link to EOS-WF-EXECUTIVE-ACTION-GOVERNANCE`);
  }

  for (const field of ['linkedEvents', 'auditTrail', 'availableDecisionActions']) {
    if (!Array.isArray(action[field]) || action[field].length === 0) {
      throw new Error(`Executive Action ${action.id} ${field} must be a non-empty array`);
    }
  }

  for (const eventId of action.linkedEvents) {
    if (!expectedEventIds.includes(eventId)) {
      throw new Error(`Executive Action ${action.id} linkedEvents includes unknown event ${eventId}`);
    }
  }

  for (const entry of action.auditTrail) {
    assertAuditTrailEntry(action.id, entry);
  }

  if (action.executionEnabled !== false || action.executionStatus !== 'Disabled') {
    throw new Error(`Executive Action ${action.id} must be marked non-executable`);
  }

  if (typeof action.recommendedNextStep !== 'string' || action.recommendedNextStep.length === 0) {
    throw new Error(`Executive Action ${action.id} recommendedNextStep must be a non-empty string`);
  }
}

function assertExecutiveActionsPayload(payload) {
  if (payload.capability !== 'EOS-CAP-0022') {
    throw new Error(`Expected EOS-CAP-0022 capability, received ${payload.capability}`);
  }

  for (const field of ['framework', 'approvalQueue', 'safetyNotice', 'executionEnabled', 'count', 'summary', 'actions']) {
    if (!(field in payload)) {
      throw new Error(`Executive Actions payload is missing ${field}`);
    }
  }

  if (payload.executionEnabled !== false || !payload.safetyNotice.includes('Execution is disabled')) {
    throw new Error('Executive Actions payload must clearly mark execution as disabled');
  }

  assertLiveStatus(payload.framework.id, payload.framework.liveStatus);
  assertLiveStatus(payload.approvalQueue.id, payload.approvalQueue.liveStatus);

  const expectedActionCount = expectedExecutiveProfileIds.length * expectedExecutiveActionLabels.length;

  if (payload.count !== expectedActionCount) {
    throw new Error(`Expected ${expectedActionCount} Executive Actions, received ${payload.count}`);
  }

  if (!Array.isArray(payload.actions)) {
    throw new Error('Executive Actions payload actions must be an array');
  }

  for (const field of ['pendingApproval', 'approved', 'rejected', 'highRisk', 'recentlyUpdated']) {
    if (!(field in payload.summary)) {
      throw new Error(`Executive Actions summary is missing ${field}`);
    }
  }

  if (payload.summary.pendingApproval !== 36) {
    throw new Error(`Expected 36 pending approval actions, received ${payload.summary.pendingApproval}`);
  }

  if (payload.summary.approved !== expectedExecutiveProfileIds.length) {
    throw new Error(`Expected ${expectedExecutiveProfileIds.length} approved actions`);
  }

  if (payload.summary.rejected !== expectedExecutiveProfileIds.length) {
    throw new Error(`Expected ${expectedExecutiveProfileIds.length} rejected actions`);
  }

  if (payload.summary.highRisk !== expectedExecutiveProfileIds.length) {
    throw new Error(`Expected ${expectedExecutiveProfileIds.length} high risk actions`);
  }

  if (!Array.isArray(payload.summary.recentlyUpdated) || payload.summary.recentlyUpdated.length !== 8) {
    throw new Error('Executive Actions summary must include 8 recently updated actions');
  }

  for (const action of payload.actions) {
    assertExecutiveAction(action);
  }

  for (const profileId of expectedExecutiveProfileIds) {
    const profileActionLabels = payload.actions
      .filter((action) => action.sourceExecutive === profileId)
      .map((action) => action.label);

    assertEqual(profileActionLabels, expectedExecutiveActionLabels, `${profileId} Executive Action labels`);
  }
}

function assertPendingApprovalPayload(payload) {
  if (payload.capability !== 'EOS-CAP-0022') {
    throw new Error(`Expected EOS-CAP-0022 capability, received ${payload.capability}`);
  }

  if (payload.executionEnabled !== false || !payload.safetyNotice.includes('Execution is disabled')) {
    throw new Error('Pending approval payload must clearly mark execution as disabled');
  }

  if (payload.count !== 36) {
    throw new Error(`Expected 36 pending approval actions, received ${payload.count}`);
  }

  if (!Array.isArray(payload.actions)) {
    throw new Error('Pending approval payload actions must be an array');
  }

  for (const action of payload.actions) {
    assertExecutiveAction(action);

    if (!action.approvalRequired || !['Pending', 'Escalated'].includes(action.approvalStatus)) {
      throw new Error(`Pending approval action ${action.id} must require pending or escalated approval`);
    }
  }
}

function assertAdminAction(action) {
  for (const field of requiredAdminActionFields) {
    if (!(field in action)) {
      throw new Error(`Admin Action ${action.id ?? 'unknown'} is missing ${field}`);
    }
  }

  if (!expectedAdminActionIds.includes(action.id)) {
    throw new Error(`Unexpected Admin Action id ${action.id}`);
  }

  if (!validRiskLevels.includes(action.riskLevel)) {
    throw new Error(`Admin Action ${action.id} riskLevel is invalid`);
  }

  if (!validAdminActionStatuses.includes(action.status)) {
    throw new Error(`Admin Action ${action.id} status is invalid: ${action.status}`);
  }

  if (!validAdminExecutionModes.includes(action.executionMode)) {
    throw new Error(`Admin Action ${action.id} executionMode is invalid`);
  }

  for (const field of ['requiresApproval', 'backupRequired', 'restoreValidationRequired', 'auditRequired']) {
    if (typeof action[field] !== 'boolean') {
      throw new Error(`Admin Action ${action.id} ${field} must be boolean`);
    }
  }

  if (action.executionMode === 'Governed Display Only' && !action.requiresApproval) {
    throw new Error(`Governed Admin Action ${action.id} must require approval`);
  }
}

function assertActionGovernanceRecord(record) {
  for (const field of requiredActionGovernanceFields) {
    if (!(field in record)) {
      throw new Error(`Action Governance record ${record.id ?? 'unknown'} is missing ${field}`);
    }
  }

  if (!validAdminActionStatuses.includes(record.status)) {
    throw new Error(`Action Governance record ${record.id} status is invalid`);
  }

  if (!validApprovalStatuses.includes(record.approvalStatus)) {
    throw new Error(`Action Governance record ${record.id} approvalStatus is invalid`);
  }

  if (!validRiskLevels.includes(record.riskLevel)) {
    throw new Error(`Action Governance record ${record.id} riskLevel is invalid`);
  }

  if (record.linkedWorkflow !== 'EOS-WF-ACTION-AUTHORIZATION') {
    throw new Error(`Action Governance record ${record.id} must link to EOS-WF-ACTION-AUTHORIZATION`);
  }

  for (const field of ['preconditions', 'auditTrail', 'linkedEvents']) {
    if (!Array.isArray(record[field]) || record[field].length === 0) {
      throw new Error(`Action Governance record ${record.id} ${field} must be a non-empty array`);
    }
  }

  for (const entry of record.auditTrail) {
    assertAuditTrailEntry(record.id, entry);
  }
}

function assertPlatformPayload(payload) {
  if (payload.capability !== 'EOS-CAP-0027') {
    throw new Error(`Expected EOS-CAP-0027 platform capability, received ${payload.capability}`);
  }

  for (const field of ['operations', 'status', 'administration', 'navigation', 'aiWorkforce']) {
    if (!(field in payload)) {
      throw new Error(`Platform payload is missing ${field}`);
    }
  }

  if (payload.operations.currentVersion !== expectedStatus.version) {
    throw new Error(`Platform operations currentVersion must be ${expectedStatus.version}`);
  }

  if (payload.status.version !== expectedStatus.version) {
    throw new Error(`Platform status version must be ${expectedStatus.version}`);
  }

  if (!Array.isArray(payload.navigation) || payload.navigation.length !== 8) {
    throw new Error('Platform navigation must include the 8 Mission Control domains');
  }
}

function assertPlatformAdminPayload(payload) {
  if (payload.capability !== 'EOS-CAP-0027') {
    throw new Error(`Expected EOS-CAP-0027 platform admin capability, received ${payload.capability}`);
  }

  for (const field of [
    'safetyNotice',
    'platformStatus',
    'currentVersion',
    'environment',
    'backendStatus',
    'frontendStatus',
    'apiHealth',
    'storageHealth',
    'backupHealth',
    'latestBackup',
    'restoreValidationStatus',
    'releaseVersion',
    'gitStatus',
    'dataStoreStatus',
    'registeredServices',
    'activeApis',
    'runningUrls',
    'systemWarnings',
    'recommendedAdminActions',
    'adminActions',
    'authorizationPolicies',
    'actionGovernance'
  ]) {
    if (!(field in payload)) {
      throw new Error(`Platform Admin payload is missing ${field}`);
    }
  }

  if (!payload.safetyNotice.includes('Execution is disabled')) {
    throw new Error('Platform Admin payload must clearly state execution is disabled');
  }

  if (payload.currentVersion !== expectedStatus.version) {
    throw new Error(`Platform Admin currentVersion must be ${expectedStatus.version}`);
  }

  if (!Array.isArray(payload.adminActions) || payload.adminActions.length !== expectedAdminActionIds.length) {
    throw new Error(`Expected ${expectedAdminActionIds.length} Platform Admin actions`);
  }

  for (const action of payload.adminActions) {
    assertAdminAction(action);
  }

  if (!Array.isArray(payload.actionGovernance) || payload.actionGovernance.length !== expectedAdminActionIds.length) {
    throw new Error('Platform Admin actionGovernance must include one record per admin action');
  }

  for (const record of payload.actionGovernance) {
    assertActionGovernanceRecord(record);
  }
}

function assertAgentMessage(message) {
  for (const field of requiredAgentMessageFields) {
    if (!(field in message)) {
      throw new Error(`Agent Message ${message.id ?? 'unknown'} is missing ${field}`);
    }
  }

  if (!expectedAgentIds.includes(message.linkedAgent)) {
    throw new Error(`Agent Message ${message.id} linkedAgent is invalid`);
  }

  if (typeof message.requiresResponse !== 'boolean') {
    throw new Error(`Agent Message ${message.id} requiresResponse must be boolean`);
  }

  if (!Array.isArray(message.auditTrail) || message.auditTrail.length === 0) {
    throw new Error(`Agent Message ${message.id} auditTrail must be a non-empty array`);
  }
}

function assertAgentActivityRecord(record) {
  for (const field of requiredAgentActivityFields) {
    if (!(field in record)) {
      throw new Error(`Agent Activity ${record.id ?? 'unknown'} is missing ${field}`);
    }
  }

  if (!expectedAgentIds.includes(record.agentId)) {
    throw new Error(`Agent Activity ${record.id} agentId is invalid`);
  }

  if (!Number.isInteger(record.progress) || record.progress < 0 || record.progress > 100) {
    throw new Error(`Agent Activity ${record.id} progress must be an integer from 0 to 100`);
  }

  if (typeof record.requiresHumanAttention !== 'boolean') {
    throw new Error(`Agent Activity ${record.id} requiresHumanAttention must be boolean`);
  }

  if (!validAttentionLevels.includes(record.attentionLevel)) {
    throw new Error(`Agent Activity ${record.id} attentionLevel is invalid`);
  }
}

function assertAttentionItem(item) {
  for (const field of requiredAttentionFields) {
    if (!(field in item)) {
      throw new Error(`Agent Attention item ${item.id ?? 'unknown'} is missing ${field}`);
    }
  }

  if (!validAttentionLevels.includes(item.attentionLevel)) {
    throw new Error(`Agent Attention item ${item.id} attentionLevel is invalid`);
  }

  if (!Array.isArray(item.availableActions) || item.availableActions.length === 0) {
    throw new Error(`Agent Attention item ${item.id} availableActions must be a non-empty array`);
  }
}

function assertCalendarEvent(event) {
  for (const field of requiredCalendarFields) {
    if (!(field in event)) {
      throw new Error(`Agent Calendar event ${event.id ?? 'unknown'} is missing ${field}`);
    }
  }

  if (!expectedAgentIds.includes(event.agentId)) {
    throw new Error(`Agent Calendar event ${event.id} agentId is invalid`);
  }

  if (typeof event.requiresHumanAttendance !== 'boolean') {
    throw new Error(`Agent Calendar event ${event.id} requiresHumanAttendance must be boolean`);
  }
}

function assertExecutiveOffice(office) {
  for (const field of requiredExecutiveOfficeFields) {
    if (!(field in office)) {
      throw new Error(`Executive Office ${office.id ?? 'unknown'} is missing ${field}`);
    }
  }

  if (!expectedExecutiveProfileIds.includes(office.executiveId)) {
    throw new Error(`Executive Office ${office.id} executiveId is invalid: ${office.executiveId}`);
  }

  for (const field of [
    'currentPriorities',
    'itemsRequiringCeoAttention',
    'recommendedActions',
    'kpis',
    'currentProjects',
    'currentCapabilities',
    'currentPrograms',
    'liveEnterpriseObjects',
    'knowledgeAssets',
    'workflows',
    'recentEvents',
    'recentActivityTimeline',
    'departmentPortfolio',
    'permanentAgents',
    'availableActions',
    'specificWidgets'
  ]) {
    if (!Array.isArray(office[field]) || office[field].length === 0) {
      throw new Error(`Executive Office ${office.id} ${field} must be a non-empty array`);
    }
  }

  for (const action of expectedExecutiveOfficeActions) {
    if (!office.availableActions.includes(action)) {
      throw new Error(`Executive Office ${office.id} must include action ${action}`);
    }
  }

  for (const placeholder of ['messages', 'meetings', 'calendar', 'temporaryAgents']) {
    if (!office[placeholder] || office[placeholder].status !== 'Future Capability') {
      throw new Error(`Executive Office ${office.id} ${placeholder} must be a Future Capability`);
    }
  }

  for (const metric of office.kpis) {
    for (const field of ['label', 'value', 'trend']) {
      if (!(field in metric)) {
        throw new Error(`Executive Office ${office.id} KPI is missing ${field}`);
      }
    }
  }

  for (const widget of office.specificWidgets) {
    if (!widget.title || !Array.isArray(widget.metrics) || widget.metrics.length === 0) {
      throw new Error(`Executive Office ${office.id} specificWidgets must include title and metrics`);
    }
  }

  if (!Number.isInteger(office.healthScore) || office.healthScore < 0 || office.healthScore > 100) {
    throw new Error(`Executive Office ${office.id} healthScore must be an integer from 0 to 100`);
  }

  if (!Number.isInteger(office.departmentHealth) || office.departmentHealth < 0 || office.departmentHealth > 100) {
    throw new Error(`Executive Office ${office.id} departmentHealth must be an integer from 0 to 100`);
  }

  assertLiveStatus(office.id, office.liveStatus);
}

function assertExecutiveOfficesPayload(payload) {
  if (payload.capability !== 'EOS-CAP-0023') {
    throw new Error(`Expected EOS-CAP-0023 capability, received ${payload.capability}`);
  }

  for (const field of ['framework', 'count', 'offices']) {
    if (!(field in payload)) {
      throw new Error(`Executive Offices payload is missing ${field}`);
    }
  }

  if (payload.count !== expectedExecutiveProfileIds.length) {
    throw new Error(`Expected ${expectedExecutiveProfileIds.length} Executive Offices, received ${payload.count}`);
  }

  if (!Array.isArray(payload.offices)) {
    throw new Error('Executive Offices payload offices must be an array');
  }

  assertLiveStatus(payload.framework.id, payload.framework.liveStatus);

  const actualExecutiveIds = payload.offices.map((office) => office.executiveId);
  assertEqual(actualExecutiveIds, expectedExecutiveProfileIds, 'Executive Office executive ids');

  for (const office of payload.offices) {
    assertExecutiveOffice(office);
  }

  const athenaOffice = payload.offices.find((office) => office.executiveId === 'EOS-AGENT-ATHENA');
  if (!athenaOffice.departmentPortfolio.includes('Research Portfolio')) {
    throw new Error('Athena Executive Office must include Research Portfolio');
  }

  const codexOffice = payload.offices.find((office) => office.executiveId === 'EOS-AGENT-CODEX');
  if (!codexOffice.departmentPortfolio.includes('Engineering Dashboard')) {
    throw new Error('Codex Executive Office must include Engineering Dashboard');
  }
}

function assertWorkflow(workflow) {
  for (const field of requiredWorkflowFields) {
    if (!(field in workflow)) {
      throw new Error(`Workflow ${workflow.id ?? 'unknown'} is missing ${field}`);
    }
  }

  if (!Array.isArray(workflow.steps) || workflow.steps.length === 0) {
    throw new Error(`Workflow ${workflow.id} steps must be a non-empty array`);
  }

  if (!Number.isInteger(workflow.progress) || workflow.progress < 0 || workflow.progress > 100) {
    throw new Error(`Workflow ${workflow.id} progress must be an integer from 0 to 100`);
  }

  if (!Array.isArray(workflow.linkedObjects)) {
    throw new Error(`Workflow ${workflow.id} linkedObjects must be an array`);
  }

  if (!Array.isArray(workflow.events) || workflow.events.length === 0) {
    throw new Error(`Workflow ${workflow.id} must emit at least one EOS Event`);
  }

  for (const event of workflow.events) {
    assertWorkflowEvent(event, workflow.id);
  }
}

function assertWorkflowEvent(event, workflowId) {
  for (const field of requiredEventFields) {
    if (!(field in event)) {
      throw new Error(`EOS Event ${event.id ?? 'unknown'} is missing ${field}`);
    }
  }

  if (event.sourceWorkflowId !== workflowId) {
    throw new Error(`EOS Event ${event.id} must be emitted by ${workflowId}`);
  }

  if (event.status !== 'Emitted') {
    throw new Error(`EOS Event ${event.id} must have Emitted status`);
  }
}

try {
  const statusResult = await Promise.race([
    requestJson('/api/status'),
    serverExit.then(({ code, signal }) => {
      throw new Error(
        `Server exited before responding with code ${code ?? 'null'} and signal ${signal ?? 'null'}. Output: ${serverOutput.trim()}`
      );
    })
  ]);

  assertOk(statusResult);
  assertEqual(statusResult.body, expectedStatus, 'Status payload');

  const objectsResult = await requestJson('/api/objects');
  assertOk(objectsResult);

  if (objectsResult.body.capability !== 'EOS-CAP-0003') {
    throw new Error(`Expected EOS-CAP-0003 capability, received ${objectsResult.body.capability}`);
  }

  if (objectsResult.body.count !== expectedObjectIds.length) {
    throw new Error(`Expected ${expectedObjectIds.length} Enterprise Objects, received ${objectsResult.body.count}`);
  }

  if (!Array.isArray(objectsResult.body.objects)) {
    throw new Error('/api/objects response must include an objects array');
  }

  for (const enterpriseObject of objectsResult.body.objects) {
    assertEnterpriseObject(enterpriseObject);
  }

  const actualObjectIds = objectsResult.body.objects.map((enterpriseObject) => enterpriseObject.id);
  assertSameMembers(actualObjectIds, expectedObjectIds, 'Enterprise Object ids');

  const objectsById = new Map(
    objectsResult.body.objects.map((enterpriseObject) => [enterpriseObject.id, enterpriseObject])
  );

  const agentCapabilityObject = objectsById.get('EOS-CAP-0005');
  if (!agentCapabilityObject || agentCapabilityObject.type !== 'Capability') {
    throw new Error('EOS-CAP-0005 must be registered as a Capability Enterprise Object');
  }

  const knowledgeCapabilityObject = objectsById.get('EOS-CAP-0006');
  if (!knowledgeCapabilityObject || knowledgeCapabilityObject.type !== 'Capability') {
    throw new Error('EOS-CAP-0006 must be registered as a Capability Enterprise Object');
  }

  const workflowCapabilityObject = objectsById.get('EOS-CAP-0007');
  if (!workflowCapabilityObject || workflowCapabilityObject.type !== 'Capability') {
    throw new Error('EOS-CAP-0007 must be registered as a Capability Enterprise Object');
  }

  const developmentFoundationObject = objectsById.get('EOS-CAP-0008');
  if (!developmentFoundationObject || developmentFoundationObject.type !== 'Capability') {
    throw new Error('EOS-CAP-0008 must be registered as a Capability Enterprise Object');
  }

  const backupRecoveryObject = objectsById.get('EOS-CAP-0009');
  if (!backupRecoveryObject || backupRecoveryObject.type !== 'Capability') {
    throw new Error('EOS-CAP-0009 must be registered as a Capability Enterprise Object');
  }

  const backupStatus = await readBackupStatus();
  const restoreValidationStatus = backupStatus?.latestRestoreValidationStatus ?? 'Not validated';
  const expectedBackupLiveStatus = restoreValidationStatus === 'Validated' ? 'Green' : 'Amber';

  if (backupRecoveryObject.liveStatus.status !== expectedBackupLiveStatus) {
    throw new Error(`EOS-CAP-0009 liveStatus must be ${expectedBackupLiveStatus}`);
  }

  const sourceControlReleaseObject = objectsById.get('EOS-CAP-0010');
  if (!sourceControlReleaseObject || sourceControlReleaseObject.type !== 'Capability') {
    throw new Error('EOS-CAP-0010 must be registered as a Capability Enterprise Object');
  }

  if (!sourceControlReleaseObject.linkedObjects.includes('EOS-WF-SOURCE-CONTROL-RELEASE')) {
    throw new Error('EOS-CAP-0010 must link to EOS-WF-SOURCE-CONTROL-RELEASE');
  }

  const initialRepositoryBaselineObject = objectsById.get('EOS-CAP-0011');
  if (!initialRepositoryBaselineObject || initialRepositoryBaselineObject.type !== 'Capability') {
    throw new Error('EOS-CAP-0011 must be registered as a Capability Enterprise Object');
  }

  if (!initialRepositoryBaselineObject.linkedObjects.includes('EOS-WF-INITIAL-REPOSITORY-BASELINE')) {
    throw new Error('EOS-CAP-0011 must link to EOS-WF-INITIAL-REPOSITORY-BASELINE');
  }

  const githubReadinessObject = objectsById.get('EOS-CAP-0012');
  if (!githubReadinessObject || githubReadinessObject.type !== 'Capability') {
    throw new Error('EOS-CAP-0012 must be registered as a Capability Enterprise Object');
  }

  for (const linkedObjectId of ['EOS-CAP-0010', 'EOS-CAP-0011', 'EOS-AGENT-CODEX', 'EOS-AGENT-VULCAN']) {
    if (!githubReadinessObject.linkedObjects.includes(linkedObjectId)) {
      throw new Error(`EOS-CAP-0012 must link to ${linkedObjectId}`);
    }
  }

  const googleDriveBackupPreparationObject = objectsById.get('EOS-CAP-0013');
  if (!googleDriveBackupPreparationObject || googleDriveBackupPreparationObject.type !== 'Capability') {
    throw new Error('EOS-CAP-0013 must be registered as a Capability Enterprise Object');
  }

  for (const linkedObjectId of [
    'EOS-CAP-0009',
    'EOS-CAP-0012',
    'EOS-WF-GOOGLE-DRIVE-BACKUP-PREPARATION',
    'EOS-AGENT-CODEX',
    'EOS-AGENT-VULCAN'
  ]) {
    if (!googleDriveBackupPreparationObject.linkedObjects.includes(linkedObjectId)) {
      throw new Error(`EOS-CAP-0013 must link to ${linkedObjectId}`);
    }
  }

  const liveObjectStatusLayerObject = objectsById.get('EOS-CAP-0014');
  if (!liveObjectStatusLayerObject || liveObjectStatusLayerObject.type !== 'Capability') {
    throw new Error('EOS-CAP-0014 must be registered as a Capability Enterprise Object');
  }

  for (const linkedObjectId of [
    'EOS-CAP-0007',
    'EOS-CAP-0009',
    'EOS-WF-LIVE-OBJECT-STATUS-LAYER',
    'EOS-AGENT-CODEX',
    'EOS-AGENT-ARGUS',
    'EOS-AGENT-VULCAN'
  ]) {
    if (!liveObjectStatusLayerObject.linkedObjects.includes(linkedObjectId)) {
      throw new Error(`EOS-CAP-0014 must link to ${linkedObjectId}`);
    }
  }

  const agentKnowledgeRepositoryObject = objectsById.get('EOS-CAP-0015');
  if (!agentKnowledgeRepositoryObject || agentKnowledgeRepositoryObject.type !== 'Capability') {
    throw new Error('EOS-CAP-0015 must be registered as a Capability Enterprise Object');
  }

  for (const linkedObjectId of [
    'EOS-AKR',
    'EOS-CAP-0006',
    'EOS-CAP-0014',
    'EOS-CAP-0016',
    'EOS-WF-KNOWLEDGE-MANAGEMENT',
    'EOS-WF-KNOWLEDGE-ASSET-VIEWER',
    'EOS-ASSET-EXPLORER',
    'EOS-AGENT-ATHENA',
    'EOS-AGENT-HERMES'
  ]) {
    if (!agentKnowledgeRepositoryObject.linkedObjects.includes(linkedObjectId)) {
      throw new Error(`EOS-CAP-0015 must link to ${linkedObjectId}`);
    }
  }

  const knowledgeAssetViewerObject = objectsById.get('EOS-CAP-0016');
  if (!knowledgeAssetViewerObject || knowledgeAssetViewerObject.type !== 'Capability') {
    throw new Error('EOS-CAP-0016 must be registered as a Capability Enterprise Object');
  }

  for (const linkedObjectId of [
    'EOS-AKR',
    'EOS-ASSET-EXPLORER',
    'EOS-WF-KNOWLEDGE-ASSET-VIEWER',
    'RP-001',
    'RP-002',
    'RP-003',
    'RP-004',
    'EOS-AGENT-CODEX',
    'EOS-AGENT-ATHENA',
    'EOS-AGENT-HERMES'
  ]) {
    if (!knowledgeAssetViewerObject.linkedObjects.includes(linkedObjectId)) {
      throw new Error(`EOS-CAP-0016 must link to ${linkedObjectId}`);
    }
  }

  const pmoCapabilityObject = objectsById.get('EOS-CAP-0020');
  if (!pmoCapabilityObject || pmoCapabilityObject.type !== 'Capability') {
    throw new Error('EOS-CAP-0020 must be registered as a Capability Enterprise Object');
  }

  for (const linkedObjectId of [
    'EOS-PMO',
    'EOS-MASTER-ROADMAP',
    'EOS-WF-PROGRAM-MANAGEMENT',
    'EOS-CAP-0007',
    'EOS-CAP-0014',
    'EOS-CAP-0015',
    'EOS-CAP-0016',
    'EOS-AGENT-CODEX',
    'EOS-AGENT-ATHENA',
    'EOS-AGENT-HERMES',
    'EOS-AGENT-ATLAS',
    'EOS-AGENT-MERCURY',
    'EOS-AGENT-ARGUS',
    'EOS-AGENT-VULCAN'
  ]) {
    if (!pmoCapabilityObject.linkedObjects.includes(linkedObjectId)) {
      throw new Error(`EOS-CAP-0020 must link to ${linkedObjectId}`);
    }
  }

  const executiveCouncilCapabilityObject = objectsById.get('EOS-CAP-0021');
  if (!executiveCouncilCapabilityObject || executiveCouncilCapabilityObject.type !== 'Capability') {
    throw new Error('EOS-CAP-0021 must be registered as a Capability Enterprise Object');
  }

  for (const linkedObjectId of [
    'EOS-EXECUTIVE-COUNCIL',
    'EOS-DIGITAL-ENTERPRISE-HEADQUARTERS',
    'EOS-EXECUTIVE-ACTION-FRAMEWORK',
    'EOS-APPROVAL-QUEUE',
    'EOS-EXECUTIVE-OFFICE-FRAMEWORK',
    'EOS-WF-EXECUTIVE-COUNCIL-GOVERNANCE',
    'EOS-WF-EXECUTIVE-ACTION-GOVERNANCE',
    'EOS-WF-EXECUTIVE-OFFICE-MANAGEMENT',
    'EOS-CAP-0022',
    'EOS-CAP-0023',
    'EOS-CAP-0005',
    'EOS-CAP-0020',
    'EOS-PMO',
    'EOS-MASTER-ROADMAP',
    'EOS-AGENT-CODEX',
    'EOS-AGENT-ATHENA',
    'EOS-AGENT-HERMES',
    'EOS-AGENT-ATLAS',
    'EOS-AGENT-MERCURY',
    'EOS-AGENT-ARGUS',
    'EOS-AGENT-VULCAN'
  ]) {
    if (!executiveCouncilCapabilityObject.linkedObjects.includes(linkedObjectId)) {
      throw new Error(`EOS-CAP-0021 must link to ${linkedObjectId}`);
    }
  }

  const executiveActionCapabilityObject = objectsById.get('EOS-CAP-0022');
  if (!executiveActionCapabilityObject || executiveActionCapabilityObject.type !== 'Capability') {
    throw new Error('EOS-CAP-0022 must be registered as a Capability Enterprise Object');
  }

  for (const linkedObjectId of [
    'EOS-EXECUTIVE-ACTION-FRAMEWORK',
    'EOS-APPROVAL-QUEUE',
    'EOS-EXECUTIVE-OFFICE-FRAMEWORK',
    'EOS-WF-EXECUTIVE-ACTION-GOVERNANCE',
    'EOS-WF-EXECUTIVE-OFFICE-MANAGEMENT',
    'EOS-CAP-0021',
    'EOS-CAP-0023',
    'EOS-CAP-0020',
    'EOS-EXECUTIVE-COUNCIL',
    'EOS-DIGITAL-ENTERPRISE-HEADQUARTERS',
    'EOS-PMO',
    'EOS-MASTER-ROADMAP',
    'EOS-AGENT-CODEX',
    'EOS-AGENT-VULCAN'
  ]) {
    if (!executiveActionCapabilityObject.linkedObjects.includes(linkedObjectId)) {
      throw new Error(`EOS-CAP-0022 must link to ${linkedObjectId}`);
    }
  }

  const executiveOfficeCapabilityObject = objectsById.get('EOS-CAP-0023');
  if (!executiveOfficeCapabilityObject || executiveOfficeCapabilityObject.type !== 'Capability') {
    throw new Error('EOS-CAP-0023 must be registered as a Capability Enterprise Object');
  }

  for (const linkedObjectId of [
    'EOS-EXECUTIVE-OFFICE-FRAMEWORK',
    'EOS-WF-EXECUTIVE-OFFICE-MANAGEMENT',
    'EOS-CAP-0021',
    'EOS-CAP-0022',
    'EOS-EXECUTIVE-COUNCIL',
    'EOS-DIGITAL-ENTERPRISE-HEADQUARTERS',
    'EOS-EXECUTIVE-ACTION-FRAMEWORK',
    'EOS-APPROVAL-QUEUE',
    'EOS-PMO',
    'EOS-MASTER-ROADMAP',
    'EOS-AGENT-CODEX',
    'EOS-AGENT-HERMES',
    'EOS-AGENT-ATHENA',
    'EOS-AGENT-ATLAS',
    'EOS-AGENT-MERCURY',
    'EOS-AGENT-ARGUS',
    'EOS-AGENT-VULCAN'
  ]) {
    if (!executiveOfficeCapabilityObject.linkedObjects.includes(linkedObjectId)) {
      throw new Error(`EOS-CAP-0023 must link to ${linkedObjectId}`);
    }
  }

  const akrObject = objectsById.get('EOS-AKR');
  if (!akrObject || akrObject.type !== 'Repository') {
    throw new Error('EOS-AKR must be registered as a Repository Enterprise Object');
  }

  const assetExplorerObject = objectsById.get('EOS-ASSET-EXPLORER');
  if (!assetExplorerObject || assetExplorerObject.type !== 'Application Module') {
    throw new Error('EOS-ASSET-EXPLORER must be registered as an Application Module Enterprise Object');
  }

  if (!assetExplorerObject.linkedObjects.includes('EOS-CAP-0016')) {
    throw new Error('EOS-ASSET-EXPLORER must link to EOS-CAP-0016');
  }

  const pmoObject = objectsById.get('EOS-PMO');
  if (!pmoObject || pmoObject.type !== 'Organization') {
    throw new Error('EOS-PMO must be registered as an Organization Enterprise Object');
  }

  if (pmoObject.owner !== 'CTO') {
    throw new Error('EOS-PMO owner must be CTO');
  }

  const masterRoadmapObject = objectsById.get('EOS-MASTER-ROADMAP');
  if (!masterRoadmapObject || masterRoadmapObject.type !== 'Roadmap') {
    throw new Error('EOS-MASTER-ROADMAP must be registered as a Roadmap Enterprise Object');
  }

  if (masterRoadmapObject.owner !== 'EOS PMO') {
    throw new Error('EOS-MASTER-ROADMAP owner must be EOS PMO');
  }

  for (const linkedObjectId of ['EOS-CAP-0020', 'EOS-PMO', 'EOS-WF-PROGRAM-MANAGEMENT']) {
    if (!masterRoadmapObject.linkedObjects.includes(linkedObjectId)) {
      throw new Error(`EOS-MASTER-ROADMAP must link to ${linkedObjectId}`);
    }
  }

  const executiveCouncilObject = objectsById.get('EOS-EXECUTIVE-COUNCIL');
  if (!executiveCouncilObject || executiveCouncilObject.type !== 'Organization') {
    throw new Error('EOS-EXECUTIVE-COUNCIL must be registered as an Organization Enterprise Object');
  }

  if (executiveCouncilObject.owner !== 'Eric Olo') {
    throw new Error('EOS-EXECUTIVE-COUNCIL owner must be Eric Olo');
  }

  const headquartersObject = objectsById.get('EOS-DIGITAL-ENTERPRISE-HEADQUARTERS');
  if (!headquartersObject || headquartersObject.type !== 'Application Module') {
    throw new Error('EOS-DIGITAL-ENTERPRISE-HEADQUARTERS must be registered as an Application Module Enterprise Object');
  }

  if (headquartersObject.owner !== 'Eric Olo') {
    throw new Error('EOS-DIGITAL-ENTERPRISE-HEADQUARTERS owner must be Eric Olo');
  }

  const executiveActionFrameworkObject = objectsById.get('EOS-EXECUTIVE-ACTION-FRAMEWORK');
  if (!executiveActionFrameworkObject || executiveActionFrameworkObject.type !== 'Governance System') {
    throw new Error('EOS-EXECUTIVE-ACTION-FRAMEWORK must be registered as a Governance System Enterprise Object');
  }

  assertLiveStatus(executiveActionFrameworkObject.id, executiveActionFrameworkObject.liveStatus);

  const approvalQueueObject = objectsById.get('EOS-APPROVAL-QUEUE');
  if (!approvalQueueObject || approvalQueueObject.type !== 'Governance Queue') {
    throw new Error('EOS-APPROVAL-QUEUE must be registered as a Governance Queue Enterprise Object');
  }

  assertLiveStatus(approvalQueueObject.id, approvalQueueObject.liveStatus);

  const executiveOfficeFrameworkObject = objectsById.get('EOS-EXECUTIVE-OFFICE-FRAMEWORK');
  if (!executiveOfficeFrameworkObject || executiveOfficeFrameworkObject.type !== 'Application Module') {
    throw new Error('EOS-EXECUTIVE-OFFICE-FRAMEWORK must be registered as an Application Module Enterprise Object');
  }

  assertLiveStatus(executiveOfficeFrameworkObject.id, executiveOfficeFrameworkObject.liveStatus);

  const enterpriseDesignCapabilityObject = objectsById.get('EOS-CAP-0024');
  if (!enterpriseDesignCapabilityObject || enterpriseDesignCapabilityObject.type !== 'Capability') {
    throw new Error('EOS-CAP-0024 must be registered as a Capability Enterprise Object');
  }

  for (const linkedObjectId of [
    'EOS-ENTERPRISE-DESIGN-SYSTEM',
    'EOS-EXECUTIVE-PRESENTATION-MODE',
    'EOS-UX-AUDIT',
    'EOS-WF-DESIGN-GOVERNANCE',
    'EOS-MC-001',
    'EOS-DIGITAL-ENTERPRISE-HEADQUARTERS'
  ]) {
    if (!enterpriseDesignCapabilityObject.linkedObjects.includes(linkedObjectId)) {
      throw new Error(`EOS-CAP-0024 must link to ${linkedObjectId}`);
    }
  }

  const enterpriseDesignSystemObject = objectsById.get('EOS-ENTERPRISE-DESIGN-SYSTEM');
  if (!enterpriseDesignSystemObject || enterpriseDesignSystemObject.type !== 'Design System') {
    throw new Error('EOS-ENTERPRISE-DESIGN-SYSTEM must be registered as a Design System Enterprise Object');
  }

  assertLiveStatus(enterpriseDesignSystemObject.id, enterpriseDesignSystemObject.liveStatus);

  const presentationModeObject = objectsById.get('EOS-EXECUTIVE-PRESENTATION-MODE');
  if (!presentationModeObject || presentationModeObject.type !== 'Experience Mode') {
    throw new Error('EOS-EXECUTIVE-PRESENTATION-MODE must be registered as an Experience Mode Enterprise Object');
  }

  assertLiveStatus(presentationModeObject.id, presentationModeObject.liveStatus);

  const uxAuditObject = objectsById.get('EOS-UX-AUDIT');
  if (!uxAuditObject || uxAuditObject.type !== 'Governance Artifact') {
    throw new Error('EOS-UX-AUDIT must be registered as a Governance Artifact Enterprise Object');
  }

  assertLiveStatus(uxAuditObject.id, uxAuditObject.liveStatus);

  const persistentStoreCapabilityObject = objectsById.get('EOS-CAP-0025');
  if (!persistentStoreCapabilityObject || persistentStoreCapabilityObject.type !== 'Capability') {
    throw new Error('EOS-CAP-0025 must be registered as a Capability Enterprise Object');
  }

  for (const linkedObjectId of [
    'EOS-PERSISTENT-DATA-STORE',
    'EOS-STORAGE-HEALTH',
    'EOS-WF-PERSISTENT-DATA-MANAGEMENT',
    'EOS-API-001',
    'EOS-MC-001'
  ]) {
    if (!persistentStoreCapabilityObject.linkedObjects.includes(linkedObjectId)) {
      throw new Error(`EOS-CAP-0025 must link to ${linkedObjectId}`);
    }
  }

  const persistentDataStoreObject = objectsById.get('EOS-PERSISTENT-DATA-STORE');
  if (!persistentDataStoreObject || persistentDataStoreObject.type !== 'Data Store') {
    throw new Error('EOS-PERSISTENT-DATA-STORE must be registered as a Data Store Enterprise Object');
  }

  assertLiveStatus(persistentDataStoreObject.id, persistentDataStoreObject.liveStatus);

  const storageHealthObject = objectsById.get('EOS-STORAGE-HEALTH');
  if (!storageHealthObject || storageHealthObject.type !== 'Health Report') {
    throw new Error('EOS-STORAGE-HEALTH must be registered as a Health Report Enterprise Object');
  }

  assertLiveStatus(storageHealthObject.id, storageHealthObject.liveStatus);

  const strategyCapabilityObject = objectsById.get('EOS-CAP-0026');
  if (!strategyCapabilityObject || strategyCapabilityObject.type !== 'Capability') {
    throw new Error('EOS-CAP-0026 must be registered as a Capability Enterprise Object');
  }

  for (const linkedObjectId of [
    'EOS-ENTERPRISE-STRATEGY',
    'EOS-GOVERNANCE-COUNCIL',
    'EOS-DIGITAL-ENTERPRISE-VALUATION',
    'EOS-SECOND-BALANCE-SHEET',
    'EOS-DTA-MONITORING',
    'DTA-EPERCENT-001',
    'DTA-EOS-001',
    'EOS-WF-STRATEGY-GOVERNANCE-VALUATION'
  ]) {
    if (!strategyCapabilityObject.linkedObjects.includes(linkedObjectId)) {
      throw new Error(`EOS-CAP-0026 must link to ${linkedObjectId}`);
    }
  }

  const strategyObjectTypes = {
    'EOS-ENTERPRISE-STRATEGY': 'Strategy',
    'EOS-GOVERNANCE-COUNCIL': 'Governance',
    'EOS-DIGITAL-ENTERPRISE-VALUATION': 'Valuation Model',
    'EOS-SECOND-BALANCE-SHEET': 'Valuation Framework',
    'EOS-DTA-MONITORING': 'DTA Monitoring',
    'DTA-EPERCENT-001': 'Digital Twin Asset',
    'DTA-EOS-001': 'Digital Twin Asset'
  };

  for (const [objectId, expectedType] of Object.entries(strategyObjectTypes)) {
    const strategyLayerObject = objectsById.get(objectId);

    if (!strategyLayerObject || strategyLayerObject.type !== expectedType) {
      throw new Error(`${objectId} must be registered as ${expectedType}`);
    }

    assertLiveStatus(strategyLayerObject.id, strategyLayerObject.liveStatus);
  }

  const platformOperationsCapabilityObject = objectsById.get('EOS-CAP-0027');
  if (!platformOperationsCapabilityObject || platformOperationsCapabilityObject.type !== 'Capability') {
    throw new Error('EOS-CAP-0027 must be registered as a Capability Enterprise Object');
  }

  for (const linkedObjectId of [
    'EOS-PLATFORM-ADMINISTRATION-CENTER',
    'EOS-AI-WORKFORCE-OPERATIONS',
    'EOS-AGENT-COMMUNICATION-LAYER',
    'EOS-AGENT-ACTIVITY-QUEUE',
    'EOS-AGENT-CALENDAR',
    'EOS-ACTION-GOVERNANCE',
    'EOS-WF-PLATFORM-OPERATIONS-GOVERNANCE',
    'EOS-WF-AGENT-COMMUNICATION',
    'EOS-WF-AGENT-ACTIVITY-MONITORING',
    'EOS-WF-AGENT-CALENDAR-MANAGEMENT',
    'EOS-WF-ACTION-AUTHORIZATION'
  ]) {
    if (!platformOperationsCapabilityObject.linkedObjects.includes(linkedObjectId)) {
      throw new Error(`EOS-CAP-0027 must link to ${linkedObjectId}`);
    }
  }

  const identityIntakeCapabilityObject = objectsById.get('EOS-CAP-0031');
  if (!identityIntakeCapabilityObject || identityIntakeCapabilityObject.type !== 'Capability') {
    throw new Error('EOS-CAP-0031 must be registered as a Capability Enterprise Object');
  }

  for (const linkedObjectId of [
    'EOS-STARTUP-EXPERIENCE',
    'EOS-IDENTITY-MEDIA-REGISTRY',
    'EOS-MEDIA-ASSET-STORE',
    'EOS-ORGANIZATION-INTAKE',
    'EOS-EXTERNAL-REPOSITORY-LINKS',
    'EOS-WF-ORGANIZATION-INTAKE'
  ]) {
    if (!identityIntakeCapabilityObject.linkedObjects.includes(linkedObjectId)) {
      throw new Error(`EOS-CAP-0031 must link to ${linkedObjectId}`);
    }
  }

  const platformOperationsObjectTypes = {
    'EOS-PLATFORM-ADMINISTRATION-CENTER': 'Administration Center',
    'EOS-AI-WORKFORCE-OPERATIONS': 'Operations Layer',
    'EOS-AGENT-COMMUNICATION-LAYER': 'Communication Layer',
    'EOS-AGENT-ACTIVITY-QUEUE': 'Operations Queue',
    'EOS-AGENT-CALENDAR': 'Calendar Foundation',
    'EOS-ACTION-GOVERNANCE': 'Governance'
  };

  for (const [objectId, expectedType] of Object.entries(platformOperationsObjectTypes)) {
    const platformObject = objectsById.get(objectId);

    if (!platformObject || platformObject.type !== expectedType) {
      throw new Error(`${objectId} must be registered as ${expectedType}`);
    }

    assertLiveStatus(platformObject.id, platformObject.liveStatus);
  }

  const missionControlNavigationCapabilityObject = objectsById.get('EOS-CAP-0028');
  if (!missionControlNavigationCapabilityObject || missionControlNavigationCapabilityObject.type !== 'Capability') {
    throw new Error('EOS-CAP-0028 must be registered as a Capability Enterprise Object');
  }

  for (const linkedObjectId of [
    'EOS-MISSION-CONTROL-NAVIGATION',
    'EOS-DIGITAL-HEADQUARTERS-LOBBY',
    'EOS-COMMAND-PALETTE',
    'EOS-WORKSPACE-RAIL',
    'EOS-WF-MISSION-CONTROL-EXPERIENCE-GOVERNANCE'
  ]) {
    if (!missionControlNavigationCapabilityObject.linkedObjects.includes(linkedObjectId)) {
      throw new Error(`EOS-CAP-0028 must link to ${linkedObjectId}`);
    }
  }

  const missionControlNavigationObjectTypes = {
    'EOS-MISSION-CONTROL-NAVIGATION': 'Experience System',
    'EOS-DIGITAL-HEADQUARTERS-LOBBY': 'Experience Module',
    'EOS-COMMAND-PALETTE': 'Interface Component',
    'EOS-WORKSPACE-RAIL': 'Navigation System'
  };

  for (const [objectId, expectedType] of Object.entries(missionControlNavigationObjectTypes)) {
    const navigationObject = objectsById.get(objectId);

    if (!navigationObject || navigationObject.type !== expectedType) {
      throw new Error(`${objectId} must be registered as ${expectedType}`);
    }

    assertLiveStatus(navigationObject.id, navigationObject.liveStatus);
  }

  const visualLayerCapabilityObject = objectsById.get('EOS-CAP-0030');
  if (!visualLayerCapabilityObject || visualLayerCapabilityObject.type !== 'Capability') {
    throw new Error('EOS-CAP-0030 must be registered as a Capability Enterprise Object');
  }

  for (const linkedObjectId of [
    'EOS-MASTER-MONITORING-VIEW',
    'EOS-ENTERPRISE-DIGITAL-TWIN-HOME',
    'EOS-ENTERPRISE-VISUAL-MODEL',
    'EOS-REAL-TIME-TELEMETRY-FOUNDATION',
    'EOS-DIGITAL-TWIN-GENERATION-WORKFLOW',
    'DTA-EPERCENT-001',
    'DTA-OIL-001',
    'EOS-WF-ENTERPRISE-DIGITAL-TWIN-VISUALIZATION'
  ]) {
    if (!visualLayerCapabilityObject.linkedObjects.includes(linkedObjectId)) {
      throw new Error(`EOS-CAP-0030 must link to ${linkedObjectId}`);
    }
  }

  const visualLayerObjectTypes = {
    'EOS-MASTER-MONITORING-VIEW': 'Visual Intelligence View',
    'EOS-ENTERPRISE-DIGITAL-TWIN-HOME': 'Visual Intelligence View',
    'EOS-ENTERPRISE-VISUAL-MODEL': 'Visual Data Model',
    'EOS-REAL-TIME-TELEMETRY-FOUNDATION': 'Telemetry Foundation',
    'EOS-DIGITAL-TWIN-GENERATION-WORKFLOW': 'Onboarding Workflow Model',
    'DTA-OIL-001': 'Digital Twin Asset'
  };

  for (const [objectId, expectedType] of Object.entries(visualLayerObjectTypes)) {
    const visualObject = objectsById.get(objectId);

    if (!visualObject || visualObject.type !== expectedType) {
      throw new Error(`${objectId} must be registered as ${expectedType}`);
    }

    assertLiveStatus(visualObject.id, visualObject.liveStatus);
  }

  const onboardingCapabilityObject = objectsById.get('EOS-CAP-0032');
  if (!onboardingCapabilityObject || onboardingCapabilityObject.type !== 'Capability') {
    throw new Error('EOS-CAP-0032 must be registered as a Capability Enterprise Object');
  }

  for (const linkedObjectId of [
    'EOS-ENTERPRISE-ONBOARDING',
    'EOS-DTA-ASSIMILATION-ENGINE',
    'EOS-DIGITAL-MIRROR',
    'EOS-DTA-CANDIDATE-REGISTRY',
    'EOS-DATA-FEED-REQUIREMENTS',
    'EOS-HUMAN-VALIDATION-GATE',
    'EOS-WF-ENTERPRISE-ONBOARDING',
    'EOS-WF-DTA-ASSIMILATION',
    'EOS-WF-HUMAN-VALIDATION'
  ]) {
    if (!onboardingCapabilityObject.linkedObjects.includes(linkedObjectId)) {
      throw new Error(`EOS-CAP-0032 must link to ${linkedObjectId}`);
    }
  }

  const onboardingObjectTypes = {
    'EOS-ENTERPRISE-ONBOARDING': 'Service',
    'EOS-DTA-ASSIMILATION-ENGINE': 'Service',
    'EOS-DIGITAL-MIRROR': 'Model',
    'EOS-DTA-CANDIDATE-REGISTRY': 'Registry',
    'EOS-DATA-FEED-REQUIREMENTS': 'Registry',
    'EOS-HUMAN-VALIDATION-GATE': 'Governance Control'
  };

  for (const [objectId, expectedType] of Object.entries(onboardingObjectTypes)) {
    const onboardingObject = objectsById.get(objectId);

    if (!onboardingObject || onboardingObject.type !== expectedType) {
      throw new Error(`${objectId} must be registered as ${expectedType}`);
    }

    assertLiveStatus(onboardingObject.id, onboardingObject.liveStatus);
  }

  const auditCapabilityObject = objectsById.get('EOS-CAP-0033');
  if (!auditCapabilityObject || auditCapabilityObject.type !== 'Capability') {
    throw new Error('EOS-CAP-0033 must be registered as a Capability Enterprise Object');
  }

  for (const linkedObjectId of [
    'EOS-PLATFORM-AUDIT-CENTER',
    'EOS-CAPABILITY-READINESS-MATRIX',
    'EOS-FUNCTIONAL-COVERAGE-REPORT',
    'EOS-AUDIT-READINESS-SCORE',
    'EOS-WF-PLATFORM-AUDIT-READINESS'
  ]) {
    if (!auditCapabilityObject.linkedObjects.includes(linkedObjectId)) {
      throw new Error(`EOS-CAP-0033 must link to ${linkedObjectId}`);
    }
  }

  const auditObjectTypes = {
    'EOS-PLATFORM-AUDIT-CENTER': 'Service',
    'EOS-CAPABILITY-READINESS-MATRIX': 'Governance Model',
    'EOS-FUNCTIONAL-COVERAGE-REPORT': 'Report',
    'EOS-AUDIT-READINESS-SCORE': 'Metric'
  };

  for (const [objectId, expectedType] of Object.entries(auditObjectTypes)) {
    const auditObject = objectsById.get(objectId);

    if (!auditObject || auditObject.type !== expectedType) {
      throw new Error(`${objectId} must be registered as ${expectedType}`);
    }

    assertLiveStatus(auditObject.id, auditObject.liveStatus);
  }

  for (const researchProjectId of expectedAgentKnowledgeObjectIds) {
    const researchProjectObject = objectsById.get(researchProjectId);
    if (!researchProjectObject || researchProjectObject.type !== 'Research Project') {
      throw new Error(`${researchProjectId} must be registered as a Research Project Enterprise Object`);
    }

    if (!researchProjectObject.linkedObjects.includes('EOS-AKR')) {
      throw new Error(`${researchProjectId} must link to EOS-AKR`);
    }

    if (!researchProjectObject.linkedObjects.includes('EOS-ASSET-EXPLORER')) {
      throw new Error(`${researchProjectId} must link to EOS-ASSET-EXPLORER`);
    }
  }

  const codexDirectiveObject = objectsById.get('EOS-ORG-DIR-001');
  if (!codexDirectiveObject || codexDirectiveObject.type !== 'Directive') {
    throw new Error('EOS-ORG-DIR-001 must be registered as a Directive Enterprise Object');
  }

  if (!codexDirectiveObject.linkedObjects.includes('EOS-AGENT-CODEX')) {
    throw new Error('EOS-ORG-DIR-001 must link to EOS-AGENT-CODEX');
  }

  const executiveDirectiveObject = objectsById.get('EOS-ORG-DIR-002');
  if (!executiveDirectiveObject || executiveDirectiveObject.type !== 'Directive') {
    throw new Error('EOS-ORG-DIR-002 must be registered as a Directive Enterprise Object');
  }

  const executiveTeamObject = objectsById.get('EOS-EXEC-LEADERSHIP-TEAM');
  if (!executiveTeamObject || executiveTeamObject.type !== 'Organization') {
    throw new Error('EOS-EXEC-LEADERSHIP-TEAM must be registered as an Organization Enterprise Object');
  }

  for (const agentId of expectedAgentIds) {
    if (!executiveDirectiveObject.linkedObjects.includes(agentId)) {
      throw new Error(`EOS-ORG-DIR-002 must link to ${agentId}`);
    }

    if (!executiveTeamObject.linkedObjects.includes(agentId)) {
      throw new Error(`EOS-EXEC-LEADERSHIP-TEAM must link to ${agentId}`);
    }
  }

  for (const agentId of expectedAgentIds) {
    const agentObject = objectsById.get(agentId);

    if (!agentObject || agentObject.type !== 'Agent') {
      throw new Error(`${agentId} must be registered as an Agent Enterprise Object`);
    }

    if (!agentObject.linkedObjects.includes('EOS-CAP-0005')) {
      throw new Error(`${agentId} must link to EOS-CAP-0005`);
    }

    if (!agentObject.linkedObjects.includes('EOS-ORG-DIR-002')) {
      throw new Error(`${agentId} must link to EOS-ORG-DIR-002`);
    }

    if (!agentObject.linkedObjects.includes('EOS-EXEC-LEADERSHIP-TEAM')) {
      throw new Error(`${agentId} must link to EOS-EXEC-LEADERSHIP-TEAM`);
    }

    if (agentObject.reportsTo !== 'Chief Technology Officer') {
      throw new Error(`${agentId} Enterprise Object must report to the Chief Technology Officer`);
    }

    if (!Array.isArray(agentObject.responsibilities) || agentObject.responsibilities.length === 0) {
      throw new Error(`${agentId} Enterprise Object must include responsibilities`);
    }
  }

  for (const knowledgeId of expectedKnowledgeIds) {
    const knowledgeEnterpriseObject = objectsById.get(knowledgeId);

    if (!knowledgeEnterpriseObject || knowledgeEnterpriseObject.type !== 'Knowledge Object') {
      throw new Error(`${knowledgeId} must be registered as a Knowledge Object Enterprise Object`);
    }

    if (!knowledgeEnterpriseObject.linkedObjects.includes('EOS-CAP-0006')) {
      throw new Error(`${knowledgeId} must link to EOS-CAP-0006`);
    }
  }

  for (const workflowId of expectedWorkflowIds) {
    const workflowEnterpriseObject = objectsById.get(workflowId);

    if (!workflowEnterpriseObject || workflowEnterpriseObject.type !== 'Workflow') {
      throw new Error(`${workflowId} must be registered as a Workflow Enterprise Object`);
    }

    if (!workflowEnterpriseObject.linkedObjects.includes('EOS-CAP-0007')) {
      throw new Error(`${workflowId} must link to EOS-CAP-0007`);
    }
  }

  const objectResult = await requestJson('/api/objects/EOS-API-001');
  assertOk(objectResult);
  assertEnterpriseObject(objectResult.body);
  assertEqual(objectResult.body.id, 'EOS-API-001', 'Enterprise Object lookup id');

  const designSystemObjectResult = await requestJson('/api/objects/EOS-ENTERPRISE-DESIGN-SYSTEM');
  assertOk(designSystemObjectResult);
  assertEnterpriseObject(designSystemObjectResult.body);
  assertEqual(
    designSystemObjectResult.body.id,
    'EOS-ENTERPRISE-DESIGN-SYSTEM',
    'Enterprise Design System object lookup id'
  );

  const persistentStoreObjectResult = await requestJson('/api/objects/EOS-PERSISTENT-DATA-STORE');
  assertOk(persistentStoreObjectResult);
  assertEnterpriseObject(persistentStoreObjectResult.body);
  assertEqual(
    persistentStoreObjectResult.body.id,
    'EOS-PERSISTENT-DATA-STORE',
    'Persistent Data Store object lookup id'
  );

  const agentsResult = await requestJson('/api/agents');
  assertOk(agentsResult);

  if (agentsResult.body.capability !== 'EOS-CAP-0005') {
    throw new Error(`Expected EOS-CAP-0005 capability, received ${agentsResult.body.capability}`);
  }

  if (agentsResult.body.count !== expectedAgentIds.length) {
    throw new Error(`Expected ${expectedAgentIds.length} agents, received ${agentsResult.body.count}`);
  }

  if (!Array.isArray(agentsResult.body.agents)) {
    throw new Error('/api/agents response must include an agents array');
  }

  for (const agent of agentsResult.body.agents) {
    assertAgent(agent);
  }

  const actualAgentIds = agentsResult.body.agents.map((agent) => agent.id);
  assertEqual(actualAgentIds, expectedAgentIds, 'Agent ids');

  const agentResult = await requestJson('/api/agents/EOS-AGENT-ATHENA');
  assertOk(agentResult);
  assertAgent(agentResult.body);
  assertEqual(agentResult.body.id, 'EOS-AGENT-ATHENA', 'Agent lookup id');

  for (const [agentId, role] of Object.entries(expectedExecutiveAgentRoles)) {
    const executiveAgent = agentsResult.body.agents.find((agent) => agent.id === agentId);
    if (!executiveAgent || executiveAgent.role !== role) {
      throw new Error(`${agentId} must be registered as ${role}`);
    }

    const executiveAgentResult = await requestJson(`/api/agents/${agentId}`);
    assertOk(executiveAgentResult);
    assertAgent(executiveAgentResult.body);
    assertEqual(executiveAgentResult.body.id, agentId, `${agentId} lookup id`);
  }

  const knowledgeResult = await requestJson('/api/knowledge');
  assertOk(knowledgeResult);

  if (knowledgeResult.body.capability !== 'EOS-CAP-0006') {
    throw new Error(`Expected EOS-CAP-0006 capability, received ${knowledgeResult.body.capability}`);
  }

  if (knowledgeResult.body.count !== expectedKnowledgeIds.length) {
    throw new Error(`Expected ${expectedKnowledgeIds.length} Knowledge Objects, received ${knowledgeResult.body.count}`);
  }

  if (!Array.isArray(knowledgeResult.body.knowledge)) {
    throw new Error('/api/knowledge response must include a knowledge array');
  }

  for (const knowledgeObject of knowledgeResult.body.knowledge) {
    assertKnowledgeObject(knowledgeObject);
  }

  const actualKnowledgeIds = knowledgeResult.body.knowledge.map((knowledgeObject) => knowledgeObject.id);
  assertEqual(actualKnowledgeIds, expectedKnowledgeIds, 'Knowledge Object ids');

  const knowledgeLookupResult = await requestJson('/api/knowledge/EOS-KNOWLEDGE-GENESIS');
  assertOk(knowledgeLookupResult);
  assertKnowledgeObject(knowledgeLookupResult.body);
  assertEqual(knowledgeLookupResult.body.id, 'EOS-KNOWLEDGE-GENESIS', 'Knowledge Object lookup id');

  const pmoResult = await requestJson('/api/pmo');
  assertOk(pmoResult);

  if (pmoResult.body.capability !== 'EOS-CAP-0020') {
    throw new Error(`Expected EOS-CAP-0020 capability, received ${pmoResult.body.capability}`);
  }

  assertPmo(pmoResult.body.pmo);
  assertMasterRoadmap(pmoResult.body.masterRoadmap);

  const roadmapResult = await requestJson('/api/pmo/master-roadmap');
  assertOk(roadmapResult);
  assertMasterRoadmap(roadmapResult.body);
  assertEqual(roadmapResult.body.id, 'EOS-MASTER-ROADMAP', 'EOS Master Roadmap lookup id');

  const storageStatusResult = await requestJson('/api/storage/status');
  assertOk(storageStatusResult);

  if (storageStatusResult.body.capability !== 'EOS-CAP-0025') {
    throw new Error(`Expected EOS-CAP-0025 storage capability, received ${storageStatusResult.body.capability}`);
  }

  if (storageStatusResult.body.storageStatus !== 'Operational') {
    throw new Error(`Expected Operational storage status, received ${storageStatusResult.body.storageStatus}`);
  }

  if (!Array.isArray(storageStatusResult.body.collectionsMissing)) {
    throw new Error('/api/storage/status must include collectionsMissing array');
  }

  if (storageStatusResult.body.collectionsMissing.length !== 0) {
    throw new Error(`Storage collections missing: ${storageStatusResult.body.collectionsMissing.join(', ')}`);
  }

  for (const collectionName of expectedStorageCollections) {
    if (!storageStatusResult.body.collectionsFound.includes(collectionName)) {
      throw new Error(`Storage health must include collection ${collectionName}`);
    }
  }

  if (storageStatusResult.body.recordCounts['enterprise-objects'] !== expectedObjectIds.length) {
    throw new Error('Storage health enterprise-objects record count must match Enterprise Object registry count');
  }

  const storageCollectionsResult = await requestJson('/api/storage/collections');
  assertOk(storageCollectionsResult);

  if (storageCollectionsResult.body.capability !== 'EOS-CAP-0025') {
    throw new Error(`Expected EOS-CAP-0025 collection capability, received ${storageCollectionsResult.body.capability}`);
  }

  if (storageCollectionsResult.body.count !== expectedStorageCollections.length) {
    throw new Error(
      `Expected ${expectedStorageCollections.length} storage collections, received ${storageCollectionsResult.body.count}`
    );
  }

  const collectionNames = storageCollectionsResult.body.collections.map((collection) => collection.collectionName);
  for (const collectionName of expectedStorageCollections) {
    if (!collectionNames.includes(collectionName)) {
      throw new Error(`/api/storage/collections must include ${collectionName}`);
    }
  }

  const enterpriseObjectsCollectionResult = await requestJson('/api/storage/collections/enterprise-objects');
  assertOk(enterpriseObjectsCollectionResult);

  if (enterpriseObjectsCollectionResult.body.collectionName !== 'enterprise-objects') {
    throw new Error('Enterprise Object storage collection must report collectionName enterprise-objects');
  }

  if (enterpriseObjectsCollectionResult.body.recordCount !== expectedObjectIds.length) {
    throw new Error('Enterprise Object storage collection record count must match expected registry count');
  }

  if (!Array.isArray(enterpriseObjectsCollectionResult.body.records)) {
    throw new Error('Enterprise Object storage collection must include records array');
  }

  const strategyResult = await requestJson('/api/strategy');
  assertOk(strategyResult);

  if (strategyResult.body.capability !== 'EOS-CAP-0026') {
    throw new Error(`Expected EOS-CAP-0026 strategy capability, received ${strategyResult.body.capability}`);
  }

  if (strategyResult.body.strategy.id !== 'EOS-ENTERPRISE-STRATEGY') {
    throw new Error('/api/strategy must return EOS-ENTERPRISE-STRATEGY');
  }

  assertLiveStatus(strategyResult.body.strategy.id, strategyResult.body.strategy.liveStatus);

  if (!Array.isArray(strategyResult.body.roadmapAlignment) || strategyResult.body.roadmapAlignment.length !== 12) {
    throw new Error('/api/strategy must return roadmapAlignment for all 12 roadmap programs');
  }

  const governanceResult = await requestJson('/api/governance');
  assertOk(governanceResult);

  if (governanceResult.body.governance.id !== 'EOS-GOVERNANCE-COUNCIL') {
    throw new Error('/api/governance must return EOS-GOVERNANCE-COUNCIL');
  }

  if (!Array.isArray(governanceResult.body.governance.openGovernanceItems)) {
    throw new Error('/api/governance must include openGovernanceItems');
  }

  const valuationResult = await requestJson('/api/valuation');
  assertOk(valuationResult);

  if (valuationResult.body.valuation.id !== 'EOS-DIGITAL-ENTERPRISE-VALUATION') {
    throw new Error('/api/valuation must return EOS-DIGITAL-ENTERPRISE-VALUATION');
  }

  if (!valuationResult.body.valuation.estimateBasis.includes('Not financial advice')) {
    throw new Error('/api/valuation must mark values as not financial advice');
  }

  const secondBalanceSheetResult = await requestJson('/api/second-balance-sheet');
  assertOk(secondBalanceSheetResult);

  if (secondBalanceSheetResult.body.secondBalanceSheet.id !== 'EOS-SECOND-BALANCE-SHEET') {
    throw new Error('/api/second-balance-sheet must return EOS-SECOND-BALANCE-SHEET');
  }

  if (secondBalanceSheetResult.body.secondBalanceSheet.liveEnterpriseObjects !== expectedObjectIds.length) {
    throw new Error('Second Balance Sheet liveEnterpriseObjects must match Enterprise Object count');
  }

  const digitalTwinAssetsResult = await requestJson('/api/digital-twin-assets');
  assertOk(digitalTwinAssetsResult);

  if (digitalTwinAssetsResult.body.count !== 3) {
    throw new Error(`Expected 3 Digital Twin Assets, received ${digitalTwinAssetsResult.body.count}`);
  }

  if (digitalTwinAssetsResult.body.monitoring.id !== 'EOS-DTA-MONITORING') {
    throw new Error('/api/digital-twin-assets must include EOS-DTA-MONITORING');
  }

  for (const assetId of ['DTA-EPERCENT-001', 'DTA-EOS-001', 'DTA-OIL-001']) {
    if (!digitalTwinAssetsResult.body.assets.some((asset) => asset.id === assetId)) {
      throw new Error(`/api/digital-twin-assets must include ${assetId}`);
    }
  }

  const dtaLookupResult = await requestJson('/api/digital-twin-assets/DTA-EPERCENT-001');
  assertOk(dtaLookupResult);
  assertEqual(dtaLookupResult.body.id, 'DTA-EPERCENT-001', 'Digital Twin Asset lookup id');

  const strategicLayerResult = await requestJson('/api/strategic-layer');
  assertOk(strategicLayerResult);
  assertEqual(strategicLayerResult.body.capability, 'EOS-CAP-0026', 'Strategic Layer capability');

  const strategicAlignmentResult = await requestJson('/api/strategic-alignment');
  assertOk(strategicAlignmentResult);
  assertEqual(strategicAlignmentResult.body.capability, 'EOS-CAP-0029', 'Strategic Alignment capability');
  assertEqual(
    strategicAlignmentResult.body.strategicAlignment.id,
    'EOS-STRATEGIC-ALIGNMENT',
    'Strategic Alignment id'
  );
  if (strategicAlignmentResult.body.investmentThesis.sourcePresentations.length !== 3) {
    throw new Error('Strategic Alignment must track the three requested investment thesis source presentations');
  }
  if (strategicAlignmentResult.body.technologyFlywheel.steps.length !== 11) {
    throw new Error('Technology Flywheel must contain 11 reinforcing steps');
  }
  if (strategicAlignmentResult.body.threeHorizonRoadmap.horizons.length !== 3) {
    throw new Error('Three-Horizon Roadmap must contain 3 horizons');
  }
  if (strategicAlignmentResult.body.revenueEngine.streams.length !== 19) {
    throw new Error('Revenue Engine must contain 19 revenue streams');
  }
  if (strategicAlignmentResult.body.dtaLifecycle.stages.length !== 11) {
    throw new Error('DTA Lifecycle must contain 11 lifecycle stages');
  }
  if (strategicAlignmentResult.body.dtaLifecycle.assets.length !== 3) {
    throw new Error('DTA Lifecycle must map the initial 3 Digital Twin Assets');
  }
  if (strategicAlignmentResult.body.kipr.areas.length !== 11) {
    throw new Error('KIPR must contain 11 knowledge and IP areas');
  }
  if (strategicAlignmentResult.body.industryFramework.industries.length !== 22) {
    throw new Error('Industry Framework must contain 22 industries');
  }
  for (const assessmentName of ['commercial', 'research', 'investor']) {
    const assessment = strategicAlignmentResult.body.readinessAssessments[assessmentName];
    if (!assessment || !Number.isInteger(assessment.score) || assessment.score < 0 || assessment.score > 100) {
      throw new Error(`Strategic Alignment ${assessmentName} readiness score must be an integer from 0 to 100`);
    }
  }

  const masterMonitoringResult = await requestJson('/api/master-monitoring');
  assertOk(masterMonitoringResult);
  assertEqual(masterMonitoringResult.body.capability, 'EOS-CAP-0030', 'Master Monitoring capability');
  assertEqual(masterMonitoringResult.body.monitoring.id, 'EOS-MASTER-MONITORING', 'Master Monitoring id');
  if (masterMonitoringResult.body.architectureLayers.length !== 10) {
    throw new Error('Master Monitoring must expose 10 layered enterprise architecture layers');
  }
  if (masterMonitoringResult.body.enterpriseVisuals.length !== 2) {
    throw new Error('Master Monitoring must expose 2 seeded enterprise visual models');
  }
  if (masterMonitoringResult.body.digitalTwinHomes.length !== 2) {
    throw new Error('Master Monitoring must expose 2 seeded Digital Twin Enterprise Homes');
  }
  if (masterMonitoringResult.body.telemetry.length !== 10) {
    throw new Error('Master Monitoring must expose 10 seeded telemetry updates');
  }
  if (masterMonitoringResult.body.generationWorkflows[0]?.steps.length !== 10) {
    throw new Error('Digital Twin generation workflow must expose 10 future onboarding steps');
  }

  const enterpriseVisualsResult = await requestJson('/api/enterprise-visuals');
  assertOk(enterpriseVisualsResult);
  assertEqual(enterpriseVisualsResult.body.capability, 'EOS-CAP-0030', 'Enterprise Visuals capability');
  if (enterpriseVisualsResult.body.count !== 2) {
    throw new Error(`Expected 2 enterprise visual models, received ${enterpriseVisualsResult.body.count}`);
  }
  for (const visual of enterpriseVisualsResult.body.visuals) {
    for (const field of [
      'id',
      'enterpriseId',
      'industry',
      'visualTheme',
      'logoUrl',
      'brandColor',
      'primaryAssets',
      'systems',
      'dataFeeds',
      'agents',
      'humanInteractionPoints',
      'riskAreas',
      'valuationSummary',
      'timezone',
      'lastUpdated',
      'liveStatus'
    ]) {
      if (!(field in visual)) {
        throw new Error(`Enterprise Visual ${visual.id ?? 'unknown'} missing ${field}`);
      }
    }
    assertLiveStatus(visual.id, visual.liveStatus);
  }

  const oilVisualResult = await requestJson('/api/enterprise-visuals/DTA-OIL-001');
  assertOk(oilVisualResult);
  assertEqual(oilVisualResult.body.enterpriseId, 'DTA-OIL-001', 'Oil & Gas Enterprise Visual lookup');

  const enterpriseTelemetryResult = await requestJson('/api/enterprise-telemetry');
  assertOk(enterpriseTelemetryResult);
  assertEqual(enterpriseTelemetryResult.body.capability, 'EOS-CAP-0030', 'Enterprise Telemetry capability');
  if (enterpriseTelemetryResult.body.count !== 10) {
    throw new Error(`Expected 10 telemetry updates, received ${enterpriseTelemetryResult.body.count}`);
  }
  for (const telemetry of enterpriseTelemetryResult.body.telemetry) {
    for (const field of [
      'id',
      'source',
      'sourceType',
      'targetObject',
      'metric',
      'value',
      'unit',
      'timestampUtc',
      'displayTimezone',
      'status',
      'confidence',
      'linkedEnterpriseObject',
      'linkedDta'
    ]) {
      if (!(field in telemetry)) {
        throw new Error(`Enterprise telemetry ${telemetry.id ?? 'unknown'} missing ${field}`);
      }
    }
  }

  const oilTelemetryResult = await requestJson('/api/enterprise-telemetry/DTA-OIL-001');
  assertOk(oilTelemetryResult);
  if (oilTelemetryResult.body.count !== 5) {
    throw new Error('Oil & Gas telemetry lookup must return 5 seeded updates');
  }

  const epercentHomeResult = await requestJson('/api/digital-twin-home/DTA-EPERCENT-001');
  assertOk(epercentHomeResult);
  assertEqual(epercentHomeResult.body.enterpriseId, 'DTA-EPERCENT-001', 'Digital Twin Home enterprise id');
  assertLiveStatus(epercentHomeResult.body.id, epercentHomeResult.body.liveStatus);

  const onboardingResult = await requestJson('/api/onboarding');
  assertOk(onboardingResult);
  assertEqual(onboardingResult.body.capability, 'EOS-CAP-0032', 'Enterprise Onboarding capability');
  if (onboardingResult.body.count !== 3) {
    throw new Error(`Expected 3 onboarding records, received ${onboardingResult.body.count}`);
  }
  for (const onboarding of onboardingResult.body.onboarding) {
    for (const field of [
      'id',
      'enterpriseName',
      'industry',
      'enterpriseType',
      'status',
      'stage',
      'owner',
      'createdAt',
      'updatedAt',
      'sourceDocuments',
      'sourceSystems',
      'knownAssets',
      'knownProcesses',
      'knownPeople',
      'knownDepartments',
      'knownLocations',
      'knownContracts',
      'knownRisks',
      'knownOpportunities',
      'humanValidationRequired',
      'assignedAgents',
      'linkedDigitalMirror',
      'linkedDtaCandidates',
      'liveStatus'
    ]) {
      if (!(field in onboarding)) {
        throw new Error(`Onboarding record ${onboarding.id ?? 'unknown'} missing ${field}`);
      }
    }
    assertLiveStatus(onboarding.id, onboarding.liveStatus);
  }

  const oilOnboardingResult = await requestJson('/api/onboarding/EOS-ONB-OIL-001');
  assertOk(oilOnboardingResult);
  assertEqual(oilOnboardingResult.body.enterpriseName, 'Example Oil & Gas Enterprise', 'Oil onboarding lookup');

  const oilPipelineResult = await requestJson('/api/onboarding/EOS-ONB-OIL-001/pipeline');
  assertOk(oilPipelineResult);
  if (oilPipelineResult.body.stages.length !== 11) {
    throw new Error(`Expected 11 assimilation stages, received ${oilPipelineResult.body.stages.length}`);
  }
  if (!oilPipelineResult.body.stages.some((stage) => stage.name === 'Human Validation' && stage.humanApprovalRequired)) {
    throw new Error('Assimilation pipeline must include a human validation approval stage');
  }

  const onboardingOverviewResult = await requestJson('/api/onboarding-assimilation');
  assertOk(onboardingOverviewResult);
  assertEqual(onboardingOverviewResult.body.capability, 'EOS-CAP-0032', 'Onboarding Assimilation overview capability');
  if (onboardingOverviewResult.body.summary.dtaCandidates < 7) {
    throw new Error('Onboarding Assimilation overview must include seeded DTA candidates');
  }

  const digitalMirrorsResult = await requestJson('/api/digital-mirrors');
  assertOk(digitalMirrorsResult);
  assertEqual(digitalMirrorsResult.body.capability, 'EOS-CAP-0032', 'Digital Mirrors capability');
  if (digitalMirrorsResult.body.count !== 3) {
    throw new Error(`Expected 3 Digital Mirrors, received ${digitalMirrorsResult.body.count}`);
  }
  const oilMirrorResult = await requestJson('/api/digital-mirrors/EOS-DM-OIL-001');
  assertOk(oilMirrorResult);
  assertEqual(oilMirrorResult.body.validationStatus, 'Human Validation Required', 'Oil Digital Mirror validation status');

  const dtaCandidatesResult = await requestJson('/api/dta-candidates');
  assertOk(dtaCandidatesResult);
  assertEqual(dtaCandidatesResult.body.capability, 'EOS-CAP-0032', 'DTA Candidates capability');
  if (dtaCandidatesResult.body.count < 7) {
    throw new Error(`Expected at least 7 DTA candidates, received ${dtaCandidatesResult.body.count}`);
  }
  const rigCandidateResult = await requestJson('/api/dta-candidates/EOS-DTA-CAND-OIL-RIG');
  assertOk(rigCandidateResult);
  if (!rigCandidateResult.body.requiredDataFeeds.includes('EOS-FEED-OIL-PRODUCTION')) {
    throw new Error('Rig DTA candidate must include production data feed requirement');
  }

  const feedRequirementsResult = await requestJson('/api/data-feed-requirements');
  assertOk(feedRequirementsResult);
  assertEqual(feedRequirementsResult.body.capability, 'EOS-CAP-0032', 'Data Feed Requirements capability');
  if (feedRequirementsResult.body.count !== 11) {
    throw new Error(`Expected 11 data feed requirements, received ${feedRequirementsResult.body.count}`);
  }
  const oilFeedRequirementsResult = await requestJson('/api/data-feed-requirements/EOS-ONB-OIL-001');
  assertOk(oilFeedRequirementsResult);
  if (oilFeedRequirementsResult.body.count !== 6) {
    throw new Error(`Expected 6 Oil & Gas data feed requirements, received ${oilFeedRequirementsResult.body.count}`);
  }

  const humanValidationResult = await requestJson('/api/human-validation');
  assertOk(humanValidationResult);
  assertEqual(humanValidationResult.body.capability, 'EOS-CAP-0032', 'Human Validation capability');
  if (humanValidationResult.body.count !== 27) {
    throw new Error(`Expected 27 human validation items, received ${humanValidationResult.body.count}`);
  }
  const oilValidationResult = await requestJson('/api/human-validation/EOS-ONB-OIL-001');
  assertOk(oilValidationResult);
  if (oilValidationResult.body.count !== 9) {
    throw new Error(`Expected 9 Oil & Gas validation items, received ${oilValidationResult.body.count}`);
  }

  const startupResult = await requestJson('/api/startup');
  assertOk(startupResult);
  assertEqual(startupResult.body.capability, 'EOS-CAP-0031', 'Startup Experience capability');
  assertEqual(startupResult.body.startupExperience.id, 'EOS-STARTUP-EXPERIENCE', 'Startup Experience id');
  assertEqual(startupResult.body.startupExperience.defaultWorkspace, 'enterprise-value', 'Startup default workspace');
  assertEqual(startupResult.body.startupExperience.defaultRoute, 'master-monitoring', 'Startup default route');

  const identityMediaResult = await requestJson('/api/identity-media');
  assertOk(identityMediaResult);
  assertEqual(identityMediaResult.body.capability, 'EOS-CAP-0031', 'Identity Media capability');
  if (identityMediaResult.body.profiles.length < 10) {
    throw new Error(`Identity Media must expose at least 10 profiles, received ${identityMediaResult.body.profiles.length}`);
  }
  if (!identityMediaResult.body.mediaPolicy.supportedOrganizationFiles.includes('PDF')) {
    throw new Error('Identity Media policy must support PDF organization intake');
  }
  if (!identityMediaResult.body.mediaPolicy.supportedOrganizationFiles.includes('Audio')) {
    throw new Error('Identity Media policy must support audio metadata intake');
  }
  if (!identityMediaResult.body.mediaPolicy.supportedProfileUses.includes('Profile Image')) {
    throw new Error('Identity Media policy must support profile picture uploads');
  }
  for (const profile of identityMediaResult.body.profiles) {
    for (const field of [
      'id',
      'ownerType',
      'ownerId',
      'displayName',
      'role',
      'avatarAssetId',
      'avatarUrl',
      'profilePictureAssetId',
      'profilePictureUrl',
      'roleImageAssetId',
      'roleImageUrl',
      'companyLogoAssetId',
      'companyLogoUrl',
      'logoUrl',
      'fallbackInitials',
      'builtInAvatar',
      'uploadEnabled',
      'externalRepositoryPolicy',
      'liveStatus'
    ]) {
      if (!(field in profile)) {
        throw new Error(`Profile identity ${profile.id ?? 'unknown'} missing ${field}`);
      }
    }
    if (profile.ownerType === 'Agent' || profile.ownerType === 'AI Executive Advisor') {
      if (!profile.builtInAvatar?.marker || !profile.builtInAvatar?.label) {
        throw new Error(`Agent identity ${profile.id ?? 'unknown'} must expose a built-in functional avatar`);
      }
      if (profile.profilePictureAssetId || profile.profilePictureUrl) {
        throw new Error(`Agent identity ${profile.id ?? 'unknown'} must not expose a profile picture`);
      }
    }
  }

  const codexProfileResult = await requestJson('/api/identity-media/profiles/EOS-AGENT-CODEX');
  assertOk(codexProfileResult);
  assertEqual(codexProfileResult.body.ownerId, 'EOS-AGENT-CODEX', 'Codex identity profile owner');

  const verificationAvatarSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" fill="#20c997"/><text x="40" y="49" text-anchor="middle" font-size="24" fill="#031018" font-family="Arial">C</text></svg>';
  const mediaUploadResult = await postJson('/api/identity-media/upload', {
    id: 'EOS-MEDIA-VERIFY-CODEX-AVATAR',
    ownerType: 'Agent',
    ownerId: 'EOS-AGENT-CODEX',
    usage: 'Avatar',
    displayName: 'Codex Verification Avatar',
    fileName: 'codex-verification-avatar.svg',
    mimeType: 'image/svg+xml',
    dataUrl: `data:image/svg+xml;base64,${Buffer.from(verificationAvatarSvg).toString('base64')}`
  });
  assertOk(mediaUploadResult);
  assertEqual(mediaUploadResult.response.status, 201, 'Identity media upload status');
  assertEqual(mediaUploadResult.body.asset.ownerId, 'EOS-AGENT-CODEX', 'Uploaded media owner');
  assertEqual(mediaUploadResult.body.asset.storageMode, 'Local EOS Repository', 'Uploaded media storage mode');

  const identityAssetResult = await requestJson('/api/identity-media/assets/EOS-MEDIA-VERIFY-CODEX-AVATAR');
  assertOk(identityAssetResult);
  assertEqual(identityAssetResult.body.id, 'EOS-MEDIA-VERIFY-CODEX-AVATAR', 'Identity media asset lookup');

  const verificationProfileSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80"><rect width="120" height="80" fill="#7dd3fc"/><text x="60" y="49" text-anchor="middle" font-size="24" fill="#031018" font-family="Arial">P</text></svg>';
  const profilePictureUploadResult = await postJson('/api/identity-media/upload', {
    id: 'EOS-MEDIA-VERIFY-ERIC-PROFILE-PICTURE',
    ownerType: 'Human Executive',
    ownerId: 'EOS-EXEC-ERIC-OLO',
    usage: 'Profile Image',
    displayName: 'Eric Olo Verification Profile Picture',
    fileName: 'eric-olo-verification-profile-picture.svg',
    mimeType: 'image/svg+xml',
    dataUrl: `data:image/svg+xml;base64,${Buffer.from(verificationProfileSvg).toString('base64')}`
  });
  assertOk(profilePictureUploadResult);
  assertEqual(profilePictureUploadResult.response.status, 201, 'Profile picture upload status');
  assertEqual(profilePictureUploadResult.body.asset.storageMode, 'Local EOS Repository', 'Profile picture storage mode');

  const profilePictureMediaResult = await requestRaw(profilePictureUploadResult.body.asset.publicUrl);
  assertOk(profilePictureMediaResult);
  assertEqual(
    profilePictureMediaResult.response.headers.get('cross-origin-resource-policy'),
    'cross-origin',
    'Profile picture media cross-origin resource policy'
  );

  const updatedEricProfileResult = await requestJson('/api/identity-media/profiles/EOS-EXEC-ERIC-OLO');
  assertOk(updatedEricProfileResult);
  assertEqual(
    updatedEricProfileResult.body.profilePictureAssetId,
    'EOS-MEDIA-VERIFY-ERIC-PROFILE-PICTURE',
    'Human profile picture asset id'
  );
  if (!updatedEricProfileResult.body.profilePictureUrl?.startsWith('/media/')) {
    throw new Error('Human profile picture upload must update profilePictureUrl');
  }

  const updatedCodexProfileResult = await requestJson('/api/identity-media/profiles/EOS-AGENT-CODEX');
  assertOk(updatedCodexProfileResult);
  if (updatedCodexProfileResult.body.profilePictureAssetId || updatedCodexProfileResult.body.profilePictureUrl) {
    throw new Error('Codex agent profile must use a built-in functional avatar, not a profile picture');
  }

  const organizationIntakeResult = await requestJson('/api/organization-intake');
  assertOk(organizationIntakeResult);
  assertEqual(organizationIntakeResult.body.capability, 'EOS-CAP-0031', 'Organization Intake capability');
  if (!organizationIntakeResult.body.supportedFileCategories.includes('Office Document')) {
    throw new Error('Organization Intake must support Office Document metadata extraction');
  }

  const repositoryLinkResult = await postJson('/api/repository-links', {
    id: 'EOS-REPOSITORY-LINK-VERIFY',
    name: 'EOS Verification Source Repository',
    provider: 'External Cloud Drive',
    url: 'https://example.com/eos-verification-repository'
  });
  assertOk(repositoryLinkResult);
  assertEqual(repositoryLinkResult.response.status, 201, 'Repository link creation status');
  assertEqual(repositoryLinkResult.body.link.id, 'EOS-REPOSITORY-LINK-VERIFY', 'Repository link id');

  const repositoryLinksResult = await requestJson('/api/repository-links');
  assertOk(repositoryLinksResult);
  if (!repositoryLinksResult.body.links.some((link) => link.id === 'EOS-REPOSITORY-LINK-VERIFY')) {
    throw new Error('Repository Links endpoint must include verification repository link');
  }

  const intakeText = 'EOS verification organization intake source for enterprise object candidates, knowledge extraction, and repository mapping.';
  const importResult = await postJson('/api/organization-intake/import', {
    id: 'EOS-ORG-INTAKE-VERIFY',
    organizationName: 'EOS Verification Enterprise',
    sourceType: 'Text',
    fileName: 'eos-verification-source.txt',
    mimeType: 'text/plain',
    dataUrl: `data:text/plain;base64,${Buffer.from(intakeText).toString('base64')}`
  });
  assertOk(importResult);
  assertEqual(importResult.response.status, 201, 'Organization import creation status');
  assertEqual(importResult.body.record.id, 'EOS-ORG-INTAKE-VERIFY', 'Organization import id');
  if (!importResult.body.record.extractedTextPreview.includes('EOS verification organization intake source')) {
    throw new Error('Organization import must extract useful text preview from supported text sources');
  }

  const intakeLookupResult = await requestJson('/api/organization-intake/EOS-ORG-INTAKE-VERIFY');
  assertOk(intakeLookupResult);
  assertEqual(intakeLookupResult.body.id, 'EOS-ORG-INTAKE-VERIFY', 'Organization intake lookup');

  const platformResult = await requestJson('/api/platform');
  assertOk(platformResult);
  assertPlatformPayload(platformResult.body);

  const platformStatusResult = await requestJson('/api/platform/status');
  assertOk(platformStatusResult);
  assertEqual(platformStatusResult.body.capability, 'EOS-CAP-0028', 'Platform status capability');
  assertEqual(platformStatusResult.body.version, expectedStatus.version, 'Platform status version');

  const platformAdminResult = await requestJson('/api/platform/admin');
  assertOk(platformAdminResult);
  assertPlatformAdminPayload(platformAdminResult.body);

  const platformNavigationResult = await requestJson('/api/platform/navigation');
  assertOk(platformNavigationResult);
  assertEqual(platformNavigationResult.body.capability, 'EOS-CAP-0028', 'Platform navigation capability');
  if (platformNavigationResult.body.count !== 8) {
    throw new Error(`Expected 8 navigation domains, received ${platformNavigationResult.body.count}`);
  }

  const navigationRoutes = platformNavigationResult.body.navigation.flatMap((domain) =>
    domain.items.map((item) => item.route)
  );
  for (const route of [
    'investment-thesis',
    'master-monitoring',
    'onboarded-enterprises',
    'technology-flywheel',
    'three-horizon-roadmap',
    'revenue-engine',
    'dta-lifecycle',
    'enterprise-home',
    'digital-twin-structure',
    'data-feeds',
    'systems',
    'enterprise-assets',
    'human-workflows',
    'kipr',
    'enterprise-profile',
    'industry-framework',
    'investor-readiness',
    'commercial-readiness',
    'audit',
    'startup-experience',
    'identity-media',
    'organization-intake',
    'repository-links',
    'white-papers',
    'academic-papers',
    'patents',
    'publications',
    'briefing',
    'tasks',
    'decisions',
    'notes'
  ]) {
    if (!navigationRoutes.includes(route)) {
      throw new Error(`Platform navigation must include route ${route}`);
    }
  }

  const auditResult = await requestJson('/api/audit');
  assertOk(auditResult);
  assertEqual(auditResult.body.capability, 'EOS-CAP-0033', 'Platform Audit capability');
  assertEqual(auditResult.body.auditVersion, expectedStatus.version, 'Platform Audit version');
  if (auditResult.body.summary.capabilitiesAudited < 20) {
    throw new Error('Platform Audit must include a substantial capability readiness matrix');
  }
  if (auditResult.body.summary.broken !== 0) {
    throw new Error('Platform Audit must not report broken items in the current verified build');
  }
  if (auditResult.body.summary.alphaReadiness < 60) {
    throw new Error('Platform Audit Alpha readiness score must reflect current Alpha foundation maturity');
  }
  for (const field of [
    'statusTaxonomy',
    'capabilityReadinessMatrix',
    'apiCoverage',
    'frontendRouteCoverage',
    'dataPersistenceHealth',
    'placeholderRegister',
    'technicalDebtRegister',
    'readinessScores',
    'qualityGates',
    'recommendedBuildSequence',
    'liveStatus'
  ]) {
    if (!(field in auditResult.body)) {
      throw new Error(`Platform Audit payload is missing ${field}`);
    }
  }
  assertLiveStatus(auditResult.body.auditId, auditResult.body.liveStatus);
  if (!auditResult.body.apiCoverage.some((group) => group.endpoints.includes('/api/audit'))) {
    throw new Error('Platform Audit API coverage must include /api/audit');
  }
  if (!auditResult.body.frontendRouteCoverage.some((group) => group.routes.includes('audit'))) {
    throw new Error('Platform Audit route coverage must include the audit route');
  }

  const adminActionsResult = await requestJson('/api/admin-actions');
  assertOk(adminActionsResult);
  assertEqual(adminActionsResult.body.capability, 'EOS-CAP-0027', 'Admin Actions capability');
  if (adminActionsResult.body.executionEnabled !== false) {
    throw new Error('/api/admin-actions must keep execution disabled');
  }
  assertEqual(
    adminActionsResult.body.actions.map((action) => action.id),
    expectedAdminActionIds,
    'Admin Action ids'
  );
  for (const action of adminActionsResult.body.actions) {
    assertAdminAction(action);
  }

  const restoreBackupActionResult = await requestJson('/api/admin-actions/EOS-ADMIN-ACTION-RESTORE-BACKUP');
  assertOk(restoreBackupActionResult);
  assertAdminAction(restoreBackupActionResult.body);
  if (restoreBackupActionResult.body.executionMode !== 'Governed Display Only') {
    throw new Error('Restore Backup admin action must be governed display only');
  }

  const agentMessagesResult = await requestJson('/api/agent-messages');
  assertOk(agentMessagesResult);
  assertEqual(agentMessagesResult.body.capability, 'EOS-CAP-0027', 'Agent Messages capability');
  if (agentMessagesResult.body.count !== 5) {
    throw new Error(`Expected 5 agent messages, received ${agentMessagesResult.body.count}`);
  }
  for (const message of agentMessagesResult.body.messages) {
    assertAgentMessage(message);
  }

  const agentMessageLookupResult = await requestJson('/api/agent-messages/EOS-MSG-CODEX-001');
  assertOk(agentMessageLookupResult);
  assertAgentMessage(agentMessageLookupResult.body);

  const agentThreadResult = await requestJson('/api/agent-messages/threads/EOS-THREAD-CODEX-BUILD-001');
  assertOk(agentThreadResult);
  if (agentThreadResult.body.count !== 2) {
    throw new Error('Codex build message thread must include 2 messages');
  }

  const agentActivityResult = await requestJson('/api/agent-activity');
  assertOk(agentActivityResult);
  assertEqual(agentActivityResult.body.capability, 'EOS-CAP-0027', 'Agent Activity capability');
  if (agentActivityResult.body.count !== 4) {
    throw new Error(`Expected 4 agent activity records, received ${agentActivityResult.body.count}`);
  }
  for (const activityRecord of agentActivityResult.body.activity) {
    assertAgentActivityRecord(activityRecord);
  }

  const agentAttentionResult = await requestJson('/api/agent-attention');
  assertOk(agentAttentionResult);
  assertEqual(agentAttentionResult.body.capability, 'EOS-CAP-0027', 'Agent Attention capability');
  if (agentAttentionResult.body.count !== 3) {
    throw new Error(`Expected 3 agent attention records, received ${agentAttentionResult.body.count}`);
  }
  for (const attentionItem of agentAttentionResult.body.attention) {
    assertAttentionItem(attentionItem);
  }

  const agentCalendarResult = await requestJson('/api/agent-calendar');
  assertOk(agentCalendarResult);
  assertEqual(agentCalendarResult.body.capability, 'EOS-CAP-0027', 'Agent Calendar capability');
  if (agentCalendarResult.body.count !== 7) {
    throw new Error(`Expected 7 agent calendar events, received ${agentCalendarResult.body.count}`);
  }
  for (const calendarEvent of agentCalendarResult.body.calendar) {
    assertCalendarEvent(calendarEvent);
  }

  const executiveCouncilResult = await requestJson('/api/executive-council');
  assertOk(executiveCouncilResult);
  assertExecutiveCouncilPayload(executiveCouncilResult.body);

  const ericProfileResult = await requestJson('/api/executive-council/EOS-EXEC-ERIC-OLO');
  assertOk(ericProfileResult);
  assertExecutiveProfile(ericProfileResult.body);
  assertEqual(ericProfileResult.body.name, 'Eric Olo', 'Eric Olo executive profile lookup');

  const codexExecutiveProfileResult = await requestJson('/api/executive-council/EOS-AGENT-CODEX');
  assertOk(codexExecutiveProfileResult);
  assertExecutiveProfile(codexExecutiveProfileResult.body);
  assertEqual(codexExecutiveProfileResult.body.id, 'EOS-AGENT-CODEX', 'Codex executive profile lookup');

  const executiveActionsResult = await requestJson('/api/executive-actions');
  assertOk(executiveActionsResult);
  assertExecutiveActionsPayload(executiveActionsResult.body);

  const pendingApprovalResult = await requestJson('/api/executive-actions/pending-approval');
  assertOk(pendingApprovalResult);
  assertPendingApprovalPayload(pendingApprovalResult.body);

  const executiveActionLookupResult = await requestJson('/api/executive-actions/EOS-ACTION-ERIC-OLO-REQUEST-BRIEFING');
  assertOk(executiveActionLookupResult);
  assertExecutiveAction(executiveActionLookupResult.body);
  assertEqual(
    executiveActionLookupResult.body.id,
    'EOS-ACTION-ERIC-OLO-REQUEST-BRIEFING',
    'Executive Action lookup id'
  );

  const executiveOfficesResult = await requestJson('/api/executive-offices');
  assertOk(executiveOfficesResult);
  assertExecutiveOfficesPayload(executiveOfficesResult.body);

  const codexOfficeResult = await requestJson('/api/executive-offices/EOS-AGENT-CODEX');
  assertOk(codexOfficeResult);
  assertExecutiveOffice(codexOfficeResult.body);
  assertEqual(codexOfficeResult.body.executiveId, 'EOS-AGENT-CODEX', 'Codex Executive Office lookup id');

  const repositoriesResult = await requestJson('/api/knowledge-repositories');
  assertOk(repositoriesResult);

  if (repositoriesResult.body.capability !== 'EOS-CAP-0015') {
    throw new Error(`Expected EOS-CAP-0015 capability, received ${repositoriesResult.body.capability}`);
  }

  if (repositoriesResult.body.repository !== 'EOS-AKR') {
    throw new Error(`Expected EOS-AKR repository, received ${repositoriesResult.body.repository}`);
  }

  if (repositoriesResult.body.count !== expectedRepositoryAgents.length) {
    throw new Error(`Expected ${expectedRepositoryAgents.length} Agent Knowledge Repositories, received ${repositoriesResult.body.count}`);
  }

  if (!Array.isArray(repositoriesResult.body.repositories)) {
    throw new Error('/api/knowledge-repositories response must include a repositories array');
  }

  for (const repository of repositoriesResult.body.repositories) {
    assertKnowledgeRepository(repository);
  }

  const actualRepositoryAgents = repositoriesResult.body.repositories.map((repository) => repository.agentName);
  assertEqual(actualRepositoryAgents, expectedRepositoryAgents, 'Agent Knowledge Repository agents');

  const athenaRepositoryResult = await requestJson('/api/knowledge-repositories/Athena');
  assertOk(athenaRepositoryResult);
  assertKnowledgeRepository(athenaRepositoryResult.body);
  assertEqual(athenaRepositoryResult.body.agentName, 'Athena', 'Athena repository lookup');

  if (athenaRepositoryResult.body.knowledgeObjectCount !== expectedAgentKnowledgeObjectIds.length) {
    throw new Error('Athena repository must include the seeded research projects');
  }

  const agentKnowledgeObjectsResult = await requestJson('/api/knowledge-objects');
  assertOk(agentKnowledgeObjectsResult);

  if (agentKnowledgeObjectsResult.body.capability !== 'EOS-CAP-0015') {
    throw new Error(`Expected EOS-CAP-0015 capability, received ${agentKnowledgeObjectsResult.body.capability}`);
  }

  if (agentKnowledgeObjectsResult.body.count !== expectedAgentKnowledgeObjectIds.length) {
    throw new Error(
      `Expected ${expectedAgentKnowledgeObjectIds.length} Agent Knowledge Objects, received ${agentKnowledgeObjectsResult.body.count}`
    );
  }

  if (!Array.isArray(agentKnowledgeObjectsResult.body.knowledgeObjects)) {
    throw new Error('/api/knowledge-objects response must include a knowledgeObjects array');
  }

  const actualAgentKnowledgeObjectIds = agentKnowledgeObjectsResult.body.knowledgeObjects.map(
    (knowledgeObject) => knowledgeObject.id
  );
  assertEqual(actualAgentKnowledgeObjectIds, expectedAgentKnowledgeObjectIds, 'Agent Knowledge Object ids');

  for (const knowledgeObject of agentKnowledgeObjectsResult.body.knowledgeObjects) {
    assertAgentKnowledgeObject(knowledgeObject);
  }

  const researchProjectResult = await requestJson('/api/knowledge-objects/RP-001');
  assertOk(researchProjectResult);
  assertAgentKnowledgeObject(researchProjectResult.body);
  assertEqual(researchProjectResult.body.id, 'RP-001', 'Agent Knowledge Object lookup id');

  if (researchProjectResult.body.liveStatus.operationalStatus !== 'Green') {
    throw new Error('RP-001 must expose Green operational status');
  }

  if (researchProjectResult.body.liveStatus.lifecycleStatus !== 'Draft') {
    throw new Error('RP-001 must expose Draft lifecycle status');
  }

  if (!researchProjectResult.body.previewContent.executiveSummary.includes('Live Enterprise Object')) {
    throw new Error('RP-001 preview content must include a Live Enterprise Object executive summary');
  }

  const workflowsResult = await requestJson('/api/workflows');
  assertOk(workflowsResult);

  if (workflowsResult.body.capability !== 'EOS-CAP-0007') {
    throw new Error(`Expected EOS-CAP-0007 capability, received ${workflowsResult.body.capability}`);
  }

  if (workflowsResult.body.eventModel !== 'EOS Events') {
    throw new Error(`Expected EOS Events event model, received ${workflowsResult.body.eventModel}`);
  }

  assertEqual(workflowsResult.body.eventTypes, expectedEventTypes, 'Workflow event types');

  if (workflowsResult.body.count !== expectedWorkflowIds.length) {
    throw new Error(`Expected ${expectedWorkflowIds.length} workflows, received ${workflowsResult.body.count}`);
  }

  if (!Array.isArray(workflowsResult.body.workflows)) {
    throw new Error('/api/workflows response must include a workflows array');
  }

  for (const workflow of workflowsResult.body.workflows) {
    assertWorkflow(workflow);
  }

  const actualWorkflowIds = workflowsResult.body.workflows.map((workflow) => workflow.id);
  assertEqual(actualWorkflowIds, expectedWorkflowIds, 'Workflow ids');

  const workflowLookupResult = await requestJson('/api/workflows/EOS-WF-RESEARCH-PUBLICATION');
  assertOk(workflowLookupResult);
  assertWorkflow(workflowLookupResult.body);
  assertEqual(workflowLookupResult.body.id, 'EOS-WF-RESEARCH-PUBLICATION', 'Workflow lookup id');

  const knowledgeAssetViewerWorkflowResult = await requestJson('/api/workflows/EOS-WF-KNOWLEDGE-ASSET-VIEWER');
  assertOk(knowledgeAssetViewerWorkflowResult);
  assertWorkflow(knowledgeAssetViewerWorkflowResult.body);
  assertEqual(
    knowledgeAssetViewerWorkflowResult.body.id,
    'EOS-WF-KNOWLEDGE-ASSET-VIEWER',
    'Knowledge Asset Viewer workflow lookup id'
  );

  const programManagementWorkflowResult = await requestJson('/api/workflows/EOS-WF-PROGRAM-MANAGEMENT');
  assertOk(programManagementWorkflowResult);
  assertWorkflow(programManagementWorkflowResult.body);
  assertEqual(
    programManagementWorkflowResult.body.id,
    'EOS-WF-PROGRAM-MANAGEMENT',
    'Program Management workflow lookup id'
  );

  const executiveCouncilWorkflowResult = await requestJson('/api/workflows/EOS-WF-EXECUTIVE-COUNCIL-GOVERNANCE');
  assertOk(executiveCouncilWorkflowResult);
  assertWorkflow(executiveCouncilWorkflowResult.body);
  assertEqual(
    executiveCouncilWorkflowResult.body.id,
    'EOS-WF-EXECUTIVE-COUNCIL-GOVERNANCE',
    'Executive Council Governance workflow lookup id'
  );

  const executiveActionWorkflowResult = await requestJson('/api/workflows/EOS-WF-EXECUTIVE-ACTION-GOVERNANCE');
  assertOk(executiveActionWorkflowResult);
  assertWorkflow(executiveActionWorkflowResult.body);
  assertEqual(
    executiveActionWorkflowResult.body.id,
    'EOS-WF-EXECUTIVE-ACTION-GOVERNANCE',
    'Executive Action Governance workflow lookup id'
  );

  const executiveOfficeWorkflowResult = await requestJson('/api/workflows/EOS-WF-EXECUTIVE-OFFICE-MANAGEMENT');
  assertOk(executiveOfficeWorkflowResult);
  assertWorkflow(executiveOfficeWorkflowResult.body);
  assertEqual(
    executiveOfficeWorkflowResult.body.id,
    'EOS-WF-EXECUTIVE-OFFICE-MANAGEMENT',
    'Executive Office Management workflow lookup id'
  );

  const designGovernanceWorkflowResult = await requestJson('/api/workflows/EOS-WF-DESIGN-GOVERNANCE');
  assertOk(designGovernanceWorkflowResult);
  assertWorkflow(designGovernanceWorkflowResult.body);
  assertEqual(
    designGovernanceWorkflowResult.body.id,
    'EOS-WF-DESIGN-GOVERNANCE',
    'Design Governance workflow lookup id'
  );

  const persistentDataWorkflowResult = await requestJson('/api/workflows/EOS-WF-PERSISTENT-DATA-MANAGEMENT');
  assertOk(persistentDataWorkflowResult);
  assertWorkflow(persistentDataWorkflowResult.body);
  assertEqual(
    persistentDataWorkflowResult.body.id,
    'EOS-WF-PERSISTENT-DATA-MANAGEMENT',
    'Persistent Data Management workflow lookup id'
  );

  const strategyGovernanceWorkflowResult = await requestJson('/api/workflows/EOS-WF-STRATEGY-GOVERNANCE-VALUATION');
  assertOk(strategyGovernanceWorkflowResult);
  assertWorkflow(strategyGovernanceWorkflowResult.body);
  assertEqual(
    strategyGovernanceWorkflowResult.body.id,
    'EOS-WF-STRATEGY-GOVERNANCE-VALUATION',
    'Strategy Governance Valuation workflow lookup id'
  );

  for (const workflowId of [
    'EOS-WF-PLATFORM-OPERATIONS-GOVERNANCE',
    'EOS-WF-AGENT-COMMUNICATION',
    'EOS-WF-AGENT-ACTIVITY-MONITORING',
    'EOS-WF-AGENT-CALENDAR-MANAGEMENT',
    'EOS-WF-ACTION-AUTHORIZATION'
  ]) {
    const platformWorkflowResult = await requestJson(`/api/workflows/${workflowId}`);
    assertOk(platformWorkflowResult);
    assertWorkflow(platformWorkflowResult.body);
    assertEqual(platformWorkflowResult.body.id, workflowId, `${workflowId} lookup id`);
  }

  const eventsResult = await requestJson('/api/events');
  assertOk(eventsResult);

  if (eventsResult.body.capability !== 'EOS-CAP-0007') {
    throw new Error(`Expected EOS-CAP-0007 capability, received ${eventsResult.body.capability}`);
  }

  if (eventsResult.body.eventModel !== 'EOS Events') {
    throw new Error(`Expected EOS Events event model, received ${eventsResult.body.eventModel}`);
  }

  assertEqual(eventsResult.body.eventTypes, expectedEventTypes, 'EOS Event types');

  if (eventsResult.body.count !== expectedEventIds.length) {
    throw new Error(`Expected ${expectedEventIds.length} EOS Events, received ${eventsResult.body.count}`);
  }

  if (!Array.isArray(eventsResult.body.events)) {
    throw new Error('/api/events response must include an events array');
  }

  const actualEventIds = eventsResult.body.events.map((event) => event.id);
  assertEqual(actualEventIds, expectedEventIds, 'EOS Event ids');

  for (const event of eventsResult.body.events) {
    if (!expectedEventTypes.includes(event.type)) {
      throw new Error(`Unexpected EOS Event type ${event.type}`);
    }

    assertWorkflowEvent(event, event.sourceWorkflowId);
  }

  const actualEventTypes = new Set(eventsResult.body.events.map((event) => event.type));

  for (const eventType of expectedEventTypes) {
    if (!actualEventTypes.has(eventType)) {
      throw new Error(`Expected at least one emitted EOS Event of type ${eventType}`);
    }
  }

  const eventLookupResult = await requestJson('/api/events/EOS-EVENT-RESEARCH-PUBLICATION-STARTED');
  assertOk(eventLookupResult);
  assertWorkflowEvent(eventLookupResult.body, 'EOS-WF-RESEARCH-PUBLICATION');
  assertEqual(eventLookupResult.body.id, 'EOS-EVENT-RESEARCH-PUBLICATION-STARTED', 'EOS Event lookup id');

  const knowledgeAssetEventResult = await requestJson('/api/events/EOS-EVENT-KNOWLEDGE-ASSET-VIEWED');
  assertOk(knowledgeAssetEventResult);
  assertWorkflowEvent(knowledgeAssetEventResult.body, 'EOS-WF-KNOWLEDGE-ASSET-VIEWER');
  assertEqual(
    knowledgeAssetEventResult.body.id,
    'EOS-EVENT-KNOWLEDGE-ASSET-VIEWED',
    'Knowledge Asset Viewer event lookup id'
  );

  const pmoEventResult = await requestJson('/api/events/EOS-EVENT-PMO-ROADMAP-UPDATED');
  assertOk(pmoEventResult);
  assertWorkflowEvent(pmoEventResult.body, 'EOS-WF-PROGRAM-MANAGEMENT');
  assertEqual(pmoEventResult.body.id, 'EOS-EVENT-PMO-ROADMAP-UPDATED', 'PMO roadmap event lookup id');

  const executiveCouncilEventResult = await requestJson('/api/events/EOS-EVENT-EXECUTIVE-COUNCIL-CREATED');
  assertOk(executiveCouncilEventResult);
  assertWorkflowEvent(executiveCouncilEventResult.body, 'EOS-WF-EXECUTIVE-COUNCIL-GOVERNANCE');
  assertEqual(
    executiveCouncilEventResult.body.id,
    'EOS-EVENT-EXECUTIVE-COUNCIL-CREATED',
    'Executive Council event lookup id'
  );

  const executiveActionEventResult = await requestJson('/api/events/EOS-EVENT-EXECUTIVE-ACTION-CREATED');
  assertOk(executiveActionEventResult);
  assertWorkflowEvent(executiveActionEventResult.body, 'EOS-WF-EXECUTIVE-ACTION-GOVERNANCE');
  assertEqual(
    executiveActionEventResult.body.id,
    'EOS-EVENT-EXECUTIVE-ACTION-CREATED',
    'Executive Action event lookup id'
  );

  const executiveOfficeEventResult = await requestJson('/api/events/EOS-EVENT-EXECUTIVE-OFFICE-OPENED');
  assertOk(executiveOfficeEventResult);
  assertWorkflowEvent(executiveOfficeEventResult.body, 'EOS-WF-EXECUTIVE-OFFICE-MANAGEMENT');
  assertEqual(
    executiveOfficeEventResult.body.id,
    'EOS-EVENT-EXECUTIVE-OFFICE-OPENED',
    'Executive Office event lookup id'
  );

  const designSystemEventResult = await requestJson('/api/events/EOS-EVENT-DESIGN-SYSTEM-CREATED');
  assertOk(designSystemEventResult);
  assertWorkflowEvent(designSystemEventResult.body, 'EOS-WF-DESIGN-GOVERNANCE');
  assertEqual(
    designSystemEventResult.body.id,
    'EOS-EVENT-DESIGN-SYSTEM-CREATED',
    'Design System event lookup id'
  );

  const persistentStoreEventResult = await requestJson('/api/events/EOS-EVENT-PERSISTENT-STORE-CREATED');
  assertOk(persistentStoreEventResult);
  assertWorkflowEvent(persistentStoreEventResult.body, 'EOS-WF-PERSISTENT-DATA-MANAGEMENT');
  assertEqual(
    persistentStoreEventResult.body.id,
    'EOS-EVENT-PERSISTENT-STORE-CREATED',
    'Persistent Data Store event lookup id'
  );

  const strategyEventResult = await requestJson('/api/events/EOS-EVENT-STRATEGY-CREATED');
  assertOk(strategyEventResult);
  assertWorkflowEvent(strategyEventResult.body, 'EOS-WF-STRATEGY-GOVERNANCE-VALUATION');
  assertEqual(
    strategyEventResult.body.id,
    'EOS-EVENT-STRATEGY-CREATED',
    'Strategy Created event lookup id'
  );

  const platformAdminEventResult = await requestJson('/api/events/EOS-EVENT-PLATFORM-ADMIN-CENTER-CREATED');
  assertOk(platformAdminEventResult);
  assertWorkflowEvent(platformAdminEventResult.body, 'EOS-WF-PLATFORM-OPERATIONS-GOVERNANCE');
  assertEqual(
    platformAdminEventResult.body.id,
    'EOS-EVENT-PLATFORM-ADMIN-CENTER-CREATED',
    'Platform Admin Center event lookup id'
  );

  const startupExperienceEventResult = await requestJson('/api/events/EOS-EVENT-STARTUP-EXPERIENCE-LOADED');
  assertOk(startupExperienceEventResult);
  assertWorkflowEvent(startupExperienceEventResult.body, 'EOS-WF-ORGANIZATION-INTAKE');
  assertEqual(
    startupExperienceEventResult.body.id,
    'EOS-EVENT-STARTUP-EXPERIENCE-LOADED',
    'Startup Experience event lookup id'
  );

  const onboardingStartedEventResult = await requestJson('/api/events/EOS-EVENT-ENTERPRISE-ONBOARDING-STARTED');
  assertOk(onboardingStartedEventResult);
  assertWorkflowEvent(onboardingStartedEventResult.body, 'EOS-WF-ENTERPRISE-ONBOARDING');
  assertEqual(
    onboardingStartedEventResult.body.id,
    'EOS-EVENT-ENTERPRISE-ONBOARDING-STARTED',
    'Enterprise Onboarding event lookup id'
  );

  const auditCreatedEventResult = await requestJson('/api/events/EOS-EVENT-PLATFORM-AUDIT-CREATED');
  assertOk(auditCreatedEventResult);
  assertWorkflowEvent(auditCreatedEventResult.body, 'EOS-WF-PLATFORM-AUDIT-READINESS');
  assertEqual(
    auditCreatedEventResult.body.id,
    'EOS-EVENT-PLATFORM-AUDIT-CREATED',
    'Platform Audit event lookup id'
  );

  console.log(
    `EOS Core API checks passed: ${baseUrl}/api/status, ${baseUrl}/api/objects, ${baseUrl}/api/agents, ${baseUrl}/api/knowledge, ${baseUrl}/api/executive-council, ${baseUrl}/api/executive-actions, ${baseUrl}/api/executive-offices, ${baseUrl}/api/pmo, ${baseUrl}/api/strategy, ${baseUrl}/api/governance, ${baseUrl}/api/valuation, ${baseUrl}/api/second-balance-sheet, ${baseUrl}/api/digital-twin-assets, ${baseUrl}/api/onboarding, ${baseUrl}/api/onboarding-assimilation, ${baseUrl}/api/digital-mirrors, ${baseUrl}/api/dta-candidates, ${baseUrl}/api/data-feed-requirements, ${baseUrl}/api/human-validation, ${baseUrl}/api/storage/status, ${baseUrl}/api/storage/collections, ${baseUrl}/api/startup, ${baseUrl}/api/identity-media, ${baseUrl}/api/organization-intake, ${baseUrl}/api/repository-links, ${baseUrl}/api/audit, ${baseUrl}/api/knowledge-repositories, ${baseUrl}/api/knowledge-objects, ${baseUrl}/api/workflows, and ${baseUrl}/api/events`
  );
} finally {
  if (server) {
    server.kill('SIGTERM');
  }
}

if (server) {
  await serverExit;
}

if (serverOutput.trim()) {
  console.log(serverOutput.trim());
}
