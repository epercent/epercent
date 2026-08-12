import assert from 'node:assert/strict';
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  writeFileSync
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const rootDir = process.cwd();

console.log(
  'Running Objective 10.x.4 recovery promoter tests...'
);

function runPromoter({
  authorizationFile,
  executionFile,
  targetRoot,
  resultFile,
  execute = false
}) {
  const args = [
    'scripts/runtime/eos-recovery-promoter.js',
    '--authorization-file',
    authorizationFile,
    '--execution-file',
    executionFile,
    '--target-root',
    targetRoot,
    '--result-file',
    resultFile
  ];

  if (execute) {
    args.push('--execute');
  }

  return spawnSync(
    process.execPath,
    args,
    {
      cwd: rootDir,
      encoding: 'utf8'
    }
  );
}

function writeJson(file, value) {
  writeFileSync(
    file,
    JSON.stringify(value, null, 2)
  );
}

function createFakeEos(root, marker) {
  mkdirSync(
    join(root, 'backend', 'src'),
    { recursive: true }
  );
  mkdirSync(
    join(root, 'frontend'),
    { recursive: true }
  );
  mkdirSync(
    join(root, 'data'),
    { recursive: true }
  );
  mkdirSync(
    join(root, 'scripts'),
    { recursive: true }
  );

  writeJson(
    join(root, 'package.json'),
    {
      name: 'eos',
      version: '0.25.0',
      marker
    }
  );

  writeFileSync(
    join(root, 'backend', 'src', 'app.js'),
    `export const marker = '${marker}';\n`
  );

  writeFileSync(
    join(root, 'backend', 'src', 'server.js'),
    `console.log('${marker}');\n`
  );

  writeFileSync(
    join(root, 'data', 'state.txt'),
    `${marker}\n`
  );
}

const fixtureRoot = mkdtempSync(
  join(
    tmpdir(),
    'eos-recovery-promoter-test-'
  )
);

const targetRoot = join(
  fixtureRoot,
  'target'
);

const candidateRoot = join(
  fixtureRoot,
  'candidate'
);

mkdirSync(targetRoot, { recursive: true });
mkdirSync(candidateRoot, { recursive: true });

createFakeEos(
  targetRoot,
  'ORIGINAL'
);

createFakeEos(
  candidateRoot,
  'RECOVERED'
);

const executionFile = join(
  fixtureRoot,
  'execution.json'
);

writeJson(
  executionFile,
  {
    status: 'CANDIDATE_READY',
    checksumValid: true,
    promotionAuthorized: false,
    candidateWorkspace: candidateRoot,
    validation: {
      status: 'PASS',
      failedChecks: 0
    },
    recoveryPoint: {
      id: 'EOS-RP-PROMOTER-001',
      archive: 'fixture.zip',
      eligible: true,
      status: 'Known Good',
      restoreValidation: 'Validated'
    }
  }
);

const blockedAuthorizationFile = join(
  fixtureRoot,
  'blocked-authorization.json'
);

writeJson(
  blockedAuthorizationFile,
  {
    status: 'AUTHORIZATION_REQUIRED',
    authorized: false,
    promotionAuthorized: false
  }
);

const blockedResultFile = join(
  fixtureRoot,
  'blocked-result.json'
);

const blocked = runPromoter({
  authorizationFile:
    blockedAuthorizationFile,
  executionFile,
  targetRoot,
  resultFile:
    blockedResultFile,
  execute: true
});

assert.equal(blocked.status, 2);

const blockedPayload = JSON.parse(
  readFileSync(
    blockedResultFile,
    'utf8'
  )
);

assert.equal(
  blockedPayload.status,
  'PROMOTION_BLOCKED'
);

assert.equal(
  blockedPayload.promoted,
  false
);

console.log(
  'PASS unauthorized promotion is blocked'
);

const approvedAuthorizationFile = join(
  fixtureRoot,
  'approved-authorization.json'
);

writeJson(
  approvedAuthorizationFile,
  {
    status: 'PROMOTION_AUTHORIZED',
    authorized: true,
    promotionAuthorized: true,
    actionId:
      'EOS-ADMIN-ACTION-RESTORE-BACKUP',
    requestedRole:
      'Chief Technology Officer'
  }
);

const simulationResultFile = join(
  fixtureRoot,
  'simulation-result.json'
);

const simulation = runPromoter({
  authorizationFile:
    approvedAuthorizationFile,
  executionFile,
  targetRoot,
  resultFile:
    simulationResultFile,
  execute: false
});

assert.equal(
  simulation.status,
  0,
  simulation.stderr
);

const simulationPayload = JSON.parse(
  readFileSync(
    simulationResultFile,
    'utf8'
  )
);

assert.equal(
  simulationPayload.status,
  'PROMOTION_READY'
);

assert.equal(
  simulationPayload.promoted,
  false
);

const originalBeforeExecution =
  JSON.parse(
    readFileSync(
      join(targetRoot, 'package.json'),
      'utf8'
    )
  );

assert.equal(
  originalBeforeExecution.marker,
  'ORIGINAL'
);

console.log(
  'PASS authorized promotion without execute remains simulated'
);

const executeResultFile = join(
  fixtureRoot,
  'execute-result.json'
);

const executed = runPromoter({
  authorizationFile:
    approvedAuthorizationFile,
  executionFile,
  targetRoot,
  resultFile:
    executeResultFile,
  execute: true
});

assert.equal(
  executed.status,
  0,
  executed.stderr
);

const executePayload = JSON.parse(
  readFileSync(
    executeResultFile,
    'utf8'
  )
);

assert.equal(
  executePayload.status,
  'PROMOTION_COMPLETED'
);

assert.equal(
  executePayload.promoted,
  true
);

const recoveredPackage = JSON.parse(
  readFileSync(
    join(targetRoot, 'package.json'),
    'utf8'
  )
);

assert.equal(
  recoveredPackage.marker,
  'RECOVERED'
);

console.log(
  'PASS authorized promotion succeeds against isolated target'
);

const badCandidateRoot = join(
  fixtureRoot,
  'bad-candidate'
);

mkdirSync(
  join(badCandidateRoot, 'backend', 'src'),
  { recursive: true }
);

writeJson(
  join(badCandidateRoot, 'package.json'),
  {
    name: 'not-eos',
    version: '0.25.0'
  }
);

writeFileSync(
  join(
    badCandidateRoot,
    'backend',
    'src',
    'app.js'
  ),
  'export default {};\n'
);

writeJson(
  executionFile,
  {
    status: 'CANDIDATE_READY',
    checksumValid: true,
    candidateWorkspace:
      badCandidateRoot,
    validation: {
      status: 'PASS'
    },
    recoveryPoint: {
      id: 'EOS-RP-PROMOTER-002',
      eligible: true,
      status: 'Known Good',
      restoreValidation: 'Validated'
    }
  }
);

createFakeEos(
  targetRoot,
  'PRE_ROLLBACK'
);

const rollbackResultFile = join(
  fixtureRoot,
  'rollback-result.json'
);

const rollback = runPromoter({
  authorizationFile:
    approvedAuthorizationFile,
  executionFile,
  targetRoot,
  resultFile:
    rollbackResultFile,
  execute: true
});

assert.equal(
  rollback.status,
  2
);

const rollbackPayload = JSON.parse(
  readFileSync(
    rollbackResultFile,
    'utf8'
  )
);

assert.equal(
  rollbackPayload.status,
  'PROMOTION_ROLLED_BACK'
);

assert.equal(
  rollbackPayload.rollbackPerformed,
  true
);

const restoredPackage = JSON.parse(
  readFileSync(
    join(targetRoot, 'package.json'),
    'utf8'
  )
);

assert.equal(
  restoredPackage.marker,
  'PRE_ROLLBACK'
);

console.log(
  'PASS failed promotion triggers automatic rollback'
);

console.log(
  'All Objective 10.x.4 recovery promoter tests passed.'
);
