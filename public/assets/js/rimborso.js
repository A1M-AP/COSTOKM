/** Pagina /rimborso-chilometrico/. */
import { RIMBORSO_DEFAULT } from './defaults.js';
import { rimborsoChilometrico } from './calc.js';
import { testiRimborso } from './testi.js';
import { readField, writeField, validateField, bindActions, paramsFromUrl, parseParam, escHtml, animaNumero, euro } from './ui.js';

const root = document.querySelector('[data-rimborso]');
const form = root.querySelector('#calc-form');
const out = (n) => document.querySelector(`[data-out="${n}"]`);
const CAMPI = Object.keys(RIMBORSO_DEFAULT);
const state = { ...RIMBORSO_DEFAULT };

const p = paramsFromUrl();
for (const k of CAMPI) {
  const raw = p.get(k);
  if (raw === null) continue;
  if (k === 'andataRitorno') state[k] = raw === 'true';
  else { const v = parseParam(raw); if (typeof v === 'number') state[k] = v; }
}

function valido() {
  return [...form.querySelectorAll('input[type="number"]')].every((el) => {
    if (el.validity.badInput) return false;
    if (el.value === '') return !el.required;
    const n = Number(el.value);
    return !(el.min !== '' && n < Number(el.min)) && !(el.max !== '' && n > Number(el.max));
  });
}

let ultimo;
function render() {
  const ris = root.querySelector('.risultati');
  if (!valido()) {
    ris.classList.add('is-stale');
    out('avvisi').innerHTML = '<p class="avviso">Correggi i campi evidenziati per aggiornare il risultato.</p>';
    return;
  }
  ris.classList.remove('is-stale');
  const r = rimborsoChilometrico(state);
  const tx = testiRimborso(r, state);
  ultimo = { r, tx };
  if (Number(state.tariffa) > 0) {
    animaNumero(out('totale'), r.totale, (x) => euro(x, 2));
    animaNumero(out('chilometrico'), r.chilometrico, (x) => euro(x, 2));
  } else {
    out('totale').textContent = tx.totale;
    out('chilometrico').textContent = tx.chilometrico;
    out('totale')._v = undefined;
    out('chilometrico')._v = undefined;
  }
  out('extra').textContent = tx.extra;
  out('km').textContent = tx.km;
  out('copertura').innerHTML = tx.copertura;
  out('avvisi').innerHTML = tx.avvisi.map((a) => `<p class="avviso">${escHtml(a)}</p>`).join('');
}

form.addEventListener('input', (e) => {
  const t = e.target;
  if (!t.name) return;
  if (t.type === 'number') validateField(t);
  state[t.name] = readField(t);
  render();
});
form.addEventListener('submit', (e) => e.preventDefault());

const url = () => {
  const q = new URLSearchParams();
  CAMPI.forEach((k) => { if (state[k] !== null && state[k] !== undefined) q.set(k, state[k]); });
  return `${location.origin}${location.pathname}?${q}`;
};
const testo = () => {
  const { r, tx } = ultimo || { r: rimborsoChilometrico(state), tx: testiRimborso(rimborsoChilometrico(state), state) };
  return `Rimborso chilometrico: ${tx.totale} (${tx.km} × ${euro(state.tariffa || 0, 3)}/km${r.extra ? ` + ${tx.extra} di pedaggi e parcheggi` : ''}).\nCalcolo: ${url()}\nRisultati indicativi basati sui dati inseriti.`;
};
bindActions(root, { testo, url, titolo: document.title });

if (location.search) { CAMPI.forEach((k) => writeField(form, k, state[k])); }
render();
