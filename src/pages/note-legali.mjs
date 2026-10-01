import { legal, titolare } from '../legal.mjs';

export default {
  path: '/note-legali/',
  priority: 0.2,
  title: 'Note legali | costokm.it',
  description: 'Note legali di costokm.it: natura indicativa dei calcoli, assenza di consulenza e intermediazione, link di affiliazione, fonti dei dati.',
  h1: 'Note legali',
  body: (c, cfg) => legal('Note legali', `
  <h2>Gestore del sito</h2>
  <p>${titolare(cfg)}</p>

  <h2>Natura dei calcoli</h2>
  <p>I calcolatori di ${cfg.sito.nome} forniscono <strong>stime indicative</strong> basate esclusivamente sui dati inseriti dall’utente e su ipotesi semplificate (ad esempio una svalutazione lineare o composta, interessi ripartiti sugli anni del finanziamento, consumi costanti). I valori proposti all’apertura dei calcolatori sono esempi e non rappresentano medie ufficiali. I risultati non costituiscono offerta, raccomandazione o consulenza di natura finanziaria, assicurativa, fiscale o legale.</p>

  <h2>Nessuna intermediazione</h2>
  <p>${cfg.sito.nome} non svolge attività di intermediazione assicurativa o riassicurativa, né di intermediazione del credito, e non è iscritto ai relativi registri (RUI – IVASS, OAM). Gli eventuali box “Confronta i preventivi RC auto” o “Noleggio a lungo termine” sono semplici link a servizi di terzi, che ne sono gli unici responsabili.</p>

  <h2>Link di affiliazione e pubblicità</h2>
  <p>Il sito si finanzia con spazi pubblicitari e link di affiliazione. Se sottoscrivi un servizio tramite un link affiliato potremmo ricevere una commissione, senza costi aggiuntivi per te. I link affiliati sono identificati dall’etichetta “Link affiliato” e dall’attributo <code>rel="sponsored"</code>. Le commissioni non influenzano i risultati dei calcoli.</p>

  <h2>Fonti dei dati</h2>
  <p>I prezzi medi di carburanti ed energia sono aggiornati manualmente a partire dalle rilevazioni ufficiali (per i carburanti, il Ministero delle Imprese e del Made in Italy – MIMIT). La data dell’ultimo aggiornamento è indicata accanto ai calcolatori. Nonostante la cura posta, i dati potrebbero non essere aggiornati: verifica sempre i prezzi che paghi.</p>

  <h2>Limitazione di responsabilità</h2>
  <p>Nei limiti consentiti dalla legge, il gestore non risponde di decisioni prese sulla base dei risultati dei calcolatori, di eventuali errori o omissioni nei contenuti, né dei contenuti e servizi di siti terzi raggiungibili tramite link.</p>

  <h2>Proprietà intellettuale</h2>
  <p>Testi, grafica e codice del sito sono di proprietà del gestore, salvo diversa indicazione. È consentita la citazione con link alla fonte; è vietata la riproduzione integrale senza autorizzazione.</p>`, cfg),
};
