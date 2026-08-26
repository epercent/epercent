import assert from 'node:assert/strict';
import test from 'node:test';

import {
  evaluateMissionPreflight,
  verifyArtifactIdentity
} from '../../scripts/bridge/mission-preflight.js';

const digest = 'a'.repeat(64);
const mission = {
  missionId: 'EOS-RETRY-002',
  requiredBranch: 'main',
  requiredCommit: 'b'.repeat(40),
  artifact: {
    remotePath: 'eos-drive:private/review.tar.gz',
    driveFileId: 'drive-id-001',
    sha256: 'c'.repeat(64)
  }
};
const base = {
  mission,
  missionDigest: digest,
  validation: { missionDigest: digest },
  git: { branch: 'main', headCommit: 'b'.repeat(40), status: '' },
  replayEntries: [],
  refusalEntries: [],
  artifactMetadata: { ID: 'drive-id-001', Size: 42, IsDir: false }
};

test('approves only an exact immutable artifact identity', () => {
  assert.equal(evaluateMissionPreflight(base).valid, true);
  const mismatch = evaluateMissionPreflight({
    ...base,
    artifactMetadata: { ID: 'different', Size: 42, IsDir: false }
  });
  assert.equal(mismatch.valid, false);
  assert.match(mismatch.errors.join(' '), /Drive file ID mismatch/);
});

test('preserves compatibility for internal missions without an external artifact', () => {
  const internal = { ...mission };
  delete internal.artifact;
  const result = evaluateMissionPreflight({
    ...base,
    mission: internal,
    artifactMetadata: null
  });
  assert.equal(result.valid, true);
});

test('blocks replayed mission IDs before operator approval', () => {
  const result = evaluateMissionPreflight({
    ...base,
    replayEntries: [{ missionId: mission.missionId, missionDigest: 'd'.repeat(64) }]
  });
  assert.equal(result.valid, false);
  assert.match(result.errors.join(' '), /replay ledger/);
});

test('blocks a durable pre-claim refusal from automatic retry', () => {
  const result = evaluateMissionPreflight({
    ...base,
    refusalEntries: [{ missionId: mission.missionId, missionDigest: digest }]
  });
  assert.equal(result.valid, false);
  assert.match(result.errors.join(' '), /pre-claim refusal/);
});

test('refuses missing, empty and directory artifacts', () => {
  assert.equal(verifyArtifactIdentity(null, mission.artifact).valid, false);
  assert.equal(verifyArtifactIdentity({ ID: 'drive-id-001', Size: 0, IsDir: false }, mission.artifact).valid, false);
  assert.equal(verifyArtifactIdentity({ ID: 'drive-id-001', Size: 42, IsDir: true }, mission.artifact).valid, false);
});

test('blocks dirty repositories and commit drift', () => {
  const dirty = evaluateMissionPreflight({ ...base, git: { ...base.git, status: ' M package.json' } });
  const drift = evaluateMissionPreflight({ ...base, git: { ...base.git, headCommit: 'e'.repeat(40) } });
  assert.equal(dirty.valid, false);
  assert.equal(drift.valid, false);
});
