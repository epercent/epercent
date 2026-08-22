import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildOperatorExplanation,
  classifyMissionImpact,
  formatOperatorExplanation,
  missionDigest,
  redactOperatorText,
  resolveOperatorLanguage
} from '../scripts/eos-operator-narration.js';

const mission = {
  missionId: 'EOS-NARRATION-TEST-001',
  title: 'Validate plain-language operator narration',
  requiredBranch: 'feature/test',
  requiredCommit: 'a'.repeat(40),
  command: { executable: 'node', arguments: ['tests/example.test.js'] },
  allowedPaths: ['scripts/example.js'],
  executionPermitted: true
};

test('language selection falls back visibly and safely to English', () => {
  assert.deepEqual(resolveOperatorLanguage('fr'), { language: 'en', requested: 'fr', fellBack: true });
  const explanation = buildOperatorExplanation({ phase: 'PROPOSED', inbox: { mission, authorization: null }, validation: { missionDigest: missionDigest(mission), executableNow: false }, language: 'fr' });
  assert.equal(explanation.language, 'en');
  assert.match(explanation.lines[0], /safe English fallback/i);
});

test('operator text redacts credentials', () => {
  assert.equal(redactOperatorText('Bearer abc.def.ghi'), '[REDACTED]');
  assert.equal(redactOperatorText('api_key=supersecret'), '[REDACTED]');
  assert.doesNotMatch(redactOperatorText('sk-abcdefghijklmnop1234'), /abcdefghijklmnop/);
});

test('explanation is digest-bound and rejects mismatched validation', () => {
  const digest = missionDigest(mission);
  const explanation = buildOperatorExplanation({ phase: 'PROPOSED', inbox: { mission, authorization: null }, validation: { missionDigest: digest, executableNow: false } });
  assert.equal(explanation.missionDigest, digest);
  assert.match(formatOperatorExplanation(explanation), new RegExp(digest));
  assert.throws(() => buildOperatorExplanation({ phase: 'PROPOSED', inbox: { mission }, validation: { missionDigest: '0'.repeat(64) } }), /digest does not match/);
});

test('impact classification distinguishes read-only and mutating missions', () => {
  assert.equal(classifyMissionImpact({ ...mission, allowedPaths: [] }).level, 'READ_ONLY');
  assert.equal(classifyMissionImpact(mission).level, 'MUTATING');
  assert.equal(classifyMissionImpact({ ...mission, command: { executable: 'node', arguments: ['deploy'] } }).level, 'EXTERNAL');
});
