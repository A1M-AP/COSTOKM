/*
 * costokm.it — script comune a tutte le pagine:
 *  - menu di navigazione mobile
 *  - gestione del consenso cookie (Garante Privacy, linee guida 10 giugno 2021):
 *    nessuno script non tecnico viene caricato prima del consenso;
 *    "Accetta" e "Rifiuta" hanno la stessa evidenza; la X equivale a rifiutare;
 *    la scelta viene ricordata e riproposta dopo `durataMesi` o se cambia `versione`.
 *  - caricamento di pubblicità e statistiche SOLO dopo il consenso.
 */
(function () {
  'use strict';

  var cfgEl = document.getElementById('site-config');
  var cfg = {};
  try { cfg = JSON.parse(cfgEl ? cfgEl.textContent : '{}'); } catch (e) { cfg = {}; }
  var consensoCfg = cfg.consenso || { versione: 1, durataMesi: 6 };
  var KEY = 'costokm_consenso';

  /* ---------- Menu mobile ---------- */
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('menu-principale');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* ---------- Tema: automatico → chiaro → scuro ---------- */
  var TEMA = 'costokm_tema';
  var NOMI = { auto: 'automatico', light: 'chiaro', dark: 'scuro' };
  var temaBtn = document.querySelector('[data-theme-toggle]');
  function applicaTema(t) {
    if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t);
    else document.documentElement.removeAttribute('data-theme');
    if (temaBtn) {
      temaBtn.setAttribute('aria-label', 'Tema: ' + NOMI[t] + '. Cambia tema');
      temaBtn.setAttribute('title', 'Tema: ' + NOMI[t]);
    }
  }
  if (temaBtn) {
    var temaCorrente = document.documentElement.getAttribute('data-theme') || 'auto';
    applicaTema(temaCorrente);
    temaBtn.addEventListener('click', function () {
      temaCorrente = temaCorrente === 'auto' ? 'light' : temaCorrente === 'light' ? 'dark' : 'auto';
      applicaTema(temaCorrente);
      try {
        if (temaCorrente === 'auto') localStorage.removeItem(TEMA);
        else localStorage.setItem(TEMA, temaCorrente);
      } catch (e) { /* storage non disponibile */ }
    });
  }

  /* ---------- Consenso ---------- */
  function leggiConsenso() {
    try {
      var c = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (!c || c.v !== consensoCfg.versione) return null;
      var scadenza = c.ts + consensoCfg.durataMesi * 30.44 * 24 * 3600 * 1000;
      if (Date.now() > scadenza) return null;
      return c;
    } catch (e) {
      return null;
    }
  }

  function salvaConsenso(statistiche, pubblicita) {
    var precedente = leggiConsenso();
    var c = { v: consensoCfg.versione, ts: Date.now(), statistiche: !!statistiche, pubblicita: !!pubblicita };
    try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) { /* storage non disponibile */ }
    nascondiBanner();
    // Revoca di un consenso già dato: ricarichiamo per scaricare gli script di terze parti.
    if (precedente && ((precedente.statistiche && !c.statistiche) || (precedente.pubblicita && !c.pubblicita))) {
      location.reload();
      return;
    }
    applica(c);
  }

  var banner = document.getElementById('cookie-banner');
  var prefs = document.getElementById('cookie-prefs');
  var chkStat = document.getElementById('consent-statistiche');
  var chkPub = document.getElementById('consent-pubblicita');
  var btnCustomize = banner && banner.querySelector('[data-consent="customize"]');
  var btnSave = banner && banner.querySelector('[data-consent="save"]');
  var lastFocus = null;

  function mostraBanner(conPreferenze) {
    if (!banner) return;
    var c = leggiConsenso();
    if (chkStat) chkStat.checked = !!(c && c.statistiche);
    if (chkPub) chkPub.checked = !!(c && c.pubblicita);
    mostraPreferenze(!!conPreferenze);
    banner.hidden = false;
  }
  function nascondiBanner() {
    if (banner) banner.hidden = true;
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
    lastFocus = null;
  }
  function mostraPreferenze(on) {
    prefs.hidden = !on;
    btnSave.hidden = !on;
    btnCustomize.hidden = on;
    btnCustomize.setAttribute('aria-expanded', on ? 'true' : 'false');
  }

  if (banner) {
    banner.addEventListener('click', function (e) {
      var b = e.target.closest('[data-consent]');
      if (!b) return;
      var azione = b.getAttribute('data-consent');
      if (azione === 'accept') salvaConsenso(true, true);
      else if (azione === 'reject') salvaConsenso(false, false);
      else if (azione === 'customize') { mostraPreferenze(true); (chkStat || chkPub).focus(); }
      else if (azione === 'save') salvaConsenso(!!(chkStat && chkStat.checked), !!(chkPub && chkPub.checked));
    });
    banner.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lastFocus) nascondiBanner(); // solo se aperto dal footer
    });
  }

  document.querySelectorAll('[data-cookie-settings]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (!banner) return;
      lastFocus = b;
      mostraBanner(true);
      var first = chkStat || chkPub;
      if (first) first.focus();
    });
  });

  /* ---------- Script di terze parti (solo dopo consenso) ---------- */
  var caricati = {};
  function caricaScript(src, attrs) {
    if (caricati[src]) return;
    caricati[src] = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = src;
    if (attrs) for (var k in attrs) s.setAttribute(k, attrs[k]);
    document.head.appendChild(s);
  }

  function applica(c) {
    if (!c) return;
    if (c.statistiche && cfg.ga4Id) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', cfg.ga4Id);
      caricaScript('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(cfg.ga4Id));
    }
    if (c.pubblicita && cfg.ads && cfg.ads.attiva && cfg.ads.client) {
      var slots = document.querySelectorAll('.ad[data-ad-slot]');
      var daRiempire = [];
      slots.forEach(function (el) {
        var slot = el.getAttribute('data-ad-slot');
        if (!slot || el.querySelector('ins') || el.offsetParent === null) return;
        var ins = document.createElement('ins');
        ins.className = 'adsbygoogle';
        ins.setAttribute('data-ad-client', cfg.ads.client);
        ins.setAttribute('data-ad-slot', slot);
        el.appendChild(ins);
        daRiempire.push(ins);
      });
      if (daRiempire.length) {
        caricaScript('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + encodeURIComponent(cfg.ads.client), { crossorigin: 'anonymous' });
        window.adsbygoogle = window.adsbygoogle || [];
        daRiempire.forEach(function () { window.adsbygoogle.push({}); });
      }
    }
  }

  // Nessun servizio non tecnico configurato: niente banner e niente script di terze parti.
  if (!banner || !(cfg.categorie && cfg.categorie.length)) return;
  var consenso = leggiConsenso();
  if (consenso) applica(consenso);
  else mostraBanner(false);
})();
