/**
 * Valori predefiniti INDICATIVI dei calcolatori (esempi modificabili dall'utente,
 * non medie ufficiali). I prezzi di carburanti ed energia NON sono qui: arrivano
 * da /data/prezzi.json. Usato sia dal build (HTML precompilato) sia dal browser.
 */

export const USO_DEFAULT = {
  standard: { km: 12000, anni: 5 },
  neopatentati: { km: 8000, anni: 4 },
};

const BASE = {
  nome: 'Auto 1',
  prezzo: 22000,
  residuoModo: 'valore',
  residuo: 9000,
  svalPerc: 15,
  fin: false,
  finImporto: 15000,
  finTan: 7,
  finMesi: 60,
  alimentazione: 'benzina',
  consumo: 6,
  prezzoCarb: null,
  consumoEl: 16,
  percCasa: 70,
  prezzoCasa: null,
  prezzoColonnina: null,
  rc: 500,
  accessorie: 150,
  bollo: 200,
  garage: 0,
  abbonamenti: 0,
  tagliandi: 300,
  gommeCosto: 400,
  gommeKm: 40000,
  riparazioni: 200,
  pedaggi: 150,
  lavaggi: 100,
  multe: 0,
};

export const VEICOLO_DEFAULT = {
  standard: BASE,
  neopatentati: {
    ...BASE,
    nome: 'Prima auto',
    prezzo: 11000,
    residuo: 5000,
    finImporto: 8000,
    finMesi: 48,
    consumo: 5.5,
    rc: 1200,
    accessorie: 80,
    bollo: 150,
    tagliandi: 250,
    gommeCosto: 300,
    riparazioni: 300,
    pedaggi: 50,
    lavaggi: 60,
  },
};

/** Consumo predefinito suggerito quando l'utente cambia alimentazione. */
export const CONSUMO_DEFAULT = {
  benzina: 6,
  diesel: 5,
  gpl: 8,
  metano: 4.5,
  ibrida: 4.5,
};

/** Preimpostazioni della pagina di confronto elettrica / termica. */
export const CONFRONTO_DEFAULT = {
  km: 15000,
  anni: 6,
  termica: {
    alimentazione: 'benzina', prezzo: 24000, svalPerc: 15, consumo: 6, prezzoCarb: null,
    rc: 550, bollo: 220, manutenzione: 450, gommeCosto: 400, gommeKm: 40000,
  },
  elettrica: {
    prezzo: 32000, svalPerc: 17, consumoEl: 16, percCasa: 70, prezzoCasa: null, prezzoColonnina: null,
    rc: 600, bollo: 0, manutenzione: 250, gommeCosto: 500, gommeKm: 35000,
  },
};

export const VIAGGIO_DEFAULT = {
  distanza: 250,
  andataRitorno: true,
  alimentazione: 'benzina',
  consumo: 6,
  prezzo: null,
  pedaggi: 0,
  parcheggio: 0,
  persone: 1,
};
