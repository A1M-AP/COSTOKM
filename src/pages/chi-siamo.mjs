import { legal } from '../legal.mjs';
import { correlati } from '../correlati.mjs';

export default {
  path: '/chi-siamo/',
  priority: 0.3,
  title: 'Chi siamo | costokm.it',
  description: 'costokm.it è un progetto indipendente che aiuta a calcolare il costo reale di un’auto al km con strumenti gratuiti, trasparenti e senza registrazione.',
  h1: 'Chi siamo',
  body: (c, cfg) => legal('Chi siamo', `
  <p><strong>${cfg.sito.nome}</strong> nasce da un’idea semplice: quasi nessuno sa quanto gli costa davvero la propria auto. Si guarda il prezzo del pieno o la rata, ma si dimenticano la svalutazione, le gomme, gli imprevisti e tutte le spese che arrivano una volta l’anno. Il risultato è che il costo reale viene spesso sottostimato.</p>
  <h2>Cosa facciamo</h2>
  <p>Offriamo calcolatori gratuiti, senza registrazione, che stimano il costo di possesso di un’auto al chilometro, al mese e all’anno, confrontano più veicoli e alimentazioni diverse e calcolano il costo di un singolo viaggio.</p>
  <h2>Come lavoriamo</h2>
  <ul>
    <li><strong>Trasparenza</strong>: le formule usate sono spiegate in ogni pagina, così puoi verificare ogni risultato.</li>
    <li><strong>Privacy</strong>: i calcoli avvengono nel tuo browser. I dati che inserisci non vengono inviati ai nostri server.</li>
    <li><strong>Dati verificabili</strong>: i prezzi medi di carburanti ed energia sono aggiornati manualmente a partire dalle rilevazioni ufficiali, con la data di aggiornamento sempre indicata. Puoi comunque inserire i tuoi prezzi.</li>
    <li><strong>Indipendenza</strong>: il sito si sostiene con pubblicità e link di affiliazione, sempre segnalati come tali. Le eventuali commissioni non influenzano i calcoli.</li>
  </ul>
  <h2>Cosa non facciamo</h2>
  <p>${cfg.sito.nome} non fornisce consulenza finanziaria, assicurativa o fiscale e non svolge attività di intermediazione assicurativa o creditizia. I risultati sono stime indicative basate sui dati inseriti dall’utente.</p>
  <p>Hai un suggerimento o hai trovato un errore? <a href="/contatti/">Scrivici</a>.</p>
  ${correlati('')}`),
};
