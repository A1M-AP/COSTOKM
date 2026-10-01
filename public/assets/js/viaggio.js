/** Pagina /costo-carburante-viaggio/: costo di un singolo tragitto. */
import { VIAGGIO_DEFAULT, CONSUMO_DEFAULT } from './defaults.js';
import { ALIMENTAZIONI } from './calc.js';
import { uscitaViaggio, CAMPI_VIAGGIO, chiavePrezzoViaggio } from './viaggio-core.js';
import { readField, writeField, validateField, caricaPrezzi, bindActions, paramsFromUrl, parseParam, escHtml } from './ui.js';

const root = document.querySelector('[data-viaggio]');
const form = root.querySelector('#calc-form');
const out = (n) => document.querySelector(`[data-out="${n}"]`);
const state = { ...VIAGGIO_DEFAULT };
let prezzi = {};

const p = paramsFromUrl();
for (const k of CAMPI_VIAGGIO) {
  const raw = p.get(k);
  if (raw === null) continue;
  if (k === 'alimentazione') { if (ALIMENTAZIONI[raw]) state.alimentazione = raw; } else if (k === 'andataRitorno') state.andataRitorno = raw === 'true';
  else { const v = parseParam(raw); if (typeof v === 'number') state[k] = v; }
}

function aggiornaUnita() {
  const a = ALIMENTAZIONI[state.alimentazione];
  const set = (name, txt) => form.querySelectorAll(`[data-unit-for="${name}"]`).forEach((u) => { u.textContent = u.classList.contains('unit-label') ? `(${txt})` : txt; });
  set('consumo', a.unitaConsumo);
  set('prezzo', a.unitaPrezzo);
}

function scriviForm() {
  CAMPI_VIAGGIO.forEach((k) => writeField(form, k, state[k]));
  aggiornaUnita();
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
  ultimo = uscitaViaggio(state);
  for (const [k, v] of Object.entries(ultimo.valori)) out(k).textContent = v;
  out('avvisi').innerHTML = ultimo.avvisi.map((a) => `<p class="avviso">${escHtml(a)}</p>`).join('');
}

function onInput(e) {
  const t = e.target;
  if (!t.name) return;
  if (t.type === 'number') validateField(t);
  state[t.name] = readField(t);
  if (t.name === 'alimentazione') {
    state.consumo = t.value === 'elettrica' ? 16 : CONSUMO_DEFAULT[t.value] ?? state.consumo;
    state.prezzo = prezzi[chiavePrezzoViaggio(t.value)] ?? null;
    writeField(form, 'consumo', state.consumo);
    writeField(form, 'prezzo', state.prezzo);
    aggiornaUnita();
  }
  render();
}

const url = () => {
  const q = new URLSearchParams();
  CAMPI_VIAGGIO.forEach((k) => { if (state[k] !== null && state[k] !== undefined) q.set(k, state[k]); });
  return `${location.origin}${location.pathname}?${q}`;
};
const testo = () => {
  const v = (ultimo || uscitaViaggio(state)).valori;
  return `Costo del viaggio: ${v.carburante} di ${state.alimentazione === 'elettrica' ? 'energia' : 'carburante'}, ${v.totale} con pedaggi e parcheggio, ${v.perPersona} a persona.\n${v.dettaglio}\nCalcolo: ${url()}\nRisultati indicativi basati sui dati inseriti.`;
};

scriviForm();
render();
form.addEventListener('input', onInput);
form.addEventListener('submit', (e) => e.preventDefault());
bindActions(root, { testo, url, titolo: document.title });
caricaPrezzi().then((pr) => {
  prezzi = pr || {};
  if (state.prezzo === null) state.prezzo = prezzi[chiavePrezzoViaggio(state.alimentazione)] ?? null;
  scriviForm();
  render();
});
