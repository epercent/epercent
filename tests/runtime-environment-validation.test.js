import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  ENVIRONMENT_VALIDATION_ERROR_CODES,
  canonicalRootDir,
  validateRuntimeEnvironment
} from '../backend/src/services/runtime-environment-validation-service.js';

function findCheck(report, id) {
  return report.checks.find((check) => check.id === id);
}

console.log('Running Objective 10.x.1 environment validation tests...');

const validReport = validateRuntimeEnvironment({
  rootDir: canonicalRootDir,
  expectedBranch: 'main'
});

assert.equal(validReport.objective, '10.x.1');
assert.equal(validReport.status, 'PASS');
assert.equal(findCheck(validReport, 'runtime-node').status, 'PASS');
assert.equal(findCheck(validReport, 'repository-root').status, 'PASS');
assert.equal(findCheck(validReport, 'repository-branch').status, 'PASS');
assert.equal(findCheck(validReport, 'configuration-port').status, 'PASS');
assert.equal(validReport.errors.length, 0);

const invalidNodeReport = validateRuntimeEnvironment({
  rootDir: canonicalRootDir,
  expectedBranch: 'main',
  minimumNodeMajor: 999
});

assert.equal(invalidNodeReport.status, 'FAIL');
assert.equal(findCheck(invalidNodeReport, 'runtime-node').status, 'FAIL');
assert.ok(
  invalidNodeReport.errors.some(
    (error) =>
      error.code ===
      ENVIRONMENT_VALIDATION_ERROR_CODES.UNSUPPORTED_NODE_VERSION
  )
);

const invalidPortReport = validateRuntimeEnvironment({
  rootDir: canonicalRootDir,
  expectedBranch: 'main',
  port: 'invalid-port'
});

assert.equal(invalidPortReport.status, 'FAIL');
assert.equal(findCheck(invalidPortReport, 'configuration-port').status, 'FAIL');
assert.ok(
  invalidPortReport.errors.some(
    (error) =>
      error.code === ENVIRONMENT_VALIDATION_ERROR_CODES.INVALID_PORT
  )
);

const invalidBranchReport = validateRuntimeEnvironment({
  rootDir: canonicalRootDir,
  expectedBranch: 'objective-test-branch'
});

assert.equal(invalidBranchReport.status, 'FAIL');
assert.equal(findCheck(invalidBranchReport, 'repository-branch').status, 'FAIL');
assert.ok(
  invalidBranchReport.errors.some(
    (error) =>
      error.code === ENVIRONMENT_VALIDATION_ERROR_CODES.INVALID_BRANCH
  )
);

const temporaryRoot = await mkdtemp(
  join(tmpdir(), 'eos-environment-validation-')
);

await mkdir(join(temporaryRoot, 'backend'), { recursive: true });
await writeFile(
  join(temporaryRoot, 'package.json'),
  `${JSON.stringify(
    {
      name: 'not-eos',
      version: '0.0.0',
      engines: {
        node: '>=20'
      }
    },
    null,
    2
  )}\n`
);

const invalidRootReport = validateRuntimeEnvironment({
  rootDir: temporaryRoot,
  expectedBranch: 'main',
  requiredFiles: ['README.md'],
  requiredDirectories: ['runtime'],
  requiredServices: [],
  requiredCapabilities: []
});

assert.equal(invalidRootReport.status, 'FAIL');
assert.ok(
  invalidRootReport.errors.some(
    (error) =>
      error.code === ENVIRONMENT_VALIDATION_ERROR_CODES.INVALID_PACKAGE
  )
);
assert.ok(
  invalidRootReport.errors.some(
    (error) =>
      error.code ===
      ENVIRONMENT_VALIDATION_ERROR_CODES.REQUIRED_FILE_MISSING
  )
);
assert.ok(
  invalidRootReport.errors.some(
    (error) =>
      error.code ===
      ENVIRONMENT_VALIDATION_ERROR_CODES.REQUIRED_DIRECTORY_MISSING
  )
);
assert.ok(
  invalidRootReport.errors.some(
    (error) =>
      error.code ===
      ENVIRONMENT_VALIDATION_ERROR_CODES.INVALID_GIT_REPOSITORY
  )
);

console.log('PASS valid environment');
console.log('PASS unsupported Node.js version failure');
console.log('PASS invalid port failure');
console.log('PASS incorrect branch failure');
console.log('PASS invalid repository and missing assets failure');
console.log('All Objective 10.x.1 environment validation tests passed.');
