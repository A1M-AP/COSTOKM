/** Pagine di confronto tra due auto (A e B, qualsiasi alimentazione) con punto di pareggio. */
import { CONFRONTO_PRESET, CONSUMO_DEFAULT } from './defaults.js';
import { ALIMENTAZIONI } from './calc.js';
import { calcolaConfronto, testoPareggio, testoDifferenza, tabellaConfronto, applicaPrezziAuto, CAMPI } from './confronto-core.js';
import { euro, num, readField, writeField, validateField, caricaPrezzi, chiavePrezzo, bindActions, paramsFromUrl, parseParam, escHtml, animaNumero } from './ui.js';
import { lineChart, onResize } from './charts.js';
import { anniLabel } from './testi.js';

const root = document.querySelector('[data-confronto-calc]');
const form = root.querySelector('#calc-form');
const out = (n) => document.querySelector(`[data-out="${n}"]`);
const P = CONFRONTO_PRESET[root.dataset.preset] || CONFRONTO_PRESET['elettrica-benzina'];
const state = { km: P.km, anni: P.anni, a: { ...P.a }, b: { ...P.b } };
let prezzi = {};
let ultimo = null;

// Parametri dall'URL (link "Condividi"): km, anni, a_<campo>, b_<campo>
const p = paramsFromUrl();
for (const k of ['km', 'anni']) { const v = parseParam(p.get(k)); if (typeof v === 'number') state[k] = v; }
for (const l of ['a', 'b']) {
  for (const k of CAMPI) {
    const raw = p.get(`${l}_${k}`);
    if (raw === null) continue;
    if (k === 'alimentazione') { if (ALIMENTAZIONI[raw]) state[l].alimentazione = raw; } else { const v = parseParam(raw); if (typeof v === 'number') state[l][k] = v; }
  }
}

function aggiornaScheda(l) {
  const v = state[l];
  const el = v.alimentazione === 'elettrica';
  form.querySelector(`[data-group="${l}-termica"]`).hidden = el;
  form.querySelector(`[data-group="${l}-elettrica"]`).hidden = !el;
  const a = ALIMENTAZIONI[v.alimentazione];
  const set = (name, txt) => form.querySelectorAll(`[data-unit-for="${name}"]`).forEach((u) => { u.textContent = u.classList.contains('unit-label') ? `(${txt})` : txt; });
  if (!el) { set(`${l}_consumo`, a.unitaConsumo); set(`${l}_prezzoCarb`, a.unitaPrezzo); }
}

function scriviForm() {
  writeField(form, 'km', state.km);
  writeField(form, 'anni', state.anni);
  for (const l of ['a', 'b']) {
    CAMPI.forEach((k) => writeField(form, `${l}_${k}`, state[l][k]));
    aggiornaScheda(l);
  }
}

function valido() {
  return [...form.querySelectorAll('input[type="number"]')].every((el) => {
    if (el.closest('[hidden]')) return true;
    if (el.validity.badInput) return false;
    if (el.value === '') return !el.required;
    const n = Number(el.value);
    return !(el.min !== '' && n < Number(el.min)) && !(el.max !== '' && n > Number(el.max));
  });
}

function render() {
  const ris = root.querySelector('.risultati');
  if (!valido()) {
    ris.classList.add('is-stale');
    out('avvisi').innerHTML = '<p class="avviso">Correggi i campi evidenziati per aggiornare il risultato.</p>';
    return;
  }
  ris.classList.remove('is-stale');
  const res = calcolaConfronto(state);
  ultimo = res;
  const tp = testoPareggio(res);
  out('pareggioTitolo').textContent = tp.titolo;
  out('pareggioSotto').innerHTML = tp.sotto;
  out('avvisi').innerHTML = res.avvisi.map((a) => `<p class="avviso">${escHtml(a)}</p>`).join('');
  out('nomeA').textContent = res.nomeA;
  out('nomeB').textContent = res.nomeB;
  out('titolo-a').textContent = res.nomeA;
  out('titolo-b').textContent = res.nomeB;
  animaNumero(out('aAnno'), res.ra.totaleAnnuo, (x) => `${euro(x)}/anno`);
  animaNumero(out('aKm'), res.ra.perKm, (x) => `${euro(x, 3)}/km`);
  animaNumero(out('bAnno'), res.rb.totaleAnnuo, (x) => `${euro(x)}/anno`);
  animaNumero(out('bKm'), res.rb.perKm, (x) => `${euro(x, 3)}/km`);
  out('differenza').innerHTML = testoDifferenza(res, state);
  out('tabella').innerHTML = tabellaConfronto(res, state);
  out('stickyText').textContent = tp.titolo;

  const pk = res.p.km;
  const xMax = Math.max(30000, state.km * 1.5, pk && pk > 0 ? Math.min(pk * 1.6, 150000) : 0);
  lineChart(root.querySelector('[data-chart="linee"]'), [
    { nome: res.nomeA, slot: 2, f: (km) => res.ra.fissoAnnuo + res.ra.variabilePerKm * km },
    { nome: res.nomeB, slot: 1, f: (km) => res.rb.fissoAnnuo + res.rb.variabilePerKm * km },
  ], { xMax: Math.ceil(xMax / 10000) * 10000, pareggio: res.p.esito === 'oltre' || res.p.esito === 'sotto' ? pk : null, kmUtente: state.km });
}

function onInput(e) {
  const t = e.target;
  if (!t.name) return;
  if (t.type === 'number') validateField(t);
  const val = readField(t);
  if (t.name === 'km' || t.name === 'anni') {
    state[t.name] = val;
  } else if (/^[ab]_/.test(t.name)) {
    const l = t.name[0];
    const k = t.name.slice(2);
    state[l][k] = val;
    if (k === 'alimentazione') {
      if (val !== 'elettrica') {
        state[l].consumo = CONSUMO_DEFAULT[val] ?? state[l].consumo;
        state[l].prezzoCarb = prezzi[chiavePrezzo(val)] ?? null;
        writeField(form, `${l}_consumo`, state[l].consumo);
        writeField(form, `${l}_prezzoCarb`, state[l].prezzoCarb);
      }
      aggiornaScheda(l);
    }
  }
  render();
}

function url() {
  const q = new URLSearchParams({ km: state.km, anni: state.anni });
  for (const l of ['a', 'b']) CAMPI.forEach((k) => { const v = state[l][k]; if (v !== null && v !== undefined) q.set(`${l}_${k}`, v); });
  return `${location.origin}${location.pathname}?${q}`;
}

function testo() {
  const r = ultimo || calcolaConfronto(state);
  const tp = testoPareggio(r);
  return `${tp.titolo}.\n${r.nomeA}: ${euro(r.ra.totaleAnnuo)}/anno (${euro(r.ra.perKm, 3)}/km)\n${r.nomeB}: ${euro(r.rb.totaleAnnuo)}/anno (${euro(r.rb.perKm, 3)}/km)\nCon ${num(state.km)} km/anno per ${anniLabel(state.anni)}.\nCalcolo: ${url()}\nRisultati indicativi basati sui dati inseriti.`;
}

form.addEventListener('input', onInput);
form.addEventListener('submit', (e) => e.preventDefault());
bindActions(root, { testo, url, titolo: document.title });
onResize(render);

// Primo calcolo dopo il caricamento dei prezzi: l'HTML è già precompilato con gli stessi valori.
caricaPrezzi().then((pr) => {
  prezzi = pr || {};
  applicaPrezziAuto(state.a, prezzi);
  applicaPrezziAuto(state.b, prezzi);
  scriviForm();
  render();
});

const sticky = document.querySelector('[data-sticky]');
if (sticky && 'IntersectionObserver' in window) {
  let f = false, r = false;
  const upd = () => { sticky.hidden = !(f && !r); };
  new IntersectionObserver(([e]) => { r = e.isIntersecting; upd(); }).observe(root.querySelector('#risultati'));
  new IntersectionObserver(([e]) => { f = e.isIntersecting; upd(); }).observe(form);
}
