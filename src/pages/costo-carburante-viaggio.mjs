import { correlati } from '../correlati.mjs';
import { VIAGGIO_DEFAULT } from '../../public/assets/js/defaults.js';
import { uscitaViaggio, chiavePrezzoViaggio } from '../../public/assets/js/viaggio-core.js';
import { ALIMENTAZIONI } from '../../public/assets/js/calc.js';

const faq = [
  {
    q: 'Come si calcola il costo del carburante per un viaggio?',
    a: 'Si dividono i km del viaggio per 100, si moltiplica per il consumo medio (litri ogni 100 km) e poi per il prezzo al litro. Ad esempio 400 km con un consumo di 6 l/100 km richiedono 24 litri: il costo è 24 per il prezzo del carburante.',
  },
  {
    q: 'Quale consumo devo inserire?',
    a: 'Il consumo reale della tua auto sul tipo di percorso che farai. In autostrada ad alta velocità si consuma di più che a velocità costante su strade extraurbane. Il computer di bordo o la media degli ultimi rifornimenti sono più affidabili del dato dichiarato dal costruttore.',
  },
  {
    q: 'Come divido le spese del viaggio con gli altri passeggeri?',
    a: 'Indica il numero di persone che condividono le spese: il calcolatore divide in parti uguali carburante, pedaggi e parcheggio e mostra la quota a persona.',
  },
  {
    q: 'Il costo del carburante è il costo reale del viaggio?',
    a: 'No, è solo la spesa viva. Ogni chilometro consuma anche gomme, manutenzione e valore dell’auto. Per conoscere il costo completo per chilometro usa il calcolatore del costo reale dell’auto.',
  },
  {
    q: 'Funziona anche per le auto elettriche?',
    a: 'Sì: scegli Elettrica e inserisci il consumo in kWh/100 km e il prezzo dell’energia. Per i viaggi lunghi conviene usare il prezzo delle colonnine, soprattutto se ricaricherai lungo il percorso.',
  },
];

export default {
  path: '/costo-carburante-viaggio/',
  priority: 0.8,
  title: 'Costo carburante viaggio: calcolo benzina | costokm.it',
  ogTitle: 'Quanto costa il carburante per il tuo viaggio?',
  description: 'Calcola il costo di carburante o energia per un viaggio in auto: benzina, diesel, GPL, metano o elettrica, con pedaggi, andata e ritorno e quota per passeggero.',
  h1: 'Costo carburante di un viaggio',
  breadcrumb: 'Costo viaggio',
  app: 'Calcolatore costo carburante viaggio',
  scripts: ['/assets/js/viaggio.js'],
  faq,
  body: (c) => {
    const pv = (k) => (typeof c.prezzi?.prezzi?.[k]?.valore === 'number' && c.prezzi.prezzi[k].valore > 0 ? c.prezzi.prezzi[k].valore : null);
    const t = { ...VIAGGIO_DEFAULT, prezzo: VIAGGIO_DEFAULT.prezzo ?? pv(chiavePrezzoViaggio(VIAGGIO_DEFAULT.alimentazione)) };
    const o = uscitaViaggio(t);
    const a = ALIMENTAZIONI[t.alimentazione];
    const f = (x) => c.field({ value: t[x.name], ...x });
    return `<div class="wrap">
<section class="intro">
  <h1>Costo carburante di un viaggio</h1>
  <p>Quanto spendi di benzina, diesel, GPL, metano o ricarica per un tragitto, con pedaggi e quota a persona.</p>
</section>
<div class="calc" data-viaggio>
<form class="calc-form" id="calc-form" novalidate aria-label="Dati del viaggio">
  <div class="grid-2">
    ${f({ name: 'distanza', label: 'Distanza (solo andata)', unit: 'km', min: 1, max: 10000, required: true })}
    ${f({ name: 'persone', label: 'Persone che pagano', min: 1, max: 9, step: 1, integer: true })}
  </div>
  <label class="check check--block"><input type="checkbox" name="andataRitorno"${t.andataRitorno ? ' checked' : ''}> Andata e ritorno</label>
  ${c.select({ name: 'alimentazione', label: 'Alimentazione', value: t.alimentazione, options: c.alimentazioniOptions() })}
  <div class="grid-2">
    ${f({ name: 'consumo', label: 'Consumo medio', unit: a.unitaConsumo, min: 0, max: 60 })}
    ${f({ name: 'prezzo', label: 'Prezzo', unit: a.unitaPrezzo, min: 0, max: 10, placeholder: 'Inserisci' })}
    ${f({ name: 'pedaggi', label: 'Pedaggi (per tratta)', unit: '€', max: 5000 })}
    ${f({ name: 'parcheggio', label: 'Parcheggio e altro', unit: '€', max: 5000 })}
  </div>
  ${c.prezziInfo()}
</form>
<section class="risultati" id="risultati" aria-labelledby="ris-title">
  <h2 id="ris-title">Quanto costa il viaggio</h2>
  <div class="kpis">
    <div class="kpi kpi--hero"><span class="kpi-label">Carburante / energia</span><span class="kpi-value" data-out="carburante">${o.valori.carburante}</span></div>
    <div class="kpi"><span class="kpi-label">Totale</span><span class="kpi-value" data-out="totale">${o.valori.totale}</span></div>
    <div class="kpi"><span class="kpi-label">A persona</span><span class="kpi-value" data-out="perPersona">${o.valori.perPersona}</span></div>
    <div class="kpi"><span class="kpi-label">Quantità</span><span class="kpi-value" data-out="consumoTot">${o.valori.consumoTot}</span></div>
  </div>
  <p class="small" data-out="dettaglio">${o.valori.dettaglio}</p>
  <div class="avvisi" data-out="avvisi">${o.avvisi.map((x) => `<p class="avviso">${x}</p>`).join('')}</div>
  <p class="highlight">Il carburante è solo una parte del costo: usura, manutenzione e svalutazione pesano spesso di più. <a href="/">Calcola il costo reale al km della tua auto</a>.</p>
  ${c.actions()}
  ${c.disclaimer()}
  ${c.affiliate('assicurazione')}
</section>
</div>
${c.ad('dopo-calcolatore', 'wide')}
<div class="layout-article">
<div>
<article class="article">
  <h2>Come calcolare il costo del carburante di un viaggio</h2>
  <p>Prima di partire è utile sapere quanto costerà il viaggio, sia per organizzare il budget sia per dividere le spese con chi viaggia con te. Il calcolo del carburante è semplice e si basa su tre dati: la distanza, il consumo medio dell’auto e il prezzo del carburante.</p>
  <p>La formula è: <strong>costo = km ÷ 100 × consumo × prezzo</strong>. Se il viaggio prevede il ritorno, la distanza va raddoppiata. A questo si aggiungono pedaggi autostradali, parcheggio ed eventuali altre spese, che possono pesare quanto il carburante.</p>
  <h2>I dati da inserire</h2>
  <ul>
    <li><strong>Distanza</strong>: i km di sola andata indicati dal navigatore. Spunta “Andata e ritorno” per raddoppiarli: anche i pedaggi, inseriti per singola tratta, vengono raddoppiati.</li>
    <li><strong>Consumo medio</strong>: in litri ogni 100 km (kg per il metano, kWh per le elettriche). Usa il consumo reale: in autostrada a velocità sostenuta il consumo cresce sensibilmente.</li>
    <li><strong>Prezzo</strong>: il prezzo medio viene proposto dal nostro file dei prezzi, da aggiornare con le rilevazioni ufficiali del Ministero delle Imprese e del Made in Italy (MIMIT); puoi sostituirlo con il prezzo del distributore dove farai rifornimento. Ricorda che lungo le autostrade i prezzi sono spesso più alti.</li>
    <li><strong>Persone</strong>: il costo totale viene diviso in parti uguali tra chi condivide le spese.</li>
  </ul>
  ${c.ad('articolo')}
  <h2>Esempio pratico</h2>
  <p>Un viaggio di 300 km con ritorno, con un’auto che consuma 6 l/100 km e un prezzo di <strong>esempio</strong> di 1,80 €/l (valore ipotetico, non un prezzo ufficiale):</p>
  <div class="esempio">
    <ul>
      <li>Distanza totale: 300 × 2 = 600 km</li>
      <li>Carburante necessario: 600 ÷ 100 × 6 = 36 litri</li>
      <li>Costo carburante: 36 × 1,80 = 64,80 €</li>
      <li>Pedaggi ipotetici: 25 € per tratta × 2 = 50 €</li>
      <li><strong>Totale: 114,80 €</strong>, cioè 38,27 € a testa se si viaggia in tre</li>
    </ul>
  </div>
  <p>Lo stesso viaggio con un’elettrica che consuma 16 kWh/100 km richiede 96 kWh: il costo dipende molto da dove ricarichi, perché le colonnine veloci in autostrada costano in genere più della ricarica domestica.</p>
  <h2>Errori comuni</h2>
  <ol>
    <li><strong>Usare il consumo dichiarato</strong> dal costruttore, quasi sempre più basso di quello reale in autostrada.</li>
    <li><strong>Dimenticare il ritorno</strong> o i pedaggi della seconda tratta.</li>
    <li><strong>Usare il prezzo self del distributore sotto casa</strong> quando farai rifornimento in autostrada.</li>
    <li><strong>Confondere il costo del carburante con il costo reale</strong>: ogni chilometro consuma anche gomme, manutenzione e valore dell’auto.</li>
  </ol>
  <h2>Come ridurre il costo del viaggio</h2>
  <ul>
    <li><strong>Velocità costante e moderata</strong>: in autostrada il consumo cresce rapidamente oltre i 110-120 km/h; qualche minuto in più di viaggio può valere diversi euro di carburante.</li>
    <li><strong>Pressione delle gomme</strong>: controllala prima di partire, soprattutto con l’auto carica. Gomme sgonfie aumentano consumi e usura.</li>
    <li><strong>Carico e portapacchi</strong>: un box sul tetto peggiora l’aerodinamica; montalo solo quando serve.</li>
    <li><strong>Rifornimento fuori dall’autostrada</strong>: confronta i prezzi dei distributori lungo il percorso, spesso più convenienti appena fuori dai caselli.</li>
    <li><strong>Viaggiare in più persone</strong>: dividere carburante e pedaggi abbassa sensibilmente la quota a testa, come mostra il calcolatore.</li>
  </ul>
  <h2>Dal costo del viaggio al costo reale al km</h2>
  <p>Se usi l’auto spesso per lavoro o per dividere le spese in modo davvero equo, il costo del solo carburante non basta. Con il <a href="/">calcolatore del costo reale</a> ottieni il costo complessivo al chilometro, che include svalutazione, assicurazione, bollo, manutenzione e pneumatici: moltiplicato per i km del viaggio, ti dice quanto ti è costato davvero.</p>
</article>
${c.faq(faq)}
${correlati('/costo-carburante-viaggio/')}
</div>
<aside aria-label="Pubblicità">${c.ad('laterale', 'side')}</aside>
</div>
</div>`;
  },
};
