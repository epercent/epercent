import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const rootDir = process.cwd();

console.log('Running Objective 10.x.4 recovery point registry tests...');

const result = spawnSync(
  process.execPath,
  ['scripts/runtime/eos-recovery-point-register.js'],
  {
    cwd: rootDir,
    encoding: 'utf8'
  }
);

assert.notEqual(
  result.status,
  0,
  'Legacy backup registration should fail'
);

assert.match(
  result.stderr,
  /Cannot register recovery point:/u
);

assert.match(
  result.stderr,
  /Immutable Git commit missing/u
);

assert.match(
  result.stderr,
  /Git branch missing/u
);

assert.match(
  result.stderr,
  /Working tree was dirty/u
);

console.log('PASS legacy backup registration rejected');
console.log('PASS missing immutable Git provenance detected');
console.log('PASS missing branch provenance detected');
console.log('PASS dirty source state detected');
console.log('All Objective 10.x.4 recovery point registry tests passed.');
