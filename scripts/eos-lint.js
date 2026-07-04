import { spawn } from 'node:child_process';

import { backendDir, frontendDir, rootDir, runCommand } from './eos-common.js';

const rootScriptFiles = [
  'scripts/bootstrap.js',
  'scripts/eos-backup.js',
  'scripts/eos-backup-status-check.js',
  'scripts/eos-audit.js',
  'scripts/eos-build.js',
  'scripts/eos-common.js',
  'scripts/eos-drive-status.js',
  'scripts/eos-drive-test.js',
  'scripts/eos-drive-utils.js',
  'scripts/eos-git-status.js',
  'scripts/eos-git-utils.js',
  'scripts/eos-release.js',
  'scripts/eos-restore.js',
  'scripts/eos-start.js',
  'scripts/eos-status.js',
  'scripts/eos-stop.js',
  'scripts/eos-tag.js',
  'scripts/eos-test.js'
];

function checkScript(file) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ['--check', file], {
      cwd: rootDir,
      stdio: 'inherit'
    });

    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${file} failed syntax validation with exit code ${code}`));
    });
  });
}

await runCommand('backend lint', backendDir, ['run', 'lint']);
await runCommand('frontend lint', frontendDir, ['run', 'lint']);

console.log('Running root script syntax checks...');

for (const file of rootScriptFiles) {
  await checkScript(file);
}

console.log('EOS lint completed.');
