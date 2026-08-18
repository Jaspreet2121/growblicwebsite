/* Frame driver: renders render.html frame by frame through headless Chrome.
   Usage: node drive.js keys        -> only look-dev keyframes
          node drive.js all         -> all 180 frames */

const puppeteer = require('puppeteer-core');
const path = require('path');

const TOTAL = 360;
const KEYS = [0, 30, 60, 95, 120, 135, 150, 165, 179];

(async () => {
  const mode = process.argv[2] || 'keys';
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new',
    args: ['--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  await page.goto('file://' + path.join(__dirname, 'render.html'));
  const frames = mode === 'all' ? [...Array(TOTAL).keys()] : KEYS;
  for (const i of frames) {
    await page.evaluate(`renderFrame(${i}, ${TOTAL})`);
    const name = mode === 'all'
      ? `frames/f${String(i).padStart(4, '0')}.png`
      : `frames/key-${String(i).padStart(4, '0')}.png`;
    await page.screenshot({
      path: path.join(__dirname, name),
      clip: { x: 0, y: 0, width: 1920, height: 1080 },
    });
    if (i % 30 === 0) console.log('rendered', name);
  }
  await browser.close();
  console.log('done:', frames.length, 'frames');
})();
