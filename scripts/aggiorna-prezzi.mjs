#!/usr/bin/env node
/**
 * Aggiornamento automatico dei prezzi medi dei carburanti dai dati aperti del MIMIT.
 *
 *   node scripts/aggiorna-prezzi.mjs            scarica i CSV e aggiorna public/data/prezzi.json
 *   node scripts/aggiorna-prezzi.mjs --dry-run  mostra i valori senza scrivere
 *
 * Fonti (open data "Osservaprezzi carburanti", aggiornate ogni mattina):
 *   - prezzi praticati alle 8:00 da ogni impianto   → prezzo_alle_8.csv
 *   - anagrafica degli impianti attivi              → anagrafica_impianti_attivi.csv
 *
 * Metodo (allineato alle medie nazionali pubblicate dal MIMIT):
 *   - solo impianti della rete stradale (esclusi quelli autostradali);
 *   - benzina e gasolio: prezzi in modalità self service;
 *   - GPL e metano: prezzi in modalità servito;
 *   - media aritmetica dei prezzi per impianto, scartando valori fuori scala.
 * Energia elettrica (ARERA) e colonnine (Adiconsum–TariffEV) non hanno dati aperti
 * scaricabili: restano manuali e lo script segnala quando sono vecchi.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const FILE = join(ROOT, 'public/data/prezzi.json');
const FILE_REGIONI = join(ROOT, 'public/data/prezzi-regioni.json');
const FILE_STORICO = join(ROOT, 'public/data/storico-prezzi.json');
// MIMIT_BASE_URL permette di provare lo script contro una copia locale dei CSV
const BASE = process.env.MIMIT_BASE_URL || 'https://www.mimit.gov.it/images/exportCSV/';
const URL_PREZZI = BASE + 'prezzo_alle_8.csv';
const URL_ANAGRAFICA = BASE + 'anagrafica_impianti_attivi.csv';

/** Carburanti calcolati: chiave in prezzi.json → descrizione MIMIT, modalità e intervallo plausibile (€). */
export const CARBURANTI = {
  benzina: { desc: 'benzina', self: true, min: 0.8, max: 4 },
  diesel: { desc: 'gasolio', self: true, min: 0.8, max: 4 },
  gpl: { desc: 'gpl', self: false, min: 0.3, max: 2 },
  metano: { desc: 'metano', self: false, min: 0.5, max: 5 },
};

/** Variazione massima accettata rispetto al valore precedente: oltre, i dati sono considerati anomali. */
export const MAX_VARIAZIONE = 0.25;

/** Divide un CSV MIMIT in righe di campi, riconoscendo il separatore (| oppure ;). */
export function parseCsv(text) {
  const righe = text.replace(/^﻿/, '').split(/\r?\n/).filter((r) => r.trim() !== '');
  const intestazioneIdx = righe.findIndex((r) => /idimpianto/i.test(r));
  if (intestazioneIdx < 0) throw new Error('Intestazione CSV non trovata');
  // separatore: quello che divide l'intestazione nel maggior numero di colonne
  const sep = ['|', ';', '\t', ','].reduce((best, c) => (righe[intestazioneIdx].split(c).length > righe[intestazioneIdx].split(best).length ? c : best), '|');
  const head = righe[intestazioneIdx].split(sep).map((h) => h.trim().toLowerCase());
  const meta = righe.slice(0, intestazioneIdx).join(' ');
  const rows = righe.slice(intestazioneIdx + 1).map((r) => {
    const c = r.split(sep);
    return Object.fromEntries(head.map((h, i) => [h, (c[i] ?? '').trim()]));
  });
  return { head, rows, meta };
}

/** Data di estrazione dalla prima riga del CSV ("Estrazione del 2026-09-30"), se presente. */
export function dataEstrazione(meta) {
  const m = meta.match(/(\d{4})-(\d{2})-(\d{2})/) || meta.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (!m) return null;
  return m[1].length === 4 ? `${m[1]}-${m[2]}-${m[3]}` : `${m[3]}-${m[2]}-${m[1]}`;
}

/** Valore di un campo: prima per nome esatto, poi per nome che contiene la parola indicata. */
const campo = (row, ...nomi) => {
  for (const n of nomi) if (row[n] !== undefined) return row[n];
  for (const n of nomi) {
    const k = Object.keys(row).find((x) => x.replace(/[\s_]/g, '').includes(n.replace(/[\s_]/g, '')));
    if (k) return row[k];
  }
  return '';
};

/** Insieme degli id degli impianti autostradali, dall'anagrafica. */
export function impiantiAutostradali(anagrafica) {
  const set = new Set();
  for (const r of anagrafica.rows) {
    const tipo = campo(r, 'tipo impianto', 'tipoimpianto').toLowerCase();
    if (tipo.includes('autostrad')) set.add(campo(r, 'idimpianto'));
  }
  return set;
}

/** Sigla della provincia → regione (le sigle non riconosciute vengono ignorate nelle medie regionali). */
const PROVINCE = {
  Abruzzo: 'AQ CH PE TE',
  Basilicata: 'MT PZ',
  Calabria: 'CS CZ KR RC VV',
  Campania: 'AV BN CE NA SA',
  'Emilia-Romagna': 'BO FC FE MO PC PR RA RE RN',
  'Friuli-Venezia Giulia': 'GO PN TS UD',
  Lazio: 'FR LT RI RM VT',
  Liguria: 'GE IM SP SV',
  Lombardia: 'BG BS CO CR LC LO MB MI MN PV SO VA',
  Marche: 'AN AP FM MC PU',
  Molise: 'CB IS',
  Piemonte: 'AL AT BI CN NO TO VB VC',
  Puglia: 'BA BR BT FG LE TA',
  Sardegna: 'CA CI NU OG OR OT SS SU VS',
  Sicilia: 'AG CL CT EN ME PA RG SR TP',
  Toscana: 'AR FI GR LI LU MS PI PO PT SI',
  'Trentino-Alto Adige': 'BZ TN',
  Umbria: 'PG TR',
  "Valle d'Aosta": 'AO',
  Veneto: 'BL PD RO TV VE VI VR',
};
export const REGIONE_DI_PROVINCIA = Object.fromEntries(Object.entries(PROVINCE).flatMap(([r, sigle]) => sigle.split(' ').map((s) => [s, r])));

/** Funzione id impianto → regione, dall'anagrafica (colonna Provincia). */
export function regioneDiImpianto(anagrafica) {
  const mappa = new Map();
  for (const r of anagrafica.rows) {
    const regione = REGIONE_DI_PROVINCIA[campo(r, 'provincia').toUpperCase()];
    if (regione) mappa.set(campo(r, 'idimpianto'), regione);
  }
  return (id) => mappa.get(id) || null;
}

const media = (acc) => {
  const out = {};
  for (const [k, m] of Object.entries(acc)) {
    const v = [...m.values()];
    out[k] = { media: v.length ? Math.round((v.reduce((a, b) => a + b, 0) / v.length) * 1000) / 1000 : null, impianti: v.length };
  }
  return out;
};

/**
 * Medie per carburante. Senza `gruppoDi` restituisce la media nazionale
 * { benzina: {media, impianti}, ... }; con `gruppoDi(id)` restituisce { gruppo: {...} }.
 */
export function calcolaMedie(prezzi, esclusi = new Set(), gruppoDi = null) {
  const gruppi = new Map();
  const accDi = (g) => {
    if (!gruppi.has(g)) gruppi.set(g, Object.fromEntries(Object.keys(CARBURANTI).map((k) => [k, new Map()])));
    return gruppi.get(g);
  };
  for (const r of prezzi.rows) {
    const id = campo(r, 'idimpianto');
    if (esclusi.has(id)) continue;
    const g = gruppoDi ? gruppoDi(id) : 'italia';
    if (!g) continue;
    const desc = campo(r, 'desccarburante', 'carburante').toLowerCase();
    const selfRaw = campo(r, 'isself', 'self').toLowerCase();
    const self = selfRaw === '1' || selfRaw === 'true' || selfRaw === 's';
    const prezzo = Number(campo(r, 'prezzo').replace(',', '.'));
    for (const [k, c] of Object.entries(CARBURANTI)) {
      if (desc !== c.desc || self !== c.self) continue;
      if (!(prezzo >= c.min && prezzo <= c.max)) continue;
      // un solo prezzo per impianto (se ripetuto si tiene il più basso, come esposto al pubblico)
      const acc = accDi(g)[k];
      const prima = acc.get(id);
      if (prima === undefined || prezzo < prima) acc.set(id, prezzo);
    }
  }
  if (!gruppoDi) return media(accDi('italia'));
  return Object.fromEntries([...gruppi].sort(([a], [b]) => a.localeCompare(b, 'it')).map(([g, acc]) => [g, media(acc)]));
}

/** Medie regionali in forma compatta per il sito; valori con meno di 5 impianti → null. */
export function riassuntoRegioni(medieRegioni, { riferimento, oggi }) {
  const regioni = {};
  for (const [r, m] of Object.entries(medieRegioni)) {
    regioni[r] = Object.fromEntries(Object.entries(m).map(([k, v]) => [k, v.impianti >= 5 ? v.media : null]));
    regioni[r].impianti = Math.max(...Object.values(m).map((v) => v.impianti));
  }
  return { riferimento, aggiornato: oggi, fonte: 'Elaborazione costokm.it su open data MIMIT – Osservaprezzi carburanti (rete stradale; self per benzina e gasolio, servito per GPL e metano)', regioni };
}

/** Aggiunge (o sostituisce) la media nazionale del giorno nello storico, tenendo gli ultimi 2 anni. */
export function aggiornaStorico(storico, riferimento, medie) {
  const serie = (storico?.serie || []).filter((x) => x.data !== riferimento);
  serie.push({ data: riferimento, ...Object.fromEntries(Object.entries(medie).map(([k, v]) => [k, v.media])) });
  serie.sort((a, b) => a.data.localeCompare(b.data));
  return { fonte: 'Medie nazionali giornaliere, rete stradale (open data MIMIT – Osservaprezzi carburanti)', serie: serie.slice(-730) };
}

const giorniDa = (iso, oggi) => (iso ? Math.round((new Date(oggi) - new Date(iso)) / 86400000) : Infinity);

/**
 * Applica le nuove medie al contenuto di prezzi.json.
 * Restituisce { json, cambiati, avvisi }. Lancia un errore se i dati sono anomali.
 */
export function applicaMedie(json, medie, { riferimento, oggi }) {
  const avvisi = [];
  const cambiati = [];
  const MIN_IMPIANTI = 300;
  for (const [k, m] of Object.entries(medie)) {
    const voce = json.prezzi[k];
    if (!voce) continue;
    if (m.media === null || m.impianti < MIN_IMPIANTI) {
      throw new Error(`${k}: dati insufficienti (${m.impianti} impianti)`);
    }
    if (typeof voce.valore === 'number' && Math.abs(m.media - voce.valore) / voce.valore > MAX_VARIAZIONE) {
      throw new Error(`${k}: variazione anomala ${voce.valore} → ${m.media}`);
    }
    const modo = CARBURANTI[k].self ? 'self service' : 'servito';
    if (voce.valore !== m.media) cambiati.push(`${k}: ${voce.valore} → ${m.media}`);
    voce.valore = m.media;
    voce.riferimento = riferimento;
    voce.nota = `Media nazionale ${modo}, rete stradale, calcolata sui prezzi alle 8:00 comunicati da ${m.impianti} impianti (open data MIMIT – Osservaprezzi carburanti), ${riferimento.split('-').reverse().join('/')}`;
    voce.fonte_url = 'https://www.mimit.gov.it/it/open-data/elenco-dataset/carburanti-prezzi-praticati-e-anagrafica-degli-impianti';
  }
  json.ultimo_aggiornamento = oggi;
  json.stato = 'Aggiornato automaticamente';
  const casa = json.prezzi.elettricita_casa;
  const col = json.prezzi.elettricita_colonnina;
  if (casa && giorniDa(casa.riferimento, oggi) > 100) avvisi.push(`Energia domestica (ARERA) ferma al ${casa.riferimento}: aggiornala a mano (cambia ogni trimestre).`);
  if (col && giorniDa(col.riferimento, oggi) > 75) avvisi.push(`Prezzo colonnine fermo al ${col.riferimento}: aggiornalo a mano (tabelle mensili Adiconsum–TariffEV).`);
  return { json, cambiati, avvisi };
}

async function scarica(url) {
  let ultimoErrore;
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': 'costokm.it aggiornamento prezzi (+https://costokm.it)' } });
      if (!r.ok) throw new Error(`${url}: HTTP ${r.status}`);
      const buf = Buffer.from(await r.arrayBuffer());
      // i CSV del MIMIT sono in UTF-8; in caso di caratteri non validi si ripiega su latin1
      const testo = buf.toString('utf8');
      return testo.includes('�') ? buf.toString('latin1') : testo;
    } catch (e) {
      ultimoErrore = e;
      await new Promise((res) => setTimeout(res, 3000 * (i + 1)));
    }
  }
  throw ultimoErrore;
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const [testoPrezzi, testoAnagrafica] = await Promise.all([scarica(URL_PREZZI), scarica(URL_ANAGRAFICA)]);
  const prezzi = parseCsv(testoPrezzi);
  const anagrafica = parseCsv(testoAnagrafica);
  const esclusi = impiantiAutostradali(anagrafica);
  const medie = calcolaMedie(prezzi, esclusi);
  const oggi = new Date().toISOString().slice(0, 10);
  const riferimento = dataEstrazione(prezzi.meta) || oggi;

  console.log(`Estrazione MIMIT del ${riferimento} – ${prezzi.rows.length} prezzi, ${esclusi.size} impianti autostradali esclusi`);
  for (const [k, m] of Object.entries(medie)) console.log(`  ${k.padEnd(8)} ${m.media} (${m.impianti} impianti)`);

  const json = JSON.parse(await readFile(FILE, 'utf8'));
  const { cambiati, avvisi } = applicaMedie(json, medie, { riferimento, oggi });
  avvisi.forEach((a) => console.log('⚠ ' + a));
  // Promemoria per i prezzi da aggiornare a mano (letto dall'azione GitHub per aprire una segnalazione)
  if (process.env.AVVISI_FILE) await writeFile(process.env.AVVISI_FILE, avvisi.join('\n'));

  const regioni = riassuntoRegioni(calcolaMedie(prezzi, esclusi, regioneDiImpianto(anagrafica)), { riferimento, oggi });
  console.log(`Medie regionali: ${Object.keys(regioni.regioni).length} regioni`);
  const storico = aggiornaStorico(await readFile(FILE_STORICO, 'utf8').then(JSON.parse, () => null), riferimento, medie);

  if (dryRun) return;
  await writeFile(FILE, JSON.stringify(json, null, 2) + '\n');
  await writeFile(FILE_REGIONI, JSON.stringify(regioni, null, 2) + '\n');
  await writeFile(FILE_STORICO, JSON.stringify(storico, null, 1) + '\n');
  console.log(cambiati.length ? `Aggiornati: ${cambiati.join(', ')}` : 'Nessuna variazione di prezzo (data aggiornata).');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => {
    console.error('Aggiornamento non riuscito: ' + e.message);
    console.error('prezzi.json non è stato modificato: il sito continua a mostrare gli ultimi valori validi con la loro data.');
    process.exit(1);
  });
}
