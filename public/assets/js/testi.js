/**
 * Testi dei risultati, condivisi tra browser e build: il build li usa per
 * precompilare l'HTML con gli stessi valori che il JavaScript mostrerà,
 * così la pagina non si sposta al caricamento (CLS zero).
 */
import { euro, pct, num, escHtml } from './ui.js';
import { vocePrincipale } from './calc.js';

export const CONSIGLI = {
  svalutazione: 'Tenere l’auto più a lungo o scegliere un modello che si svaluta meno riduce questa voce.',
  interessi: 'Un anticipo più alto, una durata più breve o un TAN più basso riducono gli interessi.',
  energia: 'Guida fluida, pressione delle gomme corretta e scelta del distributore incidono subito su questa voce.',
  assicurazione: 'Confrontare più preventivi al rinnovo è il modo più rapido per ridurla.',
  bollo: 'Dipende da potenza e classe ambientale: verifica le agevolazioni previste dalla tua regione.',
  manutenzione: 'Rispettare il piano dei tagliandi aiuta a prevenire riparazioni più costose.',
  pneumatici: 'Pressione corretta, convergenza e rotazione allungano la durata delle gomme.',
  altro: 'Per parcheggio e pedaggi valuta abbonamenti o alternative sui tragitti abituali.',
};

export const anniLabel = (a) => (a === 1 ? '1 anno' : `${num(a, 1)} anni`);

export function highlightHtml(r) {
  const top = vocePrincipale(r);
  return top
    ? `La voce più pesante è <strong>${escHtml(top.label.toLowerCase())}</strong>: ${euro(top.valore)} all’anno, il ${pct(top.quota)} del totale. ${CONSIGLI[top.id]}`
    : 'Inserisci i dati per vedere la ripartizione dei costi.';
}

export const avvisiHtml = (r) => r.avvisi.map((a) => `<p class="avviso">${escHtml(a)}</p>`).join('');

export function residuoInfo(v, r, anni) {
  const d = r.dettagli;
  if (v.residuoModo === 'perc') {
    return `Valore stimato dopo ${anniLabel(anni)}: ${euro(d.residuo)} (svalutazione ${euro(r.voci.svalutazione)}/anno).`;
  }
  const p = Number(v.prezzo) || 0;
  const eq = p > 0 && d.residuo > 0 && d.residuo < p ? 1 - Math.pow(d.residuo / p, 1 / anni) : null;
  return `Svalutazione: ${euro(r.voci.svalutazione)}/anno${eq !== null ? ` (circa ${num(eq * 100, 1)}% all’anno)` : ''}.`;
}

export function finInfo(v, r) {
  const d = r.dettagli;
  if (!v.fin || !(d.fin.rata > 0)) return '';
  return `Rata mensile: ${euro(d.fin.rata, 2)} · interessi totali: ${euro(d.fin.interessiTotali)} (${euro(d.quotaInteressiAnnua)}/anno per ${anniLabel(Math.round(d.fin.anni * 10) / 10)}). La quota capitale non è un costo aggiuntivo: è già compresa nel prezzo d’acquisto.`;
}

/** Testi del calcolatore di rimborso chilometrico (r = rimborsoChilometrico(t)). */
export function testiRimborso(r, t) {
  const haTariffa = Number(t.tariffa) > 0;
  const avvisi = haTariffa ? [] : ['Inserisci il rimborso per km: lo trovi nelle tabelle ACI per il tuo modello di auto oppure nell’accordo con la tua azienda.'];
  let copertura;
  if (!haTariffa) copertura = 'Il risultato apparirà quando inserisci il rimborso per km.';
  else if (r.copertura === null) copertura = 'Vuoi sapere se il rimborso copre davvero quanto ti costa l’auto? <a href="/">Calcola il tuo costo reale al km</a> e inseriscilo qui.';
  else {
    const d = r.differenza;
    copertura = `Il rimborso copre il <strong>${pct(r.copertura)}</strong> del costo reale della tua auto per questi km (${euro(r.chilometrico, 2)} su ${euro(r.costoReale, 2)}): ${d >= 0 ? `ti avanzano circa <strong>${euro(d, 2)}</strong>` : `ci rimetti circa <strong>${euro(-d, 2)}</strong>`}.`;
  }
  return {
    avvisi,
    copertura,
    totale: haTariffa ? euro(r.totale, 2) : '–',
    chilometrico: haTariffa ? euro(r.chilometrico, 2) : '–',
    extra: euro(r.extra, 2),
    km: `${num(r.km)} km`,
  };
}
