import { calculator } from '../calculator.mjs';
import { correlati } from '../correlati.mjs';

const faq = [
  {
    q: 'Quanto costa mantenere un’auto per un neopatentato?',
    a: 'Dipende soprattutto da assicurazione, prezzo dell’auto e km percorsi. Per un neopatentato l’RC auto è spesso la voce che pesa di più dopo la svalutazione, perché si parte dalla classe di merito più alta. Inserisci il tuo preventivo nel calcolatore per avere il costo reale al km, al mese e all’anno.',
  },
  {
    q: 'Come può un neopatentato risparmiare sull’assicurazione?',
    a: 'Le norme note come Legge Bersani e RC familiare permettono, a determinate condizioni, di ottenere la classe di merito di un familiare convivente. Conviene inoltre confrontare più preventivi, valutare la scatola nera e scegliere un’auto di potenza e valore contenuti.',
  },
  {
    q: 'Quali auto può guidare un neopatentato?',
    a: 'Per i primi anni dopo il conseguimento della patente B il Codice della Strada pone limiti alla potenza delle auto guidabili (rapporto potenza/tara e potenza massima). Prima dell’acquisto verifica i limiti aggiornati sul sito del Ministero delle Infrastrutture e dei Trasporti o sul Portale dell’Automobilista.',
  },
  {
    q: 'Meglio un’auto nuova o usata come prima auto?',
    a: 'Un’auto usata di qualche anno costa meno e si svaluta più lentamente, ma può richiedere più manutenzione. Prova entrambe le ipotesi con il pulsante Aggiungi auto: il calcolatore mette a confronto il costo totale con lo stesso chilometraggio.',
  },
  {
    q: 'Il calcolo vale anche per un’auto intestata a un genitore?',
    a: 'Sì: il costo di possesso non dipende da chi è l’intestatario. Cambiano però premio assicurativo ed eventuali agevolazioni: inserisci il preventivo reale per la soluzione che stai valutando.',
  },
];

export default {
  path: '/costo-auto-neopatentati/',
  priority: 0.8,
  title: 'Costo prima auto per neopatentati | costokm.it',
  ogTitle: 'Quanto costa la prima auto? Il calcolatore per neopatentati',
  description: 'Quanto costa davvero la prima auto? Calcolatore per neopatentati con assicurazione, svalutazione, carburante e manutenzione: costo al km, al mese e all’anno.',
  h1: 'Quanto costa la prima auto per un neopatentato',
  breadcrumb: 'Auto per neopatentati',
  app: 'Calcolatore costo auto per neopatentati',
  scripts: ['/assets/js/calcolatore.js'],
  faq,
  body: (c) => `<div class="wrap">
<section class="intro">
  <h1>Quanto costa la prima auto per un neopatentato</h1>
  <p>Valori di partenza tipici di una prima auto usata: modificali con i tuoi preventivi.</p>
</section>
${calculator(c, 'neopatentati')}
${c.ad('dopo-calcolatore', 'wide')}
<div class="layout-article">
<div>
<article class="article">
  <h2>Perché la prima auto costa più di quanto sembra</h2>
  <p>Chi ha appena preso la patente di solito confronta i prezzi di acquisto e il costo del pieno. Ma il costo reale di un’auto comprende molte altre voci, e per un neopatentato alcune pesano più che per un guidatore esperto. Il calcolatore qui sopra parte da valori di esempio pensati per una prima auto: un’utilitaria usata, pochi chilometri all’anno e un premio assicurativo più alto della media. Sono solo un punto di partenza: sostituiscili con i preventivi reali.</p>
  <h2>Le voci da tenere d’occhio</h2>
  <ul>
    <li><strong>Assicurazione RC auto</strong>: chi si assicura per la prima volta parte normalmente dalla classe di merito più alta, con premi elevati. Verifica se puoi usare la classe di un familiare convivente (Legge Bersani e RC familiare) e confronta più preventivi: la differenza tra compagnie può essere notevole.</li>
    <li><strong>Svalutazione</strong>: anche un’auto usata perde valore ogni anno. Con un’auto economica la cifra assoluta è più bassa, ed è uno dei motivi per cui la prima auto usata conviene spesso.</li>
    <li><strong>Carburante</strong>: con pochi km all’anno pesa meno di quanto si pensi; inserisci comunque il consumo reale e il prezzo che paghi.</li>
    <li><strong>Bollo</strong>: dipende dalla potenza in kW, dalla classe ambientale e dalla regione di residenza. Le auto poco potenti adatte ai neopatentati hanno generalmente un bollo contenuto.</li>
    <li><strong>Manutenzione e imprevisti</strong>: su un’auto usata conviene prevedere un budget per riparazioni impreviste, oltre al tagliando.</li>
    <li><strong>Pneumatici</strong>: un treno di gomme nuove è una spesa che arriva prima o poi; il calcolatore la ripartisce sui km che percorri.</li>
  </ul>
  ${c.ad('articolo')}
  <h2>Esempio pratico</h2>
  <p>Una prima auto usata con valori <strong>puramente ipotetici</strong>: pagata 11.000 € e rivenduta a 5.000 € dopo 4 anni, 8.000 km all’anno, consumo di 5,5 l/100 km con un prezzo di esempio di 1,80 €/l.</p>
  <div class="esempio">
    <table>
      <caption class="sr-only">Esempio di costo annuo della prima auto</caption>
      <thead><tr><th scope="col">Voce</th><th scope="col">Calcolo</th><th scope="col" class="num">€/anno</th></tr></thead>
      <tbody>
        <tr><th scope="row">Svalutazione</th><td>(11.000 − 5.000) ÷ 4</td><td class="num">1.500</td></tr>
        <tr><th scope="row">Assicurazione</th><td>RC 1.200 + accessorie 80</td><td class="num">1.280</td></tr>
        <tr><th scope="row">Carburante</th><td>8.000 ÷ 100 × 5,5 × 1,80</td><td class="num">792</td></tr>
        <tr><th scope="row">Manutenzione</th><td>tagliando 250 + imprevisti 300</td><td class="num">550</td></tr>
        <tr><th scope="row">Bollo</th><td>importo ipotetico</td><td class="num">150</td></tr>
        <tr><th scope="row">Pneumatici</th><td>300 € × 8.000 ÷ 40.000</td><td class="num">60</td></tr>
        <tr><th scope="row">Altri costi</th><td>pedaggi 50 + lavaggi 60</td><td class="num">110</td></tr>
      </tbody>
      <tfoot><tr><th scope="row">Totale</th><td></td><td class="num">4.442</td></tr></tfoot>
    </table>
  </div>
  <p>Il totale è di circa <strong>4.442 € all’anno, 370 € al mese e 0,56 € al km</strong>. L’assicurazione da sola vale quasi il 29% del costo: ottenere una classe di merito migliore o un preventivo più basso è la leva di risparmio più efficace. Nota anche il costo al km: con pochi chilometri all’anno i costi fissi si distribuiscono su meno strada e il costo per chilometro sale.</p>
  <h2>Limiti di potenza per i neopatentati</h2>
  <p>Nei primi anni dopo il conseguimento della patente B ci sono limiti alla potenza delle auto che si possono guidare, espressi come rapporto tra potenza e tara e come potenza massima. La riforma del Codice della Strada entrata in vigore a dicembre 2024 ha modificato questi limiti e la loro durata. Prima di acquistare verifica sul libretto i dati dell’auto e controlla le regole aggiornate sui canali ufficiali del Ministero delle Infrastrutture e dei Trasporti.</p>
  <h2>Nuova, usata o noleggio?</h2>
  <p>Per la prima auto le strade sono tre. L’<strong>usato</strong> ha il prezzo e la svalutazione più bassi, ma richiede attenzione allo stato del veicolo. Il <strong>nuovo</strong> offre garanzia e costi di manutenzione prevedibili, ma perde valore più in fretta nei primi anni. Il <strong>noleggio a lungo termine</strong> trasforma molte spese in un canone fisso: verifica però le condizioni per i neopatentati, i limiti di chilometraggio e cosa è incluso. Il modo migliore per decidere è confrontare il costo mensile calcolato qui con le alternative concrete.</p>
  <h2>Errori comuni dei neopatentati</h2>
  <ol>
    <li><strong>Scegliere l’auto senza chiedere prima il preventivo RC</strong>: due modelli simili possono avere premi molto diversi.</li>
    <li><strong>Dimenticare la svalutazione</strong>: anche se l’auto costa poco, perde comunque valore.</li>
    <li><strong>Non prevedere imprevisti</strong> su un’auto usata, come batteria, freni o frizione.</li>
    <li><strong>Sottovalutare le spese fisse</strong> con pochi km: assicurazione e bollo si pagano anche se l’auto resta ferma.</li>
  </ol>
  <p>Stai valutando due auto? Usa <em>Aggiungi auto</em> per confrontarle, oppure valuta un <a href="/confronto-elettrica-benzina/">confronto tra elettrica e benzina</a>.</p>
</article>
${c.faq(faq)}
${correlati('/costo-auto-neopatentati/')}
</div>
<aside aria-label="Pubblicità">${c.ad('laterale', 'side')}</aside>
</div>
</div>`,
};
