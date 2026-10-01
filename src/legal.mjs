import { esc, dataIt } from './util.mjs';

/** Corpo comune delle pagine istituzionali. */
export const legal = (h1, html, cfg) => `<div class="wrap">
<article class="article legal">
  <h1>${h1}</h1>
  ${cfg ? `<p class="small">Ultimo aggiornamento: ${dataIt(cfg.sito.ultimoAggiornamentoDocumentiLegali)}</p>` : ''}
  ${html}
</article>
</div>`;

export const titolare = (cfg) => `${esc(cfg.sito.titolare)}, ${esc(cfg.sito.indirizzoTitolare)} – ${esc(cfg.sito.partitaIva)} – e-mail: <a href="mailto:${esc(cfg.sito.emailContatto)}">${esc(cfg.sito.emailContatto)}</a>`;

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
