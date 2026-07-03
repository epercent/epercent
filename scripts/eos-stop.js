import { clearRuntime, isProcessRunning, readRuntime, stopManagedProcess } from './eos-common.js';

const runtime = await readRuntime();

if (!runtime) {
  console.log('EOS is not running from this workspace.');
  process.exit(0);
}

const backendStopped = stopManagedProcess(runtime.backend?.pid);
const frontendStopped = stopManagedProcess(runtime.frontend?.pid);

await new Promise((resolve) => setTimeout(resolve, 1000));
await clearRuntime();

console.log(`Backend: ${backendStopped || !isProcessRunning(runtime.backend?.pid) ? 'stopped' : 'not stopped'}`);
console.log(`Mission Control: ${frontendStopped || !isProcessRunning(runtime.frontend?.pid) ? 'stopped' : 'not stopped'}`);
