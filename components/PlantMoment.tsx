"use client";

/* The one designed interactive moment: hold to plant an idea. Progress builds
   while held, eases back if released early, and completing it lights the five
   process steps in sequence. Reduced motion completes instantly. */

import { useEffect, useRef } from "react";
import Mark from "./Mark";

export default function PlantMoment() {
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;
    const sec = btn.closest(".plant-sec") as HTMLElement | null;
    if (!sec) return;

    let p = 0;
    let holding = false;
    let raf: number | null = null;
    let last = 0;
    let grown = false;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");

    function write() {
      sec!.style.setProperty("--p", p.toFixed(3));
    }

    function grow() {
      if (grown) return;
      grown = true;
      p = 1;
      write();
      sec!.classList.add("grown");
    }

    function tick(now: number) {
      const dt = Math.min(80, now - (last || now));
      last = now;
      const rate = holding ? dt / 1400 : -dt / 700;
      p = Math.min(1, Math.max(0, p + rate));
      write();
      if (p >= 1) {
        grow();
        raf = null;
        last = 0;
        return;
      }
      if (p <= 0 && !holding) {
        raf = null;
        last = 0;
        return;
      }
      raf = requestAnimationFrame(tick);
    }

    const kick = () => {
      if (raf === null) raf = requestAnimationFrame(tick);
    };

    const start = (e: Event) => {
      if (grown) return;
      if (reduced.matches) {
        grow();
        return;
      }
      e.preventDefault();
      holding = true;
      kick();
    };
    const stop = () => {
      holding = false;
      kick();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.key === " " || e.key === "Enter") && !e.repeat) start(e);
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") stop();
    };

    btn.addEventListener("pointerdown", start);
    btn.addEventListener("pointerup", stop);
    btn.addEventListener("pointerleave", stop);
    btn.addEventListener("pointercancel", stop);
    btn.addEventListener("keydown", onKeyDown);
    btn.addEventListener("keyup", onKeyUp);

    const onReduceFlip = (e: MediaQueryListEvent) => {
      if (e.matches) grow();
    };
    reduced.addEventListener("change", onReduceFlip);

    return () => {
      btn.removeEventListener("pointerdown", start);
      btn.removeEventListener("pointerup", stop);
      btn.removeEventListener("pointerleave", stop);
      btn.removeEventListener("pointercancel", stop);
      btn.removeEventListener("keydown", onKeyDown);
      btn.removeEventListener("keyup", onKeyUp);
      reduced.removeEventListener("change", onReduceFlip);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <button className="plant-btn" ref={btnRef} type="button">
      <span className="plant-pot" aria-hidden="true">
        <Mark className="plant-mark" />
      </span>
      <span className="plant-label-idle">Hold to plant an idea</span>
      <span className="plant-label-done">Planted. Watch it grow.</span>
    </button>
  );
}
