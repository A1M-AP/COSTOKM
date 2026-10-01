# costokm.it

Sito statico, veloce e mobile-first che calcola il **costo reale di possesso di un'auto** al km, al mese e all'anno, confronta fino a 3 veicoli e trova il punto di pareggio tra auto elettrica e termica.

- **Nessun backend**: tutti i calcoli avvengono nel browser.
- **Nessuna dipendenza npm**: serve solo Node.js ≥ 18 (consigliato 22) per generare le pagine.
- **Prestazioni**: HTML pre-renderizzato con i risultati già calcolati, CSS inline, grafici SVG scritti a mano (nessuna libreria), CLS 0. Lighthouse mobile misurato in locale: Performance 99–100, Accessibilità 100, Best practice 100, SEO 100.

## Pagine

| URL | Contenuto |
|---|---|
| `/` | Calcolatore principale "Quanto ti costa davvero la tua auto" (fino a 3 auto a confronto) |
| `/confronto-elettrica-benzina/` | Elettrica vs termica con chilometraggio annuo di pareggio e grafico |
| `/costo-carburante-viaggio/` | Costo carburante/energia di un singolo tragitto, con pedaggi e quota a persona |
| `/costo-auto-neopatentati/` | Calcolatore principale con valori di partenza tipici della prima auto |
| `/chi-siamo/`, `/contatti/`, `/privacy-policy/`, `/cookie-policy/`, `/note-legali/` | Pagine istituzionali |

Generati automaticamente: `sitemap.xml`, `robots.txt`, `404.html`, canonici, Open Graph, dati strutturati (`WebSite`, `WebApplication`, `BreadcrumbList`, `FAQPage`).

## Avvio rapido

```bash
npm run dev       # genera dist/ e avvia http://localhost:8080 con ricostruzione automatica
npm run build     # genera solo la cartella dist/
npm run preview   # genera e serve dist/ senza watch
npm test          # test delle formule (node --test)
```

Non serve `npm install`: il progetto non ha dipendenze. Al termine del build vengono elencati gli elementi ancora **da completare** (prezzi, URL di affiliazione, dati del titolare).

## Struttura del progetto

```
config/site.config.json     ← UNICO file di configurazione (affiliazioni, pubblicità, statistiche, consenso, dati titolare)
public/data/prezzi.json     ← prezzi medi di carburanti ed energia (aggiornabili a mano)
public/assets/js/
  calc.js                   ← formule (funzioni pure, testate)
  defaults.js               ← valori predefiniti indicativi dei calcolatori
  calcolatore.js            ← calcolatore principale (home e neopatentati)
  confronto.js / confronto-core.js
  viaggio.js / viaggio-core.js
  charts.js                 ← ciambella, barre impilate, linee (SVG)
  testi.js, ui.js           ← testi dei risultati, formattazione, copia/stampa/condividi
  site.js                   ← menu, banner cookie, caricamento pubblicità/statistiche dopo il consenso
public/_headers             ← intestazioni HTTP (Netlify e Cloudflare Pages)
src/pages/*.mjs             ← una pagina per file: meta SEO, testo, FAQ
src/layout.mjs              ← head, header, footer, banner cookie
src/components.mjs          ← campi, box affiliazione, spazi pubblicitari, FAQ
src/calculator.mjs          ← markup del calcolatore principale
src/styles/style.css        ← stile unico (minificato e inserito inline al build)
build.mjs                   ← generatore statico (zero dipendenze) → dist/
scripts/serve.mjs           ← server di sviluppo
scripts/genera-immagini.cjs ← rigenera og-image.png e apple-touch-icon.png (richiede Playwright)
tests/calc.test.mjs         ← test delle formule
```

## Prezzi di carburanti ed energia

### Carburanti: aggiornamento automatico ogni giorno
L'azione GitHub `.github/workflows/aggiorna-prezzi.yml` parte ogni giorno alle 9:17 UTC (e a mano da *Actions → Aggiorna prezzi carburanti → Run workflow*):

1. scarica i dati aperti del MIMIT (`prezzo_alle_8.csv` e `anagrafica_impianti_attivi.csv`, [dataset](https://www.mimit.gov.it/it/open-data/elenco-dataset/carburanti-prezzi-praticati-e-anagrafica-degli-impianti));
2. con `scripts/aggiorna-prezzi.mjs` calcola la media nazionale della rete stradale (benzina e gasolio *self*, GPL e metano *servito*, come le medie ufficiali MIMIT), escludendo autostrade e valori fuori scala;
3. esegue test e build, poi fa un commit di `public/data/prezzi.json` su `main`: Cloudflare ripubblica il sito da solo.

Protezioni: se i dati mancano, sono troppo pochi o cambiano più del 25% rispetto al giorno prima, l'aggiornamento si ferma senza toccare il file (il sito continua a mostrare gli ultimi valori validi con la loro data) e GitHub ti avvisa via e-mail del fallimento.

Prova locale senza scrivere: `node scripts/aggiorna-prezzi.mjs --dry-run`.

### Energia elettrica: aggiornamento manuale
Per energia domestica e colonnine non esistono dati aperti scaricabili; lo script segnala nel log quando sono vecchi.

| Voce | Valore attuale | Fonte | Frequenza |
|---|---|---|---|
| Energia domestica | 0,4343 €/kWh | ARERA, cliente tipo vulnerabile in maggior tutela, tasse incluse | trimestrale (1° gen/apr/lug/ott) |
| Colonnine (AC) | 0,64 €/kWh | Osservatorio Adiconsum–TariffEV | mensile |

In `public/data/prezzi.json` aggiorna `valore` (punto come separatore decimale), `riferimento` (data del dato) e `nota`. Valore `null` = il sito mostra "DA AGGIORNARE CON DATI UFFICIALI" e chiede il prezzo all'utente.

## Inserire i link di affiliazione

Tutto si configura in `config/site.config.json`, sezione `affiliazioni`:

```json
"assicurazione": {
  "attivo": true,
  "titolo": "L'assicurazione pesa troppo?",
  "testo": "Confronta i preventivi RC auto…",
  "cta": "Confronta i preventivi RC auto",
  "url": "https://www.partner.it/?aff=TUO_ID",
  "partner": "Nome comparatore"
}
```

- `assicurazione` appare accanto all'assicurazione nel calcolatore e nella pagina viaggio; `noleggio` accanto all'acquisto e nella pagina di confronto.
- Finché `url` non inizia con `http`, il build lo segnala; il box resta visibile ma il link non porta da nessuna parte. Imposta `"attivo": false` per nasconderlo.
- I link hanno `rel="sponsored noopener"`, l'etichetta "Link affiliato" e la `disclosure` (testo modificabile) subito sotto, che dichiara anche che il sito non fornisce consulenza né intermediazione assicurativa o finanziaria. La stessa informativa è nel footer e nelle note legali.

## Pubblicità

Sezione `pubblicita` di `config/site.config.json`:

- `mostraSegnaposto: true` mostra i riquadri "Spazio pubblicitario" (utile in sviluppo). Senza annunci attivi, impostalo a `false` per non mostrare riquadri vuoti.
- Per Google AdSense: `"attiva": true`, `adsenseClient` = `ca-pub-…` e gli ID delle unità in `slot` (`dopo-calcolatore`, `articolo`, `laterale`).
- Gli spazi hanno **dimensioni fisse riservate** (CLS zero): mobile 100% × 280 px; desktop 100% × 120 px dopo il calcolatore, 336 × 280 nell'articolo, 300 × 600 laterale (solo desktop). Crea in AdSense unità di dimensioni compatibili (o responsive con altezza limitata dal contenitore).
- Lo script AdSense viene caricato **solo dopo il consenso** alla categoria Pubblicità.
- ⚠️ Per servire annunci Google a utenti nello Spazio economico europeo Google richiede una **CMP certificata IAB TCF**. Il banner incluso blocca correttamente gli script prima del consenso (conforme alle linee guida del Garante), ma non è una CMP certificata TCF: prima di attivare AdSense valuta di integrarne una (es. la CMP di Google "Privacy e messaggi") e adegua la cookie policy.

## Statistiche (facoltative)

Inserisci l'ID GA4 in `statistiche.ga4Id`: lo script viene caricato solo dopo il consenso alla categoria Statistiche. Lasciandolo vuoto non viene caricato nulla.

## Cookie e privacy

Privacy policy e cookie policy sono **generate dalla configurazione**: elencano solo i servizi realmente attivi (hosting, Google Analytics, Google AdSense) e si aggiornano da sole al build.

- **Il banner cookie compare solo se è attivo almeno un servizio non tecnico** (`statistiche.ga4Id` valorizzato oppure `pubblicita.attiva` con `adsenseClient`). Con i soli strumenti tecnici il consenso non è dovuto (linee guida del Garante), quindi oggi il banner non viene mostrato e la cookie policy lo dichiara. Appena attivi annunci o statistiche, banner, link "Preferenze cookie" e policy compaiono automaticamente.
- Banner con **Accetta** e **Rifiuta** di pari evidenza, **Personalizza** per categoria (solo quelle attive), la **X** equivale al rifiuto; nessuno script non tecnico prima del consenso.
- `sito.hosting`: `"netlify"` o `"cloudflare"`, il fornitore indicato nella privacy policy (con Cloudflare viene citato anche l'eventuale cookie di sicurezza `__cf_bm`).
- La scelta è salvata nel browser per `consensoCookie.durataMesi` (6 mesi); incrementa `consensoCookie.versione` quando aggiungi nuovi servizi, così il banner viene riproposto a tutti.
- "Preferenze cookie" nel footer (e nella cookie policy) permette di modificare o revocare il consenso.
- Completa i campi `sito.titolare`, `sito.indirizzoTitolare`, `sito.partitaIva`, `sito.emailContatto`: compaiono nelle policy e nelle note legali. È comunque consigliata una revisione finale da parte di un professionista.

## Pubblicare il sito

### Netlify
1. Carica il repository su GitHub/GitLab.
2. Su Netlify: *Add new site → Import an existing project* e scegli il repository.
3. Le impostazioni sono già in `netlify.toml` (build `node build.mjs`, cartella `dist`, Node 22).
4. *Domain management*: aggiungi `costokm.it` e segui le istruzioni DNS. HTTPS è automatico.

### Cloudflare Workers (hosting attuale)
La configurazione è in `wrangler.jsonc`: `npx wrangler deploy` esegue prima il build (`node build.mjs`) e poi pubblica la cartella `dist/` come sito statico (nessun codice server).
1. *Workers & Pages → Create → Import a repository* e scegli il repository.
2. Lascia **Build command** vuoto e **Deploy command** `npx wrangler deploy` (il build parte da solo grazie a `wrangler.jsonc`).
3. Il nome del Worker nella dashboard deve coincidere con `"name"` in `wrangler.jsonc` (`costokm`): se l'hai chiamato diversamente, cambia uno dei due.
4. *Settings → Domains & Routes*: aggiungi `costokm.it` (e `www.costokm.it` se vuoi).

### Cloudflare Pages (alternativa)
Framework preset *None*; Build command `node build.mjs`; Build output directory `dist`.

Le intestazioni HTTP (sicurezza e cache) sono in `public/_headers`, valido per entrambe le piattaforme. Dopo la pubblicazione invia `https://costokm.it/sitemap.xml` a Google Search Console e Bing Webmaster Tools.

### Checklist prima di andare online
- [x] Prezzi carburanti automatici; energia aggiornata al IV trimestre 2026
- [ ] URL di affiliazione in `config/site.config.json`
- [ ] `pubblicita.mostraSegnaposto` a `false` se gli annunci non sono ancora attivi
- [ ] P.IVA e indirizzo solo se esistono (campi facoltativi `sito.partitaIva`, `sito.indirizzoTitolare`)
- [ ] `npm test` e `npm run build` senza avvisi

## Formule usate

- Svalutazione annua = (prezzo d'acquisto − valore residuo) ÷ anni di possesso. Con la percentuale annua il valore residuo è prezzo × (1 − p)^anni.
- Interessi: rata alla francese da importo, TAN e durata; interessi totali = rate pagate − importo. Sono ripartiti sugli anni del finanziamento; nel costo annuo medio si conteggiano quelli che cadono nel periodo di possesso (se il possesso è più lungo del prestito, il totale si distribuisce sull'intero possesso).
- Carburante annuo = km annui ÷ 100 × consumo × prezzo. Elettrica: prezzo medio = % casa × prezzo casa + % colonnina × prezzo colonnina.
- Pneumatici annui = costo treno × km annui ÷ durata in km.
- Costo totale annuo = somma delle voci; costo al km = totale ÷ km annui; mensile = totale ÷ 12; periodo = totale × anni.
- Pareggio elettrica/termica: costo annuo = fisso + variabile × km; km di pareggio = (fisso elettrica − fisso termica) ÷ (variabile termica − variabile elettrica).

I valori predefiniti dei calcolatori (`public/assets/js/defaults.js`) sono **esempi indicativi** modificabili dall'utente, non medie ufficiali.

## Funzioni del calcolatore

- Risultati in tempo reale, validazione dei campi con messaggi accessibili.
- **Copia risultato** (testo riassuntivo), **Stampa** (layout dedicato con dati inseriti), **Condividi** (menu nativo su mobile, altrimenti copia un link con tutti i parametri nell'URL che ricarica lo stesso calcolo).
- Accessibilità: etichette su tutti i campi, schede veicolo con pattern ARIA e frecce da tastiera, grafici con tabella equivalente, contrasti AA, focus visibile, link "Vai al contenuto".
