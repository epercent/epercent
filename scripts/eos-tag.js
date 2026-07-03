import { getCurrentVersion, getGitSnapshot, isGitInitialized, runGit, tagExists } from './eos-git-utils.js';

const initialized = await isGitInitialized();

if (!initialized) {
  console.error('Cannot create an EOS tag because Git is not initialized.');
  process.exit(1);
}

const version = await getCurrentVersion();
const tagName = `v${version}`;

if (!/^\d+\.\d+\.\d+$/.test(version)) {
  console.error(`Cannot create tag ${tagName}. EOS version must be semantic version format.`);
  process.exit(1);
}

if (await tagExists(tagName)) {
  console.error(`Tag ${tagName} already exists. Duplicate tags are not allowed.`);
  process.exit(1);
}

const snapshot = await getGitSnapshot();

if (snapshot.latestCommit === 'No commits yet') {
  console.error(`Cannot create tag ${tagName} because the repository has no commits yet.`);
  console.error('Create a release commit first, then run npm run eos:tag.');
  process.exit(1);
}

const result = await runGit(['tag', '-a', tagName, '-m', `EOS ${tagName}`]);

if (result.code !== 0) {
  console.error(result.stderr || `Failed to create tag ${tagName}.`);
  process.exit(result.code);
}

console.log(`Created EOS release tag: ${tagName}`);
