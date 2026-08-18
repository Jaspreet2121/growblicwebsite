"use client";

import { useEffect, useRef } from "react";
import Mark from "./Mark";

export default function Nav() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = ref.current;
    if (!nav) return;
    let scrolled = false;
    const onScroll = () => {
      const want = window.scrollY > 24;
      if (want !== scrolled) {
        scrolled = want;
        nav.classList.toggle("scrolled", want);
      }
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className="nav" ref={ref} aria-label="Main">
      <a className="nav-brand" href="/#top">
        <Mark />
        Growblic
      </a>
      <ul className="nav-links">
        <li>
          <a href="/#services">Services</a>
        </li>
        <li>
          <a href="/apps">Apps</a>
        </li>
        <li>
          <a href="/#estimate">Pricing</a>
        </li>
        <li>
          <a href="/#faq">FAQ</a>
        </li>
      </ul>
      <a className="btn btn-solid" href="/#start">
        Start your project
      </a>
    </nav>
  );
}
