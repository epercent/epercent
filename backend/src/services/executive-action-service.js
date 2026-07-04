import {
  ACTION_SAFETY_NOTICE,
  approvalQueue,
  executiveActionFramework,
  executiveActions
} from '../data/executive-actions.js';
import { findRecordById, listRecords } from './storage-service.js';

export function listExecutiveActions() {
  return listRecords('executive-actions', executiveActions);
}

export function getExecutiveActionById(id) {
  return findRecordById('executive-actions', id, executiveActions);
}

export function listPendingApprovalActions() {
  return listExecutiveActions().filter(
    (action) => action.approvalRequired && ['Pending', 'Escalated'].includes(action.approvalStatus)
  );
}

export function getExecutiveActionFramework() {
  return executiveActionFramework;
}

export function getApprovalQueue() {
  return approvalQueue;
}

export function getActionSummary() {
  const actions = listExecutiveActions();
  const recentlyUpdated = [...actions]
    .sort((first, second) => Date.parse(second.updatedAt) - Date.parse(first.updatedAt))
    .slice(0, 8);

  return {
    pendingApproval: listPendingApprovalActions().length,
    approved: actions.filter((action) => action.approvalStatus === 'Approved').length,
    rejected: actions.filter((action) => action.approvalStatus === 'Rejected').length,
    highRisk: actions.filter((action) => ['High', 'Critical'].includes(action.riskLevel)).length,
    recentlyUpdated
  };
}

export function getActionSafetyNotice() {
  return ACTION_SAFETY_NOTICE;
}
