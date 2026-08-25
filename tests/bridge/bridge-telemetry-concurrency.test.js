import assert from 'node:assert/strict';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import { TelemetryPublisher } from '../../scripts/bridge/telemetry-publisher.js';

test('concurrent telemetry publications are serialized and leave no shared temporary file', async () => {
  const root = await mkdtemp(join(tmpdir(), 'eos-telemetry-concurrency-'));
  try {
    const stateFile = join(root, 'EOS-BRIDGE-LIVE-STATE.json');
    const uploads = [];
    const publisher = new TelemetryPublisher({
      stateFile,
      remote: 'eos-drive:test/EOS-BRIDGE-LIVE-STATE.json',
      run: (_command, args) => {
        uploads.push(JSON.parse(requireRead(args[1])));
        return { status: 0, stdout: '', stderr: '' };
      }
    });

    await Promise.all(Array.from({ length: 20 }, (_, index) => publisher.publish({
      state: index === 19 ? 'COMPLETED' : 'VALIDATING',
      generation: index,
      branch: 'main',
      headCommit: 'a'.repeat(40),
      changedPaths: [],
      tests: [],
      coordinatorHealthy: true,
      watchdogHealthy: true,
      frozen: false,
      updatedAt: new Date(1_800_000_000_000 + index).toISOString()
    })));

    const finalState = JSON.parse(await readFile(stateFile, 'utf8'));
    assert.equal(finalState.generation, 19);
    assert.equal(finalState.state, 'COMPLETED');
    assert.equal(uploads.length, 20);
    assert.deepEqual((await readdir(root)).filter((name) => name.includes('.tmp')), []);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

function requireRead(path) {
  return globalThis.process.getBuiltinModule('fs').readFileSync(path, 'utf8');
}
