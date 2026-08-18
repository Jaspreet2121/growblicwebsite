"use client";

/* The project estimator: pick what you need, and the choices prefill the
   contact form for a same-day fixed quote. No invented prices; the quote is
   the number, and it comes from a human. */

import { useMemo, useState } from "react";

const TYPES = [
  "Website",
  "Mobile app",
  "SaaS platform",
  "Dashboard or CRM",
  "AI automation",
];

const SIZES = [
  { label: "MVP first", note: "the smallest version that proves it" },
  { label: "Standard build", note: "the full product, core features" },
  { label: "Full product", note: "accounts, payments, admin, the works" },
];

const GROWTH = ["SEO", "Google Ads", "Meta Ads", "Reviews management"];

export default function Estimator() {
  const [type, setType] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [growth, setGrowth] = useState<string[]>([]);

  const summary = useMemo(() => {
    if (!type && !size && growth.length === 0) return null;
    const parts: string[] = [];
    parts.push(
      `I want to build a ${size ? size.toLowerCase() + " " : ""}${
        type ? type.toLowerCase() : "project"
      }.`
    );
    if (growth.length > 0) parts.push(`Growth: ${growth.join(", ")}.`);
    return parts.join(" ");
  }, [type, size, growth]);

  function toggleGrowth(g: string) {
    setGrowth((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    );
  }

  function sendToForm() {
    if (!summary) return;
    try {
      sessionStorage.setItem("growblic-estimate", summary);
    } catch {}
    window.dispatchEvent(
      new CustomEvent("growblic-estimate", { detail: summary })
    );
  }

  return (
    <div className="estimator">
      <div className="est-controls">
        <div className="est-group">
          <p className="est-label">What are we building?</p>
          <div className="chips" role="group" aria-label="Project type">
            {TYPES.map((t) => (
              <button
                key={t}
                type="button"
                className={`chip-btn${type === t ? " sel" : ""}`}
                aria-pressed={type === t}
                onClick={() => setType(type === t ? null : t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="est-group">
          <p className="est-label">How big?</p>
          <div className="chips" role="group" aria-label="Project size">
            {SIZES.map((s) => (
              <button
                key={s.label}
                type="button"
                className={`chip-btn${size === s.label ? " sel" : ""}`}
                aria-pressed={size === s.label}
                onClick={() => setSize(size === s.label ? null : s.label)}
                title={s.note}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
        <div className="est-group">
          <p className="est-label">Grow it after launch? Pick any.</p>
          <div className="chips" role="group" aria-label="Growth services">
            {GROWTH.map((g) => (
              <button
                key={g}
                type="button"
                className={`chip-btn${growth.includes(g) ? " sel" : ""}`}
                aria-pressed={growth.includes(g)}
                onClick={() => toggleGrowth(g)}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="est-out">
        <p className="est-label">Your project</p>
        <p className="est-summary">
          {summary || "Pick a few options and your plan takes shape here."}
        </p>
        <a
          className={`btn btn-solid${summary ? "" : " btn-off"}`}
          href="#start"
          tabIndex={summary ? undefined : -1}
          onClick={(e) => {
            if (!summary) {
              e.preventDefault();
              return;
            }
            sendToForm();
          }}
          aria-disabled={!summary}
        >
          Get my fixed quote
        </a>
        <p className="est-note">
          A real number from a real person, the same business day. Never a
          surprise invoice.
        </p>
      </div>
    </div>
  );
}
