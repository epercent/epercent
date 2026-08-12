import assert from 'node:assert/strict';

import {
  evaluateRecoveryEligibility
} from '../scripts/runtime/eos-recovery-eligibility.js';

console.log('Running Objective 10.x.4 recovery eligibility tests...');

const validCommit =
  '0123456789abcdef0123456789abcdef01234567';

const cleanEligible = evaluateRecoveryEligibility({
  backupStatus: 'Completed',
  integrityValidation: 'Validated',
  restoreValidation: 'Validated',
  gitCommit: validCommit,
  gitBranch: 'main',
  gitClean: true
});

assert.equal(cleanEligible.eligible, true);
assert.equal(cleanEligible.status, 'Known Good Eligible');
assert.deepEqual(cleanEligible.reasons, []);

console.log('PASS clean verified backup is eligible');

const dirtyBackup = evaluateRecoveryEligibility({
  backupStatus: 'Completed',
  integrityValidation: 'Validated',
  restoreValidation: 'Validated',
  gitCommit: validCommit,
  gitBranch: 'main',
  gitClean: false
});

assert.equal(dirtyBackup.eligible, false);
assert.ok(
  dirtyBackup.reasons.includes('Working tree was dirty')
);

console.log('PASS dirty backup is rejected');

const missingCommit = evaluateRecoveryEligibility({
  backupStatus: 'Completed',
  integrityValidation: 'Validated',
  restoreValidation: 'Validated',
  gitCommit: null,
  gitBranch: 'main',
  gitClean: true
});

assert.equal(missingCommit.eligible, false);
assert.ok(
  missingCommit.reasons.includes(
    'Immutable Git commit missing'
  )
);

console.log('PASS missing Git provenance is rejected');

const unvalidatedRestore = evaluateRecoveryEligibility({
  backupStatus: 'Completed',
  integrityValidation: 'Validated',
  restoreValidation: 'Not validated',
  gitCommit: validCommit,
  gitBranch: 'main',
  gitClean: true
});

assert.equal(unvalidatedRestore.eligible, false);
assert.ok(
  unvalidatedRestore.reasons.includes(
    'Restore not validated'
  )
);

console.log('PASS unvalidated restore is rejected');

console.log(
  'All Objective 10.x.4 recovery eligibility tests passed.'
);
