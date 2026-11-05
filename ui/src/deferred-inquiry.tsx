"use client";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { messages } from "./i18n";
import { InquiryBoundary } from "./inquiry-boundary";
import site from "../../config/site.json";
const Form = lazy(() => import("./inquiry-form").then(module => ({ default: module.InquiryForm })));
type FormProps = Parameters<typeof import("./inquiry-form").InquiryForm>[0];

export function DeferredInquiryForm({ eager = false, ...props }: FormProps & { eager?: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(eager);
  const t = messages[props.locale];
  useEffect(() => {
    if (ready || !host.current) return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        setReady(true);
        observer.disconnect();
      }
    }, { rootMargin: "600px" });
    observer.observe(host.current);
    return () => observer.disconnect();
  }, [ready]);
  const fallback = <div className="inquiry-loading"><p>{t.quote}…</p><a href={`mailto:${site.email}`}>{t.email}: {site.email}</a></div>;
  return <div ref={host} className="deferred-inquiry">
    {ready ? <InquiryBoundary locale={props.locale}><Suspense fallback={fallback}><Form {...props}/></Suspense></InquiryBoundary> : fallback}
  </div>;
}
