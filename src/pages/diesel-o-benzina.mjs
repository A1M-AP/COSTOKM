import { correlati } from '../correlati.mjs';
import { confrontoTool } from '../confronto-tool.mjs';

const faq = [
  {
    q: 'Dopo quanti km all’anno conviene il diesel?',
    a: 'Dipende dalla differenza di prezzo tra le due auto, dai consumi e dal prezzo dei carburanti. Con i valori di esempio della pagina il pareggio supera i 30.000 km all’anno, perché oggi il gasolio costa più della benzina. Inserisci i tuoi dati per trovare la tua soglia.',
  },
  {
    q: 'Perché il diesel consuma meno ma non sempre conviene?',
    a: 'Un motore diesel percorre più chilometri con un litro, ma l’auto costa di più, perde più valore in termini assoluti e ha spesso manutenzione, bollo e assicurazione più cari. Il risparmio sul carburante deve ripagare questi costi fissi.',
  },
  {
    q: 'Il gasolio costa più della benzina?',
    a: 'Negli ultimi periodi sì: secondo le medie nazionali dei prezzi rilevati dal MIMIT, a inizio ottobre 2026 il gasolio self costava circa 20 centesimi al litro più della benzina self. Il calcolatore usa i prezzi medi aggiornati, ma puoi inserire quelli che paghi tu.',
  },
  {
    q: 'Quali costi specifici ha un’auto diesel?',
    a: 'Il filtro antiparticolato, che con molti tragitti brevi può intasarsi, l’additivo AdBlue sui modelli più recenti e, in alcune città, limitazioni alla circolazione per le classi ambientali più vecchie. Inserisci queste spese nella voce manutenzione.',
  },
  {
    q: 'Per chi fa pochi km è meglio la benzina?',
    a: 'In genere sì: con pochi chilometri il risparmio sul carburante del diesel è piccolo e non compensa il prezzo d’acquisto e i costi fissi più alti. Il grafico della pagina mostra come cambia il costo annuo al variare dei km.',
  },
];

export default {
  path: '/diesel-o-benzina/',
  priority: 0.8,
  title: 'Diesel o benzina? Calcola quale conviene | costokm.it',
  ogTitle: 'Diesel o benzina: dopo quanti km conviene il diesel?',
  description: 'Confronta il costo reale di un’auto diesel e di una a benzina con i prezzi medi aggiornati dei carburanti e scopri dopo quanti km all’anno conviene il diesel.',
  h1: 'Diesel o benzina: quale conviene?',
  breadcrumb: 'Diesel o benzina',
  app: 'Calcolatore di convenienza diesel o benzina',
  scripts: ['/assets/js/confronto.js'],
  faq,
  body: (c) => `<div class="wrap">
<section class="intro">
  <h1>Diesel o benzina: quale conviene?</h1>
  <p>Confronta due auto con i prezzi medi aggiornati dei carburanti: ti diciamo dopo quanti km all’anno il diesel diventa conveniente.</p>
</section>
${confrontoTool(c, 'diesel-benzina')}
${c.ad('dopo-calcolatore', 'wide')}
<div class="layout-article">
<div>
<article class="article">
  <h2>Diesel o benzina: il confronto giusto</h2>
  <p>Per anni la regola è stata semplice: chi fa tanti chilometri compra diesel, chi ne fa pochi sceglie la benzina. La regola resta valida, ma la soglia si è spostata. Il gasolio, un tempo più economico alla pompa, oggi costa spesso più della benzina, e le auto diesel hanno prezzi d’acquisto più alti. Per capire cosa conviene davvero bisogna confrontare tutte le voci di costo, non solo i consumi.</p>
  <p>Il calcolatore divide il costo annuo di ciascuna auto in due parti:</p>
  <ul>
    <li><strong>Costi fissi</strong>, che paghi anche se l’auto resta ferma: svalutazione, assicurazione, bollo e manutenzione.</li>
    <li><strong>Costi variabili</strong>, che crescono con i chilometri: carburante e pneumatici.</li>
  </ul>
  <p>Il diesel ha di solito costi fissi più alti e costi per chilometro più bassi. Il <strong>punto di pareggio</strong> è il chilometraggio annuo in cui le due auto costano uguale: sopra quella soglia conviene il diesel, sotto la benzina.</p>

  <h2>Cosa sposta il risultato</h2>
  <ul>
    <li><strong>Differenza tra i prezzi alla pompa.</strong> Il calcolatore propone le medie nazionali aggiornate ogni giorno dai dati del Ministero delle Imprese e del Made in Italy: quando il gasolio costa più della benzina, il vantaggio del diesel si riduce molto.</li>
    <li><strong>Consumi reali.</strong> Il diesel dà il meglio su percorsi extraurbani e autostradali; in città il vantaggio si assottiglia.</li>
    <li><strong>Prezzo d’acquisto e svalutazione.</strong> Qualche migliaio di euro in più all’acquisto pesa ogni anno sotto forma di svalutazione.</li>
    <li><strong>Manutenzione.</strong> Filtro antiparticolato, AdBlue e iniettori possono rendere la manutenzione del diesel più costosa.</li>
  </ul>
  ${c.ad('articolo')}
  <h2>Esempio pratico</h2>
  <p>Confrontiamo due auto con valori <strong>ipotetici</strong>, 20.000 km all’anno per 6 anni, con prezzi dei carburanti arrotondati vicini alle medie nazionali di inizio ottobre 2026 (benzina 2,10 €/l, gasolio 2,30 €/l):</p>
  <div class="esempio">
    <table>
      <caption class="sr-only">Esempio di confronto diesel e benzina</caption>
      <thead><tr><th scope="col">Voce (€/anno)</th><th scope="col" class="num">Benzina</th><th scope="col" class="num">Diesel</th></tr></thead>
      <tbody>
        <tr><th scope="row">Prezzo d’acquisto</th><td class="num">24.000 €</td><td class="num">26.000 €</td></tr>
        <tr><th scope="row">Svalutazione</th><td class="num">2.491</td><td class="num">2.811</td></tr>
        <tr><th scope="row">Carburante (6 l contro 4,8 l/100 km)</th><td class="num">2.520</td><td class="num">2.208</td></tr>
        <tr><th scope="row">Assicurazione</th><td class="num">550</td><td class="num">580</td></tr>
        <tr><th scope="row">Bollo</th><td class="num">220</td><td class="num">260</td></tr>
        <tr><th scope="row">Manutenzione</th><td class="num">450</td><td class="num">550</td></tr>
        <tr><th scope="row">Pneumatici</th><td class="num">200</td><td class="num">210</td></tr>
      </tbody>
      <tfoot><tr><th scope="row">Totale annuo</th><td class="num">6.431</td><td class="num">6.619</td></tr></tfoot>
    </table>
  </div>
  <p>Il diesel risparmia circa 312 € all’anno di carburante, ma costa circa 490 € in più di costi fissi. Risultato: a 20.000 km la benzina costa ancora circa <strong>190 € all’anno in meno</strong> e il pareggio arriva solo verso i <strong>32.400 km all’anno</strong>. Con un gasolio più economico della benzina, come accadeva in passato, la soglia scenderebbe molto: prova a cambiare i prezzi nel calcolatore.</p>

  <h2>Errori comuni</h2>
  <ol>
    <li><strong>Dare per scontato che il gasolio costi meno.</strong> Controlla i prezzi medi aggiornati prima di decidere.</li>
    <li><strong>Guardare solo i consumi.</strong> Un litro in meno ogni 100 km vale poco se l’auto costa 2.000 € in più.</li>
    <li><strong>Sottovalutare l’uso cittadino.</strong> Con tanti tragitti brevi il diesel consuma di più e il filtro antiparticolato può richiedere interventi.</li>
    <li><strong>Ignorare le limitazioni al traffico.</strong> Alcune città limitano i diesel delle classi ambientali più vecchie: può incidere sul valore di rivendita.</li>
  </ol>
  <p>Vuoi valutare anche l’ibrido o l’elettrico? Prova il confronto <a href="/costo-auto-ibrida/">ibrida o benzina</a> e quello <a href="/confronto-elettrica-benzina/">elettrica o benzina</a>, oppure calcola tutte le voci con il <a href="/">calcolatore completo</a>.</p>
</article>
${c.faq(faq)}
${correlati('/diesel-o-benzina/')}
</div>
<aside aria-label="Pubblicità">${c.ad('laterale', 'side')}</aside>
</div>
</div>`,
};
