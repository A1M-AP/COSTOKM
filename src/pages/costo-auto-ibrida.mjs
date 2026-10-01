import { correlati } from '../correlati.mjs';
import { confrontoTool } from '../confronto-tool.mjs';

const faq = [
  {
    q: 'Un’auto ibrida conviene rispetto a una a benzina?',
    a: 'Spesso sì se percorri molta strada in città, dove l’ibrido consuma molto meno. Il prezzo d’acquisto però è più alto: il calcolatore ti dice dopo quanti km all’anno il risparmio di carburante ripaga la differenza.',
  },
  {
    q: 'Quanto consuma davvero un’auto ibrida?',
    a: 'Un’ibrida full consuma in genere molto meno di un’equivalente a benzina nel traffico urbano, mentre in autostrada la differenza si riduce. Usa il consumo medio del tuo percorso tipico, non quello dichiarato.',
  },
  {
    q: 'Che differenza c’è tra mild, full e plug-in?',
    a: 'Le mild hybrid hanno un piccolo motore elettrico di supporto e risparmiano poco; le full hybrid possono muoversi per brevi tratti in elettrico e risparmiano di più; le plug-in si ricaricano alla presa e, se ricaricate spesso, percorrono molti km in elettrico. Questo confronto è pensato per le full hybrid.',
  },
  {
    q: 'Le ibride pagano meno bollo?',
    a: 'Alcune regioni prevedono agevolazioni sul bollo per le auto ibride, per esempio per i primi anni dall’immatricolazione. Le regole variano da regione a regione: verifica l’importo sul sito della tua regione e inseriscilo nel calcolatore.',
  },
  {
    q: 'La manutenzione di un’ibrida costa di più?',
    a: 'Non necessariamente: i freni si consumano meno grazie alla frenata rigenerativa e molti modelli non hanno frizione tradizionale. Conviene però informarsi sulla garanzia della batteria di trazione.',
  },
];

export default {
  path: '/costo-auto-ibrida/',
  priority: 0.8,
  title: 'Auto ibrida: quanto costa e quando conviene | costokm.it',
  ogTitle: 'Auto ibrida o benzina: quando conviene davvero?',
  description: 'Quanto costa davvero un’auto ibrida? Confrontala con una a benzina: costo annuo, costo al km e chilometraggio oltre il quale l’ibrido conviene.',
  h1: 'Auto ibrida: quanto costa e quando conviene',
  breadcrumb: 'Auto ibrida',
  app: 'Calcolatore di convenienza auto ibrida',
  scripts: ['/assets/js/confronto.js'],
  faq,
  body: (c) => `<div class="wrap">
<section class="intro">
  <h1>Auto ibrida: quanto costa e quando conviene</h1>
  <p>Confronta un’ibrida con un’auto a benzina: costo reale, costo al km e km all’anno oltre i quali l’ibrido ti fa risparmiare.</p>
</section>
${confrontoTool(c, 'ibrida-benzina')}
${c.ad('dopo-calcolatore', 'wide')}
<div class="layout-article">
<div>
<article class="article">
  <h2>Quanto costa davvero un’auto ibrida</h2>
  <p>Le auto ibride promettono consumi bassi senza i limiti di autonomia dell’elettrico. In cambio costano di più all’acquisto. Per capire se ne vale la pena bisogna guardare il <strong>costo totale di possesso</strong>: svalutazione, carburante, assicurazione, bollo, manutenzione e pneumatici, divisi per i chilometri che percorri davvero.</p>
  <p>Il calcolatore qui sopra mette a confronto un’ibrida full e un’auto a benzina tradizionale. Per ciascuna separa:</p>
  <ul>
    <li><strong>i costi fissi</strong>, che paghi anche con l’auto ferma (svalutazione, assicurazione, bollo, manutenzione);</li>
    <li><strong>i costi variabili</strong>, che crescono con i km (carburante e gomme).</li>
  </ul>
  <p>L’ibrida ha di solito costi fissi più alti e costi per chilometro più bassi: il <strong>punto di pareggio</strong> indica quanti km all’anno servono perché il risparmio di carburante compensi il prezzo più alto.</p>

  <h2>Dove l’ibrido fa la differenza</h2>
  <ul>
    <li><strong>Città e traffico.</strong> Nelle partenze e nelle frenate continue l’ibrido recupera energia e usa spesso il motore elettrico: è qui che il consumo cala di più.</li>
    <li><strong>Autostrada.</strong> A velocità costante il vantaggio si riduce: se fai soprattutto autostrada, inserisci un consumo più vicino a quello della benzina.</li>
    <li><strong>Svalutazione.</strong> Le ibride tendono a mantenere bene il valore, ma il prezzo di partenza più alto pesa comunque.</li>
    <li><strong>Agevolazioni locali.</strong> Bollo ridotto e accesso a ZTL o parcheggi dipendono da regione e comune.</li>
  </ul>
  ${c.ad('articolo')}
  <h2>Esempio pratico</h2>
  <p>Due auto con valori <strong>ipotetici</strong>, 15.000 km all’anno per 6 anni, benzina a 2,10 €/l (valore arrotondato vicino alla media nazionale di inizio ottobre 2026):</p>
  <div class="esempio">
    <table>
      <caption class="sr-only">Esempio di confronto ibrida e benzina</caption>
      <thead><tr><th scope="col">Voce (€/anno)</th><th scope="col" class="num">Benzina</th><th scope="col" class="num">Ibrida</th></tr></thead>
      <tbody>
        <tr><th scope="row">Prezzo d’acquisto</th><td class="num">23.000 €</td><td class="num">27.000 €</td></tr>
        <tr><th scope="row">Svalutazione</th><td class="num">2.388</td><td class="num">2.679</td></tr>
        <tr><th scope="row">Carburante (6,2 l contro 4,6 l/100 km)</th><td class="num">1.953</td><td class="num">1.449</td></tr>
        <tr><th scope="row">Assicurazione</th><td class="num">550</td><td class="num">560</td></tr>
        <tr><th scope="row">Bollo</th><td class="num">220</td><td class="num">200</td></tr>
        <tr><th scope="row">Manutenzione</th><td class="num">450</td><td class="num">420</td></tr>
        <tr><th scope="row">Pneumatici</th><td class="num">150</td><td class="num">150</td></tr>
      </tbody>
      <tfoot><tr><th scope="row">Totale annuo</th><td class="num">5.711</td><td class="num">5.458</td></tr></tfoot>
    </table>
  </div>
  <p>L’ibrida risparmia circa 500 € all’anno di carburante e qualcosa su manutenzione e bollo, mentre la svalutazione costa circa 290 € in più. Risultato: a 15.000 km l’ibrida costa circa <strong>250 € all’anno in meno</strong> e il pareggio è intorno ai <strong>7.500 km all’anno</strong>. Con il carburante caro, anche chi fa pochi km può avere un vantaggio, purché guidi spesso in città.</p>

  <h2>Quando l’ibrida non conviene</h2>
  <p>Ci sono casi in cui l’ibrido fa fatica a ripagarsi. Chi percorre <strong>pochi chilometri</strong>, soprattutto fuori città, risparmia poco carburante e paga comunque il prezzo d’acquisto più alto. Chi viaggia <strong>quasi sempre in autostrada</strong> vede consumi simili a quelli di un buon motore a benzina. E se la differenza di prezzo tra i due modelli è molto ampia, servono molti anni per recuperarla. In questi casi conviene confrontare con attenzione anche un’auto a benzina più piccola o un usato recente: inserisci le due alternative nel calcolatore e guarda il punto di pareggio.</p>

  <h2>Errori comuni</h2>
  <ol>
    <li><strong>Usare il consumo dichiarato.</strong> In autostrada l’ibrida consuma più di quanto indicato nei cicli di omologazione.</li>
    <li><strong>Confondere mild e full hybrid.</strong> Le mild risparmiano molto meno: inserisci un consumo realistico.</li>
    <li><strong>Trattare una plug-in come una full hybrid.</strong> Una plug-in conviene solo se la ricarichi spesso: in quel caso confrontala anche con il <a href="/confronto-elettrica-benzina/">calcolatore elettrica o benzina</a>.</li>
    <li><strong>Dimenticare la svalutazione.</strong> Qualche migliaio di euro in più all’acquisto si paga ogni anno.</li>
  </ol>
  <p>Valuta anche <a href="/diesel-o-benzina/">diesel o benzina</a> oppure calcola tutte le voci, compreso il finanziamento, con il <a href="/">calcolatore completo</a>.</p>
</article>
${c.faq(faq)}
${correlati('/costo-auto-ibrida/')}
</div>
<aside aria-label="Pubblicità">${c.ad('laterale', 'side')}</aside>
</div>
</div>`,
};
