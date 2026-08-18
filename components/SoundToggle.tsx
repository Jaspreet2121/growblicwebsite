"use client";

/* The site's sound, synthesized live (no audio files), off by default.
   The bed is a warm quiet chord with the faintest air and distant chimes.
   Scroll speaks in soft kalimba-like plucks stepping along a pentatonic
   ladder as you move. The nav toggle is the user gesture that unlocks
   audio, and the choice persists in localStorage. */

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

/* a soft mallet note: fundamental plus a whisper of octave, quick attack,
   round decay */
function pluck(freq: number, gain = 0.055) {
  if (!ctx || !master) return;
  const t0 = ctx.currentTime;
  const detune = 1 + (Math.random() - 0.5) * 0.004;
  for (const [mult, g, dur] of [
    [1, gain, 0.42],
    [2, gain * 0.22, 0.28],
  ] as const) {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq * mult * detune;
    const og = ctx.createGain();
    og.gain.setValueAtTime(0, t0);
    og.gain.linearRampToValueAtTime(g, t0 + 0.006);
    og.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(og);
    og.connect(master);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }
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

/* the scroll ladder: one soft pluck per step of travel, notes descending
   as the page deepens, in the chimes' pentatonic world */
const LADDER = [783.99, 659.25, 587.33, 493.88, 440.0, 392.0];
const STEP = 340; /* px of scroll per note */

function ladderNote(y: number): number {
  const idx = Math.floor(y / STEP);
  const n = LADDER.length;
  const cycle = (n - 1) * 2;
  const k = ((idx % cycle) + cycle) % cycle;
  return LADDER[k < n ? k : cycle - k];
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

    /* stored-on sessions load with a suspended context until the browser sees
       a gesture; the first interaction wakes everything */
    const onFirstGesture = () => ensureAudio();
    addEventListener("pointerdown", onFirstGesture, { once: true });

    /* scroll plucks: fire one per STEP of travel, gently rate-limited */
    let anchorY = window.scrollY;
    let lastPluckT = 0;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - anchorY) < STEP) return;
      const now = performance.now();
      anchorY = y - (y % STEP);
      if (now - lastPluckT < 85) return;
      lastPluckT = now;
      pluck(ladderNote(y));
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
