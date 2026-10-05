import { createHash } from 'node:crypto';
import { readdir, readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, relative } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const ignoredDirectories = new Set(['.git', 'node_modules']);
const legacyPaths = [
  'CONTENT_GUIDE.md',
  'docs/PROJECT.md',
  'public/images/finance-center.svg',
  'public/images/home-center.svg',
  'src/packs/index.js',
  'src/packs/manifest.js',
  'src/data/human-body.js',
  'src/data/finance.js',
  'src/data/home.js',
  'src/content/human-body.js',
  'src/content/finance.js',
  'src/content/home.js',
];

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const absolute = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolute));
    else if (entry.isFile()) files.push(absolute);
  }
  return files;
}

const files = await walk(root);
const byHash = new Map();
for (const file of files) {
  const digest = createHash('sha256').update(await readFile(file)).digest('hex');
  const paths = byHash.get(digest) ?? [];
  paths.push(relative(root, file));
  byHash.set(digest, paths);
}

const duplicates = [...byHash.values()].filter((paths) => paths.length > 1);
const stale = [];
for (const path of legacyPaths) {
  try {
    if ((await stat(join(root, path))).isFile()) stale.push(path);
  } catch {}
}

if (duplicates.length || stale.length) {
  if (duplicates.length) {
    console.error('Exact duplicate files:');
    duplicates.forEach((paths) => console.error(`  - ${paths.join(' = ')}`));
  }
  if (stale.length) {
    console.error('Legacy paths that should not exist:');
    stale.forEach((path) => console.error(`  - ${path}`));
  }
  process.exit(1);
}

console.log(`Repository audit passed: ${files.length} files, no exact duplicates or known legacy paths.`);
