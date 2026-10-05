# Codex Atlas — Project Overview

Codex Atlas is a dependency-free web application for interactive radial knowledge maps.

One shared renderer powers multiple independent Codex. The active subject is selected at runtime with the `CODEX_PACK` environment variable.

## Current Codex

| Railway service | `CODEX_PACK` | Live site |
| --- | --- | --- |
| `human-body` | `human-body` | https://codex-human-body.up.railway.app |
| `finance` | `finance` | https://codex-finance.up.railway.app |
| `home` | `home` | https://codex-home.up.railway.app |

## Main idea

The application separates shared UI and interactions from subject-specific content. This makes it possible to add new Codex without copying the whole application.

For the complete repository layout and responsibilities of each file, see [ARCHITECTURE.md](ARCHITECTURE.md).

## Local development

```bash
npm run dev:human-body
npm run dev:finance
npm run dev:home
```

Open `http://localhost:4173`.

## Production workflow

All three Railway services use the same GitHub repository and `main` branch:

```text
local changes → git commit → git push origin main → GitHub → Railway auto-deploy
```

Each service selects its content through its own `CODEX_PACK` variable.
