# Architecture and repository structure

This document describes where things live and why.

## Runtime flow

```text
Browser request
    ↓
server.mjs
    ├─ serves static files
    └─ generates /runtime-config.js from CODEX_PACK
             ↓
          index.html
             ↓
          src/main.js
             ↓
        src/core/app.js
             ├─ src/packs/index.js → selected content pack
             ├─ src/core/layout.js → radial positions
             ├─ src/core/viewport.js → pan / zoom / pinch
             ├─ src/core/wikipedia.js → concept intros
             └─ src/styles/main.css → dark + light UI
```

The key design rule is **one renderer, many packs**. Do not duplicate the UI to create a new site.

## Root files

### `index.html`

Minimal browser shell. It initializes the saved theme before CSS paints, loads `/runtime-config.js`, then starts `src/main.js`.

### `server.mjs`

Small Node HTTP server. It:

- reads `PORT` from Railway or defaults to `4173` locally;
- validates `CODEX_PACK` against `src/packs/manifest.js`;
- exposes the selected pack as `/runtime-config.js`;
- serves static assets;
- caches files in memory;
- gzip-compresses text assets;
- uses longer cache headers for images.

### `package.json`

Contains all supported local commands. There are no runtime dependencies.

### `railway.json`

Current Railway Config-as-Code file. It is still used by the existing deployment but Railway marks this format as deprecated. Migration is documented separately so repository cleanup does not change infrastructure behavior at the same time.

## `src/core/`

### `app.js`

The main renderer/controller. It owns UI state and behavior:

- render radial branches, nodes, labels and center artwork;
- Explore and Learn modes;
- search;
- selection/drawer logic;
- hover preview lifecycle;
- theme and language controls;
- practical Home badges/resources;
- URL synchronization.

Keep pack-specific facts out of this file whenever possible.

### `constants.js`

Shared geometry constants such as center/domain/system/concept radii.

### `dom.js`

Small reusable helpers for DOM lookup, SVG element creation, escaping and delay.

### `layout.js`

Transforms nested pack content into renderer-ready nodes and computes radial angles. It also validates duplicate IDs and merges inherited practical resources/risk metadata.

### `viewport.js`

All camera behavior:

- wheel/trackpad zoom;
- mouse drag;
- one-finger pan;
- two-finger pinch;
- click suppression after a gesture;
- reset/focus behavior.

### `wikipedia.js`

Loads Wikipedia intro extracts, caches them in memory and falls back from Italian to English where appropriate.

## `src/packs/`

### `manifest.js`

The single list of valid pack IDs and the default pack. Both browser/server infrastructure depend on this list.

### `index.js`

Imports the pack datasets and maps IDs to data objects.

### `human-body.js`, `finance.js`, `home.js`

Content only. A pack should describe its title, center image, domains, systems and concepts. It should not contain renderer logic.

## `src/styles/`

### `main.css`

Single CSS entry point imported by `index.html`.

### `base.css`

Default dark theme, components, map styling and responsive/mobile behavior.

### `light.css`

Light-mode overrides that restore the original white / soft blue-orange visual language.

## `public/images/`

Artwork is grouped by pack:

```text
public/images/<pack-id>/center.<ext>
```

This avoids a flat asset directory as more Codex packs are added.

## Boundaries to preserve

When changing the project, keep these responsibilities separate:

- content facts → `src/packs/`
- map geometry/data transformation → `src/core/layout.js`
- gestures/camera → `src/core/viewport.js`
- Wikipedia networking → `src/core/wikipedia.js`
- UI/rendering → `src/core/app.js`
- appearance → `src/styles/`
- deployment/runtime selection → `server.mjs` + Railway variables
