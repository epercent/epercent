import { readFile } from 'node:fs/promises';

import {
  apiAgentsUrl,
  apiEventsUrl,
  apiKnowledgeUrl,
  apiAdminActionsUrl,
  apiAgentActivityUrl,
  apiAgentAttentionUrl,
  apiAgentCalendarUrl,
  apiAgentMessagesUrl,
  apiAuditUrl,
  apiObjectsUrl,
  apiPlatformAdminUrl,
  apiPlatformUrl,
  apiStorageCollectionsUrl,
  apiStorageStatusUrl,
  apiStatusUrl,
  apiWorkflowsUrl,
  backupStatusFile,
  backendUrl,
  fetchJson,
  fetchOk,
  frontendUrl,
  isProcessRunning,
  readRuntime
} from './eos-common.js';

const jsonMode = process.argv.includes('--json');
const runtime = await readRuntime();

const backendProcessRunning = isProcessRunning(runtime?.backend?.pid);
const frontendProcessRunning = isProcessRunning(runtime?.frontend?.pid);
const apiResponding = await fetchOk(apiStatusUrl);
const frontendReachable = await fetchOk(frontendUrl);

async function tryJson(url) {
  try {
    return await fetchJson(url);
  } catch {
    return null;
  }
}

async function tryFileJson(file) {
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch {
    return null;
  }
}

const [
  status,
  objects,
  agents,
  knowledge,
  workflows,
  events,
  storageStatus,
  storageCollections,
  platform,
  platformAdmin,
  adminActions,
  agentMessages,
  agentActivity,
  agentAttention,
  agentCalendar,
  audit
] = await Promise.all([
  tryJson(apiStatusUrl),
  tryJson(apiObjectsUrl),
  tryJson(apiAgentsUrl),
  tryJson(apiKnowledgeUrl),
  tryJson(apiWorkflowsUrl),
  tryJson(apiEventsUrl),
  tryJson(apiStorageStatusUrl),
  tryJson(apiStorageCollectionsUrl),
  tryJson(apiPlatformUrl),
  tryJson(apiPlatformAdminUrl),
  tryJson(apiAdminActionsUrl),
  tryJson(apiAgentMessagesUrl),
  tryJson(apiAgentActivityUrl),
  tryJson(apiAgentAttentionUrl),
  tryJson(apiAgentCalendarUrl),
  tryJson(apiAuditUrl)
]);

const backupStatus = await tryFileJson(backupStatusFile);

const enterpriseObjects = objects?.objects ?? [];
const registeredServices = enterpriseObjects.filter((object) =>
  ['Application', 'Service'].includes(object.type)
);
const capabilities = enterpriseObjects.filter(
  (object) => object.type === 'Capability'
);

const backendRunning = backendProcessRunning || apiResponding;
const frontendRunning = frontendProcessRunning || frontendReachable;

const latestBackupTimestamp =
  backupStatus?.latestBackupTimestamp ??
  backupStatus?.lastBackup ??
  'Unavailable';

const latestBackupLocalTime =
  backupStatus?.latestBackupLocalTime ?? 'Unavailable';

const latestBackupStatus =
  backupStatus?.latestBackupStatus ??
  backupStatus?.backupStatus ??
  'Unavailable';

const latestBackupArchive =
  backupStatus?.latestBackupArchive ?? 'Unavailable';

const latestBackupSize =
  backupStatus?.latestBackupSize ?? 0;

const latestRestoreValidationStatus =
  backupStatus?.latestRestoreValidationStatus ??
  (backupStatus?.lastRestore ? 'Validated' : 'Not validated');

const checks = [
  ['Backend', backendRunning],
  ['Frontend', frontendRunning],
  ['API', apiResponding && status?.platform === 'EOS'],
  ['Mission Control', frontendReachable],
  ['Storage', storageStatus?.storageStatus === 'Operational']
];

const healthy = checks.every(([, passed]) => passed);

const statusPayload = {
  platform: status?.platform ?? 'EOS',
  status: status?.status ?? 'Unavailable',
  version: status?.version ?? 'Unavailable',
  healthy,
  checks: {
    backend: backendRunning,
    frontend: frontendRunning,
    api: apiResponding && status?.platform === 'EOS',
    missionControl: frontendReachable,
    storage: storageStatus?.storageStatus === 'Operational'
  },
  runtime: {
    backendProcess: backendProcessRunning,
    frontendProcess: frontendProcessRunning
  },
  counts: {
    registeredServices: registeredServices.length,
    capabilities: capabilities.length,
    enterpriseObjects: objects?.count ?? enterpriseObjects.length,
    knowledgeObjects: knowledge?.count ?? 0,
    agents: agents?.count ?? 0,
    workflows: workflows?.count ?? 0,
    events: events?.count ?? 0
  },
  storage: {
    status: storageStatus?.storageStatus ?? 'Unavailable',
    collections:
      storageCollections?.count ??
      storageStatus?.collectionsFound?.length ??
      0,
    records: Object.values(storageStatus?.recordCounts ?? {}).reduce(
      (total, count) => total + count,
      0
    ),
    snapshots: storageStatus?.snapshotCount ?? 0,
    warnings: storageStatus?.warnings?.length ?? 0
  },
  workforce: {
    status: platform?.status?.status ?? 'Unavailable',
    messages: agentMessages?.count ?? 0,
    activity: agentActivity?.count ?? 0,
    attentionOpen: agentAttention?.open ?? 0,
    calendar: agentCalendar?.count ?? 0
  },
  audit: {
    status: audit?.summary?.overallStatus ?? 'Unavailable',
    alphaReadiness: audit?.summary?.alphaReadiness ?? null,
    betaReadiness: audit?.summary?.betaReadiness ?? null,
    versionOneReadiness: audit?.summary?.versionOneReadiness ?? null
  },
  backup: {
    timestamp: latestBackupTimestamp,
    localTime: latestBackupLocalTime,
    status: latestBackupStatus,
    count: backupStatus?.backupCount ?? 0,
    archive: latestBackupArchive,
    archiveSize: latestBackupSize,
    dataIncluded: backupStatus?.latestBackupDataIncluded !== false,
    restoreValidated:
      latestRestoreValidationStatus === 'Validated',
    restoreValidationStatus: latestRestoreValidationStatus
  },
  urls: {
    backend: backendUrl,
    missionControl: frontendUrl
  }
};

if (jsonMode) {
  console.log(JSON.stringify(statusPayload, null, 2));

  if (!healthy) {
    process.exitCode = 1;
  }
} else {
  console.log('EOS Status');
  console.log('----------');
  console.log(`Platform Status: ${statusPayload.status}`);
  console.log(`Build Version: ${statusPayload.version}`);

  for (const [label, passed] of checks) {
    console.log(`${label}: ${passed ? 'OK' : 'FAIL'}`);
  }

  console.log(`Registered Services: ${statusPayload.counts.registeredServices}`);
  console.log(`Capabilities: ${statusPayload.counts.capabilities}`);
  console.log(`Enterprise Objects: ${statusPayload.counts.enterpriseObjects}`);
  console.log(`Knowledge Objects: ${statusPayload.counts.knowledgeObjects}`);
  console.log(`Agents: ${statusPayload.counts.agents}`);
  console.log(`Workflows: ${statusPayload.counts.workflows}`);
  console.log(`Events: ${statusPayload.counts.events}`);
  console.log(`Storage Status: ${statusPayload.storage.status}`);
  console.log(`Storage Collections: ${statusPayload.storage.collections}`);
  console.log(`Storage Records: ${statusPayload.storage.records}`);
  console.log(`Storage Snapshots: ${statusPayload.storage.snapshots}`);
  console.log(`Storage Warnings: ${statusPayload.storage.warnings}`);
  console.log(
    `Platform Administration: ${platformAdmin?.platformStatus ?? 'Unavailable'}`
  );
  console.log(`Admin Actions: ${adminActions?.count ?? 0}`);
  console.log(`Governed Admin Actions: ${adminActions?.summary?.governed ?? 0}`);
  console.log(`AI Workforce Status: ${statusPayload.workforce.status}`);
  console.log(`Agent Messages: ${statusPayload.workforce.messages}`);
  console.log(`Agent Activity: ${statusPayload.workforce.activity}`);
  console.log(`Agent Attention: ${statusPayload.workforce.attentionOpen} open`);
  console.log(`Agent Calendar: ${statusPayload.workforce.calendar}`);
  console.log(`Audit Status: ${statusPayload.audit.status}`);
  console.log(`Alpha Readiness: ${statusPayload.audit.alphaReadiness ?? 'Unavailable'}%`);
  console.log(`Beta Readiness: ${statusPayload.audit.betaReadiness ?? 'Unavailable'}%`);
  console.log(
    `Version 1.0 Readiness: ${statusPayload.audit.versionOneReadiness ?? 'Unavailable'}%`
  );
  console.log(
    `Current Priority: ${platform?.status?.recommendedAction ?? 'Review Mission Control.'}`
  );
  console.log(
    `Last Backup: ${statusPayload.backup.localTime} (${statusPayload.backup.timestamp})`
  );
  console.log(`Backup Status: ${statusPayload.backup.status}`);
  console.log(`Backup Count: ${statusPayload.backup.count}`);
  console.log(
    `Latest Archive: ${statusPayload.backup.archive} (${statusPayload.backup.archiveSize} bytes)`
  );
  console.log(
    `Backup Data Included: ${statusPayload.backup.dataIncluded ? 'Yes' : 'No'}`
  );
  console.log(
    `Restore Validation: ${statusPayload.backup.restoreValidationStatus}`
  );
  console.log(`Backend URL: ${statusPayload.urls.backend}`);
  console.log(`Mission Control URL: ${statusPayload.urls.missionControl}`);

  if (!healthy) {
    process.exitCode = 1;
  }
}
