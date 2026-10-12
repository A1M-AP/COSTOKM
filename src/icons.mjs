/**
 * Icone minimal a tratto (24×24, stroke 1.8, colore del testo).
 * Decorative: sempre aria-hidden, il significato è nel testo accanto.
 */
const P = {
  calcolatore: '<path d="M4.5 15.5a7.5 7.5 0 1 1 15 0"/><path d="m12 15.5 3.6-3.6"/><circle cx="12" cy="15.5" r="1.3"/><path d="M7 19.5h10"/>',
  prezzi: '<path d="M5 20V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v14"/><path d="M3.5 20h13"/><path d="M8 8.5h4"/><path d="M15 10h1.5a1.5 1.5 0 0 1 1.5 1.5V16a1.5 1.5 0 0 0 3 0V9l-3-3"/>',
  mese: '<rect x="4" y="5" width="16" height="15" rx="3"/><path d="M4 10h16M9 3v4M15 3v4"/><path d="M8.5 14h2M13.5 14h2M8.5 17h2"/>',
  elettrica: '<path d="M13 3 5.5 13H11l-1 8 7.5-10H12z"/>',
  diesel: '<path d="M12 3.5s-6 6.6-6 10.5a6 6 0 0 0 12 0c0-3.9-6-10.5-6-10.5z"/><path d="M9.3 14.3a2.7 2.7 0 0 0 2.7 2.7"/>',
  ibrida: '<path d="M5 19c0-8 5-13 14-14 0 9-5 14-12 14H5z"/><path d="m5 19 8-8"/>',
  gpl: '<path d="M12 3c1 3 5 5.5 5 10a5 5 0 0 1-10 0c0-2.5 1.5-4 2.5-5 .3 2 1.3 3 2.5 3 0-3-1-5.5 0-8z"/>',
  metano: '<circle cx="7" cy="8" r="2.5"/><circle cx="17" cy="9" r="2.5"/><circle cx="11.5" cy="17.5" r="2.5"/><path d="m8.2 10.3 2.3 4.9M15.7 11.2l-3 4.2M9.5 8.3l5 .5"/>',
  rimborso: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
  viaggio: '<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h6.5a3.5 3.5 0 0 0 0-7h-5a3.5 3.5 0 0 1 0-7H16"/>',
  neopatentati: '<circle cx="8" cy="15" r="4"/><path d="m11 12 8-8M16 7l2 2M14 9l2 2"/>',
  acquisto: '<path d="M3.5 12V4.5a1 1 0 0 1 1-1H12l9 9-8.5 8.5z"/><circle cx="8" cy="8" r="1.5"/>',
  scudo: '<path d="M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6z"/><path d="m9 12 2 2 4-4"/>',
  chiave: '<path d="M14.5 6.5a4 4 0 0 0-5.3 5.3L4 17l3 3 5.2-5.2a4 4 0 0 0 5.3-5.3l-2.4 2.4-2.6-.6-.6-2.6z"/>',
  altro: '<circle cx="6" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="18" cy="12" r="1.6"/>',
  auto: '<path d="M5 16V12l1.8-4.6A2 2 0 0 1 8.7 6h6.6a2 2 0 0 1 1.9 1.4L19 12v4"/><path d="M3.5 16h17v2.5a1 1 0 0 1-1 1H18a1 1 0 0 1-1-1V18H7v.5a1 1 0 0 1-1 1H4.5a1 1 0 0 1-1-1z"/><path d="M5 12h14"/><circle cx="7.5" cy="14.2" r=".6"/><circle cx="16.5" cy="14.2" r=".6"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  aggiorna: '<path d="M20 11a8 8 0 0 0-14.3-4.9L4 8"/><path d="M4 4v4h4"/><path d="M4 13a8 8 0 0 0 14.3 4.9L20 16"/><path d="M20 20v-4h-4"/>',
  lucchetto: '<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
  freccia: '<path d="M5 12h14M13 6l6 6-6 6"/>',
};

export const icon = (nome, cls = '') =>
  `<svg class="ico${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${P[nome] || P.auto}</svg>`;
