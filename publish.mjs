// Copies the playable web build (prototype/dist at the game repo's HEAD) into docs/, which GitHub Pages serves.
// Only committed files go out, so work in progress in the game folder is never published.
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const source = process.argv[2];
if (!source) {
  console.error('usage: node publish.mjs <game repo path>');
  process.exit(1);
}
const git = (...args) => execFileSync('git', ['-C', source, ...args], { maxBuffer: 1 << 28 });
const prefix = 'prototype/dist/';
// QA review pages and image prompts are working material, not part of the game.
const excluded = path => path.startsWith('qa-motion') || path.endsWith('.txt');

const commit = git('rev-parse', '--short', 'HEAD').toString().trim();
const docs = fileURLToPath(new URL('./docs/', import.meta.url));
rmSync(docs, { recursive: true, force: true });
let count = 0;
for (const path of git('ls-tree', '-r', '-z', '--full-tree', '--name-only', 'HEAD', '--', prefix).toString().split('\0')) {
  const relative = path.slice(prefix.length);
  if (!path || excluded(relative)) continue;
  const target = join(docs, relative);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, git('cat-file', 'blob', `HEAD:${path}`));
  count++;
}
// Serve the files as they are instead of running them through Jekyll.
writeFileSync(join(docs, '.nojekyll'), '');
console.log(`docs/ <- ${count} files from game commit ${commit}`);
