const puppeteer = require('puppeteer-core');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new',
    args: ['--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  await page.goto('file://' + path.join(__dirname, 'stills.html'));
  for (const name of ['still-custom', 'still-mobile', 'still-saas', 'still-ai', 'still-web', 'still-skifi']) {
    await page.evaluate(`renderScene(${JSON.stringify(name)})`);
    await page.screenshot({
      path: path.join(__dirname, `${name}.png`),
      clip: { x: 0, y: 0, width: 1920, height: 1080 },
    });
    console.log('rendered', name);
  }
  await browser.close();
})();
