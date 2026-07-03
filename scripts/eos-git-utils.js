import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { rootDir } from './eos-common.js';

export function runGit(args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn('git', args, {
      cwd: rootDir,
      stdio: ['ignore', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('exit', (code) => {
      const result = {
        code,
        stdout: stdout.trim(),
        stderr: stderr.trim()
      };

      if (code !== 0 && options.rejectOnError) {
        reject(new Error(result.stderr || `git ${args.join(' ')} failed with exit code ${code}`));
        return;
      }

      resolve(result);
    });
  });
}

export async function isGitInitialized() {
  const result = await runGit(['rev-parse', '--is-inside-work-tree']);
  return result.code === 0 && result.stdout === 'true';
}

export async function getCurrentVersion() {
  const packageJson = JSON.parse(await readFile(join(rootDir, 'package.json'), 'utf8'));
  return packageJson.version;
}

export async function getGitSnapshot() {
  const initialized = await isGitInitialized();

  if (!initialized) {
    return {
      initialized: false,
      branch: 'Not initialized',
      latestCommit: 'No repository',
      latestTag: 'No tags',
      uncommittedChanges: []
    };
  }

  const branchResult = await runGit(['branch', '--show-current']);
  const commitResult = await runGit(['log', '-1', '--oneline']);
  const tagResult = await runGit(['describe', '--tags', '--abbrev=0']);
  const statusResult = await runGit(['status', '--short']);

  return {
    initialized: true,
    branch: branchResult.stdout || 'Detached HEAD',
    latestCommit: commitResult.code === 0 ? commitResult.stdout : 'No commits yet',
    latestTag: tagResult.code === 0 ? tagResult.stdout : 'No tags',
    uncommittedChanges: statusResult.stdout ? statusResult.stdout.split('\n') : []
  };
}

export async function tagExists(tagName) {
  const result = await runGit(['rev-parse', '--verify', `refs/tags/${tagName}`]);
  return result.code === 0;
}
