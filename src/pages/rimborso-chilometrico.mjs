import { correlati } from '../correlati.mjs';
import { RIMBORSO_DEFAULT } from '../../public/assets/js/defaults.js';
import { rimborsoChilometrico } from '../../public/assets/js/calc.js';
import { testiRimborso } from '../../public/assets/js/testi.js';

const ACI = 'https://www.aci.it/servizi/calcolo-costi-chilometrici/';

const faq = [
  {
    q: 'Come si calcola il rimborso chilometrico?',
    a: 'Si moltiplicano i chilometri percorsi per lavoro per il costo chilometrico del proprio veicolo indicato nelle tabelle ACI, oppure per la tariffa prevista dall’azienda. Pedaggi e parcheggi documentati si aggiungono a parte.',
  },
  {
    q: 'Dove trovo il costo chilometrico ACI della mia auto?',
    a: 'Sul servizio “Costi chilometrici” del sito ACI, gratuito previa registrazione, scegliendo categoria, marca, alimentazione e modello. Le tabelle sono pubblicate ogni anno in Gazzetta Ufficiale: quelle valide per il 2026 sono nella Gazzetta Ufficiale n. 297 del 23 dicembre 2025.',
  },
  {
    q: 'Il rimborso chilometrico è tassato?',
    a: 'Per i dipendenti in trasferta fuori dal comune della sede di lavoro, il rimborso calcolato in base alle tabelle ACI in genere non concorre al reddito. Per le trasferte nel comune e per i casi particolari le regole sono state modificate di recente: verifica sempre con l’ufficio del personale o con un consulente.',
  },
  {
    q: 'Perché il costo ACI cambia con la percorrenza annua?',
    a: 'Perché le tabelle ripartiscono i costi fissi dell’auto (svalutazione, assicurazione, bollo) sui chilometri percorsi in un anno: più km fai, più basso è il costo per km. Va scelta la colonna della percorrenza corretta.',
  },
  {
    q: 'Il rimborso copre davvero quanto spendo?',
    a: 'Dipende dalla tua auto e da come la usi. Puoi saperlo calcolando il tuo costo reale al km con il calcolatore di costokm.it e inserendolo nel campo “Il tuo costo reale al km”: vedrai quanta parte del costo è coperta.',
  },
];

export default {
  path: '/rimborso-chilometrico/',
  priority: 0.8,
  title: 'Rimborso chilometrico: calcolo con tabelle ACI | costokm.it',
  ogTitle: 'Calcolo del rimborso chilometrico con le tabelle ACI',
  description: 'Calcola il rimborso chilometrico per l’uso dell’auto propria in trasferta: km, tariffa ACI o aziendale, pedaggi. Scopri se copre il costo reale della tua auto.',
  h1: 'Calcolo del rimborso chilometrico',
  breadcrumb: 'Rimborso chilometrico',
  app: 'Calcolatore del rimborso chilometrico',
  scripts: ['/assets/js/rimborso.js'],
  faq,
  body: (c) => {
    const t = RIMBORSO_DEFAULT;
    const r = rimborsoChilometrico(t);
    const tx = testiRimborso(r, t);
    const f = (o) => c.field({ value: t[o.name], ...o });
    return `<div class="wrap">
<section class="intro">
  <h1>Calcolo del rimborso chilometrico</h1>
  <p>Quanto ti spetta per l’uso dell’auto propria in trasferta, con la tariffa delle tabelle ACI o quella della tua azienda.</p>
</section>
<div class="calc" data-rimborso>
<form class="calc-form" id="calc-form" novalidate aria-label="Dati del rimborso">
  <div class="grid-2">
    ${f({ name: 'km', label: 'Km per trasferta', unit: 'km', min: 0, max: 10000, required: true, hint: 'Solo andata.' })}
    ${f({ name: 'trasferte', label: 'Numero di trasferte', min: 1, max: 500, step: 1, integer: true, hint: 'Per esempio le trasferte del mese.' })}
  </div>
  <label class="check check--block"><input type="checkbox" name="andataRitorno"${t.andataRitorno ? ' checked' : ''}> Andata e ritorno</label>
  ${f({ name: 'tariffa', label: 'Rimborso per km', unit: '€/km', min: 0, max: 5, placeholder: 'es. dalle tabelle ACI', hint: `Costo chilometrico del tuo modello dalle <a href="${ACI}" rel="noopener" target="_blank">tabelle ACI<span class="sr-only"> (sito esterno)</span></a>, nella colonna della tua percorrenza annua, oppure la tariffa aziendale.` })}
  <div class="grid-2">
    ${f({ name: 'extra', label: 'Pedaggi, parcheggi', unit: '€', max: 10000, hint: 'Per trasferta, se rimborsati a parte.' })}
    ${f({ name: 'costoReale', label: 'Costo reale al km', unit: '€/km', min: 0, max: 5, placeholder: 'facoltativo', hint: 'Calcolalo con il <a href="/">calcolatore del costo auto</a>.' })}
  </div>
</form>
<section class="risultati" id="risultati" aria-labelledby="ris-title">
  <h2 id="ris-title">Il tuo rimborso</h2>
  <div class="kpis">
    <div class="kpi kpi--hero"><span class="kpi-label">Rimborso totale</span><span class="kpi-value" data-out="totale">${tx.totale}</span></div>
    <div class="kpi"><span class="kpi-label">Chilometrico</span><span class="kpi-value" data-out="chilometrico">${tx.chilometrico}</span></div>
    <div class="kpi"><span class="kpi-label">Pedaggi e parcheggi</span><span class="kpi-value" data-out="extra">${tx.extra}</span></div>
    <div class="kpi"><span class="kpi-label">Km rimborsati</span><span class="kpi-value" data-out="km">${tx.km}</span></div>
  </div>
  <div class="avvisi" data-out="avvisi">${tx.avvisi.map((a) => `<p class="avviso">${a}</p>`).join('')}</div>
  <p class="highlight" data-out="copertura">${tx.copertura}</p>
  ${c.actions()}
  <p class="disclaimer"><strong>Risultati indicativi.</strong> Il calcolo usa i dati che inserisci. Le regole fiscali sui rimborsi dipendono dal tipo di rapporto di lavoro e dal luogo della trasferta: per i casi concreti rivolgiti all’ufficio del personale o a un consulente. Nessun dato inserito viene inviato ai nostri server.</p>
</section>
</div>
${c.ad('dopo-calcolatore', 'wide')}
<div class="layout-article">
<div>
<article class="article">
  <h2>Cos’è il rimborso chilometrico</h2>
  <p>Il rimborso chilometrico è la somma che l’azienda riconosce a un dipendente o a un collaboratore che usa la propria auto per motivi di lavoro, per esempio per raggiungere un cliente o una sede diversa da quella abituale. Serve a coprire i costi che l’uso dell’auto comporta: non solo il carburante, ma anche usura, manutenzione, assicurazione e svalutazione.</p>
  <p>La formula è semplice: <strong>rimborso = km percorsi × costo chilometrico</strong>. I pedaggi autostradali e i parcheggi, se documentati, si rimborsano di solito a parte.</p>

  <h2>Le tabelle ACI</h2>
  <p>Il costo chilometrico di riferimento è quello delle <strong>tabelle ACI</strong>, che l’Automobile Club d’Italia elabora ogni anno per migliaia di modelli di auto e moto e che vengono pubblicate in Gazzetta Ufficiale (quelle valide per il 2026 nella Gazzetta Ufficiale n. 297 del 23 dicembre 2025). Per ogni modello indicano un costo per km diverso a seconda della <strong>percorrenza annua</strong>, perché i costi fissi dell’auto si distribuiscono su più o meno chilometri.</p>
  <p>Per trovare il valore della tua auto usa il servizio <a href="${ACI}" rel="noopener" target="_blank">Costi chilometrici dell’ACI<span class="sr-only"> (sito esterno)</span></a>: scegli categoria, marca, alimentazione e modello e leggi il valore nella colonna della tua percorrenza. Molte aziende applicano invece una tariffa fissa per km stabilita da regolamento interno o contratto: in quel caso inserisci quella.</p>
  ${c.ad('articolo')}
  <h2>Esempio pratico</h2>
  <p>Una trasferta di 60 km con ritorno, ripetuta 8 volte in un mese, con un rimborso di <strong>0,50 €/km</strong> (valore di esempio, non tratto dalle tabelle ACI) e 6 € di parcheggio a trasferta:</p>
  <div class="esempio">
    <ul>
      <li>Km rimborsati: 60 × 2 × 8 = 960 km</li>
      <li>Rimborso chilometrico: 960 × 0,50 = 480 €</li>
      <li>Parcheggi: 6 × 8 = 48 €</li>
      <li><strong>Totale del mese: 528 €</strong></li>
    </ul>
  </div>
  <p>Se il costo reale della tua auto è di 0,45 €/km, quei 960 km ti costano davvero 432 €: il rimborso li copre per il 111%. Con un’auto più costosa da mantenere, per esempio 0,60 €/km, la stessa trasferta ti costerebbe 576 € e il rimborso non basterebbe. Per questo conviene conoscere il proprio <a href="/">costo reale al km</a>.</p>

  <h2>Rimborso chilometrico e tasse</h2>
  <p>Per i lavoratori dipendenti in trasferta <strong>fuori dal comune</strong> della sede di lavoro, il rimborso calcolato sulla base delle tabelle ACI in genere non costituisce reddito. Per le trasferte <strong>all’interno del comune</strong> e per i rimborsi superiori ai valori ACI le regole sono diverse e sono state modificate dalle ultime leggi di bilancio. Lavoratori autonomi e professionisti seguono regole proprie sulla deducibilità. Il calcolatore non stabilisce il trattamento fiscale: per il tuo caso rivolgiti all’ufficio del personale o a un consulente.</p>

  <h2>Errori comuni</h2>
  <ol>
    <li><strong>Scegliere la colonna sbagliata</strong> delle tabelle ACI: il costo dipende dalla percorrenza annua dell’auto.</li>
    <li><strong>Dimenticare il ritorno</strong>: la distanza va contata per l’intero percorso effettuato per lavoro.</li>
    <li><strong>Confondere rimborso e costo del carburante</strong>: il rimborso copre tutti i costi dell’auto, non solo il pieno. Per il solo carburante usa il calcolatore del <a href="/costo-carburante-viaggio/">costo di un viaggio</a>.</li>
    <li><strong>Non conservare la documentazione</strong>: date, percorsi, km e motivo della trasferta servono a giustificare il rimborso.</li>
  </ol>
</article>
${c.faq(faq)}
${correlati('/rimborso-chilometrico/')}
</div>
<aside aria-label="Pubblicità">${c.ad('laterale', 'side')}</aside>
</div>
</div>`;
  },
};
