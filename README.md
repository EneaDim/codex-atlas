# Codex Atlas

Codex Atlas is a collection of interactive radial knowledge maps for exploring complex subjects visually.

The project currently includes three Codex, available in Italian and English, with desktop/mobile support and dark/light themes.

## Live sites

| Codex | Website |
| --- | --- |
| Human Body | [codex-human-body.up.railway.app](https://codex-human-body.up.railway.app) |
| Finance | [codex-finance.up.railway.app](https://codex-finance.up.railway.app) |
| Home / Casa Pratica | [codex-home.up.railway.app](https://codex-home.up.railway.app) |

## Try it locally

Requires **Node.js 20+**.

```bash
git clone https://github.com/EneaDim/codex-atlas.git
cd codex-atlas
```

Start the Codex you want to try:

```bash
npm run dev:human-body
npm run dev:finance
npm run dev:home
```

Then open:

```text
http://localhost:4173
```

## Documentation

More detailed documentation is available in [`docs/`](docs/):

- [Architecture](docs/ARCHITECTURE.md)
- [Content packs](docs/CONTENT_PACKS.md)
- [Development](docs/DEVELOPMENT.md)
- [Railway CLI](docs/RAILWAY_CLI.md)
