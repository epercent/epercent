import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const source = await readFile(
  new URL('../../scripts/eos-mission-control.js', import.meta.url),
  'utf8'
);

test('terminal missions do not bind Bridge health to future branch commit or workspace state', () => {
  assert.match(
    source,
    /const terminalStates = new Set\(\[\s*'COMPLETED',\s*'REJECTED',\s*'QUARANTINED'\s*\]\)/
  );

  assert.match(
    source,
    /const provenanceBindingRequired =\s*inbox\.state !== 'EMPTY' && !terminalStates\.has\(inbox\.state\)/
  );

  assert.match(
    source,
    /const repositoryStateValid =\s*!provenanceBindingRequired \|\| clean/
  );
});

test('authorized missions still require exact provenance and clean repository before execution', () => {
  assert.match(
    source,
    /executableNow:\s*inbox\.state === 'AUTHORIZED' &&\s*validation\.errors\.length === 0 &&\s*branchMatches &&\s*commitMatches &&\s*clean &&/
  );

  assert.match(
    source,
    /!report\.schemaValid \|\|\s*!branchMatches \|\|\s*!commitMatches \|\|\s*!repositoryStateValid/
  );
});
