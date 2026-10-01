import { calculator } from '../calculator.mjs';
import { correlati } from '../correlati.mjs';

const faq = [
  {
    q: 'Quanto costa mantenere un’auto al mese?',
    a: 'Dipende dall’auto e da quanto la usi. Negli esempi di questa pagina si va da circa 290 € al mese per un’utilitaria usata con pochi km a oltre 800 € per un SUV nuovo con 18.000 km all’anno. Il calcolatore ti dà la cifra per la tua auto.',
  },
  {
    q: 'Perché il costo mensile è più alto di quello che spendo davvero ogni mese?',
    a: 'Perché include spese che non paghi ogni mese ma che maturano comunque: la svalutazione, che scopri solo alla vendita, e le spese annuali o irregolari come assicurazione, bollo, gomme e riparazioni. Dividendole per 12 ottieni il vero costo mensile.',
  },
  {
    q: 'Quanto dovrei mettere da parte ogni mese per l’auto?',
    a: 'Una regola prudente è accantonare ogni mese la somma di assicurazione, bollo, manutenzione e pneumatici divisa per 12, più una quota per sostituire l’auto in futuro pari alla svalutazione mensile. Il calcolatore mostra tutte queste voci.',
  },
  {
    q: 'La rata del finanziamento è il costo mensile dell’auto?',
    a: 'No. La rata rimborsa il prezzo dell’auto, già contato con la svalutazione, più gli interessi. Il costo mensile reale comprende anche carburante, assicurazione, bollo e manutenzione, e la sola parte di interessi del finanziamento.',
  },
  {
    q: 'Conviene il noleggio a lungo termine rispetto all’acquisto?',
    a: 'Confronta il canone mensile del noleggio con il costo mensile calcolato qui, aggiungendo al canone le spese non incluse, di solito carburante, pedaggi e parcheggio. Il calcolo va fatto a parità di chilometri e di anni.',
  },
];

export default {
  path: '/quanto-costa-un-auto-al-mese/',
  priority: 0.8,
  title: 'Quanto costa un’auto al mese? Calcolo reale | costokm.it',
  ogTitle: 'Quanto costa davvero un’auto al mese?',
  description: 'Calcola quanto costa mantenere un’auto al mese: carburante, assicurazione, bollo, manutenzione e svalutazione. Esempi per utilitaria, compatta e SUV.',
  h1: 'Quanto costa un’auto al mese',
  breadcrumb: 'Costo auto al mese',
  app: 'Calcolatore del costo mensile dell’auto',
  scripts: ['/assets/js/calcolatore.js'],
  faq,
  body: (c) => `<div class="wrap">
<section class="intro">
  <h1>Quanto costa un’auto al mese</h1>
  <p>Il costo mensile reale della tua auto, comprese le spese che non vedi ogni mese.</p>
</section>
${calculator(c, 'standard')}
${c.ad('dopo-calcolatore', 'wide')}
<div class="layout-article">
<div>
<article class="article">
  <h2>Il costo mensile che non vedi</h2>
  <p>Alla domanda “quanto ti costa l’auto al mese?” quasi tutti rispondono con la cifra del carburante, magari sommata alla rata. Ma il costo mensile reale è un altro: comprende le spese che arrivano una volta l’anno, come assicurazione e bollo, quelle irregolari, come gomme e riparazioni, e soprattutto la <strong>svalutazione</strong>, cioè il valore che l’auto perde ogni mese anche se resta in garage.</p>
  <p>Il calcolatore qui sopra trasforma tutte queste voci in una cifra mensile: è la somma che, in media, la tua auto ti costa ogni mese per tutto il periodo in cui la possiedi.</p>

  <h2>Le voci del costo mensile</h2>
  <ul>
    <li><strong>Spese mensili visibili</strong>: carburante o ricarica, parcheggio, pedaggi, lavaggi.</li>
    <li><strong>Spese annuali da dividere per 12</strong>: assicurazione RC e garanzie accessorie, bollo, tagliando.</li>
    <li><strong>Spese irregolari</strong>: pneumatici, riparazioni impreviste, batteria, freni. Conviene stimarle e accantonarle ogni mese.</li>
    <li><strong>Svalutazione</strong>: la differenza tra quanto paghi l’auto e quanto ne ricaverai, divisa per i mesi di possesso.</li>
    <li><strong>Interessi</strong>: se compri a rate, solo la parte di interessi è un costo aggiuntivo.</li>
  </ul>
  ${c.ad('articolo')}
  <h2>Tre esempi a confronto</h2>
  <p>Profili <strong>ipotetici</strong>, possesso di 5 anni, benzina a 2,11 €/l (media nazionale self del 30 settembre 2026):</p>
  <div class="esempio">
    <table>
      <caption class="sr-only">Costo mensile di tre profili di auto</caption>
      <thead><tr><th scope="col">Voce (€/mese)</th><th scope="col" class="num">Utilitaria usata</th><th scope="col" class="num">Compatta nuova</th><th scope="col" class="num">SUV medio</th></tr></thead>
      <tbody>
        <tr><th scope="row">Km all’anno</th><td class="num">8.000</td><td class="num">12.000</td><td class="num">18.000</td></tr>
        <tr><th scope="row">Svalutazione</th><td class="num">83</td><td class="num">217</td><td class="num">333</td></tr>
        <tr><th scope="row">Carburante</th><td class="num">77</td><td class="num">127</td><td class="num">222</td></tr>
        <tr><th scope="row">Assicurazione</th><td class="num">54</td><td class="num">54</td><td class="num">83</td></tr>
        <tr><th scope="row">Manutenzione e riparazioni</th><td class="num">46</td><td class="num">42</td><td class="num">63</td></tr>
        <tr><th scope="row">Bollo, gomme e altro</th><td class="num">26</td><td class="num">48</td><td class="num">101</td></tr>
      </tbody>
      <tfoot><tr><th scope="row">Totale al mese</th><td class="num">287</td><td class="num">487</td><td class="num">802</td></tr></tfoot>
    </table>
  </div>
  <p>L’utilitaria usata (pagata 9.000 €) costa circa <strong>290 € al mese</strong>, la compatta nuova da 22.000 € circa <strong>490 €</strong> e il SUV da 35.000 € oltre <strong>800 €</strong>. In tutti e tre i casi la svalutazione è una delle prime voci: per l’auto nuova vale da sola quasi metà del costo mensile, più del carburante.</p>

  <h2>Quanto mettere da parte ogni mese</h2>
  <p>Conoscere il costo mensile serve anche a organizzare il bilancio familiare. Un metodo semplice è separare due accantonamenti. Il primo copre le <strong>spese annuali e irregolari</strong>: nell’esempio della compatta nuova, assicurazione, bollo, manutenzione e gomme valgono circa 1.470 € all’anno, cioè circa <strong>122 € al mese</strong> da mettere da parte per non farsi trovare impreparati alla scadenza. Il secondo è il <strong>fondo per la prossima auto</strong>, pari alla svalutazione mensile: circa 217 € nell’esempio. Chi accantona questa cifra si ritrova, alla vendita, con il valore residuo dell’auto più i risparmi necessari a sostituirla senza nuovi debiti.</p>

  <h2>Come ridurre il costo mensile</h2>
  <ol>
    <li><strong>Tieni l’auto più a lungo</strong>: la svalutazione è più forte nei primi anni e diluirla su più anni abbassa il costo mensile.</li>
    <li><strong>Confronta l’assicurazione</strong> a ogni rinnovo e valuta la classe di merito di un familiare, quando è possibile.</li>
    <li><strong>Scegli l’auto in base all’uso reale</strong>: un’auto più grande del necessario costa di più in ogni voce.</li>
    <li><strong>Accantona ogni mese</strong> le spese annuali e irregolari: eviti sorprese quando arrivano bollo, gomme o tagliando.</li>
  </ol>
  <p>Stai valutando il noleggio a lungo termine? Confronta il canone con il costo mensile calcolato qui, aggiungendo al canone le spese non incluse. Per scegliere l’alimentazione, prova i confronti <a href="/diesel-o-benzina/">diesel o benzina</a>, <a href="/costo-auto-ibrida/">ibrida</a> ed <a href="/confronto-elettrica-benzina/">elettrica</a>.</p>
</article>
${c.faq(faq)}
${correlati('/quanto-costa-un-auto-al-mese/')}
</div>
<aside aria-label="Pubblicità">${c.ad('laterale', 'side')}</aside>
</div>
</div>`,
};
