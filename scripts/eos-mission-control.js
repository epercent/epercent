import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

import { rootDir } from './eos-common.js';
import { printOperatorExplanationSafely } from './eos-operator-narration.js';

const remoteInbox =
  process.env.EOS_MISSION_REMOTE ??
  'eos-drive:eOS Build Intelligence Bridge/Control/Inbox/EOS-MISSION-INBOX.json';

const localControlDirectory = join(rootDir, '.eos', 'control');
const localInbox = join(localControlDirectory, 'EOS-MISSION-INBOX.json');
const localValidation = join(
  localControlDirectory,
  'EOS-MISSION-VALIDATION.json'
);

const allowedStates = new Set([
  'EMPTY',
  'PROPOSED',
  'PROPOSED_TEST_ONLY',
  'AUTHORIZED',
  'EXECUTING',
  'COMPLETED',
  'REJECTED',
  'QUARANTINED'
]);

const allowedExecutables = new Set(['node', 'npm']);

function run(command, args) {
  return spawnSync(command, args, {
    cwd: rootDir,
    encoding: 'utf8'
  });
}

function git(...args) {
  const result = run('git', args);
  return result.status === 0 ? result.stdout.trim() : 'unavailable';
}

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

function nonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function validateInbox(inbox) {
  const errors = [];
  const checks = [];

  const check = (condition, label) => {
    checks.push({ passed: Boolean(condition), label });
    if (!condition) {
      errors.push(label);
    }
  };

  check(inbox?.schemaVersion === '1.0.0', 'Supported schema version');
  check(
    inbox?.channel === 'EOS_BUILD_MISSION_CONTROL',
    'Expected control channel'
  );
  check(
    Number.isInteger(inbox?.generation) && inbox.generation >= 0,
    'Valid generation'
  );
  check(allowedStates.has(inbox?.state), 'Recognized lifecycle state');

  if (inbox?.state === 'EMPTY') {
    check(inbox.mission === null, 'Empty inbox contains no mission');
    return { checks, errors, missionDigest: null };
  }

  const mission = inbox?.mission;
  check(mission && typeof mission === 'object', 'Mission object present');

  if (!mission || typeof mission !== 'object') {
    return { checks, errors, missionDigest: null };
  }

  check(nonEmptyString(mission.missionId), 'Mission ID present');
  check(nonEmptyString(mission.objectiveId), 'Objective ID present');
  check(nonEmptyString(mission.title), 'Mission title present');
  check(mission.authorityLevel === 'A1', 'Authority restricted to A1');
  check(nonEmptyString(mission.requiredBranch), 'Required branch present');
  check(
    /^[0-9a-f]{40}$/i.test(mission.requiredCommit ?? ''),
    'Required commit is a full Git SHA'
  );
  check(
    mission.command && typeof mission.command === 'object',
    'Command object present'
  );
  check(
    allowedExecutables.has(mission.command?.executable),
    'Executable is allowlisted'
  );
  check(
    Array.isArray(mission.command?.arguments) &&
      mission.command.arguments.every((value) => typeof value === 'string'),
    'Command arguments are strings'
  );
  check(
    Array.isArray(mission.allowedPaths) &&
      mission.allowedPaths.every(
        (value) =>
          nonEmptyString(value) &&
          !value.startsWith('/') &&
          !value.split('/').includes('..')
      ),
    'Allowed paths are repository-relative'
  );
  check(
    typeof mission.executionPermitted === 'boolean',
    'Execution-permission flag present'
  );

  const expiry = Date.parse(mission.expiresAt);
  check(Number.isFinite(expiry), 'Valid mission expiry');
  check(Number.isFinite(expiry) && expiry > Date.now(), 'Mission not expired');

  if (
    inbox.state === 'PROPOSED' ||
    inbox.state === 'PROPOSED_TEST_ONLY'
  ) {
    check(inbox.authorization === null, 'Proposal is not pre-authorized');
  }

  return {
    checks,
    errors,
    missionDigest: digest(mission)
  };
}

async function pullAndValidate() {
  await mkdir(localControlDirectory, { recursive: true });

  const pull = run('rclone', ['copyto', remoteInbox, localInbox]);
  if (pull.status !== 0) {
    console.error(pull.stderr || pull.stdout);
    process.exit(69);
  }

  let inbox;
  try {
    inbox = JSON.parse(await readFile(localInbox, 'utf8'));
  } catch (error) {
    console.error(`Mission inbox is not valid JSON: ${error.message}`);
    process.exit(65);
  }

  const validation = validateInbox(inbox);
  const branch = git('branch', '--show-current');
  const commit = git('rev-parse', 'HEAD');
  const clean = git('status', '--short') === '';

  const terminalStates = new Set([
    'COMPLETED',
    'REJECTED',
    'QUARANTINED'
  ]);

  const provenanceBindingRequired =
    inbox.state !== 'EMPTY' && !terminalStates.has(inbox.state);

  const branchMatches =
    !provenanceBindingRequired ||
    inbox.mission?.requiredBranch === branch;

  const commitMatches =
    !provenanceBindingRequired ||
    inbox.mission?.requiredCommit === commit;

  const report = {
    schemaVersion: '1.0.0',
    validatedAt: new Date().toISOString(),
    generation: inbox.generation,
    state: inbox.state,
    missionId: inbox.mission?.missionId ?? null,
    missionDigest: validation.missionDigest,
    schemaValid: validation.errors.length === 0,
    branch,
    requiredBranch: inbox.mission?.requiredBranch ?? null,
    branchMatches,
    commit,
    requiredCommit: inbox.mission?.requiredCommit ?? null,
    commitMatches,
    repositoryClean: clean,
    executionPermitted: inbox.mission?.executionPermitted === true,
    humanAuthorized: inbox.authorization !== null,
    executableNow:
      inbox.state === 'AUTHORIZED' &&
      validation.errors.length === 0 &&
      branchMatches &&
      commitMatches &&
      clean &&
      inbox.mission?.executionPermitted === true &&
      inbox.authorization !== null,
    checks: validation.checks
  };

  await writeFile(
    localValidation,
    `${JSON.stringify(report, null, 2)}\n`,
    'utf8'
  );

  console.log('eOS Governed Mission Control');
  console.log('----------------------------');
  console.log(`Generation: ${report.generation}`);
  console.log(`State: ${report.state}`);
  console.log(`Mission: ${report.missionId ?? 'None'}`);
  console.log(`Schema validation: ${report.schemaValid ? 'PASS' : 'FAIL'}`);
  console.log(`Branch match: ${report.branchMatches ? 'PASS' : 'FAIL'}`);
  console.log(`Commit match: ${report.commitMatches ? 'PASS' : 'FAIL'}`);
  console.log(`Repository clean: ${report.repositoryClean ? 'PASS' : 'FAIL'}`);
  console.log(
    `Execution permission: ${report.executionPermitted ? 'YES' : 'NO'}`
  );
  console.log(`Human authorization: ${report.humanAuthorized ? 'YES' : 'NO'}`);
  console.log(`Executable now: ${report.executableNow ? 'YES' : 'NO'}`);
  console.log(`Mission SHA-256: ${report.missionDigest ?? 'None'}`);

  printOperatorExplanationSafely({
    phase: 'MISSION_' + report.state,
    inbox,
    validation: report
  });

  const repositoryStateValid =
    !provenanceBindingRequired || clean;

  if (
    !report.schemaValid ||
    !branchMatches ||
    !commitMatches ||
    !repositoryStateValid
  ) {
    process.exit(1);
  }
}

const action = process.argv[2] ?? 'pull';

if (action !== 'pull') {
  console.error('Usage: bin/eos-mission pull');
  process.exit(64);
}

await pullAndValidate();
