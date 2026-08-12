import { readFile } from 'node:fs/promises';

import { backupStatusFile } from './eos-common.js';

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const backupStatus = JSON.parse(
  await readFile(backupStatusFile, 'utf8')
);

const coreRequiredFields = [
  'latestBackupTimestamp',
  'latestBackupLocalTime',
  'latestBackupVersion',
  'latestBackupArchive',
  'latestBackupSize',
  'latestBackupChecksum',
  'latestBackupStatus',
  'latestBackupDataIncluded',
  'latestIntegrityValidationStatus',
  'latestRestoreValidationStatus',
  'latestRestoreValidationArchive',
  'latestRestoreValidationTimestamp',
  'backupCount',
  'lastUpdated'
];

for (const field of coreRequiredFields) {
  assert(
    field in backupStatus,
    `backups/backup-status.json is missing ${field}`
  );
}

assert(
  typeof backupStatus.latestBackupTimestamp === 'string',
  'latestBackupTimestamp must be a string'
);

assert(
  typeof backupStatus.latestBackupLocalTime === 'string',
  'latestBackupLocalTime must be a string'
);

assert(
  typeof backupStatus.latestBackupVersion === 'string',
  'latestBackupVersion must be a string'
);

assert(
  typeof backupStatus.latestBackupArchive === 'string',
  'latestBackupArchive must be a string'
);

assert(
  Number.isInteger(backupStatus.latestBackupSize),
  'latestBackupSize must be an integer'
);

assert(
  typeof backupStatus.latestBackupChecksum === 'string' &&
    /^[a-f0-9]{64}$/u.test(
      backupStatus.latestBackupChecksum
    ),
  'latestBackupChecksum must be a SHA-256 checksum'
);

assert(
  ['Completed', 'Failed'].includes(
    backupStatus.latestBackupStatus
  ),
  'latestBackupStatus must be Completed or Failed'
);

assert(
  typeof backupStatus.latestBackupDataIncluded === 'boolean',
  'latestBackupDataIncluded must be a boolean'
);

assert(
  ['Not validated', 'Validated', 'Failed'].includes(
    backupStatus.latestIntegrityValidationStatus
  ),
  'latestIntegrityValidationStatus has invalid value'
);

assert(
  ['Not validated', 'Validated', 'Failed'].includes(
    backupStatus.latestRestoreValidationStatus
  ),
  'latestRestoreValidationStatus has invalid value'
);

assert(
  backupStatus.latestRestoreValidationArchive === null ||
    typeof backupStatus.latestRestoreValidationArchive === 'string',
  'latestRestoreValidationArchive must be null or a string'
);

assert(
  backupStatus.latestRestoreValidationTimestamp === null ||
    typeof backupStatus.latestRestoreValidationTimestamp === 'string',
  'latestRestoreValidationTimestamp must be null or a string'
);

assert(
  Number.isInteger(backupStatus.backupCount),
  'backupCount must be an integer'
);

assert(
  typeof backupStatus.lastUpdated === 'string',
  'lastUpdated must be a string'
);

const hasProvenanceFields = [
  'latestBackupGitBranch',
  'latestBackupGitCommit',
  'latestBackupGitClean',
  'latestBackupGitChangedEntries',
  'latestBackupRecoveryEligibility'
].every((field) => field in backupStatus);

if (hasProvenanceFields) {
  assert(
    typeof backupStatus.latestBackupGitBranch === 'string',
    'latestBackupGitBranch must be a string'
  );

  assert(
    backupStatus.latestBackupGitCommit === null ||
      /^[a-f0-9]{40}$/u.test(
        backupStatus.latestBackupGitCommit
      ),
    'latestBackupGitCommit must be null or a full Git SHA'
  );

  assert(
    typeof backupStatus.latestBackupGitClean === 'boolean',
    'latestBackupGitClean must be a boolean'
  );

  assert(
    backupStatus.latestBackupGitChangedEntries === null ||
      Number.isInteger(
        backupStatus.latestBackupGitChangedEntries
      ),
    'latestBackupGitChangedEntries must be null or an integer'
  );

  assert(
    [
      'Pending Validation',
      'Ineligible - Dirty Working Tree',
      'Known Good'
    ].includes(
      backupStatus.latestBackupRecoveryEligibility
    ),
    'latestBackupRecoveryEligibility has invalid value'
  );

  console.log('EOS backup status check passed with Git provenance.');
} else {
  console.log(
    'EOS backup status check passed in legacy compatibility mode.'
  );
}
