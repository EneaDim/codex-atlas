# Content packs

A content pack is a JavaScript object consumed by the shared radial renderer.

## Pack shape

```js
export const example = {
  id: 'example',
  title: { en: 'Example Codex', it: 'Codex di Esempio' },
  centerLabel: { en: 'EXAMPLE', it: 'ESEMPIO' },
  subtitle: { en: '...', it: '...' },
  centerImage: '/public/images/example/center.svg',
  domains: [/* ... */],
};
```

Hierarchy:

```text
pack
└── domains[]
    └── systems[]
        └── concepts[]
```

Every domain, system and concept must have a unique `id` across the entire pack. `src/core/layout.js` validates this at startup.

## Core fields

A domain normally contains:

```js
{
  id: 'markets',
  title: { en: 'Markets', it: 'Mercati' },
  description: { en: '...', it: '...' },
  color: '#4A8DB7',
  systems: []
}
```

A system contains `id`, localized `title`, localized `description` and `concepts`.

A concept normally contains:

```js
{
  id: 'example-concept',
  title: { en: 'Example concept', it: 'Concetto di esempio' },
  wiki: {
    en: 'Wikipedia article title',
    it: 'Titolo voce Wikipedia'
  }
}
```

The renderer loads the Wikipedia introduction first for concept previews/details.

## Practical metadata

The shared renderer also understands:

```js
{
  difficulty: 'easy',      // easy | moderate | pro
  risk: 'low',             // low | medium | high
  resources: [
    {
      type: 'official',    // official | safety | tutorial | manual
      title: { en: '...', it: '...' },
      source: 'Source name',
      url: 'https://...'
    }
  ]
}
```

Domains and systems may also define these fields. Concepts inherit applicable metadata/resources; concept-level values can be more specific.

High-risk content should explain systems and warning signs rather than turn professional work into a DIY procedure.

## Adding a new Codex

Suppose the new pack is `economics`.

1. Create `src/packs/economics.js`.
2. Add `economics` to `PACK_IDS` in `src/packs/manifest.js`.
3. Import/register it in `src/packs/index.js`.
4. Add its artwork at `public/images/economics/center.svg` (or `.webp`).
5. Set the pack's `centerImage` to that public path.
6. Run `npm run check`.
7. Test locally with:

```bash
CODEX_PACK=economics npm run dev
```

8. On Railway create another service from the same repository and set:

```text
CODEX_PACK=economics
```

No renderer copy is necessary.

## Editing guidance

Prefer content changes in pack files and shared behavior changes in `src/core/`. If a feature is useful for more than one Codex, implement it in the shared renderer rather than embedding UI code in a pack.
