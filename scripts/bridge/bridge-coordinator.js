import { randomBytes } from 'node:crypto';
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { createApprovalServer } from './approval-server.js';
import { CoordinatorCore } from './coordinator-core.js';
import { EOSRepositoryAdapter } from './eos-adapter.js';
import { assertFullCommitSha, classifyBridgeFailure, missionDigest } from './protocol.js';
import { MacOSReceiptSigner } from './receipt-signer.js';
import { TelemetryPublisher } from './telemetry-publisher.js';
import { appendHistory, historyEvent } from './activity-history.js';
import { ApprovalLeaseStore } from './approval-lease.js';
import { evaluateMissionPreflight } from './mission-preflight.js';
import { executionHealthGate, recoveryDisposition } from './bridge-health.js';

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
    this.historyFile = join(this.stateDir, 'EOS-BRIDGE-ACTIVITY-HISTORY.json');
    this.history = [];
    this.historyWrite = Promise.resolve();
    this.lastError = null;
    this.autoRecoveryAttempts = 0;
    this.maxAutoRecoveryAttempts = options.maxAutoRecoveryAttempts ?? 2;
    this.approvalLease = options.approvalLease ?? new ApprovalLeaseStore({ stateDir: this.stateDir });
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

  async loadHistory() {
    try { this.history = JSON.parse(await readFile(this.historyFile, 'utf8')).events ?? []; }
    catch (error) { if (error.code !== 'ENOENT') throw error; this.history = []; }
  }

  async record(type, values = {}) {
    const operation = this.historyWrite.then(async () => {
      this.history = appendHistory(this.history, historyEvent({
        type, generation: values.generation ?? this.current?.inbox?.generation,
        missionId: values.missionId ?? this.current?.inbox?.mission?.missionId,
        missionDigest: values.missionDigest ?? this.current?.missionDigest,
        actor: values.actor, outcome: values.outcome, evidenceId: values.evidenceId,
        at: new Date().toISOString()
      }));
      const temporary = this.historyFile + '.tmp-' + process.pid + '-' + randomBytes(8).toString('hex');
      await writeFile(temporary, JSON.stringify({ schemaVersion: '1.0.0', events: this.history }, null, 2) + '\n', { mode: 0o600 });
      await rename(temporary, this.historyFile);
    });
    this.historyWrite = operation.catch(() => {});
    return operation;
  }

  async cycle() {
    if (await this.frozen()) { this.core.freeze('local freeze file'); await this.publish(); return; }
    if (['IDLE', 'COMPLETED', 'REJECTED', 'DEGRADED'].includes(this.core.state)) {
      if (this.core.state !== 'IDLE') this.core.transition('IDLE');
      this.core.transition('VALIDATING');
    }
    const { inbox, validation } = await this.adapter.validate();
    const mission = inbox.mission;
    const git = this.adapter.gitState();
    assertFullCommitSha(git.headCommit, 'repository HEAD');
    if (mission) assertFullCommitSha(mission.requiredCommit, 'mission required commit');
    const digest = mission ? missionDigest(mission) : null;
    if (validation.missionDigest && validation.missionDigest !== digest) {
      this.core.transition('QUARANTINED'); throw new Error('canonical digest disagreement');
    }
    if (inbox.state === 'PROPOSED' && validation.executableNow === false) {
      const inputs = typeof this.adapter.preflightInputs === 'function'
        ? await this.adapter.preflightInputs(mission)
        : { replayEntries: [], refusalEntries: [], artifactMetadata: {
            ID: mission?.artifact?.driveFileId, Size: 1, IsDir: false
          } };
      const preflight = evaluateMissionPreflight({
        mission, missionDigest: digest, validation, git, ...inputs
      });
      if (!preflight.valid) {
        this.current = { inbox, validation, missionDigest: digest, nonce: null, preflight };
        if (this.core.state === 'VALIDATING') this.core.transition('IDLE');
        this.lastError = 'Approval unavailable: ' + preflight.errors.join(', ');
        await this.record('PREFLIGHT_REFUSED', { actor: 'bridge', outcome: 'REFUSED' });
        await this.publish();
        return;
      }
      this.current = {
        inbox, validation, missionDigest: digest, preflight,
        nonce: randomBytes(32).toString('hex')
      };
      if (this.core.state === 'VALIDATING') this.core.transition('AWAITING_APPROVAL');
    } else if (inbox.state === 'AUTHORIZED' && validation.executableNow === true) {
      const lease = await this.approvalLease.load();
      const recovered = this.approvalLease.verify(lease, {
        inbox, validation, branch: git.branch, commit: git.headCommit
      });
      if (!recovered.valid) {
        if (this.core.state === 'VALIDATING') this.core.transition('AWAITING_APPROVAL');
        throw new Error('remote authorization without durable local receipt refused: ' + recovered.errors.join(', '));
      }
      this.current = {
        inbox, validation, missionDigest: digest, nonce: lease.receipt.nonce
      };
      if (this.core.state === 'VALIDATING') this.core.transition('AWAITING_APPROVAL');
      const approval = this.core.approve(lease.receipt, {
        missionId: lease.receipt.missionId,
        missionDigest: lease.receipt.missionDigest,
        generation: lease.receipt.generation,
        nonce: lease.receipt.nonce,
        now: new Date().toISOString(),
        publicKeyPem: lease.publicKeyPem
      });
      if (!approval.valid) throw new Error('durable approval recovery failed: ' + approval.errors.join(', '));
      await this.record('APPROVAL_RECOVERED', { actor: 'bridge', outcome: 'VERIFIED' });
      await this.executeCurrent();
      return;
    } else if (this.core.state === 'VALIDATING') {
      this.core.transition('IDLE');
    }
    await this.publish();
    this.autoRecoveryAttempts = 0;
  }

  async handleCycleFailure(error) {
    this.lastError = error.message;
    const failure = classifyBridgeFailure(error);
    const disposition = recoveryDisposition({
      failure,
      attempts: this.autoRecoveryAttempts,
      maximumAttempts: this.maxAutoRecoveryAttempts
    });
    await this.record('ERROR', { outcome: failure.kind }).catch(() => {});
    if (disposition.retry && this.core.state !== 'EXECUTING' && !(await this.frozen())) {
      this.autoRecoveryAttempts += 1;
      this.core = new CoordinatorCore();
      this.current = null;
      await this.record('AUTO_RECOVERY', {
        actor: 'bridge', outcome: 'ATTEMPT_' + this.autoRecoveryAttempts
      }).catch(() => {});
    } else if (disposition.freeze) {
      this.core.freeze('protected failure: ' + failure.message);
    } else {
      // Exhausted operational recovery remains observable and retryable. It
      // must never consume the security circuit breaker or freeze approvals.
      this.core = new CoordinatorCore();
      this.core.transition('VALIDATING');
      this.core.transition('DEGRADED');
      await this.record('RECOVERY_EXHAUSTED', {
        actor: 'bridge', outcome: 'DEGRADED_OPERATIONAL'
      }).catch(() => {});
    }
    await this.publish().catch(() => {});
  }

  async decide({ decision }) {
    if (decision === 'RESET') {
      if (this.core.state === 'EXECUTING') throw new Error('recovery reset refused during execution');
      const git = this.adapter.gitState();
      if (git.status) throw new Error('recovery reset refused for changed repository');
      await rm(join(this.stateDir, 'FROZEN'), { force: true });
      this.core = new CoordinatorCore();
      this.current = null;
      this.lastError = null;
      await this.record('RECOVERY_RESET', { actor: 'operator', outcome: 'RECORDED' });
      await this.publish();
      return;
    }
    if (!this.current || this.core.state !== 'AWAITING_APPROVAL') throw new Error('no current approval request');
    if (decision === 'REJECT') {
      this.core.transition('REJECTED');
      await this.record('REJECTED', { actor: 'operator', outcome: 'RECORDED' });
      await this.publish();
      await this.approvalLease.clear();
      return;
    }
    const now = new Date();
    const { receipt, publicKeyPem } = this.signer.signReceipt({
      schemaVersion: '1.0.0',
      missionId: this.current.inbox.mission.missionId,
      missionDigest: this.current.missionDigest,
      generation: this.current.inbox.generation,
      nonce: this.current.nonce,
      decision: 'APPROVE',
      issuedAt: now.toISOString(),
      expiresAt: new Date(now.getTime() + Math.max(
        this.executionTimeoutMs + 5 * 60_000,
        20 * 60_000
      )).toISOString()
    });
    const result = this.core.approve(receipt, {
      missionId: receipt.missionId, missionDigest: receipt.missionDigest,
      generation: receipt.generation, nonce: receipt.nonce,
      now: new Date().toISOString(), publicKeyPem
    });
    if (!result.valid) throw new Error('local receipt verification failed: ' + result.errors.join(', '));
    const git = this.adapter.gitState();
    await this.approvalLease.save({
      receipt, publicKeyPem, branch: git.branch, commit: git.headCommit
    });
    await this.record('APPROVED', { actor: 'operator', outcome: 'RECORDED' });
    this.adapter.authorize(receipt.missionId);
    const afterAuthorization = await this.adapter.validate();
    if (afterAuthorization.inbox.state !== 'AUTHORIZED' || afterAuthorization.validation.executableNow !== true) {
      this.core.freeze('authorization state disagreement'); throw new Error('authorization did not become executable');
    }
    this.current.inbox = afterAuthorization.inbox;
    this.current.validation = afterAuthorization.validation;
    await this.executeCurrent();
  }

  async executeCurrent() {
    if (this.core.state === 'APPROVED') this.core.transition('EXECUTING');
    if (this.core.state !== 'EXECUTING') throw new Error('execution requires an approved durable lease');
    const git = this.adapter.gitState();
    const gate = executionHealthGate({
      repositoryClean: !git.status,
      requiredBranch: git.branch === this.current.inbox.mission.requiredBranch,
      requiredCommit: git.headCommit === this.current.inbox.mission.requiredCommit,
      canonicalAuthorization: this.current.inbox.state === 'AUTHORIZED',
      canonicalExecutable: this.current.validation.executableNow === true,
      artifactPreflight: this.current.preflight?.valid !== false
    });
    if (!gate.healthy) {
      this.core.transition('DEGRADED');
      throw new Error('execution health gate refused: ' + gate.failures.join(', '));
    }
    await this.publish();
    await this.heartbeat({
      executionDeadline: new Date(Date.now() + this.executionTimeoutMs).toISOString()
    });
    try {
      const executionRun = this.adapter.execute();
      let terminal;
      if (typeof this.adapter.synchronizeTerminalInbox === 'function') {
        terminal = await this.adapter.synchronizeTerminalInbox({
          generation: this.current.inbox.generation,
          missionId: this.current.inbox.mission.missionId,
          missionDigest: this.current.missionDigest,
          executionRun
        });
      } else {
        // Dependency-injected legacy test adapters predate terminal receipt
        // synchronization. The production adapter must always implement it.
        if (this.adapter instanceof EOSRepositoryAdapter) {
          throw new Error('terminal receipt synchronizer unavailable');
        }
        terminal = {
          state: 'COMPLETED',
          execution: {
            status: 'FINISHED',
            outcome: executionRun?.status === 0 ? 'PASSED' : 'FAILED'
          }
        };
      }
      if (terminal.state === 'REFUSED_BEFORE_CLAIM') {
        await this.record('EXECUTION_REFUSED_BEFORE_CLAIM', {
          outcome: 'REFUSED', evidenceId: null
        });
        await this.approvalLease.clear();
        this.core = new CoordinatorCore();
        this.current = null;
        this.lastError = 'Execution refused before claim; this mission identity is durably blocked from retry.';
        await this.publish();
        return;
      } else if (terminal.state === 'QUARANTINED') {
        this.core.transition('QUARANTINED');
      } else {
        this.core.transition('COMPLETED');
      }
      this.current.inbox = terminal;
      await this.record('EXECUTION_FINISHED', {
        outcome: terminal.execution?.outcome ?? (executionRun.status === 0 ? 'PASSED' : 'FAILED'),
        evidenceId: terminal.execution?.executionId
      });
      await this.publish();
      await this.approvalLease.clear();
    } catch (error) {
      this.lastError = error.message;
      if (this.core.state === 'EXECUTING') this.core.transition('QUARANTINED');
      await this.publish().catch(() => {});
      throw error;
    } finally {
      await this.heartbeat();
    }
  }

  async model() {
    const git = this.adapter.gitState();
    const mission = this.current?.inbox?.mission ?? null;
    const execution = this.current?.inbox?.execution ?? null;
    return {
      state: this.core.state,
      mission,
      generation: this.current?.inbox?.generation ?? null,
      missionDigest: this.current?.missionDigest ?? null,
      warning: this.lastError,
      history: this.history,
      branch: git.branch,
      headCommit: git.headCommit,
      repositoryClean: !git.status,
      commandSummary: mission?.command ? [mission.command.executable, ...(mission.command.arguments ?? [])].join(' ') : null,
      risk: mission?.allowedPaths?.length ? 'MUTATING' : 'READ_ONLY',
      executionStatus: execution?.status ?? (this.core.state === 'EXECUTING' ? 'running' : 'not started'),
      policyStatus: execution?.policyPassed === true ? 'passed' : execution?.policyPassed === false ? 'failed' : 'pending',
      testStatus: execution?.outcome === 'PASSED' ? 'passed' : 'pending',
      executionOutcome: execution?.outcome ?? null,
      lifecycleStatus: this.core.state,
      recoveryStatus: this.autoRecoveryAttempts
        ? 'automatic recovery attempt ' + this.autoRecoveryAttempts + ' of ' + this.maxAutoRecoveryAttempts
        : 'monitoring'
    };
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
    await this.loadHistory();
    const approval = createApprovalServer({ port, getModel: () => this.model(), decide: (input) => this.decide(input) });
    await new Promise((resolve, reject) => approval.server.listen(port, '127.0.0.1', (error) => error ? reject(error) : resolve()));
    this.running = true;
    while (this.running) {
      try { await this.cycle(); this.core.failures = 0; }
      catch (error) {
        await this.handleCycleFailure(error);
      }
      await this.heartbeat();
      await new Promise((resolve) => setTimeout(resolve, this.intervalMs));
    }
  }
}
