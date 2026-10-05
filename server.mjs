import { DEFAULT_PACK_ID, isPackId } from './src/packs/registry.js';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const root = fileURLToPath(new URL('.', import.meta.url));
const port = Number(process.env.PORT || 4173);
const configuredPack = process.env.CODEX_PACK || DEFAULT_PACK_ID;
const codexPack = isPackId(configuredPack) ? configuredPack : DEFAULT_PACK_ID;
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.json': 'application/json; charset=utf-8',
};
const textExtensions = new Set(['.html', '.js', '.css', '.svg', '.json']);
const fileCache = new Map();

async function loadFile(path) {
  if (fileCache.has(path)) return fileCache.get(path);
  const raw = await readFile(path);
  const ext = extname(path);
  const cached = {
    raw,
    gzip: textExtensions.has(ext) ? gzipSync(raw, { level: 6 }) : null,
  };
  fileCache.set(path, cached);
  return cached;
}

createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', 'http://localhost');

    if (url.pathname === '/runtime-config.js') {
      const body = `window.__CODEX_PACK__ = ${JSON.stringify(codexPack)};`;
      res.writeHead(200, {
        'Content-Type': 'text/javascript; charset=utf-8',
        'Cache-Control': 'no-store',
      });
      res.end(body);
      return;
    }
    let pathname = decodeURIComponent(url.pathname);
    if (pathname === '/') pathname = '/index.html';
    const safe = normalize(pathname).replace(/^(\.\.[/\\])+/, '');
    let path = join(root, safe);
    try {
      const info = await stat(path);
      if (info.isDirectory()) path = join(path, 'index.html');
    } catch {
      path = join(root, 'index.html');
    }

    const ext = extname(path);
    const cached = await loadFile(path);
    const acceptsGzip = /\bgzip\b/.test(req.headers['accept-encoding'] || '');
    const useGzip = Boolean(cached.gzip && acceptsGzip);
    const isLongLivedAsset = pathname.startsWith('/public/images/');

    const headers = {
      'Content-Type': types[ext] || 'application/octet-stream',
      'Cache-Control': isLongLivedAsset
        ? 'public, max-age=604800, stale-while-revalidate=86400'
        : 'no-cache',
      'Vary': 'Accept-Encoding',
    };
    if (useGzip) headers['Content-Encoding'] = 'gzip';

    res.writeHead(200, headers);
    res.end(useGzip ? cached.gzip : cached.raw);
  } catch {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Server error');
  }
}).listen(port, '0.0.0.0', () => console.log(`Codex Atlas (${codexPack}): http://localhost:${port}`));
