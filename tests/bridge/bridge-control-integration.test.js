import assert from 'node:assert/strict';
import { generateKeyPairSync, sign } from 'node:crypto';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import { BridgeCoordinator } from '../../scripts/bridge/bridge-coordinator.js';
import { authorizationPayload, canonicalize, missionDigest, sha256 } from '../../scripts/bridge/protocol.js';
import { freezeOnStale, inspectHeartbeat } from '../../scripts/bridge/bridge-watchdog.js';
import { renderLaunchAgent } from '../../scripts/bridge/service-manager.js';

const mission = {
  missionId: 'EOS-INTEGRATION-001', title: 'Test governed bridge',
  requiredBranch: 'feature/test', requiredCommit: 'a'.repeat(40),
  command: { executable: 'node', arguments: ['tests/test.js'] },
  allowedPaths: ['scripts/test.js'], executionPermitted: true
};

class FakeAdapter {
  constructor() { this.authorized = false; this.executed = false; }
  async validate() {
    return {
      inbox: { generation: 14, state: this.authorized ? 'AUTHORIZED' : 'PROPOSED', mission },
      validation: { missionDigest: missionDigest(mission), executableNow: this.authorized }
    };
  }
  authorize(id) { assert.equal(id, mission.missionId); this.authorized = true; }
  execute() { assert.equal(this.authorized, true); this.executed = true; }
  gitState() { return { branch: 'feature/test', headCommit: 'a'.repeat(40), status: '' }; }
}

class FakeSigner {
  constructor() { this.keys = generateKeyPairSync('ec', { namedCurve: 'P-256' }); }
  signReceipt(fields) {
    const publicKeyPem = this.keys.publicKey.export({ type: 'spki', format: 'pem' });
    const receipt = { ...fields,
      keyFingerprint: sha256(this.keys.publicKey.export({ type: 'spki', format: 'der' })) };
    const payload = Buffer.from(JSON.stringify(canonicalize(authorizationPayload(receipt))));
    receipt.signature = sign('sha256', payload, this.keys.privateKey).toString('base64');
    return { receipt, publicKeyPem };
  }
}

class FakeTelemetry { constructor() { this.records = []; } async publish(value) { this.records.push(value); return value; } }

test('coordinator requires signed local decision before canonical authorize and execute', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'eos-bridge-integration-'));
  try {
    const adapter = new FakeAdapter(); const telemetry = new FakeTelemetry();
    const coordinator = new BridgeCoordinator({ root: directory, stateDir: directory,
      adapter, signer: new FakeSigner(), telemetry, intervalMs: 1 });
    await coordinator.cycle();
    assert.equal(coordinator.core.state, 'AWAITING_APPROVAL');
    assert.equal(adapter.executed, false);
    await coordinator.decide({ decision: 'APPROVE' });
    assert.equal(adapter.executed, true);
    assert.equal(coordinator.core.state, 'COMPLETED');
  } finally { await rm(directory, { recursive: true, force: true }); }
});

test('rejection never calls authorize or execute', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'eos-bridge-reject-'));
  try {
    const adapter = new FakeAdapter();
    const coordinator = new BridgeCoordinator({ root: directory, stateDir: directory,
      adapter, signer: new FakeSigner(), telemetry: new FakeTelemetry() });
    await coordinator.cycle(); await coordinator.decide({ decision: 'REJECT' });
    assert.equal(adapter.authorized, false); assert.equal(adapter.executed, false);
  } finally { await rm(directory, { recursive: true, force: true }); }
});

test('watchdog freezes stale heartbeat but accepts current heartbeat', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'eos-watchdog-'));
  try {
    await writeFile(join(directory, 'heartbeat.json'), JSON.stringify({ at: '2026-08-22T21:00:00.000Z' }));
    assert.equal((await inspectHeartbeat({ stateDir: directory, now: Date.parse('2026-08-22T21:00:10.000Z') })).healthy, true);
    assert.equal((await freezeOnStale({ stateDir: directory, now: Date.parse('2026-08-22T21:02:00.000Z') })).healthy, false);
    assert.match(await readFile(join(directory, 'FROZEN'), 'utf8'), /stale heartbeat/);
  } finally { await rm(directory, { recursive: true, force: true }); }
});

test('LaunchAgent rendering remains disabled by default and replaces paths', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'eos-plist-'));
  try {
    const template = join(directory, 'agent.plist.template');
    await writeFile(template, '<plist><dict><key>RunAtLoad</key><false/><string>__EOS_ROOT__</string><string>__EOS_NODE__</string><string>__EOS_STATE__</string></dict></plist>');
    const result = await renderLaunchAgent({ template, eosRoot: '/EOS', nodePath: '/node', stateDir: '/state' });
    assert.match(result, /<false\/>/); assert.match(result, /\/EOS/); assert.doesNotMatch(result, /__EOS_/);
  } finally { await rm(directory, { recursive: true, force: true }); }
});
