"use client";

/* The cursor: a crisp ivory dot exactly at the pointer, and a thin ring that
   glides behind it with eased lag, stretching slightly with velocity. Over
   interactive elements the ring widens and turns jade; on press it contracts.
   Replaces the native cursor on fine pointers; reduced motion keeps the
   system cursor. */

import { useEffect, useRef } from "react";

const INTERACTIVE = "a, button, summary, .chip-btn";
const FIELDS = "input, textarea, select";

export default function CursorGlow() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const fine = matchMedia("(pointer: fine)");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");

    let active = false;
    let shown = false;
    let mx = -100;
    let my = -100;
    let rx = -100;
    let ry = -100;
    let raf: number | null = null;

    function tick() {
      const dx = mx - rx;
      const dy = my - ry;
      rx += dx * 0.16;
      ry += dy * 0.16;
      /* velocity stretch: the ring leans into fast movement */
      const v = Math.hypot(dx, dy);
      const s = Math.min(0.16, v * 0.004);
      const ang = Math.atan2(dy, dx);
      ring!.style.transform =
        `translate3d(${rx.toFixed(1)}px, ${ry.toFixed(1)}px, 0) ` +
        `rotate(${ang.toFixed(3)}rad) scale(${(1 + s).toFixed(3)}, ${(1 - s * 0.55).toFixed(3)}) ` +
        `rotate(${(-ang).toFixed(3)}rad)`;
      if (v > 0.15) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = null;
      }
    }

    const kick = () => {
      if (raf === null) raf = requestAnimationFrame(tick);
    };

    function onMove(e: PointerEvent) {
      if (!active) return;
      mx = e.clientX;
      my = e.clientY;
      dot!.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      if (!shown) {
        shown = true;
        rx = mx;
        ry = my;
        document.documentElement.classList.add("cursor-live");
      }
      kick();
    }

    function onOver(e: PointerEvent) {
      if (!active) return;
      const t = e.target as Element | null;
      const hot = !!t?.closest?.(INTERACTIVE);
      const field = !!t?.closest?.(FIELDS);
      document.documentElement.classList.toggle("cursor-hot", hot);
      document.documentElement.classList.toggle("cursor-field", field);
    }

    function onDown() {
      if (active) document.documentElement.classList.add("cursor-press");
    }
    function onUp() {
      document.documentElement.classList.remove("cursor-press");
    }
    function onLeave() {
      shown = false;
      document.documentElement.classList.remove("cursor-live");
    }

    function apply() {
      const want = fine.matches && !reduced.matches;
      if (want === active) return;
      active = want;
      const root = document.documentElement;
      if (active) {
        root.classList.add("cursor-custom");
        addEventListener("pointermove", onMove, { passive: true });
        addEventListener("pointerover", onOver, { passive: true });
        addEventListener("pointerdown", onDown, { passive: true });
        addEventListener("pointerup", onUp, { passive: true });
        root.addEventListener("pointerleave", onLeave);
      } else {
        root.classList.remove(
          "cursor-custom",
          "cursor-live",
          "cursor-hot",
          "cursor-press",
          "cursor-field"
        );
        removeEventListener("pointermove", onMove);
        removeEventListener("pointerover", onOver);
        removeEventListener("pointerdown", onDown);
        removeEventListener("pointerup", onUp);
        root.removeEventListener("pointerleave", onLeave);
        if (raf !== null) {
          cancelAnimationFrame(raf);
          raf = null;
        }
      }
    }

    fine.addEventListener("change", apply);
    reduced.addEventListener("change", apply);
    apply();

    return () => {
      fine.removeEventListener("change", apply);
      reduced.removeEventListener("change", apply);
      removeEventListener("pointermove", onMove);
      removeEventListener("pointerover", onOver);
      removeEventListener("pointerdown", onDown);
      removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove(
        "cursor-custom",
        "cursor-live",
        "cursor-hot",
        "cursor-press",
        "cursor-field"
      );
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div className="cursor-ring" ref={ringRef} aria-hidden="true" />
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
    </>
  );
}
