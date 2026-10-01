/** Pagina /confronto-elettrica-benzina/: costo termica vs elettrica e punto di pareggio. */
import { CONFRONTO_DEFAULT, CONSUMO_DEFAULT } from './defaults.js';
import { ALIMENTAZIONI } from './calc.js';
import { calcolaConfronto, testoPareggio, testoDifferenza, tabellaConfronto, CAMPI_T, CAMPI_E } from './confronto-core.js';
import { euro, num, readField, writeField, validateField, caricaPrezzi, chiavePrezzo, bindActions, paramsFromUrl, parseParam, escHtml } from './ui.js';
import { lineChart, onResize } from './charts.js';
import { anniLabel } from './testi.js';

const root = document.querySelector('[data-confronto-calc]');
const form = root.querySelector('#calc-form');
const out = (n) => document.querySelector(`[data-out="${n}"]`);
const D = CONFRONTO_DEFAULT;
const state = { km: D.km, anni: D.anni, termica: { ...D.termica }, elettrica: { ...D.elettrica } };
let prezzi = {};
let ultimo = null;

// Parametri dall'URL (link "Condividi")
const p = paramsFromUrl();
for (const k of ['km', 'anni']) { const v = parseParam(p.get(k)); if (typeof v === 'number') state[k] = v; }
for (const k of CAMPI_T) {
  const raw = p.get('t_' + k);
  if (raw === null) continue;
  if (k === 'alimentazione') { if (ALIMENTAZIONI[raw] && raw !== 'elettrica') state.termica.alimentazione = raw; } else { const v = parseParam(raw); if (typeof v === 'number') state.termica[k] = v; }
}
for (const k of CAMPI_E) { const v = parseParam(p.get('e_' + k)); if (typeof v === 'number') state.elettrica[k] = v; }

function scriviForm() {
  writeField(form, 'km', state.km);
  writeField(form, 'anni', state.anni);
  CAMPI_T.forEach((k) => writeField(form, 't_' + k, state.termica[k]));
  CAMPI_E.forEach((k) => writeField(form, 'e_' + k, state.elettrica[k]));
  aggiornaUnita();
}

function aggiornaUnita() {
  const a = ALIMENTAZIONI[state.termica.alimentazione];
  form.querySelectorAll('[data-unit-for="t_consumo"]').forEach((u) => { u.textContent = u.classList.contains('unit-label') ? `(${a.unitaConsumo})` : a.unitaConsumo; });
  form.querySelectorAll('[data-unit-for="t_prezzoCarb"]').forEach((u) => { u.textContent = u.classList.contains('unit-label') ? `(${a.unitaPrezzo})` : a.unitaPrezzo; });
}

function valido() {
  return [...form.querySelectorAll('input[type="number"]')].every((el) => {
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
  out('nomeT').textContent = res.nomeT;
  out('tAnno').textContent = `${euro(res.rt.totaleAnnuo)}/anno`;
  out('tKm').textContent = `${euro(res.rt.perKm, 3)}/km`;
  out('eAnno').textContent = `${euro(res.re.totaleAnnuo)}/anno`;
  out('eKm').textContent = `${euro(res.re.perKm, 3)}/km`;
  out('differenza').innerHTML = testoDifferenza(res, state);
  out('tabella').innerHTML = tabellaConfronto(res, state);
  out('stickyText').textContent = tp.titolo.replace('L’elettrica conviene', 'Elettrica conveniente');

  const pk = res.p.km;
  const xMax = Math.max(30000, state.km * 1.5, pk && pk > 0 ? Math.min(pk * 1.6, 150000) : 0);
  lineChart(root.querySelector('[data-chart="linee"]'), [
    { nome: res.nomeT, slot: 2, f: (km) => res.rt.fissoAnnuo + res.rt.variabilePerKm * km },
    { nome: 'Auto elettrica', slot: 1, f: (km) => res.re.fissoAnnuo + res.re.variabilePerKm * km },
  ], { xMax: Math.ceil(xMax / 10000) * 10000, pareggio: res.p.esito === 'oltre' || res.p.esito === 'sotto' ? pk : null, kmUtente: state.km });
}

function onInput(e) {
  const t = e.target;
  if (!t.name) return;
  if (t.type === 'number') validateField(t);
  const val = readField(t);
  if (t.name === 'km' || t.name === 'anni') state[t.name] = val;
  else if (t.name.startsWith('t_')) {
    const k = t.name.slice(2);
    state.termica[k] = val;
    if (k === 'alimentazione') {
      state.termica.consumo = CONSUMO_DEFAULT[val] ?? state.termica.consumo;
      state.termica.prezzoCarb = prezzi[chiavePrezzo(val)] ?? null;
      writeField(form, 't_consumo', state.termica.consumo);
      writeField(form, 't_prezzoCarb', state.termica.prezzoCarb);
      aggiornaUnita();
    }
  } else if (t.name.startsWith('e_')) state.elettrica[t.name.slice(2)] = val;
  render();
}

function url() {
  const q = new URLSearchParams({ km: state.km, anni: state.anni });
  CAMPI_T.forEach((k) => { if (state.termica[k] !== null && state.termica[k] !== undefined) q.set('t_' + k, state.termica[k]); });
  CAMPI_E.forEach((k) => { if (state.elettrica[k] !== null && state.elettrica[k] !== undefined) q.set('e_' + k, state.elettrica[k]); });
  return `${location.origin}${location.pathname}?${q}`;
}

function testo() {
  const r = ultimo || calcolaConfronto(state);
  const tp = testoPareggio(r);
  return `${tp.titolo}.\n${r.nomeT}: ${euro(r.rt.totaleAnnuo)}/anno (${euro(r.rt.perKm, 3)}/km)\nAuto elettrica: ${euro(r.re.totaleAnnuo)}/anno (${euro(r.re.perKm, 3)}/km)\nCon ${num(state.km)} km/anno per ${anniLabel(state.anni)}.\nCalcolo: ${url()}\nRisultati indicativi basati sui dati inseriti.`;
}

scriviForm();
render();
form.addEventListener('input', onInput);
form.addEventListener('submit', (e) => e.preventDefault());
bindActions(root, { testo, url, titolo: document.title });
onResize(render);

caricaPrezzi().then((pr) => {
  prezzi = pr || {};
  if (state.termica.prezzoCarb === null) state.termica.prezzoCarb = prezzi[chiavePrezzo(state.termica.alimentazione)] ?? null;
  if (state.elettrica.prezzoCasa === null) state.elettrica.prezzoCasa = prezzi.elettricita_casa ?? null;
  if (state.elettrica.prezzoColonnina === null) state.elettrica.prezzoColonnina = prezzi.elettricita_colonnina ?? null;
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
