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
