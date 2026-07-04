import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const backupStatusFile = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', 'backups', 'backup-status.json');

function readBackupStatus() {
  try {
    return JSON.parse(readFileSync(backupStatusFile, 'utf8'));
  } catch {
    return null;
  }
}

function makeLiveStatus({
  status,
  lifecycleStatus,
  healthScore,
  progress,
  summary,
  requiresAttention,
  attentionLevel,
  recommendedAction,
  availableActions,
  lastActivity = new Date().toISOString()
}) {
  return {
    status,
    operationalStatus: status,
    lifecycleStatus,
    healthScore,
    progress,
    summary,
    lastActivity,
    requiresAttention,
    attentionLevel,
    recommendedAction,
    availableActions
  };
}

function backupLiveStatus() {
  const backupStatus = readBackupStatus();
  const restoreValidationStatus = backupStatus?.latestRestoreValidationStatus ?? 'Not validated';
  const lastActivity = backupStatus?.lastUpdated ?? new Date().toISOString();

  if (restoreValidationStatus === 'Validated') {
    return makeLiveStatus({
      status: 'Green',
      lifecycleStatus: 'Verified',
      healthScore: 96,
      progress: 100,
      summary: 'Backup archive and restore validation are current.',
      requiresAttention: false,
      attentionLevel: 'No Action Required',
      recommendedAction: 'Continue scheduled backup verification.',
      availableActions: ['Create backup', 'Review backup log', 'Review restore report'],
      lastActivity
    });
  }

  return makeLiveStatus({
    status: 'Amber',
    lifecycleStatus: 'Pending Assessment',
    healthScore: 78,
    progress: 90,
    summary: 'Backups are available, but restore validation has not been completed.',
    requiresAttention: true,
    attentionLevel: 'Medium',
    recommendedAction: 'Run restore validation for the latest backup before relying on remote synchronization.',
    availableActions: ['Validate latest restore', 'Create backup', 'Review backup log'],
    lastActivity
  });
}

function informationalLiveStatus(enterpriseObject) {
  return makeLiveStatus({
    status: 'Blue',
    lifecycleStatus: 'Defined',
    healthScore: 90,
    progress: 100,
    summary: `${enterpriseObject.name} is available as an informational governance object.`,
    requiresAttention: false,
    attentionLevel: 'No Action Required',
    recommendedAction: 'Review when related governance or knowledge changes are made.',
    availableActions: ['View details', 'Review linked objects']
  });
}

function operationalLiveStatus(enterpriseObject) {
  return makeLiveStatus({
    status: 'Green',
    lifecycleStatus: 'Verified',
    healthScore: 95,
    progress: 100,
    summary: `${enterpriseObject.name} is operational and verified.`,
    requiresAttention: false,
    attentionLevel: 'No Action Required',
    recommendedAction: 'No action required.',
    availableActions: ['View details', 'Review linked objects']
  });
}

function workflowLiveStatus(enterpriseObject) {
  return makeLiveStatus({
    status: 'Green',
    lifecycleStatus: 'Verified',
    healthScore: 94,
    progress: 100,
    summary: `${enterpriseObject.name} workflow is registered and emitting status events.`,
    requiresAttention: false,
    attentionLevel: 'No Action Required',
    recommendedAction: 'Monitor workflow events during capability execution.',
    availableActions: ['View workflow', 'Review events', 'Review linked objects']
  });
}

function pmoLiveStatus() {
  return makeLiveStatus({
    status: 'Green',
    lifecycleStatus: 'Verified',
    healthScore: 91,
    progress: 82,
    summary: 'EOS PMO is operational and governing roadmap execution.',
    requiresAttention: false,
    attentionLevel: 'No Action Required',
    recommendedAction: 'Use PMO View to review roadmap health, milestones, risks, and program ownership.',
    availableActions: ['Open PMO View', 'Review roadmap', 'Review risks', 'Review milestones']
  });
}

function masterRoadmapLiveStatus() {
  return makeLiveStatus({
    status: 'Amber',
    lifecycleStatus: 'In Progress',
    healthScore: 86,
    progress: 48,
    summary: 'Master Roadmap is active and tracking EOS programs, dependencies, risks, and milestones.',
    requiresAttention: true,
    attentionLevel: 'Low',
    recommendedAction: 'Prioritize search, persistence, and executable action capabilities in the next roadmap cycle.',
    availableActions: ['Open roadmap', 'Review programs', 'Review risks', 'Update roadmap']
  });
}

function executiveCouncilLiveStatus() {
  return makeLiveStatus({
    status: 'Amber',
    lifecycleStatus: 'In Progress',
    healthScore: 88,
    progress: 58,
    summary: 'Executive Council is established and surfacing leadership status in Mission Control.',
    requiresAttention: true,
    attentionLevel: 'Low',
    recommendedAction: 'Review executives requiring attention and approve the next operating layer.',
    availableActions: ['Open council', 'Review executives', 'Request briefing', 'View portfolio']
  });
}

function digitalHeadquartersLiveStatus() {
  return makeLiveStatus({
    status: 'Amber',
    lifecycleStatus: 'Building',
    healthScore: 84,
    progress: 41,
    summary: 'Digital Enterprise Headquarters foundation is active in Mission Control.',
    requiresAttention: true,
    attentionLevel: 'Low',
    recommendedAction: 'Add executable executive actions after governance and approval workflows are defined.',
    availableActions: ['Open headquarters', 'Review council', 'Open PMO View', 'Review attention']
  });
}

function executiveActionFrameworkLiveStatus() {
  return makeLiveStatus({
    status: 'Amber',
    lifecycleStatus: 'Building',
    healthScore: 86,
    progress: 52,
    summary: 'Executive action governance is active and execution is disabled by design.',
    requiresAttention: true,
    attentionLevel: 'Low',
    recommendedAction: 'Review action approval queues and audit trails before enabling execution capabilities.',
    availableActions: ['Review actions', 'Open approval queue', 'Review audit trail']
  });
}

function approvalQueueLiveStatus() {
  return makeLiveStatus({
    status: 'Amber',
    lifecycleStatus: 'In Progress',
    healthScore: 84,
    progress: 46,
    summary: 'Approval queue is tracking pending, escalated, approved, rejected, and deferred executive actions.',
    requiresAttention: true,
    attentionLevel: 'Medium',
    recommendedAction: 'Review pending and escalated actions before introducing command execution.',
    availableActions: ['Review pending approvals', 'Review high risk actions', 'Review audit trail']
  });
}

function executiveOfficeFrameworkLiveStatus() {
  return makeLiveStatus({
    status: 'Amber',
    lifecycleStatus: 'Building',
    healthScore: 87,
    progress: 57,
    summary: 'Executive Office Framework is active with reusable office routing and department-specific office views.',
    requiresAttention: true,
    attentionLevel: 'Low',
    recommendedAction: 'Review executive offices and prioritize persistence before editable office operations.',
    availableActions: ['Open Executive Offices', 'Review CEO attention', 'Review department portfolios']
  });
}

function designSystemLiveStatus() {
  return makeLiveStatus({
    status: 'Green',
    lifecycleStatus: 'Verified',
    healthScore: 91,
    progress: 72,
    summary: 'EOS Enterprise Design System is active with tokens, executive language, hover intelligence, and presentation standards.',
    requiresAttention: false,
    attentionLevel: 'No Action Required',
    recommendedAction: 'Apply the five quality gates to every future capability.',
    availableActions: ['Review design standards', 'Review UX audit', 'Enable presentation mode']
  });
}

function presentationModeLiveStatus() {
  return makeLiveStatus({
    status: 'Green',
    lifecycleStatus: 'Verified',
    healthScore: 89,
    progress: 68,
    summary: 'Executive Presentation Mode is available in Mission Control for boardroom-ready demonstrations.',
    requiresAttention: false,
    attentionLevel: 'No Action Required',
    recommendedAction: 'Use presentation mode for investor, board, and enterprise demos.',
    availableActions: ['Enable presentation mode', 'Review executive screens', 'Review investor readiness']
  });
}

function uxAuditLiveStatus() {
  return makeLiveStatus({
    status: 'Amber',
    lifecycleStatus: 'Review',
    healthScore: 86,
    progress: 64,
    summary: 'UX audit is complete for current Mission Control screens and should be repeated after major UI capabilities.',
    requiresAttention: true,
    attentionLevel: 'Low',
    recommendedAction: 'Prioritize visual QA automation and persistent design governance.',
    availableActions: ['Review UX audit report', 'Review accessibility', 'Review consistency']
  });
}

function persistentDataStoreLiveStatus() {
  return makeLiveStatus({
    status: 'Amber',
    lifecycleStatus: 'In Progress',
    healthScore: 88,
    progress: 66,
    summary: 'Persistent Data Store is active with local JSON collections and seed fallback.',
    requiresAttention: true,
    attentionLevel: 'Low',
    recommendedAction: 'Review storage health and plan PostgreSQL migration before production pilots.',
    availableActions: ['Review storage health', 'Review collections', 'Create storage snapshot']
  });
}

function storageHealthLiveStatus() {
  return makeLiveStatus({
    status: 'Green',
    lifecycleStatus: 'Verified',
    healthScore: 91,
    progress: 74,
    summary: 'Storage Health reports collection availability, record counts, snapshots, and warnings.',
    requiresAttention: false,
    attentionLevel: 'No Action Required',
    recommendedAction: 'Monitor storage health after every capability that changes platform data.',
    availableActions: ['Open storage status', 'Review collections', 'Review warnings']
  });
}

function enterpriseStrategyLiveStatus() {
  return makeLiveStatus({
    status: 'Amber',
    lifecycleStatus: 'Review',
    healthScore: 86,
    progress: 58,
    summary: 'Enterprise Strategy is defined and awaiting governance review.',
    requiresAttention: true,
    attentionLevel: 'Medium',
    recommendedAction: 'Review and approve strategic objectives before external investor use.',
    availableActions: ['Review strategy', 'Review roadmap alignment', 'Request governance review']
  });
}

function governanceCouncilLiveStatus() {
  return makeLiveStatus({
    status: 'Amber',
    lifecycleStatus: 'Review',
    healthScore: 82,
    progress: 45,
    summary: 'Governance Council is tracking strategy, roadmap, valuation, and Second Balance Sheet approvals.',
    requiresAttention: true,
    attentionLevel: 'Medium',
    recommendedAction: 'Schedule governance review for open strategy and valuation items.',
    availableActions: ['Review approvals', 'Review governance items', 'Review strategy']
  });
}

function digitalEnterpriseValuationLiveStatus() {
  return makeLiveStatus({
    status: 'Amber',
    lifecycleStatus: 'Draft',
    healthScore: 74,
    progress: 34,
    summary: 'Digital Enterprise Valuation is an internal estimate only, not an audited valuation.',
    requiresAttention: true,
    attentionLevel: 'High',
    recommendedAction: 'Keep valuation clearly marked as internal estimate until financial review is complete.',
    availableActions: ['Review valuation assumptions', 'Review value drivers', 'Request governance review']
  });
}

function secondBalanceSheetLiveStatus() {
  return makeLiveStatus({
    status: 'Amber',
    lifecycleStatus: 'Draft',
    healthScore: 78,
    progress: 42,
    summary: 'Second Balance Sheet metrics are active as a draft internal methodology.',
    requiresAttention: true,
    attentionLevel: 'Medium',
    recommendedAction: 'Review methodology before external reporting or financial interpretation.',
    availableActions: ['Review metrics', 'Review methodology', 'Prepare research note']
  });
}

function dtaMonitoringLiveStatus() {
  return makeLiveStatus({
    status: 'Amber',
    lifecycleStatus: 'In Progress',
    healthScore: 81,
    progress: 46,
    summary: 'DTA monitoring is active with ePercent in formation and EOS under active monitoring.',
    requiresAttention: true,
    attentionLevel: 'Medium',
    recommendedAction: 'Define DTA valuation criteria before commercialization.',
    availableActions: ['Review DTA candidates', 'Review valuation status', 'Request governance review']
  });
}

function digitalTwinAssetLiveStatus(enterpriseObject) {
  const isFormation = enterpriseObject.id === 'DTA-EPERCENT-001';

  return makeLiveStatus({
    status: isFormation ? 'Amber' : 'Green',
    lifecycleStatus: isFormation ? 'Building' : 'In Progress',
    healthScore: isFormation ? 76 : 88,
    progress: isFormation ? 38 : 62,
    summary: `${enterpriseObject.name} is ${isFormation ? 'in formation' : 'under active monitoring'} as a Digital Twin Asset.`,
    requiresAttention: isFormation,
    attentionLevel: isFormation ? 'Medium' : 'No Action Required',
    recommendedAction: isFormation
      ? 'Approve DTA formation criteria and define reference implementation scope.'
      : 'Continue strengthening data persistence, governance, and valuation evidence.',
    availableActions: ['Review DTA scope', 'Review governance status', 'Review valuation assumptions']
  });
}

function platformAdministrationLiveStatus() {
  return makeLiveStatus({
    status: 'Amber',
    lifecycleStatus: 'Building',
    healthScore: 88,
    progress: 61,
    summary: 'Platform Administration Center is operational with governed actions and execution controls disabled by design.',
    requiresAttention: true,
    attentionLevel: 'Low',
    recommendedAction: 'Validate restore workflow and authorization policy before enabling destructive platform operations.',
    availableActions: ['Open Administration Center', 'Run Health Check', 'Run Backup', 'Review Action Governance']
  });
}

function aiWorkforceOperationsLiveStatus() {
  return makeLiveStatus({
    status: 'Amber',
    lifecycleStatus: 'Building',
    healthScore: 87,
    progress: 58,
    summary: 'AI Workforce Operations is active with communications, activity, attention, and calendar foundations.',
    requiresAttention: true,
    attentionLevel: 'Low',
    recommendedAction: 'Review open attention items and response-required agent messages.',
    availableActions: ['Open AI Workforce', 'Review Communications', 'Review Activity', 'Review Calendar']
  });
}

function agentCommunicationLiveStatus() {
  return makeLiveStatus({
    status: 'Blue',
    lifecycleStatus: 'Defined',
    healthScore: 84,
    progress: 44,
    summary: 'Agent Communication Layer is available for local internal messages and threads.',
    requiresAttention: false,
    attentionLevel: 'No Action Required',
    recommendedAction: 'Keep external communication disabled until permissions and persistence mature.',
    availableActions: ['Review Messages', 'Review Threads', 'Review Response Requirements']
  });
}

function agentActivityLiveStatus() {
  return makeLiveStatus({
    status: 'Amber',
    lifecycleStatus: 'In Progress',
    healthScore: 85,
    progress: 52,
    summary: 'Agent Activity Queue is tracking active work, progress, attention needs, and recommended actions.',
    requiresAttention: true,
    attentionLevel: 'Low',
    recommendedAction: 'Review attention items before the next operating sprint.',
    availableActions: ['Review Activity', 'Review Attention Queue', 'Review Executive Review Time']
  });
}

function agentCalendarLiveStatus() {
  return makeLiveStatus({
    status: 'Blue',
    lifecycleStatus: 'Defined',
    healthScore: 82,
    progress: 38,
    summary: 'Agent Calendar is active as a local schedule foundation without external calendar synchronization.',
    requiresAttention: false,
    attentionLevel: 'No Action Required',
    recommendedAction: 'Use the local calendar to prepare future Google Calendar integration safely.',
    availableActions: ['Review Calendar', 'Review Preparation Notes', 'Review Attendance Requirements']
  });
}

function actionGovernanceLiveStatus() {
  return makeLiveStatus({
    status: 'Amber',
    lifecycleStatus: 'Review',
    healthScore: 81,
    progress: 46,
    summary: 'Action Governance is active with authorization policies and execution disabled for governed actions.',
    requiresAttention: true,
    attentionLevel: 'High',
    recommendedAction: 'Approve governance policy before any destructive platform action can execute.',
    availableActions: ['Review Policies', 'Review Audit Trail', 'Review High Risk Actions']
  });
}

function liveStatusFor(enterpriseObject) {
  if (['EOS-CAP-0009', 'EOS-WF-BACKUP-RECOVERY'].includes(enterpriseObject.id)) {
    return backupLiveStatus();
  }

  if (enterpriseObject.id === 'EOS-PMO') {
    return pmoLiveStatus();
  }

  if (enterpriseObject.id === 'EOS-MASTER-ROADMAP') {
    return masterRoadmapLiveStatus();
  }

  if (enterpriseObject.id === 'EOS-EXECUTIVE-COUNCIL') {
    return executiveCouncilLiveStatus();
  }

  if (enterpriseObject.id === 'EOS-DIGITAL-ENTERPRISE-HEADQUARTERS') {
    return digitalHeadquartersLiveStatus();
  }

  if (enterpriseObject.id === 'EOS-EXECUTIVE-ACTION-FRAMEWORK') {
    return executiveActionFrameworkLiveStatus();
  }

  if (enterpriseObject.id === 'EOS-APPROVAL-QUEUE') {
    return approvalQueueLiveStatus();
  }

  if (enterpriseObject.id === 'EOS-EXECUTIVE-OFFICE-FRAMEWORK') {
    return executiveOfficeFrameworkLiveStatus();
  }

  if (enterpriseObject.id === 'EOS-ENTERPRISE-DESIGN-SYSTEM') {
    return designSystemLiveStatus();
  }

  if (enterpriseObject.id === 'EOS-EXECUTIVE-PRESENTATION-MODE') {
    return presentationModeLiveStatus();
  }

  if (enterpriseObject.id === 'EOS-UX-AUDIT') {
    return uxAuditLiveStatus();
  }

  if (enterpriseObject.id === 'EOS-PERSISTENT-DATA-STORE') {
    return persistentDataStoreLiveStatus();
  }

  if (enterpriseObject.id === 'EOS-STORAGE-HEALTH') {
    return storageHealthLiveStatus();
  }

  if (enterpriseObject.id === 'EOS-ENTERPRISE-STRATEGY') {
    return enterpriseStrategyLiveStatus();
  }

  if (enterpriseObject.id === 'EOS-GOVERNANCE-COUNCIL') {
    return governanceCouncilLiveStatus();
  }

  if (enterpriseObject.id === 'EOS-DIGITAL-ENTERPRISE-VALUATION') {
    return digitalEnterpriseValuationLiveStatus();
  }

  if (enterpriseObject.id === 'EOS-SECOND-BALANCE-SHEET') {
    return secondBalanceSheetLiveStatus();
  }

  if (enterpriseObject.id === 'EOS-DTA-MONITORING') {
    return dtaMonitoringLiveStatus();
  }

  if (enterpriseObject.type === 'Digital Twin Asset') {
    return digitalTwinAssetLiveStatus(enterpriseObject);
  }

  if (enterpriseObject.id === 'EOS-PLATFORM-ADMINISTRATION-CENTER') {
    return platformAdministrationLiveStatus();
  }

  if (enterpriseObject.id === 'EOS-AI-WORKFORCE-OPERATIONS') {
    return aiWorkforceOperationsLiveStatus();
  }

  if (enterpriseObject.id === 'EOS-AGENT-COMMUNICATION-LAYER') {
    return agentCommunicationLiveStatus();
  }

  if (enterpriseObject.id === 'EOS-AGENT-ACTIVITY-QUEUE') {
    return agentActivityLiveStatus();
  }

  if (enterpriseObject.id === 'EOS-AGENT-CALENDAR') {
    return agentCalendarLiveStatus();
  }

  if (enterpriseObject.id === 'EOS-ACTION-GOVERNANCE') {
    return actionGovernanceLiveStatus();
  }

  if (enterpriseObject.type === 'Workflow') {
    return workflowLiveStatus(enterpriseObject);
  }

  if (['Directive', 'Organization', 'Knowledge Object'].includes(enterpriseObject.type)) {
    return informationalLiveStatus(enterpriseObject);
  }

  return operationalLiveStatus(enterpriseObject);
}

export function withLiveStatus(enterpriseObject) {
  return {
    ...enterpriseObject,
    liveStatus: liveStatusFor(enterpriseObject)
  };
}
