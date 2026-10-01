/** Logica e testi del confronto elettrica / termica (condivisi tra browser e build). */
import { calcolaVeicolo, puntoPareggio, ALIMENTAZIONI } from './calc.js';
import { euro, num, escHtml } from './ui.js';
import { anniLabel } from './testi.js';

export const CAMPI_T = ['alimentazione', 'prezzo', 'svalPerc', 'consumo', 'prezzoCarb', 'rc', 'bollo', 'manutenzione', 'gommeCosto', 'gommeKm'];
export const CAMPI_E = ['prezzo', 'svalPerc', 'consumoEl', 'percCasa', 'prezzoCasa', 'prezzoColonnina', 'rc', 'bollo', 'manutenzione', 'gommeCosto', 'gommeKm'];

const veicolo = (x, alimentazione) => ({
  prezzo: x.prezzo,
  residuoModo: 'perc',
  svalPerc: x.svalPerc,
  fin: false,
  alimentazione,
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

/** s = { km, anni, termica: {...}, elettrica: {...} } */
export function calcolaConfronto(s) {
  const uso = { km: s.km, anni: s.anni };
  const nomeT = `Auto ${ALIMENTAZIONI[s.termica.alimentazione]?.label.toLowerCase() || 'termica'}`;
  const rt = calcolaVeicolo(veicolo(s.termica, s.termica.alimentazione), uso);
  const re = calcolaVeicolo(veicolo(s.elettrica, 'elettrica'), uso);
  const p = puntoPareggio(rt, re);
  const avvisi = [];
  if (!(Number(s.termica.prezzoCarb) > 0)) avvisi.push('Inserisci il prezzo del carburante dell’auto termica: senza, il confronto non è attendibile.');
  if (!(Number(s.elettrica.prezzoCasa) > 0) && Number(s.elettrica.percCasa) > 0) avvisi.push('Inserisci il prezzo dell’energia per la ricarica domestica.');
  if (!(Number(s.elettrica.prezzoColonnina) > 0) && Number(s.elettrica.percCasa) < 100) avvisi.push('Inserisci il prezzo della ricarica alle colonnine.');
  return { rt, re, p, nomeT, avvisi };
}

export function testoPareggio({ p, nomeT }) {
  const t = escHtml(nomeT.toLowerCase());
  switch (p.esito) {
    case 'oltre':
      return { titolo: `L’elettrica conviene oltre ${num(Math.round(p.km / 100) * 100)} km all’anno`, sotto: `Sotto questa soglia costa meno l’${t}.` };
    case 'sotto':
      return { titolo: `L’elettrica conviene sotto ${num(Math.round(p.km / 100) * 100)} km all’anno`, sotto: `Oltre questa soglia costa meno l’${t}.` };
    case 'sempre':
      return { titolo: 'Con questi dati l’elettrica conviene a qualsiasi chilometraggio', sotto: 'Costa meno sia nei costi fissi sia in quelli per chilometro.' };
    default:
      return { titolo: 'Con questi dati l’elettrica non raggiunge mai il pareggio', sotto: `L’${t} costa meno a qualsiasi chilometraggio: prova a modificare prezzi, svalutazione o energia.` };
  }
}

export function testoDifferenza({ rt, re, nomeT }, s) {
  const d = rt.totaleAnnuo - re.totaleAnnuo;
  if (Math.abs(d) < 1) return `Con ${num(s.km)} km all’anno le due auto costano praticamente lo stesso.`;
  const chi = d > 0 ? 'l’elettrica' : `l’${escHtml(nomeT.toLowerCase())}`;
  return `Con i tuoi ${num(s.km)} km all’anno ${chi} ti fa risparmiare <strong>${euro(Math.abs(d))} all’anno</strong>, cioè ${euro(Math.abs(d) * s.anni)} in ${anniLabel(s.anni)}.`;
}

export function tabellaConfronto({ rt, re, nomeT }, s) {
  const row = (l, a, b) => `<tr><th scope="row">${l}</th><td class="num">${a}</td><td class="num">${b}</td></tr>`;
  return `<caption class="sr-only">Confronto dei costi tra auto termica ed elettrica</caption>
<thead><tr><th scope="col">Voce</th><th scope="col" class="num">${escHtml(nomeT)}</th><th scope="col" class="num">Elettrica</th></tr></thead>
<tbody>
${row('Svalutazione annua', euro(rt.voci.svalutazione), euro(re.voci.svalutazione))}
${row('Energia / carburante', euro(rt.voci.energia), euro(re.voci.energia))}
${row('Assicurazione', euro(rt.voci.assicurazione), euro(re.voci.assicurazione))}
${row('Bollo', euro(rt.voci.bollo), euro(re.voci.bollo))}
${row('Manutenzione', euro(rt.voci.manutenzione), euro(re.voci.manutenzione))}
${row('Pneumatici', euro(rt.voci.pneumatici), euro(re.voci.pneumatici))}
${row('Costi fissi (non dipendono dai km)', euro(rt.fissoAnnuo), euro(re.fissoAnnuo))}
${row('Costo per ogni km in più', euro(rt.variabilePerKm, 3), euro(re.variabilePerKm, 3))}
</tbody>
<tfoot>
${row(`Totale annuo (${num(s.km)} km)`, euro(rt.totaleAnnuo), euro(re.totaleAnnuo))}
${row('Costo al km', euro(rt.perKm, 3), euro(re.perKm, 3))}
${row(`In ${anniLabel(s.anni)}`, euro(rt.periodo), euro(re.periodo))}
</tfoot>`;
}
