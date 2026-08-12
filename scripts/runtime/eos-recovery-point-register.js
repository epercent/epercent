import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

import { rootDir } from '../eos-common.js';
import {
  evaluateRecoveryEligibility
} from './eos-recovery-eligibility.js';

const backupStatusFile = join(
  rootDir,
  'backups',
  'backup-status.json'
);

const registryFile = join(
  rootDir,
  'runtime',
  'recovery',
  'registry',
  'known-good-recovery-points.json'
);

async function readJson(file, fallback) {
  try {
    return JSON.parse(
      await readFile(file, 'utf8')
    );
  } catch {
    return fallback;
  }
}

const backupStatus = await readJson(
  backupStatusFile,
  null
);

if (!backupStatus) {
  console.error(
    'Cannot register recovery point: backup status unavailable.'
  );
  process.exit(1);
}

if (
  backupStatus.latestRestoreValidationArchive !==
  backupStatus.latestBackupArchive
) {
  console.error(
    'Cannot register recovery point: restore validation does not match latest backup.'
  );
  process.exit(1);
}

const eligibility = evaluateRecoveryEligibility({
  backupStatus:
    backupStatus.latestBackupStatus,
  integrityValidation:
    backupStatus.latestIntegrityValidationStatus,
  restoreValidation:
    backupStatus.latestRestoreValidationStatus,
  gitCommit:
    backupStatus.latestBackupGitCommit,
  gitBranch:
    backupStatus.latestBackupGitBranch,
  gitClean:
    backupStatus.latestBackupGitClean
});

if (!eligibility.eligible) {
  console.error(
    `Cannot register recovery point: ${eligibility.reasons.join('; ')}.`
  );
  process.exit(1);
}

const registry = await readJson(
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

const existing = registry.recoveryPoints.find(
  (point) =>
    point.archive ===
      backupStatus.latestBackupArchive &&
    point.git?.commit ===
      backupStatus.latestBackupGitCommit
);

if (existing) {
  console.log(
    'EOS recovery point already registered.'
  );
  console.log(`ID: ${existing.id}`);
  console.log(`Archive: ${existing.archive}`);
  console.log(`Commit: ${existing.git.commit}`);
  process.exit(0);
}

const recoveryPoint = {
  id: `EOS-RP-${Date.now()}`,
  registeredAt: new Date().toISOString(),
  archive:
    backupStatus.latestBackupArchive,
  backupTimestamp:
    backupStatus.latestBackupTimestamp,
  eosVersion:
    backupStatus.latestBackupVersion,
  git: {
    branch:
      backupStatus.latestBackupGitBranch,
    commit:
      backupStatus.latestBackupGitCommit,
    clean:
      backupStatus.latestBackupGitClean
  },
  checksum:
    backupStatus.latestBackupChecksum,
  integrityValidation:
    backupStatus.latestIntegrityValidationStatus,
  restoreValidation:
    backupStatus.latestRestoreValidationStatus,
  restoreValidationTimestamp:
    backupStatus.latestRestoreValidationTimestamp,
  eligibility,
  eligible: true,
  status: 'Known Good'
};

registry.updatedAt =
  new Date().toISOString();

registry.recoveryPoints.push(
  recoveryPoint
);

await mkdir(
  dirname(registryFile),
  { recursive: true }
);

await writeFile(
  registryFile,
  `${JSON.stringify(registry, null, 2)}\n`
);

console.log(
  'EOS recovery point registered.'
);
console.log(
  `ID: ${recoveryPoint.id}`
);
console.log(
  `Archive: ${recoveryPoint.archive}`
);
console.log(
  `Commit: ${recoveryPoint.git.commit}`
);
console.log(
  `Branch: ${recoveryPoint.git.branch}`
);
console.log(
  `Status: ${recoveryPoint.status}`
);
