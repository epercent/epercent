import { open, mkdir, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

import { rootDir } from './eos-common.js';

const controlDirectory = join(rootDir, '.eos', 'control');
const inboxFile = join(controlDirectory, 'EOS-MISSION-INBOX.json');
const validationFile = join(
  controlDirectory,
  'EOS-MISSION-VALIDATION.json'
);
const lockFile = join(controlDirectory, 'EOS-MISSION-WATCHER.lock');
const once = process.argv.includes('--once');
const intervalMs = Math.max(
  5_000,
  Number.parseInt(
    process.env.EOS_MISSION_WATCH_INTERVAL_MS ?? '15000',
    10
  ) || 15_000
);
const pullTimeoutMs = Math.max(
  5_000,
  Number.parseInt(
    process.env.EOS_MISSION_PULL_TIMEOUT_MS ?? '30000',
    10
  ) || 30_000
);
const executionTimeoutMs = Math.max(
  60_000,
  Number.parseInt(
    process.env.EOS_MISSION_EXECUTION_TIMEOUT_MS ?? '900000',
    10
  ) || 900_000
);

let stopping = false;
let lastObservation = null;
let lockAcquired = false;
const attemptedDigests = new Set();

function run(command, args, options = {}) {
  return spawnSync(command, args, {
    cwd: rootDir,
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
    ...options
  });
}

async function readJson(file) {
  return JSON.parse(await readFile(file, 'utf8'));
}

function processIsAlive(pid) {
  if (!Number.isInteger(pid) || pid <= 0) {
    return false;
  }

  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

async function acquireLock() {
  await mkdir(controlDirectory, { recursive: true });

  try {
    const handle = await open(lockFile, 'wx', 0o600);
    await handle.writeFile(`${process.pid}\n`, 'utf8');
    await handle.close();
    lockAcquired = true;
    return;
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }

  let existingPid = null;

  try {
    existingPid = Number.parseInt(
      (await readFile(lockFile, 'utf8')).trim(),
      10
    );
  } catch {
    // An unreadable lock is treated as stale and replaced below.
  }

  if (processIsAlive(existingPid)) {
    throw new Error(
      `Mission watcher already active with PID ${existingPid}.`
    );
  }

  await rm(lockFile, { force: true });
  const handle = await open(lockFile, 'wx', 0o600);
  await handle.writeFile(`${process.pid}\n`, 'utf8');
  await handle.close();
  lockAcquired = true;
}

async function releaseLock() {
  if (lockAcquired) {
    await rm(lockFile, { force: true });
    lockAcquired = false;
  }
}

function observationKey(inbox, validation) {
  return [
    inbox.generation,
    inbox.state,
    validation.missionDigest ?? 'none',
    validation.executableNow ? 'ready' : 'blocked'
  ].join(':');
}

function printObservation(inbox, validation) {
  console.log(
    `Observed generation ${inbox.generation}: ` +
      `${inbox.state} / ` +
      `${validation.missionId ?? 'no mission'} / ` +
      `${validation.executableNow ? 'executable' : 'not executable'}`
  );
}

async function cycle() {
  const pull = run('bin/eos-mission', ['pull'], {
    timeout: pullTimeoutMs
  });

  let inbox;
  let validation;

  try {
    inbox = await readJson(inboxFile);
    validation = await readJson(validationFile);
  } catch (error) {
    console.error(
      `Mission watcher could not read validated local state: ${error.message}`
    );
    return;
  }

  const observed = observationKey(inbox, validation);
  if (observed !== lastObservation) {
    printObservation(inbox, validation);
    lastObservation = observed;
  }

  if (pull.error) {
    console.error(`Mission pull failed: ${pull.error.message}`);
    return;
  }

  if (pull.status !== 0) {
    return;
  }

  const digest = validation.missionDigest;
  const eligible =
    inbox.state === 'AUTHORIZED' &&
    validation.executableNow === true &&
    typeof digest === 'string' &&
    digest.length > 0;

  if (!eligible || attemptedDigests.has(digest)) {
    return;
  }

  attemptedDigests.add(digest);
  console.log(
    `Authorized mission detected: ${validation.missionId}. ` +
      'Invoking governed one-time executor.'
  );

  const execution = run('bin/eos-execute', [], {
    stdio: 'inherit',
    timeout: executionTimeoutMs
  });

  if (execution.error) {
    console.error(
      `Governed executor failed to start: ${execution.error.message}`
    );
    return;
  }

  console.log(
    `Governed executor exited with code ${execution.status ?? 1}.`
  );
}

async function waitForNextCycle() {
  await new Promise((resolve) => setTimeout(resolve, intervalMs));
}

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    stopping = true;
  });
}

try {
  await acquireLock();
  console.log('eOS Governed Mission Watcher');
  console.log('----------------------------');
  console.log(`Mode: ${once ? 'single observation' : 'continuous'}`);
  console.log(`Poll interval: ${intervalMs} ms`);
  console.log('Authorization capability: NONE');

  do {
    await cycle();
    if (!once && !stopping) {
      await waitForNextCycle();
    }
  } while (!once && !stopping);
} catch (error) {
  console.error(error.message);
  process.exitCode = 75;
} finally {
  await releaseLock();
}
