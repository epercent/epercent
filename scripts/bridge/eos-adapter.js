import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

export class EOSRepositoryAdapter {
  constructor({ root, run = spawnSync }) {
    this.root = root;
    this.run = run;
    this.control = join(root, '.eos', 'control');
  }

  command(executable, args, options = {}) {
    return this.run(executable, args, {
      cwd: this.root,
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024,
      ...options
    });
  }

  async validate() {
    const result = this.command('bin/eos-mission', ['pull']);
    if (result.status !== 0) throw new Error('canonical mission validation failed');
    const inbox = JSON.parse(await readFile(join(this.control, 'EOS-MISSION-INBOX.json'), 'utf8'));
    const validation = JSON.parse(await readFile(join(this.control, 'EOS-MISSION-VALIDATION.json'), 'utf8'));
    return { inbox, validation };
  }

  authorize(missionId) {
    const result = this.command('bin/eos-authorize', [missionId], {
      input: 'AUTHORIZE ' + missionId + '\n'
    });
    if (result.status !== 0) throw new Error('canonical authorization handoff failed');
    return result;
  }

  execute() {
    const result = this.command('bin/eos-execute', [], { stdio: 'inherit' });
    if (result.status !== 0) throw new Error('governed executor failed');
    return result;
  }

  gitState() {
    const runGit = (...args) => {
      const result = this.command('git', args);
      if (result.status !== 0) throw new Error('git inspection failed');
      return result.stdout.replace(/\r?\n$/, '');
    };
    const status = runGit('status', '--porcelain');
    return {
      branch: runGit('branch', '--show-current'),
      headCommit: runGit('rev-parse', 'HEAD'),
      status
    };
  }
}
