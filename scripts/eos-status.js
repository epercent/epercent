import { readFile } from 'node:fs/promises';

import {
  apiAgentsUrl,
  apiEventsUrl,
  apiKnowledgeUrl,
  apiObjectsUrl,
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

const [status, objects, agents, knowledge, workflows, events] = await Promise.all([
  tryJson(apiStatusUrl),
  tryJson(apiObjectsUrl),
  tryJson(apiAgentsUrl),
  tryJson(apiKnowledgeUrl),
  tryJson(apiWorkflowsUrl),
  tryJson(apiEventsUrl)
]);
const backupStatus = await tryFileJson(backupStatusFile);

const enterpriseObjects = objects?.objects ?? [];
const registeredServices = enterpriseObjects.filter((object) =>
  ['Application', 'Service'].includes(object.type)
);
const capabilities = enterpriseObjects.filter((object) => object.type === 'Capability');
const backendRunning = backendProcessRunning || apiResponding;
const frontendRunning = frontendProcessRunning || frontendReachable;

const checks = [
  ['Backend', backendRunning],
  ['Frontend', frontendRunning],
  ['API', apiResponding && status?.platform === 'EOS'],
  ['Mission Control', frontendReachable]
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
console.log(`Last Backup: ${backupStatus?.lastBackup ?? 'Unavailable'}`);
console.log(`Backup Status: ${backupStatus?.backupStatus ?? 'Unavailable'}`);
console.log(`Last Restore: ${backupStatus?.lastRestore ?? 'Unavailable'}`);
console.log(`Backup Count: ${backupStatus?.backupCount ?? 0}`);
console.log(`Next Scheduled Backup: ${backupStatus?.nextScheduledBackup ?? 'Not scheduled'}`);
console.log(`Backend URL: ${backendUrl}`);
console.log(`Mission Control URL: ${frontendUrl}`);

if (checks.some(([, passed]) => !passed)) {
  process.exit(1);
}
