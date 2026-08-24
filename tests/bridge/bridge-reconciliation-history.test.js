import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import { EOSRepositoryAdapter } from '../../scripts/bridge/eos-adapter.js';
import { appendHistory, historyEvent } from '../../scripts/bridge/activity-history.js';
import { approvalPage } from '../../scripts/bridge/approval-server.js';

test('terminal inbox synchronization refuses identity mismatches and uploads exact terminal evidence', async () => {
  const root = await mkdtemp(join(tmpdir(), 'eos-terminal-sync-'));
  try {
    const control = join(root, '.eos', 'control');
    await import('node:fs/promises').then(({ mkdir }) => mkdir(control, { recursive: true }));
    const inbox = { generation: 26, state: 'COMPLETED', mission: { missionId: 'M26' }, execution: { executionId: 'x26', missionDigest: 'd26', status: 'FINISHED', outcome: 'PASSED' } };
    await writeFile(join(control, 'EOS-MISSION-INBOX.json'), JSON.stringify(inbox));
    const calls = [];
    const adapter = new EOSRepositoryAdapter({ root, run: (command, args) => { calls.push([command, args]); return { status: 0, stdout: '' }; } });
    await assert.rejects(adapter.synchronizeTerminalInbox({ generation: 26, missionId: 'M26', missionDigest: 'wrong' }), /digest mismatch/);
    const terminal = await adapter.synchronizeTerminalInbox({ generation: 26, missionId: 'M26', missionDigest: 'd26' });
    assert.equal(terminal.execution.executionId, 'x26');
    assert.equal(calls.at(-1)[0], 'rclone');
  } finally { await rm(root, { recursive: true, force: true }); }
});

test('history is bounded and Enterprise Control auto-refreshes with warnings and recovery', () => {
  const event = historyEvent({ type: 'ERROR', generation: 26, missionId: 'M26', missionDigest: 'd26', outcome: 'REFUSED', at: '2026-08-24T17:00:00Z' });
  assert.equal(appendHistory(appendHistory([], event), event).length, 1);
  const html = approvalPage({ state: 'QUARANTINED', warning: 'receipt mismatch', mission: null, missionDigest: null, history: [event] }, 'csrf');
  assert.match(html, /http-equiv="refresh" content="5"/);
  assert.match(html, /receipt mismatch/);
  assert.match(html, /Governed recovery reset/);
  assert.match(html, /Approval and execution history/);
});
