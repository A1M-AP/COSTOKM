import { calculator } from '../calculator.mjs';
import { correlati } from '../correlati.mjs';

const faq = [
  {
    q: 'Come si calcola il costo di un’auto al chilometro?',
    a: 'Si sommano tutte le spese di un anno (svalutazione, carburante o energia, assicurazione, bollo, manutenzione, pneumatici, parcheggio, pedaggi e interessi dell’eventuale finanziamento) e si divide il totale per i chilometri percorsi nello stesso anno.',
  },
  {
    q: 'Perché la svalutazione è spesso la voce più pesante?',
    a: 'Perché un’auto perde valore ogni anno anche se resta ferma. La differenza tra il prezzo pagato e quanto ricaverai rivendendola è un costo reale, anche se non lo paghi con un bonifico: lo scopri solo al momento della vendita o della permuta.',
  },
  {
    q: 'La rata del finanziamento va inserita tra i costi?',
    a: 'No, non per intero. La quota capitale della rata rimborsa il prezzo dell’auto, che è già conteggiato tramite la svalutazione. Il costo aggiuntivo del finanziamento sono solo gli interessi, che il calcolatore ricava da importo, TAN e durata.',
  },
  {
    q: 'Dove trovo il prezzo medio dei carburanti?',
    a: 'Il Ministero delle Imprese e del Made in Italy (MIMIT) pubblica le rilevazioni dei prezzi medi nazionali dei carburanti. Il calcolatore usa i valori riportati nel nostro file dei prezzi, con la data di aggiornamento indicata accanto ai campi, ma puoi sempre inserire il prezzo che paghi tu.',
  },
  {
    q: 'Quanto è affidabile il risultato?',
    a: 'Il risultato è indicativo e affidabile quanto i dati che inserisci. I valori proposti all’apertura sono solo esempi: per una stima realistica usa il tuo preventivo assicurativo, il bollo effettivo e il consumo reale della tua auto.',
  },
  {
    q: 'I dati che inserisco vengono salvati?',
    a: 'No. Tutti i calcoli avvengono nel tuo browser e nessun dato viene inviato ai nostri server. Se usi il pulsante Condividi, i valori vengono inseriti nel link, così chi lo apre può rivedere lo stesso calcolo.',
  },
];

export default {
  path: '/',
  priority: 1.0,
  title: 'Costo auto al km: quanto ti costa davvero | costokm.it',
  ogTitle: 'Quanto ti costa davvero la tua auto? Calcola il costo al km',
  description: 'Calcola gratis il costo reale della tua auto al km, al mese e all’anno: svalutazione, carburante, assicurazione, bollo e manutenzione. Confronta fino a 3 auto.',
  h1: 'Quanto ti costa davvero la tua auto',
  app: 'Calcolatore del costo reale dell’auto al km',
  scripts: ['/assets/js/calcolatore.js'],
  faq,
  body: (c) => `<div class="wrap">
<section class="intro">
  <h1>Quanto ti costa davvero la tua auto</h1>
  <p>Costo al km, al mese e all’anno con tutte le voci, svalutazione compresa. Confronta fino a 3 auto.</p>
</section>
${calculator(c, 'standard')}
${c.ad('dopo-calcolatore', 'wide')}
<div class="layout-article">
<div>
<article class="article">
  <h2>Le voci che compongono il costo reale di un’auto</h2>
  <p>Quando si pensa a quanto costa un’auto, di solito vengono in mente il pieno e l’assicurazione. In realtà il costo di possesso è fatto di molte voci, alcune evidenti e altre nascoste. Il calcolatore le considera tutte:</p>
  <ul>
    <li><strong>Svalutazione</strong>: la differenza tra il prezzo d’acquisto e il valore dell’auto quando la venderai, divisa per gli anni di possesso. Puoi indicare il valore residuo stimato oppure una percentuale di svalutazione annua.</li>
    <li><strong>Interessi del finanziamento</strong>: se compri a rate, il costo aggiuntivo sono gli interessi, calcolati da importo, TAN e durata e ripartiti sugli anni del finanziamento.</li>
    <li><strong>Carburante o energia</strong>: dipende da chilometri, consumo reale e prezzo. Per le elettriche puoi distinguere la ricarica domestica da quella alle colonnine, che ha prezzi molto diversi.</li>
    <li><strong>Assicurazione</strong>: RC auto obbligatoria più eventuali garanzie accessorie come furto e incendio, kasko, cristalli o assistenza stradale.</li>
    <li><strong>Bollo</strong>: la tassa automobilistica regionale, che varia in base alla potenza in kW, alla classe ambientale e alla regione di residenza. Molte regioni prevedono esenzioni o riduzioni per le auto elettriche.</li>
    <li><strong>Manutenzione</strong>: tagliandi programmati e una stima per le riparazioni impreviste.</li>
    <li><strong>Pneumatici</strong>: il costo di un treno di gomme ripartito sui chilometri che percorri ogni anno.</li>
    <li><strong>Altri costi</strong>: garage o parcheggio, abbonamenti, pedaggi, lavaggi ed eventuali multe o permessi ZTL.</li>
  </ul>

  <h2>Come calcoliamo il costo al km</h2>
  <p>Il metodo è trasparente e puoi rifare i conti a mano:</p>
  <ul>
    <li>Svalutazione annua = (prezzo d’acquisto − valore residuo) ÷ anni di possesso.</li>
    <li>Carburante annuo = km annui ÷ 100 × consumo × prezzo.</li>
    <li>Pneumatici annui = costo del treno × km annui ÷ durata in km.</li>
    <li>Costo totale annuo = somma di tutte le voci.</li>
    <li>Costo al km = costo totale annuo ÷ km annui; costo mensile = costo annuo ÷ 12.</li>
  </ul>
  <p>Gli interessi vengono ripartiti sugli anni del finanziamento: se tieni l’auto più a lungo della durata del prestito, il totale degli interessi viene distribuito sull’intero periodo di possesso; se la vendi prima, si conteggia solo la quota relativa agli anni in cui la possiedi.</p>
  ${c.ad('articolo')}
  <h2>Esempio pratico completo</h2>
  <p>Prendiamo un’utilitaria a benzina con valori <strong>puramente ipotetici</strong>, scelti solo per mostrare il metodo:</p>
  <div class="esempio">
    <table>
      <caption class="sr-only">Esempio di calcolo del costo annuo</caption>
      <thead><tr><th scope="col">Voce</th><th scope="col">Calcolo</th><th scope="col" class="num">€/anno</th></tr></thead>
      <tbody>
        <tr><th scope="row">Svalutazione</th><td>(20.000 − 8.000) ÷ 5 anni</td><td class="num">2.400</td></tr>
        <tr><th scope="row">Carburante</th><td>12.000 km ÷ 100 × 6 l × 1,80 €/l (prezzo di esempio)</td><td class="num">1.296</td></tr>
        <tr><th scope="row">Assicurazione</th><td>RC 500 + accessorie 150</td><td class="num">650</td></tr>
        <tr><th scope="row">Bollo</th><td>importo ipotetico</td><td class="num">200</td></tr>
        <tr><th scope="row">Manutenzione</th><td>tagliandi 300 + imprevisti 200</td><td class="num">500</td></tr>
        <tr><th scope="row">Pneumatici</th><td>400 € × 12.000 ÷ 40.000 km</td><td class="num">120</td></tr>
        <tr><th scope="row">Altri costi</th><td>pedaggi 150 + lavaggi 100</td><td class="num">250</td></tr>
      </tbody>
      <tfoot><tr><th scope="row">Totale</th><td></td><td class="num">5.416</td></tr></tfoot>
    </table>
  </div>
  <p>Il costo totale è di circa <strong>5.416 € all’anno</strong>, cioè <strong>451 € al mese</strong> e <strong>0,45 € per ogni chilometro</strong>. In cinque anni la spesa complessiva arriva a circa 27.000 €. La voce principale è la svalutazione, che da sola vale il 44% del totale: più del carburante. Ecco perché chi guarda solo il pieno sottostima il costo della propria auto anche della metà.</p>

  <h2>Gli errori più comuni</h2>
  <ol>
    <li><strong>Dimenticare la svalutazione.</strong> È il costo più grande per le auto nuove, ma non si vede finché non si vende l’auto.</li>
    <li><strong>Contare la rata intera come costo.</strong> La quota capitale è già inclusa nel prezzo d’acquisto: il costo del finanziamento sono gli interessi.</li>
    <li><strong>Usare il consumo dichiarato.</strong> Nella guida reale il consumo è quasi sempre più alto: meglio usare la media del computer di bordo o dei rifornimenti.</li>
    <li><strong>Ignorare gomme e imprevisti.</strong> Sono spese irregolari e quindi facili da dimenticare, ma su più anni pesano.</li>
    <li><strong>Confrontare auto con chilometraggi diversi.</strong> Il costo al km cambia molto con i km annui: confronta sempre i veicoli con lo stesso utilizzo.</li>
  </ol>

  <h2>Come usare il risultato</h2>
  <p>Aggiungi fino a tre auto con il pulsante <em>Aggiungi auto</em> per confrontarle con lo stesso chilometraggio: ogni nuova scheda parte dai valori di quella attiva, così basta modificare le differenze. Puoi copiare il riepilogo, stamparlo oppure condividerlo con un link che ricarica esattamente lo stesso calcolo. Se l’assicurazione o la svalutazione pesano molto, può valere la pena confrontare i preventivi RC auto o valutare un noleggio a lungo termine, mettendo il canone a confronto con il costo mensile calcolato qui.</p>
</article>
${c.faq(faq)}
${correlati('/')}
</div>
<aside aria-label="Pubblicità">${c.ad('laterale', 'side')}</aside>
</div>
</div>`,
};
