import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('executor requests individual untracked files from Git porcelain', async () => {
  const source = await readFile(
    new URL('../scripts/eos-mission-execute.js', import.meta.url),
    'utf8'
  );
  const matches = source.match(/--untracked-files=all/g) ?? [];
  assert.equal(matches.length, 1);
  assert.match(
    source,
    /run\(\s*'git',\s*\[\s*'status',\s*'--porcelain',\s*'--untracked-files=all'\s*\]\s*\)/
  );
});
