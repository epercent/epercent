import { STATES, verifyAuthorizationReceipt } from './protocol.js';

const transitions = Object.freeze({
  IDLE: ['VALIDATING', 'PAUSED', 'FROZEN'],
  VALIDATING: ['AWAITING_APPROVAL', 'IDLE', 'DEGRADED', 'QUARANTINED', 'FROZEN'],
  AWAITING_APPROVAL: ['APPROVED', 'REJECTED', 'PAUSED', 'FROZEN', 'DEGRADED'],
  APPROVED: ['EXECUTING', 'FROZEN', 'QUARANTINED'],
  EXECUTING: ['COMPLETED', 'QUARANTINED', 'DEGRADED'],
  COMPLETED: ['IDLE', 'VALIDATING', 'PAUSED', 'FROZEN'],
  REJECTED: ['IDLE', 'VALIDATING', 'PAUSED', 'FROZEN'],
  PAUSED: ['IDLE', 'FROZEN'],
  FROZEN: ['IDLE'],
  DEGRADED: ['IDLE', 'VALIDATING', 'FROZEN', 'QUARANTINED'],
  QUARANTINED: ['FROZEN']
});

export class CoordinatorCore {
  constructor({ failureLimit = 3, restartLimit = 5 } = {}) {
    this.state = 'IDLE';
    this.failureLimit = failureLimit;
    this.restartLimit = restartLimit;
    this.failures = 0;
    this.restarts = 0;
    this.usedNonces = new Set();
    this.frozenReason = null;
  }

  transition(next) {
    if (!STATES.includes(next) || !transitions[this.state]?.includes(next)) {
      throw new Error('illegal coordinator transition: ' + this.state + ' -> ' + next);
    }
    this.state = next;
    return this.state;
  }

  freeze(reason) {
    if (this.state !== 'FROZEN') this.transition('FROZEN');
    this.frozenReason = reason || 'operator freeze';
  }

  registerFailure(reason) {
    this.failures += 1;
    if (this.failures >= this.failureLimit) this.freeze('circuit breaker: ' + reason);
    return this.state;
  }

  registerRestart() {
    this.restarts += 1;
    if (this.restarts >= this.restartLimit) this.freeze('restart loop detected');
    return this.state;
  }

  approve(receipt, context) {
    if (this.state !== 'AWAITING_APPROVAL') throw new Error('approval not expected');
    const result = verifyAuthorizationReceipt(receipt, { ...context, usedNonces: this.usedNonces });
    if (!result.valid) return result;
    this.usedNonces.add(receipt.nonce);
    this.transition('APPROVED');
    return result;
  }
}
