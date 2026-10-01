#!/usr/bin/env node
/**
 * Generatore statico di costokm.it — zero dipendenze.
 *   node build.mjs   →   genera la cartella dist/
 *
 * - src/pages/*.mjs     una pagina ciascuno (meta SEO + corpo HTML)
 * - src/layout.mjs      head, header, footer, banner cookie
 * - src/styles/*.css    CSS, minificato e inserito inline (nessuna richiesta bloccante)
 * - public/             copiato così com'è (JS, dati, immagini, _headers)
 * - config/site.config.json  configurazione unica (affiliazioni, pubblicità, consenso)
 */
import { readFile, writeFile, mkdir, rm, cp, readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { layout } from './src/layout.mjs';
import { createComponents } from './src/components.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const DIST = join(ROOT, 'dist');

const readJson = async (p) => JSON.parse(await readFile(join(ROOT, p), 'utf8'));

function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,>~])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
}

async function main() {
  const cfg = await readJson('config/site.config.json');
  const prezzi = await readJson('public/data/prezzi.json');
  const siteUrl = cfg.sito.url.replace(/\/$/, '');
  cfg.sito.url = siteUrl;

  const css = minifyCss(await readFile(join(ROOT, 'src/styles/style.css'), 'utf8'));
  const warnings = new Set();
  const c = createComponents(cfg, prezzi, warnings);
  // Dati aggiornati ogni giorno dall'azione GitHub (facoltativi: la pagina dei prezzi gestisce la loro assenza)
  c.storico = await readJson('public/data/storico-prezzi.json').catch(() => null);
  c.regioni = await readJson('public/data/prezzi-regioni.json').catch(() => null);

  // Servizi non tecnici effettivamente attivi: decidono banner, categorie e testi delle policy.
  cfg._servizi = {
    statistiche: !!cfg.statistiche.ga4Id,
    pubblicita: !!(cfg.pubblicita.attiva && cfg.pubblicita.adsenseClient),
  };
  // Statistiche senza cookie (Cloudflare Web Analytics): non richiedono consenso ma vanno indicate nella privacy policy.
  cfg._cfAnalytics = !!(cfg.statistiche.cloudflareToken || cfg.statistiche.cloudflareAttivo);
  const runtimeConfig = {
    nome: cfg.sito.nome,
    url: siteUrl,
    consenso: cfg.consensoCookie,
    ads: { attiva: !!cfg.pubblicita.attiva, client: cfg.pubblicita.adsenseClient || '' },
    ga4Id: cfg.statistiche.ga4Id || '',
    categorie: Object.keys(cfg._servizi).filter((k) => cfg._servizi[k]),
  };
  if (!cfg.sito.titolare || /DA COMPLETARE/.test(cfg.sito.titolare)) warnings.add('Titolare del sito mancante: sito.titolare in config/site.config.json');
  if (cfg.pubblicita.attiva && !cfg.pubblicita.adsenseClient) warnings.add('Pubblicità attiva ma adsenseClient vuoto in config/site.config.json');

  await rm(DIST, { recursive: true, force: true });
  await cp(join(ROOT, 'public'), DIST, { recursive: true });

  const pageFiles = (await readdir(join(ROOT, 'src/pages'))).filter((f) => f.endsWith('.mjs')).sort();
  const sitemap = [];
  const today = new Date().toISOString().slice(0, 10);

  for (const file of pageFiles) {
    const mod = await import(pathToFileURL(join(ROOT, 'src/pages', file)).href);
    const page = mod.default;
    const body = page.body(c, cfg);
    const html = layout({ page, body, css, cfg, runtimeConfig });
    const out = page.outFile
      ? join(DIST, page.outFile)
      : join(DIST, page.path, 'index.html');
    await mkdir(dirname(out), { recursive: true });
    await writeFile(out, html);
    if (!page.noindex) sitemap.push({ loc: siteUrl + page.path, priority: page.priority ?? 0.5 });
    console.log(`  ✓ ${page.outFile || page.path}`);
  }

  sitemap.sort((a, b) => b.priority - a.priority);
  await writeFile(
    join(DIST, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemap.map((s) => `  <url><loc>${s.loc}</loc><lastmod>${today}</lastmod><priority>${s.priority.toFixed(1)}</priority></url>`).join('\n')}
</urlset>
`,
  );
  await writeFile(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);

  console.log(`\nBuild completata: ${pageFiles.length} pagine in dist/`);
  if (warnings.size) {
    console.log('\n⚠  Da completare prima della pubblicazione:');
    for (const w of warnings) console.log('   - ' + w);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
