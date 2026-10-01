import { correlati } from '../correlati.mjs';
import { confrontoTool } from '../confronto-tool.mjs';

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
  body: (c) => `<div class="wrap">
<section class="intro">
  <h1>Auto elettrica o benzina: quale conviene?</h1>
  <p>Inserisci i dati delle due auto: calcoliamo il costo reale e i km all’anno oltre i quali l’elettrica conviene.</p>
</section>
${confrontoTool(c, 'elettrica-benzina')}
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
</div>`,
};
