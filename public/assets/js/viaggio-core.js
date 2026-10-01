/** Testi del calcolo costo viaggio (condivisi tra browser e build). */
import { costoViaggio, ALIMENTAZIONI } from './calc.js';
import { euro, num } from './ui.js';

export const CAMPI_VIAGGIO = ['distanza', 'andataRitorno', 'alimentazione', 'consumo', 'prezzo', 'pedaggi', 'parcheggio', 'persone'];

/** Chiave di prezzi.json per il viaggio (per l'elettrica si usa la ricarica alle colonnine). */
export const chiavePrezzoViaggio = (a) => (a === 'elettrica' ? 'elettricita_colonnina' : a === 'ibrida' ? 'benzina' : a);

export function uscitaViaggio(t) {
  const r = costoViaggio(t);
  const a = ALIMENTAZIONI[t.alimentazione] || ALIMENTAZIONI.benzina;
  const avvisi = !(Number(t.prezzo) > 0) ? ['Inserisci il prezzo del carburante o dell’energia per calcolare il costo.'] : [];
  return {
    r,
    avvisi,
    valori: {
      carburante: euro(r.carburante, 2),
      totale: euro(r.totale, 2),
      perPersona: euro(r.perPersona, 2),
      consumoTot: `${num(r.consumoTot, 1)} ${a.unita}`,
      dettaglio: `${num(r.distanza)} km${t.andataRitorno ? ' (andata e ritorno)' : ''} · ${euro(r.perKm, 3)}/km di ${t.alimentazione === 'elettrica' ? 'energia' : 'carburante'}${r.persone > 1 ? ` · diviso tra ${r.persone} persone` : ''}`,
    },
  };
}
