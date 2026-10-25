// Copies the playable web build (prototype/dist at the game repo's HEAD) into docs/, which GitHub Pages serves.
// Only committed files go out, so work in progress in the game folder is never published.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
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
if (relative(fileURLToPath(new URL('./', import.meta.url)), docs) !== 'docs') {
  throw new Error('Publish target must be this repository’s docs/ directory.');
}
// docs/layout.json (page layout) and docs/tree.json (무공록 tree) are saved from the edit tools on the site
// (committed by them); keep them.
const layoutFile = join(docs, 'layout.json'), treeFile = join(docs, 'tree.json');
let layout = null, tree = null;
try { layout = readFileSync(layoutFile); } catch {}
try { tree = readFileSync(treeFile); } catch {}
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
for (const file of ['ui-editor.js', 'ui-editor.css', 'tree-editor.js', 'tree-editor.css']) {
  writeFileSync(join(docs, file), readFileSync(new URL(`./editor/${file}`, import.meta.url)));
}
writeFileSync(treeFile, tree || `${JSON.stringify({ version: 1, nodes: {}, added: [], removed: [], links: { add: [], remove: [] } }, null, 2)}\n`);
writeFileSync(layoutFile, layout ||`${JSON.stringify({ version: 3, wide: { parts: {}, added: [], seq: 0 }, narrow: { parts: {}, added: [], seq: 0 } }, null, 2)}\n`);
const index = join(docs, 'index.html');
let html = readFileSync(index, 'utf8').replace('</head>', () =>
  '  <script>document.documentElement.classList.add(\'uie-loading\')</script>\n' +
  '  <link rel="stylesheet" href="ui-editor.css">\n  <link rel="stylesheet" href="tree-editor.css">\n' +
  '  <script src="ui-editor.js" defer></script>\n  <script src="tree-editor.js" defer></script>\n</head>');
// GitHub Pages lets browsers keep files for 10 minutes. Each script and stylesheet address carries a hash of
// its content, so a new deploy is fetched fresh and never mixed with old cached files.
writeFileSync(index, html);
// Version the rehearsal's own dependencies before hashing its lazy iframe URL in index.html.
const pages = readdirSync(docs).filter(file => file.endsWith('.html'))
  .sort((a, b) => Number(a === 'index.html') - Number(b === 'index.html'));
for (const page of pages) {
  const filename = join(docs, page);
  const content = readFileSync(filename, 'utf8').replace(
    /(href|src|data-namgung-src)="([^":?#]+\.(?:css|js|html))(\?[^"#]*)?"/g,
    (match, attr, file, query = '') => {
      if (file.endsWith('.html') && attr !== 'data-namgung-src') return match;
      const version = createHash('sha256').update(readFileSync(join(docs, file))).digest('hex').slice(0, 10);
      const params = new URLSearchParams(query.slice(1)); params.set('v', version);
      return `${attr}="${file}?${params}"`;
    }
  );
  writeFileSync(filename, content);
}
// Serve the files as they are instead of running them through Jekyll.
writeFileSync(join(docs, '.nojekyll'), '');
console.log(`docs/ <- ${count} files from game commit ${commit}`);
