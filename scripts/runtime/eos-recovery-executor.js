import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import {
  access,
  mkdir,
  mkdtemp,
  readFile,
  writeFile
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { spawn } from 'node:child_process';

import { rootDir } from '../eos-common.js';

function getOptionValue(option) {
  const index = process.argv.indexOf(option);
  return index >= 0 ? process.argv[index + 1] : null;
}

async function readJson(file, fallback) {
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch {
    return fallback;
  }
}

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
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
    const child = spawn(
      'unzip',
      ['-oq', archivePath, '-d', destination],
      {
        cwd: rootDir,
        stdio: 'ignore'
      }
    );

    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(
        new Error(
          `unzip failed with exit code ${code}`
        )
      );
    });
  });
}

async function validateCandidate(candidateDir) {
  const required = [
    'package.json',
    'backend/package.json',
    'backend/src/app.js',
    'backend/src/server.js',
    'frontend',
    'data',
    'scripts'
  ];

  const checks = [];

  for (const item of required) {
    checks.push({
      item,
      exists: await exists(
        join(candidateDir, item)
      )
    });
  }

  const packageJson = await readJson(
    join(candidateDir, 'package.json'),
    null
  );

  const identityValid =
    packageJson?.name === 'eos';

  const failures = checks.filter(
    (check) => !check.exists
  );

  if (!identityValid) {
    failures.push({
      item: 'EOS package identity',
      exists: false
    });
  }

  return {
    status:
      failures.length === 0
        ? 'PASS'
        : 'FAIL',
    totalChecks:
      checks.length + 1,
    passedChecks:
      checks.filter((check) => check.exists).length +
      (identityValid ? 1 : 0),
    failedChecks:
      failures.length,
    checks,
    packageIdentity: {
      valid: identityValid,
      name: packageJson?.name ?? null,
      version: packageJson?.version ?? null
    }
  };
}

const decisionFile =
  getOptionValue('--decision-file') ??
  join(
    rootDir,
    'runtime',
    'recovery',
    'latest-recovery-decision.json'
  );

const backupsDir =
  getOptionValue('--backups-dir') ??
  join(rootDir, 'backups');

const resultFile =
  getOptionValue('--result-file') ??
  join(
    rootDir,
    'runtime',
    'recovery',
    'latest-recovery-execution.json'
  );

const decision = await readJson(
  decisionFile,
  null
);

if (!decision) {
  console.error(
    'Recovery execution blocked: recovery decision unavailable.'
  );
  process.exit(2);
}

if (
  decision.decision ===
  'NO_RECOVERY_REQUIRED'
) {
  const result = {
    executor: 'EOS Recovery Executor v1',
    objective: '10.x.4',
    executedAt: new Date().toISOString(),
    status: 'NO_ACTION_REQUIRED'
  };

  await mkdir(dirname(resultFile), {
    recursive: true
  });

  await writeFile(
    resultFile,
    `${JSON.stringify(result, null, 2)}\n`
  );

  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
}

if (
  decision.decision !==
    'RECOVERY_READY' ||
  !decision.selectedRecoveryPoint
) {
  console.error(
    'Recovery execution blocked: no RECOVERY_READY decision.'
  );
  process.exit(2);
}

const recoveryPoint =
  decision.selectedRecoveryPoint;

const archivePath = join(
  backupsDir,
  recoveryPoint.archive
);

if (!(await exists(archivePath))) {
  console.error(
    `Recovery execution blocked: archive missing (${recoveryPoint.archive}).`
  );
  process.exit(2);
}

const checksum =
  await checksumFile(archivePath);

if (
  checksum !== recoveryPoint.checksum
) {
  console.error(
    'Recovery execution blocked: archive checksum mismatch.'
  );
  process.exit(2);
}

const candidateDir = await mkdtemp(
  join(
    tmpdir(),
    'eos-recovery-candidate-'
  )
);

await runUnzip(
  archivePath,
  candidateDir
);

const validation =
  await validateCandidate(candidateDir);

const result = {
  executor: 'EOS Recovery Executor v1',
  objective: '10.x.4',
  executedAt: new Date().toISOString(),
  recoveryPoint,
  candidateWorkspace: candidateDir,
  checksumValid: true,
  validation,
  promotionAuthorized: false,
  status:
    validation.status === 'PASS'
      ? 'CANDIDATE_READY'
      : 'CANDIDATE_REJECTED'
};

await mkdir(dirname(resultFile), {
  recursive: true
});

await writeFile(
  resultFile,
  `${JSON.stringify(result, null, 2)}\n`
);

console.log(
  JSON.stringify(result, null, 2)
);

if (
  result.status !==
  'CANDIDATE_READY'
) {
  process.exitCode = 2;
}
