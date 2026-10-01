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

/** Auto di esempio per i confronti: ogni auto ha tutti i campi, così si può cambiare alimentazione. */
const auto = (o) => ({
  alimentazione: 'benzina', prezzo: 24000, svalPerc: 15,
  consumo: 6, prezzoCarb: null,
  consumoEl: 16, percCasa: 70, prezzoCasa: null, prezzoColonnina: null,
  rc: 550, bollo: 220, manutenzione: 450, gommeCosto: 400, gommeKm: 40000,
  ...o,
});

/** Preimpostazioni delle pagine di confronto (A = riferimento, B = alternativa). Valori indicativi. */
export const CONFRONTO_PRESET = {
  'elettrica-benzina': {
    km: 15000, anni: 6,
    a: auto({ alimentazione: 'benzina' }),
    b: auto({ alimentazione: 'elettrica', prezzo: 32000, svalPerc: 17, rc: 600, bollo: 0, manutenzione: 250, gommeCosto: 500, gommeKm: 35000 }),
  },
  'diesel-benzina': {
    km: 20000, anni: 6,
    a: auto({ alimentazione: 'benzina' }),
    b: auto({ alimentazione: 'diesel', prezzo: 26000, svalPerc: 16, consumo: 4.8, rc: 580, bollo: 260, manutenzione: 550, gommeCosto: 420 }),
  },
  'gpl-metano': {
    km: 18000, anni: 6,
    a: auto({ alimentazione: 'gpl', prezzo: 22500, consumo: 7.8, rc: 520, bollo: 200, manutenzione: 480 }),
    b: auto({ alimentazione: 'metano', prezzo: 23500, svalPerc: 16, consumo: 4.2, rc: 520, bollo: 200, manutenzione: 520 }),
  },
  'ibrida-benzina': {
    km: 15000, anni: 6,
    a: auto({ alimentazione: 'benzina', prezzo: 23000, consumo: 6.2 }),
    b: auto({ alimentazione: 'ibrida', prezzo: 27000, svalPerc: 14, consumo: 4.6, rc: 560, bollo: 200, manutenzione: 420 }),
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

/** Rimborso chilometrico: la tariffa resta vuota (va presa dalle tabelle ACI o dall'accordo aziendale). */
export const RIMBORSO_DEFAULT = {
  km: 60,
  andataRitorno: true,
  trasferte: 1,
  tariffa: null,
  extra: 0,
  costoReale: null,
};
