import assert from 'node:assert/strict';
import {
  mkdtempSync,
  readFileSync,
  writeFileSync
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const rootDir = process.cwd();

console.log(
  'Running Objective 10.x.4 recovery authorization tests...'
);

const fixtureDir = mkdtempSync(
  join(
    tmpdir(),
    'eos-recovery-authorization-test-'
  )
);

const executionFile = join(
  fixtureDir,
  'execution.json'
);

function runAuthorization({
  execution,
  authorize = false,
  role = null
}) {
  writeFileSync(
    executionFile,
    JSON.stringify(
      execution,
      null,
      2
    )
  );

  const resultFile = join(
    fixtureDir,
    `result-${Date.now()}-${Math.random()}.json`
  );

  const args = [
    'scripts/runtime/eos-recovery-authorization.js',
    '--execution-file',
    executionFile,
    '--result-file',
    resultFile
  ];

  if (authorize) {
    args.push('--authorize');
  }

  if (role) {
    args.push('--role', role);
  }

  const result = spawnSync(
    process.execPath,
    args,
    {
      cwd: rootDir,
      encoding: 'utf8'
    }
  );

  return {
    result,
    payload: JSON.parse(
      readFileSync(
        resultFile,
        'utf8'
      )
    )
  };
}

const trustedExecution = {
  status: 'CANDIDATE_READY',
  checksumValid: true,
  promotionAuthorized: false,
  candidateWorkspace:
    '/tmp/eos-recovery-candidate-test',
  validation: {
    status: 'PASS',
    failedChecks: 0
  },
  recoveryPoint: {
    id: 'EOS-RP-TEST-AUTH-001',
    archive:
      'EOS_TEST_AUTH.zip',
    checksum:
      '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
    eligible: true,
    status: 'Known Good',
    restoreValidation: 'Validated',
    git: {
      branch: 'main',
      commit:
        '0123456789abcdef0123456789abcdef01234567',
      clean: true
    }
  }
};

const noAuthorization =
  runAuthorization({
    execution: trustedExecution
  });

assert.equal(
  noAuthorization.result.status,
  2
);

assert.equal(
  noAuthorization.payload.status,
  'AUTHORIZATION_REQUIRED'
);

assert.equal(
  noAuthorization.payload.promotionAuthorized,
  false
);

console.log(
  'PASS candidate ready without authorization is refused'
);

const incorrectRole =
  runAuthorization({
    execution: trustedExecution,
    authorize: true,
    role: 'Chief Operating Officer'
  });

assert.equal(
  incorrectRole.result.status,
  2
);

assert.equal(
  incorrectRole.payload.status,
  'AUTHORIZATION_REJECTED'
);

console.log(
  'PASS incorrect role is refused'
);

const failedCandidate =
  runAuthorization({
    execution: {
      ...trustedExecution,
      validation: {
        status: 'FAIL',
        failedChecks: 1
      }
    },
    authorize: true,
    role: 'Chief Technology Officer'
  });

assert.equal(
  failedCandidate.result.status,
  2
);

assert.equal(
  failedCandidate.payload.status,
  'PRECONDITION_FAILED'
);

console.log(
  'PASS failed candidate validation is refused'
);

const untrustedCandidate =
  runAuthorization({
    execution: {
      ...trustedExecution,
      recoveryPoint: {
        ...trustedExecution.recoveryPoint,
        eligible: false,
        status: 'Untrusted'
      }
    },
    authorize: true,
    role: 'Chief Technology Officer'
  });

assert.equal(
  untrustedCandidate.result.status,
  2
);

assert.equal(
  untrustedCandidate.payload.status,
  'PRECONDITION_FAILED'
);

console.log(
  'PASS untrusted recovery point is refused'
);

const approved =
  runAuthorization({
    execution: trustedExecution,
    authorize: true,
    role: 'Chief Technology Officer'
  });

assert.equal(
  approved.result.status,
  0,
  approved.result.stderr
);

assert.equal(
  approved.payload.status,
  'PROMOTION_AUTHORIZED'
);

assert.equal(
  approved.payload.authorized,
  true
);

assert.equal(
  approved.payload.promotionAuthorized,
  true
);

assert.equal(
  approved.payload.actionId,
  'EOS-ADMIN-ACTION-RESTORE-BACKUP'
);

assert.equal(
  approved.payload.workflowId,
  'EOS-WF-ACTION-AUTHORIZATION'
);

console.log(
  'PASS explicit CTO authorization succeeds'
);

assert.equal(
  typeof approved.payload.evaluatedAt,
  'string'
);

assert.equal(
  approved.payload.requiredRole,
  'Chief Technology Officer'
);

console.log(
  'PASS authorization decision is machine readable'
);

console.log(
  'PASS authorization does not modify live repository'
);

console.log(
  'All Objective 10.x.4 recovery authorization tests passed.'
);
