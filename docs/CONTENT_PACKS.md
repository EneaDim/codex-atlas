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


## Academic study metadata

The `statistics` pack uses course-note content instead of Wikipedia-first concept cards.

A study concept may define:

```js
{
  description: { en: 'Two-line explanation...', it: 'Spiegazione in due righe...' },
  study: {
    summary: { en: '...', it: '...' },
    source: { en: 'Chapter 3 · course notebook', it: 'Capitolo 3 · notebook del corso' },
    formulas: [
      {
        title: { en: 'Formula', it: 'Formula' },
        tex: String.raw`P(F\mid E)=\frac{P(E\cap F)}{P(E)}`
      }
    ],
    terms: [
      {
        symbol: String.raw`P(F\mid E)`,
        label: { en: 'probability of F given E', it: 'probabilità di F dato E' }
      }
    ],
    example: {
      title: { en: 'Example', it: 'Esempio' },
      body: { en: '...', it: '...' },
      tex: String.raw`\frac7{25}=0.28`
    }
  }
}
```

The shared renderer displays, in order:

1. a short explanation;
2. rendered formulas;
3. the meaning of symbols/terms;
4. a worked example;
5. an optional note.

Formulas are written in LaTeX and rendered in the browser with MathJax.

## Adding a new Codex

Suppose the new pack is `economics`.

1. Create `src/packs/economics.js`.
2. Import it and add it once to `PACKS` in `src/packs/registry.js`.
3. Add its artwork at `public/images/economics/center.svg` (or `.webp`).
4. Set the pack's `centerImage` to that public path.
5. Run `npm run check`.
6. Test locally with:

```bash
CODEX_PACK=economics npm run dev
```

7. On Railway create another service from the same repository and set:

```text
CODEX_PACK=economics
```

No renderer copy is necessary.

## Editing guidance

Prefer content changes in pack files and shared behavior changes in `src/core/`. If a feature is useful for more than one Codex, implement it in the shared renderer rather than embedding UI code in a pack.
