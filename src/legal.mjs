import { esc, dataIt } from './util.mjs';

/** Corpo comune delle pagine istituzionali. */
export const legal = (h1, html, cfg) => `<div class="wrap">
<article class="article legal">
  <h1>${h1}</h1>
  ${cfg ? `<p class="small">Ultimo aggiornamento: ${dataIt(cfg.sito.ultimoAggiornamentoDocumentiLegali)}</p>` : ''}
  ${html}
</article>
</div>`;

export const titolare = (cfg) => {
  const s = cfg.sito;
  const parti = [esc(s.titolare), s.indirizzoTitolare && esc(s.indirizzoTitolare), s.partitaIva && `P.IVA / C.F. ${esc(s.partitaIva)}`].filter(Boolean);
  return `${parti.join(' – ')} – e-mail: <a href="mailto:${esc(s.emailContatto)}">${esc(s.emailContatto)}</a>`;
};

/** Fornitori di hosting supportati (config: sito.hosting). */
export const HOSTING = {
  netlify: {
    nome: 'Netlify, Inc.',
    sede: 'Stati Uniti',
    privacy: 'https://www.netlify.com/privacy/',
    cookie: null,
  },
  cloudflare: {
    nome: 'Cloudflare, Inc.',
    sede: 'Stati Uniti',
    privacy: 'https://www.cloudflare.com/privacypolicy/',
    cookie: { nome: '__cf_bm', durata: '30 minuti', finalita: 'Sicurezza: distingue il traffico legittimo dai bot (impostato solo se è attiva la protezione anti-bot)' },
  },
};

export const hosting = (cfg) => HOSTING[cfg.sito.hosting] || HOSTING.netlify;

/** Link esterno con indicazione per screen reader. */
export const ext = (href, label) => `<a href="${esc(href)}" rel="noopener" target="_blank">${label}<span class="sr-only"> (sito esterno)</span></a>`;
