import { randomBytes } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { spawnSync } from 'node:child_process';

import { sourceFreeTelemetry } from './protocol.js';

export class TelemetryPublisher {
  constructor({ stateFile, remote, run = spawnSync }) {
    this.stateFile = stateFile;
    this.remote = remote;
    this.run = run;
    this.publicationQueue = Promise.resolve();
  }

  publish(input) {
    const publication = this.publicationQueue.then(() => this.publishAtomically(input));
    this.publicationQueue = publication.catch(() => {});
    return publication;
  }

  async publishAtomically(input) {
    const telemetry = sourceFreeTelemetry(input);
    await mkdir(dirname(this.stateFile), { recursive: true });
    const temporary = this.stateFile + '.tmp-' + process.pid + '-' + randomBytes(8).toString('hex');
    await writeFile(temporary, JSON.stringify(telemetry, null, 2) + '\n', { mode: 0o600 });
    await rename(temporary, this.stateFile);
    const upload = this.run('rclone', ['copyto', this.stateFile, this.remote], { encoding: 'utf8' });
    if (upload.status !== 0) throw new Error('telemetry synchronization failed');
    return telemetry;
  }

  async read() { return JSON.parse(await readFile(this.stateFile, 'utf8')); }
}
