/**
 * Grafici SVG scritti a mano (nessuna libreria): ciambella, barre impilate, linee.
 * Colori: classi .s1….s8 definite nel CSS (palette categoriale a ordine fisso).
 */
import { euro, num, pct, escHtml } from './ui.js';

const NS = 'http://www.w3.org/2000/svg';
const fmt = (n) => Math.round(n * 100) / 100;

/* ---------- Tooltip condiviso ---------- */
let tip;
function tooltip() {
  if (!tip) {
    tip = document.createElement('div');
    tip.className = 'chart-tip';
    tip.hidden = true;
    tip.setAttribute('aria-hidden', 'true');
    document.body.appendChild(tip);
  }
  return tip;
}
function showTip(html, x, y) {
  const t = tooltip();
  t.innerHTML = html;
  t.hidden = false;
  const w = t.offsetWidth;
  const h = t.offsetHeight;
  const left = Math.min(window.innerWidth - w - 8, Math.max(8, x + 14));
  const top = y - h - 12 < 8 ? y + 16 : y - h - 12;
  t.style.left = left + 'px';
  t.style.top = top + 'px';
}
const hideTip = () => { if (tip) tip.hidden = true; };

/** Tooltip sugli elementi con data-tip (hover del mouse o tocco). */
function bindTips(svg) {
  svg.addEventListener('pointermove', (e) => {
    const t = e.target.closest('[data-tip]');
    if (t) showTip(t.getAttribute('data-tip'), e.clientX, e.clientY);
    else hideTip();
  });
  svg.addEventListener('pointerleave', hideTip);
}

/* ---------- Ciambella ---------- */
function sector(cx, cy, R, r, a0, a1) {
  const p = (rad, a) => `${fmt(cx + rad * Math.sin(a))} ${fmt(cy - rad * Math.cos(a))}`;
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M${p(R, a0)}A${R} ${R} 0 ${large} 1 ${p(R, a1)}L${p(r, a1)}A${r} ${r} 0 ${large} 0 ${p(r, a0)}Z`;
}

/**
 * @param {HTMLElement} el
 * @param {{label:string, value:number, slot:number}[]} items
 * @param {{value:string, label:string}} center
 */
export function donut(el, items, center) {
  el.innerHTML = donutSvg(items, center);
  bindTips(el.firstChild);
}

/** SVG della ciambella come stringa (usato anche dal build per il pre-rendering). */
export function donutSvg(items, center) {
  const total = items.reduce((a, b) => a + Math.max(0, b.value), 0);
  const cx = 100, cy = 100, R = 96, r = 64;
  let out = '';
  if (total <= 0) {
    out = `<circle cx="${cx}" cy="${cy}" r="${(R + r) / 2}" fill="none" stroke="#e3e8ec" stroke-width="${R - r}"/>`;
  } else {
    const visible = items.filter((i) => i.value > 0);
    if (visible.length === 1) {
      const i = visible[0];
      out = `<path class="seg-arc s${i.slot}" fill-rule="evenodd" d="M${cx} ${cy - R}a${R} ${R} 0 1 0 0.01 0ZM${cx} ${cy - r}a${r} ${r} 0 1 0 0.01 0Z" data-tip="${escHtml(i.label)}: ${euro(i.value)} (100%)"/>`;
    } else {
      const gap = 2 / ((R + r) / 2); // 2px di spazio tra i segmenti
      let a = 0;
      for (const i of visible) {
        const span = (i.value / total) * Math.PI * 2;
        const a0 = a + (span > gap ? gap / 2 : 0);
        const a1 = a + span - (span > gap ? gap / 2 : 0);
        out += `<path class="seg-arc s${i.slot}" d="${sector(cx, cy, R, r, a0, a1)}" data-tip="${escHtml(i.label)}: ${euro(i.value)}/anno (${pct(i.value / total)})"/>`;
        a += span;
      }
    }
  }
  out += `<text x="${cx}" y="${cy + 2}" text-anchor="middle" class="donut-center-v">${escHtml(center.value)}</text>`;
  out += `<text x="${cx}" y="${cy + 20}" text-anchor="middle" class="donut-center-l">${escHtml(center.label)}</text>`;
  return `<svg viewBox="0 0 200 200" xmlns="${NS}" aria-hidden="true" focusable="false">${out}</svg>`;
}

/* ---------- Scala "pulita" per gli assi ---------- */
function niceStep(max, ticks = 4) {
  if (max <= 0) return 1;
  const raw = max / ticks;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag;
  const step = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10;
  return step * mag;
}

/** Rettangolo con angoli arrotondati solo sul lato destro (estremità del dato). */
function rightRounded(x, y, w, h, rad) {
  const r = Math.min(rad, w, h / 2);
  return `M${fmt(x)} ${fmt(y)}H${fmt(x + w - r)}Q${fmt(x + w)} ${fmt(y)} ${fmt(x + w)} ${fmt(y + r)}V${fmt(y + h - r)}Q${fmt(x + w)} ${fmt(y + h)} ${fmt(x + w - r)} ${fmt(y + h)}H${fmt(x)}Z`;
}

/* ---------- Barre orizzontali impilate ---------- */
/**
 * @param {HTMLElement} el
 * @param {{nome:string, voci:Record<string,number>, totale:number}[]} rows
 * @param {{id:string,label:string}[]} categorie
 */
export function stackedBars(el, rows, categorie) {
  const W = Math.max(280, Math.round(el.clientWidth || 560));
  const padL = 2, padR = 74, barH = 22, rowH = 58, top = 6;
  const max = Math.max(1, ...rows.map((r) => r.totale));
  const step = niceStep(max);
  const xMax = Math.ceil(max / step) * step;
  const plotW = W - padL - padR;
  const x = (v) => padL + (v / xMax) * plotW;
  const H = top + rows.length * rowH + 22;
  let g = '';
  for (let t = 0; t <= xMax + 1e-9; t += step) {
    g += `<line class="chart-grid" x1="${fmt(x(t))}" x2="${fmt(x(t))}" y1="${top}" y2="${H - 20}"/>`;
    g += `<text class="chart-axis" x="${fmt(x(t))}" y="${H - 6}" text-anchor="${t === 0 ? 'start' : 'middle'}">${num(t)} €</text>`;
  }
  rows.forEach((row, ri) => {
    const y0 = top + ri * rowH;
    const yb = y0 + 22;
    g += `<text class="chart-label-strong" x="${padL}" y="${y0 + 14}">${escHtml(row.nome)}</text>`;
    let acc = 0;
    const segs = categorie.map((c, ci) => ({ c, ci, v: row.voci[c.id] || 0 })).filter((s) => s.v > 0);
    segs.forEach((s, si) => {
      const xs = x(acc);
      const w = x(acc + s.v) - xs;
      acc += s.v;
      const last = si === segs.length - 1;
      const wDraw = Math.max(0.5, last ? w : w - 2); // 2px di spazio tra i segmenti
      const tipTxt = `${escHtml(row.nome)} – ${escHtml(s.c.label)}: ${euro(s.v)}/anno (${pct(s.v / row.totale)})`;
      g += last
        ? `<path class="bar-seg s${s.ci + 1}" d="${rightRounded(xs, yb, wDraw, barH, 4)}" data-tip="${tipTxt}"/>`
        : `<rect class="bar-seg s${s.ci + 1}" x="${fmt(xs)}" y="${yb}" width="${fmt(wDraw)}" height="${barH}" data-tip="${tipTxt}"/>`;
    });
    g += `<text class="chart-label-strong" x="${fmt(x(row.totale) + 6)}" y="${yb + 15}">${euro(row.totale)}</text>`;
  });
  const legend = categorie
    .map((c, i) => ({ c, i }))
    .filter(({ c }) => rows.some((r) => (r.voci[c.id] || 0) > 0))
    .map(({ c, i }) => `<li><span class="sw s${i + 1}" aria-hidden="true"></span>${escHtml(c.label)}</li>`)
    .join('');
  el.innerHTML = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="${NS}" aria-hidden="true" focusable="false">${g}</svg><ul class="legend">${legend}</ul>`;
  bindTips(el.firstChild);
}

/* ---------- Grafico a linee (costo annuo in funzione dei km) ---------- */
/**
 * @param {HTMLElement} el
 * @param {{nome:string, slot:number, f:(km:number)=>number}[]} series
 * @param {{xMax:number, pareggio?:number|null, kmUtente?:number}} opt
 */
export function lineChart(el, series, opt) {
  const W = Math.max(280, Math.round(el.clientWidth || 560));
  const H = 260;
  const padL = 54, padR = 16, padT = 14, padB = 34;
  const xMax = opt.xMax;
  const yMaxRaw = Math.max(1, ...series.map((s) => Math.max(s.f(0), s.f(xMax))));
  const yStep = niceStep(yMaxRaw);
  const yMax = Math.ceil(yMaxRaw / yStep) * yStep;
  const xStep = niceStep(xMax, 4);
  const X = (v) => padL + (v / xMax) * (W - padL - padR);
  const Y = (v) => padT + (1 - v / yMax) * (H - padT - padB);
  let g = '';
  for (let t = 0; t <= yMax + 1e-9; t += yStep) {
    g += `<line class="chart-grid" x1="${padL}" x2="${W - padR}" y1="${fmt(Y(t))}" y2="${fmt(Y(t))}"/>`;
    g += `<text class="chart-axis" x="${padL - 6}" y="${fmt(Y(t) + 4)}" text-anchor="end">${t >= 1000 ? num(t / 1000, 1) + ' k€' : num(t) + ' €'}</text>`;
  }
  for (let t = 0; t <= xMax + 1e-9; t += xStep) {
    g += `<text class="chart-axis" x="${fmt(X(t))}" y="${H - padB + 16}" text-anchor="middle">${num(t / 1000, 1)}k</text>`;
  }
  g += `<text class="chart-axis" x="${W - padR}" y="${H - 4}" text-anchor="end">km all’anno</text>`;
  if (opt.kmUtente > 0 && opt.kmUtente <= xMax) {
    g += `<line x1="${fmt(X(opt.kmUtente))}" x2="${fmt(X(opt.kmUtente))}" y1="${padT}" y2="${H - padB}" stroke="#8a99a6" stroke-width="1"/>`;
    g += `<text class="chart-axis" x="${fmt(X(opt.kmUtente) + 4)}" y="${padT + 10}">i tuoi km</text>`;
  }
  for (const s of series) {
    g += `<line x1="${fmt(X(0))}" y1="${fmt(Y(s.f(0)))}" x2="${fmt(X(xMax))}" y2="${fmt(Y(s.f(xMax)))}" stroke="var(--c${s.slot})" stroke-width="2" stroke-linecap="round"/>`;
  }
  if (opt.pareggio && opt.pareggio > 0 && opt.pareggio <= xMax) {
    const px = X(opt.pareggio);
    const py = Y(series[0].f(opt.pareggio));
    g += `<circle cx="${fmt(px)}" cy="${fmt(py)}" r="6" fill="var(--ink)" stroke="#fff" stroke-width="2"/>`;
    const anchor = px > W * 0.6 ? 'end' : 'start';
    g += `<text class="chart-label-strong" x="${fmt(px + (anchor === 'end' ? -10 : 10))}" y="${fmt(py - 10)}" text-anchor="${anchor}">Pareggio: ${num(Math.round(opt.pareggio / 100) * 100)} km</text>`;
  }
  g += `<line class="hover-line" x1="0" x2="0" y1="${padT}" y2="${H - padB}" stroke="#13212c" stroke-width="1" opacity="0"/>`;
  g += `<rect class="hover-capture" x="${padL}" y="${padT}" width="${W - padL - padR}" height="${H - padT - padB}" fill="transparent"/>`;
  const legend = series.map((s) => `<li><span class="sw s${s.slot}" aria-hidden="true"></span>${escHtml(s.nome)}</li>`).join('');
  el.innerHTML = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="${NS}" aria-hidden="true" focusable="false">${g}</svg><ul class="legend">${legend}</ul>`;

  const svg = el.firstChild;
  const hl = svg.querySelector('.hover-line');
  const cap = svg.querySelector('.hover-capture');
  cap.addEventListener('pointermove', (e) => {
    const rect = svg.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const km = Math.max(0, Math.min(xMax, ((px - padL) / (W - padL - padR)) * xMax));
    const kmR = Math.round(km / 100) * 100;
    hl.setAttribute('x1', fmt(X(kmR)));
    hl.setAttribute('x2', fmt(X(kmR)));
    hl.setAttribute('opacity', '0.4');
    showTip(`<strong>${num(kmR)} km/anno</strong><br>${series.map((s) => `${escHtml(s.nome)}: ${euro(s.f(kmR))}/anno`).join('<br>')}`, e.clientX, e.clientY);
  });
  cap.addEventListener('pointerleave', () => { hl.setAttribute('opacity', '0'); hideTip(); });
}

/** Ridisegna su resize (solo cambi di larghezza). */
export function onResize(fn) {
  let w = window.innerWidth;
  let t;
  window.addEventListener('resize', () => {
    if (window.innerWidth === w) return;
    w = window.innerWidth;
    clearTimeout(t);
    t = setTimeout(fn, 120);
  });
}
