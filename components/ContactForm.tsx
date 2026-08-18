"use client";

import { useEffect, useRef, useState } from "react";

type Status = "idle" | "sending" | "done" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const successRef = useRef<HTMLDivElement>(null);

  /* keep keyboard focus with the confirmation once the form unmounts */
  useEffect(() => {
    if (status === "done") successRef.current?.focus();
  }, [status]);

  /* The estimator hands its summary here. */
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("growblic-estimate");
      if (stored) setMessage(stored);
    } catch {}
    const onEstimate = (e: Event) => {
      setMessage(String((e as CustomEvent).detail || ""));
    };
    window.addEventListener("growblic-estimate", onEstimate);
    return () => window.removeEventListener("growblic-estimate", onEstimate);
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/contact", {
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
      {/* stable live region: mounted before its content changes, so state
          announcements are actually read out */}
      <p className="sr" role="status">
        {status === "sending"
          ? "Sending your message."
          : status === "done"
          ? "Message sent. You will hear from us within one business day."
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
          <p>Got it. You will hear from us within one business day.</p>
        </div>
      ) : (
        <form className="form-grid" onSubmit={onSubmit}>
          <div className="field">
        <label htmlFor="cf-name">Your name</label>
        <input id="cf-name" name="name" type="text" required autoComplete="name" />
      </div>
      <div className="field">
        <label htmlFor="cf-email">Email</label>
        <input id="cf-email" name="email" type="email" required autoComplete="email" />
      </div>
      <div className="field full">
        <label htmlFor="cf-msg">What are you building?</label>
        <textarea
          id="cf-msg"
          name="message"
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <div className="form-foot full">
        <button className="btn btn-solid" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending..." : "Send message"}
        </button>
        <p className="alt">
          Prefer email? <a href="mailto:hello@growblic.com">hello@growblic.com</a>
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
