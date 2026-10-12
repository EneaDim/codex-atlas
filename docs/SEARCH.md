# Semantic search

Codex Atlas uses one shared semantic search across all registered content packs.

The search is intentionally local and deterministic: it does **not** require an API key, a cloud embedding service or a second backend. This keeps search fast on desktop and mobile and avoids sending the user's query to an external AI service.

## How it works

`src/core/search.js` builds an in-browser index from every registered pack. Ranking combines:

- Italian and English titles;
- descriptions;
- domain and system context;
- Wikipedia target names;
- optional `aliases` and `searchTerms` attached to concepts;
- fuzzy token similarity;
- curated semantic relations for queries where the wording can differ strongly from the concept title.

Search results can therefore come from the current Codex or from another Codex. A cross-pack result opens the corresponding production site directly on the selected node.

## Canonical-content rule

A concept should have **one canonical home**. Do not copy the same definition into several packs just because it has applications in several subjects.

Example: **inflammation**.

- canonical concept: `human-body` → Defense & Protection → Immune system → Inflammation;
- `nutrition`: related dietary concepts can be surfaced when the query concerns nutrition and inflammation;
- `survival`: wound care is a contextual first-aid concept and can be surfaced for queries such as “ferita gonfia” or “segni di infezione”.

This keeps the Atlas ordered while still making overlapping subjects discoverable.

## Content metadata

A concept may optionally add multilingual semantic metadata:

```js
{
  id: 'example',
  title: { en: 'Example', it: 'Esempio' },
  aliases: {
    en: ['alternate wording'],
    it: ['modo alternativo di dirlo'],
  },
  searchTerms: {
    en: ['natural-language query'],
    it: ['domanda in linguaggio naturale'],
  },
}
```

Use these fields for genuine alternate wording or context. Do not stuff unrelated keywords into a concept.

## Validation

Semantic regression tests live in `scripts/search-test.mjs` and run inside:

```bash
npm run check
```

The tests cover natural-language searches such as inflation as “money losing value”, the greenhouse effect as “air trapping heat”, Bayes as inverse probability and inflammation across Human Body, Nutrition and Survival.
