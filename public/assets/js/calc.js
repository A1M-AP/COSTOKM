/**
 * Motore di calcolo di costokm.it — funzioni pure, nessun accesso al DOM.
 * Usato dal browser (ES module) e dai test (node --test).
 */

/** Voci di costo nell'ordine fisso usato da grafici e tabelle. */
export const CATEGORIE = [
  { id: 'svalutazione', label: 'Svalutazione' },
  { id: 'interessi', label: 'Interessi finanziamento' },
  { id: 'energia', label: 'Carburante / energia' },
  { id: 'assicurazione', label: 'Assicurazione' },
  { id: 'bollo', label: 'Bollo' },
  { id: 'manutenzione', label: 'Manutenzione e riparazioni' },
  { id: 'pneumatici', label: 'Pneumatici' },
  { id: 'altro', label: 'Parcheggio e altri costi' },
];

/** Alimentazioni supportate: unità di consumo e chiave del prezzo in prezzi.json. */
export const ALIMENTAZIONI = {
  benzina: { label: 'Benzina', unitaConsumo: 'l/100 km', unitaPrezzo: '€/l', unita: 'l', prezzo: 'benzina' },
  diesel: { label: 'Diesel', unitaConsumo: 'l/100 km', unitaPrezzo: '€/l', unita: 'l', prezzo: 'diesel' },
  gpl: { label: 'GPL', unitaConsumo: 'l/100 km', unitaPrezzo: '€/l', unita: 'l', prezzo: 'gpl' },
  metano: { label: 'Metano', unitaConsumo: 'kg/100 km', unitaPrezzo: '€/kg', unita: 'kg', prezzo: 'metano' },
  ibrida: { label: 'Ibrida (benzina)', unitaConsumo: 'l/100 km', unitaPrezzo: '€/l', unita: 'l', prezzo: 'benzina' },
  elettrica: { label: 'Elettrica', unitaConsumo: 'kWh/100 km', unitaPrezzo: '€/kWh', unita: 'kWh', prezzo: null },
};

const n = (x) => (Number.isFinite(Number(x)) ? Number(x) : 0);
const pos = (x) => Math.max(0, n(x));

/** Rata mensile di un finanziamento a rate costanti (ammortamento alla francese). */
export function rataMensile(importo, tan, mesi) {
  importo = pos(importo);
  mesi = Math.round(pos(mesi));
  if (importo === 0 || mesi === 0) return 0;
  const i = pos(tan) / 100 / 12;
  if (i === 0) return importo / mesi;
  return (importo * i) / (1 - Math.pow(1 + i, -mesi));
}

/** Dati riassuntivi di un finanziamento. */
export function finanziamento({ importo, tan, mesi }) {
  const m = Math.round(pos(mesi));
  const rata = rataMensile(importo, tan, m);
  const totale = rata * m;
  return {
    rata,
    totaleRimborsato: totale,
    interessiTotali: Math.max(0, totale - pos(importo)),
    anni: m / 12,
  };
}

/** Valore residuo a fine possesso: inserito direttamente o da svalutazione % annua composta. */
export function valoreResiduo(v, anni) {
  const prezzo = pos(v.prezzo);
  if (v.residuoModo === 'perc') {
    const p = Math.min(100, pos(v.svalPerc)) / 100;
    return prezzo * Math.pow(1 - p, pos(anni));
  }
  return pos(v.residuo);
}

/** Costo energetico per 100 km (€/100 km) e prezzo medio per unità. */
export function costoEnergiaPer100(v) {
  if (v.alimentazione === 'elettrica') {
    const casa = Math.min(100, pos(v.percCasa)) / 100;
    const prezzoMedio = casa * pos(v.prezzoCasa) + (1 - casa) * pos(v.prezzoColonnina);
    return { per100: pos(v.consumoEl) * prezzoMedio, prezzoMedio, consumo: pos(v.consumoEl) };
  }
  return { per100: pos(v.consumo) * pos(v.prezzoCarb), prezzoMedio: pos(v.prezzoCarb), consumo: pos(v.consumo) };
}

/**
 * Calcola il costo di possesso di un veicolo.
 * @param {object} v  dati del veicolo (vedi DEFAULT_VEICOLO in calcolatore.js)
 * @param {{km:number, anni:number}} uso  km annui e anni di possesso
 */
export function calcolaVeicolo(v, uso) {
  const km = pos(uso.km);
  const anni = pos(uso.anni);
  const avvisi = [];

  // Svalutazione = (prezzo − residuo) / anni
  const prezzo = pos(v.prezzo);
  const residuo = valoreResiduo(v, anni);
  if (residuo > prezzo) avvisi.push('Il valore residuo è superiore al prezzo d’acquisto: la svalutazione è considerata pari a zero.');
  const svalutazioneTotale = Math.max(0, prezzo - residuo);
  const svalutazione = anni > 0 ? svalutazioneTotale / anni : 0;

  // Interessi: ripartiti sugli anni di finanziamento; si conteggiano quelli che
  // cadono nel periodo di possesso e si esprimono come media annua sul possesso.
  let fin = { rata: 0, totaleRimborsato: 0, interessiTotali: 0, anni: 0 };
  let quotaInteressiAnnua = 0;
  let interessi = 0;
  if (v.fin) {
    fin = finanziamento({ importo: v.finImporto, tan: v.finTan, mesi: v.finMesi });
    if (fin.anni > 0 && anni > 0) {
      quotaInteressiAnnua = fin.interessiTotali / fin.anni;
      interessi = (quotaInteressiAnnua * Math.min(fin.anni, anni)) / anni;
    }
    if (pos(v.finImporto) > prezzo) avvisi.push('L’importo finanziato supera il prezzo d’acquisto.');
  }

  // Carburante / energia = km / 100 × consumo × prezzo
  const en = costoEnergiaPer100(v);
  const energia = (km / 100) * en.per100;
  const consumoAnnuo = (km / 100) * en.consumo;
  if (en.prezzoMedio === 0 && en.consumo > 0) avvisi.push('Manca il prezzo del carburante o dell’energia: il costo di alimentazione è escluso dal totale.');

  // Pneumatici = costo treno × km annui / durata in km
  const durataGomme = pos(v.gommeKm);
  const pneumatici = durataGomme > 0 ? (pos(v.gommeCosto) * km) / durataGomme : 0;

  const voci = {
    svalutazione,
    interessi,
    energia,
    assicurazione: pos(v.rc) + pos(v.accessorie),
    bollo: pos(v.bollo),
    manutenzione: pos(v.tagliandi) + pos(v.riparazioni),
    pneumatici,
    altro: pos(v.garage) + pos(v.abbonamenti) + pos(v.pedaggi) + pos(v.lavaggi) + pos(v.multe),
  };

  const totaleAnnuo = Object.values(voci).reduce((a, b) => a + b, 0);
  // Quota che dipende dai km (energia + pneumatici) e quota fissa: servono per il punto di pareggio.
  const variabilePerKm = en.per100 / 100 + (durataGomme > 0 ? pos(v.gommeCosto) / durataGomme : 0);
  const fissoAnnuo = totaleAnnuo - variabilePerKm * km;

  return {
    voci,
    totaleAnnuo,
    mensile: totaleAnnuo / 12,
    perKm: km > 0 ? totaleAnnuo / km : 0,
    periodo: totaleAnnuo * anni,
    fissoAnnuo,
    variabilePerKm,
    dettagli: {
      residuo,
      svalutazioneTotale,
      fin,
      quotaInteressiAnnua,
      consumoAnnuo,
      prezzoEnergiaMedio: en.prezzoMedio,
      costoPer100: en.per100,
    },
    avvisi,
  };
}

/** Voce di costo più pesante: { id, label, valore, quota } oppure null. */
export function vocePrincipale(risultato) {
  let best = null;
  for (const c of CATEGORIE) {
    const valore = risultato.voci[c.id];
    if (valore > 0 && (!best || valore > best.valore)) best = { ...c, valore };
  }
  if (best) best.quota = risultato.totaleAnnuo > 0 ? best.valore / risultato.totaleAnnuo : 0;
  return best;
}

/**
 * Punto di pareggio tra due veicoli con costo annuo C(km) = fisso + variabile × km.
 * a = termica (o veicolo di riferimento), b = elettrica (o alternativa).
 * Restituisce { km, esito } dove esito è:
 *  'oltre'  → b conviene oltre `km` km/anno
 *  'sotto'  → b conviene sotto `km` km/anno
 *  'sempre' → b conviene a qualsiasi chilometraggio
 *  'mai'    → b non conviene a nessun chilometraggio
 */
export function puntoPareggio(a, b) {
  const dF = b.fissoAnnuo - a.fissoAnnuo; // quanto costa in più b ogni anno a 0 km
  const dV = a.variabilePerKm - b.variabilePerKm; // quanto risparmia b per ogni km
  const EPS = 1e-9;
  if (Math.abs(dV) < EPS) return { km: null, esito: dF <= 0 ? 'sempre' : 'mai' };
  const km = dF / dV;
  if (dV > 0) return km <= 0 ? { km: null, esito: 'sempre' } : { km, esito: 'oltre' };
  return km <= 0 ? { km: null, esito: 'mai' } : { km, esito: 'sotto' };
}

/** Costo carburante di un singolo tragitto. */
export function costoViaggio(t) {
  const distanza = pos(t.distanza) * (t.andataRitorno ? 2 : 1);
  const consumoTot = (distanza / 100) * pos(t.consumo);
  const carburante = consumoTot * pos(t.prezzo);
  const extra = pos(t.pedaggi) * (t.andataRitorno ? 2 : 1) + pos(t.parcheggio);
  const totale = carburante + extra;
  const persone = Math.max(1, Math.round(pos(t.persone)) || 1);
  return {
    distanza,
    consumoTot,
    carburante,
    extra,
    totale,
    perPersona: totale / persone,
    perKm: distanza > 0 ? carburante / distanza : 0,
    persone,
  };
}
