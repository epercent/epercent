import assert from 'node:assert/strict';
import { generateKeyPairSync, sign } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import { BridgeCoordinator } from '../../scripts/bridge/bridge-coordinator.js';
import { authorizationPayload, canonicalize, missionDigest, sha256 } from '../../scripts/bridge/protocol.js';
import { freezeOnStale } from '../../scripts/bridge/bridge-watchdog.js';

const mission = {
  missionId: 'EOS-LEASE-TEST-001', title: 'Test execution lease',
  requiredBranch: 'feature/test', requiredCommit: 'a'.repeat(40),
  command: { executable: 'node', arguments: ['tests/test.js'] },
  allowedPaths: ['scripts/test.js'], executionPermitted: true
};

class Adapter {
  constructor(directory) { this.directory = directory; this.authorized = false; this.executed = false; }
  async validate() { return { inbox: { generation: 1, state: this.authorized ? 'AUTHORIZED' : 'PROPOSED', mission }, validation: { missionDigest: missionDigest(mission), executableNow: this.authorized } }; }
  authorize() { this.authorized = true; }
  execute() {
    const heartbeat = JSON.parse(readFileSync(join(this.directory, 'heartbeat.json'), 'utf8'));
    assert.equal(heartbeat.state, 'EXECUTING');
    assert.ok(Date.parse(heartbeat.executionDeadline) > Date.parse(heartbeat.at));
    this.executed = true;
  }
  gitState() { return { branch: 'feature/test', headCommit: 'a'.repeat(40), status: '' }; }
}

class Signer {
  constructor() { this.keys = generateKeyPairSync('ec', { namedCurve: 'P-256' }); }
  signReceipt(fields) {
    const publicKeyPem = this.keys.publicKey.export({ type: 'spki', format: 'pem' });
    const receipt = { ...fields, keyFingerprint: sha256(this.keys.publicKey.export({ type: 'spki', format: 'der' })) };
    receipt.signature = sign('sha256', Buffer.from(JSON.stringify(canonicalize(authorizationPayload(receipt)))), this.keys.privateKey).toString('base64');
    return { receipt, publicKeyPem };
  }
}

test('bounded execution lease prevents a false stale-heartbeat freeze and then expires', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'eos-watchdog-lease-'));
  try {
    await writeFile(join(directory, 'heartbeat.json'), JSON.stringify({ state: 'EXECUTING', at: '2026-08-22T21:00:00.000Z', executionDeadline: '2026-08-22T21:20:00.000Z' }));
    const active = await freezeOnStale({ stateDir: directory, now: Date.parse('2026-08-22T21:10:00.000Z'), staleMs: 45_000 });
    assert.equal(active.healthy, true);
    assert.equal(active.executionLeaseActive, true);
    await assert.rejects(readFile(join(directory, 'FROZEN'), 'utf8'), { code: 'ENOENT' });
    const expired = await freezeOnStale({ stateDir: directory, now: Date.parse('2026-08-22T21:20:01.000Z'), staleMs: 45_000 });
    assert.equal(expired.healthy, false);
    assert.equal(expired.executionLeaseActive, false);
  } finally { await rm(directory, { recursive: true, force: true }); }
});

test('coordinator publishes and clears the execution lease around synchronous execution', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'eos-coordinator-lease-'));
  try {
    const adapter = new Adapter(directory);
    const coordinator = new BridgeCoordinator({ root: directory, stateDir: directory, adapter, signer: new Signer(), telemetry: { publish: async (value) => value }, executionTimeoutMs: 60_000 });
    await coordinator.cycle();
    await coordinator.decide({ decision: 'APPROVE' });
    assert.equal(adapter.executed, true);
    const finalHeartbeat = JSON.parse(await readFile(join(directory, 'heartbeat.json'), 'utf8'));
    assert.equal(finalHeartbeat.state, 'COMPLETED');
    assert.equal(finalHeartbeat.executionDeadline, undefined);
  } finally { await rm(directory, { recursive: true, force: true }); }
});
