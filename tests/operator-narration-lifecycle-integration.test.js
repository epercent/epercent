import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  missionDigest,
  printOperatorExplanationSafely
} from '../scripts/eos-operator-narration.js';

const mission = {
  missionId: 'EOS-LIFECYCLE-NARRATION-TEST-001',
  title: 'Explain mission pull and authorization lifecycle',
  requiredBranch: 'feature/test',
  requiredCommit: 'a'.repeat(40),
  command: { executable: 'node', arguments: ['tests/example.test.js'] },
  allowedPaths: ['scripts/example.js'],
  executionPermitted: true
};

function capture() {
  let output = '';
  return {
    stream: { write(value) { output += value; } },
    read() { return output; }
  };
}

test('safe narration prints a digest-bound lifecycle explanation', () => {
  const standard = capture();
  const errors = capture();
  const digest = missionDigest(mission);
  const result = printOperatorExplanationSafely(
    {
      phase: 'AUTHORIZATION_REQUIRED',
      inbox: { state: 'PROPOSED', mission, authorization: null },
      validation: { missionDigest: digest, executableNow: false }
    },
    standard.stream,
    errors.stream
  );

  assert.equal(result.phase, 'AUTHORIZATION_REQUIRED');
  assert.match(standard.read(), /AUTHORIZATION_REQUIRED/);
  assert.match(standard.read(), new RegExp(digest));
  assert.equal(errors.read(), '');
});

test('safe narration cannot mask a digest mismatch', () => {
  const standard = capture();
  const errors = capture();
  const result = printOperatorExplanationSafely(
    {
      phase: 'AUTHORIZATION_REFUSED',
      inbox: { state: 'PROPOSED', mission, authorization: null },
      validation: { missionDigest: '0'.repeat(64), executableNow: false }
    },
    standard.stream,
    errors.stream
  );

  assert.equal(result, null);
  assert.equal(standard.read(), '');
  assert.match(errors.read(), /explanation unavailable/i);
  assert.match(errors.read(), /digest does not match/i);
});

test('mission pull integrates state-specific safe narration', async () => {
  const source = await readFile(
    new URL('../scripts/eos-mission-control.js', import.meta.url),
    'utf8'
  );
  assert.match(source, /printOperatorExplanationSafely/);
  assert.ok(source.includes("phase: 'MISSION_' + report.state"));
  assert.match(source, /inbox,/);
  assert.match(source, /validation: report/);
});

test('authorization integrates required, refused, cancelled and recorded narration', async () => {
  const source = await readFile(
    new URL('../scripts/eos-mission-authorize.js', import.meta.url),
    'utf8'
  );
  for (const phase of [
    'AUTHORIZATION_REQUIRED',
    'AUTHORIZATION_REFUSED',
    'AUTHORIZATION_CANCELLED',
    'AUTHORIZATION_RECORDED'
  ]) {
    assert.match(source, new RegExp(phase));
  }
  assert.match(source, /printOperatorExplanationSafely/);
  assert.match(source, /authorizedInbox/);
});
