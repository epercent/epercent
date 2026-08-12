import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  writeFileSync
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const rootDir = process.cwd();

console.log('Running Objective 10.x.4 recovery executor tests...');

function runExecutor(decisionFile, backupsDir, resultFile) {
  return spawnSync(
    process.execPath,
    [
      'scripts/runtime/eos-recovery-executor.js',
      '--decision-file',
      decisionFile,
      '--backups-dir',
      backupsDir,
      '--result-file',
      resultFile
    ],
    {
      cwd: rootDir,
      encoding: 'utf8'
    }
  );
}

const fixtureDir = mkdtempSync(
  join(tmpdir(), 'eos-recovery-executor-test-')
);

const backupsDir = join(fixtureDir, 'backups');
mkdirSync(backupsDir, { recursive: true });

const noActionDecisionFile = join(
  fixtureDir,
  'no-action-decision.json'
);

const blockedDecisionFile = join(
  fixtureDir,
  'blocked-decision.json'
);

const readyDecisionFile = join(
  fixtureDir,
  'ready-decision.json'
);

const noActionResultFile = join(
  fixtureDir,
  'no-action-result.json'
);

const blockedResultFile = join(
  fixtureDir,
  'blocked-result.json'
);

const readyResultFile = join(
  fixtureDir,
  'ready-result.json'
);

writeFileSync(
  noActionDecisionFile,
  JSON.stringify({
    decision: 'NO_RECOVERY_REQUIRED'
  }, null, 2)
);

const noActionResult = runExecutor(
  noActionDecisionFile,
  backupsDir,
  noActionResultFile
);

assert.equal(
  noActionResult.status,
  0,
  noActionResult.stderr
);

const noActionPayload = JSON.parse(
  readFileSync(noActionResultFile, 'utf8')
);

assert.equal(
  noActionPayload.status,
  'NO_ACTION_REQUIRED'
);

console.log(
  'PASS no-recovery decision causes no action'
);

writeFileSync(
  blockedDecisionFile,
  JSON.stringify({
    decision: 'RECOVERY_BLOCKED',
    selectedRecoveryPoint: null
  }, null, 2)
);

const blockedResult = runExecutor(
  blockedDecisionFile,
  backupsDir,
  blockedResultFile
);

assert.equal(
  blockedResult.status,
  2
);

assert.match(
  blockedResult.stderr,
  /no RECOVERY_READY decision/u
);

console.log(
  'PASS blocked recovery decision refuses execution'
);

const candidateSource = join(
  fixtureDir,
  'candidate-source'
);

mkdirSync(
  join(candidateSource, 'backend', 'src'),
  { recursive: true }
);

mkdirSync(
  join(candidateSource, 'frontend'),
  { recursive: true }
);

mkdirSync(
  join(candidateSource, 'data'),
  { recursive: true }
);

mkdirSync(
  join(candidateSource, 'scripts'),
  { recursive: true }
);

writeFileSync(
  join(candidateSource, 'package.json'),
  JSON.stringify({
    name: 'eos',
    version: '0.25.0'
  }, null, 2)
);

writeFileSync(
  join(candidateSource, 'backend', 'package.json'),
  JSON.stringify({
    name: 'eos-core-api',
    version: '0.25.0'
  }, null, 2)
);

writeFileSync(
  join(candidateSource, 'backend', 'src', 'app.js'),
  'export default {};\n'
);

writeFileSync(
  join(candidateSource, 'backend', 'src', 'server.js'),
  'console.log("test");\n'
);

const archiveName = 'EOS_TEST_RECOVERY_READY.zip';
const archivePath = join(backupsDir, archiveName);

const zipResult = spawnSync(
  'zip',
  [
    '-r',
    '-q',
    archivePath,
    '.'
  ],
  {
    cwd: candidateSource,
    encoding: 'utf8'
  }
);

assert.equal(
  zipResult.status,
  0,
  zipResult.stderr
);

const checksum = createHash('sha256')
  .update(readFileSync(archivePath))
  .digest('hex');

writeFileSync(
  readyDecisionFile,
  JSON.stringify({
    decision: 'RECOVERY_READY',
    selectedRecoveryPoint: {
      id: 'EOS-RP-TEST-EXEC-001',
      archive: archiveName,
      eosVersion: '0.25.0',
      git: {
        branch: 'main',
        commit: '0123456789abcdef0123456789abcdef01234567',
        clean: true
      },
      checksum,
      registeredAt: new Date().toISOString()
    }
  }, null, 2)
);

const readyResult = runExecutor(
  readyDecisionFile,
  backupsDir,
  readyResultFile
);

assert.equal(
  readyResult.status,
  0,
  readyResult.stderr
);

const readyPayload = JSON.parse(
  readFileSync(readyResultFile, 'utf8')
);

assert.equal(
  readyPayload.status,
  'CANDIDATE_READY'
);

assert.equal(
  readyPayload.checksumValid,
  true
);

assert.equal(
  readyPayload.validation.status,
  'PASS'
);

assert.equal(
  readyPayload.validation.failedChecks,
  0
);

assert.equal(
  readyPayload.promotionAuthorized,
  false
);

console.log(
  'PASS recovery-ready decision creates isolated candidate'
);

console.log(
  'PASS recovery candidate passes structural validation'
);

console.log(
  'PASS live promotion remains disabled'
);

console.log(
  'All Objective 10.x.4 recovery executor tests passed.'
);
