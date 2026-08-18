/* The Phase 9 audit battery, run in real headless Chrome:
   1. flick test on the hero beat map
   2. static-hero gates under touch emulation at phone size
   3. reduced-motion emulation: no video request, final states
   4. video URL blocked: page still complete
   5. worst-frame legibility: hide glyphs, sample lightest pixel under text zones
   6. phone-width console check */

const puppeteer = require('puppeteer-core');
const path = require('path');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const URL_ = 'http://localhost:3100';

async function launch() {
  return puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--hide-scrollbars', '--force-device-scale-factor=1'],
  });
}

(async () => {
  /* ---- 1. flick test ---- */
  {
    const browser = await launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(URL_, { waitUntil: 'networkidle0' });
    await page.waitForSelector('.stage.video-ready', { timeout: 15000 }).catch(() => {});
    await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
    for (const step of [120, 240, 360]) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await new Promise((r) => setTimeout(r, 600));
      const heroH = await page.evaluate(
        () => document.querySelector('.hero').offsetHeight - innerHeight
      );
      const count = Math.ceil(heroH / step) + 2;
      const seen = [0, 0, 0, 0, 0];
      const maxOp = [0, 0, 0, 0, 0];
      for (let i = 0; i < count; i++) {
        await page.evaluate((s) => window.scrollBy(0, s), step);
        await new Promise((r) => setTimeout(r, 400));
        const ops = await page.evaluate(() =>
          [...document.querySelectorAll('.band')].map((b) => Number(b.style.opacity || 0))
        );
        ops.forEach((o, bi) => {
          if (o > 0.95) seen[bi]++;
          maxOp[bi] = Math.max(maxOp[bi], o);
        });
      }
      console.log(
        `flick ${step}px: full-opacity ticks per band = [${seen.join(', ')}], peak = [${maxOp
          .map((v) => v.toFixed(2))
          .join(', ')}]`
      );
    }
    await browser.close();
  }

  /* ---- 2. touch emulation at phone size: gates must serve the static hero ---- */
  {
    const browser = await launch();
    const page = await browser.newPage();
    await page.emulate({
      viewport: { width: 390, height: 844, isMobile: true, hasTouch: true },
      userAgent:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
    });
    const requests = [];
    page.on('request', (r) => requests.push(r.url()));
    const errors = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    await page.goto(URL_, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 5000));
    const state = await page.evaluate(() => ({
      staticShown: getComputedStyle(document.querySelector('.static-hero')).display,
      videoDisplay: getComputedStyle(document.querySelector('.stage video')).display,
      videoHasSrc: !!document.querySelector('.stage video').src,
    }));
    const videoRequested = requests.some((u) => u.includes('hero-scrub'));
    const posterRequested = requests.some((u) => u.includes('hero-poster'));
    console.log(
      `phone: static-hero=${state.staticShown} video-display=${state.videoDisplay} videoRequested=${videoRequested} posterRequested=${posterRequested} videoSrc=${state.videoHasSrc} consoleErrors=${errors.length}`
    );
    await page.screenshot({ path: path.join(__dirname, 'audit-phone.png') });
    await browser.close();
  }

  /* ---- 3. reduced motion: no video request, drawn states final ---- */
  {
    const browser = await launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.emulateMediaFeatures([
      { name: 'prefers-reduced-motion', value: 'reduce' },
    ]);
    const requests = [];
    page.on('request', (r) => requests.push(r.url()));
    await page.goto(URL_, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 4500));
    const videoRequested = requests.some((u) => u.includes('hero-scrub'));
    const state = await page.evaluate(() => ({
      staticShown: getComputedStyle(document.querySelector('.static-hero')).display,
      vineOffset: getComputedStyle(document.querySelector('.vine .stem') || document.body).strokeDashoffset || 'n/a',
      stepOpacity: getComputedStyle(document.querySelector('.step')).opacity,
    }));
    console.log(
      `reduced-motion: videoRequested=${videoRequested} static=${state.staticShown} vineOffset=${state.vineOffset} stepOpacity=${state.stepOpacity}`
    );
    await browser.close();
  }

  /* ---- 4. video blocked: page complete over poster ---- */
  {
    const browser = await launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    const client = await page.createCDPSession();
    await client.send('Network.enable');
    await client.send('Network.setBlockedURLs', { urls: ['*hero-scrub.mp4*'] });
    await page.goto(URL_, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 6000));
    const state = await page.evaluate(() => ({
      failed: document.querySelector('.stage').classList.contains('video-failed'),
      posterSet: !!document.querySelector('.poster').style.backgroundImage,
      band1Op: document.querySelectorAll('.band')[0].style.opacity,
    }));
    console.log(
      `video-blocked: failedClass=${state.failed} posterSet=${state.posterSet} band1=${state.band1Op}`
    );
    await page.screenshot({ path: path.join(__dirname, 'audit-novideo.png') });
    await browser.close();
  }

  /* ---- 5. worst-frame legibility: hide glyphs, sample under text zones ---- */
  {
    const browser = await launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(URL_, { waitUntil: 'networkidle0' });
    await page.waitForSelector('.stage.video-ready', { timeout: 15000 }).catch(() => {});
    const heroH = await page.evaluate(
      () => document.querySelector('.hero').offsetHeight - innerHeight
    );
    /* per band: sample three progress points inside the band's plateau */
    const BANDS = [
      [0.0, 0.15],
      [0.19, 0.38],
      [0.42, 0.6],
      [0.64, 0.79],
      [0.85, 1.0],
    ];
    const lum = ([r, g, b]) => {
      const f = (v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    const textLum = lum([242, 244, 246]);
    for (let bi = 0; bi < BANDS.length; bi++) {
      const [a, b] = BANDS[bi];
      let worstRatio = Infinity;
      for (const frac of [0.25, 0.5, 0.75]) {
        const p = a + (b - a) * frac;
        await page.evaluate((y) => window.scrollTo(0, y), Math.round(heroH * p));
        await new Promise((r) => setTimeout(r, 900));
        const zone = await page.evaluate((i) => {
          const band = document.querySelectorAll('.band')[i];
          const copy = band.querySelector('.copy');
          const r = copy.getBoundingClientRect();
          copy.style.visibility = 'hidden';
          return { x: r.x, y: r.y, w: r.width, h: r.height };
        }, bi);
        const shot = await page.screenshot({
          clip: { x: zone.x, y: zone.y, width: Math.max(1, zone.w), height: Math.max(1, zone.h) },
          encoding: 'binary',
        });
        await page.evaluate((i) => {
          document.querySelectorAll('.band')[i].querySelector('.copy').style.visibility = '';
        }, bi);
        /* decode png via canvas in page */
        const b64 = Buffer.from(shot).toString('base64');
        const lightest = await page.evaluate(async (data) => {
          const img = new Image();
          img.src = 'data:image/png;base64,' + data;
          await img.decode();
          const c = document.createElement('canvas');
          c.width = img.width;
          c.height = img.height;
          const x = c.getContext('2d');
          x.drawImage(img, 0, 0);
          const d = x.getImageData(0, 0, c.width, c.height).data;
          let best = [0, 0, 0], bl = -1;
          for (let i = 0; i < d.length; i += 4) {
            const l = d[i] * 0.2126 + d[i + 1] * 0.7152 + d[i + 2] * 0.0722;
            if (l > bl) {
              bl = l;
              best = [d[i], d[i + 1], d[i + 2]];
            }
          }
          return best;
        }, b64);
        const bg = lum(lightest);
        const hi = Math.max(textLum, bg), lo = Math.min(textLum, bg);
        const ratio = (hi + 0.05) / (lo + 0.05);
        worstRatio = Math.min(worstRatio, ratio);
      }
      console.log(`legibility band ${bi + 1}: worst-pixel contrast ${worstRatio.toFixed(2)}:1 ${worstRatio >= 3.5 ? 'PASS' : 'FAIL'}`);
    }
    await browser.close();
  }

  console.log('audit battery complete');
})();
