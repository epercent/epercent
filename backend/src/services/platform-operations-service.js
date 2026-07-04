import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  actionGovernanceRecords,
  adminActions,
  agentActivity,
  agentAttentionQueue,
  agentCalendar,
  agentMessages,
  authorizationPolicies,
  platformNavigation,
  platformOperations
} from '../data/platform-operations.js';
import { agents } from '../data/agents.js';
import { knowledgeObjects } from '../data/knowledge.js';
import { listEnterpriseObjects } from './enterprise-object-registry.js';
import { getStorageHealthReport } from './storage-service.js';
import { expectedStorageCollections } from './storage-bootstrap.js';
import { findRecordById, listRecords } from './storage-service.js';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const backupStatusFile = join(rootDir, 'backups', 'backup-status.json');
const releaseManifestFile = join(rootDir, 'docs', 'releases', 'RELEASE-MANIFEST.json');

function readJsonFile(file, fallback) {
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

export function getPlatformOperations() {
  return listRecords('platform-operations', [platformOperations])[0] ?? platformOperations;
}

export function getPlatformNavigation() {
  return listRecords('platform-navigation', platformNavigation);
}

export function listAdminActions() {
  return listRecords('admin-actions', adminActions);
}

export function getAdminActionById(id) {
  return findRecordById('admin-actions', id, adminActions);
}

export function listAuthorizationPolicies() {
  return listRecords('authorization-policies', authorizationPolicies);
}

export function listActionGovernanceRecords() {
  return listRecords('action-governance', actionGovernanceRecords);
}

export function listAgentMessages() {
  return listRecords('agent-messages', agentMessages);
}

export function getAgentMessageById(id) {
  return findRecordById('agent-messages', id, agentMessages);
}

export function listAgentMessagesByThread(threadId) {
  const requestedThread = String(threadId).toLowerCase();

  return listAgentMessages().filter((message) => String(message.threadId).toLowerCase() === requestedThread);
}

export function listAgentActivity() {
  return listRecords('agent-activity', agentActivity);
}

export function listAgentAttention() {
  return listRecords('agent-attention-queue', agentAttentionQueue);
}

export function listAgentCalendar() {
  return listRecords('agent-calendar', agentCalendar);
}

export function getPlatformAdminCenter() {
  const operations = getPlatformOperations();
  const backupStatus = readJsonFile(backupStatusFile, {
    latestBackupStatus: 'Pending Assessment',
    latestBackupArchive: 'Pending Assessment',
    latestRestoreValidationStatus: 'Not validated'
  });
  const releaseManifest = readJsonFile(releaseManifestFile, {
    version: operations.releaseVersion,
    status: 'Pending Assessment'
  });
  const storageHealth = getStorageHealthReport(expectedStorageCollections);

  return {
    capability: 'EOS-CAP-0027',
    safetyNotice:
      'Action governance is active. Execution is disabled until permissions, persistence, and audit controls are implemented.',
    platformStatus: operations.status,
    currentVersion: operations.currentVersion,
    environment: operations.environment,
    backendStatus: operations.backendStatus,
    frontendStatus: operations.frontendStatus,
    apiHealth: operations.apiHealth,
    storageHealth: storageHealth.storageStatus,
    backupHealth: backupStatus.latestBackupStatus,
    latestBackup: {
      timestamp: backupStatus.latestBackupTimestamp,
      localTime: backupStatus.latestBackupLocalTime,
      archive: backupStatus.latestBackupArchive,
      size: backupStatus.latestBackupSize,
      checksum: backupStatus.latestBackupChecksum,
      status: backupStatus.latestBackupStatus,
      restoreValidationStatus: backupStatus.latestRestoreValidationStatus
    },
    restoreValidationStatus: backupStatus.latestRestoreValidationStatus,
    releaseVersion: releaseManifest.version ?? operations.releaseVersion,
    gitStatus: operations.gitStatus,
    dataStoreStatus: storageHealth.storageStatus,
    registeredServices: operations.registeredServices,
    activeApis: operations.activeApis,
    runningUrls: operations.runningUrls,
    systemWarnings: operations.systemWarnings,
    recommendedAdminActions: operations.recommendedAdminActions,
    adminActions: listAdminActions(),
    authorizationPolicies: listAuthorizationPolicies(),
    actionGovernance: listActionGovernanceRecords()
  };
}

export function getPlatformStatusSummary() {
  const operations = getPlatformOperations();
  const storageHealth = getStorageHealthReport(expectedStorageCollections);
  const attention = listAgentAttention();
  const messages = listAgentMessages();
  const activity = listAgentActivity();
  const calendar = listAgentCalendar();

  return {
    capability: 'EOS-CAP-0028',
    platform: 'EOS',
    status: operations.status,
    version: operations.currentVersion,
    environment: operations.environment,
    backendStatus: operations.backendStatus,
    frontendStatus: operations.frontendStatus,
    apiHealth: operations.apiHealth,
    storageHealth: storageHealth.storageStatus,
    backupHealth: getPlatformAdminCenter().backupHealth,
    activeAgents: agents.filter((agent) => agent.status === 'Active').length,
    activeAgentWork: activity.length,
    openAttentionItems: attention.filter((item) => item.status === 'Open').length,
    openAgentMessages: messages.filter((message) => message.status === 'Open').length,
    upcomingAgentEvents: calendar.length,
    enterpriseObjects: listEnterpriseObjects().length,
    knowledgeObjects: knowledgeObjects.length,
    recommendedAction:
      'Review Platform Audit readiness, functional gaps, placeholders, and technical debt before approving the next strategic build program.'
  };
}

export function getPlatformOverview() {
  return {
    capability: 'EOS-CAP-0027',
    operations: getPlatformOperations(),
    status: getPlatformStatusSummary(),
    administration: getPlatformAdminCenter(),
    navigation: getPlatformNavigation(),
    aiWorkforce: {
      messages: {
        count: listAgentMessages().length,
        open: listAgentMessages().filter((message) => message.status === 'Open').length
      },
      activity: {
        count: listAgentActivity().length,
        requiringAttention: listAgentActivity().filter((activityRecord) => activityRecord.requiresHumanAttention).length
      },
      attention: {
        count: listAgentAttention().length,
        open: listAgentAttention().filter((item) => item.status === 'Open').length
      },
      calendar: {
        count: listAgentCalendar().length,
        requiringHumanAttendance: listAgentCalendar().filter((event) => event.requiresHumanAttendance).length
      }
    }
  };
}
