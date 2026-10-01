/**
 * Logica e testi del confronto tra due auto (A = riferimento, B = alternativa),
 * con qualsiasi alimentazione. Condivisi tra browser e build.
 */
import { calcolaVeicolo, puntoPareggio, ALIMENTAZIONI } from './calc.js';
import { euro, num, escHtml } from './ui.js';
import { anniLabel } from './testi.js';

export const CAMPI = ['alimentazione', 'prezzo', 'svalPerc', 'consumo', 'prezzoCarb', 'consumoEl', 'percCasa', 'prezzoCasa', 'prezzoColonnina', 'rc', 'bollo', 'manutenzione', 'gommeCosto', 'gommeKm'];

/** Nome dell'auto e soggetto grammaticale per i titoli ("il diesel conviene…"). */
const NOMI = {
  benzina: { nome: 'Auto a benzina', sogg: 'la benzina' },
  diesel: { nome: 'Auto diesel', sogg: 'il diesel' },
  gpl: { nome: 'Auto a GPL', sogg: 'il GPL' },
  metano: { nome: 'Auto a metano', sogg: 'il metano' },
  ibrida: { nome: 'Auto ibrida', sogg: 'l’ibrida' },
  elettrica: { nome: 'Auto elettrica', sogg: 'l’elettrica' },
};
const maiuscola = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/** Nomi delle due auto; se hanno la stessa alimentazione si distinguono con "prima/seconda". */
export function nomiAuto(s) {
  const na = NOMI[s.a.alimentazione] || NOMI.benzina;
  const nb = NOMI[s.b.alimentazione] || NOMI.benzina;
  if (s.a.alimentazione === s.b.alimentazione) {
    return { nomeA: `Prima auto (${s.a.alimentazione})`, nomeB: `Seconda auto (${s.b.alimentazione})`, soggA: 'la prima auto', soggB: 'la seconda auto' };
  }
  return { nomeA: na.nome, nomeB: nb.nome, soggA: na.sogg, soggB: nb.sogg };
}

const veicolo = (x) => ({
  prezzo: x.prezzo,
  residuoModo: 'perc',
  svalPerc: x.svalPerc,
  fin: false,
  alimentazione: x.alimentazione,
  consumo: x.consumo,
  prezzoCarb: x.prezzoCarb,
  consumoEl: x.consumoEl,
  percCasa: x.percCasa,
  prezzoCasa: x.prezzoCasa,
  prezzoColonnina: x.prezzoColonnina,
  rc: x.rc,
  bollo: x.bollo,
  tagliandi: x.manutenzione,
  gommeCosto: x.gommeCosto,
  gommeKm: x.gommeKm,
});

function avvisiPrezzi(v, nome) {
  const out = [];
  if (v.alimentazione === 'elettrica') {
    if (!(Number(v.prezzoCasa) > 0) && Number(v.percCasa) > 0) out.push(`${nome}: inserisci il prezzo dell’energia per la ricarica domestica.`);
    if (!(Number(v.prezzoColonnina) > 0) && Number(v.percCasa) < 100) out.push(`${nome}: inserisci il prezzo della ricarica alle colonnine.`);
  } else if (!(Number(v.prezzoCarb) > 0)) {
    out.push(`${nome}: inserisci il prezzo del carburante, senza il confronto non è attendibile.`);
  }
  return out;
}

/** s = { km, anni, a: {...}, b: {...} } */
export function calcolaConfronto(s) {
  const uso = { km: s.km, anni: s.anni };
  const nomi = nomiAuto(s);
  const ra = calcolaVeicolo(veicolo(s.a), uso);
  const rb = calcolaVeicolo(veicolo(s.b), uso);
  const p = puntoPareggio(ra, rb); // quando conviene B
  const avvisi = [...avvisiPrezzi(s.a, nomi.nomeA), ...avvisiPrezzi(s.b, nomi.nomeB)];
  return { ra, rb, p, ...nomi, avvisi };
}

const kmTondi = (km) => num(Math.round(km / 100) * 100);

export function testoPareggio({ p, soggA, soggB }) {
  const B = maiuscola(soggB);
  switch (p.esito) {
    case 'oltre':
      return { titolo: `${B} conviene oltre ${kmTondi(p.km)} km all’anno`, sotto: `Sotto questa soglia costa meno ${escHtml(soggA)}.` };
    case 'sotto':
      return { titolo: `${B} conviene sotto ${kmTondi(p.km)} km all’anno`, sotto: `Oltre questa soglia costa meno ${escHtml(soggA)}.` };
    case 'sempre':
      return { titolo: `Con questi dati ${soggB} conviene a qualsiasi chilometraggio`, sotto: 'Costa meno sia nei costi fissi sia in quelli per chilometro.' };
    default:
      return { titolo: `Con questi dati ${soggB} non raggiunge mai il pareggio`, sotto: `${escHtml(maiuscola(soggA))} costa meno a qualsiasi chilometraggio: prova a modificare prezzi, svalutazione o consumi.` };
  }
}

export function testoDifferenza({ ra, rb, soggA, soggB }, s) {
  const d = ra.totaleAnnuo - rb.totaleAnnuo;
  if (Math.abs(d) < 1) return `Con ${num(s.km)} km all’anno le due auto costano praticamente lo stesso.`;
  const chi = d > 0 ? soggB : soggA;
  return `Con i tuoi ${num(s.km)} km all’anno ${escHtml(chi)} ti fa risparmiare <strong>${euro(Math.abs(d))} all’anno</strong>, cioè ${euro(Math.abs(d) * s.anni)} in ${anniLabel(s.anni)}.`;
}

export function tabellaConfronto({ ra, rb, nomeA, nomeB }, s) {
  const row = (l, a, b) => `<tr><th scope="row">${l}</th><td class="num">${a}</td><td class="num">${b}</td></tr>`;
  return `<caption class="sr-only">Confronto dei costi tra ${escHtml(nomeA.toLowerCase())} e ${escHtml(nomeB.toLowerCase())}</caption>
<thead><tr><th scope="col">Voce</th><th scope="col" class="num">${escHtml(nomeA)}</th><th scope="col" class="num">${escHtml(nomeB)}</th></tr></thead>
<tbody>
${row('Svalutazione annua', euro(ra.voci.svalutazione), euro(rb.voci.svalutazione))}
${row('Energia / carburante', euro(ra.voci.energia), euro(rb.voci.energia))}
${row('Assicurazione', euro(ra.voci.assicurazione), euro(rb.voci.assicurazione))}
${row('Bollo', euro(ra.voci.bollo), euro(rb.voci.bollo))}
${row('Manutenzione', euro(ra.voci.manutenzione), euro(rb.voci.manutenzione))}
${row('Pneumatici', euro(ra.voci.pneumatici), euro(rb.voci.pneumatici))}
${row('Costi fissi (non dipendono dai km)', euro(ra.fissoAnnuo), euro(rb.fissoAnnuo))}
${row('Costo per ogni km in più', euro(ra.variabilePerKm, 3), euro(rb.variabilePerKm, 3))}
</tbody>
<tfoot>
${row(`Totale annuo (${num(s.km)} km)`, euro(ra.totaleAnnuo), euro(rb.totaleAnnuo))}
${row('Costo al km', euro(ra.perKm, 3), euro(rb.perKm, 3))}
${row(`In ${anniLabel(s.anni)}`, euro(ra.periodo), euro(rb.periodo))}
</tfoot>`;
}

/** Riempie i prezzi mancanti di un'auto con i valori di prezzi.json (oggetto chiave → valore). */
export function applicaPrezziAuto(v, prezzi) {
  const chiave = v.alimentazione === 'ibrida' ? 'benzina' : v.alimentazione;
  if (v.alimentazione !== 'elettrica' && (v.prezzoCarb === null || v.prezzoCarb === undefined)) v.prezzoCarb = prezzi[chiave] ?? null;
  if (v.prezzoCasa === null || v.prezzoCasa === undefined) v.prezzoCasa = prezzi.elettricita_casa ?? null;
  if (v.prezzoColonnina === null || v.prezzoColonnina === undefined) v.prezzoColonnina = prezzi.elettricita_colonnina ?? null;
  return v;
}
