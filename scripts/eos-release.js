import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { backupStatusFile, rootDir, runCommand } from './eos-common.js';
import { getCurrentVersion, getGitSnapshot } from './eos-git-utils.js';

const releasesDir = join(rootDir, 'docs', 'releases');

async function readJson(file, fallback) {
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function releaseNotes(version, snapshot, backupStatus, generatedAt) {
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

## Backup Status

- Last Backup: ${backupStatus.latestBackupLocalTime ?? 'Unavailable'} (${backupStatus.latestBackupTimestamp ?? 'Unavailable'})
- Backup Status: ${backupStatus.latestBackupStatus ?? 'Unavailable'}
- Backup Count: ${backupStatus.backupCount ?? 0}
- Latest Archive: ${backupStatus.latestBackupArchive ?? 'Unavailable'} (${backupStatus.latestBackupSize ?? 0} bytes)
- Data Included: ${backupStatus.latestBackupDataIncluded === false ? 'No' : 'Yes'}
- Restore Validation: ${backupStatus.latestRestoreValidationStatus ?? 'Not validated'}

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
const backupStatus = await readJson(backupStatusFile, {});
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
  backupStatus: {
    latestBackupTimestamp: backupStatus.latestBackupTimestamp ?? null,
    latestBackupLocalTime: backupStatus.latestBackupLocalTime ?? null,
    latestBackupVersion: backupStatus.latestBackupVersion ?? null,
    latestBackupArchive: backupStatus.latestBackupArchive ?? null,
    latestBackupSize: backupStatus.latestBackupSize ?? null,
    latestBackupChecksum: backupStatus.latestBackupChecksum ?? null,
    latestBackupStatus: backupStatus.latestBackupStatus ?? null,
    latestBackupDataIncluded: backupStatus.latestBackupDataIncluded ?? null,
    latestRestoreValidationStatus: backupStatus.latestRestoreValidationStatus ?? null,
    backupCount: backupStatus.backupCount ?? 0,
    lastUpdated: backupStatus.lastUpdated ?? null
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
await writeFile(join(releasesDir, releaseNotesFile), releaseNotes(version, snapshot, backupStatus, generatedAt));

console.log(`EOS release prepared for v${version}.`);
console.log(`Manifest: docs/releases/RELEASE-MANIFEST.json`);
console.log(`Release notes: docs/releases/${releaseNotesFile}`);
console.log(`Backup Status: ${backupStatus.latestBackupStatus ?? 'Unavailable'}`);
console.log(`Latest Archive: ${backupStatus.latestBackupArchive ?? 'Unavailable'}`);
console.log(`Backup Data Included: ${backupStatus.latestBackupDataIncluded === false ? 'No' : 'Yes'}`);
console.log(`Restore Validation: ${backupStatus.latestRestoreValidationStatus ?? 'Not validated'}`);
console.log('No GitHub push was performed.');
