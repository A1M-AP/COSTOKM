import { CONFRONTO_PRESET } from '../public/assets/js/defaults.js';
import { ALIMENTAZIONI } from '../public/assets/js/calc.js';
import { calcolaConfronto, testoPareggio, testoDifferenza, tabellaConfronto, applicaPrezziAuto } from '../public/assets/js/confronto-core.js';
import { euro } from '../public/assets/js/ui.js';

/** Valori di prezzi.json come oggetto chiave → numero (stessa forma usata nel browser). */
const valoriPrezzi = (prezzi) => Object.fromEntries(Object.entries(prezzi?.prezzi || {}).map(([k, v]) => [k, typeof v?.valore === 'number' && v.valore > 0 ? v.valore : null]));

/**
 * Strumento di confronto tra due auto con punto di pareggio, precompilato al build.
 * @param {object} c       componenti
 * @param {string} preset  chiave di CONFRONTO_PRESET
 * @param {{titoloA?:string, titoloB?:string}} opt
 */
const CONFRONTI = [
  { preset: 'elettrica-benzina', href: '/confronto-elettrica-benzina/', label: 'Elettrica o benzina' },
  { preset: 'diesel-benzina', href: '/diesel-o-benzina/', label: 'Diesel o benzina' },
  { preset: 'ibrida-benzina', href: '/costo-auto-ibrida/', label: 'Ibrida o benzina' },
  { preset: 'gpl-metano', href: '/gpl-o-metano/', label: 'GPL o metano' },
];

export function confrontoTool(c, preset) {
  const P = CONFRONTO_PRESET[preset];
  const pv = valoriPrezzi(c.prezzi);
  const s = { km: P.km, anni: P.anni, a: applicaPrezziAuto({ ...P.a }, pv), b: applicaPrezziAuto({ ...P.b }, pv) };
  const res = calcolaConfronto(s);
  const tp = testoPareggio(res);

  const scheda = (lettera, v, nome) => {
    const f = (o) => c.field({ prefix: lettera, value: v[o.name.slice(2)], ...o });
    const el = v.alimentazione === 'elettrica';
    const a = ALIMENTAZIONI[v.alimentazione];
    return `<details class="sezione" open>
    <summary><span data-out="titolo-${lettera}">${nome}</span></summary>
    <div class="sezione-body">
      ${c.select({ prefix: lettera, name: `${lettera}_alimentazione`, label: 'Alimentazione', value: v.alimentazione, options: c.alimentazioniOptions() })}
      <div class="grid-2">
        ${f({ name: `${lettera}_prezzo`, label: 'Prezzo d’acquisto', unit: '€', max: 1000000, required: true, hint: lettera === 'b' ? 'Al netto di eventuali incentivi.' : '' })}
        ${f({ name: `${lettera}_svalPerc`, label: 'Svalutazione annua', unit: '%', max: 60 })}
      </div>
      <div class="grid-2" data-group="${lettera}-termica"${el ? ' hidden' : ''}>
        ${f({ name: `${lettera}_consumo`, label: 'Consumo medio', unit: el ? 'l/100 km' : a.unitaConsumo, max: 40 })}
        ${f({ name: `${lettera}_prezzoCarb`, label: 'Prezzo carburante', unit: el ? '€/l' : a.unitaPrezzo, max: 10, placeholder: 'Inserisci' })}
      </div>
      <div class="grid-2" data-group="${lettera}-elettrica"${el ? '' : ' hidden'}>
        ${f({ name: `${lettera}_consumoEl`, label: 'Consumo medio', unit: 'kWh/100 km', max: 60 })}
        ${f({ name: `${lettera}_percCasa`, label: 'Ricarica a casa', unit: '%', max: 100 })}
        ${f({ name: `${lettera}_prezzoCasa`, label: 'Energia a casa', unit: '€/kWh', max: 5, placeholder: 'Inserisci' })}
        ${f({ name: `${lettera}_prezzoColonnina`, label: 'Colonnine', unit: '€/kWh', max: 5, placeholder: 'Inserisci' })}
      </div>
      <div class="grid-2">
        ${f({ name: `${lettera}_rc`, label: 'Assicurazione', unit: '€/anno', max: 20000 })}
        ${f({ name: `${lettera}_bollo`, label: 'Bollo', unit: '€/anno', max: 10000, hint: v.alimentazione === 'elettrica' ? 'Spesso esente o ridotto: verifica la tua regione.' : '' })}
        ${f({ name: `${lettera}_manutenzione`, label: 'Manutenzione', unit: '€/anno', max: 20000 })}
        ${f({ name: `${lettera}_gommeCosto`, label: 'Treno di gomme', unit: '€', max: 20000 })}
        ${f({ name: `${lettera}_gommeKm`, label: 'Durata gomme', unit: 'km', min: 1000, max: 200000, step: 1 })}
      </div>
    </div>
  </details>`;
  };

  const pillole = `<nav class="pills" aria-label="Altri confronti">${CONFRONTI.map((x) => (x.preset === preset ? `<a href="${x.href}" aria-current="page">${x.label}</a>` : `<a href="${x.href}">${x.label}</a>`)).join('')}</nav>`;
  return `${pillole}
<div class="calc" data-confronto-calc data-preset="${preset}">
<form class="calc-form" id="calc-form" novalidate aria-label="Dati del confronto">
  <p class="calc-note">Valori di esempio: <strong>sostituiscili con i tuoi</strong>. Puoi cambiare l’alimentazione di entrambe le auto.</p>
  <div class="grid-2">
    ${c.field({ name: 'km', label: 'Km all’anno', unit: 'km', value: s.km, min: 100, max: 200000, step: 1, required: true })}
    ${c.field({ name: 'anni', label: 'Anni di possesso', unit: 'anni', value: s.anni, min: 1, max: 30, step: 1, required: true })}
  </div>
  ${scheda('a', s.a, res.nomeA)}
  ${scheda('b', s.b, res.nomeB)}
  ${c.prezziInfo()}
  ${c.affiliate('noleggio')}
</form>

<section class="risultati" id="risultati" aria-labelledby="ris-title">
  <h2 id="ris-title" class="sr-only">Risultato del confronto</h2>
  <div class="kpi kpi--hero pareggio-box">
    <span class="kpi-label">Punto di pareggio</span>
    <span class="pareggio-titolo" data-out="pareggioTitolo">${tp.titolo}</span>
    <span class="pareggio-sotto" data-out="pareggioSotto">${tp.sotto}</span>
  </div>
  <div class="avvisi" data-out="avvisi">${res.avvisi.map((x) => `<p class="avviso">${x}</p>`).join('')}</div>
  <div class="kpis kpis--2">
    <div class="kpi"><span class="kpi-label" data-out="nomeA">${res.nomeA}</span><span class="kpi-value" data-out="aAnno">${euro(res.ra.totaleAnnuo)}/anno</span><span class="kpi-sub" data-out="aKm">${euro(res.ra.perKm, 3)}/km</span></div>
    <div class="kpi"><span class="kpi-label" data-out="nomeB">${res.nomeB}</span><span class="kpi-value" data-out="bAnno">${euro(res.rb.totaleAnnuo)}/anno</span><span class="kpi-sub" data-out="bKm">${euro(res.rb.perKm, 3)}/km</span></div>
  </div>
  <p class="highlight" data-out="differenza">${testoDifferenza(res, s)}</p>
  <figure class="chart">
    <div class="line-box" data-chart="linee" role="img" aria-label="Costo annuo delle due auto in funzione dei km percorsi"></div>
    <figcaption class="small">Costo annuo in funzione dei km percorsi. Il punto indica il pareggio, la linea verticale i tuoi km.</figcaption>
  </figure>
  <div class="table-scroll" tabindex="0" role="region" aria-label="Tabella di confronto">
    <table data-out="tabella">${tabellaConfronto(res, s)}</table>
  </div>
  ${c.actions()}
  ${c.disclaimer()}
</section>
</div>
<a class="sticky-ris" href="#risultati" data-sticky hidden><span data-out="stickyText">${tp.titolo}</span> <span aria-hidden="true">↓</span></a>`;
}
