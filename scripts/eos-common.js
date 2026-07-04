import { spawn } from 'node:child_process';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { openSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..');
export const backendDir = join(rootDir, 'backend');
export const frontendDir = join(rootDir, 'frontend');
export const runtimeDir = join(rootDir, '.eos');
export const runtimeFile = join(runtimeDir, 'runtime.json');
export const backupsDir = join(rootDir, 'backups');
export const backupStatusFile = join(backupsDir, 'backup-status.json');
export const backendUrl = 'http://127.0.0.1:3000';
export const frontendUrl = 'http://127.0.0.1:5173';
export const apiStatusUrl = `${backendUrl}/api/status`;
export const apiObjectsUrl = `${backendUrl}/api/objects`;
export const apiAgentsUrl = `${backendUrl}/api/agents`;
export const apiKnowledgeUrl = `${backendUrl}/api/knowledge`;
export const apiWorkflowsUrl = `${backendUrl}/api/workflows`;
export const apiEventsUrl = `${backendUrl}/api/events`;
export const apiStorageStatusUrl = `${backendUrl}/api/storage/status`;
export const apiStorageCollectionsUrl = `${backendUrl}/api/storage/collections`;
export const apiPlatformUrl = `${backendUrl}/api/platform`;
export const apiPlatformAdminUrl = `${backendUrl}/api/platform/admin`;
export const apiAuditUrl = `${backendUrl}/api/audit`;
export const apiAdminActionsUrl = `${backendUrl}/api/admin-actions`;
export const apiAgentMessagesUrl = `${backendUrl}/api/agent-messages`;
export const apiAgentActivityUrl = `${backendUrl}/api/agent-activity`;
export const apiAgentAttentionUrl = `${backendUrl}/api/agent-attention`;
export const apiAgentCalendarUrl = `${backendUrl}/api/agent-calendar`;

export const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

export async function ensureRuntimeDir() {
  await mkdir(runtimeDir, { recursive: true });
}

export async function readRuntime() {
  try {
    return JSON.parse(await readFile(runtimeFile, 'utf8'));
  } catch {
    return null;
  }
}

export async function writeRuntime(runtime) {
  await ensureRuntimeDir();
  await writeFile(runtimeFile, `${JSON.stringify(runtime, null, 2)}\n`);
}

export async function clearRuntime() {
  await rm(runtimeFile, { force: true });
}

export function isProcessRunning(pid) {
  if (!pid) {
    return false;
  }

  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

export function spawnManagedProcess(name, cwd, args, logFile, env = {}) {
  const stdout = openSync(logFile, 'a');
  const stderr = openSync(logFile, 'a');
  const child = spawn(npmCommand, args, {
    cwd,
    detached: true,
    env: {
      ...process.env,
      ...env
    },
    stdio: ['ignore', stdout, stderr]
  });

  child.unref();

  return {
    name,
    pid: child.pid,
    logFile
  };
}

export async function fetchOk(url) {
  try {
    const response = await fetch(url);
    return response.ok;
  } catch {
    return false;
  }
}

export async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`${url} returned ${response.status}`);
  }

  return response.json();
}

export async function waitForUrl(url, label, timeoutMs = 20000) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    if (await fetchOk(url)) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`${label} did not become reachable at ${url}`);
}

export function stopManagedProcess(pid) {
  if (!pid || !isProcessRunning(pid)) {
    return false;
  }

  try {
    process.kill(process.platform === 'win32' ? pid : -pid, 'SIGTERM');
    return true;
  } catch {
    try {
      process.kill(pid, 'SIGTERM');
      return true;
    } catch {
      return false;
    }
  }
}

export function runCommand(label, cwd, args) {
  return new Promise((resolve, reject) => {
    console.log(`Running ${label}...`);

    const child = spawn(npmCommand, args, {
      cwd,
      stdio: 'inherit'
    });

    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${label} failed with exit code ${code}`));
    });
  });
}
