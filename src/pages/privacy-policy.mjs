import { legal, titolare, hosting, ext } from '../legal.mjs';
import { esc } from '../util.mjs';

export default {
  path: '/privacy-policy/',
  priority: 0.2,
  title: 'Privacy policy | costokm.it',
  description: 'Informativa sul trattamento dei dati personali degli utenti di costokm.it ai sensi degli articoli 13 e 14 del Regolamento (UE) 2016/679 (GDPR).',
  h1: 'Privacy policy',
  body: (c, cfg) => {
    const h = hosting(cfg);
    const sv = cfg._servizi || {};
    const nome = esc(cfg.sito.nome);
    const consenso = sv.statistiche || sv.pubblicita;
    let n = 0;
    const sez = (titolo) => `<h2>${++n}. ${titolo}</h2>`;

    return legal('Informativa sulla privacy', `
  <p>La presente informativa descrive come vengono trattati i dati personali di chi visita ${nome} (il “Sito”), ai sensi degli articoli 13 e 14 del Regolamento (UE) 2016/679 (“GDPR”) e del D.Lgs. 196/2003 (“Codice privacy”), come modificato dal D.Lgs. 101/2018. Il Sito è progettato per raccogliere il minor numero possibile di dati: <strong>i calcolatori funzionano interamente nel tuo browser</strong> e non richiedono registrazione.</p>

  ${sez('Titolare del trattamento')}
  <p>${titolare(cfg)}</p>

  ${sez('Quali dati trattiamo')}
  <h3>a) Dati inseriti nei calcolatori</h3>
  <p>I valori che inserisci (chilometri, prezzi, costi, nome del veicolo) sono elaborati <strong>esclusivamente sul tuo dispositivo</strong> e non vengono inviati né conservati dal Titolare. Se usi la funzione “Condividi”, i valori vengono inseriti nell’indirizzo (URL) della pagina: chiunque riceva il link potrà vederli e, aprendolo, l’indirizzo viene trasmesso al server come qualsiasi altra pagina. Ti consigliamo di non inserire informazioni personali nel campo “Nome del veicolo”.</p>
  <h3>b) Dati di navigazione</h3>
  <p>I sistemi del fornitore di hosting acquisiscono, nel normale funzionamento, alcuni dati la cui trasmissione è implicita nell’uso dei protocolli di Internet: indirizzo IP, data e ora della richiesta, pagina richiesta, codice di risposta, tipo di browser e sistema operativo, sito di provenienza. Questi dati non sono usati per identificarti e servono solo a garantire il funzionamento e la sicurezza del Sito.</p>
  <h3>c) Dati che ci invii volontariamente</h3>
  <p>Se ci scrivi via e-mail trattiamo il tuo indirizzo e il contenuto del messaggio per risponderti.</p>
  ${consenso ? `<h3>d) Cookie e strumenti di terze parti, solo con il tuo consenso</h3>
  <p>Solo se presti il consenso tramite il banner, il Sito utilizza:</p>
  <ul>
    ${sv.statistiche ? '<li><strong>Google Analytics 4</strong> (Google Ireland Ltd.) per statistiche aggregate sull’uso del Sito: pagine visitate, durata, dispositivo, area geografica approssimativa. Non usiamo funzioni di profilazione pubblicitaria di Analytics.</li>' : ''}
    ${sv.pubblicita ? '<li><strong>Google AdSense</strong> (Google Ireland Ltd.) per mostrare annunci pubblicitari, anche personalizzati in base ai tuoi interessi, e misurarne l’efficacia.</li>' : ''}
  </ul>
  <p>La tua scelta sul consenso viene memorizzata nel tuo browser. Dettagli nella <a href="/cookie-policy/">cookie policy</a>.</p>` : `<h3>d) Cookie</h3>
  <p>Il Sito non utilizza cookie di profilazione né strumenti di statistica o pubblicità di terze parti. Dettagli nella <a href="/cookie-policy/">cookie policy</a>.</p>`}

  ${sez('Finalità e basi giuridiche')}
  <ul>
    <li><strong>Erogazione e sicurezza del Sito</strong> (dati di navigazione): legittimo interesse del Titolare a fornire un servizio funzionante e sicuro (art. 6.1.f GDPR).</li>
    <li><strong>Risposta alle richieste di contatto</strong>: esecuzione di misure richieste dall’interessato (art. 6.1.b GDPR) e legittimo interesse a gestire la corrispondenza (art. 6.1.f GDPR).</li>
    ${sv.statistiche ? '<li><strong>Statistiche di utilizzo</strong>: consenso (art. 6.1.a GDPR e art. 122 Codice privacy).</li>' : ''}
    ${sv.pubblicita ? '<li><strong>Pubblicità, anche personalizzata</strong>: consenso (art. 6.1.a GDPR e art. 122 Codice privacy).</li>' : ''}
    <li><strong>Adempimenti di legge e tutela dei diritti</strong> del Titolare in sede giudiziaria, quando necessario (art. 6.1.c e 6.1.f GDPR).</li>
  </ul>

  ${sez('Destinatari dei dati')}
  <p>I dati possono essere trattati, per conto del Titolare e nei limiti delle finalità indicate, da:</p>
  <ul>
    <li><strong>${esc(h.nome)}</strong>, fornitore di hosting del Sito, che agisce come responsabile del trattamento (art. 28 GDPR) – ${ext(h.privacy, 'informativa')};</li>
    <li>${/@(gmail|googlemail)\.com$/i.test(cfg.sito.emailContatto) ? `<strong>Google Ireland Ltd.</strong> (servizio Gmail), fornitore della posta elettronica del Titolare, per le e-mail ricevute – ${ext('https://policies.google.com/privacy?hl=it', 'informativa')}` : 'il fornitore del servizio di posta elettronica del Titolare, per le e-mail ricevute'};</li>
    ${sv.statistiche ? `<li><strong>Google Ireland Ltd.</strong> per Google Analytics, come responsabile del trattamento – ${ext('https://policies.google.com/privacy?hl=it', 'informativa')};</li>` : ''}
    ${sv.pubblicita ? `<li><strong>Google Ireland Ltd.</strong> per Google AdSense, che tratta i dati come autonomo titolare per l’erogazione e la personalizzazione degli annunci – ${ext('https://policies.google.com/technologies/partner-sites?hl=it', 'come Google usa i dati dei siti partner')};</li>` : ''}
  </ul>
  <p>I dati non sono diffusi né venduti. Possono essere comunicati alle autorità competenti solo su loro legittima richiesta.</p>

  ${sez('Trasferimenti fuori dall’Unione europea')}
  <p>${esc(h.nome)}${consenso || /@(gmail|googlemail)\.com$/i.test(cfg.sito.emailContatto) ? ' e Google' : ''} possono trattare dati anche negli ${esc(h.sede)}. Il trasferimento avviene sulla base della decisione di adeguatezza della Commissione europea relativa al <em>EU-U.S. Data Privacy Framework</em>, per i fornitori certificati, oppure delle clausole contrattuali standard approvate dalla Commissione (art. 46 GDPR).</p>

  ${sez('Per quanto tempo conserviamo i dati')}
  <ul>
    <li>Dati di navigazione: per il tempo previsto dai sistemi del fornitore di hosting per finalità di sicurezza, di norma non oltre 30 giorni, salvo necessità di accertare reati.</li>
    <li>E-mail: per il tempo necessario a gestire la richiesta e comunque non oltre 24 mesi dall’ultimo contatto.</li>
    ${consenso ? `<li>Scelta sul consenso: ${cfg.consensoCookie.durataMesi} mesi, nel tuo browser.</li>` : ''}
    ${sv.statistiche ? '<li>Dati di Google Analytics: 14 mesi.</li>' : ''}
    ${sv.pubblicita ? '<li>Cookie pubblicitari: secondo le durate indicate nella cookie policy.</li>' : ''}
  </ul>

  ${sez('Obbligatorietà del conferimento')}
  <p>Il conferimento dei dati di navigazione è necessario per accedere al Sito. L’invio di e-mail è facoltativo. ${consenso ? 'Il consenso a statistiche e pubblicità è facoltativo: rifiutarlo non limita in alcun modo l’uso dei calcolatori.' : ''}</p>

  ${sez('I tuoi diritti')}
  <p>In qualsiasi momento puoi chiedere al Titolare l’accesso ai tuoi dati, la rettifica, la cancellazione, la limitazione del trattamento, la portabilità e opporti ai trattamenti basati sul legittimo interesse (artt. 15-22 GDPR), scrivendo all’indirizzo indicato al punto 1. ${consenso ? 'Puoi revocare il consenso in qualsiasi momento da “Preferenze cookie” in fondo a ogni pagina, senza pregiudicare la liceità del trattamento svolto prima della revoca.' : ''}</p>
  <p>Se ritieni che il trattamento violi il GDPR puoi proporre reclamo al Garante per la protezione dei dati personali (${ext('https://www.garanteprivacy.it', 'www.garanteprivacy.it')}).</p>

  ${sez('Link a siti di terzi e affiliazioni')}
  <p>Il Sito contiene link a siti esterni, compresi link di affiliazione verso partner commerciali. Cliccando lasci il Sito: il Titolare non riceve i dati che inserisci sui siti dei partner, il cui trattamento è regolato dalle rispettive informative.</p>

  ${sez('Minori')}
  <p>Il Sito non è rivolto a minori di 14 anni e non raccoglie consapevolmente i loro dati.</p>

  ${sez('Processi decisionali automatizzati')}
  <p>Non viene effettuato alcun processo decisionale automatizzato, compresa la profilazione, che produca effetti giuridici nei tuoi confronti. I risultati dei calcolatori sono stime elaborate sul tuo dispositivo e non vengono registrati.</p>

  ${sez('Modifiche a questa informativa')}
  <p>L’informativa può essere aggiornata, ad esempio se vengono attivati nuovi servizi. La data dell’ultimo aggiornamento è indicata in alto; in caso di nuovi servizi che richiedono il consenso, il banner ti verrà riproposto.</p>`, cfg);
  },
};
