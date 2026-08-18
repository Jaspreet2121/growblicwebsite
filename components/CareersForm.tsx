"use client";

import { useEffect, useRef, useState } from "react";

type Status = "idle" | "sending" | "done" | "error";

const ROLES = [
  "Engineering",
  "Design",
  "Growth marketing",
  "Internship",
];

export default function CareersForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [role, setRole] = useState(ROLES[0]);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "done") successRef.current?.focus();
  }, [status]);

  /* the role cards preselect their track here */
  useEffect(() => {
    const onRole = (e: Event) => {
      const r = String((e as CustomEvent).detail || "");
      if (ROLES.includes(r)) setRole(r);
    };
    window.addEventListener("growblic-role", onRole);
    return () => window.removeEventListener("growblic-role", onRole);
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div>
      <p className="sr" role="status">
        {status === "sending"
          ? "Sending your application."
          : status === "done"
          ? "Application sent. We reply within a few days."
          : ""}
      </p>
      {status === "done" ? (
        <div className="form-success" ref={successRef} tabIndex={-1}>
          <svg
            className="mark-ok"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <path
              d="M8 12.5l2.6 2.6L16 9.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p>Got it. We read every application and reply within a few days.</p>
        </div>
      ) : (
        <form className="form-grid" onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="ca-name">Your name</label>
            <input id="ca-name" name="name" type="text" required autoComplete="name" />
          </div>
          <div className="field">
            <label htmlFor="ca-email">Email</label>
            <input id="ca-email" name="email" type="email" required autoComplete="email" />
          </div>
          <div className="field">
            <label htmlFor="ca-role">Applying for</label>
            <select
              id="ca-role"
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="ca-link">Portfolio or LinkedIn (optional)</label>
            <input id="ca-link" name="link" type="url" placeholder="https://" />
          </div>
          <div className="field full">
            <label htmlFor="ca-msg">Why you?</label>
            <textarea id="ca-msg" name="message" required />
          </div>
          <div className="form-foot full">
            <button
              className="btn btn-solid"
              type="submit"
              disabled={status === "sending"}
            >
              {status === "sending" ? "Sending..." : "Send application"}
            </button>
            <p className="alt">
              Prefer email? <a href="mailto:hello@growblic.com?subject=Application">hello@growblic.com</a>
            </p>
          </div>
          {status === "error" && (
            <p className="form-error full" role="alert">
              Something went wrong on our end. Email us instead:
              hello@growblic.com
            </p>
          )}
        </form>
      )}
    </div>
  );
}
