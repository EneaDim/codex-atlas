# Codex Atlas

Codex Atlas is a collection of interactive radial knowledge maps for exploring complex subjects visually.

All Codex share the same renderer and support Italian/English/Spanish, desktop/mobile, dark/light themes, hierarchical browsing, Learn mode and semantic search across the whole Atlas.

## Live sites

| Codex | Website |
| --- | --- |
| **Codex Atlas — Main** | [codex-atlas.up.railway.app](https://codex-atlas.up.railway.app) |
| Human Body | [codex-human-body.up.railway.app](https://codex-human-body.up.railway.app) |
| Finance | [codex-finance.up.railway.app](https://codex-finance.up.railway.app) |
| Home / Casa Pratica | [codex-home.up.railway.app](https://codex-home.up.railway.app) |
| Statistics | [codex-statistics.up.railway.app](https://codex-statistics.up.railway.app) |
| Climate | [codex-climate.up.railway.app](https://codex-climate.up.railway.app) |
| Survival | [codex-survival.up.railway.app](https://codex-survival.up.railway.app) |
| Nutrition | [codex-nutrition.up.railway.app](https://codex-nutrition.up.railway.app) |

## Try it locally

Requires **Node.js 20+**.

```bash
git clone https://github.com/EneaDim/codex-atlas.git
cd codex-atlas
```

Start the main Atlas or any Codex:

```bash
npm run dev:atlas
npm run dev:human-body
npm run dev:finance
npm run dev:home
npm run dev:statistics
npm run dev:climate
npm run dev:survival
npm run dev:nutrition
```

Then open:

```text
http://localhost:4173
```

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Content packs](docs/CONTENT_PACKS.md)
- [Development](docs/DEVELOPMENT.md)
- [Semantic search](docs/SEARCH.md)
- [Languages](docs/LANGUAGES.md)
- [Release helper](docs/RELEASE.md)
- [Railway CLI](docs/RAILWAY_CLI.md)
- [Statistics course coverage](docs/STATISTICS_COURSE.md)
