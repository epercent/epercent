import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { rootDir, runCommand } from './eos-common.js';
import { getCurrentVersion, getGitSnapshot } from './eos-git-utils.js';

const releasesDir = join(rootDir, 'docs', 'releases');

function releaseNotes(version, snapshot, generatedAt) {
  return `# EOS v${version}

Release prepared: ${generatedAt}

## Summary

EOS v${version} prepares the EOS Alpha Genesis engineering baseline for local release tagging.

## Release Artifact

- EOS Alpha ${version} - Genesis: docs/releases/EOS-Alpha-${version}-Genesis.md

## Verification

- eos:lint: passed
- eos:build: passed
- eos:test: passed
- eos:backup: passed

## Git State

- Branch: ${snapshot.branch}
- Latest commit: ${snapshot.latestCommit}
- Latest tag: ${snapshot.latestTag}
- Uncommitted changes: ${snapshot.uncommittedChanges.length}

## Tag Target

- v${version}

## Release Preparation

This release has been prepared for commit. No GitHub push was performed.
`;
}

await runCommand('EOS lint', rootDir, ['run', 'eos:lint']);
await runCommand('EOS build', rootDir, ['run', 'eos:build']);
await runCommand('EOS test', rootDir, ['run', 'eos:test']);
await runCommand('EOS backup', rootDir, ['run', 'eos:backup']);

const version = await getCurrentVersion();
const generatedAt = new Date().toISOString();
const snapshot = await getGitSnapshot();
const releaseNotesFile = `EOS-v${version}.md`;
const releaseArtifactFile = `EOS-Alpha-${version}-Genesis.md`;
const manifest = {
  platform: 'EOS',
  version,
  build: version,
  status: 'Baseline Prepared',
  releaseName: `EOS Alpha ${version} - Genesis`,
  generatedAt,
  releaseNotes: releaseNotesFile,
  releaseArtifact: releaseArtifactFile,
  tagTarget: `v${version}`,
  verification: {
    lint: 'passed',
    build: 'passed',
    test: 'passed',
    backup: 'passed'
  },
  git: {
    initialized: snapshot.initialized,
    branch: snapshot.branch,
    latestCommit: snapshot.latestCommit,
    latestTag: snapshot.latestTag,
    uncommittedChangeCount: snapshot.uncommittedChanges.length,
    uncommittedChanges: snapshot.uncommittedChanges
  },
  nextSteps: ['Review release manifest', 'Create a commit', 'Run npm run eos:tag after a release commit exists']
};

await mkdir(releasesDir, { recursive: true });
await writeFile(join(releasesDir, 'RELEASE-MANIFEST.json'), `${JSON.stringify(manifest, null, 2)}\n`);
await writeFile(join(releasesDir, releaseNotesFile), releaseNotes(version, snapshot, generatedAt));

console.log(`EOS release prepared for v${version}.`);
console.log(`Manifest: docs/releases/RELEASE-MANIFEST.json`);
console.log(`Release notes: docs/releases/${releaseNotesFile}`);
console.log('No GitHub push was performed.');
