# Development workflow

## Requirements

- Node.js 20+
- Git

There is no build step and there are no runtime npm dependencies.

## Run locally

```bash
npm run dev:human-body
```

```bash
npm run dev:finance
```

```bash
npm run dev:home
```

Each command serves `http://localhost:4173`. Run one at a time unless you explicitly provide different `PORT` values.

The generic command also works:

```bash
CODEX_PACK=finance npm run dev
```

## Validation

Before committing:

```bash
npm run check
```

This performs syntax validation on the server, core modules and all pack files.

For content work, also verify the intended pack in the browser and check:

- map renders with no console errors;
- Explore hover opens the intended concept;
- opening a node preserves zoom/pan;
- Learn mode works;
- IT/EN works on desktop and mobile;
- Dark/Light works;
- mobile pinch/pan works;
- Home practical resources and risk badges still render where applicable.

## Git workflow

```bash
git status
git add -A
git commit -m "Describe the change"
git push origin main
```

The three Railway services can auto-deploy from the same branch.

## Where to make a change

| Change | File/area |
| --- | --- |
| add/edit a concept | `src/packs/<pack>.js` |
| add a new Codex | `src/packs/`, `public/images/<pack>/` |
| change map geometry | `src/core/constants.js`, `src/core/layout.js` |
| change pan/zoom/touch | `src/core/viewport.js` |
| change Wikipedia previews | `src/core/wikipedia.js` |
| change UI behavior | `src/core/app.js` |
| dark/default appearance | `src/styles/base.css` |
| light mode | `src/styles/light.css` |
| runtime pack selection | `server.mjs`, `src/packs/manifest.js` |
| Railway operations | `docs/RAILWAY_CLI.md` |

## Cache while testing

If a browser shows an old version after deployment, use a hard refresh or a private tab. Static images use longer cache headers; HTML/JS/CSS use revalidation/no-cache behavior.
