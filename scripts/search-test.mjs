import assert from 'node:assert/strict';
import { semanticSearch } from '../src/core/search.js';

function keys(query, currentPackId = 'human-body', language = 'it') {
  return semanticSearch(query, { currentPackId, language, limit: 10 }).map((result) => result.key);
}

function expectResult(query, expected, currentPackId = 'human-body') {
  const results = keys(query, currentPackId);
  assert.ok(results.includes(expected), `${JSON.stringify(query)} should include ${expected}; got ${results.join(', ')}`);
}

expectResult('infiammazione', 'human-body:inflammation', 'nutrition');
expectResult('dieta antinfiammatoria', 'nutrition:mediterranean-diet', 'nutrition');
expectResult('ferita gonfia', 'survival:wound-care', 'survival');
expectResult('soldi perdono valore', 'finance:inflation', 'finance');
expectResult('aria trattiene calore', 'climate:greenhouse-effect', 'climate');
expectResult('dispersione intorno alla media', 'statistics:stat-variance-definition', 'statistics');
expectResult('probabilita inversa', 'statistics:stat-bayes-formula', 'statistics');

console.log('Semantic search tests passed.');
