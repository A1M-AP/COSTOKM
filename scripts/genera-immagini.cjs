/**
 * Rigenera public/og-image.png e public/apple-touch-icon.png dai modelli HTML in scripts/assets/.
 * Richiede Playwright (npx playwright o installazione globale): node scripts/genera-immagini.cjs
 */
const path = require('node:path');
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }
(async () => {
  const browser = await chromium.launch();
  const dir = path.join(__dirname, 'assets');
  for (const [file, out, w, h] of [['og-image.html', 'og-image.png', 1200, 630], ['apple-touch-icon.html', 'apple-touch-icon.png', 180, 180]]) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    await page.goto('file://' + path.join(dir, file));
    await page.screenshot({ path: path.join(__dirname, '..', 'public', out) });
    await page.close();
    console.log('✓ public/' + out);
  }
  await browser.close();
})();
