import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const labels = [
  'ai.epercent.eos.bridge-coordinator',
  'ai.epercent.eos.bridge-watchdog'
];

export async function renderLaunchAgent({ template, eosRoot, nodePath, stateDir }) {
  return (await readFile(template, 'utf8'))
    .replaceAll('__EOS_ROOT__', eosRoot)
    .replaceAll('__EOS_NODE__', nodePath)
    .replaceAll('__EOS_STATE__', stateDir);
}

export async function installDisabled(options) {
  await mkdir(options.launchAgentsDir, { recursive: true });
  await mkdir(join(options.stateDir, 'logs'), { recursive: true });
  const installed = [];
  for (const label of labels) {
    const source = join(options.templatesDir, label + '.plist.template');
    const target = join(options.launchAgentsDir, label + '.plist');
    const content = await renderLaunchAgent({
      template: source, eosRoot: options.eosRoot,
      nodePath: options.nodePath, stateDir: options.stateDir
    });
    await writeFile(target, content, { mode: 0o600, flag: 'wx' });
    installed.push(target);
  }
  return installed;
}

export function serviceStatus({ uid = process.getuid(), run = spawnSync } = {}) {
  return labels.map((label) => {
    const result = run('launchctl', ['print', 'gui/' + uid + '/' + label], { encoding: 'utf8' });
    return { label, loaded: result.status === 0 };
  });
}

export function activate({ uid = process.getuid(), launchAgentsDir, run = spawnSync }) {
  const results = [];
  for (const label of labels) {
    const plist = join(launchAgentsDir, label + '.plist');
    const result = run('launchctl', ['bootstrap', 'gui/' + uid, plist], { encoding: 'utf8' });
    if (result.status !== 0) throw new Error('activation failed for ' + label);
    results.push(label);
  }
  return results;
}

export async function copySigner({ compiledSigner, target }) {
  await copyFile(compiledSigner, target, 0);
}
