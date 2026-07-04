import { backendDir, frontendDir, rootDir, runCommand } from './eos-common.js';

await runCommand('backend lint', backendDir, ['run', 'lint']);
await runCommand('backend build', backendDir, ['run', 'build']);
await runCommand('backend verification', backendDir, ['run', 'status']);
await runCommand('platform audit generation', rootDir, ['run', 'eos:audit']);
await runCommand('backup status verification', rootDir, ['run', 'eos:backup:status']);
await runCommand('Google Drive backup configuration test', rootDir, ['run', 'eos:drive:test']);
await runCommand('frontend lint', frontendDir, ['run', 'lint']);
await runCommand('frontend build', frontendDir, ['run', 'build']);

console.log('EOS test suite completed.');
