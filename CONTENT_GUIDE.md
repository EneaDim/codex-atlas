# Content guide

The renderer expects this hierarchy:

```text
Domain
  └─ System
       └─ Concept
```

Each domain controls one color family and one main trunk leaving the center. Systems branch from the domain trunk. Concepts become the outer leaves.

The outer domain callouts are deliberately detached from the tree, matching the reference-codex composition.

For a new Codex, keep the renderer and replace the data pack. A concept only needs:

```js
{
  id: 'heart',
  title: { en: 'Heart', it: 'Cuore' },
  wiki: { en: 'Heart', it: 'Cuore' }
}
```

Wikipedia abstracts are loaded live on hover, so you do not need to duplicate encyclopedia prose in the repository.


## Practical resource metadata

Packs may add `difficulty`, `risk`, and `resources` to systems or concepts. Concepts inherit missing values and resources from their parent system/domain.

```js
{
  difficulty: 'easy', // easy | moderate | pro
  risk: 'low',        // low | medium | high
  resources: [
    { type: 'tutorial', title: { en: '...', it: '...' }, url: 'https://...', source: '...' }
  ]
}
```

Use `high`/`pro` for work that should be handled by a qualified professional. Prefer official technical bodies and manufacturer documentation for safety-critical subjects.
