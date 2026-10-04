# Codex Atlas — Project Overview

Codex Atlas is a dependency-free interactive radial knowledge map. One shared renderer powers multiple independent sites from the same GitHub repository.

## Current sites

| Railway service | `CODEX_PACK` | Site |
| --- | --- | --- |
| `human-body` | `human-body` | Human Body Codex |
| `finance` | `finance` | Finance Codex |
| `home` | `home` | Home Codex / Casa Pratica |

Each Railway service deploys the same repository and selects its content at runtime through the `CODEX_PACK` environment variable.

## Main files

```text
codex-atlas/
├── index.html
├── server.mjs
├── package.json
├── railway.json                 # legacy Railway config; migrate before 2026-12-01
├── public/images/               # center artwork for each pack
└── src/
    ├── app.js                   # shared renderer and interactions
    ├── styles.css               # shared visual system
    └── data/
        ├── human-body.js
        ├── finance.js
        └── home.js
```

## Local development

Human Body:

```bash
npm run dev
```

Finance:

```bash
CODEX_PACK=finance npm run dev
```

Home:

```bash
CODEX_PACK=home npm run dev
```

Open `http://localhost:4173`.

## Deployment model

The preferred production flow is:

```text
local changes → git commit → git push origin main → GitHub → Railway auto-deploy
```

All three Railway services point to the same GitHub repository and `main` branch. Their only required difference is `CODEX_PACK`.

## Normal update workflow

```bash
git add -A
git commit -m "Update Codex Atlas"
git push origin main
```

No database, build framework, or separate repository is required for each Codex.
