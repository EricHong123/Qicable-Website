"use client";
import { BannerVideo } from "./banner-video";
import { ResponsiveImage } from "./responsive-image";

import { useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { Locale } from "./i18n";
import { chromeMessages } from "./chrome-messages";

export type HomeSlide = {
  id: string;
  title: string;
  url: string;
  photograph?: boolean;
  video?: boolean;
  images: { src: string; alt: string; label: string }[];
};

export function HomeCarousel({
  locale,
  slides,
  action,
  videoDescription,
  videoCopy,
  children,
}: {
  locale: Locale;
  slides: HomeSlide[];
  action: string;
  videoDescription: string;
  videoCopy: {title:string;play:string;pause:string};
  children: ReactNode;
}) {
  const [active, setActive] = useState(0);
  const viewport = useRef<HTMLDivElement>(null);
  const t = chromeMessages[locale];
  function goTo(index: number) {
    const track = viewport.current;
    if (!track) return;
    const next = (index + slides.length) % slides.length;
    track.scrollTo({
      left: next * track.clientWidth * (locale === "ar" ? -1 : 1),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }
  return (
    <section className="hero-carousel" aria-label={t.carousel}>
      <div className="hero-overlay container">
        <div className="hero-copy">{children}</div>
      </div>
      <div
        className="hero-carousel-track"
        ref={viewport}
        tabIndex={0}
        aria-label={t.carousel}
        onScroll={(event) => {
          const track = event.currentTarget;
          if (track.clientWidth)
            setActive(
              Math.min(
                slides.length - 1,
                Math.max(
                  0,
                  Math.round(Math.abs(track.scrollLeft) / track.clientWidth),
                ),
              ),
            );
        }}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          let next: number | undefined;
          if (event.key === "ArrowRight")
            next = active + (locale === "ar" ? -1 : 1);
          if (event.key === "ArrowLeft")
            next = active + (locale === "ar" ? 1 : -1);
          if (event.key === "Home") next = 0;
          if (event.key === "End") next = slides.length - 1;
          if (next !== undefined) {
            event.preventDefault();
            goTo(next);
          }
        }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`hero-slide${slide.photograph ? " hero-slide-photo" : ""}`}
            role="group"
            aria-roledescription={t.slide}
            aria-label={`${index + 1} / ${slides.length}: ${slide.title}`}
            inert={active !== index}
          >
            <div className="hero-slide-visual">
              {slide.video ? <BannerVideo active={active === index} copy={videoCopy} description={videoDescription} /> : slide.images.map((picture, pictureIndex) => (
                <figure key={picture.src}>
                  <ResponsiveImage
                    src={picture.src}
                    sizes={slide.photograph ? "100vw" : "(max-width: 720px) 80vw, (max-width: 1280px) 50vw, 640px"}
                    width={slide.photograph ? 1920 : 1100}
                    height={slide.photograph ? 996 : 850}
                    alt={picture.alt}
                    loading={index === 0 ? "eager" : "lazy"}
                    fetchPriority={index === 0 && pictureIndex === 0 ? "high" : "auto"}
                    draggable={false}
                  />
                  {picture.label && (
                    <figcaption dir="auto">{picture.label}</figcaption>
                  )}
                </figure>
              ))}
            </div>
            <div className="hero-slide-caption container">
              <h2>{slide.title}</h2>
              <Link prefetch={false} className="text-link" href={slide.url}>
                {action}
                <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div className="hero-controls-wrap container">
        <div className="hero-carousel-controls">
          <span className="hero-carousel-position" aria-hidden="true">
            <b>{active + 1}</b> / {slides.length}
          </span>
          <div className="hero-carousel-dots">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`${t.selectSlide} ${index + 1}: ${slide.title}`}
                aria-pressed={active === index}
                onClick={() => goTo(index)}
              >
                <span />
              </button>
            ))}
          </div>
          <div className="hero-carousel-arrows">
            <button
              type="button"
              aria-label={t.previous}
              onClick={() => goTo(active - 1)}
            >
              <ArrowLeft size={21} />
            </button>
            <button
              type="button"
              aria-label={t.next}
              onClick={() => goTo(active + 1)}
            >
              <ArrowRight size={21} />
            </button>
          </div>
        </div>
      </div>
      <span
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {active + 1} / {slides.length}: {slides[active].title}
      </span>
    </section>
  );
}

export function CertificateCarousel({children,label,previous,next,rtl}:{children:ReactNode;label:string;previous:string;next:string;rtl:boolean}){
 const ref=useRef<HTMLDivElement>(null);
 const move=(step:number)=>{const el=ref.current;if(el)el.scrollBy({left:step*(rtl?-1:1)*el.clientWidth*.85,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});};
 return <div className="certificate-carousel" role="region" aria-label={label}><div className="certificate-carousel-controls"><button type="button" aria-label={previous} onClick={()=>move(-1)}><span aria-hidden="true">{rtl?'→':'←'}</span></button><button type="button" aria-label={next} onClick={()=>move(1)}><span aria-hidden="true">{rtl?'←':'→'}</span></button></div><div ref={ref} className="certificate-carousel-track" tabIndex={0}>{children}</div></div>;
}
