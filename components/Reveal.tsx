"use client";

/* Entrance choreography: IntersectionObserver adds .in, and once the staggered
   entrance has played, .done retires every transition-delay so later hovers
   never lag. Children opt in with className="r" and style={{ "--i": n }}. */

import { useEffect, useRef } from "react";

export default function Reveal({
  as: Tag = "section",
  className = "",
  id,
  children,
}: {
  as?: "section" | "div";
  className?: string;
  id?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.classList.add("in", "done");
      return;
    }
    /* threshold 0: tall sections (which never reach a high visible ratio on
       small screens) must still fire the moment they enter */
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          el.classList.add("in");
          const count = el.querySelectorAll(".r").length;
          setTimeout(() => el.classList.add("done"), 900 + count * 90);
          io.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      className={`sec ${className}`}
      id={id}
      ref={ref as React.Ref<HTMLElement & HTMLDivElement>}
    >
      {children}
    </Tag>
  );
}
