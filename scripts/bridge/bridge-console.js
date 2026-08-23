import { readFile } from 'node:fs/promises';
import { renderAnsiFrame } from './console-view.js';

const stateFile = process.argv[2];
if (!stateFile) throw new Error('Usage: bridge-console <live-state.json>');

while (true) {
  try {
    const state = JSON.parse(await readFile(stateFile, 'utf8'));
    process.stdout.write(renderAnsiFrame({
      ...state,
      bridgeHealthy: state.coordinatorHealthy,
      approvalRequired: state.state === 'AWAITING_APPROVAL',
      approvalUrl: 'http://127.0.0.1:4767',
      events: []
    }));
  } catch (error) {
    process.stdout.write('\u001b[2J\u001b[HeOS Bridge console waiting: ' + error.message + '\n');
  }
  await new Promise((resolve) => setTimeout(resolve, 1000));
}
