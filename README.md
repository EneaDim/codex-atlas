# Codex Atlas

A dependency-free interactive radial knowledge map inspired by the visual grammar of the Cognitive Bias Codex.

The same repository now serves multiple content packs with one shared renderer:

- `human-body` — Human Body Codex
- `finance` — Finance Codex
- `home` — Home Codex / Casa Pratica

## Run locally

Human Body (default):

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

## Architecture

- `index.html` — shared app shell
- `src/app.js` — shared renderer, pan/zoom, Explore/Learn, search and Wikipedia previews
- `src/styles.css` — shared visual system
- `src/data/human-body.js` — Human Body pack
- `src/data/finance.js` — Finance pack
- `src/data/home.js` — Home pack
- `public/images/human-body-center.webp` — Human Body center artwork
- `public/images/finance-center.svg` — Finance center artwork
- `public/images/home-center.svg` — Home center artwork
- `server.mjs` — static server and runtime content-pack configuration

No framework, no bundler, no database and no runtime dependency.

## Runtime pack selection

The server exposes `/runtime-config.js`, generated from `CODEX_PACK`.

```text
CODEX_PACK=human-body  -> Human Body Codex
CODEX_PACK=finance     -> Finance Codex
CODEX_PACK=home        -> Home Codex
```

If `CODEX_PACK` is omitted or invalid, `human-body` is used.

## Railway: three sites, one repository

Create three Railway services from the same GitHub repository.

### Human Body service

Environment variable:

```text
CODEX_PACK=human-body
```

### Finance service

Environment variable:

```text
CODEX_PACK=finance
```

### Home service

Environment variable:

```text
CODEX_PACK=home
```

All services use the included `railway.json` and start with `npm start`. Generate a different public domain for each service. Any future push to the shared GitHub repository can redeploy both services while keeping their different `CODEX_PACK` values.

## Content

Human Body contains 7 macro domains, 17 systems and 154 concepts.
Finance contains 8 macro domains, 27 systems and 157 concepts covering foundations, accounting, corporate finance, markets, investing, portfolio construction, risk, derivatives, banking, personal finance, fintech and regulation.
Home contains 8 macro domains, 29 systems and 174 concepts covering plumbing, electricity, HVAC, walls, woodworking, appliances, tools, safety and maintenance.

## Interaction

- Branches render below all text for readability.
- Labels use translucent backplates where needed.
- Explore popups stay centered and interactive, with Wikipedia introductions loaded first for concepts.
- Mobile supports one-finger pan and two-finger pinch zoom.
- Opening a node preserves the current viewport.
- Node IDs are validated for uniqueness at startup.
- The shared v10 design system uses a dark graphite UI, pack-specific accents, smoother wheel zoom and a mobile bottom sheet.


## Multiple Codex services

The same repository can power multiple Railway services. Set one environment variable per service:

```text
Human Body: CODEX_PACK=human-body
Finance:    CODEX_PACK=finance
Home:       CODEX_PACK=home
```

Local Home preview:

```bash
CODEX_PACK=home npm run dev
```

The Home pack also supports curated practical resources, difficulty/risk badges and professional-safety boundaries in the shared renderer.

## Documentation

- [`docs/PROJECT.md`](docs/PROJECT.md) — short project overview and normal development flow.
- [`docs/RAILWAY_CLI.md`](docs/RAILWAY_CLI.md) — detailed Railway CLI setup, domains, variables, deployment and troubleshooting.
