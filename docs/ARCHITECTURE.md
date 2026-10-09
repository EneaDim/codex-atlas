# Architecture and repository structure

This document explains how Codex Atlas is organized and where each responsibility lives.

## Live Codex

| Pack | Site |
| --- | --- |
| `human-body` | https://codex-human-body.up.railway.app |
| `finance` | https://codex-finance.up.railway.app |
| `home` | https://codex-home.up.railway.app |
| `statistics` | https://codex-statistics.up.railway.app |
| `climate` | https://codex-climate.up.railway.app |
| `survival` | https://codex-survival.up.railway.app |
| `nutrition` | https://codex-nutrition.up.railway.app |

## Design principle

> **One renderer, many content packs.**

Human Body, Finance, Home, Statistics, Climate, Survival and Nutrition share the same application code. A new Codex should normally be added as a new pack, not as a copy of the UI.

## Repository map

```text
codex-atlas/
├── README.md
├── index.html
├── package.json
├── server.mjs
├── railway.json
├── release.sh
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── CONTENT_PACKS.md
│   ├── DEVELOPMENT.md
│   ├── RELEASE.md
│   ├── RAILWAY_CLI.md
│   └── STATISTICS_COURSE.md
│
├── public/
│   └── images/
│       ├── human-body/center.webp
│       ├── finance/center.svg
│       ├── home/
│       │   └── center.svg
│       ├── statistics/center.svg
│       ├── climate/center.svg
│       ├── survival/center.svg
│       └── nutrition/center.svg
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
    │   ├── math.js
    │   ├── viewport.js
    │   └── wikipedia.js
    ├── packs/
    │   ├── builders.js
    │   ├── registry.js
    │   ├── human-body.js
    │   ├── finance.js
    │   ├── home.js
    │   ├── statistics.js
    │   ├── climate.js
    │   ├── survival.js
    │   └── nutrition.js
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
             ├─ src/core/math.js
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
npm run dev:statistics
npm run dev:climate
npm run dev:survival
npm run dev:nutrition
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

### `math.js`

Loads MathJax-backed typesetting for lesson formulas and examples. If the external renderer is unavailable, the UI falls back to readable TeX text.

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
- `statistics.js` — Statistics course map with short explanations, formulas, term legends and worked examples.
- `climate.js` — Climate system, physical climate science, impacts, mitigation and adaptation.
- `survival.js` — Preparedness, shelter, water, navigation, first aid and emergency principles.
- `nutrition.js` — Nutrients, digestion, metabolism, dietary patterns, food safety and nutrition evidence.

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
## Navigation model

The shared renderer supports two complementary navigation modes:

- **Explore** keeps the radial map as the primary interface. Domains and systems are clickable and their detail panel exposes the full descendant hierarchy down to concept leaves.
- **Learn** uses the same taxonomy as a folder-style learning library: domain folders → system folders → concept lessons. The radial map remains available in the background and breadcrumbs allow moving back up the hierarchy.

The viewport supports mouse/trackpad zoom and two-finger pinch up to 800%. Concept leaf hit areas are intentionally tighter than parent branches to reduce overlap in dense outer rings.

