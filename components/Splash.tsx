"use client";

/* The entry: a full-screen preloader in the brand's world. The mark breathes,
   a percentage climbs against the hero film's real download progress, and the
   screen releases upward into the site. Slow networks are never held hostage:
   a time envelope keeps the counter moving and the splash always releases,
   with the film continuing to stream behind the scenes if it needs longer. */

import { useEffect, useRef, useState } from "react";
import Mark from "./Mark";

const MIN_SHOW = 1100; /* ms the splash always holds, so it reads as designed */
const MAX_HOLD = 4200; /* ms after which the splash releases regardless */

export default function Splash() {
  const [pct, setPct] = useState(0);
  const [phase, setPhase] = useState<"in" | "out" | "gone">("in");
  const outRef = useRef(false);

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
      window.dispatchEvent(new CustomEvent("growblic-splash-done"));
      outTimer = setTimeout(() => {
        document.documentElement.classList.remove("splash-lock");
        setPhase("gone");
      }, reduced ? 0 : 900);
      if (raf !== null) cancelAnimationFrame(raf);
      raf = null;
    };

    if (reduced) {
      /* no theatre under reduced motion: release immediately */
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
      /* the time envelope walks to 88 over ~2.4s so the counter never stalls;
         real video progress can outrun it */
      const envelope = 88 * Math.min(1, t / 2400);
      let target = Math.max(envelope, videoProgress * 100);
      if (videoReady || t > MAX_HOLD) target = 100;
      display += (target - display) * 0.09;
      const shown = Math.min(100, Math.floor(display));
      setPct(shown);
      if (display >= 99.2 && t >= MIN_SHOW) {
        finish();
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
      document.documentElement.classList.remove("splash-lock");
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div className={`splash${phase === "out" ? " out" : ""}`} aria-hidden="true">
      <div className="splash-inner">
        <Mark className="splash-mark" />
        <div className="splash-bar">
          <span style={{ transform: `scaleX(${pct / 100})` }} />
        </div>
        <p className="splash-pct">{String(pct).padStart(2, "0")}%</p>
      </div>
    </div>
  );
}
