"use client";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { chromeMessages } from "./chrome-messages";
import type { Locale } from "./i18n";

export function MobileCarousel({ children, locale, label, className }: {
  children: ReactNode; locale: Locale; label: string; className: string;
}) {
  const track = useRef<HTMLDivElement>(null);
  const id = useId();
  const copy = chromeMessages[locale];
  const [edges, setEdges] = useState({ previous: false, next: true });
  function syncEdges() {
    const el = track.current;
    if (!el) return;
    const previous = Math.abs(el.scrollLeft) > 2;
    const next = Math.abs(el.scrollLeft) < el.scrollWidth - el.clientWidth - 2;
    setEdges(old => old.previous === previous && old.next === next ? old : { previous, next });
  }
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const observer = new ResizeObserver(syncEdges);
    observer.observe(el);
    syncEdges();
    return () => observer.disconnect();
  }, []);
  function move(direction: number) {
    const el = track.current;
    if (!el) return;
    const first = el.firstElementChild;
    const step = first ? first.getBoundingClientRect().width + parseFloat(getComputedStyle(el).columnGap || "0") : el.clientWidth;
    el.scrollBy({ left: direction * step * (locale === "ar" ? -1 : 1), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }
  return <div className="mobile-carousel">
    <div ref={track} id={id} className={`${className} mobile-carousel-track`} onScroll={syncEdges} tabIndex={0} role="region" aria-label={label}
      onKeyDown={event => {
        if (event.target !== event.currentTarget) return;
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault();
          move((event.key === "ArrowRight" ? 1 : -1) * (locale === "ar" ? -1 : 1));
        }
      }}>{children}</div>
    <div className="mobile-carousel-controls">
      <button type="button" aria-label={`${copy.previous}: ${label}`} aria-controls={id} disabled={!edges.previous} onClick={() => move(-1)}><ArrowLeft size={19}/></button>
      <button type="button" aria-label={`${copy.next}: ${label}`} aria-controls={id} disabled={!edges.next} onClick={() => move(1)}><ArrowRight size={19}/></button>
    </div>
  </div>;
}
