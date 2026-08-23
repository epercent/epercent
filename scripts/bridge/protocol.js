import { createHash, createPublicKey, verify } from 'node:crypto';

export const STATES = Object.freeze([
  'IDLE', 'VALIDATING', 'AWAITING_APPROVAL', 'APPROVED', 'EXECUTING',
  'COMPLETED', 'REJECTED', 'PAUSED', 'FROZEN', 'DEGRADED', 'QUARANTINED'
]);

export function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
  }
  return value;
}

export function sha256(value) {
  const bytes =
    typeof value === 'string' ||
    Buffer.isBuffer(value) ||
    value instanceof Uint8Array
      ? value
      : JSON.stringify(canonicalize(value));
  return createHash('sha256').update(bytes).digest('hex');
}

export function missionDigest(mission) {
  return sha256(mission);
}

export function authorizationPayload(receipt) {
  return {
    schemaVersion: receipt.schemaVersion,
    missionId: receipt.missionId,
    missionDigest: receipt.missionDigest,
    generation: receipt.generation,
    nonce: receipt.nonce,
    decision: receipt.decision,
    issuedAt: receipt.issuedAt,
    expiresAt: receipt.expiresAt,
    keyFingerprint: receipt.keyFingerprint
  };
}

export function verifyAuthorizationReceipt(receipt, context) {
  const errors = [];
  if (receipt?.schemaVersion !== '1.0.0') errors.push('unsupported receipt schema');
  if (receipt?.decision !== 'APPROVE') errors.push('receipt is not an approval');
  if (receipt?.missionId !== context.missionId) errors.push('mission ID mismatch');
  if (receipt?.missionDigest !== context.missionDigest) errors.push('mission digest mismatch');
  if (receipt?.generation !== context.generation) errors.push('generation mismatch');
  if (receipt?.nonce !== context.nonce) errors.push('nonce mismatch');
  if (context.usedNonces?.has(receipt?.nonce)) errors.push('receipt nonce already used');
  const now = Date.parse(context.now);
  if (!Number.isFinite(now) || Date.parse(receipt?.expiresAt) <= now) errors.push('receipt expired');
  if (Date.parse(receipt?.issuedAt) > now + 30_000) errors.push('receipt issued in the future');
  if (errors.length === 0) {
    try {
      const payload = Buffer.from(JSON.stringify(canonicalize(authorizationPayload(receipt))));
      const publicKey = createPublicKey(context.publicKeyPem);
      const valid = verify('sha256', payload, publicKey, Buffer.from(receipt.signature, 'base64'));
      if (!valid) errors.push('invalid local signature');
      const fingerprint = sha256(publicKey.export({ type: 'spki', format: 'der' }));
      if (fingerprint !== receipt.keyFingerprint) errors.push('key fingerprint mismatch');
    } catch {
      errors.push('unreadable authorization signature');
    }
  }
  return Object.freeze({ valid: errors.length === 0, errors });
}

export function assertLocalRequest({ address, origin, expectedOrigin }) {
  const local = address === '127.0.0.1' || address === '::1' || address === '::ffff:127.0.0.1';
  if (!local) throw new Error('non-local client refused');
  if (origin !== expectedOrigin) throw new Error('request origin refused');
  return true;
}

export function sourceFreeTelemetry(input) {
  return Object.freeze({
    schemaVersion: '1.0.0',
    state: input.state,
    generation: input.generation ?? null,
    missionId: input.missionId ?? null,
    missionDigest: input.missionDigest ?? null,
    branch: input.branch,
    headCommit: input.headCommit,
    repositoryClean: input.changedPaths.length === 0,
    changedPaths: [...input.changedPaths],
    tests: input.tests.map(({ name, passed }) => ({ name, passed: passed === true })),
    coordinatorHealthy: input.coordinatorHealthy === true,
    watchdogHealthy: input.watchdogHealthy === true,
    frozen: input.frozen === true,
    updatedAt: input.updatedAt,
    containsSourceCode: false,
    containsSecrets: false
  });
}
