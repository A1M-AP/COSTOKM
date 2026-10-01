import { esc, jsonLd } from './util.mjs';

const NAV = [
  { href: '/', label: 'Calcolatore' },
  { href: '/confronto-elettrica-benzina/', label: 'Elettrica vs benzina' },
  { href: '/costo-carburante-viaggio/', label: 'Costo viaggio' },
  { href: '/costo-auto-neopatentati/', label: 'Neopatentati' },
];

const FOOTER_LINKS = [
  { href: '/chi-siamo/', label: 'Chi siamo' },
  { href: '/contatti/', label: 'Contatti' },
  { href: '/privacy-policy/', label: 'Privacy policy' },
  { href: '/cookie-policy/', label: 'Cookie policy' },
  { href: '/note-legali/', label: 'Note legali' },
];

/** Dati strutturati comuni + specifici della pagina. */
function structuredData(page, cfg) {
  const url = cfg.sito.url + page.path;
  const graph = [];
  if (page.path === '/') {
    graph.push({
      '@type': 'WebSite',
      '@id': cfg.sito.url + '/#website',
      url: cfg.sito.url + '/',
      name: cfg.sito.nome,
      inLanguage: 'it-IT',
      description: cfg.sito.descrizioneBreve,
    });
  }
  if (page.app) {
    graph.push({
      '@type': 'WebApplication',
      name: page.app,
      url,
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Qualsiasi (browser web)',
      inLanguage: 'it-IT',
      isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
    });
  }
  if (page.path !== '/') {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: cfg.sito.url + '/' },
        { '@type': 'ListItem', position: 2, name: page.breadcrumb || page.h1, item: url },
      ],
    });
  }
  if (page.faq?.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: page.faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a.replace(/<[^>]+>/g, '') },
      })),
    });
  }
  return graph.length ? jsonLd({ '@context': 'https://schema.org', '@graph': graph }) : '';
}

const haServizi = (cfg) => Object.values(cfg._servizi || {}).some(Boolean);

/**
 * Banner cookie (linee guida Garante 10/06/2021). Viene generato solo se è attivo
 * almeno un servizio non tecnico: con i soli strumenti tecnici il banner non è dovuto.
 */
function cookieBanner(cfg) {
  if (!haServizi(cfg)) return '';
  const sv = cfg._servizi;
  const cat = [sv.statistiche && '<strong>statistica</strong>', sv.pubblicita && '<strong>pubblicità</strong>'].filter(Boolean).join(' e ');
  return `<div class="cookie-banner" id="cookie-banner" role="dialog" aria-modal="false" aria-labelledby="cookie-title" aria-describedby="cookie-desc" hidden>
  <div class="cookie-inner">
    <button type="button" class="cookie-close" data-consent="reject" aria-label="Chiudi e rifiuta i cookie non necessari">×</button>
    <p class="cookie-title" id="cookie-title">Rispettiamo la tua privacy</p>
    <p id="cookie-desc">Usiamo strumenti tecnici necessari e, solo con il tuo consenso, cookie di ${cat} di terze parti (Google). Chiudere con la X equivale a rifiutare. Puoi cambiare idea quando vuoi da “Preferenze cookie” in fondo alla pagina. <a href="/cookie-policy/">Cookie policy</a></p>
    <div class="cookie-prefs" id="cookie-prefs" hidden>
      <label class="check"><input type="checkbox" checked disabled> Tecnici (sempre attivi)</label>
      ${sv.statistiche ? '<label class="check"><input type="checkbox" id="consent-statistiche"> Statistiche (Google Analytics)</label>' : ''}
      ${sv.pubblicita ? '<label class="check"><input type="checkbox" id="consent-pubblicita"> Pubblicità (Google AdSense)</label>' : ''}
    </div>
    <div class="cookie-actions">
      <button type="button" class="btn btn-consent" data-consent="reject">Rifiuta</button>
      <button type="button" class="btn btn-consent" data-consent="accept">Accetta</button>
      <button type="button" class="btn btn-ghost" data-consent="customize" aria-expanded="false" aria-controls="cookie-prefs">Personalizza</button>
      <button type="button" class="btn btn-ghost" data-consent="save" hidden>Salva le scelte</button>
    </div>
  </div>
</div>`;
}

export function layout({ page, body, css, cfg, runtimeConfig }) {
  const s = cfg.sito;
  const url = s.url + page.path;
  const title = page.title;
  const ogImage = s.url + '/og-image.png';
  const nav = NAV.map((l) => {
    const current = l.href === page.path ? ' aria-current="page"' : '';
    return `<li><a href="${l.href}"${current}>${l.label}</a></li>`;
  }).join('');
  const footerLinks = FOOTER_LINKS.map((l) => `<li><a href="${l.href}">${l.label}</a></li>`).join('');
  const scripts = (page.scripts || [])
    .map((src) => `<script type="module" src="${src}"></script>`)
    .join('\n');
  const preloads = (page.scripts || []).length
    ? '<link rel="modulepreload" href="/assets/js/calc.js">\n<link rel="modulepreload" href="/assets/js/ui.js">'
    : '';
  const breadcrumb = page.path !== '/' && !page.noindex
    ? `<nav class="breadcrumb wrap" aria-label="Percorso"><ol><li><a href="/">Home</a></li><li aria-current="page">${esc(page.breadcrumb || page.h1)}</li></ol></nav>`
    : '';

  return `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(page.description)}">
${page.noindex ? '<meta name="robots" content="noindex, follow">' : `<link rel="canonical" href="${url}">\n<meta name="robots" content="index, follow, max-image-preview:large">`}
<meta name="theme-color" content="#0f3d5e">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(s.nome)}">
<meta property="og:locale" content="it_IT">
<meta property="og:title" content="${esc(page.ogTitle || title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(s.nome)} – calcolatore del costo reale dell'auto">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
${preloads}
<style>${css}</style>
${structuredData(page, cfg)}
<script type="application/json" id="site-config">${JSON.stringify(runtimeConfig).replace(/</g, '\\u003c')}</script>
</head>
<body>
<a class="skip-link" href="#contenuto">Vai al contenuto</a>
<header class="site-header">
  <div class="wrap header-inner">
    <a class="logo" href="/"><span class="logo-mark" aria-hidden="true">€/km</span><span>costo<b>km</b>.it</span></a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="menu-principale">Menu</button>
    <nav class="main-nav" id="menu-principale" aria-label="Principale"><ul>${nav}</ul></nav>
  </div>
</header>
${breadcrumb}
<main id="contenuto" tabindex="-1">
${body}
</main>
<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div>
        <p class="logo logo--footer"><span>costo<b>km</b>.it</span></p>
        <p>${esc(s.descrizioneBreve)}</p>
        <p class="small">I risultati sono indicativi e dipendono interamente dai dati inseriti dall’utente. Non costituiscono consulenza finanziaria, assicurativa o fiscale.</p>
      </div>
      <nav aria-label="Strumenti"><p class="footer-title">Strumenti</p><ul>${NAV.map((l) => `<li><a href="${l.href}">${l.label}</a></li>`).join('')}</ul></nav>
      <nav aria-label="Informazioni"><p class="footer-title">Informazioni</p><ul>${footerLinks}${haServizi(cfg) ? '<li><button type="button" class="linklike" data-cookie-settings>Preferenze cookie</button></li>' : ''}</ul></nav>
    </div>
    <p class="small footer-aff">Alcuni link presenti sul sito sono link di affiliazione: se sottoscrivi un servizio tramite essi potremmo ricevere una commissione, senza costi aggiuntivi per te. ${esc(s.nome)} non svolge attività di intermediazione assicurativa né finanziaria.</p>
    <p class="small">© ${new Date().getFullYear()} ${esc(s.nome)}</p>
  </div>
</footer>
${cookieBanner(cfg)}
<script src="/assets/js/site.js" defer></script>
${scripts}
</body>
</html>
`;
}
