import { icon } from './icons.mjs';

/** Tutti gli strumenti del sito: link interni (pagine correlate, footer, griglia in home) e icona/etichetta della pagina. */
export const STRUMENTI = [
  { href: '/', icona: 'calcolatore', eyebrow: 'Calcolatore', titolo: 'Calcolatore del costo auto', testo: 'Costo al km, al mese e all’anno, fino a 3 auto a confronto.' },
  { href: '/prezzo-benzina-oggi/', icona: 'prezzi', eyebrow: 'Aggiornato ogni giorno', titolo: 'Prezzo benzina e gasolio oggi', testo: 'Medie nazionali e regionali aggiornate ogni giorno.' },
  { href: '/quanto-costa-un-auto-al-mese/', icona: 'mese', eyebrow: 'Costo mensile', titolo: 'Quanto costa un’auto al mese', testo: 'La spesa mensile reale, voce per voce.' },
  { href: '/confronto-elettrica-benzina/', icona: 'elettrica', eyebrow: 'Confronto', titolo: 'Elettrica o benzina?', testo: 'Trova i km annui oltre i quali l’elettrica conviene.' },
  { href: '/diesel-o-benzina/', icona: 'diesel', eyebrow: 'Confronto', titolo: 'Diesel o benzina?', testo: 'Dopo quanti km conviene il diesel.' },
  { href: '/costo-auto-ibrida/', icona: 'ibrida', eyebrow: 'Confronto', titolo: 'Auto ibrida: conviene?', testo: 'Ibrida contro benzina: costo reale e pareggio.' },
  { href: '/gpl-o-metano/', icona: 'gpl', eyebrow: 'Confronto', titolo: 'GPL o metano?', testo: 'Quale alimentazione a gas costa meno.' },
  { href: '/rimborso-chilometrico/', icona: 'rimborso', eyebrow: 'Lavoro', titolo: 'Rimborso chilometrico', testo: 'Calcola il rimborso per l’uso dell’auto propria.' },
  { href: '/costo-carburante-viaggio/', icona: 'viaggio', eyebrow: 'Viaggio', titolo: 'Costo carburante di un viaggio', testo: 'Quanto spendi per un tragitto, anche diviso tra passeggeri.' },
  { href: '/costo-auto-neopatentati/', icona: 'neopatentati', eyebrow: 'Prima auto', titolo: 'Costo auto per neopatentati', testo: 'Il calcolatore con i valori tipici della prima auto.' },
];

export const strumentoDi = (path) => STRUMENTI.find((s) => s.href === path);

const card = (l, i) => `<a href="${l.href}" style="--i:${i}"><span class="tool-ico">${icon(l.icona)}</span><span class="tool-txt"><strong>${l.titolo}</strong><span>${l.testo}</span></span></a>`;

/** Link interni agli altri strumenti (esclusa la pagina corrente). */
export const correlati = (path) => `<nav class="correlati" aria-label="Altri strumenti">
${STRUMENTI.filter((l) => l.href !== path).map(card).join('\n')}
</nav>`;

/** Griglia di tutti gli strumenti (home). */
export const grigliaStrumenti = (path) => `<section class="strumenti" aria-labelledby="strumenti-title">
  <h2 id="strumenti-title">Tutti gli strumenti</h2>
  <nav class="correlati correlati--griglia" aria-label="Tutti gli strumenti">
${STRUMENTI.filter((l) => l.href !== path).map(card).join('\n')}
  </nav>
</section>`;
