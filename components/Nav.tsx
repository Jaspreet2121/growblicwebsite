"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Mark from "./Mark";
import SoundToggle from "./SoundToggle";

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
      <Link className="nav-brand" href="/">
        <Mark />
        Growblic
      </Link>
      <ul className="nav-links">
        <li>
          <Link href="/#services">Services</Link>
        </li>
        <li>
          <Link href="/apps">Apps</Link>
        </li>
        <li>
          <Link href="/about">About</Link>
        </li>
        <li>
          <Link href="/pricing">Pricing</Link>
        </li>
        <li>
          <Link href="/#faq">FAQ</Link>
        </li>
        <li>
          <Link href="/careers">Careers</Link>
        </li>
      </ul>
      <span className="nav-right">
        <SoundToggle />
        <a
          className="btn btn-solid"
          href="mailto:hello@growblic.com?subject=Start%20a%20project"
        >
          Start your project
        </a>
      </span>
    </nav>
  );
}
