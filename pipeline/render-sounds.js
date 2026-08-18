/* Renders the site's five original sound files with OfflineAudioContext in
   headless Chrome, exports WAV, then ffmpeg encodes MP3 into
   growblic-site/public/sounds/. Every sound is composed here: nothing is
   sampled from anywhere. */

const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const OUT = path.join(__dirname, 'sounds-out');
const DEST = path.join(__dirname, '..', '..', 'growblic-site', 'public', 'sounds');

const PAGE = `<!doctype html><html><body><script>
function wavFromBuffer(buf) {
  const ch = buf.numberOfChannels, len = buf.length, sr = buf.sampleRate;
  const bytes = 44 + len * ch * 2;
  const ab = new ArrayBuffer(bytes);
  const v = new DataView(ab);
  const ws = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
  ws(0, 'RIFF'); v.setUint32(4, bytes - 8, true); ws(8, 'WAVE'); ws(12, 'fmt ');
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, ch, true);
  v.setUint32(24, sr, true); v.setUint32(28, sr * ch * 2, true);
  v.setUint16(32, ch * 2, true); v.setUint16(34, 16, true); ws(36, 'data');
  v.setUint32(40, len * ch * 2, true);
  let o = 44;
  for (let i = 0; i < len; i++) for (let c = 0; c < ch; c++) {
    const s = Math.max(-1, Math.min(1, buf.getChannelData(c)[i]));
    v.setInt16(o, s < 0 ? s * 0x8000 : s * 0x7fff, true); o += 2;
  }
  const bin = new Uint8Array(ab);
  let str = '';
  for (let i = 0; i < bin.length; i += 8192) str += String.fromCharCode.apply(null, bin.subarray(i, i + 8192));
  return btoa(str);
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---- the ambient score: a 48s seamless loop, four soft chords ---- */
async function renderMusic() {
  const D = 48, SR = 44100;
  const ctx = new OfflineAudioContext(2, D * SR, SR);
  const master = ctx.createGain();
  master.gain.value = 0.9;
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass'; lp.frequency.value = 2400;
  master.connect(lp); lp.connect(ctx.destination);

  const CHORDS = [
    [98.0, 196.0, 246.94, 293.66, 370.0],      /* Gmaj7  */
    [82.41, 164.81, 196.0, 246.94, 370.0],     /* Em9    */
    [130.81, 164.81, 196.0, 246.94, 293.66],   /* Cmaj9  */
    [146.83, 185.0, 220.0, 293.66, 329.63],    /* D add9 */
  ];
  const SEG = 12, XF = 3.5;

  function scheduleChord(freqs, start) {
    for (const wrap of [0, D, -D]) {
      const t0 = start + wrap;
      if (t0 + SEG + XF < 0 || t0 - XF > D) continue;
      freqs.forEach((f, i) => {
        for (const [type, mult, g] of [['sine', 1, 0.05], ['triangle', 2, 0.006]]) {
          const osc = ctx.createOscillator();
          osc.type = type;
          osc.frequency.value = f * mult;
          const og = ctx.createGain();
          const gg = g * (i === 0 ? 1.15 : 1) * (1 - i * 0.09);
          const a0 = Math.max(0, t0 - XF), a1 = Math.max(0.001, t0 + 1);
          const r0 = t0 + SEG - 1, r1 = t0 + SEG + XF;
          og.gain.setValueAtTime(0, Math.max(0, a0));
          og.gain.linearRampToValueAtTime(gg, Math.min(D, Math.max(0.002, a1)));
          if (r0 < D) og.gain.setValueAtTime(gg, Math.max(0, Math.min(D, r0)));
          og.gain.linearRampToValueAtTime(0, Math.max(0, Math.min(D, r1)));
          osc.connect(og); og.connect(master);
          osc.start(Math.max(0, a0));
          osc.stop(Math.min(D, Math.max(0.01, r1)));
        }
      });
    }
  }
  CHORDS.forEach((c, i) => scheduleChord(c, i * SEG));

  /* soft chimes sprinkled deterministically, clear of the loop seam */
  const r = mulberry32(777);
  const NOTES = [659.25, 783.99, 987.77, 1174.66];
  for (let i = 0; i < 9; i++) {
    const t = 5 + r() * 38;
    const f = NOTES[Math.floor(r() * NOTES.length)];
    for (const [mult, g] of [[1, 0.028], [2, 0.007]]) {
      const osc = ctx.createOscillator();
      osc.type = 'sine'; osc.frequency.value = f * mult;
      const og = ctx.createGain();
      og.gain.setValueAtTime(0, t);
      og.gain.linearRampToValueAtTime(g, t + 0.3);
      og.gain.exponentialRampToValueAtTime(0.0001, t + 3.4);
      osc.connect(og); og.connect(master);
      osc.start(t); osc.stop(t + 3.6);
    }
  }

  /* constant faint air so the wash never gaps at the seam */
  const noise = ctx.createBuffer(1, SR * 2, SR);
  const nd = noise.getChannelData(0);
  const nr = mulberry32(12345);
  for (let i = 0; i < nd.length; i++) nd[i] = nr() * 2 - 1;
  const ns = ctx.createBufferSource();
  ns.buffer = noise; ns.loop = true;
  const nbp = ctx.createBiquadFilter();
  nbp.type = 'bandpass'; nbp.frequency.value = 900; nbp.Q.value = 0.6;
  const ng = ctx.createGain(); ng.gain.value = 0.006;
  ns.connect(nbp); nbp.connect(ng); ng.connect(master);
  ns.start(0);

  return ctx.startRendering();
}

/* ---- terminal beeps for the splash ---- */
async function renderBeeps() {
  const D = 1.4, SR = 44100;
  const ctx = new OfflineAudioContext(1, D * SR, SR);
  const r = mulberry32(42);
  const FREQS = [1244, 1480, 1661, 1865, 2093];
  let t = 0.02;
  for (let i = 0; i < 8; i++) {
    const f = FREQS[Math.floor(r() * FREQS.length)];
    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.value = f;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 5200;
    const g = ctx.createGain();
    const dur = 0.024 + r() * 0.02;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.16, t + 0.004);
    g.gain.setValueAtTime(0.16, t + dur - 0.006);
    g.gain.linearRampToValueAtTime(0, t + dur);
    osc.connect(lp); lp.connect(g); g.connect(ctx.destination);
    osc.start(t); osc.stop(t + dur + 0.01);
    t += dur + 0.05 + r() * 0.11;
  }
  return ctx.startRendering();
}

/* ---- the manifesto reveal: a soft upward sweep for the hero ---- */
async function renderManifesto() {
  const D = 1.6, SR = 44100;
  const ctx = new OfflineAudioContext(1, D * SR, SR);
  const noise = ctx.createBuffer(1, SR * 2, SR);
  const nd = noise.getChannelData(0);
  const nr = mulberry32(9);
  for (let i = 0; i < nd.length; i++) nd[i] = nr() * 2 - 1;
  const ns = ctx.createBufferSource();
  ns.buffer = noise;
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass'; bp.Q.value = 1.4;
  bp.frequency.setValueAtTime(320, 0);
  bp.frequency.exponentialRampToValueAtTime(2200, 1.1);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, 0);
  g.gain.linearRampToValueAtTime(0.12, 0.55);
  g.gain.exponentialRampToValueAtTime(0.0001, 1.5);
  ns.connect(bp); bp.connect(g); g.connect(ctx.destination);
  ns.start(0);
  for (const [f, gg, at] of [[587.33, 0.08, 0.25], [880, 0.05, 0.45]]) {
    const osc = ctx.createOscillator();
    osc.type = 'sine'; osc.frequency.value = f;
    const og = ctx.createGain();
    og.gain.setValueAtTime(0, at);
    og.gain.linearRampToValueAtTime(gg, at + 0.25);
    og.gain.exponentialRampToValueAtTime(0.0001, 1.55);
    osc.connect(og); og.connect(ctx.destination);
    osc.start(at); osc.stop(1.58);
  }
  return ctx.startRendering();
}

/* ---- ui-short: a tiny glass tick ---- */
async function renderUiShort() {
  const D = 0.12, SR = 44100;
  const ctx = new OfflineAudioContext(1, D * SR, SR);
  for (const [f, g, dur] of [[1900, 0.14, 0.05], [3800, 0.05, 0.03]]) {
    const osc = ctx.createOscillator();
    osc.type = 'sine'; osc.frequency.value = f;
    const og = ctx.createGain();
    og.gain.setValueAtTime(0, 0);
    og.gain.linearRampToValueAtTime(g, 0.006);
    og.gain.exponentialRampToValueAtTime(0.0001, dur + 0.03);
    osc.connect(og); og.connect(ctx.destination);
    osc.start(0); osc.stop(D);
  }
  return ctx.startRendering();
}

/* ---- ui-long: a smooth confirming sweep ---- */
async function renderUiLong() {
  const D = 0.45, SR = 44100;
  const ctx = new OfflineAudioContext(1, D * SR, SR);
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(620, 0);
  osc.frequency.exponentialRampToValueAtTime(1240, 0.22);
  const og = ctx.createGain();
  og.gain.setValueAtTime(0, 0);
  og.gain.linearRampToValueAtTime(0.14, 0.03);
  og.gain.exponentialRampToValueAtTime(0.0001, 0.42);
  osc.connect(og); og.connect(ctx.destination);
  osc.start(0); osc.stop(D);
  const o2 = ctx.createOscillator();
  o2.type = 'sine'; o2.frequency.value = 2480;
  const g2 = ctx.createGain();
  g2.gain.setValueAtTime(0, 0.05);
  g2.gain.linearRampToValueAtTime(0.035, 0.09);
  g2.gain.exponentialRampToValueAtTime(0.0001, 0.4);
  o2.connect(g2); g2.connect(ctx.destination);
  o2.start(0.05); o2.stop(D);
  return ctx.startRendering();
}

window.renderAll = async function () {
  const out = {};
  out['ambient-loop'] = wavFromBuffer(await renderMusic());
  out['beeps'] = wavFromBuffer(await renderBeeps());
  out['manifesto'] = wavFromBuffer(await renderManifesto());
  out['ui-short'] = wavFromBuffer(await renderUiShort());
  out['ui-long'] = wavFromBuffer(await renderUiLong());
  return out;
};
</script></body></html>`;

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  fs.mkdirSync(DEST, { recursive: true });
  fs.writeFileSync(path.join(OUT, 'page.html'), PAGE);
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new',
  });
  const page = await browser.newPage();
  await page.goto('file://' + path.join(OUT, 'page.html'));
  const files = await page.evaluate('renderAll()');
  await browser.close();
  for (const [name, b64] of Object.entries(files)) {
    const wav = path.join(OUT, name + '.wav');
    fs.writeFileSync(wav, Buffer.from(b64, 'base64'));
    const mp3 = path.join(DEST, name + '.mp3');
    execSync(`ffmpeg -y -i "${wav}" -c:a libmp3lame -q:a 3 "${mp3}"`, { stdio: 'ignore' });
    console.log('rendered', name + '.mp3', fs.statSync(mp3).size, 'bytes');
  }
})();
