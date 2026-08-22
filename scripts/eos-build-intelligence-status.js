import { spawnSync } from 'node:child_process';

const remoteRoot =
  process.env.EOS_BRIDGE_REMOTE ??
  'eos-drive:eOS Build Intelligence Bridge';

const requiredDirectories = [
  'Current-State',
  'Runs',
  'Failures',
  'Ledgers',
  'Decisions'
];

const remoteCheck = spawnSync('rclone', ['listremotes'], {
  encoding: 'utf8'
});

const remoteAvailable =
  remoteCheck.status === 0 &&
  remoteCheck.stdout.split(/\r?\n/).includes('eos-drive:');

const directoryCheck = remoteAvailable
  ? spawnSync('rclone', ['lsf', remoteRoot, '--dirs-only'], {
      encoding: 'utf8'
    })
  : { status: 1, stdout: '', stderr: 'eos-drive remote is unavailable' };

const availableDirectories = new Set(
  directoryCheck.stdout
    .split(/\r?\n/)
    .filter(Boolean)
    .map((value) => value.replace(/\/$/, ''))
);

const missingDirectories = requiredDirectories.filter(
  (directory) => !availableDirectories.has(directory)
);

console.log('eOS Build Intelligence Bridge Status');
console.log('------------------------------------');
console.log(`Rclone remote: ${remoteAvailable ? 'PASS' : 'FAIL'}`);
console.log(
  `Drive structure: ${
    directoryCheck.status === 0 && missingDirectories.length === 0
      ? 'PASS'
      : 'FAIL'
  }`
);

for (const directory of requiredDirectories) {
  console.log(
    `${availableDirectories.has(directory) ? 'PASS' : 'FAIL'} - ${directory}`
  );
}

if (
  !remoteAvailable ||
  directoryCheck.status !== 0 ||
  missingDirectories.length
) {
  if (directoryCheck.stderr) {
    console.error(directoryCheck.stderr.trim());
  }
  process.exit(1);
}

console.log('Bridge readiness: PASS');
