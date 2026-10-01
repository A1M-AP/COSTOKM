import { legal, titolare } from '../legal.mjs';

export default {
  path: '/cookie-policy/',
  priority: 0.2,
  title: 'Cookie policy | costokm.it',
  description: 'Informazioni sui cookie e sulle tecnologie simili usate da costokm.it e su come gestire o revocare il consenso.',
  h1: 'Cookie policy',
  body: (c, cfg) => legal('Cookie policy', `
  <p>Questa pagina descrive i cookie e le tecnologie simili (come l’archivio locale del browser) usati da ${cfg.sito.nome}, in conformità alle Linee guida del Garante per la protezione dei dati personali del 10 giugno 2021.</p>
  <p class="avviso">[DA COMPLETARE: mantieni nella tabella solo i servizi effettivamente attivati in config/site.config.json.]</p>
  <p><button type="button" class="btn btn-secondary" data-cookie-settings>Modifica le preferenze sui cookie</button></p>

  <h2>Cosa succede quando arrivi sul Sito</h2>
  <p>Al primo accesso compare un banner con i pulsanti <strong>Accetta</strong> e <strong>Rifiuta</strong>, di pari evidenza, e un pulsante <strong>Personalizza</strong> per scegliere per categoria. Chiudere il banner con la X equivale a rifiutare. <strong>Prima della tua scelta non viene caricato alcuno script né cookie diverso da quelli tecnici.</strong> La scelta viene ricordata per ${cfg.consensoCookie.durataMesi} mesi; il banner viene riproposto alla scadenza o se cambiano i servizi utilizzati.</p>

  <h2>Cookie e strumenti utilizzati</h2>
  <div class="table-scroll" tabindex="0" role="region" aria-label="Elenco dei cookie">
  <table>
    <thead><tr><th scope="col">Nome</th><th scope="col">Categoria</th><th scope="col">Fornitore</th><th scope="col">Finalità</th><th scope="col">Durata</th></tr></thead>
    <tbody>
      <tr><td>costokm_consenso (archivio locale)</td><td>Tecnico</td><td>${cfg.sito.nome}</td><td>Memorizza le tue scelte sui cookie</td><td>${cfg.consensoCookie.durataMesi} mesi</td></tr>
      <tr><td>_ga, _ga_*</td><td>Statistiche (con consenso)</td><td>Google Ireland Ltd. – Google Analytics 4</td><td>Statistiche aggregate di utilizzo</td><td>fino a 2 anni</td></tr>
      <tr><td>__gads, __gpi, IDE e altri</td><td>Pubblicità (con consenso)</td><td>Google Ireland Ltd. – Google AdSense</td><td>Erogazione e misurazione degli annunci, anche personalizzati</td><td>fino a 13 mesi</td></tr>
    </tbody>
  </table>
  </div>
  <p>Informative dei terzi: <a href="https://policies.google.com/privacy?hl=it" rel="noopener">Google Privacy</a>, <a href="https://policies.google.com/technologies/ads?hl=it" rel="noopener">come Google usa i cookie pubblicitari</a>.</p>

  <h2>Link di affiliazione</h2>
  <p>I link di affiliazione sono semplici collegamenti a siti esterni: il nostro Sito non installa cookie per tracciarli. I siti di destinazione possono usare propri cookie, secondo le loro informative.</p>

  <h2>Come revocare o modificare il consenso</h2>
  <p>Puoi cambiare le tue scelte in qualsiasi momento con il pulsante qui sopra o con il link “Preferenze cookie” presente in fondo a ogni pagina. Puoi inoltre cancellare i cookie e i dati dei siti dalle impostazioni del browser.</p>

  <h2>Titolare</h2>
  <p>${titolare(cfg)}. Per maggiori informazioni consulta la <a href="/privacy-policy/">privacy policy</a>.</p>`, cfg),
};
