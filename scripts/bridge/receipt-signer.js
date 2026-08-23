import { createHash, createPublicKey } from 'node:crypto';
import { spawnSync } from 'node:child_process';

import { authorizationPayload, canonicalize } from './protocol.js';

export class MacOSReceiptSigner {
  constructor({ helperPath, run = spawnSync }) {
    this.helperPath = helperPath;
    this.run = run;
  }

  helper(args, options = {}) {
    const result = this.run(this.helperPath, args, { encoding: 'utf8', ...options });
    if (result.status !== 0) throw new Error('local signing helper refused');
    return result.stdout.trim();
  }

  publicKeyPem() { return this.helper(['public-key']); }

  signReceipt(fields) {
    const publicKeyPem = this.publicKeyPem();
    const publicKey = createPublicKey(publicKeyPem);
    const receipt = {
      ...fields,
      keyFingerprint: createHash('sha256').update(publicKey.export({ type: 'spki', format: 'der' })).digest('hex')
    };
    const payload = Buffer.from(JSON.stringify(canonicalize(authorizationPayload(receipt))));
    receipt.signature = this.helper(['sign'], { input: payload });
    return { receipt, publicKeyPem };
  }
}
