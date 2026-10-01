import { VEICOLO_DEFAULT, USO_DEFAULT } from '../public/assets/js/defaults.js';
import { CATEGORIE, calcolaVeicolo } from '../public/assets/js/calc.js';
import { euro, euroKm, pct } from '../public/assets/js/ui.js';
import { donutSvg } from '../public/assets/js/charts.js';
import { highlightHtml, avvisiHtml, residuoInfo, finInfo, anniLabel } from '../public/assets/js/testi.js';

const prezzoDi = (prezzi, k) => (typeof prezzi?.prezzi?.[k]?.valore === 'number' && prezzi.prezzi[k].valore > 0 ? prezzi.prezzi[k].valore : null);

/**
 * Markup del calcolatore principale (home e neopatentati).
 * I valori iniziali sono precompilati al build: la pagina è utilizzabile e
 * stabile (nessuno spostamento) prima che il JavaScript si avvii.
 */
export function calculator(c, preset = 'standard') {
  const u = USO_DEFAULT[preset];
  const base = VEICOLO_DEFAULT[preset];
  // Stessi prezzi che il browser leggerà da /data/prezzi.json
  const v = {
    ...base,
    prezzoCarb: base.prezzoCarb ?? prezzoDi(c.prezzi, base.alimentazione === 'ibrida' ? 'benzina' : base.alimentazione),
    prezzoCasa: base.prezzoCasa ?? prezzoDi(c.prezzi, 'elettricita_casa'),
    prezzoColonnina: base.prezzoColonnina ?? prezzoDi(c.prezzi, 'elettricita_colonnina'),
  };
  const r = calcolaVeicolo(v, u);
  const f = (o) => c.field({ value: v[o.name], ...o });
  const sum = (val) => (val > 0 ? `${euro(val)}/anno` : '');

  return `<div class="calc" data-calc data-preset="${preset}">
<form class="calc-form" id="calc-form" novalidate aria-label="Dati del calcolo">
  <p class="calc-note">Valori di esempio già inseriti: <strong>sostituiscili con i tuoi</strong>. Il risultato si aggiorna in tempo reale.</p>

  <fieldset class="uso">
    <legend class="sr-only">Utilizzo (comune a tutti i veicoli)</legend>
    <div class="grid-2">
      ${c.field({ name: 'km', label: 'Km percorsi all’anno', unit: 'km', value: u.km, min: 100, max: 200000, step: 1, required: true })}
      ${c.field({ name: 'anni', label: 'Anni di possesso', unit: 'anni', value: u.anni, min: 1, max: 30, step: 1, required: true })}
    </div>
  </fieldset>

  <div class="veicoli-bar">
    <div class="tabs" role="tablist" aria-label="Veicoli da confrontare" data-tabs>
      <button type="button" role="tab" id="tab-0" aria-selected="true" aria-controls="pannello-veicolo" tabindex="0">${v.nome}</button>
    </div>
    <button type="button" class="btn btn-small btn-add" data-add-veicolo>+ Aggiungi auto <span class="sr-only">da confrontare</span><span class="add-count">(max 3)</span></button>
  </div>

  <div id="pannello-veicolo" role="tabpanel" aria-labelledby="tab-0" class="pannello">
    <div class="nome-row">
      <div class="field">
        <label for="f-nome">Nome del veicolo</label>
        <div class="input-wrap"><input id="f-nome" name="nome" type="text" maxlength="30" value="${v.nome}" autocomplete="off"></div>
      </div>
      <button type="button" class="btn btn-small btn-ghost btn-remove" data-remove-veicolo hidden>Rimuovi questo veicolo</button>
    </div>

    <details class="sezione" open>
      <summary><span>Acquisto</span><span class="sum-val" data-sum="acquisto">${sum(r.voci.svalutazione + r.voci.interessi)}</span></summary>
      <div class="sezione-body">
        <div class="field">
          <span class="label-like" id="residuo-modo-label">Come stimi il valore a fine possesso?</span>
          <div class="seg" role="radiogroup" aria-labelledby="residuo-modo-label">
            <label><input type="radio" name="residuoModo" value="valore"${v.residuoModo === 'valore' ? ' checked' : ''}> Valore residuo in €</label>
            <label><input type="radio" name="residuoModo" value="perc"${v.residuoModo === 'perc' ? ' checked' : ''}> Svalutazione % annua</label>
          </div>
        </div>
        <div class="grid-2">
          ${f({ name: 'prezzo', label: 'Prezzo d’acquisto', unit: '€', min: 0, max: 1000000, required: true, hint: 'Prezzo finale pagato, al netto di sconti e incentivi.' })}
          ${f({ name: 'residuo', label: 'Valore residuo stimato', unit: '€', min: 0, max: 1000000, group: 'residuo-valore', hidden: v.residuoModo !== 'valore', hint: 'Quanto pensi di ricavare dalla vendita o dalla permuta.' })}
          ${f({ name: 'svalPerc', label: 'Svalutazione annua', unit: '%', min: 0, max: 60, group: 'residuo-perc', hidden: v.residuoModo !== 'perc', hint: 'Perdita di valore annua, sul valore dell’anno precedente.' })}
          <p class="calc-hint" data-out="residuoInfo">${residuoInfo(v, r, u.anni)}</p>
        </div>
        <label class="check check--block"><input type="checkbox" name="fin"${v.fin ? ' checked' : ''}> Acquisto con finanziamento</label>
        <div class="grid-3" data-group="fin"${v.fin ? '' : ' hidden'}>
          ${f({ name: 'finImporto', label: 'Importo finanziato', unit: '€', min: 0, max: 1000000 })}
          ${f({ name: 'finTan', label: 'TAN', unit: '%', min: 0, max: 30 })}
          ${f({ name: 'finMesi', label: 'Durata', unit: 'mesi', min: 1, max: 120, step: 1 })}
          <p class="calc-hint" data-out="finInfo">${finInfo(v, r)}</p>
        </div>
        ${c.affiliate('noleggio')}
      </div>
    </details>

    <details class="sezione" open>
      <summary><span>Alimentazione e consumi</span><span class="sum-val" data-sum="energia">${sum(r.voci.energia)}</span></summary>
      <div class="sezione-body">
        ${c.select({ name: 'alimentazione', label: 'Alimentazione', value: v.alimentazione, options: c.alimentazioniOptions() })}
        <div class="grid-2" data-group="termica"${v.alimentazione === 'elettrica' ? ' hidden' : ''}>
          ${f({ name: 'consumo', label: 'Consumo medio', unit: 'l/100 km', min: 0, max: 40, hint: 'Valore reale, di solito più alto di quello dichiarato.' })}
          ${f({ name: 'prezzoCarb', label: 'Prezzo carburante', unit: '€/l', min: 0, max: 10, placeholder: 'Inserisci' })}
        </div>
        <div data-group="elettrica"${v.alimentazione === 'elettrica' ? '' : ' hidden'}>
          <div class="grid-2">
            ${f({ name: 'consumoEl', label: 'Consumo medio', unit: 'kWh/100 km', min: 0, max: 60 })}
            ${f({ name: 'percCasa', label: 'Ricarica domestica', unit: '%', min: 0, max: 100, hint: 'Il resto si considera ricaricato alle colonnine.' })}
          </div>
          <div class="grid-2">
            ${f({ name: 'prezzoCasa', label: 'Prezzo energia a casa', unit: '€/kWh', min: 0, max: 5, placeholder: 'Inserisci' })}
            ${f({ name: 'prezzoColonnina', label: 'Prezzo alle colonnine', unit: '€/kWh', min: 0, max: 5, placeholder: 'Inserisci' })}
          </div>
        </div>
        ${c.prezziInfo()}
      </div>
    </details>

    <details class="sezione">
      <summary><span>Costi fissi annui</span><span class="sum-val" data-sum="fissi">${sum(r.voci.assicurazione + r.voci.bollo + v.garage + v.abbonamenti)}</span></summary>
      <div class="sezione-body">
        <div class="grid-2">
          ${f({ name: 'rc', label: 'Assicurazione RC auto', unit: '€/anno', max: 20000 })}
          ${f({ name: 'accessorie', label: 'Garanzie accessorie', unit: '€/anno', max: 20000, hint: 'Furto e incendio, kasko, cristalli, assistenza…' })}
        </div>
        ${c.affiliate('assicurazione')}
        ${f({ name: 'bollo', label: 'Bollo auto', unit: '€/anno', max: 10000, hint: 'Dipende da potenza (kW), classe ambientale e regione. Molte regioni prevedono esenzioni o riduzioni per le auto elettriche: verifica l’importo esatto sul sito della tua regione o dell’ACI.' })}
        <div class="grid-2">
          ${f({ name: 'garage', label: 'Garage / parcheggio', unit: '€/anno', max: 50000 })}
          ${f({ name: 'abbonamenti', label: 'Abbonamenti e servizi', unit: '€/anno', max: 20000, hint: 'Telepedaggio, app, assistenza stradale…' })}
        </div>
      </div>
    </details>

    <details class="sezione">
      <summary><span>Manutenzione</span><span class="sum-val" data-sum="manutenzione">${sum(r.voci.manutenzione + r.voci.pneumatici)}</span></summary>
      <div class="sezione-body">
        <div class="grid-2">
          ${f({ name: 'tagliandi', label: 'Tagliandi', unit: '€/anno', max: 20000 })}
          ${f({ name: 'riparazioni', label: 'Riparazioni impreviste', unit: '€/anno', max: 20000, hint: 'Stima prudente: freni, batteria, guasti.' })}
        </div>
        <div class="grid-2">
          ${f({ name: 'gommeCosto', label: 'Treno di pneumatici', unit: '€', max: 20000, hint: 'Quattro gomme, montaggio incluso.' })}
          ${f({ name: 'gommeKm', label: 'Durata pneumatici', unit: 'km', min: 1000, max: 200000, step: 1 })}
        </div>
      </div>
    </details>

    <details class="sezione">
      <summary><span>Altri costi</span><span class="sum-val" data-sum="altri">${sum(v.pedaggi + v.lavaggi + v.multe)}</span></summary>
      <div class="sezione-body">
        <div class="grid-3">
          ${f({ name: 'pedaggi', label: 'Pedaggi', unit: '€/anno', max: 50000 })}
          ${f({ name: 'lavaggi', label: 'Lavaggi', unit: '€/anno', max: 10000 })}
          ${f({ name: 'multe', label: 'Multe / ZTL (facoltativo)', unit: '€/anno', max: 50000 })}
        </div>
      </div>
    </details>
  </div>
</form>

<section class="risultati" id="risultati" aria-labelledby="ris-title">
  <h2 id="ris-title">Quanto ti costa <span data-out="nome">${v.nome}</span></h2>
  <div class="kpis">
    <div class="kpi kpi--hero"><span class="kpi-label">Costo al km</span><span class="kpi-value" data-out="perKm">${euro(r.perKm, 2)}</span></div>
    <div class="kpi"><span class="kpi-label">Al mese</span><span class="kpi-value" data-out="mensile">${euro(r.mensile)}</span></div>
    <div class="kpi"><span class="kpi-label">All’anno</span><span class="kpi-value" data-out="annuo">${euro(r.totaleAnnuo)}</span></div>
    <div class="kpi"><span class="kpi-label">In <span data-out="anniLabel">${anniLabel(u.anni)}</span></span><span class="kpi-value" data-out="periodo">${euro(r.periodo)}</span></div>
  </div>
  <p class="sr-only" aria-live="polite" data-out="srSummary"></p>
  <div class="avvisi" data-out="avvisi">${avvisiHtml(r)}</div>
  <p class="highlight" data-out="highlight">${highlightHtml(r)}</p>
  <figure class="chart chart--donut">
    <div class="donut-box" data-chart="donut" role="img" aria-label="Ripartizione del costo annuo per voce">${donutSvg(CATEGORIE.map((k, i) => ({ label: k.label, value: r.voci[k.id], slot: i + 1 })), { value: euro(r.totaleAnnuo), label: 'all’anno' })}</div>
    <figcaption class="sr-only">Ripartizione del costo annuo per voce di spesa. I valori sono riportati nella tabella seguente.</figcaption>
  </figure>
  <table class="tabella-voci" data-out="tabella">
    <caption class="sr-only">Costo annuo per voce</caption>
    <thead><tr><th scope="col">Voce</th><th scope="col" class="num">€/anno</th><th scope="col" class="num">%</th></tr></thead>
    <tbody>${CATEGORIE.map((k, i) => `<tr${r.voci[k.id] === 0 ? ' class="is-zero"' : ''}><th scope="row"><span class="sw s${i + 1}" aria-hidden="true"></span>${k.label}</th><td class="num">${euro(r.voci[k.id])}</td><td class="num">${r.totaleAnnuo > 0 ? pct(r.voci[k.id] / r.totaleAnnuo) : '–'}</td></tr>`).join('')}</tbody>
    <tfoot><tr><th scope="row">Totale annuo</th><td class="num">${euro(r.totaleAnnuo)}</td><td class="num">100%</td></tr></tfoot>
  </table>
  ${c.actions()}

  <div class="confronto" data-confronto hidden>
    <h3>Confronto tra i veicoli</h3>
    <figure class="chart">
      <div class="bars-box" data-chart="bars" role="img" aria-label="Costo annuo dei veicoli suddiviso per voce"></div>
      <figcaption class="sr-only">Costo annuo per veicolo, suddiviso per voce. I valori sono nella tabella di confronto.</figcaption>
    </figure>
    <div class="table-scroll" tabindex="0" role="region" aria-label="Tabella di confronto">
      <table class="tabella-confronto" data-out="tabellaConfronto"></table>
    </div>
  </div>

  <div class="print-only stampa-dati" data-out="stampaDati"></div>
  ${c.disclaimer()}
</section>
</div>
<a class="sticky-ris" href="#risultati" data-sticky hidden><span data-out="stickyText">${euroKm(r.perKm)} · ${euro(r.mensile)}/mese</span> <span aria-hidden="true">↓</span></a>`;
}
