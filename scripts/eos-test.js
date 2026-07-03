import { backendDir, frontendDir, runCommand } from './eos-common.js';

await runCommand('backend lint', backendDir, ['run', 'lint']);
await runCommand('backend build', backendDir, ['run', 'build']);
await runCommand('backend verification', backendDir, ['run', 'status']);
await runCommand('frontend lint', frontendDir, ['run', 'lint']);
await runCommand('frontend build', frontendDir, ['run', 'build']);

console.log('EOS test suite completed.');
