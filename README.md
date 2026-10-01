# costokm.it

Sito statico, veloce e mobile-first che calcola il **costo reale di possesso di un'auto** al km, al mese e all'anno, confronta fino a 3 veicoli e trova il punto di pareggio tra auto elettrica e termica.

- **Nessun backend**: tutti i calcoli avvengono nel browser.
- **Nessuna dipendenza npm**: serve solo Node.js ≥ 18 (consigliato 20) per generare le pagine.
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

## Aggiornare i prezzi di carburanti ed energia

I prezzi medi **non sono inventati**: finché non li inserisci, `public/data/prezzi.json` contiene `null` e il sito mostra "DA AGGIORNARE CON DATI UFFICIALI", chiedendo all'utente di inserire il proprio prezzo.

1. Apri `public/data/prezzi.json`.
2. Per ogni voce inserisci il numero nel campo `valore`, con il **punto** come separatore decimale (es. `1.789`):
   - `benzina`, `diesel`, `gpl` (€/l) e `metano` (€/kg): prezzi medi nazionali pubblicati dal **Ministero delle Imprese e del Made in Italy (MIMIT)** – <https://www.mimit.gov.it/it/prezzo-medio-carburanti>;
   - `elettricita_casa` e `elettricita_colonnina` (€/kWh): il MIMIT non li pubblica; usa una fonte ufficiale o verificabile (es. dati ARERA per l'energia domestica, comprensivi di oneri e imposte; tariffe medie degli operatori di ricarica per le colonnine) e annotala nel campo `nota`.
3. Imposta `ultimo_aggiornamento` nel formato `AAAA-MM-GG` (es. `"2026-10-01"`): la data viene mostrata accanto ai calcolatori.
4. Puoi aggiornare `stato` (es. `"Aggiornato"`) e le note.
5. Esegui `npm run build` (o fai push: Netlify/Cloudflare ricostruiscono da soli).

Il file viene letto dal browser a runtime (`/data/prezzi.json`, mai in cache) **e** al build, per precompilare l'HTML senza spostamenti del layout. Per questo, dopo ogni modifica, ripubblica il sito.

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

- Banner con **Accetta** e **Rifiuta** di pari evidenza, **Personalizza** per categoria, la **X** equivale al rifiuto; nessuno script non tecnico prima del consenso.
- La scelta è salvata nel browser per `consensoCookie.durataMesi` (6 mesi); incrementa `consensoCookie.versione` quando aggiungi nuovi servizi, così il banner viene riproposto a tutti.
- "Preferenze cookie" nel footer (e nella cookie policy) permette di modificare o revocare il consenso.
- Completa i campi `sito.titolare`, `sito.indirizzoTitolare`, `sito.partitaIva`, `sito.emailContatto` e rivedi i testi segnati `[DA COMPLETARE]` in privacy e cookie policy (fornitore di hosting, servizi realmente attivi). È consigliata una verifica da parte di un professionista.

## Pubblicare il sito

### Netlify
1. Carica il repository su GitHub/GitLab.
2. Su Netlify: *Add new site → Import an existing project* e scegli il repository.
3. Le impostazioni sono già in `netlify.toml` (build `node build.mjs`, cartella `dist`, Node 20).
4. *Domain management*: aggiungi `costokm.it` e segui le istruzioni DNS. HTTPS è automatico.

### Cloudflare Pages
1. *Workers & Pages → Create → Pages → Connect to Git* e scegli il repository.
2. Framework preset: *None*; Build command: `node build.mjs`; Build output directory: `dist`.
3. Variabile d'ambiente `NODE_VERSION` = `20` (se necessario).
4. *Custom domains*: aggiungi `costokm.it`.

Le intestazioni HTTP (sicurezza e cache) sono in `public/_headers`, valido per entrambe le piattaforme. Dopo la pubblicazione invia `https://costokm.it/sitemap.xml` a Google Search Console e Bing Webmaster Tools.

### Checklist prima di andare online
- [ ] Prezzi e data aggiornati in `public/data/prezzi.json`
- [ ] URL di affiliazione in `config/site.config.json`
- [ ] Dati del titolare ed e-mail di contatto
- [ ] `pubblicita.mostraSegnaposto` a `false` se gli annunci non sono ancora attivi
- [ ] Testi di privacy e cookie policy rivisti
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
