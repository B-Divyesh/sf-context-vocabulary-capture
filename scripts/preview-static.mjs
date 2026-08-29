import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const root = join(process.cwd(), 'dist/site');
const portIndex = process.argv.indexOf('--port');
const port = Number(process.env.PORT ?? (portIndex >= 0 ? process.argv[portIndex + 1] : 4173));
const types = { '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.zip': 'application/zip' };
const appRoutes = new Set(['/', '/demo', '/privacy', '/terms']);

async function asset(pathname) {
  const relative = normalize(pathname).replace(/^[/\\]+/, '');
  const file = join(root, relative || 'index.html');
  if (!file.startsWith(root)) return undefined;
  try { if ((await stat(file)).isFile()) return file; } catch { return undefined; }
  return undefined;
}

createServer(async (request, response) => {
  const pathname = new URL(request.url ?? '/', 'http://localhost').pathname;
  const requestedAsset = await asset(pathname);
  const knownRoute = appRoutes.has(pathname);
  const file = requestedAsset ?? (knownRoute ? join(root, 'index.html') : join(root, '404.html'));
  const status = requestedAsset || knownRoute ? 200 : 404;
  try {
    const cacheControl = ['/assets/dithered-reading-margin.webp', '/assets/social.png'].includes(pathname)
      ? 'public, max-age=0, must-revalidate'
      : /^\/assets\/index-[^/]+\.(?:css|js)$/.test(pathname) ? 'public, max-age=31536000, immutable' : undefined;
    response.writeHead(status, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin', 'Content-Security-Policy': "default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'", ...(cacheControl ? { 'Cache-Control': cacheControl } : {}) });
    response.end(await readFile(file));
  } catch {
    response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' }); response.end('Could not load this page.');
  }
}).listen(port, '127.0.0.1', () => console.log(`Static preview on http://127.0.0.1:${port}`));
