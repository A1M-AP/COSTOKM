import { legal } from '../legal.mjs';
import { esc } from '../util.mjs';

export default {
  path: '/contatti/',
  priority: 0.3,
  title: 'Contatti | costokm.it',
  description: 'Contatta costokm.it per segnalazioni, suggerimenti sui calcolatori, correzioni dei dati o proposte di collaborazione.',
  h1: 'Contatti',
  body: (c, cfg) => legal('Contatti', `
  <p>Per segnalazioni, suggerimenti, correzioni dei dati o proposte di collaborazione scrivi a:</p>
  <p><a class="btn btn-primary" href="mailto:${esc(cfg.sito.emailContatto)}">${esc(cfg.sito.emailContatto)}</a></p>
  <p>Rispondiamo di norma entro qualche giorno lavorativo. Per favore <strong>non inviare dati personali non necessari</strong> né documenti come polizze o contratti: non possiamo fornire consulenza su casi individuali.</p>
  <h2>Segnalare un errore nei calcoli</h2>
  <p>Se un risultato ti sembra sbagliato, usa il pulsante <em>Condividi</em> del calcolatore e incolla il link nella tua e-mail: contiene i dati inseriti e ci permette di riprodurre esattamente il calcolo.</p>
  <h2>Pubblicità e partnership</h2>
  <p>Per proposte commerciali indica nell’oggetto “Partnership”. I contenuti sponsorizzati e i link di affiliazione sono sempre segnalati in modo chiaro.</p>
  <p class="small">Il trattamento dei dati che ci invii via e-mail è descritto nella <a href="/privacy-policy/">privacy policy</a>.</p>`),
};
