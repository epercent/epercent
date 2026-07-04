import { executiveProfiles } from './executive-council.js';

export const ACTION_SAFETY_NOTICE =
  'Action governance is active. Execution is disabled until permissions, persistence, and audit controls are implemented.';

export const actionTimestamp = '2026-07-03T17:32:00.000Z';

const decisionActions = ['Approve', 'Reject', 'Defer', 'Escalate', 'Request More Information'];

const actionBlueprints = [
  {
    label: 'Request Briefing',
    description: 'Record a governed request for an executive briefing.',
    status: 'Pending Review',
    approvalRequired: true,
    approvalStatus: 'Pending',
    riskLevel: 'Low',
    recommendedNextStep: 'Review briefing scope and confirm the requested audience.',
    eventIds: ['EOS-EVENT-EXECUTIVE-ACTION-CREATED', 'EOS-EVENT-EXECUTIVE-ACTION-REVIEW-REQUESTED']
  },
  {
    label: 'Prepare Executive Review Session',
    description: 'Record a governed meeting scheduling request without contacting calendars.',
    status: 'Deferred',
    approvalRequired: true,
    approvalStatus: 'Escalated',
    riskLevel: 'Medium',
    recommendedNextStep: 'Confirm meeting purpose, required attendees, and approval owner.',
    eventIds: ['EOS-EVENT-EXECUTIVE-ACTION-CREATED', 'EOS-EVENT-EXECUTIVE-ACTION-DEFERRED']
  },
  {
    label: 'Prepare Executive Communication',
    description: 'Record a governed message request without sending any communication.',
    status: 'Rejected',
    approvalRequired: true,
    approvalStatus: 'Rejected',
    riskLevel: 'Medium',
    recommendedNextStep: 'Rewrite the request with recipient, purpose, and approval context.',
    eventIds: ['EOS-EVENT-EXECUTIVE-ACTION-CREATED', 'EOS-EVENT-EXECUTIVE-ACTION-REJECTED']
  },
  {
    label: 'Review Department Work',
    description: 'Record a governed request to review work already visible inside EOS.',
    status: 'Approved',
    approvalRequired: true,
    approvalStatus: 'Approved',
    riskLevel: 'Low',
    recommendedNextStep: 'Proceed with human review inside Mission Control.',
    eventIds: ['EOS-EVENT-EXECUTIVE-ACTION-CREATED', 'EOS-EVENT-EXECUTIVE-ACTION-APPROVED']
  },
  {
    label: 'Prepare Executive Assignment',
    description: 'Record a governed assignment request without creating or dispatching a task.',
    status: 'Awaiting Approval',
    approvalRequired: true,
    approvalStatus: 'Pending',
    riskLevel: 'Medium',
    recommendedNextStep: 'Review task owner, due date, and linked workflow before approval.',
    eventIds: ['EOS-EVENT-EXECUTIVE-ACTION-CREATED', 'EOS-EVENT-EXECUTIVE-ACTION-REVIEW-REQUESTED']
  },
  {
    label: 'Escalate Executive Attention Item',
    description: 'Record a governed escalation request for an executive attention item.',
    status: 'Awaiting Approval',
    approvalRequired: true,
    approvalStatus: 'Escalated',
    riskLevel: 'High',
    recommendedNextStep: 'Confirm escalation reason and approve routing before any execution.',
    eventIds: ['EOS-EVENT-EXECUTIVE-ACTION-CREATED', 'EOS-EVENT-EXECUTIVE-ACTION-ESCALATED']
  },
  {
    label: 'View Department Portfolio',
    description: 'Record a governed portfolio view action for executive context.',
    status: 'Completed',
    approvalRequired: false,
    approvalStatus: 'Not Required',
    riskLevel: 'Low',
    recommendedNextStep: 'Use Portfolio Mode to inspect related assets.',
    eventIds: ['EOS-EVENT-EXECUTIVE-ACTION-CREATED']
  },
  {
    label: 'Open Executive Office',
    description: 'Record a governed request to open an executive office view.',
    status: 'Draft',
    approvalRequired: false,
    approvalStatus: 'Not Required',
    riskLevel: 'Low',
    recommendedNextStep: 'Define office scope before adding executable office workflows.',
    eventIds: ['EOS-EVENT-EXECUTIVE-ACTION-CREATED']
  }
];

function actionId(profileId, label) {
  const executiveKey = profileId.replace(/^EOS-(EXEC|AGENT)-/, '');
  const actionKey = label.toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/^-|-$/g, '');

  return `EOS-ACTION-${executiveKey}-${actionKey}`;
}

function auditTrailFor(profile, blueprint) {
  const reviewSummary = blueprint.approvalRequired
    ? `${blueprint.label} requires governance review before execution can be enabled.`
    : `${blueprint.label} is recorded as a non-executable governance action.`;

  return [
    {
      timestamp: actionTimestamp,
      actor: 'Mission Control',
      event: 'Action Created',
      summary: `${blueprint.label} action seeded for ${profile.name}.`
    },
    {
      timestamp: actionTimestamp,
      actor: 'EOS Executive Action Framework',
      event: 'Execution Disabled',
      summary: reviewSummary
    }
  ];
}

export const executiveActions = executiveProfiles.flatMap((profile) =>
  actionBlueprints.map((blueprint, index) => ({
    id: actionId(profile.id, blueprint.label),
    label: blueprint.label,
    description: blueprint.description,
    owner: profile.name,
    requester: 'Mission Control',
    targetObject: profile.linkedEnterpriseObjects[0] ?? profile.id,
    targetType: profile.type,
    sourceExecutive: profile.id,
    status: blueprint.status,
    approvalRequired: blueprint.approvalRequired,
    approvalStatus: blueprint.approvalStatus,
    riskLevel: blueprint.riskLevel,
    createdAt: actionTimestamp,
    updatedAt: new Date(Date.parse(actionTimestamp) + index * 60 * 1000).toISOString(),
    linkedWorkflow: 'EOS-WF-EXECUTIVE-ACTION-GOVERNANCE',
    linkedEvents: blueprint.eventIds,
    auditTrail: auditTrailFor(profile, blueprint),
    availableDecisionActions: blueprint.approvalRequired ? decisionActions : ['Archive', 'Review'],
    recommendedNextStep: blueprint.recommendedNextStep,
    executionEnabled: false,
    executionStatus: 'Disabled'
  }))
);

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
    lastActivity: actionTimestamp,
    requiresAttention,
    attentionLevel,
    recommendedAction,
    availableActions
  };
}

export const executiveActionFramework = {
  id: 'EOS-EXECUTIVE-ACTION-FRAMEWORK',
  name: 'EOS Executive Action Framework',
  owner: 'Eric Olo',
  status: 'Operational',
  purpose: 'Record, review, approve, reject, defer, escalate, and audit executive actions before execution exists.',
  executionEnabled: false,
  safetyNotice: ACTION_SAFETY_NOTICE,
  liveStatus: makeLiveStatus({
    status: 'Amber',
    lifecycleStatus: 'Building',
    healthScore: 86,
    progress: 52,
    summary: 'Executive action governance is active while execution remains disabled.',
    requiresAttention: true,
    attentionLevel: 'Low',
    recommendedAction: 'Use the approval queue to review action readiness before enabling execution capabilities.',
    availableActions: ['Review actions', 'Open approval queue', 'Review audit trail']
  })
};

export const approvalQueue = {
  id: 'EOS-APPROVAL-QUEUE',
  name: 'EOS Approval Queue',
  owner: 'Eric Olo',
  status: 'Operational',
  purpose: 'Surface executive actions that require review, approval, rejection, deferral, or escalation.',
  executionEnabled: false,
  safetyNotice: ACTION_SAFETY_NOTICE,
  liveStatus: makeLiveStatus({
    status: 'Amber',
    lifecycleStatus: 'In Progress',
    healthScore: 84,
    progress: 46,
    summary: 'Approval queue is available for governance review and does not execute actions.',
    requiresAttention: true,
    attentionLevel: 'Medium',
    recommendedAction: 'Review pending and escalated executive actions before any future execution path is introduced.',
    availableActions: ['Review pending approvals', 'Review high risk actions', 'Review audit trail']
  })
};
