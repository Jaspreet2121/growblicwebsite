"use client";

/* The one fixed environment behind everything: a slow radial drift and
   whisper-level motes. Pauses entirely while the tab is hidden. */

import { useEffect } from "react";

export default function EnvLayer() {
  useEffect(() => {
    const onVis = () => {
      document.body.classList.toggle("paused", document.hidden);
    };
    document.addEventListener("visibilitychange", onVis);
    onVis();
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return (
    <div className="env" aria-hidden="true">
      <span className="mote" />
      <span className="mote" />
      <span className="mote" />
      <span className="mote" />
      <span className="mote" />
    </div>
  );
}
