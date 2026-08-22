import assert from 'node:assert/strict';
import test from 'node:test';

import {
  parseGitPorcelainPaths,
  pathAllowed
} from '../scripts/eos-git-status-paths.js';

test('preserves the first path character for an unstaged modification', () => {
  const paths = parseGitPorcelainPaths(' M package.json\n');
  assert.deepEqual(paths, ['package.json']);
  assert.equal(pathAllowed(paths[0], ['package.json']), true);
});

test('parses multiple modified and untracked paths without trimming status columns', () => {
  const paths = parseGitPorcelainPaths(
    ' M package.json\n?? scripts/eos-operator-narration.js\n' +
      '?? tests/operator-narration-foundation.test.js\n'
  );
  assert.deepEqual(paths, [
    'package.json',
    'scripts/eos-operator-narration.js',
    'tests/operator-narration-foundation.test.js'
  ]);
});

test('uses the destination path for a porcelain rename record', () => {
  assert.deepEqual(
    parseGitPorcelainPaths('R  scripts/old.js -> scripts/new.js\n'),
    ['scripts/new.js']
  );
});

test('allows exact paths and descendants but refuses sibling prefixes', () => {
  assert.equal(pathAllowed('scripts/tool.js', ['scripts/tool.js']), true);
  assert.equal(pathAllowed('scripts/tool.js/file', ['scripts/tool.js']), true);
  assert.equal(pathAllowed('scripts/tool.js-evil', ['scripts/tool.js']), false);
});

test('refuses malformed porcelain lines', () => {
  assert.throws(
    () => parseGitPorcelainPaths('M package.json\n'),
    /Invalid Git porcelain status line/
  );
});
