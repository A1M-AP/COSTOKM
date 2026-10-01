const LINK = [
  { href: '/', titolo: 'Calcolatore del costo auto', testo: 'Costo al km, al mese e all’anno, fino a 3 auto a confronto.' },
  { href: '/confronto-elettrica-benzina/', titolo: 'Elettrica o benzina?', testo: 'Trova i km annui oltre i quali l’elettrica conviene.' },
  { href: '/costo-carburante-viaggio/', titolo: 'Costo carburante di un viaggio', testo: 'Quanto spendi per un singolo tragitto, anche diviso tra passeggeri.' },
  { href: '/costo-auto-neopatentati/', titolo: 'Costo auto per neopatentati', testo: 'Il calcolatore con i valori tipici della prima auto.' },
];

/** Link interni agli altri strumenti (esclusa la pagina corrente). */
export const correlati = (path) => `<nav class="correlati" aria-label="Altri strumenti">
${LINK.filter((l) => l.href !== path).map((l) => `<a href="${l.href}">${l.titolo}<span>${l.testo}</span></a>`).join('\n')}
</nav>`;
