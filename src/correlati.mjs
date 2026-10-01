/** Tutti gli strumenti del sito: usati per i link interni (pagine correlate, footer). */
export const STRUMENTI = [
  { href: '/', titolo: 'Calcolatore del costo auto', testo: 'Costo al km, al mese e all’anno, fino a 3 auto a confronto.' },
  { href: '/prezzo-benzina-oggi/', titolo: 'Prezzo benzina e gasolio oggi', testo: 'Medie nazionali e regionali aggiornate ogni giorno.' },
  { href: '/quanto-costa-un-auto-al-mese/', titolo: 'Quanto costa un’auto al mese', testo: 'La spesa mensile reale, voce per voce.' },
  { href: '/confronto-elettrica-benzina/', titolo: 'Elettrica o benzina?', testo: 'Trova i km annui oltre i quali l’elettrica conviene.' },
  { href: '/diesel-o-benzina/', titolo: 'Diesel o benzina?', testo: 'Dopo quanti km conviene il diesel.' },
  { href: '/costo-auto-ibrida/', titolo: 'Auto ibrida: conviene?', testo: 'Ibrida contro benzina: costo reale e pareggio.' },
  { href: '/gpl-o-metano/', titolo: 'GPL o metano?', testo: 'Quale alimentazione a gas costa meno.' },
  { href: '/rimborso-chilometrico/', titolo: 'Rimborso chilometrico', testo: 'Calcola il rimborso per l’uso dell’auto propria.' },
  { href: '/costo-carburante-viaggio/', titolo: 'Costo carburante di un viaggio', testo: 'Quanto spendi per un tragitto, anche diviso tra passeggeri.' },
  { href: '/costo-auto-neopatentati/', titolo: 'Costo auto per neopatentati', testo: 'Il calcolatore con i valori tipici della prima auto.' },
];

/** Link interni agli altri strumenti (esclusa la pagina corrente). */
export const correlati = (path) => `<nav class="correlati" aria-label="Altri strumenti">
${STRUMENTI.filter((l) => l.href !== path).map((l) => `<a href="${l.href}">${l.titolo}<span>${l.testo}</span></a>`).join('\n')}
</nav>`;
