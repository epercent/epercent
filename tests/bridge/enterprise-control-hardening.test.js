import assert from 'node:assert/strict';
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  approvalPage,
  createApprovalServer
} from '../../scripts/bridge/approval-server.js';
import { renderAnsiFrame } from '../../scripts/bridge/console-view.js';
import {
  assertFullCommitSha,
  classifyBridgeFailure
} from '../../scripts/bridge/protocol.js';

const model = {
  state: 'AWAITING_APPROVAL',
  generation: 28,
  missionDigest: 'd'.repeat(64),
  repositoryClean: true,
  risk: 'MUTATING',
  recoveryStatus: 'monitoring',
  history: Array.from({ length: 12 }, (_, index) => ({
    at: String(index), type: 'EVENT', missionId: 'EOS-UX-001', outcome: 'OK'
  })),
  mission: {
    missionId: 'EOS-UX-001',
    title: 'Improve Enterprise Control',
    description: 'Keep approval and monitoring on one screen.',
    authorityLevel: 'A1',
    requiredBranch: 'feature/test',
    requiredCommit: 'a'.repeat(40),
    allowedPaths: ['scripts/bridge/approval-server.js']
  }
};

function request({ port, method = 'GET', path = '/', body = '' }) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: '127.0.0.1', port, method, path,
      headers: {
        origin: 'http://127.0.0.1:' + port,
        'content-type': 'application/x-www-form-urlencoded'
      }
    }, (response) => {
      let data = '';
      response.on('data', (chunk) => { data += chunk; });
      response.on('end', () => resolve({
        status: response.statusCode,
        location: response.headers.location,
        body: data
      }));
    });
    req.on('error', reject);
    req.end(body);
  });
}

test('Enterprise Control explains purpose and renders only ten recent events', () => {
  const page = approvalPage(model, 'csrf');
  assert.match(page, /Keep approval and monitoring on one screen/);
  assert.doesNotMatch(page, /<td>0<\/td>/);
  assert.match(page, /<td>11<\/td>/);
  assert.match(page, /s-AWAITING_APPROVAL/);
});

test('decision outcomes return to the same Enterprise Control screen', async () => {
  const requestedPort = 44000 + (process.pid % 1000);
  const control = createApprovalServer({
    port: requestedPort,
    getModel: async () => model,
    decide: async ({ decision }) => {
      if (decision === 'REJECT') throw new Error('test refusal');
    }
  });
  await new Promise((resolve) => control.server.listen(requestedPort, '127.0.0.1', resolve));
  try {
    const home = await request({ port: requestedPort });
    const csrf = home.body.match(/name="csrf" value="([^"]+)"/)?.[1];
    for (const decision of ['APPROVE', 'REJECT']) {
      const result = await request({
        port: requestedPort,
        method: 'POST',
        path: '/decision',
        body: new URLSearchParams({ csrf, decision }).toString()
      });
      assert.equal(result.status, 303);
      assert.match(result.location, /^\/\?/);
    }
  } finally {
    await new Promise((resolve) => control.server.close(resolve));
  }
});

test('commit, recovery and terminal-state controls fail safely', async () => {
  assert.equal(assertFullCommitSha('a'.repeat(40)), 'a'.repeat(40));
  assert.throws(() => assertFullCommitSha('a'.repeat(41)), /exact 40-character/);
  assert.equal(classifyBridgeFailure(new Error('mission digest mismatch')).recoverable, false);
  assert.equal(classifyBridgeFailure(new Error('temporary telemetry unavailable')).recoverable, true);
  const coordinator = await readFile(
    new URL('../../scripts/bridge/bridge-coordinator.js', import.meta.url),
    'utf8'
  );
  assert.match(coordinator, /if \(this\.core\.state === 'EXECUTING'\) this\.core\.transition\('QUARANTINED'\)/);
});

test('live console uses visible lifecycle colors', () => {
  const frame = renderAnsiFrame({
    state: 'FROZEN', repositoryClean: true, bridgeHealthy: false,
    watchdogHealthy: true, approvalRequired: false, events: []
  });
  assert.match(frame, /\u001b\[31;1mFROZEN\u001b\[0m/);
});
