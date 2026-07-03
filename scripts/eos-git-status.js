import { getCurrentVersion, getGitSnapshot } from './eos-git-utils.js';

const version = await getCurrentVersion();
const snapshot = await getGitSnapshot();

console.log('EOS Git Status');
console.log('--------------');
console.log(`Git Initialized: ${snapshot.initialized ? 'Yes' : 'No'}`);
console.log(`Current Branch: ${snapshot.branch}`);
console.log(`Latest Commit: ${snapshot.latestCommit}`);
console.log(`Uncommitted Changes: ${snapshot.uncommittedChanges.length}`);

if (snapshot.uncommittedChanges.length > 0) {
  for (const change of snapshot.uncommittedChanges) {
    console.log(`- ${change}`);
  }
}

console.log(`Current EOS Version: ${version}`);
console.log(`Latest Tag: ${snapshot.latestTag}`);
