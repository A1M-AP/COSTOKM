import { correlati } from '../correlati.mjs';
import { confrontoTool } from '../confronto-tool.mjs';

const faq = [
  {
    q: 'Conviene di più il GPL o il metano?',
    a: 'Dipende soprattutto dal prezzo dei due carburanti nella tua zona e dai consumi delle auto che confronti. Con i prezzi medi di inizio ottobre 2026 e i valori di esempio della pagina conviene il GPL, ma se il metano costa meno dove fai rifornimento il risultato può cambiare: inserisci i tuoi prezzi.',
  },
  {
    q: 'Perché il metano si misura in kg e il GPL in litri?',
    a: 'Il metano per auto è un gas compresso e si vende a peso (euro al chilogrammo); il GPL è liquido nel serbatoio e si vende a volume (euro al litro). Per confrontarli conta il costo per 100 km: consumo moltiplicato per il prezzo, che il calcolatore mostra già.',
  },
  {
    q: 'Le auto a GPL e metano usano anche la benzina?',
    a: 'Quasi sempre sono bifuel: si avviano a benzina e passano poi al gas, e usano la benzina quando il serbatoio del gas è vuoto. Se usi spesso la benzina, alza leggermente il consumo o il prezzo medio inserito.',
  },
  {
    q: 'Ci sono costi di manutenzione specifici?',
    a: 'Sì: il serbatoio del GPL va sostituito dopo un certo numero di anni e le bombole del metano richiedono controlli periodici, oltre ai filtri e alla regolazione dell’impianto. Inserisci queste spese, divise per anno, nella voce manutenzione.',
  },
  {
    q: 'Dove trovo i prezzi aggiornati di GPL e metano?',
    a: 'Il calcolatore propone le medie nazionali calcolate ogni giorno sui prezzi comunicati dai distributori al Ministero delle Imprese e del Made in Italy. Nella pagina dei prezzi di oggi trovi anche le medie per regione.',
  },
];

export default {
  path: '/gpl-o-metano/',
  priority: 0.7,
  title: 'GPL o metano? Calcola quale conviene | costokm.it',
  ogTitle: 'GPL o metano: quale alimentazione conviene davvero?',
  description: 'Confronta il costo reale di un’auto a GPL e di una a metano con i prezzi medi aggiornati: costo al km, costo annuo e punto di pareggio.',
  h1: 'GPL o metano: quale conviene?',
  breadcrumb: 'GPL o metano',
  app: 'Calcolatore di convenienza GPL o metano',
  scripts: ['/assets/js/confronto.js'],
  faq,
  body: (c) => `<div class="wrap">
<section class="intro">
  <h1>GPL o metano: quale conviene?</h1>
  <p>Confronta due auto a gas con i prezzi medi aggiornati: costo reale annuo, costo al km e chilometraggio di pareggio.</p>
</section>
${confrontoTool(c, 'gpl-metano')}
${c.ad('dopo-calcolatore', 'wide')}
<div class="layout-article">
<div>
<article class="article">
  <h2>GPL e metano: due modi di risparmiare sul carburante</h2>
  <p>GPL e metano sono le alimentazioni a gas più diffuse in Italia e nascono con lo stesso obiettivo: spendere meno per ogni chilometro rispetto alla benzina. Ma tra loro ci sono differenze importanti: il prezzo alla pompa, l’unità di misura, i consumi, la diffusione dei distributori e i costi dell’impianto. Il confronto ha senso solo sul <strong>costo per chilometro</strong> e sul costo complessivo dell’auto.</p>
  <ul>
    <li><strong>GPL</strong>: si vende al litro, i distributori sono molto diffusi e gli impianti costano relativamente poco. Il consumo in litri è più alto di quello della benzina, ma il prezzo al litro è molto più basso.</li>
    <li><strong>Metano</strong>: si vende al chilogrammo, ha consumi bassi in kg per 100 km e un prezzo per kg più alto. I distributori sono meno numerosi e distribuiti in modo disomogeneo tra le regioni.</li>
  </ul>

  <h2>Come confrontarli</h2>
  <p>Il calcolatore trasforma consumo e prezzo in costo per 100 km e lo somma alle altre voci: svalutazione, assicurazione, bollo, manutenzione e pneumatici. Poi separa i costi fissi da quelli che crescono con i km e calcola il <strong>punto di pareggio</strong>, cioè il chilometraggio annuo oltre il quale l’auto con il costo al km più basso diventa la scelta più economica. Se una delle due costa meno sia nei costi fissi sia al km, il calcolatore lo segnala: in quel caso conviene sempre.</p>
  ${c.ad('articolo')}
  <h2>Esempio pratico</h2>
  <p>Due auto con valori <strong>ipotetici</strong>, 18.000 km all’anno per 6 anni, con prezzi arrotondati vicini alle medie nazionali di inizio ottobre 2026 (GPL 0,75 €/l, metano 1,90 €/kg):</p>
  <div class="esempio">
    <table>
      <caption class="sr-only">Esempio di confronto GPL e metano</caption>
      <thead><tr><th scope="col">Voce (€/anno)</th><th scope="col" class="num">GPL</th><th scope="col" class="num">Metano</th></tr></thead>
      <tbody>
        <tr><th scope="row">Prezzo d’acquisto</th><td class="num">22.500 €</td><td class="num">23.500 €</td></tr>
        <tr><th scope="row">Svalutazione</th><td class="num">2.336</td><td class="num">2.541</td></tr>
        <tr><th scope="row">Carburante (7,8 l contro 4,2 kg/100 km)</th><td class="num">1.053</td><td class="num">1.436</td></tr>
        <tr><th scope="row">Assicurazione e bollo</th><td class="num">720</td><td class="num">720</td></tr>
        <tr><th scope="row">Manutenzione</th><td class="num">480</td><td class="num">520</td></tr>
        <tr><th scope="row">Pneumatici</th><td class="num">180</td><td class="num">180</td></tr>
      </tbody>
      <tfoot><tr><th scope="row">Totale annuo</th><td class="num">4.769</td><td class="num">5.397</td></tr></tfoot>
    </table>
  </div>
  <p>Con questi prezzi il GPL costa circa 5,9 € ogni 100 km contro circa 8 € del metano: l’auto a GPL è più economica sia nei costi fissi sia al chilometro e fa risparmiare circa <strong>630 € all’anno</strong>. Il risultato dipende molto dal prezzo del metano, che negli ultimi anni ha oscillato più di quello del GPL: se dove fai rifornimento il metano costa meno, inserisci il tuo prezzo e il confronto si aggiorna.</p>

  <h2>Errori comuni</h2>
  <ol>
    <li><strong>Confrontare il prezzo al litro con quello al kg.</strong> Conta solo il costo per 100 km.</li>
    <li><strong>Dimenticare la benzina.</strong> Le auto bifuel ne consumano una parte, soprattutto all’avvio e quando il gas finisce.</li>
    <li><strong>Ignorare i distributori.</strong> Se il metano più vicino è lontano, i chilometri per raggiungerlo sono un costo.</li>
    <li><strong>Trascurare i costi dell’impianto.</strong> Serbatoio, bombole e controlli periodici vanno messi nella manutenzione.</li>
  </ol>
  <p>Consulta i <a href="/prezzo-benzina-oggi/">prezzi medi di oggi per regione</a>, confronta il gas con la <a href="/diesel-o-benzina/">benzina e il diesel</a> o calcola tutte le voci con il <a href="/">calcolatore completo</a>.</p>
</article>
${c.faq(faq)}
${correlati('/gpl-o-metano/')}
</div>
<aside aria-label="Pubblicità">${c.ad('laterale', 'side')}</aside>
</div>
</div>`,
};
