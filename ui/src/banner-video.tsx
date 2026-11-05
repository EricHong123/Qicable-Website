"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  BANNER_POSTER,
  BANNER_VIDEO_DESKTOP,
  BANNER_VIDEO_MOBILE,
} from "./banner-media";

type Connection = EventTarget & {
  saveData?: boolean;
  effectiveType?: string;
};

export function BannerVideo({
  active,
  copy,
  description,
}: {
  active: boolean;
  copy: { title: string; play: string; pause: string };
  description: string;
}) {
  const descriptionId = useId();
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const manualPause = useRef(false);
  const manualPlay = useRef(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: Connection }).connection;
    let visible = false;

    const syncPlayback = () => {
      const constrained = connection?.saveData ||
        ["slow-2g", "2g"].includes(connection?.effectiveType ?? "");
      const allowed = manualPlay.current || (!motion.matches && !constrained);
      if (visible && active && allowed && !manualPause.current && !document.hidden) {
        if (!video.getAttribute("src")) {
          video.src = window.matchMedia("(max-width: 720px)").matches ? BANNER_VIDEO_MOBILE : BANNER_VIDEO_DESKTOP;
        }
        void video.play().catch(() => {
          // Autoplay may be rejected by the browser; manual play remains available.
        });
      } else {
        video.pause();
      }
    };
    // Hydration already follows the high-priority poster request. Start visible
    // playback without waiting for unrelated lazy images or an idle deadline.
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncPlayback();
    }, { threshold: 0.15 });
    const preferencesChanged = () => {
      manualPlay.current = false;
      syncPlayback();
    };
    observer.observe(video);
    document.addEventListener("visibilitychange", syncPlayback);
    motion.addEventListener("change", preferencesChanged);
    connection?.addEventListener("change", preferencesChanged);
    if (!active) video.pause();
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncPlayback);
      motion.removeEventListener("change", preferencesChanged);
      connection?.removeEventListener("change", preferencesChanged);
      video.pause();
    };
  }, [active]);

  return <>
    <video
      ref={ref}
      className="hero-banner-video"
      width={1920}
      height={960}
      poster={BANNER_POSTER}
      muted
      loop
      playsInline
      preload="none"
      aria-label={copy.title}
      aria-describedby={descriptionId}
      title={copy.title}
      onPlay={() => setPlaying(true)}
      onPause={() => setPlaying(false)}
    >

      {copy.title}
    </video>
    <p id={descriptionId} className="sr-only">{description}</p>
    <button
      className="banner-video-toggle"
      type="button"
      aria-label={playing ? copy.pause : copy.play}
      onClick={() => {
        const video = ref.current;
        if (!video) return;
        if (video.paused) {
          manualPause.current = false;
          manualPlay.current = true;
          if (!video.getAttribute("src")) video.src = window.matchMedia("(max-width: 720px)").matches ? BANNER_VIDEO_MOBILE : BANNER_VIDEO_DESKTOP;
          void video.play().catch(() => {});
        } else {
          manualPause.current = true;
          manualPlay.current = false;
          video.pause();
        }
      }}
    >
      {playing ? "Ⅱ" : "▶"} <span>{playing ? copy.pause : copy.play}</span>
    </button>
  </>;
}
