/** Pagina /prezzo-benzina-oggi/: grafico dell'andamento delle medie nazionali. */
import { serieTemporale, onResize } from './charts.js';

const box = document.querySelector('[data-chart="storico"]');
let punti = [];

function disegna() {
  if (!box || punti.length < 2) return;
  const giorni = Number(document.querySelector('[data-periodo][aria-pressed="true"]')?.dataset.periodo || 90);
  const sel = punti.slice(-giorni);
  serieTemporale(box, sel, [
    { chiave: 'benzina', nome: 'Benzina self', slot: 1 },
    { chiave: 'diesel', nome: 'Gasolio self', slot: 2 },
  ], { decimali: 3, unita: '€/l' });
}

if (box) {
  fetch('/data/storico-prezzi.json', { cache: 'no-cache' })
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => { punti = d?.serie || []; disegna(); })
    .catch(() => {});
  document.querySelectorAll('[data-periodo]').forEach((b) => b.addEventListener('click', () => {
    document.querySelectorAll('[data-periodo]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    disegna();
  }));
  onResize(disegna);
}
