import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import {
  access,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  stat,
  writeFile
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';
import { spawn } from 'node:child_process';

import { rootDir } from './eos-common.js';

const backupsDir = join(rootDir, 'backups');
const backupLogFile = join(backupsDir, 'backup-log.json');
const backupStatusFile = join(backupsDir, 'backup-status.json');
const restoreReportFile = join(backupsDir, 'restore-report.json');
const recoveryRoot = join(rootDir, 'runtime', 'recovery');
const latestRecoveryReportFile = join(recoveryRoot, 'latest-recovery-validation.json');
const args = process.argv.slice(2);

async function readJson(file, fallback) {
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function checksumFile(file) {
  return new Promise((resolve, reject) => {
    const hash = createHash('sha256');
    const stream = createReadStream(file);

    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(hash.digest('hex')));
  });
}

function runUnzip(archivePath, destination) {
  return new Promise((resolve, reject) => {
    const child = spawn('unzip', ['-oq', archivePath, '-d', destination], {
      cwd: rootDir,
      stdio: 'inherit'
    });

    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`unzip failed with exit code ${code}`));
    });
  });
}

function getOptionValue(option) {
  const index = args.indexOf(option);
  return index >= 0 ? args[index + 1] : null;
}

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function validateRecoveredTree(recoveryDir) {
  const requiredFiles = [
    'package.json',
    'README.md',
    'backend/package.json',
    'backend/src/app.js',
    'backend/src/server.js'
  ];

  const requiredDirectories = [
    'backend',
    'frontend',
    'data',
    'scripts'
  ];

  const checks = [];

  for (const relativePath of requiredFiles) {
    const present = await exists(join(recoveryDir, relativePath));
    checks.push({
      type: 'file',
      path: relativePath,
      status: present ? 'PASS' : 'FAIL'
    });
  }

  for (const relativePath of requiredDirectories) {
    const present = await exists(join(recoveryDir, relativePath));
    checks.push({
      type: 'directory',
      path: relativePath,
      status: present ? 'PASS' : 'FAIL'
    });
  }

  const packageJson = await readJson(join(recoveryDir, 'package.json'), null);

  checks.push({
    type: 'package',
    path: 'package.json',
    status: packageJson?.name === 'eos' ? 'PASS' : 'FAIL',
    details: packageJson
      ? {
          name: packageJson.name,
          version: packageJson.version
        }
      : null
  });

  const dataDir = join(recoveryDir, 'data');
  let dataDirectoryStatus = 'FAIL';

  try {
    const dataStats = await stat(dataDir);
    dataDirectoryStatus = dataStats.isDirectory() ? 'PASS' : 'FAIL';
  } catch {
    dataDirectoryStatus = 'FAIL';
  }

  checks.push({
    type: 'data',
    path: 'data',
    status: dataDirectoryStatus
  });

  const passed = checks.filter((check) => check.status === 'PASS').length;
  const failed = checks.filter((check) => check.status === 'FAIL').length;

  return {
    status: failed === 0 ? 'PASS' : 'FAIL',
    totalChecks: checks.length,
    passedChecks: passed,
    failedChecks: failed,
    checks,
    package: packageJson
      ? {
          name: packageJson.name,
          version: packageJson.version
        }
      : null
  };
}

await mkdir(backupsDir, { recursive: true });
await mkdir(recoveryRoot, { recursive: true });

const backupLog = await readJson(backupLogFile, []);
const completedBackups = backupLog.filter((backup) => backup.status === 'Completed');

if (completedBackups.length === 0) {
  console.log('No completed EOS backups are available.');
  process.exit(0);
}

const selectedArchiveName = getOptionValue('--archive');
const useLatest = args.includes('--latest');
const confirmed = args.includes('--confirm');
const validateRestore = args.includes('--validate-restore');

if (!selectedArchiveName && !useLatest) {
  console.log('Available EOS backups:');
  for (const backup of completedBackups) {
    console.log(
      `- ${backup.archiveName} (${backup.timestamp}, ${backup.archiveSize} bytes)`
    );
  }
  console.log('Integrity check: npm run eos:restore -- --latest');
  console.log(
    'Isolated restore validation: npm run eos:restore -- --latest --validate-restore'
  );
  console.log(
    'Live restore: npm run eos:restore -- --latest --confirm'
  );
  process.exit(0);
}

const selectedBackup = selectedArchiveName
  ? completedBackups.find((backup) => backup.archiveName === selectedArchiveName)
  : completedBackups.at(-1);

if (!selectedBackup) {
  console.error(
    `Backup archive was not found in backup log: ${selectedArchiveName}`
  );
  process.exit(1);
}

const archivePath = join(backupsDir, selectedBackup.archiveName);
const checksum = await checksumFile(archivePath);
const checksumValid = checksum === selectedBackup.checksum;

const report = {
  timestamp: new Date().toISOString(),
  archiveName: selectedBackup.archiveName,
  archivePath: `backups/${basename(archivePath)}`,
  requestedMode: validateRestore
    ? 'isolated-restore-validation'
    : confirmed
      ? 'live-restore'
      : 'integrity-check',
  checksum,
  checksumValid,
  status: 'Started'
};

if (!checksumValid) {
  report.status = 'Failed';
  report.error = 'Checksum validation failed';

  await writeFile(
    restoreReportFile,
    `${JSON.stringify(report, null, 2)}\n`
  );

  console.error(report.error);
  process.exit(1);
}

if (validateRestore) {
  const recoveryDir = await mkdtemp(
    join(tmpdir(), 'eos-recovery-validation-')
  );

  try {
    await runUnzip(archivePath, recoveryDir);

    const validation = await validateRecoveredTree(recoveryDir);

    report.recoveryWorkspace = recoveryDir;
    report.restoreValidation = validation;
    report.status =
      validation.status === 'PASS'
        ? 'Restore Validated'
        : 'Failed';

    await writeFile(
      latestRecoveryReportFile,
      `${JSON.stringify(report, null, 2)}\n`
    );
  } catch (error) {
    report.status = 'Failed';
    report.error = error.message;
  } finally {
    await rm(recoveryDir, { recursive: true, force: true });
  }
} else if (confirmed) {
  try {
    await runUnzip(archivePath, rootDir);
    report.status = 'Completed';
  } catch (error) {
    report.status = 'Failed';
    report.error = error.message;
  }
} else {
  report.status = 'Integrity Validated';
  report.note =
    'Checksum is valid. Use --validate-restore for isolated restore validation.';
}

await writeFile(
  restoreReportFile,
  `${JSON.stringify(report, null, 2)}\n`
);

const backupStatus = await readJson(backupStatusFile, {});

let latestRestoreValidationStatus =
  backupStatus.latestRestoreValidationStatus ?? 'Not validated';

if (validateRestore) {
  latestRestoreValidationStatus =
    report.status === 'Restore Validated'
      ? 'Validated'
      : 'Failed';
}

await writeFile(
  backupStatusFile,
  `${JSON.stringify(
    {
      ...backupStatus,
      latestIntegrityValidationStatus: checksumValid
        ? 'Validated'
        : 'Failed',
      latestRestoreValidationStatus,
      latestRestoreValidationArchive:
        validateRestore ? selectedBackup.archiveName : (
          backupStatus.latestRestoreValidationArchive ?? null
        ),
      latestRestoreValidationTimestamp:
        validateRestore ? report.timestamp : (
          backupStatus.latestRestoreValidationTimestamp ?? null
        ),
      lastUpdated: new Date().toISOString()
    },
    null,
    2
  )}\n`
);

if (report.status === 'Failed') {
  console.error(`EOS restore failed: ${report.error ?? 'validation failure'}`);
  process.exit(1);
}

console.log(`EOS restore result: ${report.status}.`);
console.log(`Archive: backups/${selectedBackup.archiveName}`);
console.log(`Checksum: ${checksum}`);

if (validateRestore) {
  console.log(
    `Restore checks: ${report.restoreValidation.passedChecks}/${report.restoreValidation.totalChecks} passed`
  );
  console.log(
    'Recovery report: runtime/recovery/latest-recovery-validation.json'
  );
}

console.log('Restore report: backups/restore-report.json');
