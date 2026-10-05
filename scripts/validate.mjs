import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { assertUniqueIds, flattenPack } from '../src/core/layout.js';
import { PACKS } from '../src/packs/registry.js';

const root = fileURLToPath(new URL('../', import.meta.url));

function requireLocalized(value, label) {
  if (!value?.en || !value?.it) throw new Error(`${label} must define both en and it`);
}

for (const [id, pack] of Object.entries(PACKS)) {
  if (pack.id !== id) throw new Error(`Registry key "${id}" does not match pack.id "${pack.id}"`);
  requireLocalized(pack.title, `${id}.title`);
  requireLocalized(pack.subtitle, `${id}.subtitle`);
  if (!Array.isArray(pack.domains) || !pack.domains.length) throw new Error(`${id} has no domains`);

  const nodes = flattenPack(pack);
  assertUniqueIds(nodes);
  nodes.forEach((node) => requireLocalized(node.title, `${id}:${node.id}.title`));

  const imagePath = join(root, pack.centerImage.replace(/^\//, ''));
  if (!existsSync(imagePath)) throw new Error(`${id} center image is missing: ${pack.centerImage}`);

  const systems = nodes.filter((node) => node.role === 'system').length;
  const concepts = nodes.filter((node) => node.role === 'concept').length;
  console.log(`${id}: ${pack.domains.length} domains, ${systems} systems, ${concepts} concepts`);
}

console.log('Codex Atlas validation passed.');
