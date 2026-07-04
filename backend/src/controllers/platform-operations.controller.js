import {
  getAdminActionById,
  getAgentMessageById,
  getPlatformAdminCenter,
  getPlatformNavigation,
  getPlatformOverview,
  getPlatformStatusSummary,
  listAdminActions,
  listAgentActivity,
  listAgentAttention,
  listAgentCalendar,
  listAgentMessages,
  listAgentMessagesByThread,
  listAuthorizationPolicies,
  listActionGovernanceRecords
} from '../services/platform-operations-service.js';

export function getPlatform(_request, response) {
  response.status(200).json(getPlatformOverview());
}

export function getPlatformStatus(_request, response) {
  response.status(200).json(getPlatformStatusSummary());
}

export function getPlatformAdmin(_request, response) {
  response.status(200).json(getPlatformAdminCenter());
}

export function getNavigation(_request, response) {
  const navigation = getPlatformNavigation();

  response.status(200).json({
    capability: 'EOS-CAP-0028',
    count: navigation.length,
    navigation
  });
}

export function listPlatformAdminActions(_request, response) {
  const actions = listAdminActions();

  response.status(200).json({
    capability: 'EOS-CAP-0027',
    safetyNotice:
      'Action governance is active. Execution is disabled until permissions, persistence, and audit controls are implemented.',
    executionEnabled: false,
    count: actions.length,
    summary: {
      safeExecutable: actions.filter((action) => action.executionMode === 'Executable').length,
      governed: actions.filter((action) => action.requiresApproval).length,
      highRisk: actions.filter((action) => ['High', 'Critical'].includes(action.riskLevel)).length,
      blocked: actions.filter((action) => action.status === 'Blocked').length
    },
    authorizationPolicies: listAuthorizationPolicies(),
    actionGovernance: listActionGovernanceRecords(),
    actions
  });
}

export function getPlatformAdminAction(request, response) {
  const action = getAdminActionById(request.params.id);

  if (!action) {
    return response.status(404).json({
      error: 'Admin action not found',
      id: request.params.id
    });
  }

  return response.status(200).json(action);
}

export function listMessages(_request, response) {
  const messages = listAgentMessages();

  response.status(200).json({
    capability: 'EOS-CAP-0027',
    count: messages.length,
    responseRequired: messages.filter((message) => message.requiresResponse).length,
    messages
  });
}

export function getMessage(request, response) {
  const message = getAgentMessageById(request.params.id);

  if (!message) {
    return response.status(404).json({
      error: 'Agent message not found',
      id: request.params.id
    });
  }

  return response.status(200).json(message);
}

export function getMessageThread(request, response) {
  const messages = listAgentMessagesByThread(request.params.threadId);

  response.status(200).json({
    capability: 'EOS-CAP-0027',
    threadId: request.params.threadId,
    count: messages.length,
    messages
  });
}

export function listActivity(_request, response) {
  const activity = listAgentActivity();

  response.status(200).json({
    capability: 'EOS-CAP-0027',
    count: activity.length,
    requiringAttention: activity.filter((activityRecord) => activityRecord.requiresHumanAttention).length,
    activity
  });
}

export function listAttention(_request, response) {
  const attention = listAgentAttention();

  response.status(200).json({
    capability: 'EOS-CAP-0027',
    count: attention.length,
    open: attention.filter((item) => item.status === 'Open').length,
    attention
  });
}

export function listCalendar(_request, response) {
  const calendar = listAgentCalendar();

  response.status(200).json({
    capability: 'EOS-CAP-0027',
    count: calendar.length,
    requiringHumanAttendance: calendar.filter((event) => event.requiresHumanAttendance).length,
    calendar
  });
}
