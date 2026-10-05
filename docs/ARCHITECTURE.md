# Architecture and repository structure

This document explains how Codex Atlas is organized and where each responsibility lives.

## Design principle

> **One renderer, many content packs.**

Human Body, Finance and Home share the same application code. A new Codex should normally be added as a new pack, not as a copy of the UI.

## Repository map

```text
codex-atlas/
├── README.md
├── index.html
├── package.json
├── server.mjs
├── railway.json
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── CONTENT_PACKS.md
│   ├── DEVELOPMENT.md
│   └── RAILWAY_CLI.md
│
├── public/
│   └── images/
│       ├── human-body/center.webp
│       ├── finance/center.svg
│       └── home/center.svg
│
├── scripts/
│   ├── audit.mjs
│   └── validate.mjs
│
└── src/
    ├── main.js
    ├── core/
    │   ├── app.js
    │   ├── constants.js
    │   ├── dom.js
    │   ├── layout.js
    │   ├── viewport.js
    │   └── wikipedia.js
    ├── packs/
    │   ├── builders.js
    │   ├── registry.js
    │   ├── human-body.js
    │   ├── finance.js
    │   └── home.js
    └── styles/
        ├── main.css
        ├── base.css
        └── light.css
```


## Source-language policy

The current application runtime is intentionally **JavaScript-only**.

Canonical source files live under `src/` as `.js` modules. Old TypeScript prototypes such as
`src/main.ts`, `src/content/`, `src/core/model.ts`, `src/core/radial.ts`,
`src/core/viewport.ts` and `src/core/wikipedia.ts` are legacy and must not coexist with the
current implementation.

`npm run audit` enforces this rule and fails if TypeScript source reappears under `src/`.

## Runtime flow

```text
Browser request
    ↓
server.mjs
    ├─ serves static files
    └─ creates /runtime-config.js from CODEX_PACK
             ↓
          index.html
             ↓
          src/main.js
             ↓
        src/core/app.js
             ├─ src/packs/registry.js
             ├─ src/core/layout.js
             ├─ src/core/viewport.js
             ├─ src/core/wikipedia.js
             └─ src/styles/main.css
```

## Root files

### `README.md`

Short public-facing introduction to the project, live sites and local setup. Implementation details intentionally live under `docs/` instead.

### `index.html`

Minimal browser shell. It loads the runtime configuration, CSS and browser entry point.

### `server.mjs`

Small Node HTTP server. It reads `PORT` and `CODEX_PACK`, generates `/runtime-config.js`, serves static files and handles cache/compression headers.

### `package.json`

Project metadata and local scripts:

```bash
npm run dev:human-body
npm run dev:finance
npm run dev:home
npm run check
```

### `railway.json`

Current Railway configuration. Railway-specific deployment and migration notes are documented in [RAILWAY_CLI.md](RAILWAY_CLI.md).

## `src/core/`

Shared application behavior.

### `app.js`

Main UI controller and renderer: radial map, Explore/Learn modes, search, concept previews, drawers, language switching, themes and practical Home resources.

### `constants.js`

Shared geometry and renderer constants.

### `dom.js`

Reusable DOM and SVG helpers.

### `layout.js`

Transforms pack data into the radial hierarchy, calculates positions and validates content IDs.

### `viewport.js`

Camera and gesture behavior: drag, wheel/trackpad zoom, one-finger pan and two-finger pinch.

### `wikipedia.js`

Loads and caches Wikipedia introductory extracts, including language fallback behavior.

## `src/packs/`

Subject-specific content.

- `registry.js` — the single source of truth for available packs, the default pack and pack lookup.
- `builders.js` — small shared constructors used by compact data packs to avoid repeating object boilerplate.
- `human-body.js` — Human Body content.
- `finance.js` — Finance content.
- `home.js` — Home / Casa Pratica content, practical metadata and resources.

Pack files should contain **content**, not renderer logic. Pack IDs are registered only once, in `registry.js`.

## `scripts/`

Repository quality tooling. `validate.mjs` checks pack IDs, localized titles, duplicate node IDs and artwork paths; `audit.mjs` detects exact duplicate files and known legacy paths. Both run as part of `npm run check`.

## `src/styles/`

Shared visual system.

- `main.css` — CSS entry point.
- `base.css` — dark theme, components and responsive/mobile behavior.
- `light.css` — light-mode overrides.

## `public/images/`

Central artwork for each content pack. The preferred convention is:

```text
public/images/<pack-id>/center.<ext>
```

## Where changes should go

| Change | Location |
| --- | --- |
| Add/edit concepts | `src/packs/` |
| Change radial geometry | `src/core/layout.js` / `constants.js` |
| Change pan/zoom/touch | `src/core/viewport.js` |
| Change Wikipedia loading | `src/core/wikipedia.js` |
| Change UI behavior | `src/core/app.js` |
| Change appearance | `src/styles/` |
| Change server/runtime pack selection | `server.mjs`, `src/packs/registry.js` |
| Change Railway deployment | Railway config + `docs/RAILWAY_CLI.md` |


## Duplication policy

Keep one canonical location for each concern:

- subject content lives only in `src/packs/`;
- each pack has one central artwork under `public/images/<pack-id>/`;
- pack registration lives only in `src/packs/registry.js`;
- content authoring guidance lives in `docs/CONTENT_PACKS.md`;
- repository structure lives in this document.

Do not keep legacy copies of moved files “just in case”; Git history is the backup.
