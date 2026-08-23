#!/usr/bin/env node
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { BridgeCoordinator } from './bridge-coordinator.js';
import { freezeOnStale } from './bridge-watchdog.js';
import { renderAnsiFrame } from './console-view.js';
import { activate, installDisabled, serviceStatus } from './service-manager.js';

const moduleDirectory = dirname(fileURLToPath(import.meta.url));
const root = process.env.EOS_ROOT || join(moduleDirectory, '..', '..');
const stateDir = process.env.EOS_BRIDGE_STATE_DIR || join(root, '.eos', 'control', 'bridge');
const launchAgentsDir = join(homedir(), 'Library', 'LaunchAgents');
const command = process.argv[2] || 'status';

async function liveState() {
  return JSON.parse(await readFile(join(stateDir, 'EOS-BRIDGE-LIVE-STATE.json'), 'utf8'));
}

if (command === 'start') {
  const coordinator = new BridgeCoordinator({
    root,
    stateDir,
    signerPath: join(stateDir, 'bin', 'eos-bridge-signer'),
    telemetryRemote: process.env.EOS_BRIDGE_TELEMETRY_REMOTE ||
      'eos-drive:eOS Build Intelligence Bridge/Current-State/EOS-BRIDGE-LIVE-STATE.json'
  });
  await coordinator.start({ port: Number.parseInt(process.env.EOS_BRIDGE_PORT || '4767', 10) });
} else if (command === 'watchdog') {
  while (true) {
    await freezeOnStale({ stateDir, now: Date.now(), staleMs: 45_000 }).catch(() => {});
    await new Promise((resolve) => setTimeout(resolve, 30_000));
  }
} else if (command === 'console') {
  while (true) {
    try {
      const state = await liveState();
      process.stdout.write(renderAnsiFrame({ ...state, bridgeHealthy: state.coordinatorHealthy,
        approvalRequired: state.state === 'AWAITING_APPROVAL', approvalUrl: 'http://127.0.0.1:4767', events: [] }));
    } catch (error) {
      process.stdout.write('\u001b[2J\u001b[HeOS Bridge console waiting: ' + error.message + '\n');
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
} else if (command === 'status') {
  console.log(JSON.stringify({ services: serviceStatus(), state: await liveState().catch(() => null) }, null, 2));
} else if (command === 'install-disabled') {
  await installDisabled({
    launchAgentsDir,
    templatesDir: join(root, 'services', 'launchagents'),
    eosRoot: root,
    nodePath: process.execPath,
    stateDir
  });
  console.log('Bridge LaunchAgents installed disabled. Nothing was activated.');
} else if (command === 'activate') {
  console.log(activate({ launchAgentsDir }));
} else if (command === 'freeze') {
  await mkdir(stateDir, { recursive: true });
  await writeFile(join(stateDir, 'FROZEN'), 'operator freeze\n', { mode: 0o600 });
  console.log('EOS Bridge frozen locally.');
} else if (command === 'unfreeze') {
  await rm(join(stateDir, 'FROZEN'), { force: true });
  console.log('EOS Bridge local freeze removed.');
} else {
  throw new Error('Unknown command: ' + command);
}
