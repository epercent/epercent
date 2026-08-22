import { createHash, randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { userInfo } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createInterface } from 'node:readline/promises';

import { rootDir } from './eos-common.js';
import { printOperatorExplanationSafely } from './eos-operator-narration.js';

const missionId = process.argv[2];

if (!missionId) {
  console.error('Usage: bin/eos-authorize <mission-id>');
  process.exit(64);
}

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
const localAuthorizationDirectory = join(
  localControlDirectory,
  'authorizations'
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

const validationRun = run(
  'node',
  [join(rootDir, 'scripts', 'eos-mission-control.js'), 'pull'],
  { stdio: 'inherit' }
);

if (validationRun.status !== 0) {
  console.error('Authorization denied: mission validation failed.');
  process.exit(1);
}

const inbox = JSON.parse(await readFile(localInbox, 'utf8'));
const validation = JSON.parse(await readFile(localValidation, 'utf8'));

const refusalReasons = [];

if (inbox.state !== 'PROPOSED') {
  refusalReasons.push('mission state must be PROPOSED');
}

if (inbox.mission?.missionId !== missionId) {
  refusalReasons.push('typed mission ID does not match inbox mission');
}

if (inbox.mission?.authorityLevel !== 'A1') {
  refusalReasons.push('only A1 missions may use this authorization gate');
}

if (inbox.mission?.executionPermitted !== true) {
  refusalReasons.push('proposal does not permit execution');
}

if (
  !validation.schemaValid ||
  !validation.branchMatches ||
  !validation.commitMatches ||
  !validation.repositoryClean
) {
  refusalReasons.push('validation or repository provenance failed');
}

const missionDigest = digest(inbox.mission);

if (validation.missionDigest !== missionDigest) {
  refusalReasons.push('mission digest mismatch');
}

if (inbox.authorization !== null) {
  refusalReasons.push('mission already contains authorization');
}

if (refusalReasons.length > 0) {
  printOperatorExplanationSafely(
    { phase: 'AUTHORIZATION_REFUSED', inbox, validation },
    process.stderr,
    process.stderr
  );
  console.error('Authorization refused:');
  for (const reason of refusalReasons) {
    console.error(`- ${reason}`);
  }
  process.exit(77);
}

printOperatorExplanationSafely({
  phase: 'AUTHORIZATION_REQUIRED',
  inbox,
  validation
});

console.log();
console.log('Human Authorization Required');
console.log('----------------------------');
console.log(`Mission: ${missionId}`);
console.log(`Title: ${inbox.mission.title}`);
console.log(
  `Command: ${inbox.mission.command.executable} ` +
    inbox.mission.command.arguments.join(' ')
);
console.log(`Branch: ${inbox.mission.requiredBranch}`);
console.log(`Commit: ${inbox.mission.requiredCommit}`);
console.log(`Allowed paths: ${inbox.mission.allowedPaths.join(', ') || 'none'}`);
console.log(`Mission SHA-256: ${missionDigest}`);
console.log();

const requiredPhrase = `AUTHORIZE ${missionId}`;
const prompt = createInterface({
  input: process.stdin,
  output: process.stdout
});
const response = await prompt.question(
  `Type "${requiredPhrase}" to authorize: `
);
prompt.close();

if (response.trim() !== requiredPhrase) {
  printOperatorExplanationSafely(
    { phase: 'AUTHORIZATION_CANCELLED', inbox, validation },
    process.stderr,
    process.stderr
  );
  console.error('Authorization cancelled: confirmation phrase did not match.');
  process.exit(77);
}

const authorizedAt = new Date().toISOString();
const authorizationId = randomUUID();
const authorization = {
  authorizationId,
  missionId,
  missionDigest,
  authorizedBy: userInfo().username,
  authority: 'A1-human-explicit',
  approvalMethod: 'terminal-confirmation-phrase',
  authorizedAt
};

const authorizedInbox = {
  ...inbox,
  state: 'AUTHORIZED',
  authorization,
  updatedAt: authorizedAt
};

await mkdir(localAuthorizationDirectory, { recursive: true });

const authorizedInboxFile = join(
  localAuthorizationDirectory,
  `${missionId}-${authorizationId}-inbox.json`
);
await writeFile(
  authorizedInboxFile,
  `${JSON.stringify(authorizedInbox, null, 2)}\n`,
  'utf8'
);

const authorizationFile = join(
  localAuthorizationDirectory,
  `${missionId}-${authorizationId}.json`
);

await writeFile(
  authorizationFile,
  `${JSON.stringify(
    {
      schemaVersion: '1.0.0',
      authorization,
      mission: inbox.mission
    },
    null,
    2
  )}\n`,
  'utf8'
);

const inboxUpload = run('rclone', [
  'copyto',
  authorizedInboxFile,
  remoteInbox
]);

const authorizationUpload = run('rclone', [
  'copyto',
  authorizationFile,
  `${remoteRoot}/Control/Authorized/${missionId}-${authorizationId}.json`
]);

if (inboxUpload.status !== 0 || authorizationUpload.status !== 0) {
  console.error('Authorization synchronization failed.');
  console.error(inboxUpload.stderr || authorizationUpload.stderr);
  process.exit(74);
}

printOperatorExplanationSafely({
  phase: 'AUTHORIZATION_RECORDED',
  inbox: authorizedInbox,
  validation: { ...validation, executableNow: true }
});

console.log('Authorization: RECORDED');
console.log(`Authorization ID: ${authorizationId}`);
console.log(`Mission SHA-256: ${missionDigest}`);
console.log('Execution: NOT STARTED');
