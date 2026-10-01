/** Helper condivisi dell'interfaccia: formattazione, validazione, prezzi, azioni. */

const nf = (min, max) => new Intl.NumberFormat('it-IT', { minimumFractionDigits: min, maximumFractionDigits: max, useGrouping: 'always' });
const F0 = nf(0, 0);
const F2 = nf(2, 2);
const F3 = nf(3, 3);

export const euro = (v, dec = 0) => `${(dec === 3 ? F3 : dec === 2 ? F2 : F0).format(v || 0)} €`;
export const num = (v, dec = 0) => (dec ? nf(0, dec) : F0).format(v || 0);
export const pct = (v) => `${F0.format(Math.round((v || 0) * 100))}%`;
export const euroKm = (v) => `${F2.format(v || 0)} €/km`;

/** Lettura/scrittura del valore di un campo del form. */
export function readField(el) {
  if (el.type === 'checkbox') return el.checked;
  if (el.type === 'radio') return el.form ? el.form.elements[el.name].value : el.value;
  if (el.type === 'number') return el.value === '' ? null : Number(el.value);
  return el.value;
}

export function writeField(form, name, value) {
  const el = form.elements[name];
  if (!el) return;
  if (el instanceof RadioNodeList) {
    for (const r of el) r.checked = r.value === value;
  } else if (el.type === 'checkbox') {
    el.checked = !!value;
  } else {
    el.value = value === null || value === undefined ? '' : value;
  }
}

/**
 * Valida un campo numerico con i vincoli min/max/required dell'HTML.
 * Mostra il messaggio d'errore accessibile e restituisce true se valido.
 */
export function validateField(el) {
  if (el.type !== 'number' || el.closest('[hidden]')) return true;
  const errEl = document.getElementById(el.id + '-e');
  let msg = '';
  const v = el.value;
  if (el.validity.badInput) msg = 'Inserisci un numero valido.';
  else if (v === '' && el.required) msg = 'Campo obbligatorio.';
  else if (v !== '') {
    const n = Number(v);
    if (el.min !== '' && n < Number(el.min)) msg = `Il valore minimo è ${num(Number(el.min), 2)}.`;
    else if (el.max !== '' && n > Number(el.max)) msg = `Il valore massimo è ${num(Number(el.max), 2)}.`;
  }
  el.setAttribute('aria-invalid', msg ? 'true' : 'false');
  if (errEl) {
    errEl.textContent = msg;
    errEl.hidden = !msg;
  }
  return !msg;
}

/** Carica /data/prezzi.json (una sola volta) e aggiorna la data mostrata in pagina. */
let prezziPromise;
export function caricaPrezzi() {
  prezziPromise ??= fetch('/data/prezzi.json', { cache: 'no-cache' })
    .then((r) => (r.ok ? r.json() : null))
    .catch(() => null)
    .then((data) => {
      const p = data?.prezzi || {};
      const valori = {};
      for (const [k, v] of Object.entries(p)) valori[k] = typeof v?.valore === 'number' && v.valore > 0 ? v.valore : null;
      const dataAgg = data?.ultimo_aggiornamento;
      document.querySelectorAll('[data-prezzi-data]').forEach((el) => {
        if (dataAgg) {
          const d = new Date(dataAgg + 'T12:00:00Z');
          if (!Number.isNaN(d.getTime())) {
            el.textContent = d.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
            el.classList.remove('todo');
          }
        }
      });
      return valori;
    });
  return prezziPromise;
}

/** Chiave in prezzi.json per un'alimentazione termica. */
export const chiavePrezzo = (alimentazione) => (alimentazione === 'ibrida' ? 'benzina' : alimentazione);

/** Messaggio di stato accessibile per le azioni (copia, condividi…). */
export function status(root, msg) {
  const el = root.querySelector('[data-action-status]');
  if (!el) return;
  el.textContent = msg;
  clearTimeout(el._t);
  el._t = setTimeout(() => { el.textContent = ''; }, 4000);
}

export async function copia(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch { ok = false; }
    ta.remove();
    return ok;
  }
}

/** Condivide con il menu nativo (mobile) o copia il link. */
export async function condividi(root, url, title, text) {
  if (navigator.share && matchMedia('(pointer: coarse)').matches) {
    try {
      await navigator.share({ url, title, text });
      return;
    } catch (e) {
      if (e?.name === 'AbortError') return;
    }
  }
  const ok = await copia(url);
  status(root, ok ? 'Link copiato: chi lo apre vedrà lo stesso calcolo.' : 'Copia non riuscita: copia il link dalla barra degli indirizzi.');
  history.replaceState(null, '', url);
}

/** Collega i pulsanti Copia / Stampa / Condividi. */
export function bindActions(root, { testo, url, titolo, beforePrint }) {
  root.querySelector('[data-action="copy"]')?.addEventListener('click', async () => {
    const ok = await copia(testo());
    status(root, ok ? 'Risultato copiato negli appunti.' : 'Copia non riuscita.');
  });
  root.querySelector('[data-action="print"]')?.addEventListener('click', () => {
    beforePrint?.();
    window.print();
  });
  root.querySelector('[data-action="share"]')?.addEventListener('click', () => {
    condividi(root, url(), titolo, testo());
  });
  if (beforePrint) window.addEventListener('beforeprint', beforePrint);
}

/** Legge i parametri numerici/testuali dall'URL. */
export function paramsFromUrl() {
  return new URLSearchParams(location.search);
}

export const parseParam = (raw) => {
  if (raw === null) return undefined;
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  if (raw === '') return null;
  const n = Number(raw);
  return Number.isFinite(n) && /^-?[\d.]+(e-?\d+)?$/i.test(raw) ? n : raw;
};

export const escHtml = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/**
 * Aggiorna un valore numerico con un breve conteggio animato (rispetta "riduci movimento").
 * Il primo aggiornamento non anima: il valore iniziale è già nell'HTML pre-renderizzato.
 */
const riduciMovimento = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
export function animaNumero(el, valore, formato) {
  if (!el) return;
  const da = el._v;
  el._v = valore;
  cancelAnimationFrame(el._raf);
  if (da === undefined || riduciMovimento || !Number.isFinite(da) || Math.abs(da - valore) < 1e-9) {
    el.textContent = formato(valore);
    return;
  }
  const t0 = performance.now();
  const dur = 380;
  const step = (t) => {
    const k = Math.min(1, (t - t0) / dur);
    const e = 1 - Math.pow(1 - k, 3);
    el.textContent = formato(da + (valore - da) * e);
    if (k < 1) el._raf = requestAnimationFrame(step);
  };
  el._raf = requestAnimationFrame(step);
}
