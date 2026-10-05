# Codex Atlas

Codex Atlas is a lightweight, dependency-free web app for interactive radial knowledge maps. One shared renderer powers three independent sites from the same repository:

| Pack | Railway service | Environment variable |
| --- | --- | --- |
| Human Body | `human-body` | `CODEX_PACK=human-body` |
| Finance | `finance` | `CODEX_PACK=finance` |
| Home / Casa Pratica | `home` | `CODEX_PACK=home` |

The UI includes Explore/Learn modes, IT/EN, Dark/Light themes, Wikipedia-first concept previews, search, pan/zoom, pinch-to-zoom and a mobile bottom sheet. Home concepts can also expose practical resources plus difficulty/risk metadata.

## Quick start

Requires Node.js 20+.

```bash
npm run dev:human-body
```

Open `http://localhost:4173`.

Other packs:

```bash
npm run dev:finance
npm run dev:home
```

Run the syntax checks before pushing:

```bash
npm run check
```

## Repository at a glance

```text
codex-atlas/
├── README.md
├── index.html                 # browser shell and early theme bootstrap
├── package.json               # local/start/check commands
├── server.mjs                 # static server + CODEX_PACK runtime config
├── railway.json               # current Railway config (legacy format)
├── docs/
│   ├── PROJECT.md             # concise project overview
│   ├── ARCHITECTURE.md        # runtime flow and module responsibilities
│   ├── CONTENT_PACKS.md       # data model and how to add a Codex
│   ├── DEVELOPMENT.md         # local workflow and checks
│   └── RAILWAY_CLI.md         # detailed Railway CLI operations
├── public/
│   └── images/
│       ├── human-body/center.webp
│       ├── finance/center.svg
│       └── home/center.svg
└── src/
    ├── main.js                # browser entry point
    ├── core/
    │   ├── app.js             # renderer + UI state/interactions
    │   ├── constants.js       # shared map geometry constants
    │   ├── dom.js             # DOM/SVG helpers
    │   ├── layout.js          # flattening, validation and radial layout
    │   ├── viewport.js        # mouse/touch pan and zoom
    │   └── wikipedia.js       # Wikipedia intro loading/fallback/cache
    ├── packs/
    │   ├── manifest.js        # supported pack IDs + default pack
    │   ├── index.js           # pack registry
    │   ├── human-body.js
    │   ├── finance.js
    │   └── home.js
    └── styles/
        ├── main.css           # stylesheet entry point
        ├── base.css           # dark/default UI + responsive layout
        └── light.css          # light-theme overrides
```

## Normal workflow

```bash
git add -A
git commit -m "Describe the change"
git push origin main
```

All three Railway services can deploy the same `main` branch while keeping different `CODEX_PACK` values.

## Documentation

- [`docs/PROJECT.md`](docs/PROJECT.md) — what the project is and how the three sites relate.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — how a request becomes a rendered Codex and what each module owns.
- [`docs/CONTENT_PACKS.md`](docs/CONTENT_PACKS.md) — content schema, resources, risk metadata and adding a fourth pack.
- [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md) — local commands, checks and safe editing workflow.
- [`docs/RAILWAY_CLI.md`](docs/RAILWAY_CLI.md) — detailed CLI setup, services, variables, domains, logs and troubleshooting.

## Deployment note

`railway.json` is intentionally kept for the moment because the current services are already working with it. Railway reports this format as deprecated; migrate it separately with `railway config migrate` after verifying the three production services. See [`docs/RAILWAY_CLI.md`](docs/RAILWAY_CLI.md).
