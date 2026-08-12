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

console.log('Running Objective 10.x.4 recovery manager tests...');

function runManager(runtimeFile, registryFile = null, backupsDir = null) {
  const args = [
    'scripts/runtime/eos-recovery-manager.js',
    '--runtime-status-file',
    runtimeFile
  ];

  if (registryFile) {
    args.push('--registry-file', registryFile);
  }

  if (backupsDir) {
    args.push('--backups-dir', backupsDir);
  }

  return spawnSync(
    process.execPath,
    args,
    {
      cwd: rootDir,
      encoding: 'utf8'
    }
  );
}

const fixtureDir = mkdtempSync(
  join(tmpdir(), 'eos-recovery-manager-test-')
);

const healthyFile = join(fixtureDir, 'healthy-runtime.json');
const unhealthyFile = join(fixtureDir, 'unhealthy-runtime.json');

writeFileSync(
  healthyFile,
  JSON.stringify({
    healthy: true,
    platform_status: 'Operational'
  }, null, 2)
);

writeFileSync(
  unhealthyFile,
  JSON.stringify({
    healthy: false,
    platform_status: 'Not Operational'
  }, null, 2)
);

const healthyResult = runManager(healthyFile);

assert.equal(healthyResult.status, 0, healthyResult.stderr);

const healthyDecision = JSON.parse(healthyResult.stdout);

assert.equal(
  healthyDecision.decision,
  'NO_RECOVERY_REQUIRED'
);

assert.equal(
  healthyDecision.recoveryRequired,
  false
);

console.log('PASS healthy runtime does not trigger recovery');

const emptyRegistryFile = join(
  fixtureDir,
  'empty-registry.json'
);

writeFileSync(
  emptyRegistryFile,
  JSON.stringify({
    registry: 'EOS Known-Good Recovery Point Registry',
    version: '1',
    objective: '10.x.4',
    updatedAt: null,
    recoveryPoints: []
  }, null, 2)
);

const unhealthyResult = runManager(
  unhealthyFile,
  emptyRegistryFile,
  fixtureDir
);

assert.equal(unhealthyResult.status, 2);

const unhealthyDecision = JSON.parse(
  unhealthyResult.stdout
);

assert.equal(
  unhealthyDecision.decision,
  'RECOVERY_BLOCKED'
);

assert.equal(
  unhealthyDecision.recoveryRequired,
  true
);

assert.equal(
  unhealthyDecision.recoveryAvailable,
  false
);

console.log(
  'PASS unhealthy runtime without trusted recovery point is blocked'
);

const backupsDir = join(fixtureDir, 'backups');
mkdirSync(backupsDir, { recursive: true });

const archiveName = 'EOS_TEST_KNOWN_GOOD.zip';
const archivePath = join(backupsDir, archiveName);

writeFileSync(
  archivePath,
  'EOS known-good recovery fixture\n'
);

const checksum = createHash('sha256')
  .update(readFileSync(archivePath))
  .digest('hex');

const knownGoodRegistryFile = join(
  fixtureDir,
  'known-good-registry.json'
);

writeFileSync(
  knownGoodRegistryFile,
  JSON.stringify({
    registry: 'EOS Known-Good Recovery Point Registry',
    version: '1',
    objective: '10.x.4',
    updatedAt: new Date().toISOString(),
    recoveryPoints: [
      {
        id: 'EOS-RP-TEST-001',
        registeredAt: new Date().toISOString(),
        archive: archiveName,
        eosVersion: '0.25.0',
        git: {
          branch: 'main',
          commit: '0123456789abcdef0123456789abcdef01234567',
          clean: true
        },
        checksum,
        integrityValidation: 'Validated',
        restoreValidation: 'Validated',
        eligible: true,
        status: 'Known Good'
      }
    ]
  }, null, 2)
);

const readyResult = runManager(
  unhealthyFile,
  knownGoodRegistryFile,
  backupsDir
);

assert.equal(
  readyResult.status,
  0,
  readyResult.stderr
);

const readyDecision = JSON.parse(
  readyResult.stdout
);

assert.equal(
  readyDecision.decision,
  'RECOVERY_READY'
);

assert.equal(
  readyDecision.recoveryRequired,
  true
);

assert.equal(
  readyDecision.recoveryAvailable,
  true
);

assert.equal(
  readyDecision.selectedRecoveryPoint.id,
  'EOS-RP-TEST-001'
);

assert.equal(
  readyDecision.selectedRecoveryPoint.archive,
  archiveName
);

console.log(
  'PASS unhealthy runtime with trusted recovery point becomes recovery ready'
);

const decisionFile = join(
  rootDir,
  'runtime',
  'recovery',
  'latest-recovery-decision.json'
);

const persistedDecision = JSON.parse(
  readFileSync(decisionFile, 'utf8')
);

assert.equal(
  persistedDecision.decision,
  'RECOVERY_READY'
);

console.log(
  'PASS machine-readable recovery-ready decision persisted'
);

console.log(
  'All Objective 10.x.4 recovery manager tests passed.'
);
