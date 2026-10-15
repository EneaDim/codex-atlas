import assert from 'node:assert/strict';
import { PACKS } from '../src/packs/registry.js';
import { flattenPack } from '../src/core/layout.js';
import { LANGUAGES, localized, t } from '../src/core/i18n.js';
import { semanticSearch } from '../src/core/search.js';

assert.deepEqual(LANGUAGES, ['it', 'en', 'es']);

const requiredUi = [
  'explore', 'learn', 'learningLibrary', 'interactiveMap', 'mapHint', 'searchPlaceholder',
  'resetView', 'aboutTitle', 'aboutCopy', 'wikiLoading', 'openFullArticle', 'contents',
  'learnLibrary', 'subfolders', 'lessons', 'formula', 'meaningTerms', 'example',
  'semanticAll', 'noSemanticResults', 'practicalResources', 'roleDomain', 'roleSystem', 'roleConcept',
];
for (const key of requiredUi) {
  for (const lang of LANGUAGES) assert.notEqual(t(key, lang), key, `Missing UI copy ${key}:${lang}`);
}

for (const [packId, pack] of Object.entries(PACKS)) {
  for (const field of ['title', 'subtitle', 'centerLabel']) {
    assert.ok(localized(pack[field], 'es'), `${packId}.${field}.es missing`);
  }
  for (const domain of pack.domains) {
    assert.ok(domain.title?.es, `${packId}:${domain.id}.title.es missing`);
    assert.ok(domain.description?.es, `${packId}:${domain.id}.description.es missing`);
    for (const system of domain.systems) {
      assert.ok(system.title?.es, `${packId}:${system.id}.title.es missing`);
      assert.ok(system.description?.es, `${packId}:${system.id}.description.es missing`);
      for (const concept of system.concepts) {
        assert.ok(concept.title?.es, `${packId}:${concept.id}.title.es missing`);
      }
    }
  }
  for (const node of flattenPack(pack)) {
    assert.ok(localized(node.title, 'es'), `${packId}:${node.id} Spanish title missing after flatten`);
    if (node.description) assert.ok(localized(node.description, 'es'), `${packId}:${node.id} Spanish description missing after flatten`);
  }
}

const spanishQueries = [
  ['inflamación', 'human-body:inflammation'],
  ['probabilidad inversa', 'statistics:stat-bayes-formula'],
  ['dinero pierde valor', 'finance:inflation'],
  ['aire retiene calor', 'climate:greenhouse-effect'],
];
for (const [query, expected] of spanishQueries) {
  const results = semanticSearch(query, { language: 'es', limit: 10 });
  assert.ok(results.some((result) => result.key === expected), `Spanish semantic search failed for: ${query}`);
}

console.log('Spanish localization tests passed.');
