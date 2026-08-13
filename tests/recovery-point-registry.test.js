import assert from 'node:assert/strict';
import {
  mkdtempSync,
  readFileSync,
  writeFileSync
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const rootDir = process.cwd();

console.log(
  'Running Objective 10.x.4 recovery point registry tests...'
);

const fixtureDir = mkdtempSync(
  join(
    tmpdir(),
    'eos-recovery-registry-test-'
  )
);

const backupStatusFile = join(
  fixtureDir,
  'backup-status.json'
);

const registryFile = join(
  fixtureDir,
  'registry.json'
);

function writeJson(file, value) {
  writeFileSync(
    file,
    JSON.stringify(value, null, 2) + '\n'
  );
}

function runRegistration() {
  return spawnSync(
    process.execPath,
    [
      'scripts/runtime/eos-recovery-point-register.js',
      '--backup-status-file',
      backupStatusFile,
      '--registry-file',
      registryFile
    ],
    {
      cwd: rootDir,
      encoding: 'utf8'
    }
  );
}

function baseBackupStatus() {
  return {
    latestBackupTimestamp: '2026-08-13_000000',
    latestBackupVersion: '0.25.0',
    latestBackupArchive: 'EOS_TEST.zip',
    latestBackupChecksum:
      '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
    latestBackupStatus: 'Completed',
    latestIntegrityValidationStatus: 'Validated',
    latestRestoreValidationStatus: 'Validated',
    latestRestoreValidationArchive: 'EOS_TEST.zip',
    latestRestoreValidationTimestamp:
      '2026-08-13T00:00:00.000Z',
    latestBackupGitBranch: 'main',
    latestBackupGitCommit:
      '0123456789abcdef0123456789abcdef01234567',
    latestBackupGitClean: true,
    latestBackupRecoveryEligibility:
      'Pending Validation',
    lastUpdated:
      '2026-08-13T00:00:00.000Z'
  };
}

writeJson(
  registryFile,
  {
    registry:
      'EOS Known-Good Recovery Point Registry',
    version: '1',
    objective: '10.x.4',
    updatedAt: null,
    recoveryPoints: []
  }
);

const legacy = baseBackupStatus();
delete legacy.latestBackupGitCommit;
delete legacy.latestBackupGitBranch;
delete legacy.latestBackupGitClean;

writeJson(
  backupStatusFile,
  legacy
);

const legacyResult =
  runRegistration();

assert.notEqual(
  legacyResult.status,
  0,
  'Legacy backup registration should fail'
);

assert.match(
  legacyResult.stderr,
  /Immutable Git commit missing/u
);

assert.match(
  legacyResult.stderr,
  /Git branch missing/u
);

assert.match(
  legacyResult.stderr,
  /Working tree was dirty/u
);

console.log(
  'PASS legacy backup registration rejected'
);

const valid = baseBackupStatus();

writeJson(
  backupStatusFile,
  valid
);

const validResult =
  runRegistration();

assert.equal(
  validResult.status,
  0,
  validResult.stderr
);

const registry = JSON.parse(
  readFileSync(
    registryFile,
    'utf8'
  )
);

assert.equal(
  registry.recoveryPoints.length,
  1
);

assert.equal(
  registry.recoveryPoints[0].status,
  'Known Good'
);

assert.equal(
  registry.recoveryPoints[0].eligible,
  true
);

console.log(
  'PASS validated provenance-aware backup registered'
);

const updatedBackupStatus = JSON.parse(
  readFileSync(
    backupStatusFile,
    'utf8'
  )
);

assert.equal(
  updatedBackupStatus.latestBackupRecoveryEligibility,
  'Known Good'
);

console.log(
  'PASS backup eligibility promoted to Known Good'
);

const duplicateResult =
  runRegistration();

assert.equal(
  duplicateResult.status,
  0,
  duplicateResult.stderr
);

const duplicateRegistry = JSON.parse(
  readFileSync(
    registryFile,
    'utf8'
  )
);

assert.equal(
  duplicateRegistry.recoveryPoints.length,
  1
);

console.log(
  'PASS duplicate recovery point registration prevented'
);

console.log(
  'All Objective 10.x.4 recovery point registry tests passed.'
);
