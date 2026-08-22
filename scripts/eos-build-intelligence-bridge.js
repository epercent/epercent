import { createHash } from 'node:crypto';
import { access, appendFile, mkdir, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { spawn, spawnSync } from 'node:child_process';

import { rootDir } from './eos-common.js';

const remoteRoot =
  process.env.EOS_BRIDGE_REMOTE ??
  'eos-drive:eOS Build Intelligence Bridge';

const argumentsList = process.argv.slice(2);
const separatorIndex = argumentsList.indexOf('--');

if (separatorIndex < 1 || separatorIndex === argumentsList.length - 1) {
  console.error(
    'Usage: bin/eos-run <objective-id> -- <command> [arguments...]'
  );
  process.exit(64);
}

const objectiveId = argumentsList.slice(0, separatorIndex).join(' ');
const commandParts = argumentsList.slice(separatorIndex + 1);
const startedAt = new Date();
const datePath = startedAt.toISOString().slice(0, 10);
const timestamp = startedAt
  .toISOString()
  .replaceAll(':', '')
  .replaceAll('.', '-');
const safeObjective = objectiveId.replace(/[^A-Za-z0-9._-]+/g, '-');
const runId = `${safeObjective}-${timestamp}`;

const localRoot = join(rootDir, 'logs', 'build-intelligence');
const runsDirectory = join(localRoot, 'runs', datePath);
const failuresDirectory = join(localRoot, 'failures', datePath);
const currentDirectory = join(localRoot, 'current-state');
const ledgersDirectory = join(localRoot, 'ledgers');

await Promise.all([
  mkdir(runsDirectory, { recursive: true }),
  mkdir(failuresDirectory, { recursive: true }),
  mkdir(currentDirectory, { recursive: true }),
  mkdir(ledgersDirectory, { recursive: true })
]);

function git(...args) {
  const result = spawnSync('git', args, {
    cwd: rootDir,
    encoding: 'utf8'
  });
  return result.status === 0 ? result.stdout.trim() : 'unavailable';
}

function redact(value) {
  return String(value)
    .replace(/GOCSPX-[A-Za-z0-9_-]+/g, '[REDACTED_GOOGLE_SECRET]')
    .replace(/ya29\.[A-Za-z0-9._-]+/g, '[REDACTED_ACCESS_TOKEN]')
    .replace(/1\/\/[A-Za-z0-9._-]+/g, '[REDACTED_REFRESH_TOKEN]')
    .replace(/sk-[A-Za-z0-9_-]{16,}/g, '[REDACTED_API_KEY]')
    .replace(
      /(client_secret|refresh_token|access_token|authorization)(["'=:\s]+)[^\s",}]+/gi,
      '$1$2[REDACTED]'
    )
    .replace(/Bearer\s+[A-Za-z0-9._~-]+/gi, 'Bearer [REDACTED]');
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function upload(localFile, remotePath) {
  const result = spawnSync(
    'rclone',
    ['copyto', localFile, `${remoteRoot}/${remotePath}`],
    { encoding: 'utf8' }
  );

  return {
    passed: result.status === 0,
    detail: redact(result.stderr || result.stdout || 'uploaded')
  };
}

async function hydrateLedgerIfMissing(localFile) {
  try {
    await access(localFile);
    return;
  } catch {
    const result = spawnSync(
      'rclone',
      [
        'copyto',
        `${remoteRoot}/Ledgers/EOS-BUILD-LEDGER.ndjson`,
        localFile
      ],
      { encoding: 'utf8' }
    );

    if (
      result.status !== 0 &&
      !/not found|directory not found/i.test(result.stderr ?? '')
    ) {
      throw new Error(
        `Unable to recover existing Drive ledger: ${redact(result.stderr)}`
      );
    }
  }
}

const branch = git('branch', '--show-current');
const commitBefore = git('rev-parse', 'HEAD');
const statusBefore = git('status', '--short');
const commandDisplay = redact(commandParts.join(' '));
const outputChunks = [];

console.log(`EOS Build Intelligence Bridge`);
console.log(`Run ID: ${runId}`);
console.log(`Objective: ${objectiveId}`);
console.log(`Command: ${commandDisplay}`);
console.log('------------------------------------------------------------');

const child = spawn(commandParts[0], commandParts.slice(1), {
  cwd: rootDir,
  env: process.env,
  stdio: ['inherit', 'pipe', 'pipe']
});

child.stdout.on('data', (chunk) => {
  const text = chunk.toString();
  process.stdout.write(text);
  outputChunks.push({ stream: 'stdout', text });
});

child.stderr.on('data', (chunk) => {
  const text = chunk.toString();
  process.stderr.write(text);
  outputChunks.push({ stream: 'stderr', text });
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => child.kill(signal));
}

const result = await new Promise((resolve) => {
  child.on('error', (error) => resolve({ exitCode: 127, error }));
  child.on('close', (code, signal) =>
    resolve({ exitCode: code ?? 1, signal })
  );
});

const completedAt = new Date();
const statusAfter = git('status', '--short');
const commitAfter = git('rev-parse', 'HEAD');
const combinedOutput = redact(
  outputChunks.map(({ stream, text }) => `[${stream}] ${text}`).join('')
);
const outcome = result.exitCode === 0 ? 'PASSED' : 'FAILED';

const record = {
  schemaVersion: '1.0.0',
  runId,
  objectiveId,
  outcome,
  exitCode: result.exitCode,
  signal: result.signal ?? null,
  startedAt: startedAt.toISOString(),
  completedAt: completedAt.toISOString(),
  durationMs: completedAt.getTime() - startedAt.getTime(),
  repository: rootDir,
  branch,
  commitBefore,
  commitAfter,
  command: commandDisplay,
  initiatingSystem:
    process.env.EOS_INITIATING_SYSTEM ?? 'human-terminal',
  authority:
    process.env.EOS_AUTHORITY ?? 'A1-assisted-human-authorized',
  statusBefore,
  statusAfter,
  outputSha256: sha256(combinedOutput)
};

const report = `# eOS Build Intelligence Run

## Identity

- Run ID: ${runId}
- Objective: ${objectiveId}
- Outcome: ${outcome}
- Exit code: ${result.exitCode}
- Started: ${record.startedAt}
- Completed: ${record.completedAt}
- Duration: ${record.durationMs} ms

## Governance

- Initiating system: ${record.initiatingSystem}
- Authority: ${record.authority}
- Repository: ${rootDir}
- Branch: ${branch}
- Commit before: ${commitBefore}
- Commit after: ${commitAfter}
- Output SHA-256: ${record.outputSha256}

## Command

\`\`\`text
${commandDisplay}
\`\`\`

## Repository Status Before

\`\`\`text
${statusBefore || 'clean'}
\`\`\`

## Repository Status After

\`\`\`text
${statusAfter || 'clean'}
\`\`\`

## Terminal Output

\`\`\`text
${combinedOutput || '[no output]'}
\`\`\`
`;

const currentState = `# eOS Current Build State

- Latest run: ${runId}
- Objective: ${objectiveId}
- Outcome: ${outcome}
- Exit code: ${result.exitCode}
- Completed: ${record.completedAt}
- Branch: ${branch}
- Commit: ${commitAfter}
- Run record: Runs/${datePath}/${runId}.md
- Output SHA-256: ${record.outputSha256}
`;

const reportFile = join(runsDirectory, `${runId}.md`);
const currentFile = join(currentDirectory, 'EOS-CURRENT-STATE.md');
const ledgerFile = join(ledgersDirectory, 'EOS-BUILD-LEDGER.ndjson');

await writeFile(reportFile, report, 'utf8');
await writeFile(currentFile, currentState, 'utf8');
await hydrateLedgerIfMissing(ledgerFile);
await appendFile(ledgerFile, `${JSON.stringify(record)}\n`, 'utf8');

const uploads = [
  upload(reportFile, `Runs/${datePath}/${basename(reportFile)}`),
  upload(currentFile, 'Current-State/EOS-CURRENT-STATE.md'),
  upload(ledgerFile, 'Ledgers/EOS-BUILD-LEDGER.ndjson')
];

if (outcome === 'FAILED') {
  const failureFile = join(failuresDirectory, basename(reportFile));
  await writeFile(failureFile, report, 'utf8');
  uploads.push(
    upload(
      failureFile,
      `Failures/${datePath}/${basename(failureFile)}`
    )
  );
}

const synchronizationPassed = uploads.every(({ passed }) => passed);

console.log('------------------------------------------------------------');
console.log(`Execution: ${outcome}`);
console.log(
  `Drive synchronization: ${synchronizationPassed ? 'PASSED' : 'FAILED'}`
);
console.log(`Local run record: ${reportFile}`);

if (!synchronizationPassed) {
  for (const uploadResult of uploads.filter(({ passed }) => !passed)) {
    console.error(uploadResult.detail);
  }
}

process.exit(
  result.exitCode !== 0
    ? result.exitCode
    : synchronizationPassed
      ? 0
      : 74
);
