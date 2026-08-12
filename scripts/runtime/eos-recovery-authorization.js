import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

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

const executionFile =
  getOptionValue('--execution-file') ??
  join(
    rootDir,
    'runtime',
    'recovery',
    'latest-recovery-execution.json'
  );

const resultFile =
  getOptionValue('--result-file') ??
  join(
    rootDir,
    'runtime',
    'recovery',
    'latest-recovery-authorization.json'
  );

const authorize =
  process.argv.includes('--authorize');

const requestedRole =
  getOptionValue('--role');

const requiredRole =
  'Chief Technology Officer';

const execution =
  await readJson(executionFile, null);

const authorization = {
  authorizer: 'EOS Recovery Authorization Gate v1',
  objective: '10.x.4',
  evaluatedAt: new Date().toISOString(),
  actionId: 'EOS-ADMIN-ACTION-RESTORE-BACKUP',
  workflowId: 'EOS-WF-ACTION-AUTHORIZATION',
  riskLevel: 'Critical',
  requiredRole,
  requestedRole: requestedRole ?? null,
  explicitAuthorizationRequested: authorize,
  candidateWorkspace:
    execution?.candidateWorkspace ?? null,
  recoveryPoint:
    execution?.recoveryPoint ?? null,
  preconditions: {
    executionAvailable: Boolean(execution),
    candidateReady:
      execution?.status === 'CANDIDATE_READY',
    candidateValidationPassed:
      execution?.validation?.status === 'PASS',
    checksumValid:
      execution?.checksumValid === true,
    knownGoodRecoveryPoint:
      execution?.recoveryPoint?.id != null,
    restoreValidated:
      execution?.recoveryPoint?.restoreValidation === 'Validated' ||
      execution?.recoveryPoint?.status === 'Known Good' ||
      execution?.recoveryPoint?.eligible === true,
    trustedRecoveryPoint:
      execution?.recoveryPoint?.eligible === true ||
      execution?.recoveryPoint?.status === 'Known Good'
  },
  authorized: false,
  promotionAuthorized: false,
  status: null,
  reasons: []
};

if (!execution) {
  authorization.status = 'PRECONDITION_FAILED';
  authorization.reasons.push(
    'Recovery execution result is unavailable.'
  );
} else {
  for (const [name, passed] of Object.entries(
    authorization.preconditions
  )) {
    if (!passed) {
      authorization.reasons.push(
        `Precondition failed: ${name}`
      );
    }
  }

  const preconditionsPassed =
    Object.values(
      authorization.preconditions
    ).every(Boolean);

  if (!preconditionsPassed) {
    authorization.status =
      'PRECONDITION_FAILED';
  } else if (!authorize) {
    authorization.status =
      'AUTHORIZATION_REQUIRED';

    authorization.reasons.push(
      'Explicit authorization was not supplied.'
    );
  } else if (
    requestedRole !== requiredRole
  ) {
    authorization.status =
      'AUTHORIZATION_REJECTED';

    authorization.reasons.push(
      `Authorization requires role: ${requiredRole}.`
    );
  } else {
    authorization.authorized = true;
    authorization.promotionAuthorized = true;
    authorization.status =
      'PROMOTION_AUTHORIZED';

    authorization.reasons.push(
      'Explicit CTO authorization accepted.'
    );
  }
}

await mkdir(dirname(resultFile), {
  recursive: true
});

await writeFile(
  resultFile,
  `${JSON.stringify(
    authorization,
    null,
    2
  )}\n`
);

console.log(
  JSON.stringify(
    authorization,
    null,
    2
  )
);

if (
  authorization.status !==
    'PROMOTION_AUTHORIZED'
) {
  process.exitCode = 2;
}
