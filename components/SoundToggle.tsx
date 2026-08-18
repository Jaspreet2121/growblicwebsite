"use client";

/* The site's sound, played from original composed audio files in
   /public/sounds (rendered by pipeline/render-sounds.js — nothing sampled
   from anywhere). The mapping: beeps on the splash, the manifesto sweep when
   the hero reveals, ui-short on hover, ui-long on click, and the ambient
   score looping permanently while sound is on. Off by default; the nav
   toggle is the unlocking gesture and the choice persists. */

import { useEffect, useRef, useState } from "react";

const FILES: Record<string, string> = {
  music: "/sounds/ambient-loop.mp3",
  beeps: "/sounds/beeps.mp3",
  manifesto: "/sounds/manifesto.mp3",
  uiShort: "/sounds/ui-short.mp3",
  uiLong: "/sounds/ui-long.mp3",
};

/* mix levels, in the spirit of igloo.inc's published settings */
const LEVELS: Record<string, number> = {
  music: 0.4,
  beeps: 0.5,
  manifesto: 0.65,
  uiShort: 0.6,
  uiLong: 0.55,
};

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
const buffers: Record<string, AudioBuffer> = {};
let loading: Promise<void> | null = null;

function ensureAudio() {
  if (!ctx) {
    ctx = new AudioContext();
    master = ctx.createGain();
    master.gain.value = 0.85;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
}

function loadAll(): Promise<void> {
  if (!loading) {
    loading = Promise.all(
      Object.entries(FILES).map(async ([name, url]) => {
        if (buffers[name]) return;
        const res = await fetch(url);
        const ab = await res.arrayBuffer();
        buffers[name] = await ctx!.decodeAudioData(ab);
      })
    ).then(() => undefined);
  }
  return loading;
}

function shot(name: string) {
  if (!ctx || !master || !buffers[name] || ctx.state !== "running") return;
  const src = ctx.createBufferSource();
  src.buffer = buffers[name];
  const g = ctx.createGain();
  g.gain.value = LEVELS[name] ?? 0.5;
  src.connect(g);
  g.connect(master);
  src.start();
}

let music: { src: AudioBufferSourceNode; gain: GainNode } | null = null;

function startMusic() {
  if (!ctx || !master || music || !buffers.music) return;
  const src = ctx.createBufferSource();
  src.buffer = buffers.music;
  src.loop = true;
  /* trim the MP3 encoder padding out of the loop seam */
  src.loopStart = 0.03;
  src.loopEnd = buffers.music.duration - 0.06;
  const gain = ctx.createGain();
  gain.gain.value = 0;
  src.connect(gain);
  gain.connect(master);
  src.start(0, 0.03);
  gain.gain.setTargetAtTime(LEVELS.music, ctx.currentTime, 1.0);
  music = { src, gain };
}

function stopMusic() {
  if (!music || !ctx) return;
  const m = music;
  music = null;
  m.gain.gain.setTargetAtTime(0, ctx.currentTime, 0.25);
  setTimeout(() => {
    try {
      m.src.stop();
      m.gain.disconnect();
    } catch {}
  }, 1200);
}

export default function SoundToggle() {
  const [on, setOn] = useState(true);
  const lastHover = useRef(0);
  const manifestoPlayed = useRef(false);

  useEffect(() => {
    try {
      /* mute is per-visit: every fresh load starts with sound on */
      localStorage.removeItem("growblic-sound");
      if (sessionStorage.getItem("growblic-sound") === "0") setOn(false);
    } catch {}
    /* the splash's entry click: a real gesture, so audio can start now */
    const onEnter = () => {
      ensureAudio();
      setOn(true);
      try {
        sessionStorage.setItem("growblic-sound", "1");
      } catch {}
    };
    window.addEventListener("growblic-enter-sound", onEnter);
    return () => window.removeEventListener("growblic-enter-sound", onEnter);
  }, []);

  useEffect(() => {
    if (!on) return;
    let alive = true;
    ensureAudio();

    /* stored-on sessions load with a suspended context until a gesture */
    const onFirstGesture = () => {
      ensureAudio();
      setTimeout(() => {
        if (alive) tryManifesto();
      }, 250);
    };
    addEventListener("pointerdown", onFirstGesture, { once: true });

    let splashTimer: ReturnType<typeof setInterval> | null = null;

    const tryManifesto = () => {
      if (manifestoPlayed.current) return;
      if (!document.querySelector(".hero")) return;
      if (document.querySelector(".splash:not(.out)")) return;
      if (!ctx || ctx.state !== "running" || !buffers.manifesto) return;
      manifestoPlayed.current = true;
      shot("manifesto");
    };

    loadAll().then(() => {
      if (!alive) return;
      startMusic();
      /* the splash speaks in terminal beeps while it holds */
      if (document.querySelector(".splash:not(.out)")) {
        shot("beeps");
        let plays = 1;
        splashTimer = setInterval(() => {
          if (plays >= 4 || !document.querySelector(".splash:not(.out)")) {
            if (splashTimer) clearInterval(splashTimer);
            splashTimer = null;
            return;
          }
          plays++;
          shot("beeps");
        }, 1100);
      } else {
        tryManifesto();
      }
    });

    /* the manifesto sweep marks the hero's reveal */
    const onSplashDone = () => {
      loadAll().then(() => alive && tryManifesto());
    };
    window.addEventListener("growblic-splash-done", onSplashDone);

    const onOver = (e: PointerEvent) => {
      if (!(e.target as Element | null)?.closest?.("a, button, summary, .chip-btn"))
        return;
      const now = performance.now();
      if (now - lastHover.current < 70) return;
      lastHover.current = now;
      shot("uiShort");
    };
    const onClick = (e: MouseEvent) => {
      if (!(e.target as Element | null)?.closest?.("a, button, summary, .chip-btn"))
        return;
      shot("uiLong");
    };
    addEventListener("pointerover", onOver, { passive: true });
    addEventListener("click", onClick, { passive: true });

    return () => {
      alive = false;
      if (splashTimer) clearInterval(splashTimer);
      removeEventListener("pointerdown", onFirstGesture);
      window.removeEventListener("growblic-splash-done", onSplashDone);
      removeEventListener("pointerover", onOver);
      removeEventListener("click", onClick);
      stopMusic();
    };
  }, [on]);

  function toggle() {
    const next = !on;
    setOn(next);
    try {
      sessionStorage.setItem("growblic-sound", next ? "1" : "0");
    } catch {}
    if (next) ensureAudio();
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
