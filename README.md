# Codex Atlas — clean rebuild

A dependency-free interactive radial knowledge map inspired by the visual grammar of the Cognitive Bias Codex.

## Run locally

```bash
npm run dev
```

Open `http://localhost:4173`.

## Architecture

- `index.html` — app shell
- `src/app.js` — renderer, pan/zoom, Explore/Learn, search, Wikipedia previews
- `src/styles.css` — visual system
- `src/data/human-body.js` — Human Body knowledge pack
- `public/images/human-body-center.svg` — replaceable center artwork
- `server.mjs` — tiny Node static server for local use and Railway

No framework, no bundler, no database, no runtime dependency.

## Railway

The included `railway.json` starts the site with `npm start`. Railway provides the `PORT` environment variable automatically.

## Content model

The Human Body pack contains 7 macro domains, 17 systems and 154 concepts. Concepts link to English and Italian Wikipedia article titles. In Explore mode, Wikipedia introductions are fetched live in the active language and cached in memory for the session.

## Interaction and readability

- Branches render in a dedicated SVG layer below all text, so no branch can paint over a label.
- Inner and leaf labels use subtle translucent backplates for contrast.
- Explore popups stay fixed after opening and can be entered with the pointer to use the Wikipedia link.
- Node IDs are validated for uniqueness at startup so broken parent/child links fail fast.

## Center artwork

Replace `public/images/human-body-center.svg` with your final generated image and update `centerImage` in `src/data/human-body.js` if the filename changes.
