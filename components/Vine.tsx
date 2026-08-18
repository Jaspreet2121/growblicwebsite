"use client";

/* The signature element: one continuous circuit-vine that draws itself down
   the page as the visitor scrolls, branching a node into each section as it
   arrives. Scroll writes are delta-gated; reduced motion shows it fully drawn
   (the CSS pins it, and the drive keeps running so a live flip back re-arms). */

import { useEffect, useRef } from "react";

export default function Vine() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const svg = wrap.querySelector("svg")!;
    const stem = svg.querySelector<SVGPathElement>(".stem")!;
    const parent = wrap.parentElement!;

    let nodes: { el: SVGCircleElement; frac: number; lit: boolean }[] = [];
    let lastDraw = -1;
    let raf: number | null = null;

    function build() {
      const H = parent.offsetHeight;
      const W = 120;
      svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
      svg.setAttribute("preserveAspectRatio", "none");

      const anchors = Array.from(
        document.querySelectorAll<HTMLElement>("[data-vine-node]")
      );
      const parentTop = parent.getBoundingClientRect().top + window.scrollY;
      const ys = anchors.map((a) => {
        const r = a.getBoundingClientRect();
        return r.top + window.scrollY - parentTop + 40;
      });

      const cx = W * 0.5;
      let d = `M ${cx} 0`;
      let prevY = 0;
      ys.forEach((y, i) => {
        const bend = i % 2 === 0 ? 26 : -26;
        const mid = (prevY + y) / 2;
        d += ` C ${cx + bend} ${mid}, ${cx + bend} ${mid}, ${cx} ${y}`;
        prevY = y;
      });
      d += ` C ${cx - 20} ${(prevY + H) / 2}, ${cx - 20} ${(prevY + H) / 2}, ${cx} ${H}`;
      stem.setAttribute("d", d);
      stem.setAttribute("pathLength", "1");

      svg.querySelectorAll(".node").forEach((n) => n.remove());
      const total = stem.getTotalLength();
      nodes = ys.map((y) => {
        const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        c.setAttribute("class", "node");
        c.setAttribute("cx", String(cx));
        c.setAttribute("cy", String(y));
        c.setAttribute("r", "3.5");
        svg.appendChild(c);
        /* Fraction of the path length at this node's height, approximated by
           sampling. Good enough for lighting order. */
        let frac = y / H;
        for (let t = 0; t <= 1; t += 0.02) {
          if (stem.getPointAtLength(t * total).y >= y) {
            frac = t;
            break;
          }
        }
        return { el: c, frac, lit: false };
      });
      lastDraw = -1;
      onScroll();
    }

    function onScroll() {
      if (raf !== null) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const parentTop = parent.getBoundingClientRect().top + window.scrollY;
        const draw = Math.min(
          1,
          Math.max(
            0,
            (window.scrollY + window.innerHeight * 0.72 - parentTop) /
              parent.offsetHeight
          )
        );
        if (Math.abs(draw - lastDraw) > 0.004) {
          lastDraw = draw;
          stem.style.strokeDashoffset = String(1 - draw);
          nodes.forEach((n) => {
            const want = draw >= n.frac;
            if (want !== n.lit) {
              n.lit = want;
              n.el.classList.toggle("lit", want);
            }
          });
        }
      });
    }

    build();
    const ro = new ResizeObserver(() => build());
    ro.observe(parent);
    addEventListener("scroll", onScroll, { passive: true });

    return () => {
      ro.disconnect();
      removeEventListener("scroll", onScroll);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="vine" ref={wrapRef} aria-hidden="true">
      <svg>
        <path className="stem" d="M 60 0 L 60 100" />
      </svg>
    </div>
  );
}
