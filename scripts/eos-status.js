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
const capabilities = enterpriseObjects.filter((object) => object.type === 'Capability');
const backendRunning = backendProcessRunning || apiResponding;
const frontendRunning = frontendProcessRunning || frontendReachable;
const latestBackupTimestamp = backupStatus?.latestBackupTimestamp ?? backupStatus?.lastBackup ?? 'Unavailable';
const latestBackupLocalTime = backupStatus?.latestBackupLocalTime ?? 'Unavailable';
const latestBackupStatus = backupStatus?.latestBackupStatus ?? backupStatus?.backupStatus ?? 'Unavailable';
const latestBackupArchive = backupStatus?.latestBackupArchive ?? 'Unavailable';
const latestBackupSize = backupStatus?.latestBackupSize ?? 0;
const latestRestoreValidationStatus =
  backupStatus?.latestRestoreValidationStatus ?? (backupStatus?.lastRestore ? 'Validated' : 'Not validated');

const checks = [
  ['Backend', backendRunning],
  ['Frontend', frontendRunning],
  ['API', apiResponding && status?.platform === 'EOS'],
  ['Mission Control', frontendReachable],
  ['Storage', storageStatus?.storageStatus === 'Operational']
];

console.log('EOS Status');
console.log('----------');
console.log(`Platform Status: ${status?.status ?? 'Unavailable'}`);
console.log(`Build Version: ${status?.version ?? 'Unavailable'}`);

for (const [label, passed] of checks) {
  console.log(`${label}: ${passed ? 'OK' : 'FAIL'}`);
}

console.log(`Registered Services: ${registeredServices.length}`);
console.log(`Capabilities: ${capabilities.length}`);
console.log(`Enterprise Objects: ${objects?.count ?? enterpriseObjects.length}`);
console.log(`Knowledge Objects: ${knowledge?.count ?? 0}`);
console.log(`Agents: ${agents?.count ?? 0}`);
console.log(`Workflows: ${workflows?.count ?? 0}`);
console.log(`Events: ${events?.count ?? 0}`);
console.log(`Storage Status: ${storageStatus?.storageStatus ?? 'Unavailable'}`);
console.log(`Storage Collections: ${storageCollections?.count ?? storageStatus?.collectionsFound?.length ?? 0}`);
console.log(
  `Storage Records: ${Object.values(storageStatus?.recordCounts ?? {}).reduce((total, count) => total + count, 0)}`
);
console.log(`Storage Snapshots: ${storageStatus?.snapshotCount ?? 0}`);
console.log(`Storage Warnings: ${storageStatus?.warnings?.length ?? 0}`);
console.log(`Platform Administration: ${platformAdmin?.platformStatus ?? 'Unavailable'}`);
console.log(`Admin Actions: ${adminActions?.count ?? 0}`);
console.log(`Governed Admin Actions: ${adminActions?.summary?.governed ?? 0}`);
console.log(`AI Workforce Status: ${platform?.status?.status ?? 'Unavailable'}`);
console.log(`Agent Messages: ${agentMessages?.count ?? 0}`);
console.log(`Agent Activity: ${agentActivity?.count ?? 0}`);
console.log(`Agent Attention: ${agentAttention?.open ?? 0} open`);
console.log(`Agent Calendar: ${agentCalendar?.count ?? 0}`);
console.log(`Audit Status: ${audit?.summary?.overallStatus ?? 'Unavailable'}`);
console.log(`Alpha Readiness: ${audit?.summary?.alphaReadiness ?? 'Unavailable'}%`);
console.log(`Beta Readiness: ${audit?.summary?.betaReadiness ?? 'Unavailable'}%`);
console.log(`Version 1.0 Readiness: ${audit?.summary?.versionOneReadiness ?? 'Unavailable'}%`);
console.log(`Current Priority: ${platform?.status?.recommendedAction ?? 'Review Mission Control.'}`);
console.log(`Last Backup: ${latestBackupLocalTime} (${latestBackupTimestamp})`);
console.log(`Backup Status: ${latestBackupStatus}`);
console.log(`Backup Count: ${backupStatus?.backupCount ?? 0}`);
console.log(`Latest Archive: ${latestBackupArchive} (${latestBackupSize} bytes)`);
console.log(`Backup Data Included: ${backupStatus?.latestBackupDataIncluded === false ? 'No' : 'Yes'}`);
console.log(`Restore Validation: ${latestRestoreValidationStatus}`);
console.log(`Backend URL: ${backendUrl}`);
console.log(`Mission Control URL: ${frontendUrl}`);

if (checks.some(([, passed]) => !passed)) {
  process.exit(1);
}
