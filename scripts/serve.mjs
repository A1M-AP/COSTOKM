#!/usr/bin/env node
/**
 * Server di sviluppo senza dipendenze: serve dist/ e, con --watch,
 * ricostruisce il sito quando cambiano src/, public/ o config/.
 *   node scripts/serve.mjs [--watch] [--port 8080]
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { watch } from 'node:fs';
import { join, extname, dirname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const args = process.argv.slice(2);
const port = Number(args[args.indexOf('--port') + 1]) || Number(process.env.PORT) || 8080;
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8', '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json',
};

function build() {
  return new Promise((res) => spawn(process.execPath, [join(ROOT, 'build.mjs')], { stdio: 'inherit' }).on('exit', res));
}

await build();

if (args.includes('--watch')) {
  let timer;
  for (const dir of ['src', 'public', 'config']) {
    watch(join(ROOT, dir), { recursive: true }, () => {
      clearTimeout(timer);
      timer = setTimeout(build, 150);
    });
  }
}

createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let p = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, '');
  let file = join(DIST, p);
  try {
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
  } catch {
    const isDir = await stat(join(file, 'index.html')).then(() => true, () => false);
    if (isDir && !p.endsWith('/')) {
      res.writeHead(301, { Location: p + '/' + url.search });
      return res.end();
    }
  }
  try {
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(await readFile(join(DIST, '404.html')).catch(() => 'Not found'));
  }
}).listen(port, () => console.log(`\n→ http://localhost:${port}`));
