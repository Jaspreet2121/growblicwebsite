"use client";

/* The scroll-scrubbed hero. Engineering per the proven standard:
   Blob fetch behind a streamed loading ring, dt-normalized lerp that rests,
   gated seeks with a deadlock escape, delta-gated DOM writes, five static-hero
   gates identical to the CSS, complete-without-video. */

import { useEffect, useRef } from "react";
import Mark from "./Mark";

const VIDEO_URL = "/assets/hero-scrub.mp4";
const POSTER_URL = "/assets/hero-poster.jpg";
/* The real encoded size of hero-scrub.mp4. Fallback when Content-Length is
   missing. */
const VIDEO_BYTES = 4_772_286;

/* These five strings are duplicated character-for-character in globals.css.
   Change both or neither. */
const GATES = [
  "(max-width: 720px)",
  "(orientation: portrait) and (max-width: 1024px)",
  "(orientation: portrait) and (pointer: coarse)",
  "(orientation: landscape) and (pointer: coarse) and (max-height: 560px)",
  "(prefers-reduced-motion: reduce)",
];

type Entrance = "drift" | "scatter" | "grid" | "punch" | "rise";

interface BandDef {
  a: number;
  b: number;
  side: "left" | "right" | "settle";
  entrance: Entrance;
  lines: { text: string; secondary?: boolean }[];
}

const BANDS: BandDef[] = [
  {
    a: 0.0,
    b: 0.15,
    side: "left",
    entrance: "drift",
    lines: [{ text: "Every great product starts as a seed." }],
  },
  {
    a: 0.19,
    b: 0.38,
    side: "right",
    entrance: "scatter",
    lines: [{ text: "We grow ideas into software people love to use." }],
  },
  {
    a: 0.42,
    b: 0.6,
    side: "left",
    entrance: "grid",
    lines: [
      { text: "Websites. Apps. SaaS. AI." },
      { text: "Engineered to fit your business exactly.", secondary: true },
    ],
  },
  {
    a: 0.64,
    b: 0.79,
    side: "right",
    entrance: "punch",
    lines: [
      { text: "Your code. Your accounts. Your product." },
      { text: "From day one.", secondary: true },
    ],
  },
  { a: 0.85, b: 1.0, side: "settle", entrance: "rise", lines: [] },
];

const smoothstep = (p: number, e0: number, e1: number) => {
  const t = Math.min(1, Math.max(0, (p - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

function rng(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

const EM_WORDS = /^(code|accounts|product)[.,!?]?$/i;

function splitEl(
  el: HTMLElement,
  type: Entrance,
  seed: number,
  thBase = 0,
  thSpread = 0.5
) {
  /* idempotent: Strict Mode double-mounts and any remount must not re-split */
  if (el.dataset.split === "1") return;
  el.dataset.split = "1";
  const text = el.textContent || "";
  el.textContent = "";
  const sr = document.createElement("span");
  sr.className = "sr";
  sr.textContent = text;
  const vis = document.createElement("span");
  vis.setAttribute("aria-hidden", "true");
  const words = text.split(" ");
  const r = rng(seed);
  const totalChars = text.length || 1;
  let ci = 0;
  words.forEach((word, wi) => {
    const w = document.createElement("span");
    w.className = "w";
    if (type === "punch" || type === "drift" || type === "rise") {
      w.style.setProperty(
        "--th",
        ((wi / words.length) * thSpread + thBase + r() * 0.05).toFixed(3)
      );
      if (type === "punch" && EM_WORDS.test(word)) w.classList.add("em");
      w.textContent = word;
    } else {
      for (const ch of word) {
        const c = document.createElement("span");
        c.className = "c";
        c.textContent = ch;
        if (type === "scatter") {
          c.style.setProperty("--th", (thBase + r() * thSpread).toFixed(3));
          c.style.setProperty("--jx", (r() * 44 - 22).toFixed(1) + "px");
          c.style.setProperty("--jy", (r() * 36 - 18).toFixed(1) + "px");
          c.style.setProperty("--jr", (r() * 22 - 11).toFixed(1) + "deg");
        } else {
          c.style.setProperty(
            "--th",
            (thBase + (ci / totalChars) * thSpread + r() * 0.05).toFixed(3)
          );
          c.style.setProperty("--jx", (r() * 60 + 20).toFixed(1) + "px");
        }
        ci++;
        w.appendChild(c);
      }
    }
    vis.appendChild(w);
    if (wi < words.length - 1) vis.appendChild(document.createTextNode(" "));
  });
  el.appendChild(sr);
  el.appendChild(vis);
}

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const stage = hero.querySelector<HTMLElement>(".stage")!;
    const video = hero.querySelector<HTMLVideoElement>("video")!;
    const posterLayer = hero.querySelector<HTMLElement>(".poster")!;
    const ring = hero.querySelector<SVGCircleElement>(".ring circle")!;
    const cue = hero.querySelector<HTMLElement>(".cue")!;
    const bandEls = Array.from(hero.querySelectorAll<HTMLElement>(".band"));

    /* Split headline text once, seeded, identical on every load. */
    bandEls.forEach((bandEl, i) => {
      const def = BANDS[i];
      bandEl.querySelectorAll<HTMLElement>(".split").forEach((el, li) => {
        const secondary = el.dataset.secondary === "1";
        splitEl(
          el,
          secondary ? "rise" : def.entrance,
          77 + i * 131 + li * 17,
          secondary ? 0.55 : 0,
          secondary ? 0.3 : def.entrance === "grid" ? 0.42 : 0.5
        );
      });
    });

    /* ---- state ---- */
    let scrollRange = 1;
    let target = 0;
    let shown = 0;
    let rafId: number | null = null;
    let lastTick = 0;
    let heroOnScreen = true;
    let scrubOn = false;
    let heroInit = false;
    let loadK = 0;
    let loadKStart = 0;
    let destroyed = false;

    const opCache = BANDS.map(() => -1);
    const kCache = BANDS.map(() => -1);
    let settleOn = false;
    let cueGone = false;

    const measure = () => {
      scrollRange = Math.max(1, hero.offsetHeight - window.innerHeight);
    };
    measure();

    const heroProgress = () =>
      clamp((window.scrollY - hero.offsetTop) / scrollRange, 0, 1);

    /* ---- gated seeks (deadlock-safe, with a watchdog) ---- */
    let seekBusy = false;
    let pendingTime: number | null = null;
    let seekIssuedAt = 0;

    function requestSeek(t: number) {
      if (!video.duration) return;
      if (seekBusy) {
        /* a seek that has gone unanswered means the browser suspended the
           element (long idle, background tab): force the gate open so
           scrubbing can never freeze for good */
        if (performance.now() - seekIssuedAt > 600) {
          seekBusy = false;
        } else {
          pendingTime = t;
          return;
        }
      }
      seekBusy = true;
      seekIssuedAt = performance.now();
      video.currentTime = t;
    }

    const onSeeked = () => {
      seekBusy = false;
      if (pendingTime !== null) {
        const t = pendingTime;
        pendingTime = null;
        requestSeek(t);
      }
    };
    const onVideoError = () => {
      seekBusy = false;
      pendingTime = null;
      failVideo();
    };
    video.addEventListener("seeked", onSeeked);
    video.addEventListener("error", onVideoError);

    /* ---- caption bands, delta-gated ---- */
    function updateCaptions(p: number) {
      for (let i = 0; i < BANDS.length; i++) {
        const { a, b } = BANDS[i];
        const f = Math.min(0.02, (b - a) / 3);
        let op: number;
        if (i === 0) {
          op = 1 - smoothstep(p, b - f, b);
        } else if (i === BANDS.length - 1) {
          op = smoothstep(p, a, a + f);
        } else {
          op = smoothstep(p, a, a + f) * (1 - smoothstep(p, b - f, b));
        }
        const ramp = Math.min(0.025, (b - a) * 0.35);
        let k = clamp((p - a) / ramp, 0, 1);
        if (i === 0) k = Math.max(k, loadK);
        if (Math.abs(op - opCache[i]) > 0.008 || (op === 0 && opCache[i] !== 0)) {
          opCache[i] = op;
          bandEls[i].style.opacity = op.toFixed(3);
        }
        if (Math.abs(k - kCache[i]) > 0.008 || (k === 1 && kCache[i] !== 1)) {
          kCache[i] = k;
          bandEls[i].style.setProperty("--k", k.toFixed(3));
        }
      }
      const lastOp = opCache[BANDS.length - 1];
      if (!settleOn && lastOp > 0.5) {
        settleOn = true;
        const settle = bandEls[BANDS.length - 1];
        settle.classList.add("on");
        settle
          .querySelectorAll<HTMLElement>(".btn")
          .forEach((btn) => (btn.tabIndex = 0));
      } else if (settleOn && lastOp < 0.5) {
        settleOn = false;
        const settle = bandEls[BANDS.length - 1];
        settle.classList.remove("on");
        settle
          .querySelectorAll<HTMLElement>(".btn")
          .forEach((btn) => (btn.tabIndex = -1));
      }
      if (!cueGone && p > 0.02) {
        cueGone = true;
        cue.classList.add("gone");
      } else if (cueGone && p <= 0.02) {
        cueGone = false;
        cue.classList.remove("gone");
      }
    }

    /* ---- the drive loop (rests when converged) ---- */
    function tick(now: number) {
      const dt = Math.min(100, now - (lastTick || now));
      lastTick = now;
      const k = 0.16;
      shown += (target - shown) * (1 - Math.pow(1 - k, dt / 16.667));
      if (loadKStart) {
        loadK = clamp((now - loadKStart) / 1600, 0, 1);
        loadK = loadK * loadK * (3 - 2 * loadK);
        if (loadK >= 1) loadKStart = 0;
      }
      const converged =
        Math.abs(target - shown) < 0.0005 && loadKStart === 0;
      if (converged) {
        shown = target;
        rafId = null;
        lastTick = 0;
      } else {
        rafId = requestAnimationFrame(tick);
      }
      if (video.duration) requestSeek(shown * video.duration);
      updateCaptions(shown);
    }

    const kick = () => {
      if (rafId === null && heroOnScreen && scrubOn)
        rafId = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      target = heroProgress();
      kick();
    };

    const onResize = () => {
      measure();
      onScroll();
    };

    /* ---- the Blob loader with the streamed ring ---- */
    let blobStarted = false;
    let posterTimer: ReturnType<typeof setTimeout> | null = null;
    let posterImg: HTMLImageElement | null = null;

    function startBlobFetch() {
      if (blobStarted || destroyed) return;
      blobStarted = true;
      loadHeroBlob().catch(failVideo);
    }

    async function loadHeroBlob() {
      if (destroyed) return;
      const ctrl = new AbortController();
      let watchdog = setTimeout(() => ctrl.abort(), 20000);
      const res = await fetch(VIDEO_URL, {
        priority: "low",
        signal: ctrl.signal,
      } as RequestInit);
      if (!res.ok || !res.body) throw new Error("video fetch failed");
      const total = Number(res.headers.get("Content-Length")) || VIDEO_BYTES;
      const reader = res.body.getReader();
      const chunks: Uint8Array[] = [];
      let got = 0;
      let lastRing = 0;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        clearTimeout(watchdog);
        watchdog = setTimeout(() => ctrl.abort(), 20000);
        chunks.push(value);
        got += value.length;
        const frac = Math.min(1, got / total);
        const now = performance.now();
        if (now - lastRing > 100 || frac === 1) {
          lastRing = now;
          ring.style.strokeDashoffset = String(Math.round(126 * (1 - frac)));
          window.dispatchEvent(
            new CustomEvent("growblic-hero-progress", { detail: frac })
          );
        }
      }
      clearTimeout(watchdog);
      if (destroyed) return;
      ring.style.strokeDashoffset = "0";
      video.src = URL.createObjectURL(new Blob(chunks as BlobPart[]));
      video.load();
      video.addEventListener(
        "canplay",
        () => {
          requestSeek(heroProgress() * video.duration);
          stage.classList.add("video-ready");
          window.dispatchEvent(new CustomEvent("growblic-hero-ready"));
        },
        { once: true }
      );
    }

    function failVideo() {
      stage.classList.add("video-failed");
    }

    function initHeroOnce() {
      if (heroInit) return;
      heroInit = true;
      posterLayer.style.backgroundImage = `url('${POSTER_URL}')`;
      posterImg = new Image();
      posterImg.onload = startBlobFetch;
      posterImg.onerror = startBlobFetch;
      posterImg.src = POSTER_URL;
      posterTimer = setTimeout(startBlobFetch, 4000);
      loadKStart = performance.now();
    }

    /* ---- the five gates, decided live ---- */
    function enableScrub() {
      if (scrubOn) return;
      scrubOn = true;
      initHeroOnce();
      addEventListener("scroll", onScroll, { passive: true });
      addEventListener("resize", onResize);
      opCache.fill(-1);
      kCache.fill(-1);
      measure();
      updateCaptions(heroProgress());
      onScroll();
    }

    function disableScrub() {
      if (!scrubOn) return;
      scrubOn = false;
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onResize);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
        lastTick = 0;
      }
    }

    function applyHeroMode() {
      if (GATES.some((q) => matchMedia(q).matches)) disableScrub();
      else enableScrub();
    }

    const MQLS = GATES.map((q) => matchMedia(q));
    MQLS.forEach((m) => m.addEventListener("change", applyHeroMode));

    const io = new IntersectionObserver(
      (entries) => {
        heroOnScreen = entries[0].isIntersecting;
        if (heroOnScreen) {
          target = heroProgress();
          kick();
        }
      },
      { threshold: 0 }
    );
    io.observe(hero);

    /* after long idle or a background stay the browser may suspend or drop
       the media element; on return, reset the gate and revive the film */
    const onWake = () => {
      if (document.hidden || !scrubOn) return;
      seekBusy = false;
      pendingTime = null;
      if (video.src && video.readyState < 2 && !stage.classList.contains("video-failed")) {
        try {
          video.load();
        } catch {}
        video.addEventListener(
          "canplay",
          () => requestSeek(heroProgress() * video.duration),
          { once: true }
        );
      } else if (video.duration) {
        requestSeek(heroProgress() * video.duration);
      }
      target = heroProgress();
      kick();
    };
    document.addEventListener("visibilitychange", onWake);
    addEventListener("pageshow", onWake);
    addEventListener("focus", onWake);

    /* band one's entrance ramp restarts when the splash releases, so the
       opening line assembles in view instead of behind the preloader */
    const onSplashDone = () => {
      if (scrubOn) {
        loadKStart = performance.now();
        kick();
      }
    };
    window.addEventListener("growblic-splash-done", onSplashDone);

    applyHeroMode();

    /* invisible settle CTAs start out of the tab order */
    bandEls[BANDS.length - 1]
      .querySelectorAll<HTMLElement>(".btn")
      .forEach((btn) => (btn.tabIndex = -1));

    return () => {
      destroyed = true;
      disableScrub();
      if (posterTimer !== null) clearTimeout(posterTimer);
      if (posterImg) {
        posterImg.onload = null;
        posterImg.onerror = null;
      }
      MQLS.forEach((m) => m.removeEventListener("change", applyHeroMode));
      io.disconnect();
      document.removeEventListener("visibilitychange", onWake);
      removeEventListener("pageshow", onWake);
      removeEventListener("focus", onWake);
      window.removeEventListener("growblic-splash-done", onSplashDone);
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("error", onVideoError);
    };
  }, []);

  return (
    <section className="hero" id="top" ref={heroRef}>
      <div className="stage">
        <h1 className="sr">Growblic. Growth, engineered.</h1>
        <div className="poster" aria-hidden="true" />
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video preload="none" muted playsInline aria-hidden="true" tabIndex={-1} />
        <div className="scrim" aria-hidden="true" />

        <div className="bands" aria-hidden="false">
          {BANDS.slice(0, 4).map((band, i) => (
            <div key={i} className={`band band--${band.side}`}>
              <div className="copy">
                {band.lines.map((line, li) => (
                  <p
                    key={li}
                    className={`line split e-${
                      line.secondary ? "rise" : band.entrance
                    }`}
                    data-secondary={line.secondary ? "1" : "0"}
                  >
                    {line.text}
                  </p>
                ))}
              </div>
            </div>
          ))}

          <div className="band band--settle">
            <div className="copy">
              <p className="settle-wordmark" aria-hidden="true">
                <Mark />
                Growblic
              </p>
              <p className="settle-line">Growth, engineered.</p>
              <div className="bloom-window" aria-hidden="true" />
              <div className="settle-ctas">
                <a className="btn btn-solid" href="#work">
                  See the work
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="static-hero">
          <p className="sh-h1" aria-hidden="true">
            Growth, engineered.
          </p>
          <p>
            Growblic designs, builds, and grows websites, apps, SaaS, and AI
            products for modern businesses.
          </p>
          <a className="btn btn-solid" href="#work">
            See our work
          </a>
        </div>

        <svg className="ring" viewBox="0 0 48 48" aria-hidden="true">
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray="126"
            style={{ strokeDashoffset: 126 }}
          />
        </svg>

        <div className="cue" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </section>
  );
}
