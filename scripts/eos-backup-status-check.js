import { readFile } from 'node:fs/promises';

import { backupStatusFile } from './eos-common.js';

const requiredFields = [
  'latestBackupTimestamp',
  'latestBackupLocalTime',
  'latestBackupVersion',
  'latestBackupArchive',
  'latestBackupSize',
  'latestBackupChecksum',
  'latestBackupStatus',
  'latestBackupDataIncluded',
  'latestRestoreValidationStatus',
  'backupCount',
  'lastUpdated'
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const backupStatus = JSON.parse(await readFile(backupStatusFile, 'utf8'));

for (const field of requiredFields) {
  assert(field in backupStatus, `backups/backup-status.json is missing ${field}`);
}

assert(typeof backupStatus.latestBackupTimestamp === 'string', 'latestBackupTimestamp must be a string');
assert(typeof backupStatus.latestBackupLocalTime === 'string', 'latestBackupLocalTime must be a string');
assert(typeof backupStatus.latestBackupVersion === 'string', 'latestBackupVersion must be a string');
assert(typeof backupStatus.latestBackupArchive === 'string', 'latestBackupArchive must be a string');
assert(Number.isInteger(backupStatus.latestBackupSize), 'latestBackupSize must be an integer');
assert(typeof backupStatus.latestBackupChecksum === 'string', 'latestBackupChecksum must be a string');
assert(/^[a-f0-9]{64}$/u.test(backupStatus.latestBackupChecksum), 'latestBackupChecksum must be a SHA-256 checksum');
assert(['Completed', 'Failed'].includes(backupStatus.latestBackupStatus), 'latestBackupStatus must be Completed or Failed');
assert(typeof backupStatus.latestBackupDataIncluded === 'boolean', 'latestBackupDataIncluded must be a boolean');
assert(
  ['Not validated', 'Validated', 'Failed'].includes(backupStatus.latestRestoreValidationStatus),
  'latestRestoreValidationStatus must be Not validated, Validated, or Failed'
);
assert(Number.isInteger(backupStatus.backupCount), 'backupCount must be an integer');
assert(typeof backupStatus.lastUpdated === 'string', 'lastUpdated must be a string');

console.log('EOS backup status check passed.');
