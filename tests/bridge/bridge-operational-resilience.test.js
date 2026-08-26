import assert from 'node:assert/strict';
import test from 'node:test';

import {
  executionHealthGate,
  HEALTH_STATES,
  recoveryDisposition
} from '../../scripts/bridge/bridge-health.js';

test('operational failures recover without entering a security freeze', () => {
  const first = recoveryDisposition({
    failure: { kind: 'OPERATIONAL', recoverable: true, message: 'transport unavailable' },
    attempts: 0,
    maximumAttempts: 2
  });
  assert.equal(first.health, HEALTH_STATES.RECOVERING);
  assert.equal(first.retry, true);
  assert.equal(first.freeze, false);

  const exhausted = recoveryDisposition({
    failure: { kind: 'OPERATIONAL', recoverable: true, message: 'transport unavailable' },
    attempts: 2,
    maximumAttempts: 2
  });
  assert.equal(exhausted.health, HEALTH_STATES.DEGRADED);
  assert.equal(exhausted.retry, false);
  assert.equal(exhausted.freeze, false);
});

test('only protected integrity failures request a freeze', () => {
  const result = recoveryDisposition({
    failure: { kind: 'PROTECTED', recoverable: false, message: 'signature mismatch' },
    attempts: 0,
    maximumAttempts: 2
  });
  assert.equal(result.health, HEALTH_STATES.PROTECTED_FREEZE);
  assert.equal(result.freeze, true);
});

test('execution health gate names every failed prerequisite', () => {
  const result = executionHealthGate({
    coordinatorHeartbeat: true,
    watchdogHeartbeat: false,
    repositoryClean: true,
    artifactAvailable: false,
    signerAvailable: true
  });
  assert.equal(result.healthy, false);
  assert.deepEqual(result.failures, ['watchdogHeartbeat', 'artifactAvailable']);
});

test('execution health gate passes only when all prerequisites pass', () => {
  const result = executionHealthGate({
    coordinatorHeartbeat: true,
    watchdogHeartbeat: true,
    repositoryClean: true,
    artifactAvailable: true,
    signerAvailable: true
  });
  assert.equal(result.healthy, true);
  assert.equal(result.state, HEALTH_STATES.HEALTHY);
});

test('Enterprise Control separates lifecycle completion from execution outcome', async () => {
  const source = await import('node:fs/promises').then(({ readFile }) =>
    readFile(new URL('../../scripts/bridge/approval-server.js', import.meta.url), 'utf8'));
  assert.match(source, /Lifecycle \/ outcome/);
  assert.match(source, /executionOutcome/);
});


test('watchdog stale heartbeat is operational and never directly requests protected freeze', async () => {
  const { mkdtemp, readFile, rm, writeFile } = await import('node:fs/promises');
  const { tmpdir } = await import('node:os');
  const { join } = await import('node:path');
  const { freezeOnStale } = await import('../../scripts/bridge/bridge-watchdog.js');
  const directory = await mkdtemp(join(tmpdir(), 'eos-watchdog-operational-'));
  try {
    await writeFile(join(directory, 'heartbeat.json'), JSON.stringify({ state: 'IDLE', at: '2026-08-22T21:00:00.000Z' }));
    const result = await freezeOnStale({ stateDir: directory, now: Date.parse('2026-08-22T21:01:00.000Z'), staleMs: 45000 });
    assert.equal(result.healthy, false);
    assert.equal(result.operationalFailure, true);
    assert.equal(result.freezeRequested, false);
    await assert.rejects(readFile(join(directory, 'FROZEN'), 'utf8'), { code: 'ENOENT' });
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
