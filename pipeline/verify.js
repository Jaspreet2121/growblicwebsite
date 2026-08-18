/* Headless verification of the scrub hero at desktop size.
   Probes the DOM (currentTime, band opacities) rather than pixels, and saves
   screenshots for layout review. */

const puppeteer = require('puppeteer-core');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new',
    args: ['--hide-scrollbars', '--force-device-scale-factor=1'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  const errors = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));

  await page.goto('http://localhost:3100', { waitUntil: 'networkidle0', timeout: 30000 });

  const ready = await page
    .waitForSelector('.stage.video-ready', { timeout: 15000 })
    .then(() => true)
    .catch(() => false);

  const meta = await page.evaluate(() => {
    const v = document.querySelector('.stage video');
    return {
      duration: v ? v.duration : null,
      stage: document.querySelector('.stage').className,
      gates: [
        '(max-width: 720px)',
        '(orientation: portrait) and (max-width: 1024px)',
        '(orientation: portrait) and (pointer: coarse)',
        '(orientation: landscape) and (pointer: coarse) and (max-height: 560px)',
        '(prefers-reduced-motion: reduce)',
      ].map((q) => matchMedia(q).matches),
    };
  });
  console.log('video-ready:', ready, JSON.stringify(meta));

  /* scrub to five positions and read back the engine state */
  const heroH = await page.evaluate(
    () => document.querySelector('.hero').offsetHeight - innerHeight
  );
  for (const p of [0, 0.28, 0.5, 0.72, 1]) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.round(heroH * p));
    await new Promise((r) => setTimeout(r, 1200));
    const state = await page.evaluate(() => {
      const v = document.querySelector('.stage video');
      const bands = [...document.querySelectorAll('.band')].map((b) =>
        Number(b.style.opacity || 0).toFixed(2)
      );
      return { t: v ? v.currentTime.toFixed(2) : null, bands: bands.join(' ') };
    });
    console.log(`p=${p} videoTime=${state.t} bands=[${state.bands}]`);
    await page.screenshot({
      path: path.join(__dirname, `verify-p${String(p).replace('.', '')}.png`),
    });
  }

  console.log('console errors:', errors.length ? errors : 'none');
  await browser.close();
})();
