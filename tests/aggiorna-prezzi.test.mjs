import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseCsv, dataEstrazione, impiantiAutostradali, calcolaMedie, applicaMedie } from '../scripts/aggiorna-prezzi.mjs';

// Dati di esempio nel formato dei CSV MIMIT (valori inventati solo per il test).
const PREZZI_PIPE = `Estrazione del 2026-09-30
idImpianto|descCarburante|prezzo|isSelf|dtComu
1|Benzina|2.100|1|30/09/2026 07:10:00
1|Benzina|2.250|0|30/09/2026 07:10:00
1|Gasolio|2.300|1|30/09/2026 07:10:00
2|Benzina|2.120|1|29/09/2026 18:00:00
2|GPL|0.740|0|29/09/2026 18:00:00
2|Metano|1.880|0|29/09/2026 18:00:00
3|Benzina|2.400|1|30/09/2026 06:00:00
3|Gasolio|2.500|1|30/09/2026 06:00:00
4|Benzina|9.999|1|30/09/2026 06:00:00
4|Blue Super|2.300|1|30/09/2026 06:00:00
5|Gasolio|2.320|1|30/09/2026 06:00:00
5|GPL|0.760|0|30/09/2026 06:00:00
5|Metano|1.900|0|30/09/2026 06:00:00`;

const ANAGRAFICA_PIPE = `Estrazione del 2026-09-30
idImpianto|Gestore|Bandiera|Tipo Impianto|Nome Impianto|Indirizzo|Comune|Provincia|Latitudine|Longitudine
1|ROSSI SRL|Agip Eni|Stradale|Eni|VIA ROMA, 1|MILANO|MI|45.4|9.1
2|BIANCHI|Pompe Bianche|Stradale|PB|VIA PO; 2|TORINO|TO|45.0|7.6
3|AUTOGRILL|Q8|Autostradale|A1 Nord|A1 KM 10|LODI|LO|45.3|9.5
4|VERDI|IP|Stradale|IP|VIA ETNA 4|CATANIA|CT|37.5|15.0
5|NERI|Tamoil|Altro|T|VIA PIAVE 5|ROMA|RM|41.9|12.5`;

const PREZZI_SEMI = PREZZI_PIPE.replaceAll('|', ';');

test('riconosce separatore, intestazione e data di estrazione', () => {
  for (const testo of [PREZZI_PIPE, PREZZI_SEMI]) {
    const p = parseCsv(testo);
    assert.equal(p.rows.length, 13);
    assert.equal(p.rows[0].desccarburante, 'Benzina');
    assert.equal(dataEstrazione(p.meta), '2026-09-30');
  }
});

test('anagrafica con separatori nei campi: individua gli impianti autostradali', () => {
  const set = impiantiAutostradali(parseCsv(ANAGRAFICA_PIPE));
  assert.deepEqual([...set], ['3']);
});

test('medie: rete stradale, self per benzina/gasolio, servito per GPL/metano, valori fuori scala esclusi', () => {
  const medie = calcolaMedie(parseCsv(PREZZI_PIPE), impiantiAutostradali(parseCsv(ANAGRAFICA_PIPE)));
  assert.deepEqual(medie.benzina, { media: 2.11, impianti: 2 }); // 2.100 e 2.120; esclusi autostrada (3), servito e 9.999
  assert.deepEqual(medie.diesel, { media: 2.31, impianti: 2 });
  assert.deepEqual(medie.gpl, { media: 0.75, impianti: 2 });
  assert.deepEqual(medie.metano, { media: 1.89, impianti: 2 });
});

const base = () => ({
  ultimo_aggiornamento: '2026-09-01',
  prezzi: {
    benzina: { valore: 2.0 }, diesel: { valore: 2.2 }, gpl: { valore: 0.7 }, metano: { valore: 1.8 },
    elettricita_casa: { valore: 0.43, riferimento: '2026-05-01' },
    elettricita_colonnina: { valore: 0.64, riferimento: '2026-08-31' },
  },
});
const medieOk = { benzina: { media: 2.111, impianti: 18000 }, diesel: { media: 2.316, impianti: 18000 }, gpl: { media: 0.742, impianti: 4000 }, metano: { media: 1.891, impianti: 1200 } };

test('applica le medie, aggiorna date e segnala i prezzi manuali vecchi', () => {
  const { json, cambiati, avvisi } = applicaMedie(base(), medieOk, { riferimento: '2026-09-30', oggi: '2026-10-01' });
  assert.equal(json.prezzi.benzina.valore, 2.111);
  assert.equal(json.prezzi.metano.riferimento, '2026-09-30');
  assert.equal(json.ultimo_aggiornamento, '2026-10-01');
  assert.equal(cambiati.length, 4);
  assert.equal(avvisi.length, 1); // ARERA vecchio di oltre 100 giorni, colonnine ancora valide
  assert.equal(json.prezzi.elettricita_casa.valore, 0.43); // i valori manuali non vengono toccati
});

test('rifiuta dati anomali o insufficienti senza modificare nulla', () => {
  assert.throws(() => applicaMedie(base(), { ...medieOk, benzina: { media: 3.5, impianti: 18000 } }, { riferimento: 'x', oggi: 'x' }), /variazione anomala/);
  assert.throws(() => applicaMedie(base(), { ...medieOk, gpl: { media: 0.74, impianti: 12 } }, { riferimento: 'x', oggi: 'x' }), /insufficienti/);
});
