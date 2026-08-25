import assert from 'node:assert/strict';
import { generateKeyPairSync, sign } from 'node:crypto';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import { ApprovalLeaseStore } from '../../scripts/bridge/approval-lease.js';
import { BridgeCoordinator } from '../../scripts/bridge/bridge-coordinator.js';
import {
  authorizationPayload, canonicalize, missionDigest, sha256
} from '../../scripts/bridge/protocol.js';

const mission = {
  missionId: 'EOS-RESTART-RECOVERY-001', title: 'Recover exact local approval',
  requiredBranch: 'feature/test', requiredCommit: 'a'.repeat(40),
  command: { executable: 'node', arguments: ['-e', 'process.exit(0)'] },
  allowedPaths: [], executionPermitted: true
};

class Adapter {
  constructor() { this.authorized = false; this.executed = false; }
  async validate() { return {
    inbox: { generation: 30, state: this.authorized ? 'AUTHORIZED' : 'PROPOSED', mission },
    validation: { missionDigest: missionDigest(mission), executableNow: this.authorized }
  }; }
  authorize() { this.authorized = true; }
  execute() { this.executed = true; return { status: 0 }; }
  async synchronizeTerminalInbox() { return {
    state: 'COMPLETED', execution: { executionId: 'restart-proof', status: 'FINISHED', outcome: 'PASSED' }
  }; }
  gitState() { return { branch: 'feature/test', headCommit: 'a'.repeat(40), status: '' }; }
}

class Signer {
  constructor() { this.keys = generateKeyPairSync('ec', { namedCurve: 'P-256' }); }
  signReceipt(fields) {
    const publicKeyPem = this.keys.publicKey.export({ type: 'spki', format: 'pem' });
    const receipt = { ...fields,
      keyFingerprint: sha256(this.keys.publicKey.export({ type: 'spki', format: 'der' })) };
    receipt.signature = sign('sha256', Buffer.from(JSON.stringify(canonicalize(
      authorizationPayload(receipt)
    ))), this.keys.privateKey).toString('base64');
    return { receipt, publicKeyPem };
  }
}

class Telemetry { async publish(value) { return value; } }

test('coordinator restart recovers only an exact durable signed approval', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'eos-approval-restart-'));
  try {
    const adapter = new Adapter();
    const signer = new Signer();
    const store = new ApprovalLeaseStore({ stateDir: directory });
    const first = new BridgeCoordinator({ root: directory, stateDir: directory,
      adapter, signer, telemetry: new Telemetry(), approvalLease: store });
    await first.cycle();
    const now = new Date();
    const signed = signer.signReceipt({ schemaVersion: '1.0.0',
      missionId: mission.missionId, missionDigest: first.current.missionDigest,
      generation: 30, nonce: first.current.nonce, decision: 'APPROVE',
      issuedAt: now.toISOString(), expiresAt: new Date(now.getTime() + 60_000).toISOString() });
    await store.save({ ...signed, branch: 'feature/test', commit: 'a'.repeat(40) });
    adapter.authorize();

    const restarted = new BridgeCoordinator({ root: directory, stateDir: directory,
      adapter, signer, telemetry: new Telemetry(), approvalLease: store });
    await restarted.cycle();
    assert.equal(adapter.executed, true);
    assert.equal(restarted.core.state, 'COMPLETED');
    assert.equal(await store.load(), null);
  } finally { await rm(directory, { recursive: true, force: true }); }
});

test('restart recovery refuses a receipt bound to another commit', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'eos-approval-mismatch-'));
  try {
    const adapter = new Adapter(); adapter.authorized = true;
    const signer = new Signer(); const store = new ApprovalLeaseStore({ stateDir: directory });
    const now = new Date();
    const signed = signer.signReceipt({ schemaVersion: '1.0.0', missionId: mission.missionId,
      missionDigest: missionDigest(mission), generation: 30, nonce: 'nonce', decision: 'APPROVE',
      issuedAt: now.toISOString(), expiresAt: new Date(now.getTime() + 60_000).toISOString() });
    await store.save({ ...signed, branch: 'feature/test', commit: 'b'.repeat(40) });
    const restarted = new BridgeCoordinator({ root: directory, stateDir: directory,
      adapter, signer, telemetry: new Telemetry(), approvalLease: store });
    await assert.rejects(restarted.cycle(), /approval commit mismatch/);
    assert.equal(adapter.executed, false);
  } finally { await rm(directory, { recursive: true, force: true }); }
});
