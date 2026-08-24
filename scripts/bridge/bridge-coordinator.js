import { randomBytes } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { createApprovalServer } from './approval-server.js';
import { CoordinatorCore } from './coordinator-core.js';
import { EOSRepositoryAdapter } from './eos-adapter.js';
import { missionDigest } from './protocol.js';
import { MacOSReceiptSigner } from './receipt-signer.js';
import { TelemetryPublisher } from './telemetry-publisher.js';

export class BridgeCoordinator {
  constructor(options) {
    this.root = options.root;
    this.stateDir = options.stateDir;
    this.intervalMs = options.intervalMs ?? 5000;
    this.executionTimeoutMs = options.executionTimeoutMs ?? 20 * 60_000;
    this.adapter = options.adapter ?? new EOSRepositoryAdapter({ root: this.root });
    this.signer = options.signer ?? new MacOSReceiptSigner({ helperPath: options.signerPath });
    this.core = options.core ?? new CoordinatorCore();
    this.telemetry = options.telemetry ?? new TelemetryPublisher({
      stateFile: join(this.stateDir, 'EOS-BRIDGE-LIVE-STATE.json'),
      remote: options.telemetryRemote
    });
    this.current = null;
    this.running = false;
  }

  async frozen() {
    try { await readFile(join(this.stateDir, 'FROZEN'), 'utf8'); return true; }
    catch (error) { if (error.code === 'ENOENT') return false; throw error; }
  }

  async heartbeat(extra = {}) {
    await writeFile(join(this.stateDir, 'heartbeat.json'), JSON.stringify({
      pid: process.pid, state: this.core.state, at: new Date().toISOString(), ...extra
    }) + '\n', { mode: 0o600 });
  }

  async cycle() {
    if (await this.frozen()) { this.core.freeze('local freeze file'); await this.publish(); return; }
    if (this.core.state === 'IDLE' || this.core.state === 'COMPLETED' || this.core.state === 'REJECTED') {
      if (this.core.state !== 'IDLE') this.core.transition('IDLE');
      this.core.transition('VALIDATING');
    }
    const { inbox, validation } = await this.adapter.validate();
    const mission = inbox.mission;
    const digest = mission ? missionDigest(mission) : null;
    if (validation.missionDigest && validation.missionDigest !== digest) {
      this.core.transition('QUARANTINED'); throw new Error('canonical digest disagreement');
    }
    if (inbox.state === 'PROPOSED' && validation.executableNow === false) {
      this.current = {
        inbox, validation, missionDigest: digest,
        nonce: randomBytes(32).toString('hex')
      };
      if (this.core.state === 'VALIDATING') this.core.transition('AWAITING_APPROVAL');
    } else if (inbox.state === 'AUTHORIZED' && validation.executableNow === true) {
      if (this.core.state === 'VALIDATING') this.core.transition('AWAITING_APPROVAL');
      throw new Error('remote authorization without locally verified receipt refused');
    } else if (this.core.state === 'VALIDATING') {
      this.core.transition('IDLE');
    }
    await this.publish();
  }

  async decide({ decision }) {
    if (!this.current || this.core.state !== 'AWAITING_APPROVAL') throw new Error('no current approval request');
    if (decision === 'REJECT') { this.core.transition('REJECTED'); await this.publish(); return; }
    const now = new Date();
    const { receipt, publicKeyPem } = this.signer.signReceipt({
      schemaVersion: '1.0.0',
      missionId: this.current.inbox.mission.missionId,
      missionDigest: this.current.missionDigest,
      generation: this.current.inbox.generation,
      nonce: this.current.nonce,
      decision: 'APPROVE',
      issuedAt: now.toISOString(),
      expiresAt: new Date(now.getTime() + 5 * 60_000).toISOString()
    });
    const result = this.core.approve(receipt, {
      missionId: receipt.missionId, missionDigest: receipt.missionDigest,
      generation: receipt.generation, nonce: receipt.nonce,
      now: new Date().toISOString(), publicKeyPem
    });
    if (!result.valid) throw new Error('local receipt verification failed: ' + result.errors.join(', '));
    this.adapter.authorize(receipt.missionId);
    const afterAuthorization = await this.adapter.validate();
    if (afterAuthorization.inbox.state !== 'AUTHORIZED' || afterAuthorization.validation.executableNow !== true) {
      this.core.freeze('authorization state disagreement'); throw new Error('authorization did not become executable');
    }
    this.core.transition('EXECUTING'); await this.publish();
    await this.heartbeat({
      executionDeadline: new Date(Date.now() + this.executionTimeoutMs).toISOString()
    });
    try {
      this.adapter.execute();
      this.core.transition('COMPLETED');
      await this.publish();
    } catch (error) {
      this.core.transition('QUARANTINED');
      await this.publish().catch(() => {});
      throw error;
    } finally {
      await this.heartbeat();
    }
  }

  async model() {
    return { mission: this.current?.inbox?.mission ?? null, missionDigest: this.current?.missionDigest ?? null };
  }

  async publish() {
    const git = this.adapter.gitState();
    const paths = git.status ? git.status.split(/\r?\n/).filter(Boolean).map((line) => line.slice(3)).sort() : [];
    return this.telemetry.publish({
      state: this.core.state, generation: this.current?.inbox?.generation,
      missionId: this.current?.inbox?.mission?.missionId,
      missionDigest: this.current?.missionDigest, branch: git.branch,
      headCommit: git.headCommit, changedPaths: paths, tests: [],
      coordinatorHealthy: true, watchdogHealthy: true,
      frozen: this.core.state === 'FROZEN', updatedAt: new Date().toISOString()
    });
  }

  async start({ port = 4767 } = {}) {
    await mkdir(this.stateDir, { recursive: true });
    const approval = createApprovalServer({ port, getModel: () => this.model(), decide: (input) => this.decide(input) });
    await new Promise((resolve, reject) => approval.server.listen(port, '127.0.0.1', (error) => error ? reject(error) : resolve()));
    this.running = true;
    while (this.running) {
      try { await this.cycle(); this.core.failures = 0; }
      catch (error) { this.core.registerFailure(error.message); await this.publish().catch(() => {}); }
      await this.heartbeat();
      await new Promise((resolve) => setTimeout(resolve, this.intervalMs));
    }
  }
}
