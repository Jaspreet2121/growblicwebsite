"use client";

/* The entry: a full-screen preloader in the brand's world. The counter climbs
   against the hero film's real download progress; when it reaches 100 the
   screen HOLDS and waits for the visitor's click (the whole overlay is the
   button), because that click is what lets the browser start audio: the
   terminal beeps fire on it, the release follows, and the manifesto marks
   the reveal. Clicking earlier makes the rest of the loading audible too.
   A quiet fallback releases anyone who never clicks; reduced motion skips
   the theatre entirely. */

import { useEffect, useRef, useState } from "react";
import Mark from "./Mark";

const MIN_SHOW = 1100; /* ms the splash always holds, so it reads as designed */
const MAX_LOAD = 4200; /* ms after which loading counts as done regardless */
const READY_WAIT = 12000; /* ms to wait for the entry click before releasing */

export default function Splash() {
  const [pct, setPct] = useState(0);
  const [phase, setPhase] = useState<"in" | "out" | "gone">("in");
  const [entered, setEntered] = useState(false);
  const [ready, setReady] = useState(false);
  const outRef = useRef(false);
  const enteredRef = useRef(false);
  const readyRef = useRef(false);
  const finishRef = useRef<() => void>(() => {});
  const readyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function enterWithSound() {
    if (enteredRef.current || outRef.current) return;
    enteredRef.current = true;
    setEntered(true);
    window.dispatchEvent(new CustomEvent("growblic-enter-sound"));
    if (readyRef.current) {
      /* loading is done and we were waiting on this click: let the beeps
         speak, then release */
      if (readyTimerRef.current) clearTimeout(readyTimerRef.current);
      setTimeout(() => finishRef.current(), 750);
    }
  }

  useEffect(() => {
    const start = performance.now();
    let videoProgress = 0;
    let videoReady = false;
    let display = 0;
    let raf: number | null = null;
    let outTimer: ReturnType<typeof setTimeout> | null = null;

    document.documentElement.classList.add("splash-lock");

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const finish = () => {
      if (outRef.current) return;
      outRef.current = true;
      setPct(100);
      setPhase("out");
      /* announce after React paints the out state, so listeners that check
         the splash's visibility see the truth */
      setTimeout(
        () => window.dispatchEvent(new CustomEvent("growblic-splash-done")),
        120
      );
      outTimer = setTimeout(() => {
        document.documentElement.classList.remove("splash-lock");
        setPhase("gone");
      }, reduced ? 0 : 900);
      if (raf !== null) cancelAnimationFrame(raf);
      raf = null;
    };
    finishRef.current = finish;

    if (reduced) {
      finish();
      return () => {
        if (outTimer) clearTimeout(outTimer);
        document.documentElement.classList.remove("splash-lock");
      };
    }

    const onProgress = (e: Event) => {
      videoProgress = Math.max(videoProgress, Number((e as CustomEvent).detail) || 0);
    };
    const onReady = () => {
      videoReady = true;
    };
    window.addEventListener("growblic-hero-progress", onProgress);
    window.addEventListener("growblic-hero-ready", onReady);

    function tick(now: number) {
      const t = now - start;
      const envelope = 88 * Math.min(1, t / 2400);
      let target = Math.max(envelope, videoProgress * 100);
      if (videoReady || t > MAX_LOAD) target = 100;
      display += (target - display) * 0.09;
      setPct(Math.min(100, Math.floor(display)));
      if (display >= 99.2 && t >= MIN_SHOW) {
        if (enteredRef.current) {
          /* they already clicked: straight through */
          finish();
        } else if (!readyRef.current) {
          /* loaded, waiting on the entry click */
          readyRef.current = true;
          setReady(true);
          setPct(100);
          readyTimerRef.current = setTimeout(finish, READY_WAIT);
          raf = null;
        }
        return;
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("growblic-hero-progress", onProgress);
      window.removeEventListener("growblic-hero-ready", onReady);
      if (raf !== null) cancelAnimationFrame(raf);
      if (outTimer) clearTimeout(outTimer);
      if (readyTimerRef.current) clearTimeout(readyTimerRef.current);
      document.documentElement.classList.remove("splash-lock");
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      className={`splash${phase === "out" ? " out" : ""}${ready ? " ready" : ""}`}
      onClick={enterWithSound}
    >
      <div className="splash-inner">
        <Mark className="splash-mark" />
        <div className="splash-bar" aria-hidden="true">
          <span style={{ transform: `scaleX(${pct / 100})` }} />
        </div>
        <p className="splash-pct" aria-hidden="true">
          {String(pct).padStart(2, "0")}%
        </p>
        <button
          type="button"
          className={`splash-enter${entered ? " entered" : ""}${ready ? " ready" : ""}`}
          onClick={enterWithSound}
        >
          {entered ? "Sound on" : ready ? "Click to enter" : "Enter with sound"}
        </button>
      </div>
    </div>
  );
}
