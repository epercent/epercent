import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { spawn } from 'node:child_process';

import { rootDir } from './eos-common.js';
import { runGit } from './eos-git-utils.js';

const backupsDir = join(rootDir, 'backups');
const backupLogFile = join(backupsDir, 'backup-log.json');
const backupStatusFile = join(backupsDir, 'backup-status.json');
const dataDir = join(rootDir, 'data');

const excludes = [
  'node_modules/*',
  'backend/node_modules/*',
  'frontend/node_modules/*',
  'frontend/dist/*',
  '.git/*',
  '.eos/*',
  'backups/*',
  'runtime/*',
  'eos-platform/*',
  'coverage/*',
  '*.log',
  '.DS_Store'
];

function formatTimestamp(date) {
  const pad = (value) => String(value).padStart(2, '0');

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}_${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}

async function readJson(file, fallback) {
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function runZip(archivePath) {
  return new Promise((resolve, reject) => {
    const args = [
      '-r',
      '-q',
      archivePath,
      '.',
      ...excludes.flatMap((pattern) => ['-x', pattern])
    ];

    const child = spawn('zip', args, {
      cwd: rootDir,
      stdio: 'inherit'
    });

    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`zip failed with exit code ${code}`));
    });
  });
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

async function getGitProvenance() {
  const branchResult = await runGit(['branch', '--show-current']);
  const commitResult = await runGit(['rev-parse', 'HEAD']);
  const statusResult = await runGit(['status', '--porcelain']);

  return {
    branch:
      branchResult.code === 0 && branchResult.stdout
        ? branchResult.stdout
        : 'unknown',
    commit:
      commitResult.code === 0 && commitResult.stdout
        ? commitResult.stdout
        : null,
    clean:
      statusResult.code === 0 &&
      statusResult.stdout.trim().length === 0,
    changedEntries:
      statusResult.code === 0 && statusResult.stdout
        ? statusResult.stdout.split('\n').filter(Boolean).length
        : null
  };
}

await mkdir(backupsDir, { recursive: true });

const packageJson = await readJson(
  join(rootDir, 'package.json'),
  { version: '0.0.0' }
);

const backupDate = new Date();
const timestamp = formatTimestamp(backupDate);
const version = packageJson.version;
const archiveName = `EOS_v${version}_${timestamp}.zip`;
const archivePath = join(backupsDir, archiveName);
const git = await getGitProvenance();

const metadata = {
  timestamp,
  version,
  build: version,
  archiveName,
  archiveSize: 0,
  checksum: null,
  dataIncluded: false,
  git,
  recoveryEligibility: git.clean ? 'Pending Validation' : 'Ineligible - Dirty Working Tree',
  status: 'Started'
};

try {
  await runZip(archivePath);

  const archiveStats = await stat(archivePath);
  await stat(dataDir);

  metadata.archiveSize = archiveStats.size;
  metadata.checksum = await checksumFile(archivePath);
  metadata.dataIncluded = true;
  metadata.status = 'Completed';
} catch (error) {
  metadata.status = 'Failed';
  metadata.error = error.message;
}

const backupLog = await readJson(backupLogFile, []);
backupLog.push(metadata);

await writeFile(
  backupLogFile,
  `${JSON.stringify(backupLog, null, 2)}\n`
);

const previousBackupStatus = await readJson(backupStatusFile, {});

await writeFile(
  backupStatusFile,
  `${JSON.stringify(
    {
      latestBackupTimestamp: metadata.timestamp,
      latestBackupLocalTime: backupDate.toLocaleString(),
      latestBackupVersion: metadata.version,
      latestBackupArchive: metadata.archiveName,
      latestBackupSize: metadata.archiveSize,
      latestBackupChecksum: metadata.checksum,
      latestBackupStatus: metadata.status,
      latestBackupDataIncluded: metadata.dataIncluded,
      latestBackupGitBranch: metadata.git.branch,
      latestBackupGitCommit: metadata.git.commit,
      latestBackupGitClean: metadata.git.clean,
      latestBackupGitChangedEntries: metadata.git.changedEntries,
      latestBackupRecoveryEligibility: metadata.recoveryEligibility,
      latestIntegrityValidationStatus: 'Not validated',
      latestRestoreValidationStatus: 'Not validated',
      latestRestoreValidationArchive: null,
      latestRestoreValidationTimestamp: null,
      backupCount: backupLog.filter(
        (backup) => backup.status === 'Completed'
      ).length,
      previousRestoreValidationStatus:
        previousBackupStatus.latestRestoreValidationStatus ?? null,
      lastUpdated: new Date().toISOString()
    },
    null,
    2
  )}\n`
);

if (metadata.status !== 'Completed') {
  console.error(`EOS backup failed: ${metadata.error}`);
  process.exit(1);
}

console.log('EOS backup completed.');
console.log(`Archive: backups/${archiveName}`);
console.log(`Size: ${metadata.archiveSize} bytes`);
console.log(`SHA-256: ${metadata.checksum}`);
console.log(`Data Included: ${metadata.dataIncluded ? 'Yes' : 'No'}`);
console.log(`Git Branch: ${metadata.git.branch}`);
console.log(`Git Commit: ${metadata.git.commit ?? 'Unavailable'}`);
console.log(`Git Clean: ${metadata.git.clean ? 'Yes' : 'No'}`);
console.log(`Recovery Eligibility: ${metadata.recoveryEligibility}`);
