"use client";

/* The site's sound, synthesized live (no audio files), off by default.
   Architecture studied from igloo.inc (all audio here is original): loops run
   constantly and movement fades them, a room tone sits under a quiet chord
   and distant chimes, wind rises with scroll, and a soft swell opens the
   visit. The nav toggle is the user gesture that unlocks audio; the choice
   persists in localStorage. */

import { useEffect, useRef, useState } from "react";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;

function ensureAudio() {
  if (!ctx) {
    ctx = new AudioContext();
    master = ctx.createGain();
    master.gain.value = 0.32;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
}

function tone(
  freq: number,
  dur: number,
  gain: number,
  type: OscillatorType = "sine",
  when = 0
) {
  if (!ctx || !master) return;
  const t0 = ctx.currentTime + when;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g);
  g.connect(master);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

const play = {
  hover: () => tone(1180 + Math.random() * 120, 0.05, 0.05),
  click: () => {
    tone(640, 0.07, 0.09, "triangle");
    tone(1280, 0.05, 0.04, "sine");
  },
  bloom: () => {
    tone(659.25, 0.4, 0.09);
    tone(987.77, 0.5, 0.07, "sine", 0.12);
  },
};

function brownBuffer(seconds: number): AudioBuffer {
  const len = Math.floor(ctx!.sampleRate * seconds);
  const buf = ctx!.createBuffer(1, len, ctx!.sampleRate);
  const d = buf.getChannelData(0);
  let b = 0;
  for (let i = 0; i < len; i++) {
    const w = Math.random() * 2 - 1;
    b = (b + 0.02 * w) / 1.02;
    d[i] = b * 3.5;
  }
  return buf;
}

function whiteBuffer(seconds: number): AudioBuffer {
  const len = Math.floor(ctx!.sampleRate * seconds);
  const buf = ctx!.createBuffer(1, len, ctx!.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  return buf;
}

/* ---- the ambient bed: a warm quiet chord, faint air, distant chimes ---- */

let bed: { out: GainNode; stops: (() => void)[] } | null = null;

function ensureBed() {
  if (!ctx || !master || bed) return;
  const out = ctx.createGain();
  out.gain.value = 0;
  out.connect(master);
  const stops: (() => void)[] = [];

  /* the warmth: a soft G major voicing, felt more than heard */
  const pad: [number, number][] = [
    [196.0, 0.05], /* G3 */
    [246.94, 0.028], /* B3 */
    [293.66, 0.034], /* D4 */
  ];
  const padGains: GainNode[] = [];
  for (const [freq, g] of pad) {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    const og = ctx.createGain();
    og.gain.value = g;
    osc.connect(og);
    og.connect(out);
    osc.start();
    stops.push(() => osc.stop());
    padGains.push(og);
  }

  /* the slow breath moves the chord, not the noise */
  const lfo = ctx.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = 0.045;
  const lfoDepth = ctx.createGain();
  lfoDepth.gain.value = 0.012;
  lfo.connect(lfoDepth);
  lfoDepth.connect(padGains[0].gain);
  lfoDepth.connect(padGains[2].gain);
  lfo.start();
  stops.push(() => lfo.stop());

  /* room tone: a low, constant body under everything (igloo-style room-bg) */
  const room = ctx.createBufferSource();
  room.buffer = brownBuffer(4);
  room.loop = true;
  const roomLp = ctx.createBiquadFilter();
  roomLp.type = "lowpass";
  roomLp.frequency.value = 210;
  const roomG = ctx.createGain();
  roomG.gain.value = 0.05;
  room.connect(roomLp);
  roomLp.connect(roomG);
  roomG.connect(out);
  room.start();
  stops.push(() => room.stop());

  /* only a trace of air remains */
  const wash = ctx.createBufferSource();
  wash.buffer = whiteBuffer(2);
  wash.loop = true;
  const washBp = ctx.createBiquadFilter();
  washBp.type = "bandpass";
  washBp.frequency.value = 950;
  washBp.Q.value = 0.6;
  const washG = ctx.createGain();
  washG.gain.value = 0.012;
  wash.connect(washBp);
  washBp.connect(washG);
  washG.connect(out);
  wash.start();
  stops.push(() => wash.stop());

  /* distant chimes, unchanged: a soft pentatonic note now and then */
  const NOTES = [659.25, 783.99, 987.77, 1174.66, 1318.51];
  let chimeTimer: ReturnType<typeof setTimeout> | null = null;
  const chime = () => {
    if (!ctx || !bed) return;
    const f = NOTES[Math.floor(Math.random() * NOTES.length)];
    const t0 = ctx.currentTime;
    for (const [mult, g] of [
      [1, 0.055],
      [2, 0.013],
    ] as const) {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = f * mult;
      const og = ctx.createGain();
      og.gain.setValueAtTime(0, t0);
      og.gain.linearRampToValueAtTime(g, t0 + 0.2);
      og.gain.exponentialRampToValueAtTime(0.0001, t0 + 3);
      osc.connect(og);
      og.connect(out);
      osc.start(t0);
      osc.stop(t0 + 3.2);
    }
    chimeTimer = setTimeout(chime, 8000 + Math.random() * 9000);
  };
  chimeTimer = setTimeout(chime, 3000);
  stops.push(() => {
    if (chimeTimer) clearTimeout(chimeTimer);
  });

  out.gain.setTargetAtTime(0.9, ctx.currentTime, 1.2);
  bed = { out, stops };
}

function stopBed() {
  if (!bed || !ctx) return;
  const b = bed;
  bed = null;
  b.out.gain.setTargetAtTime(0, ctx.currentTime, 0.25);
  setTimeout(() => {
    try {
      b.stops.forEach((s) => s());
      b.out.disconnect();
    } catch {}
  }, 1200);
}

/* ---- the wind: silent until movement, alive with gusts (igloo-style) ---- */

let wind: {
  macro: GainNode;
  lp: BiquadFilterNode;
  stops: (() => void)[];
} | null = null;

function ensureWind() {
  if (!ctx || !master || wind) return;
  const stops: (() => void)[] = [];
  const src = ctx.createBufferSource();
  src.buffer = brownBuffer(5);
  src.loop = true;
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 420;
  lp.Q.value = 0.6;
  const gustG = ctx.createGain();
  gustG.gain.value = 1;
  const macro = ctx.createGain();
  macro.gain.value = 0;
  src.connect(lp);
  lp.connect(gustG);
  gustG.connect(macro);
  macro.connect(master);
  src.start();
  stops.push(() => src.stop());

  /* two slow detuned LFOs make the gusts breathe instead of hissing flat */
  const g1 = ctx.createOscillator();
  g1.frequency.value = 0.13;
  const g1d = ctx.createGain();
  g1d.gain.value = 0.28;
  g1.connect(g1d);
  g1d.connect(gustG.gain);
  g1.start();
  stops.push(() => g1.stop());
  const g2 = ctx.createOscillator();
  g2.frequency.value = 0.047;
  const g2d = ctx.createGain();
  g2d.gain.value = 140;
  g2.connect(g2d);
  g2d.connect(lp.frequency);
  g2.start();
  stops.push(() => g2.stop());

  wind = { macro, lp, stops };
}

function stopWind() {
  if (!wind) return;
  try {
    wind.stops.forEach((s) => s());
    wind.macro.disconnect();
  } catch {}
  wind = null;
}

/* ---- the loader swell: a soft rise for the splash, synthesized once ---- */

function playIntro() {
  if (!ctx || !master) return;
  const t0 = ctx.currentTime;
  /* a breath of air sweeping upward */
  const n = ctx.createBufferSource();
  n.buffer = whiteBuffer(3);
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.Q.value = 1.1;
  bp.frequency.setValueAtTime(260, t0);
  bp.frequency.exponentialRampToValueAtTime(1300, t0 + 2.2);
  const ng = ctx.createGain();
  ng.gain.setValueAtTime(0, t0);
  ng.gain.linearRampToValueAtTime(0.06, t0 + 1.6);
  ng.gain.exponentialRampToValueAtTime(0.0001, t0 + 2.8);
  n.connect(bp);
  bp.connect(ng);
  ng.connect(master);
  n.start(t0);
  n.stop(t0 + 3);
  /* two warm tones opening underneath */
  for (const [f, g, at] of [
    [196.0, 0.05, 0],
    [293.66, 0.035, 0.5],
  ] as const) {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = f;
    const og = ctx.createGain();
    og.gain.setValueAtTime(0, t0 + at);
    og.gain.linearRampToValueAtTime(g, t0 + at + 1.2);
    og.gain.exponentialRampToValueAtTime(0.0001, t0 + 3.2);
    osc.connect(og);
    og.connect(master);
    osc.start(t0 + at);
    osc.stop(t0 + 3.4);
  }
}

export default function SoundToggle() {
  const [on, setOn] = useState(false);
  const lastHover = useRef(0);

  useEffect(() => {
    try {
      if (localStorage.getItem("growblic-sound") === "1") setOn(true);
    } catch {}
  }, []);

  useEffect(() => {
    if (!on) return;
    ensureAudio();
    ensureBed();
    ensureWind();

    /* the loader swell greets a fresh visit */
    if (performance.now() < 8000) playIntro();

    /* stored-on sessions load with a suspended context until the browser sees
       a gesture; the first interaction wakes everything */
    const onFirstGesture = () => ensureAudio();
    addEventListener("pointerdown", onFirstGesture, { once: true });

    /* the wind fades in with scroll speed and dies back to silence at rest */
    let lastY = window.scrollY;
    let lastT = performance.now();
    let level = 0;
    let target = 0;
    let raf: number | null = null;
    const settle = () => {
      raf = null;
      level += (target - level) * 0.08;
      target *= 0.9;
      if (wind && ctx) {
        wind.macro.gain.setTargetAtTime(level * 0.5, ctx.currentTime, 0.06);
        wind.lp.frequency.setTargetAtTime(
          420 + level * 780,
          ctx.currentTime,
          0.1
        );
      }
      if (level > 0.004 || target > 0.004) {
        raf = requestAnimationFrame(settle);
      } else if (wind && ctx) {
        wind.macro.gain.setTargetAtTime(0, ctx.currentTime, 0.12);
      }
    };
    const onScroll = () => {
      const now = performance.now();
      const dt = Math.max(16, now - lastT);
      const v = Math.abs(window.scrollY - lastY) / dt;
      lastY = window.scrollY;
      lastT = now;
      target = Math.min(1, v / 2.6);
      if (raf === null) raf = requestAnimationFrame(settle);
    };
    addEventListener("scroll", onScroll, { passive: true });

    const onOver = (e: PointerEvent) => {
      if (!(e.target as Element | null)?.closest?.("a, button, summary, .chip-btn"))
        return;
      const now = performance.now();
      if (now - lastHover.current < 70) return;
      lastHover.current = now;
      play.hover();
    };
    const onClick = (e: MouseEvent) => {
      if (!(e.target as Element | null)?.closest?.("a, button, summary, .chip-btn"))
        return;
      play.click();
    };
    const onGrown = () => play.bloom();

    addEventListener("pointerover", onOver, { passive: true });
    addEventListener("click", onClick, { passive: true });
    addEventListener("growblic-grown", onGrown);
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("pointerdown", onFirstGesture);
      if (raf !== null) cancelAnimationFrame(raf);
      stopWind();
      stopBed();
      removeEventListener("pointerover", onOver);
      removeEventListener("click", onClick);
      removeEventListener("growblic-grown", onGrown);
    };
  }, [on]);

  function toggle() {
    const next = !on;
    setOn(next);
    try {
      localStorage.setItem("growblic-sound", next ? "1" : "0");
    } catch {}
    if (next) {
      ensureAudio();
      play.click();
    }
  }

  return (
    <button
      type="button"
      className={`sound-btn${on ? " on" : ""}`}
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? "Turn sound off" : "Turn sound on"}
      title={on ? "Sound on" : "Sound off"}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M4 9.5v5h3.2L12 18.5v-13L7.2 9.5H4z" strokeLinejoin="round" />
        {on ? (
          <>
            <path d="M15.5 9.2a4 4 0 0 1 0 5.6" strokeLinecap="round" />
            <path d="M18 6.8a7.4 7.4 0 0 1 0 10.4" strokeLinecap="round" />
          </>
        ) : (
          <path d="M15.5 9.8l4.4 4.4M19.9 9.8l-4.4 4.4" strokeLinecap="round" />
        )}
      </svg>
    </button>
  );
}
