import { correlati } from '../correlati.mjs';
import { CONFRONTO_DEFAULT } from '../../public/assets/js/defaults.js';
import { calcolaConfronto, testoPareggio, testoDifferenza, tabellaConfronto } from '../../public/assets/js/confronto-core.js';
import { euro } from '../../public/assets/js/ui.js';

const faq = [
  {
    q: 'Dopo quanti km all’anno conviene l’auto elettrica?',
    a: 'Non esiste una soglia valida per tutti: dipende soprattutto dalla differenza di prezzo d’acquisto, dalla svalutazione e da quanto paghi l’energia rispetto al carburante. Il calcolatore trova il tuo chilometraggio di pareggio con i dati che inserisci.',
  },
  {
    q: 'Perché ricaricare a casa cambia così tanto il risultato?',
    a: 'Il prezzo dell’energia domestica è di norma molto più basso di quello delle colonnine pubbliche, soprattutto quelle veloci. Più alta è la quota di ricarica a casa, più basso è il costo per chilometro dell’elettrica e più bassa la soglia di convenienza.',
  },
  {
    q: 'Le auto elettriche pagano il bollo?',
    a: 'Molte regioni prevedono per le auto elettriche un’esenzione dal bollo per i primi anni dall’immatricolazione e, in seguito, una riduzione. Le regole cambiano da regione a regione e nel tempo: verifica sempre sul sito della tua regione.',
  },
  {
    q: 'La manutenzione di un’elettrica costa davvero meno?',
    a: 'In genere sì, perché mancano olio motore, filtri, frizione e cinghia di distribuzione e i freni si consumano meno grazie alla frenata rigenerativa. Le gomme invece possono durare meno per il peso maggiore: per questo il calcolatore permette di indicare durata e costo diversi.',
  },
  {
    q: 'Come si calcola il punto di pareggio?',
    a: 'Per ciascuna auto il costo annuo è diviso in una parte fissa (svalutazione, assicurazione, bollo, manutenzione) e una parte che cresce con i km (energia e pneumatici). Il pareggio è il chilometraggio in cui i due costi annui si equivalgono: differenza dei costi fissi divisa per la differenza dei costi al km.',
  },
];

export default {
  path: '/confronto-elettrica-benzina/',
  priority: 0.9,
  title: 'Elettrica o benzina? Calcola quando conviene | costokm.it',
  ogTitle: 'Elettrica o benzina? Calcola dopo quanti km conviene l’elettrica',
  description: 'Confronta il costo reale di un’auto elettrica e di una a benzina, diesel o GPL e scopri il chilometraggio annuo oltre il quale l’elettrica conviene.',
  h1: 'Auto elettrica o benzina: quale conviene?',
  breadcrumb: 'Elettrica vs benzina',
  app: 'Calcolatore di convenienza auto elettrica vs benzina',
  scripts: ['/assets/js/confronto.js'],
  faq,
  body: (c) => {
    const pv = (k) => (typeof c.prezzi?.prezzi?.[k]?.valore === 'number' && c.prezzi.prezzi[k].valore > 0 ? c.prezzi.prezzi[k].valore : null);
    const D = CONFRONTO_DEFAULT;
    const t = { ...D.termica, prezzoCarb: D.termica.prezzoCarb ?? pv(D.termica.alimentazione) };
    const e = { ...D.elettrica, prezzoCasa: D.elettrica.prezzoCasa ?? pv('elettricita_casa'), prezzoColonnina: D.elettrica.prezzoColonnina ?? pv('elettricita_colonnina') };
    const s = { km: D.km, anni: D.anni, termica: t, elettrica: e };
    const res = calcolaConfronto(s);
    const tp = testoPareggio(res);
    const ft = (o) => c.field({ prefix: 't', value: t[o.name.slice(2)], ...o });
    const fe = (o) => c.field({ prefix: 'e', value: e[o.name.slice(2)], ...o });

    return `<div class="wrap">
<section class="intro">
  <h1>Auto elettrica o benzina: quale conviene?</h1>
  <p>Inserisci i dati delle due auto: calcoliamo il costo reale e i km all’anno oltre i quali l’elettrica conviene.</p>
</section>
<div class="calc" data-confronto-calc>
<form class="calc-form" id="calc-form" novalidate aria-label="Dati del confronto">
  <p class="calc-note">Valori di esempio: <strong>sostituiscili con i tuoi</strong>. Il risultato si aggiorna in tempo reale.</p>
  <div class="grid-2">
    ${c.field({ name: 'km', label: 'Km all’anno', unit: 'km', value: s.km, min: 100, max: 200000, step: 1, required: true })}
    ${c.field({ name: 'anni', label: 'Anni di possesso', unit: 'anni', value: s.anni, min: 1, max: 30, step: 1, required: true })}
  </div>

  <details class="sezione" open>
    <summary><span>Auto termica</span></summary>
    <div class="sezione-body">
      ${c.select({ prefix: 't', name: 't_alimentazione', label: 'Alimentazione', value: t.alimentazione, options: c.alimentazioniOptions(['benzina', 'diesel', 'gpl', 'metano', 'ibrida']) })}
      <div class="grid-2">
        ${ft({ name: 't_prezzo', label: 'Prezzo d’acquisto', unit: '€', max: 1000000, required: true })}
        ${ft({ name: 't_svalPerc', label: 'Svalutazione annua', unit: '%', max: 60 })}
        ${ft({ name: 't_consumo', label: 'Consumo medio', unit: 'l/100 km', max: 40 })}
        ${ft({ name: 't_prezzoCarb', label: 'Prezzo carburante', unit: '€/l', max: 10, placeholder: 'Inserisci' })}
        ${ft({ name: 't_rc', label: 'Assicurazione', unit: '€/anno', max: 20000 })}
        ${ft({ name: 't_bollo', label: 'Bollo', unit: '€/anno', max: 10000 })}
        ${ft({ name: 't_manutenzione', label: 'Manutenzione', unit: '€/anno', max: 20000 })}
        ${ft({ name: 't_gommeCosto', label: 'Treno di gomme', unit: '€', max: 20000 })}
        ${ft({ name: 't_gommeKm', label: 'Durata gomme', unit: 'km', min: 1000, max: 200000, step: 1 })}
      </div>
    </div>
  </details>

  <details class="sezione" open>
    <summary><span>Auto elettrica</span></summary>
    <div class="sezione-body">
      <div class="grid-2">
        ${fe({ name: 'e_prezzo', label: 'Prezzo d’acquisto', unit: '€', max: 1000000, required: true, hint: 'Al netto di eventuali incentivi.' })}
        ${fe({ name: 'e_svalPerc', label: 'Svalutazione annua', unit: '%', max: 60 })}
        ${fe({ name: 'e_consumoEl', label: 'Consumo medio', unit: 'kWh/100 km', max: 60 })}
        ${fe({ name: 'e_percCasa', label: 'Ricarica a casa', unit: '%', max: 100 })}
        ${fe({ name: 'e_prezzoCasa', label: 'Energia a casa', unit: '€/kWh', max: 5, placeholder: 'Inserisci' })}
        ${fe({ name: 'e_prezzoColonnina', label: 'Colonnine', unit: '€/kWh', max: 5, placeholder: 'Inserisci' })}
        ${fe({ name: 'e_rc', label: 'Assicurazione', unit: '€/anno', max: 20000 })}
        ${fe({ name: 'e_bollo', label: 'Bollo', unit: '€/anno', max: 10000, hint: 'Spesso esente o ridotto: verifica la tua regione.' })}
        ${fe({ name: 'e_manutenzione', label: 'Manutenzione', unit: '€/anno', max: 20000 })}
        ${fe({ name: 'e_gommeCosto', label: 'Treno di gomme', unit: '€', max: 20000 })}
        ${fe({ name: 'e_gommeKm', label: 'Durata gomme', unit: 'km', min: 1000, max: 200000, step: 1 })}
      </div>
    </div>
  </details>
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
  <div class="avvisi" data-out="avvisi">${res.avvisi.map((a) => `<p class="avviso">${a}</p>`).join('')}</div>
  <div class="kpis kpis--2">
    <div class="kpi"><span class="kpi-label" data-out="nomeT">${res.nomeT}</span><span class="kpi-value" data-out="tAnno">${euro(res.rt.totaleAnnuo)}/anno</span><span class="kpi-sub" data-out="tKm">${euro(res.rt.perKm, 3)}/km</span></div>
    <div class="kpi"><span class="kpi-label">Auto elettrica</span><span class="kpi-value" data-out="eAnno">${euro(res.re.totaleAnnuo)}/anno</span><span class="kpi-sub" data-out="eKm">${euro(res.re.perKm, 3)}/km</span></div>
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
<a class="sticky-ris" href="#risultati" data-sticky hidden><span data-out="stickyText">Vedi il risultato</span> <span aria-hidden="true">↓</span></a>
${c.ad('dopo-calcolatore', 'wide')}
<div class="layout-article">
<div>
<article class="article">
  <h2>Come si confronta il costo di un’elettrica e di una termica</h2>
  <p>Un’auto elettrica di solito costa di più all’acquisto ma meno per ogni chilometro percorso: energia più economica del carburante, manutenzione più semplice e, in molte regioni, bollo ridotto o assente per i primi anni. Una termica fa il contrario: prezzo più basso, costi di utilizzo più alti. Per capire quale conviene bisogna quindi guardare a <strong>quanti chilometri percorri</strong>: più strada fai, più il risparmio per chilometro dell’elettrica compensa il maggior costo iniziale.</p>
  <p>Il calcolatore divide il costo annuo di ciascuna auto in due parti:</p>
  <ul>
    <li><strong>Costi fissi</strong>, che paghi anche se l’auto resta in garage: svalutazione, assicurazione, bollo e manutenzione ordinaria.</li>
    <li><strong>Costi variabili</strong>, che crescono con i chilometri: carburante o energia e usura degli pneumatici.</li>
  </ul>
  <p>Il <strong>punto di pareggio</strong> è il chilometraggio annuo in cui le due auto costano esattamente uguale. Si calcola così: differenza tra i costi fissi annui ÷ differenza tra i costi per chilometro. Sopra quella soglia conviene l’auto con il costo al km più basso, sotto conviene quella con i costi fissi più bassi.</p>

  <h2>Le voci che spostano di più il risultato</h2>
  <ul>
    <li><strong>Prezzo d’acquisto e svalutazione</strong>: una differenza di prezzo elevata, o una svalutazione più rapida dell’elettrica, alza la soglia di convenienza. Inserisci il prezzo al netto degli incentivi effettivamente ottenuti.</li>
    <li><strong>Dove ricarichi</strong>: la ricarica domestica costa in genere molto meno di quella alle colonnine pubbliche, soprattutto quelle veloci. Chi può ricaricare a casa raggiunge il pareggio con molti meno chilometri.</li>
    <li><strong>Prezzo del carburante</strong>: i prezzi proposti sono le medie nazionali rilevate dal MIMIT per i carburanti, da ARERA per l’energia domestica e dall’Osservatorio Adiconsum–TariffEV per le colonnine; puoi sempre sostituirli con il prezzo che paghi tu.</li>
    <li><strong>Bollo e assicurazione</strong>: il bollo dipende dalla regione, l’assicurazione dal profilo del guidatore e dal valore dell’auto. Usa i tuoi preventivi.</li>
  </ul>
  ${c.ad('articolo')}
  <h2>Esempio pratico</h2>
  <p>Confrontiamo due auto con valori <strong>puramente ipotetici</strong>, scelti solo per mostrare il calcolo (anche i prezzi di carburante ed energia sono di esempio):</p>
  <div class="esempio">
    <table>
      <caption class="sr-only">Esempio di calcolo del punto di pareggio</caption>
      <thead><tr><th scope="col">Voce</th><th scope="col" class="num">Benzina</th><th scope="col" class="num">Elettrica</th></tr></thead>
      <tbody>
        <tr><th scope="row">Svalutazione annua</th><td class="num">2.400 €</td><td class="num">3.400 €</td></tr>
        <tr><th scope="row">Assicurazione</th><td class="num">550 €</td><td class="num">600 €</td></tr>
        <tr><th scope="row">Bollo</th><td class="num">220 €</td><td class="num">0 €</td></tr>
        <tr><th scope="row">Manutenzione</th><td class="num">450 €</td><td class="num">250 €</td></tr>
        <tr><th scope="row">Costi fissi annui</th><td class="num">3.620 €</td><td class="num">4.250 €</td></tr>
        <tr><th scope="row">Energia per km</th><td class="num">6 l × 1,80 €/l = 0,108 €</td><td class="num">16 kWh × 0,39 €/kWh = 0,062 €</td></tr>
        <tr><th scope="row">Gomme per km</th><td class="num">0,010 €</td><td class="num">0,014 €</td></tr>
        <tr><th scope="row">Costo variabile per km</th><td class="num">0,118 €</td><td class="num">0,077 €</td></tr>
      </tbody>
    </table>
  </div>
  <p>Il prezzo medio dell’energia di 0,39 €/kWh deriva dal 70% di ricarica domestica a 0,30 €/kWh e dal 30% alle colonnine a 0,60 €/kWh (valori di esempio). L’elettrica costa 630 € in più all’anno di costi fissi, ma risparmia circa 0,041 € per ogni chilometro. Il pareggio è quindi a 630 ÷ 0,0413 ≈ <strong>15.200 km all’anno</strong>. Chi percorre 10.000 km spende circa 4.800 € con la benzina e 5.020 € con l’elettrica; a 20.000 km la situazione si inverte: 5.980 € contro 5.780 €.</p>

  <h2>Errori comuni nel confronto</h2>
  <ol>
    <li><strong>Guardare solo il costo del “pieno”.</strong> Il risparmio sull’energia va confrontato con la maggiore svalutazione e il prezzo d’acquisto più alto.</li>
    <li><strong>Usare solo il prezzo della ricarica domestica.</strong> Se ricarichi spesso fuori casa, il costo medio per kWh può essere molto più alto.</li>
    <li><strong>Dimenticare gli incentivi o contarli due volte.</strong> Inserisci il prezzo effettivamente pagato.</li>
    <li><strong>Usare consumi dichiarati.</strong> In autostrada e d’inverno i consumi reali, specie delle elettriche, salgono.</li>
    <li><strong>Considerare un solo anno.</strong> Cambiando gli anni di possesso cambia la svalutazione annua: prova diversi orizzonti.</li>
  </ol>
  <h2>Oltre ai numeri</h2>
  <p>Il punto di pareggio è un ottimo riferimento economico, ma non è l’unico criterio. Valuta anche la possibilità concreta di ricaricare a casa o al lavoro, la diffusione delle colonnine sui percorsi che fai abitualmente, l’autonomia reale nei mesi freddi e i tempi di ricarica nei viaggi lunghi. Allo stesso modo, per un’auto termica considera eventuali limitazioni alla circolazione nella tua città. Se sei vicino alla soglia di pareggio, questi fattori pratici possono fare la differenza più del risparmio economico.</p>
  <p>Per un’analisi completa con tutte le voci (finanziamento, garage, pedaggi) e fino a tre auto, usa il <a href="/">calcolatore del costo reale dell’auto</a>.</p>
</article>
${c.faq(faq)}
${correlati('/confronto-elettrica-benzina/')}
</div>
<aside aria-label="Pubblicità">${c.ad('laterale', 'side')}</aside>
</div>
</div>`;
  },
};
