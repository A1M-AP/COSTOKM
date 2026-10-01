import { legal, titolare, hosting, ext } from '../legal.mjs';
import { esc } from '../util.mjs';

export default {
  path: '/cookie-policy/',
  priority: 0.2,
  title: 'Cookie policy | costokm.it',
  description: 'Quali cookie e tecnologie simili usa costokm.it, per quali finalità, per quanto tempo e come gestire o revocare il consenso.',
  h1: 'Cookie policy',
  body: (c, cfg) => {
    const h = hosting(cfg);
    const sv = cfg._servizi || {};
    const nome = esc(cfg.sito.nome);
    const consenso = sv.statistiche || sv.pubblicita;
    const righe = [];
    if (consenso) righe.push(['costokm_consenso', 'Archivio locale del browser', 'Tecnico', nome, 'Memorizza le tue scelte sui cookie', `${cfg.consensoCookie.durataMesi} mesi`]);
    if (h.cookie) righe.push([h.cookie.nome, 'Cookie', 'Tecnico', esc(h.nome), h.cookie.finalita, h.cookie.durata]);
    if (sv.statistiche) {
      righe.push(['_ga', 'Cookie', 'Statistiche (con consenso)', 'Google – Analytics 4', 'Distingue i visitatori in forma pseudonima per statistiche aggregate', '2 anni']);
      righe.push(['_ga_&lt;ID&gt;', 'Cookie', 'Statistiche (con consenso)', 'Google – Analytics 4', 'Mantiene lo stato della sessione di navigazione', '2 anni']);
    }
    if (sv.pubblicita) {
      righe.push(['__gads, __gpi', 'Cookie', 'Pubblicità (con consenso)', 'Google – AdSense', 'Erogazione degli annunci, limite di frequenza e misurazione', '13 mesi']);
      righe.push(['__eoi', 'Cookie', 'Pubblicità (con consenso)', 'Google – AdSense', 'Sicurezza e prevenzione delle frodi pubblicitarie', '6 mesi']);
      righe.push(['IDE, DSID, NID e altri sui domini di Google', 'Cookie di terza parte', 'Pubblicità (con consenso)', 'Google', 'Pubblicità personalizzata e misurazione delle conversioni', 'fino a 13 mesi']);
    }
    const tabella = righe.length
      ? `<div class="table-scroll" tabindex="0" role="region" aria-label="Elenco dei cookie e degli strumenti utilizzati">
  <table>
    <thead><tr><th scope="col">Nome</th><th scope="col">Tipo</th><th scope="col">Categoria</th><th scope="col">Fornitore</th><th scope="col">Finalità</th><th scope="col">Durata</th></tr></thead>
    <tbody>${righe.map((r) => `<tr>${r.map((x) => `<td>${x}</td>`).join('')}</tr>`).join('')}</tbody>
  </table>
  </div>`
      : '<p><strong>Attualmente il Sito non installa alcun cookie</strong> e non usa l’archivio locale del browser per finalità diverse dal funzionamento delle pagine.</p>';

    return legal('Cookie policy', `
  <p>Questa pagina spiega quali cookie e tecnologie simili (come l’archivio locale del browser) utilizza ${nome} (il “Sito”), in conformità all’art. 122 del Codice privacy e alle Linee guida del Garante per la protezione dei dati personali sui cookie e altri strumenti di tracciamento del 10 giugno 2021.</p>

  <h2>Cosa sono i cookie</h2>
  <p>I cookie sono piccoli file di testo che i siti salvano sul dispositivo dell’utente per poi rileggerli alle visite successive. Tecnologie simili, come l’archivio locale (<em>localStorage</em>), funzionano in modo analogo. I <strong>cookie tecnici</strong> servono al funzionamento del sito e non richiedono consenso; i cookie <strong>analitici di terze parti</strong> e <strong>di profilazione/pubblicità</strong> possono essere usati solo con il consenso preventivo dell’utente.</p>

  <h2>Cookie e strumenti utilizzati dal Sito</h2>
  ${tabella}
  ${cfg._cfAnalytics ? '<p>Le statistiche di visita sono raccolte con <strong>Cloudflare Web Analytics</strong>, che non installa cookie né usa l’archivio locale del browser e non richiede quindi il consenso. Maggiori dettagli nella <a href="/privacy-policy/">privacy policy</a>.</p>' : ''}
  <p>I calcolatori non usano cookie: i dati che inserisci restano nella pagina e vengono persi alla chiusura, salvo che tu li includa in un link con la funzione “Condividi”.</p>

  ${consenso ? `<h2>Come raccogliamo il consenso</h2>
  <p>Alla prima visita compare un banner con i pulsanti <strong>Accetta</strong> e <strong>Rifiuta</strong>, di pari evidenza, e il pulsante <strong>Personalizza</strong> per scegliere categoria per categoria. Chiudere il banner con la <strong>X</strong> equivale a rifiutare: restano attivi solo gli strumenti tecnici. <strong>Prima della tua scelta non viene caricato alcuno script né installato alcun cookie di terze parti.</strong></p>
  <p>La scelta viene ricordata per ${cfg.consensoCookie.durataMesi} mesi; il banner viene riproposto alla scadenza o se cambiano i servizi utilizzati. Puoi modificare o revocare il consenso in qualsiasi momento:</p>
  <p><button type="button" class="btn btn-secondary" data-cookie-settings>Modifica le preferenze sui cookie</button></p>
  <p>Dopo la revoca la pagina viene ricaricata e gli script di terze parti non vengono più caricati; per eliminare anche i cookie già installati puoi cancellarli dalle impostazioni del browser.</p>
  <h2>Terze parti</h2>
  <ul>
    ${sv.statistiche ? `<li>Google Analytics – ${ext('https://policies.google.com/privacy?hl=it', 'informativa privacy di Google')}; puoi anche installare il ${ext('https://tools.google.com/dlpage/gaoptout?hl=it', 'componente di disattivazione di Google Analytics')}.</li>` : ''}
    ${sv.pubblicita ? `<li>Google AdSense – ${ext('https://policies.google.com/technologies/ads?hl=it', 'come Google usa i cookie pubblicitari')}; puoi gestire la personalizzazione degli annunci da ${ext('https://adssettings.google.com', 'Impostazioni annunci di Google')}.</li>` : ''}
  </ul>` : `<h2>Banner dei cookie</h2>
  <p>Poiché il Sito non utilizza cookie analitici di terze parti né cookie di profilazione, non è necessario chiederti il consenso e non viene mostrato alcun banner. Se in futuro attiveremo servizi di statistica o pubblicità, questa pagina sarà aggiornata e ti verrà chiesto il consenso prima di qualsiasi installazione.</p>`}

  <h2>Link di affiliazione</h2>
  <p>I link di affiliazione presenti nelle pagine sono semplici collegamenti a siti esterni: il nostro Sito non installa cookie per tracciarli. I siti di destinazione possono usare propri cookie, secondo le rispettive informative.</p>

  <h2>Gestire i cookie dal browser</h2>
  <p>Puoi bloccare o cancellare i cookie dalle impostazioni del browser: ${ext('https://support.google.com/chrome/answer/95647?hl=it', 'Chrome')}, ${ext('https://support.mozilla.org/it/kb/protezione-antitracciamento-avanzata-firefox-desktop', 'Firefox')}, ${ext('https://support.apple.com/it-it/guide/safari/sfri11471/mac', 'Safari')}, ${ext('https://support.microsoft.com/it-it/microsoft-edge/eliminare-i-cookie-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09', 'Edge')}. Bloccare i cookie tecnici potrebbe impedire di ricordare le tue preferenze.</p>

  <h2>Titolare</h2>
  <p>${titolare(cfg)}. Per maggiori informazioni sul trattamento dei dati consulta la <a href="/privacy-policy/">privacy policy</a>.</p>`, cfg);
  },
};
