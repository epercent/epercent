import { createHash, randomUUID } from 'node:crypto';
import {
  appendFile,
  mkdir,
  readFile,
  writeFile
} from 'node:fs/promises';
import { hostname } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

import { rootDir } from './eos-common.js';
import {
  parseGitPorcelainPaths,
  pathAllowed
} from './eos-git-status-paths.js';

const remoteRoot =
  process.env.EOS_BRIDGE_REMOTE ??
  'eos-drive:eOS Build Intelligence Bridge';
const remoteInbox =
  process.env.EOS_MISSION_REMOTE ??
  `${remoteRoot}/Control/Inbox/EOS-MISSION-INBOX.json`;

const localControlDirectory = join(rootDir, '.eos', 'control');
const localInbox = join(localControlDirectory, 'EOS-MISSION-INBOX.json');
const localValidation = join(
  localControlDirectory,
  'EOS-MISSION-VALIDATION.json'
);
const replayLedger = join(
  localControlDirectory,
  'EOS-EXECUTED-MISSIONS.ndjson'
);
const localExecutionDirectory = join(
  localControlDirectory,
  'executions'
);

function canonicalize(value) {
  if (Array.isArray(value)) {
    return value.map(canonicalize);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, canonicalize(value[key])])
    );
  }

  return value;
}

function digest(value) {
  return createHash('sha256')
    .update(JSON.stringify(canonicalize(value)))
    .digest('hex');
}

function run(command, args, options = {}) {
  return spawnSync(command, args, {
    cwd: rootDir,
    encoding: 'utf8',
    ...options
  });
}

function git(...args) {
  const result = run('git', args);
  return result.status === 0 ? result.stdout.trim() : 'unavailable';
}

function gitPorcelainStatus() {
  const result = run('git', ['status', '--porcelain']);
  return result.status === 0 ? result.stdout : '';
}

function upload(localFile, remoteFile) {
  return run('rclone', ['copyto', localFile, remoteFile]);
}

function changedPathsSince(requiredCommit) {
  const committed = git(
    'diff',
    '--name-only',
    `${requiredCommit}..HEAD`
  )
    .split(/\r?\n/)
    .filter(Boolean);

  const working = parseGitPorcelainPaths(gitPorcelainStatus());

  return [...new Set([...committed, ...working])].sort();
}

await mkdir(localExecutionDirectory, { recursive: true });

const validationRun = run(
  'node',
  [join(rootDir, 'scripts', 'eos-mission-control.js'), 'pull'],
  { stdio: 'inherit' }
);

if (validationRun.status !== 0) {
  console.error('Execution denied: mission validation failed.');
  process.exit(1);
}

const inbox = JSON.parse(await readFile(localInbox, 'utf8'));
const validation = JSON.parse(await readFile(localValidation, 'utf8'));
const mission = inbox.mission;
const authorization = inbox.authorization;
const missionDigest = digest(mission);
const refusalReasons = [];

if (inbox.state !== 'AUTHORIZED') {
  refusalReasons.push('mission state must be AUTHORIZED');
}

if (!validation.executableNow) {
  refusalReasons.push('validator did not mark mission executable');
}

if (mission?.executionPermitted !== true) {
  refusalReasons.push('mission execution permission is not true');
}

if (!authorization) {
  refusalReasons.push('human authorization is absent');
}

if (authorization?.missionId !== mission?.missionId) {
  refusalReasons.push('authorization mission ID mismatch');
}

if (authorization?.missionDigest !== missionDigest) {
  refusalReasons.push('authorization digest mismatch');
}

if (validation.missionDigest !== missionDigest) {
  refusalReasons.push('validation digest mismatch');
}

if (
  /GOCSPX-|ya29\.|1\/\/|sk-[A-Za-z0-9_-]{16,}|Bearer\s+/i.test(
    JSON.stringify(mission?.command)
  )
) {
  refusalReasons.push('command appears to contain a credential');
}

let replayRecords = [];
try {
  replayRecords = (await readFile(replayLedger, 'utf8'))
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
} catch {
  replayRecords = [];
}

if (
  replayRecords.some(
    (record) =>
      record.missionId === mission?.missionId ||
      record.missionDigest === missionDigest
  )
) {
  refusalReasons.push('mission or digest has already executed');
}

if (refusalReasons.length > 0) {
  console.error('Execution refused:');
  for (const reason of refusalReasons) {
    console.error(`- ${reason}`);
  }
  process.exit(77);
}

const executionId = randomUUID();
const startedAt = new Date().toISOString();
const commitBefore = git('rev-parse', 'HEAD');

const executingInbox = {
  ...inbox,
  state: 'EXECUTING',
  execution: {
    executionId,
    missionId: mission.missionId,
    missionDigest,
    startedAt,
    host: hostname(),
    processId: process.pid,
    commitBefore,
    status: 'RUNNING'
  },
  updatedAt: startedAt
};

await writeFile(
  localInbox,
  `${JSON.stringify(executingInbox, null, 2)}\n`,
  'utf8'
);

const claimUpload = upload(localInbox, remoteInbox);

if (claimUpload.status !== 0) {
  console.error('Execution refused: unable to claim mission in Drive.');
  console.error(claimUpload.stderr || claimUpload.stdout);
  process.exit(74);
}

console.log();
console.log('Mission claim: RECORDED');
console.log(`Execution ID: ${executionId}`);
console.log('Starting governed execution through Build Intelligence Bridge...');
console.log();

const executionRun = run(
  join(rootDir, 'bin', 'eos-run'),
  [
    mission.missionId,
    '--',
    mission.command.executable,
    ...mission.command.arguments
  ],
  { stdio: 'inherit' }
);

const completedAt = new Date().toISOString();
const commitAfter = git('rev-parse', 'HEAD');
const changedPaths = changedPathsSince(mission.requiredCommit);
const disallowedPaths = changedPaths.filter(
  (path) => !pathAllowed(path, mission.allowedPaths)
);
const policyPassed = disallowedPaths.length === 0;
const commandPassed = executionRun.status === 0;
const outcome =
  commandPassed && policyPassed ? 'PASSED' : 'FAILED';
const finalState = policyPassed ? 'COMPLETED' : 'QUARANTINED';

const execution = {
  ...executingInbox.execution,
  completedAt,
  commitAfter,
  exitCode: executionRun.status ?? 1,
  changedPaths,
  disallowedPaths,
  policyPassed,
  outcome,
  status: 'FINISHED'
};

const finalInbox = {
  ...executingInbox,
  state: finalState,
  execution,
  updatedAt: completedAt
};

const executionFile = join(
  localExecutionDirectory,
  `${mission.missionId}-${executionId}.json`
);

await writeFile(
  localInbox,
  `${JSON.stringify(finalInbox, null, 2)}\n`,
  'utf8'
);
await writeFile(
  executionFile,
  `${JSON.stringify(finalInbox, null, 2)}\n`,
  'utf8'
);

const finalInboxUpload = upload(localInbox, remoteInbox);
const archiveFolder =
  finalState === 'COMPLETED' ? 'Completed' : 'Quarantine';
const archiveUpload = upload(
  executionFile,
  `${remoteRoot}/Control/${archiveFolder}/` +
    `${mission.missionId}-${executionId}.json`
);

if (finalInboxUpload.status !== 0 || archiveUpload.status !== 0) {
  console.error('Execution evidence synchronization failed.');
  process.exit(74);
}

await appendFile(
  replayLedger,
  `${JSON.stringify({
    missionId: mission.missionId,
    missionDigest,
    executionId,
    outcome,
    completedAt
  })}\n`,
  'utf8'
);

console.log();
console.log('Governed Mission Execution');
console.log('--------------------------');
console.log(`Mission: ${mission.missionId}`);
console.log(`Outcome: ${outcome}`);
console.log(`Lifecycle state: ${finalState}`);
console.log(`Policy check: ${policyPassed ? 'PASS' : 'FAIL'}`);
console.log(`Changed paths: ${changedPaths.length}`);

if (disallowedPaths.length > 0) {
  console.error(`Disallowed paths: ${disallowedPaths.join(', ')}`);
}

process.exit(
  !policyPassed ? 77 : executionRun.status ?? 1
);
