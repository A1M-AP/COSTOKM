import { correlati } from '../correlati.mjs';
import { esc, dataIt } from '../util.mjs';
import { num } from '../../public/assets/js/ui.js';

const CARB = [
  { k: 'benzina', label: 'Benzina', modo: 'self', unita: '€/l' },
  { k: 'diesel', label: 'Gasolio', modo: 'self', unita: '€/l' },
  { k: 'gpl', label: 'GPL', modo: 'servito', unita: '€/l' },
  { k: 'metano', label: 'Metano', modo: 'servito', unita: '€/kg' },
];

const faq = [
  {
    q: 'Quanto costa la benzina oggi?',
    a: 'In cima alla pagina trovi il prezzo medio nazionale della benzina self service rilevato alle 8 di mattina, aggiornato ogni giorno sui prezzi comunicati da circa 20.000 distributori al Ministero delle Imprese e del Made in Italy.',
  },
  {
    q: 'Perché il prezzo che vedo al distributore è diverso dalla media?',
    a: 'La media nazionale è calcolata su tutti gli impianti della rete stradale. Il singolo distributore può essere più caro o più economico in base al marchio, alla zona, alla modalità self o servito e alla concorrenza locale. In autostrada i prezzi sono in genere più alti.',
  },
  {
    q: 'Perché per GPL e metano si usa il prezzo servito?',
    a: 'Perché è la modalità di erogazione più comune per questi carburanti ed è quella usata anche nelle medie ufficiali pubblicate dal Ministero. Per benzina e gasolio si usa invece il prezzo self service.',
  },
  {
    q: 'Ogni quanto vengono aggiornati i prezzi?',
    a: 'Ogni giorno. I distributori comunicano i prezzi al Ministero, che li pubblica come dati aperti con i prezzi in vigore alle 8 di mattina; il nostro sistema li scarica, calcola le medie e aggiorna la pagina automaticamente.',
  },
  {
    q: 'Le medie della pagina sono ufficiali?',
    a: 'Sono calcolate da costokm.it sui dati aperti ufficiali del Ministero, con lo stesso criterio delle medie pubblicate dal Ministero (rete stradale, self per benzina e gasolio, servito per GPL e metano). Possono differire di qualche millesimo dalle medie ufficiali.',
  },
];

export default {
  path: '/prezzo-benzina-oggi/',
  priority: 0.9,
  title: 'Prezzo benzina oggi: media nazionale e per regione | costokm.it',
  ogTitle: 'Prezzo benzina e gasolio oggi in Italia',
  description: 'Prezzo medio di oggi di benzina, gasolio, GPL e metano in Italia e regione per regione, aggiornato ogni giorno sui dati ufficiali del Ministero, con andamento.',
  h1: 'Prezzo benzina e gasolio oggi',
  breadcrumb: 'Prezzi carburanti oggi',
  scripts: ['/assets/js/prezzi-oggi.js'],
  faq,
  body: (c) => {
    const pz = c.prezzi.prezzi;
    const serie = c.storico?.serie || [];
    const rif = pz.benzina?.riferimento;
    const ultimo = serie[serie.length - 1];
    const prec = ultimo && ultimo.data === rif ? serie[serie.length - 2] : null;
    const prezzo3 = (v) => (typeof v === 'number' ? v.toLocaleString('it-IT', { minimumFractionDigits: 3, maximumFractionDigits: 3 }) : 'n.d.');

    const variazione = (k) => {
      if (!prec || typeof prec[k] !== 'number' || typeof pz[k]?.valore !== 'number') return '<span class="var">variazione dal giorno prima disponibile dal prossimo aggiornamento</span>';
      const d = Math.round((pz[k].valore - prec[k]) * 1000) / 1000;
      if (d === 0) return '<span class="var">invariato rispetto al giorno prima</span>';
      const giu = d < 0;
      return `<span class="var ${giu ? 'var--giu' : 'var--su'}"><span aria-hidden="true">${giu ? '▼' : '▲'}</span> ${giu ? 'in calo' : 'in aumento'} di ${prezzo3(Math.abs(d))} € rispetto al giorno prima</span>`;
    };

    const schede = CARB.map((x) => `<div class="prezzo-card">
      <span class="kpi-label">${x.label} <span class="modo">${x.modo}</span></span>
      <span class="prezzo-valore">${prezzo3(pz[x.k]?.valore)} <small>${x.unita}</small></span>
      ${variazione(x.k)}
    </div>`).join('');

    // Tabella regionale: evidenzia la regione più economica e la più cara per ciascun carburante
    const reg = c.regioni?.regioni || {};
    const nomi = Object.keys(reg).sort((a, b) => a.localeCompare(b, 'it'));
    const estremi = Object.fromEntries(CARB.map((x) => {
      const v = nomi.map((r) => reg[r][x.k]).filter((n) => typeof n === 'number');
      return [x.k, { min: Math.min(...v), max: Math.max(...v) }];
    }));
    const cella = (r, k) => {
      const v = reg[r][k];
      if (typeof v !== 'number') return '<td class="num">–</td>';
      const cls = v === estremi[k].min ? ' is-min' : v === estremi[k].max ? ' is-max' : '';
      const sr = cls === ' is-min' ? '<span class="sr-only"> (la più bassa)</span>' : cls === ' is-max' ? '<span class="sr-only"> (la più alta)</span>' : '';
      return `<td class="num${cls}">${prezzo3(v)}${sr}</td>`;
    };
    const tabellaRegioni = nomi.length
      ? `<div class="table-scroll" tabindex="0" role="region" aria-label="Prezzi medi per regione">
  <table class="tabella-regioni">
    <caption class="sr-only">Prezzi medi dei carburanti per regione, ${esc(dataIt(c.regioni.riferimento))}</caption>
    <thead><tr><th scope="col">Regione</th>${CARB.map((x) => `<th scope="col" class="num">${x.label}</th>`).join('')}</tr></thead>
    <tbody>${nomi.map((r) => `<tr><th scope="row">${esc(r)}</th>${CARB.map((x) => cella(r, x.k)).join('')}</tr>`).join('')}</tbody>
  </table>
  </div>
  <p class="small legenda-regioni"><span class="chip is-min">verde</span> regione più economica · <span class="chip is-max">rosso</span> regione più cara · “–” = meno di 5 distributori. Prezzi in €/l (metano €/kg), rilevazione del ${esc(dataIt(c.regioni.riferimento))}.</p>`
      : '<p class="avviso">Le medie per regione saranno disponibili dal prossimo aggiornamento automatico dei dati.</p>';

    const grafico = serie.length >= 2
      ? `<div class="periodi" role="group" aria-label="Periodo del grafico">
    <button type="button" class="btn btn-small btn-ghost" data-periodo="30" aria-pressed="false">30 giorni</button>
    <button type="button" class="btn btn-small btn-ghost" data-periodo="90" aria-pressed="true">90 giorni</button>
    <button type="button" class="btn btn-small btn-ghost" data-periodo="730" aria-pressed="false">Tutto</button>
  </div>
  <figure class="chart">
    <div class="line-box" data-chart="storico" role="img" aria-label="Andamento del prezzo medio nazionale di benzina e gasolio self"></div>
    <figcaption class="small">Medie nazionali giornaliere, rete stradale, in €/l.</figcaption>
  </figure>`
      : `<p class="small">Il grafico dell’andamento si costruisce giorno per giorno a partire dal ${esc(dataIt(serie[0]?.data || rif))}: sarà visibile dal prossimo aggiornamento.</p>`;

    return `<div class="wrap">
<section class="intro">
  <h1>Prezzo benzina e gasolio oggi</h1>
  <p>Prezzi medi nazionali rilevati alle 8:00 del <strong>${esc(dataIt(rif))}</strong> su tutti i distributori della rete stradale. Aggiornati automaticamente ogni giorno.</p>
</section>

<section class="prezzi-oggi" aria-label="Prezzi medi di oggi">
  <div class="prezzi-grid">${schede}</div>
  <p class="small fonte-prezzi">Fonte: elaborazione costokm.it su <a href="https://www.mimit.gov.it/it/open-data/elenco-dataset/carburanti-prezzi-praticati-e-anagrafica-degli-impianti" rel="noopener" target="_blank">open data MIMIT – Osservaprezzi carburanti<span class="sr-only"> (sito esterno)</span></a>. Autostrade escluse; self per benzina e gasolio, servito per GPL e metano.</p>
  <div class="cta-row">
    <a class="btn btn-primary" href="/costo-carburante-viaggio/">Calcola il costo di un viaggio</a>
    <a class="btn btn-secondary" href="/">Quanto ti costa la tua auto</a>
  </div>
</section>

${c.ad('dopo-calcolatore', 'wide')}

<section class="card sezione-prezzi" aria-labelledby="andamento-title">
  <h2 id="andamento-title">Andamento dei prezzi</h2>
  ${grafico}
</section>

<section class="card sezione-prezzi" aria-labelledby="regioni-title">
  <h2 id="regioni-title">Prezzi medi per regione</h2>
  ${tabellaRegioni}
</section>

<div class="layout-article">
<div>
<article class="article">
  <h2>Come calcoliamo il prezzo medio di oggi</h2>
  <p>Ogni distributore di carburante in Italia è obbligato a comunicare al Ministero delle Imprese e del Made in Italy i prezzi che pratica. Il Ministero pubblica ogni giorno questi dati come <strong>dati aperti</strong>, con i prezzi in vigore alle 8 di mattina e l’anagrafica di tutti gli impianti. Ogni mattina il nostro sistema scarica i file, esclude gli impianti autostradali e calcola la media dei prezzi praticati dagli impianti della rete stradale:</p>
  <ul>
    <li><strong>benzina e gasolio</strong> in modalità self service;</li>
    <li><strong>GPL e metano</strong> in modalità servito, la più diffusa per questi carburanti.</li>
  </ul>
  <p>È lo stesso criterio delle medie nazionali pubblicate dal Ministero; le nostre medie possono differire di qualche millesimo per arrotondamenti e per i controlli che usiamo per scartare valori palesemente errati.</p>

  <h2>Come si forma il prezzo alla pompa</h2>
  <p>Il prezzo che paghi per un litro di benzina o gasolio è composto da tre parti. La prima è la <strong>componente industriale</strong>: il costo del prodotto raffinato, che segue le quotazioni internazionali, più i margini di trasporto, distribuzione e vendita. La seconda sono le <strong>accise</strong>, un’imposta fissa per litro stabilita dallo Stato. La terza è l’<strong>IVA al 22%</strong>, che si applica sul prezzo comprensivo delle accise. Imposte e accise pesano in genere per più della metà del prezzo finale: per questo le variazioni del petrolio si riflettono sulla pompa solo in parte, e con qualche giorno di ritardo.</p>

  <h2>Perché i prezzi cambiano da una regione all’altra</h2>
  <p>Il prezzo alla pompa è formato in gran parte da imposte (accise e IVA) e dal costo della materia prima, uguali in tutta Italia. Le differenze tra regioni dipendono da altri fattori: il costo della logistica, la concorrenza tra distributori, la presenza di pompe bianche e, in alcune regioni, eventuali imposte o agevolazioni regionali. Anche nella stessa città il prezzo può variare di diversi centesimi da un impianto all’altro.</p>
  ${c.ad('articolo')}
  <h2>Come risparmiare sul carburante</h2>
  <ol>
    <li><strong>Usa il self service</strong>: per benzina e gasolio costa meno del servito.</li>
    <li><strong>Evita l’autostrada per il pieno</strong>: i prezzi sulla rete autostradale sono in genere più alti; spesso conviene uscire o fare rifornimento prima di partire.</li>
    <li><strong>Confronta i distributori della tua zona</strong>: le app e il portale Osservaprezzi del Ministero mostrano i prezzi di ogni impianto.</li>
    <li><strong>Riduci i consumi</strong>: pressione corretta delle gomme, guida fluida e meno peso a bordo valgono quanto qualche centesimo al litro.</li>
    <li><strong>Considera il costo reale</strong>: il carburante è solo una parte di quanto spendi per l’auto. Con il <a href="/">calcolatore del costo al km</a> scopri quanto pesa rispetto a svalutazione, assicurazione e manutenzione.</li>
  </ol>

  <h2>Benzina, gasolio, GPL o metano?</h2>
  <p>Il prezzo al litro da solo non dice quale alimentazione conviene: contano i consumi, il prezzo dell’auto e le altre voci di costo. Per un confronto completo usa i calcolatori <a href="/diesel-o-benzina/">diesel o benzina</a>, <a href="/gpl-o-metano/">GPL o metano</a>, <a href="/costo-auto-ibrida/">auto ibrida</a> ed <a href="/confronto-elettrica-benzina/">elettrica o benzina</a>: usano automaticamente i prezzi medi di questa pagina.</p>
</article>
${c.faq(faq)}
${correlati('/prezzo-benzina-oggi/')}
</div>
<aside aria-label="Pubblicità">${c.ad('laterale', 'side')}</aside>
</div>
</div>`;
  },
};
