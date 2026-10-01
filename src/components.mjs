import { esc, dataIt } from './util.mjs';
import { ALIMENTAZIONI } from '../public/assets/js/calc.js';

/**
 * Crea gli helper usati dai template delle pagine.
 * @param {object} cfg   config/site.config.json
 * @param {object} prezzi public/data/prezzi.json
 * @param {string[]} warnings  raccoglie gli avvisi di build
 */
export function createComponents(cfg, prezzi, warnings) {
  const c = { prezzi };
  const fmtVal = (v) => (v === null || v === undefined ? '' : String(v));

  /**
   * Campo numerico accessibile.
   * opts: { name, label, unit, value, min, max, step, hint, required, prefix (per id univoci), cls }
   */
  c.field = (o) => {
    const id = `${o.prefix || 'f'}-${o.name}`;
    const describedBy = [o.hint ? `${id}-h` : '', `${id}-e`].filter(Boolean).join(' ');
    const attrs = [
      `id="${id}"`,
      `name="${o.name}"`,
      'type="number"',
      `inputmode="${o.step === 1 || o.integer ? 'numeric' : 'decimal'}"`,
      `min="${o.min ?? 0}"`,
      o.max !== undefined ? `max="${o.max}"` : '',
      `step="${o.step ?? 'any'}"`,
      `value="${fmtVal(o.value)}"`,
      o.placeholder ? `placeholder="${esc(o.placeholder)}"` : '',
      o.required ? 'required' : '',
      `aria-describedby="${describedBy}"`,
    ].filter(Boolean).join(' ');
    const boxUnit = o.unit && o.unit.length <= 4;
    return `<div class="field${o.cls ? ' ' + o.cls : ''}"${o.group ? ` data-group="${o.group}"` : ''}${o.hidden ? ' hidden' : ''}>
  <label for="${id}">${o.label}${o.unit ? ` <span class="unit-label${boxUnit ? ' sr-only' : ''}" data-unit-for="${o.name}">(${o.unit})</span>` : ''}</label>
  <div class="input-wrap${boxUnit ? ' has-unit' : ''}"><input ${attrs}>${boxUnit ? `<span class="input-unit" aria-hidden="true" data-unit-for="${o.name}">${o.unit}</span>` : ''}</div>
  ${o.hint ? `<p class="hint" id="${id}-h">${o.hint}</p>` : ''}
  <p class="field-error" id="${id}-e" role="alert" hidden></p>
</div>`;
  };

  c.select = (o) => {
    const id = `${o.prefix || 'f'}-${o.name}`;
    const options = Object.entries(o.options)
      .map(([v, l]) => `<option value="${v}"${v === o.value ? ' selected' : ''}>${l}</option>`)
      .join('');
    return `<div class="field">
  <label for="${id}">${o.label}</label>
  <select id="${id}" name="${o.name}">${options}</select>
</div>`;
  };

  c.alimentazioniOptions = (keys = Object.keys(ALIMENTAZIONI)) =>
    Object.fromEntries(keys.map((k) => [k, ALIMENTAZIONI[k].label]));

  /** Riquadro affiliazione contestuale con disclosure. */
  c.affiliate = (key, extraClass = '') => {
    const a = cfg.affiliazioni?.[key];
    if (!a || !a.attivo) return '';
    const configured = /^https?:\/\//.test(a.url || '');
    if (!configured) warnings.add(`Affiliazione "${key}": URL non configurato in config/site.config.json`);
    const href = configured ? esc(a.url) : '#affiliazione-da-configurare';
    return `<aside class="aff ${extraClass}" aria-label="Link affiliato: ${esc(a.titolo)}">
  <p class="aff-badge">Link affiliato</p>
  <p class="aff-title">${esc(a.titolo)}</p>
  <p class="aff-text">${esc(a.testo)}</p>
  <a class="btn btn-aff" href="${href}" rel="sponsored noopener" target="_blank" data-aff="${key}">${esc(a.cta)}<span class="sr-only"> (sito esterno, si apre in una nuova scheda)</span></a>
  <p class="aff-disc">${esc(cfg.affiliazioni.disclosure)}</p>
</aside>`;
  };

  /** Spazio pubblicitario con dimensioni riservate (CLS zero). */
  c.ad = (slot, variant = 'rect') => {
    const p = cfg.pubblicita || {};
    if (!p.attiva && !p.mostraSegnaposto) return '';
    return `<div class="ad ad--${variant}" data-ad-slot-name="${slot}" data-ad-slot="${esc(p.slot?.[slot] || '')}">
  <span class="ad-label">Pubblicità</span>
  ${p.attiva ? '' : '<span class="ad-placeholder">Spazio pubblicitario</span>'}
</div>`;
  };

  /** FAQ (il markup FAQPage è generato dal layout con gli stessi dati). */
  c.faq = (items) => `<section class="faq" aria-labelledby="faq-title">
  <h2 id="faq-title">Domande frequenti</h2>
  ${items.map((f) => `<details class="faq-item"><summary>${esc(f.q)}</summary><div class="faq-answer"><p>${f.a}</p></div></details>`).join('\n  ')}
</section>`;

  /** Riga con la data di aggiornamento dei prezzi (renderizzata al build, confermata a runtime). */
  c.prezziInfo = () => {
    const data = dataIt(prezzi.ultimo_aggiornamento);
    const testo = data
      ? `Prezzi medi aggiornati al <strong data-prezzi-data>${data}</strong>`
      : `Prezzi medi: <strong data-prezzi-data class="todo">DA AGGIORNARE CON DATI UFFICIALI</strong>`;
    if (!data) warnings.add('public/data/prezzi.json: prezzi non ancora aggiornati (ultimo_aggiornamento = null)');
    return `<p class="prezzi-info" data-prezzi-info>${testo} · fonte: <a href="${esc(prezzi.fonte_url)}" rel="noopener" target="_blank">MIMIT<span class="sr-only"> (sito esterno)</span></a>. Puoi sempre inserire il prezzo che paghi tu.</p>`;
  };

  c.disclaimer = () => `<p class="disclaimer"><strong>Risultati indicativi.</strong> I calcoli si basano esclusivamente sui dati che inserisci e su ipotesi semplificate; i valori predefiniti sono solo esempi. Non costituiscono consulenza finanziaria, assicurativa o fiscale. Nessun dato inserito viene inviato ai nostri server: tutti i calcoli avvengono nel tuo browser.</p>`;

  c.actions = () => `<div class="actions" role="group" aria-label="Azioni sul risultato">
  <button type="button" class="btn btn-secondary" data-action="copy">Copia risultato</button>
  <button type="button" class="btn btn-secondary" data-action="print">Stampa</button>
  <button type="button" class="btn btn-secondary" data-action="share">Condividi</button>
</div>
<p class="action-status" role="status" aria-live="polite" data-action-status></p>`;

  return c;
}
