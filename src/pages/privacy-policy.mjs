import { legal, titolare } from '../legal.mjs';

export default {
  path: '/privacy-policy/',
  priority: 0.2,
  title: 'Privacy policy | costokm.it',
  description: 'Informativa sul trattamento dei dati personali degli utenti di costokm.it ai sensi del Regolamento (UE) 2016/679 (GDPR).',
  h1: 'Privacy policy',
  body: (c, cfg) => legal('Informativa sulla privacy', `
  <p>Questa informativa descrive come vengono trattati i dati personali degli utenti che visitano ${cfg.sito.nome} (il “Sito”), ai sensi degli articoli 13 e 14 del Regolamento (UE) 2016/679 (“GDPR”) e del D.Lgs. 196/2003 come modificato dal D.Lgs. 101/2018.</p>
  <p class="avviso">[DA COMPLETARE prima della pubblicazione: dati del titolare, servizi effettivamente attivati e loro fornitori. Si consiglia una verifica da parte di un professionista.]</p>

  <h2>1. Titolare del trattamento</h2>
  <p>${titolare(cfg)}</p>

  <h2>2. Dati inseriti nei calcolatori</h2>
  <p>I valori che inserisci nei calcolatori (km, prezzi, costi, ecc.) sono elaborati <strong>esclusivamente nel tuo browser</strong> e non vengono trasmessi né conservati dal Titolare. Se utilizzi la funzione “Condividi”, i valori vengono inseriti nell’indirizzo (URL) della pagina: chiunque riceva il link potrà vederli. Evita quindi di inserire informazioni personali nel campo “Nome del veicolo”.</p>

  <h2>3. Dati di navigazione</h2>
  <p>I sistemi informatici del fornitore di hosting acquisiscono, nel normale funzionamento, alcuni dati la cui trasmissione è implicita nell’uso dei protocolli di Internet (indirizzo IP, data e ora della richiesta, risorsa richiesta, user agent). Questi dati sono trattati sulla base del legittimo interesse del Titolare (art. 6.1.f GDPR) per garantire la sicurezza e il corretto funzionamento del Sito, e conservati per il tempo stabilito dal fornitore. Fornitore di hosting: <strong>[DA COMPLETARE: es. Netlify Inc. o Cloudflare Inc.]</strong>, che agisce come responsabile del trattamento; i dati possono essere trasferiti negli Stati Uniti sulla base del Data Privacy Framework UE-USA o delle clausole contrattuali standard.</p>

  <h2>4. Preferenze sui cookie</h2>
  <p>La tua scelta sui cookie viene memorizzata nel tuo browser (archivio locale) per ${cfg.consensoCookie.durataMesi} mesi, così da non riproporti il banner a ogni visita. Dettagli nella <a href="/cookie-policy/">cookie policy</a>.</p>

  <h2>5. Statistiche e pubblicità (solo con consenso)</h2>
  <p>Solo se presti il consenso tramite il banner, il Sito può utilizzare:</p>
  <ul>
    <li><strong>Statistiche</strong>: Google Analytics 4 (Google Ireland Ltd.) per misurare in forma aggregata l’uso del Sito. Base giuridica: consenso (art. 6.1.a GDPR).</li>
    <li><strong>Pubblicità</strong>: Google AdSense (Google Ireland Ltd.) per mostrare annunci, anche personalizzati. Base giuridica: consenso (art. 6.1.a GDPR).</li>
  </ul>
  <p>Questi fornitori possono trasferire dati verso paesi extra UE con le garanzie previste dagli artt. 44 e seguenti del GDPR. Puoi revocare il consenso in qualsiasi momento da “Preferenze cookie” in fondo a ogni pagina, senza pregiudicare la liceità del trattamento precedente.</p>

  <h2>6. Link di affiliazione</h2>
  <p>Alcuni link portano a siti di partner (ad esempio comparatori di assicurazioni o servizi di noleggio). Cliccando lasci il Sito: il trattamento dei dati che fornisci a quei servizi è regolato dalle loro informative. Il Titolare non riceve i dati che inserisci sui siti dei partner.</p>

  <h2>7. Contatti via e-mail</h2>
  <p>Se ci scrivi, tratteremo indirizzo e-mail e contenuto del messaggio solo per risponderti (base giuridica: misure su richiesta dell’interessato e legittimo interesse) e li conserveremo per il tempo necessario a gestire la richiesta e comunque non oltre 24 mesi.</p>

  <h2>8. Diritti dell’interessato</h2>
  <p>Puoi esercitare in qualsiasi momento i diritti di accesso, rettifica, cancellazione, limitazione, portabilità e opposizione (artt. 15-22 GDPR) scrivendo all’indirizzo indicato sopra. Hai inoltre il diritto di proporre reclamo al Garante per la protezione dei dati personali (<a href="https://www.garanteprivacy.it" rel="noopener">www.garanteprivacy.it</a>).</p>

  <h2>9. Modifiche</h2>
  <p>Questa informativa può essere aggiornata; la data dell’ultimo aggiornamento è indicata in alto.</p>`, cfg),
};
