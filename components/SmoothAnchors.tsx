"use client";

/* Hash links, handled deliberately. Same-page anchors are intercepted in the
   capture phase (ahead of next/link, which would otherwise swallow them) and
   scroll smoothly; cross-page hash navigation gets an explicit landing on
   its target after the route renders. Global CSS smooth-scrolling is
   deliberately absent: it fights the router's scroll-to-top. */

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function SmoothAnchors() {
  const pathname = usePathname();

  /* same-page hash: smooth scroll, no navigation */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      const a = (e.target as Element | null)?.closest?.(
        "a[href]"
      ) as HTMLAnchorElement | null;
      if (!a) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || !url.hash) return;
      if (url.pathname !== location.pathname) return;
      const el = document.querySelector(url.hash);
      if (!el) return;
      e.preventDefault();
      e.stopPropagation();
      const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
      history.pushState(null, "", url.hash);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  /* cross-page hash: land on the target once the new route has rendered */
  useEffect(() => {
    if (!location.hash) return;
    const el = document.querySelector(location.hash);
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "auto", block: "start" });
    });
  }, [pathname]);

  return null;
}
