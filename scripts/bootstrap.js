import { existsSync } from 'node:fs';
import { spawn } from 'node:child_process';

import { backendDir, frontendDir, npmCommand, rootDir } from './eos-common.js';

function run(label, command, args, cwd) {
  return new Promise((resolve, reject) => {
    console.log(`Running ${label}...`);

    const child = spawn(command, args, {
      cwd,
      stdio: 'inherit'
    });

    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${label} failed with exit code ${code}`));
    });
  });
}

if (!existsSync(`${rootDir}/.git`)) {
  await run('git init', 'git', ['init'], rootDir);
}

await run('backend dependency install', npmCommand, ['install'], backendDir);
await run('frontend dependency install', npmCommand, ['install'], frontendDir);

console.log('EOS developer bootstrap completed.');
console.log('Start EOS with: npm run eos:start');
