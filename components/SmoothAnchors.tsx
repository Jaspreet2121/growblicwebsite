"use client";

/* Same-page anchor links scroll smoothly; page navigation stays instant.
   Global CSS smooth-scrolling is deliberately absent: it fights the
   router's scroll-to-top and strands visitors mid-page. */

import { useEffect } from "react";

export default function SmoothAnchors() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as Element | null)?.closest?.(
        "a[href]"
      ) as HTMLAnchorElement | null;
      if (!a) return;
      const url = new URL(a.href, location.href);
      if (
        url.origin !== location.origin ||
        url.pathname !== location.pathname ||
        !url.hash
      )
        return;
      const el = document.querySelector(url.hash);
      if (!el) return;
      e.preventDefault();
      const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
      history.pushState(null, "", url.hash);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
