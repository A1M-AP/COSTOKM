/** Escape HTML per testo e attributi. */
export const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export const jsonLd = (obj) =>
  `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;

/** Data AAAA-MM-GG → "1 ottobre 2026". */
export function dataIt(iso) {
  if (!iso) return null;
  const d = new Date(iso + 'T12:00:00Z');
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}
