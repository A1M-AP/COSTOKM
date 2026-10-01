/** Calcolatore principale (home e pagina neopatentati): fino a 3 veicoli a confronto. */
import { CATEGORIE, ALIMENTAZIONI, calcolaVeicolo, vocePrincipale } from './calc.js';
import { VEICOLO_DEFAULT, USO_DEFAULT, CONSUMO_DEFAULT } from './defaults.js';
import {
  euro, euroKm, pct, num, readField, writeField, validateField, caricaPrezzi, chiavePrezzo,
  bindActions, paramsFromUrl, parseParam, escHtml,
} from './ui.js';
import { donut, stackedBars, onResize } from './charts.js';
import { highlightHtml, avvisiHtml, residuoInfo, finInfo, anniLabel } from './testi.js';

const MAX_VEICOLI = 3;
const root = document.querySelector('[data-calc]');
const form = root.querySelector('#calc-form');
const preset = root.dataset.preset || 'standard';
const DEF_V = VEICOLO_DEFAULT[preset];
const DEF_U = USO_DEFAULT[preset];
const CAMPI = Object.keys(DEF_V);
const $ = (sel) => root.querySelector(sel);
const out = (name) => document.querySelector(`[data-out="${name}"]`);


/* ---------- Stato ---------- */
const state = {
  km: DEF_U.km,
  anni: DEF_U.anni,
  attivo: 0,
  veicoli: [{ ...DEF_V }],
};
let prezzi = {};
let ultimoRisultato = null;

function leggiUrl() {
  const p = paramsFromUrl();
  if (!p.has('km') && !p.has('n')) return;
  for (const k of ['km', 'anni']) {
    const v = parseParam(p.get(k));
    if (typeof v === 'number') state[k] = v;
  }
  const n = Math.min(MAX_VEICOLI, Math.max(1, Number(p.get('n')) || 1));
  state.veicoli = [];
  for (let i = 1; i <= n; i++) {
    const v = { ...DEF_V, nome: i === 1 ? DEF_V.nome : `Auto ${i}` };
    for (const k of CAMPI) {
      const raw = p.get(k + i);
      if (raw === null) continue;
      const val = parseParam(raw);
      if (k === 'nome') v.nome = String(raw).slice(0, 30);
      else if (k === 'alimentazione') { if (ALIMENTAZIONI[raw]) v.alimentazione = raw; }
      else if (k === 'residuoModo') { if (raw === 'perc' || raw === 'valore') v.residuoModo = raw; }
      else if (k === 'fin') v.fin = val === true || val === 1;
      else if (typeof val === 'number' || val === null) v[k] = val;
    }
    state.veicoli.push(v);
  }
}

function urlCondivisione() {
  const p = new URLSearchParams();
  p.set('km', state.km);
  p.set('anni', state.anni);
  p.set('n', state.veicoli.length);
  state.veicoli.forEach((v, idx) => {
    const i = idx + 1;
    for (const k of CAMPI) {
      const val = v[k];
      const def = k === 'nome' && i > 1 ? `Auto ${i}` : DEF_V[k];
      const isPrezzo = /^prezzo(Carb|Casa|Colonnina)$/.test(k);
      if (val === def && !isPrezzo) continue;
      if (val === null || val === undefined) continue;
      p.set(k + i, val);
    }
  });
  return `${location.origin}${location.pathname}?${p.toString()}`;
}

/** Riempie i prezzi mancanti con i valori medi di prezzi.json. */
function applicaPrezzi(v) {
  if (v.prezzoCarb === null && v.alimentazione !== 'elettrica') v.prezzoCarb = prezzi[chiavePrezzo(v.alimentazione)] ?? null;
  if (v.prezzoCasa === null) v.prezzoCasa = prezzi.elettricita_casa ?? null;
  if (v.prezzoColonnina === null) v.prezzoColonnina = prezzi.elettricita_colonnina ?? null;
}

/* ---------- Form ↔ stato ---------- */
const veicolo = () => state.veicoli[state.attivo];

function scriviForm() {
  writeField(form, 'km', state.km);
  writeField(form, 'anni', state.anni);
  const v = veicolo();
  for (const k of CAMPI) writeField(form, k, v[k]);
  aggiornaGruppi();
  form.querySelectorAll('input[type="number"]').forEach((el) => {
    el.removeAttribute('aria-invalid');
    const e = document.getElementById(el.id + '-e');
    if (e) e.hidden = true;
  });
}

function aggiornaGruppi() {
  const v = veicolo();
  const el = v.alimentazione === 'elettrica';
  form.querySelector('[data-group="termica"]').hidden = el;
  form.querySelector('[data-group="elettrica"]').hidden = !el;
  form.querySelector('[data-group="fin"]').hidden = !v.fin;
  form.querySelector('[data-group="residuo-valore"]').hidden = v.residuoModo !== 'valore';
  form.querySelector('[data-group="residuo-perc"]').hidden = v.residuoModo !== 'perc';
  const a = ALIMENTAZIONI[v.alimentazione];
  form.querySelectorAll('[data-unit-for="consumo"]').forEach((u) => {
    u.textContent = u.classList.contains('unit-label') ? `(${a.unitaConsumo})` : a.unitaConsumo;
  });
  form.querySelectorAll('[data-unit-for="prezzoCarb"]').forEach((u) => {
    u.textContent = u.classList.contains('unit-label') ? `(${a.unitaPrezzo})` : a.unitaPrezzo;
  });
}

function onInput(e) {
  const t = e.target;
  if (!t.name) return;
  if (t.type === 'number') validateField(t);
  const val = readField(t);
  if (t.name === 'km' || t.name === 'anni') {
    state[t.name] = val;
  } else if (CAMPI.includes(t.name)) {
    const v = veicolo();
    v[t.name] = val;
    if (t.name === 'nome') renderTabs();
    if (t.name === 'alimentazione') {
      if (val !== 'elettrica') {
        v.consumo = CONSUMO_DEFAULT[val] ?? v.consumo;
        v.prezzoCarb = prezzi[chiavePrezzo(val)] ?? null;
        writeField(form, 'consumo', v.consumo);
        writeField(form, 'prezzoCarb', v.prezzoCarb);
        validateField(form.elements.consumo);
        validateField(form.elements.prezzoCarb);
      }
    }
    if (['alimentazione', 'fin', 'residuoModo'].includes(t.name)) aggiornaGruppi();
  }
  render();
}

/* ---------- Schede veicolo (pattern ARIA tabs) ---------- */
const tabsEl = $('[data-tabs]');
const pannello = $('#pannello-veicolo');
const btnAdd = $('[data-add-veicolo]');
const btnRemove = $('[data-remove-veicolo]');

function renderTabs() {
  tabsEl.innerHTML = state.veicoli
    .map((v, i) => `<button type="button" role="tab" id="tab-${i}" aria-selected="${i === state.attivo}" aria-controls="pannello-veicolo" tabindex="${i === state.attivo ? 0 : -1}">${escHtml(v.nome || `Auto ${i + 1}`)}</button>`)
    .join('');
  pannello.setAttribute('aria-labelledby', `tab-${state.attivo}`);
  btnAdd.disabled = state.veicoli.length >= MAX_VEICOLI;
  btnRemove.hidden = state.veicoli.length < 2;
}

function seleziona(i, focus) {
  state.attivo = i;
  renderTabs();
  scriviForm();
  render();
  if (focus) tabsEl.querySelector(`#tab-${i}`).focus();
}

tabsEl.addEventListener('click', (e) => {
  const b = e.target.closest('[role="tab"]');
  if (b) seleziona(Number(b.id.slice(4)), false);
});
tabsEl.addEventListener('keydown', (e) => {
  const n = state.veicoli.length;
  let i = state.attivo;
  if (e.key === 'ArrowRight') i = (i + 1) % n;
  else if (e.key === 'ArrowLeft') i = (i - 1 + n) % n;
  else if (e.key === 'Home') i = 0;
  else if (e.key === 'End') i = n - 1;
  else return;
  e.preventDefault();
  seleziona(i, true);
});
btnAdd.addEventListener('click', () => {
  if (state.veicoli.length >= MAX_VEICOLI) return;
  state.veicoli.push({ ...veicolo(), nome: `Auto ${state.veicoli.length + 1}` });
  seleziona(state.veicoli.length - 1, true);
});
btnRemove.addEventListener('click', () => {
  if (state.veicoli.length < 2) return;
  state.veicoli.splice(state.attivo, 1);
  seleziona(Math.max(0, state.attivo - 1), true);
});

/* ---------- Risultati ---------- */
const uso = () => ({ km: state.km, anni: state.anni });

function campiNonValidi() {
  return [...form.querySelectorAll('input[type="number"]')].filter((el) => !el.closest('[hidden]') && !validateFieldSilently(el));
}
function validateFieldSilently(el) {
  if (el.validity.badInput) return false;
  if (el.value === '') return !el.required;
  const n = Number(el.value);
  return !(el.min !== '' && n < Number(el.min)) && !(el.max !== '' && n > Number(el.max));
}

let srTimer;
function render() {
  const v = veicolo();
  const invalidi = campiNonValidi();
  const avvisiEl = out('avvisi');
  const uv = uso();
  if (invalidi.length || !(uv.km > 0) || !(uv.anni > 0)) {
    root.querySelector('.risultati').classList.add('is-stale');
    avvisiEl.innerHTML = '<p class="avviso">Correggi i campi evidenziati per aggiornare il risultato.</p>';
    return;
  }
  root.querySelector('.risultati').classList.remove('is-stale');

  const r = calcolaVeicolo(v, uv);
  ultimoRisultato = r;

  out('nome').textContent = v.nome || `Auto ${state.attivo + 1}`;
  out('perKm').textContent = euro(r.perKm, 2);
  out('mensile').textContent = euro(r.mensile);
  out('annuo').textContent = euro(r.totaleAnnuo);
  out('periodo').textContent = euro(r.periodo);
  out('anniLabel').textContent = anniLabel(uv.anni);
  out('stickyText').textContent = `${euroKm(r.perKm)} · ${euro(r.mensile)}/mese`;
  avvisiEl.innerHTML = avvisiHtml(r);
  out('highlight').innerHTML = highlightHtml(r);

  donut($('[data-chart="donut"]'), CATEGORIE.map((c, i) => ({ label: c.label, value: r.voci[c.id], slot: i + 1 })), {
    value: euro(r.totaleAnnuo),
    label: 'all’anno',
  });

  const rows = CATEGORIE.map((c, i) => {
    const val = r.voci[c.id];
    return `<tr${val === 0 ? ' class="is-zero"' : ''}><th scope="row"><span class="sw s${i + 1}" aria-hidden="true"></span>${c.label}</th><td class="num">${euro(val)}</td><td class="num">${r.totaleAnnuo > 0 ? pct(val / r.totaleAnnuo) : '–'}</td></tr>`;
  }).join('');
  out('tabella').querySelector('tbody').innerHTML = rows;
  let tfoot = out('tabella').querySelector('tfoot');
  if (!tfoot) tfoot = out('tabella').appendChild(document.createElement('tfoot'));
  tfoot.innerHTML = `<tr><th scope="row">Totale annuo</th><td class="num">${euro(r.totaleAnnuo)}</td><td class="num">100%</td></tr>`;

  // Riepiloghi accanto ai titoli delle sezioni
  const sum = (k, val) => { const el = root.querySelector(`[data-sum="${k}"]`); if (el) el.textContent = val > 0 ? `${euro(val)}/anno` : ''; };
  sum('acquisto', r.voci.svalutazione + r.voci.interessi);
  sum('energia', r.voci.energia);
  sum('fissi', r.voci.assicurazione + r.voci.bollo + (+v.garage || 0) + (+v.abbonamenti || 0));
  sum('manutenzione', r.voci.manutenzione + r.voci.pneumatici);
  sum('altri', (+v.pedaggi || 0) + (+v.lavaggi || 0) + (+v.multe || 0));

  // Note di dettaglio su residuo e finanziamento
  out('residuoInfo').textContent = residuoInfo(v, r, uv.anni);
  out('finInfo').textContent = finInfo(v, r);

  clearTimeout(srTimer);
  srTimer = setTimeout(() => {
    out('srSummary').textContent = `Risultato aggiornato: ${euro(r.perKm, 2)} al chilometro, ${euro(r.mensile)} al mese, ${euro(r.totaleAnnuo)} all’anno.`;
  }, 900);

  renderConfronto();
}

function risultatiTutti() {
  return state.veicoli.map((v, i) => ({ v, nome: v.nome || `Auto ${i + 1}`, r: calcolaVeicolo(v, uso()) }));
}

function renderConfronto() {
  const box = $('[data-confronto]');
  if (state.veicoli.length < 2) { box.hidden = true; return; }
  box.hidden = false;
  const tutti = risultatiTutti();
  stackedBars($('[data-chart="bars"]'), tutti.map((t) => ({ nome: t.nome, voci: t.r.voci, totale: t.r.totaleAnnuo })), CATEGORIE);

  const minimo = tutti.reduce((a, b) => (b.r.totaleAnnuo < a.r.totaleAnnuo ? b : a));
  const head = `<thead><tr><th scope="col">Voce (€/anno)</th>${tutti.map((t) => `<th scope="col" class="num">${escHtml(t.nome)}</th>`).join('')}</tr></thead>`;
  const righe = CATEGORIE.map((c) => `<tr><th scope="row">${c.label}</th>${tutti.map((t) => `<td class="num">${euro(t.r.voci[c.id])}</td>`).join('')}</tr>`).join('');
  const tot = [
    ['Totale annuo', (r) => euro(r.totaleAnnuo)],
    ['Al mese', (r) => euro(r.mensile)],
    ['Al km', (r) => euro(r.perKm, 3)],
    [`In ${anniLabel(state.anni)}`, (r) => euro(r.periodo)],
  ].map(([l, f]) => `<tr><th scope="row">${l}</th>${tutti.map((t) => `<td class="num">${f(t.r)}</td>`).join('')}</tr>`).join('');
  const altri = tutti.filter((t) => t !== minimo);
  const delta = altri.length ? Math.min(...altri.map((t) => t.r.totaleAnnuo)) - minimo.r.totaleAnnuo : 0;
  out('tabellaConfronto').innerHTML = `<caption class="sr-only">Confronto dei costi tra i veicoli</caption>${head}<tbody>${righe}</tbody><tfoot>${tot}</tfoot>`;
  let nota = box.querySelector('.highlight');
  if (!nota) { nota = document.createElement('p'); nota.className = 'highlight'; box.insertBefore(nota, box.querySelector('.chart')); }
  nota.innerHTML = delta > 0
    ? `<strong>${escHtml(minimo.nome)}</strong> è la più conveniente: almeno ${euro(delta)} all’anno in meno (${euro(delta * state.anni)} in ${anniLabel(state.anni)}).`
    : 'I veicoli hanno lo stesso costo annuo.';
}

/* ---------- Testo per Copia / Stampa ---------- */
function testoRisultato() {
  const righe = risultatiTutti().map(({ nome, r }) => {
    const top = vocePrincipale(r);
    return `${nome}: ${euroKm(r.perKm)} · ${euro(r.mensile)}/mese · ${euro(r.totaleAnnuo)}/anno · ${euro(r.periodo)} in ${anniLabel(state.anni)}${top ? ` (voce principale: ${top.label.toLowerCase()}, ${pct(top.quota)})` : ''}${r.avvisi.length ? ` – attenzione: ${r.avvisi.join(' ')}` : ''}`;
  });
  return `Costo reale dell’auto (${num(state.km)} km/anno, ${anniLabel(state.anni)})\n${righe.join('\n')}\nCalcolo: ${urlCondivisione()}\nRisultati indicativi basati sui dati inseriti.`;
}

function preparaStampa() {
  const etichette = {};
  form.querySelectorAll('label[for]').forEach((l) => {
    const name = document.getElementById(l.htmlFor)?.name;
    if (name) etichette[name] = l.textContent.trim();
  });
  const tutti = state.veicoli;
  const righe = CAMPI.filter((k) => k !== 'nome').map((k) => {
    const lab = etichette[k] || ({ residuoModo: 'Modalità valore residuo', fin: 'Finanziamento' }[k] || k);
    return `<tr><th scope="row">${escHtml(lab)}</th>${tutti.map((v) => `<td class="num">${escHtml(v[k] === null ? '–' : v[k] === true ? 'sì' : v[k] === false ? 'no' : v[k])}</td>`).join('')}</tr>`;
  }).join('');
  out('stampaDati').innerHTML = `<h3>Dati inseriti (${num(state.km)} km/anno, ${anniLabel(state.anni)})</h3><table><thead><tr><th>Voce</th>${tutti.map((v) => `<th class="num">${escHtml(v.nome)}</th>`).join('')}</tr></thead><tbody>${righe}</tbody></table><p class="small">${escHtml(location.origin)} – ${new Date().toLocaleDateString('it-IT')}</p>`;
}

/* ---------- Avvio ---------- */
leggiUrl();
renderTabs();
scriviForm();
render();
form.addEventListener('input', onInput);
form.addEventListener('submit', (e) => e.preventDefault());
bindActions(root, { testo: testoRisultato, url: urlCondivisione, titolo: document.title, beforePrint: preparaStampa });
onResize(() => { if (ultimoRisultato) render(); });

caricaPrezzi().then((p) => {
  prezzi = p || {};
  state.veicoli.forEach(applicaPrezzi);
  scriviForm();
  render();
});

// Barra del risultato su mobile: visibile solo quando il pannello risultati non è a schermo.
const sticky = document.querySelector('[data-sticky]');
const ris = $('#risultati');
if (sticky && 'IntersectionObserver' in window) {
  let formVisibile = false;
  let risVisibile = false;
  const upd = () => { sticky.hidden = !(formVisibile && !risVisibile); };
  new IntersectionObserver(([e]) => { risVisibile = e.isIntersecting; upd(); }).observe(ris);
  new IntersectionObserver(([e]) => { formVisibile = e.isIntersecting; upd(); }).observe(form);
}
