import { backendDir, frontendDir, runCommand } from './eos-common.js';

await runCommand('backend build', backendDir, ['run', 'build']);
await runCommand('frontend build', frontendDir, ['run', 'build']);

console.log('EOS build completed.');
