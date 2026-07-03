import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { spawn } from 'node:child_process';

import { rootDir } from './eos-common.js';

const backupsDir = join(rootDir, 'backups');
const backupLogFile = join(backupsDir, 'backup-log.json');
const backupStatusFile = join(backupsDir, 'backup-status.json');

const excludes = [
  'node_modules/*',
  'backend/node_modules/*',
  'frontend/node_modules/*',
  'frontend/dist/*',
  '.git/*',
  '.eos/*',
  'backups/*',
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
    const args = ['-r', '-q', archivePath, '.', ...excludes.flatMap((pattern) => ['-x', pattern])];
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

await mkdir(backupsDir, { recursive: true });

const packageJson = await readJson(join(rootDir, 'package.json'), { version: '0.0.0' });
const timestamp = formatTimestamp(new Date());
const version = packageJson.version;
const archiveName = `EOS_v${version}_${timestamp}.zip`;
const archivePath = join(backupsDir, archiveName);

const metadata = {
  timestamp,
  version,
  build: version,
  archiveName,
  archiveSize: 0,
  checksum: null,
  status: 'Started'
};

try {
  await runZip(archivePath);

  const archiveStats = await stat(archivePath);
  metadata.archiveSize = archiveStats.size;
  metadata.checksum = await checksumFile(archivePath);
  metadata.status = 'Completed';
} catch (error) {
  metadata.status = 'Failed';
  metadata.error = error.message;
}

const backupLog = await readJson(backupLogFile, []);
backupLog.push(metadata);
await writeFile(backupLogFile, `${JSON.stringify(backupLog, null, 2)}\n`);

await writeFile(
  backupStatusFile,
  `${JSON.stringify(
    {
      lastBackup: metadata.timestamp,
      backupStatus: metadata.status,
      lastRestore: (await readJson(backupStatusFile, {})).lastRestore ?? null,
      backupCount: backupLog.filter((backup) => backup.status === 'Completed').length,
      nextScheduledBackup: 'Not scheduled'
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
