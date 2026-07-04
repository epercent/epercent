import {
  getActionSafetyNotice,
  getActionSummary,
  getApprovalQueue,
  getExecutiveActionById,
  getExecutiveActionFramework,
  listExecutiveActions,
  listPendingApprovalActions
} from '../services/executive-action-service.js';

export function listActions(_request, response) {
  const actions = listExecutiveActions();

  response.status(200).json({
    capability: 'EOS-CAP-0022',
    framework: getExecutiveActionFramework(),
    approvalQueue: getApprovalQueue(),
    safetyNotice: getActionSafetyNotice(),
    executionEnabled: false,
    count: actions.length,
    summary: getActionSummary(),
    actions
  });
}

export function listPendingApproval(_request, response) {
  const actions = listPendingApprovalActions();

  response.status(200).json({
    capability: 'EOS-CAP-0022',
    queue: getApprovalQueue(),
    safetyNotice: getActionSafetyNotice(),
    executionEnabled: false,
    count: actions.length,
    actions
  });
}

export function getAction(request, response) {
  const action = getExecutiveActionById(request.params.id);

  if (!action) {
    return response.status(404).json({
      error: 'Executive action not found',
      id: request.params.id
    });
  }

  return response.status(200).json(action);
}
