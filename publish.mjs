// Copies the playable web build (prototype/dist at the game repo's HEAD) into docs/, which GitHub Pages serves.
// Only committed files go out, so work in progress in the game folder is never published.
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
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
// docs/layout.json is the layout saved from the edit tool on the site (committed by it); keep it.
const layoutFile = join(docs, 'layout.json');
let layout = null;
try { layout = readFileSync(layoutFile); } catch {}
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
// The page edit tool lives in this repo (editor/) and is added to the game's page here. The page stays
// hidden (at most 1.5s) until the saved layout is applied, so visitors do not see parts jump.
for (const file of ['ui-editor.js', 'ui-editor.css']) {
  writeFileSync(join(docs, file), readFileSync(new URL(`./editor/${file}`, import.meta.url)));
}
writeFileSync(layoutFile, layout || `${JSON.stringify({ version: 3, wide: { parts: {}, added: [], seq: 0 }, narrow: { parts: {}, added: [], seq: 0 } }, null, 2)}\n`);
const index = join(docs, 'index.html');
writeFileSync(index, readFileSync(index, 'utf8').replace('</head>', () =>
  '  <script>document.documentElement.classList.add(\'uie-loading\')</script>\n' +
  '  <link rel="stylesheet" href="ui-editor.css">\n  <script src="ui-editor.js" defer></script>\n</head>'));
// Serve the files as they are instead of running them through Jekyll.
writeFileSync(join(docs, '.nojekyll'), '');
console.log(`docs/ <- ${count} files from game commit ${commit}`);
