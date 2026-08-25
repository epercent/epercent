import { randomBytes } from 'node:crypto';
import { readFile, rename, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { verifyAuthorizationReceipt } from './protocol.js';

export class ApprovalLeaseStore {
  constructor({ stateDir, now = () => new Date().toISOString() }) {
    this.file = join(stateDir, 'EOS-BRIDGE-APPROVAL-LEASE.json');
    this.now = now;
  }

  async save({ receipt, publicKeyPem, branch, commit }) {
    const lease = {
      schemaVersion: '1.0.0', receipt, publicKeyPem, branch, commit,
      persistedAt: this.now(), status: 'VERIFIED'
    };
    const temporary = this.file + '.tmp-' + process.pid + '-' + randomBytes(8).toString('hex');
    await writeFile(temporary, JSON.stringify(lease, null, 2) + '\n', { mode: 0o600 });
    await rename(temporary, this.file);
    return lease;
  }

  async load() {
    try { return JSON.parse(await readFile(this.file, 'utf8')); }
    catch (error) { if (error.code === 'ENOENT') return null; throw error; }
  }

  async clear() { await rm(this.file, { force: true }); }

  verify(lease, { inbox, validation, branch, commit, now = this.now() }) {
    const mission = inbox?.mission;
    const errors = [];
    if (!lease) errors.push('local approval lease missing');
    if (lease?.schemaVersion !== '1.0.0') errors.push('approval lease schema mismatch');
    if (lease?.branch !== branch) errors.push('approval branch mismatch');
    if (lease?.commit !== commit) errors.push('approval commit mismatch');
    if (inbox?.state !== 'AUTHORIZED') errors.push('remote mission is not authorized');
    if (lease?.receipt?.missionId !== mission?.missionId) errors.push('approval mission mismatch');
    if (lease?.receipt?.missionDigest !== validation?.missionDigest) errors.push('approval digest mismatch');
    if (lease?.receipt?.generation !== inbox?.generation) errors.push('approval generation mismatch');
    if (errors.length === 0) {
      const result = verifyAuthorizationReceipt(lease.receipt, {
        missionId: mission.missionId,
        missionDigest: validation.missionDigest,
        generation: inbox.generation,
        nonce: lease.receipt.nonce,
        now,
        publicKeyPem: lease.publicKeyPem,
        usedNonces: new Set()
      });
      errors.push(...result.errors);
    }
    return Object.freeze({ valid: errors.length === 0, errors });
  }
}
