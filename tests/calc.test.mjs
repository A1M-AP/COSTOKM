import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  rataMensile, finanziamento, valoreResiduo, calcolaVeicolo, vocePrincipale, puntoPareggio, costoViaggio,
} from '../public/assets/js/calc.js';

const close = (a, b, eps = 0.01) => assert.ok(Math.abs(a - b) < eps, `${a} ≠ ${b}`);

const base = {
  prezzo: 20000, residuoModo: 'valore', residuo: 8000, svalPerc: 15,
  fin: false, finImporto: 0, finTan: 0, finMesi: 0,
  alimentazione: 'benzina', consumo: 6, prezzoCarb: 2,
  consumoEl: 16, percCasa: 70, prezzoCasa: 0.3, prezzoColonnina: 0.6,
  rc: 500, accessorie: 100, bollo: 200, garage: 0, abbonamenti: 0,
  tagliandi: 300, gommeCosto: 400, gommeKm: 40000, riparazioni: 200,
  pedaggi: 100, lavaggi: 50, multe: 0,
};

test('rata: TAN zero divide il capitale in parti uguali', () => {
  assert.equal(rataMensile(12000, 0, 12), 1000);
});

test('rata alla francese con TAN 6% su 48 mesi', () => {
  close(rataMensile(10000, 6, 48), 234.85);
  const f = finanziamento({ importo: 10000, tan: 6, mesi: 48 });
  close(f.interessiTotali, 1272.81, 0.05);
  assert.equal(f.anni, 4);
});

test('valore residuo da percentuale composta', () => {
  close(valoreResiduo({ prezzo: 20000, residuoModo: 'perc', svalPerc: 10 }, 2), 16200);
  assert.equal(valoreResiduo({ prezzo: 20000, residuoModo: 'valore', residuo: 7000 }, 5), 7000);
});

test('formule della specifica', () => {
  const r = calcolaVeicolo(base, { km: 15000, anni: 5 });
  close(r.voci.svalutazione, (20000 - 8000) / 5); // 2400
  close(r.voci.energia, 15000 / 100 * 6 * 2); // 1800
  close(r.voci.pneumatici, 400 * 15000 / 40000); // 150
  close(r.voci.assicurazione, 600);
  close(r.voci.manutenzione, 500);
  close(r.voci.altro, 150);
  const totale = 2400 + 1800 + 150 + 600 + 200 + 500 + 150;
  close(r.totaleAnnuo, totale);
  close(r.perKm, totale / 15000, 1e-6);
  close(r.mensile, totale / 12);
  close(r.periodo, totale * 5);
  assert.equal(vocePrincipale(r).id, 'svalutazione');
});

test('elettrica: prezzo medio pesato tra casa e colonnina', () => {
  const r = calcolaVeicolo({ ...base, alimentazione: 'elettrica' }, { km: 10000, anni: 5 });
  // 16 kWh × 100 tratte × (0,7×0,3 + 0,3×0,6 = 0,39)
  close(r.voci.energia, 16 * 100 * 0.39);
});

test('interessi ripartiti sugli anni di finanziamento', () => {
  const v = { ...base, fin: true, finImporto: 12000, finTan: 0, finMesi: 48 };
  assert.equal(calcolaVeicolo(v, { km: 10000, anni: 4 }).voci.interessi, 0);
  const v2 = { ...v, finTan: 6 };
  const f = finanziamento({ importo: 12000, tan: 6, mesi: 48 });
  // possesso = durata: quota annua piena
  close(calcolaVeicolo(v2, { km: 10000, anni: 4 }).voci.interessi, f.interessiTotali / 4);
  // possesso più lungo: interessi totali distribuiti sull'intero possesso
  close(calcolaVeicolo(v2, { km: 10000, anni: 8 }).voci.interessi, f.interessiTotali / 8);
  // vendita prima della fine: solo la quota degli anni di possesso
  close(calcolaVeicolo(v2, { km: 10000, anni: 2 }).voci.interessi, f.interessiTotali / 4);
});

test('prezzo mancante genera un avviso', () => {
  const r = calcolaVeicolo({ ...base, prezzoCarb: null }, { km: 10000, anni: 5 });
  assert.equal(r.voci.energia, 0);
  assert.ok(r.avvisi.length > 0);
});

test('fisso + variabile × km ricostruisce il totale', () => {
  const r = calcolaVeicolo(base, { km: 15000, anni: 5 });
  close(r.fissoAnnuo + r.variabilePerKm * 15000, r.totaleAnnuo);
});

test('punto di pareggio', () => {
  const termica = { fissoAnnuo: 3000, variabilePerKm: 0.15 };
  const elettrica = { fissoAnnuo: 4000, variabilePerKm: 0.05 };
  const p = puntoPareggio(termica, elettrica);
  assert.equal(p.esito, 'oltre');
  close(p.km, 10000);
  assert.equal(puntoPareggio(termica, { fissoAnnuo: 2500, variabilePerKm: 0.05 }).esito, 'sempre');
  assert.equal(puntoPareggio(termica, { fissoAnnuo: 4000, variabilePerKm: 0.2 }).esito, 'mai');
  const s = puntoPareggio(termica, { fissoAnnuo: 2000, variabilePerKm: 0.25 });
  assert.equal(s.esito, 'sotto');
  close(s.km, 10000);
});

test('costo viaggio andata e ritorno', () => {
  const t = costoViaggio({ distanza: 300, andataRitorno: true, consumo: 6, prezzo: 2, pedaggi: 20, parcheggio: 10, persone: 2 });
  assert.equal(t.distanza, 600);
  close(t.carburante, 72);
  close(t.totale, 72 + 40 + 10);
  close(t.perPersona, 61);
});

test('rimborso chilometrico', async () => {
  const { rimborsoChilometrico } = await import('../public/assets/js/calc.js');
  const r = rimborsoChilometrico({ km: 60, andataRitorno: true, trasferte: 4, tariffa: 0.5, extra: 3, costoReale: 0.4 });
  assert.equal(r.km, 480);
  close(r.chilometrico, 240);
  close(r.totale, 252);
  close(r.costoReale, 192);
  close(r.copertura, 1.25);
  assert.equal(rimborsoChilometrico({ km: 10, tariffa: 0.3 }).costoReale, null);
});
