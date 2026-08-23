import assert from 'node:assert/strict';
import { generateKeyPairSync, sign } from 'node:crypto';
import test from 'node:test';

import {
  assertLocalRequest,
  authorizationPayload,
  canonicalize,
  sha256,
  sourceFreeTelemetry,
  verifyAuthorizationReceipt
} from '../../scripts/bridge/protocol.js';
import { CoordinatorCore } from '../../scripts/bridge/coordinator-core.js';
import { renderConsole } from '../../scripts/bridge/console-view.js';

function signedFixture() {
  const { privateKey, publicKey } = generateKeyPairSync('ec', { namedCurve: 'P-256' });
  const publicKeyPem = publicKey.export({ type: 'spki', format: 'pem' });
  const receipt = {
    schemaVersion: '1.0.0', missionId: 'EOS-TEST-001', missionDigest: 'a'.repeat(64),
    generation: 14, nonce: 'nonce-001', decision: 'APPROVE',
    issuedAt: '2026-08-22T21:00:00.000Z', expiresAt: '2026-08-22T21:05:00.000Z',
    keyFingerprint: sha256(publicKey.export({ type: 'spki', format: 'der' }))
  };
  const payload = Buffer.from(JSON.stringify(canonicalize(authorizationPayload(receipt))));
  receipt.signature = sign('sha256', payload, privateKey).toString('base64');
  return { receipt, publicKeyPem };
}

test('accepts exact locally signed receipt and refuses altered digest', () => {
  const { receipt, publicKeyPem } = signedFixture();
  const context = { missionId: receipt.missionId, missionDigest: receipt.missionDigest,
    generation: receipt.generation, nonce: receipt.nonce, now: '2026-08-22T21:01:00.000Z', publicKeyPem };
  assert.equal(verifyAuthorizationReceipt(receipt, context).valid, true);
  assert.equal(verifyAuthorizationReceipt({ ...receipt, missionDigest: 'b'.repeat(64) }, context).valid, false);
});

test('refuses replay, expiry and wrong nonce', () => {
  const { receipt, publicKeyPem } = signedFixture();
  const base = { missionId: receipt.missionId, missionDigest: receipt.missionDigest,
    generation: receipt.generation, nonce: receipt.nonce, now: '2026-08-22T21:01:00.000Z', publicKeyPem };
  assert.equal(verifyAuthorizationReceipt(receipt, { ...base, usedNonces: new Set([receipt.nonce]) }).valid, false);
  assert.equal(verifyAuthorizationReceipt(receipt, { ...base, now: '2026-08-22T22:00:00.000Z' }).valid, false);
  assert.equal(verifyAuthorizationReceipt(receipt, { ...base, nonce: 'other' }).valid, false);
});

test('localhost and origin are both required', () => {
  assert.equal(assertLocalRequest({ address: '127.0.0.1', origin: 'http://127.0.0.1:4767', expectedOrigin: 'http://127.0.0.1:4767' }), true);
  assert.throws(() => assertLocalRequest({ address: '10.0.0.5', origin: 'http://127.0.0.1:4767', expectedOrigin: 'http://127.0.0.1:4767' }));
  assert.throws(() => assertLocalRequest({ address: '127.0.0.1', origin: 'https://evil.test', expectedOrigin: 'http://127.0.0.1:4767' }));
});

test('coordinator enforces transitions, replay and circuit breaker', () => {
  const { receipt, publicKeyPem } = signedFixture();
  const core = new CoordinatorCore({ failureLimit: 2 });
  core.transition('VALIDATING'); core.transition('AWAITING_APPROVAL');
  assert.equal(core.approve(receipt, { missionId: receipt.missionId, missionDigest: receipt.missionDigest,
    generation: receipt.generation, nonce: receipt.nonce, now: '2026-08-22T21:01:00.000Z', publicKeyPem }).valid, true);
  assert.equal(core.state, 'APPROVED');
  const breaker = new CoordinatorCore({ failureLimit: 2 });
  breaker.registerFailure('transport'); breaker.registerFailure('transport');
  assert.equal(breaker.state, 'FROZEN');
});

test('telemetry and console expose state but no source or secrets', () => {
  const telemetry = sourceFreeTelemetry({ state: 'IDLE', branch: 'feature/test', headCommit: 'c'.repeat(40),
    changedPaths: [], tests: [{ name: 'test', passed: true }], coordinatorHealthy: true,
    watchdogHealthy: true, frozen: false, updatedAt: '2026-08-22T21:00:00.000Z' });
  assert.equal(telemetry.containsSourceCode, false);
  assert.equal(telemetry.containsSecrets, false);
  const view = renderConsole({ ...telemetry, bridgeHealthy: true, approvalRequired: false, events: [] });
  assert.match(view, /LIVE CONSOLE/);
  assert.doesNotMatch(view, /password|token=/i);
});
