import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const rootDir = process.cwd();

console.log('Running Objective 10.x.3 restore validation tests...');

execFileSync(
  process.execPath,
  ['scripts/eos-restore.js', '--latest', '--validate-restore'],
  {
    cwd: rootDir,
    stdio: 'ignore'
  }
);

const backupStatus = JSON.parse(
  readFileSync(
    join(rootDir, 'backups', 'backup-status.json'),
    'utf8'
  )
);

const recoveryReport = JSON.parse(
  readFileSync(
    join(rootDir, 'runtime', 'recovery', 'latest-recovery-validation.json'),
    'utf8'
  )
);

assert.equal(backupStatus.latestIntegrityValidationStatus, 'Validated');
assert.equal(backupStatus.latestRestoreValidationStatus, 'Validated');
assert.equal(
  backupStatus.latestRestoreValidationArchive,
  recoveryReport.archiveName
);

assert.equal(recoveryReport.requestedMode, 'isolated-restore-validation');
assert.equal(recoveryReport.checksumValid, true);
assert.equal(recoveryReport.status, 'Restore Validated');
assert.equal(recoveryReport.restoreValidation.status, 'PASS');
assert.equal(recoveryReport.restoreValidation.failedChecks, 0);

console.log('PASS backup integrity validation state');
console.log('PASS isolated restore validation state');
console.log('PASS recovery report contract');
console.log('All Objective 10.x.3 restore validation tests passed.');
