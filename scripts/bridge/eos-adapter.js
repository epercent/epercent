import { appendFile, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

export class EOSRepositoryAdapter {
  constructor({ root, run = spawnSync }) {
    this.root = root;
    this.run = run;
    this.control = join(root, '.eos', 'control');
    this.remoteInbox =
      process.env.EOS_MISSION_REMOTE ??
      'eos-drive:eOS Build Intelligence Bridge/Control/Inbox/EOS-MISSION-INBOX.json';
    this.replayLedger = join(this.control, 'EOS-EXECUTED-MISSIONS.ndjson');
    this.refusalLedger = join(this.control, 'bridge', 'EOS-BRIDGE-PRECLAIM-REFUSALS.ndjson');
  }

  command(executable, args, options = {}) {
    return this.run(executable, args, {
      cwd: this.root,
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024,
      ...options
    });
  }

  async validate() {
    const result = this.command('bin/eos-mission', ['pull']);
    if (result.status !== 0) throw new Error('canonical mission validation failed');
    const inbox = JSON.parse(await readFile(join(this.control, 'EOS-MISSION-INBOX.json'), 'utf8'));
    const validation = JSON.parse(await readFile(join(this.control, 'EOS-MISSION-VALIDATION.json'), 'utf8'));
    return { inbox, validation };
  }

  authorize(missionId) {
    const result = this.command('bin/eos-authorize', [missionId], {
      input: 'AUTHORIZE ' + missionId + '\n'
    });
    if (result.status !== 0) throw new Error('canonical authorization handoff failed');
    return result;
  }

  execute() {
    const result = this.command('bin/eos-execute', [], { stdio: 'inherit' });
    return result;
  }

  async ndjson(file) {
    try {
      return (await readFile(file, 'utf8')).split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
    } catch (error) {
      if (error.code === 'ENOENT') return [];
      throw error;
    }
  }

  artifactMetadata(artifact) {
    if (!artifact?.remotePath) return null;
    const result = this.command('rclone', ['lsjson', artifact.remotePath]);
    if (result.status !== 0) return null;
    const values = JSON.parse(result.stdout);
    return Array.isArray(values) ? values[0] ?? null : values;
  }

  async preflightInputs(mission) {
    return {
      replayEntries: await this.ndjson(this.replayLedger),
      refusalEntries: await this.ndjson(this.refusalLedger),
      artifactMetadata: this.artifactMetadata(mission?.artifact)
    };
  }

  async recordPreclaimRefusal(record) {
    await appendFile(this.refusalLedger, JSON.stringify(record) + '\n', { mode: 0o600 });
  }

  async synchronizeTerminalInbox({ generation, missionId, missionDigest, executionRun }) {
    const localFile = join(this.control, 'EOS-MISSION-INBOX.json');
    const inbox = JSON.parse(await readFile(localFile, 'utf8'));
    const errors = [];
    if (inbox.generation !== generation) errors.push('generation mismatch');
    if (inbox.mission?.missionId !== missionId) errors.push('mission ID mismatch');
    const identityMatches = inbox.generation === generation && inbox.mission?.missionId === missionId;
    const unclaimed = identityMatches && !inbox.execution && executionRun?.status !== 0;
    if (unclaimed) {
      const refusal = {
        generation, missionId, missionDigest,
        executionId: null,
        state: 'REFUSED_BEFORE_CLAIM',
        exitCode: executionRun.status ?? 1,
        recordedAt: new Date().toISOString()
      };
      await this.recordPreclaimRefusal(refusal);
      return { state: 'REFUSED_BEFORE_CLAIM', execution: { status: 'NOT_STARTED', outcome: 'REFUSED', ...refusal } };
    }
    if (inbox.execution?.missionDigest !== missionDigest) errors.push('mission digest mismatch');
    if (!['COMPLETED', 'QUARANTINED'].includes(inbox.state)) errors.push('local inbox is not terminal');
    if (inbox.execution?.status !== 'FINISHED') errors.push('execution is not finished');
    if (!inbox.execution?.executionId) errors.push('execution ID missing');
    if (errors.length) throw new Error('terminal receipt refused: ' + errors.join(', '));
    const upload = this.command('rclone', ['copyto', localFile, this.remoteInbox]);
    if (upload.status !== 0) throw new Error('terminal receipt synchronization failed');
    return inbox;
  }

  gitState() {
    const runGit = (...args) => {
      const result = this.command('git', args);
      if (result.status !== 0) throw new Error('git inspection failed');
      return result.stdout.replace(/\r?\n$/, '');
    };
    const status = runGit('status', '--porcelain');
    return {
      branch: runGit('branch', '--show-current'),
      headCommit: runGit('rev-parse', 'HEAD'),
      status
    };
  }
}
