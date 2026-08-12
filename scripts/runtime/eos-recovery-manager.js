import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

import { rootDir } from '../eos-common.js';

const registryOverrideIndex = process.argv.indexOf('--registry-file');

const registryFile =
  registryOverrideIndex >= 0
    ? process.argv[registryOverrideIndex + 1]
    : join(
        rootDir,
        'runtime',
        'recovery',
        'registry',
        'known-good-recovery-points.json'
      );

const backupsDirOverrideIndex = process.argv.indexOf('--backups-dir');

const backupsDir =
  backupsDirOverrideIndex >= 0
    ? process.argv[backupsDirOverrideIndex + 1]
    : join(rootDir, 'backups');

const runtimeStatusOverrideIndex = process.argv.indexOf('--runtime-status-file');

const runtimeStatusFile =
  runtimeStatusOverrideIndex >= 0
    ? process.argv[runtimeStatusOverrideIndex + 1]
    : join(
        rootDir,
        'runtime',
        'eos-runtime-status.json'
      );

const decisionFile = join(
  rootDir,
  'runtime',
  'recovery',
  'latest-recovery-decision.json'
);

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

const runtimeStatus = await readJson(runtimeStatusFile, null);

const registry = await readJson(registryFile, {
  registry: 'EOS Known-Good Recovery Point Registry',
  version: '1',
  objective: '10.x.4',
  updatedAt: null,
  recoveryPoints: []
});

const decision = {
  manager: 'EOS Recovery Manager v1',
  objective: '10.x.4',
  evaluatedAt: new Date().toISOString(),
  runtimeStatusAvailable: Boolean(runtimeStatus),
  runtimeHealthy: runtimeStatus?.healthy === true,
  recoveryRequired: false,
  recoveryAvailable: false,
  selectedRecoveryPoint: null,
  decision: null,
  reasons: []
};

if (runtimeStatus?.healthy === true) {
  decision.decision = 'NO_RECOVERY_REQUIRED';
  decision.reasons.push('Current EOS runtime is healthy.');
} else {
  decision.recoveryRequired = true;

  if (!runtimeStatus) {
    decision.reasons.push('Runtime health status is unavailable.');
  } else {
    decision.reasons.push('Current EOS runtime is not healthy.');
  }

  const eligiblePoints = registry.recoveryPoints
    .filter(
      (point) =>
        point.eligible === true &&
        point.status === 'Known Good'
    )
    .sort(
      (a, b) =>
        new Date(b.registeredAt).getTime() -
        new Date(a.registeredAt).getTime()
    );

  if (eligiblePoints.length === 0) {
    decision.decision = 'RECOVERY_BLOCKED';
    decision.reasons.push(
      'No eligible Known-Good Recovery Point is registered.'
    );
  } else {
    const candidate = eligiblePoints[0];
    const archivePath = join(
      backupsDir,
      candidate.archive
    );

    if (!(await exists(archivePath))) {
      decision.decision = 'RECOVERY_BLOCKED';
      decision.reasons.push(
        `Recovery archive is missing: ${candidate.archive}`
      );
    } else {
      const checksum = await checksumFile(archivePath);

      if (checksum !== candidate.checksum) {
        decision.decision = 'RECOVERY_BLOCKED';
        decision.reasons.push(
          'Recovery archive checksum does not match registry provenance.'
        );
      } else {
        decision.recoveryAvailable = true;
        decision.selectedRecoveryPoint = {
          id: candidate.id,
          archive: candidate.archive,
          eosVersion: candidate.eosVersion,
          git: candidate.git,
          checksum: candidate.checksum,
          registeredAt: candidate.registeredAt
        };

        decision.decision = 'RECOVERY_READY';
        decision.reasons.push(
          'Eligible Known-Good Recovery Point is available and archive integrity is confirmed.'
        );
      }
    }
  }
}

await mkdir(dirname(decisionFile), {
  recursive: true
});

await writeFile(
  decisionFile,
  `${JSON.stringify(decision, null, 2)}\n`
);

console.log(JSON.stringify(decision, null, 2));

if (decision.decision === 'RECOVERY_BLOCKED') {
  process.exitCode = 2;
}
