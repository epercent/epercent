import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { spawn } from 'node:child_process';

import { rootDir } from './eos-common.js';

const backupsDir = join(rootDir, 'backups');
const backupLogFile = join(backupsDir, 'backup-log.json');
const backupStatusFile = join(backupsDir, 'backup-status.json');
const restoreReportFile = join(backupsDir, 'restore-report.json');
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

function runUnzip(archivePath) {
  return new Promise((resolve, reject) => {
    const child = spawn('unzip', ['-oq', archivePath, '-d', rootDir], {
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

await mkdir(backupsDir, { recursive: true });

const backupLog = await readJson(backupLogFile, []);
const completedBackups = backupLog.filter((backup) => backup.status === 'Completed');

if (completedBackups.length === 0) {
  console.log('No completed EOS backups are available.');
  process.exit(0);
}

const selectedArchiveName = getOptionValue('--archive');
const useLatest = args.includes('--latest');
const confirmed = args.includes('--confirm');

if (!selectedArchiveName && !useLatest) {
  console.log('Available EOS backups:');
  for (const backup of completedBackups) {
    console.log(`- ${backup.archiveName} (${backup.timestamp}, ${backup.archiveSize} bytes)`);
  }
  console.log('Restore latest: npm run eos:restore -- --latest --confirm');
  console.log('Restore selected: npm run eos:restore -- --archive <archive-name> --confirm');
  process.exit(0);
}

const selectedBackup = selectedArchiveName
  ? completedBackups.find((backup) => backup.archiveName === selectedArchiveName)
  : completedBackups.at(-1);

if (!selectedBackup) {
  console.error(`Backup archive was not found in backup log: ${selectedArchiveName}`);
  process.exit(1);
}

const archivePath = join(backupsDir, selectedBackup.archiveName);
const checksum = await checksumFile(archivePath);
const checksumValid = checksum === selectedBackup.checksum;
const report = {
  timestamp: new Date().toISOString(),
  archiveName: selectedBackup.archiveName,
  requestedMode: confirmed ? 'restore' : 'dry-run',
  checksum,
  checksumValid,
  status: 'Started'
};

if (!checksumValid) {
  report.status = 'Failed';
  report.error = 'Checksum validation failed';
  await writeFile(restoreReportFile, `${JSON.stringify(report, null, 2)}\n`);
  console.error(report.error);
  process.exit(1);
}

if (confirmed) {
  try {
    await runUnzip(archivePath);
    report.status = 'Completed';
  } catch (error) {
    report.status = 'Failed';
    report.error = error.message;
  }
} else {
  report.status = 'Validated';
  report.note = 'Run with --confirm to restore files.';
}

await writeFile(restoreReportFile, `${JSON.stringify(report, null, 2)}\n`);

const backupStatus = await readJson(backupStatusFile, {});
await writeFile(
  backupStatusFile,
  `${JSON.stringify(
    {
      ...backupStatus,
      latestRestoreValidationStatus: checksumValid ? 'Validated' : 'Failed',
      lastUpdated: new Date().toISOString()
    },
    null,
    2
  )}\n`
);

if (report.status === 'Failed') {
  console.error(`EOS restore failed: ${report.error}`);
  process.exit(1);
}

console.log(`EOS restore ${report.status.toLowerCase()}.`);
console.log(`Archive: backups/${selectedBackup.archiveName}`);
console.log(`Checksum: ${checksum}`);
console.log(`Report: backups/restore-report.json`);
