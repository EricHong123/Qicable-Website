"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
import type { Locale } from "./i18n";
import { cookieMessages } from "./cookie-messages";
import { trackBuyerEvent, readAnalyticsConsent, subscribeAnalyticsConsent, saveAnalyticsConsent, syncAnalyticsConsent, type AnalyticsConsent } from "./analytics";

const serverConsent = (): AnalyticsConsent => null;
function useAnalyticsConsent() {
  return useSyncExternalStore(subscribeAnalyticsConsent, readAnalyticsConsent, serverConsent);
}

export function GoogleAnalytics() {
  const consent = useAnalyticsConsent();
  useEffect(() => { syncAnalyticsConsent(); }, [consent]);
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const anchor = event.target.closest<HTMLAnchorElement>("a[data-buyer-path], a[href^='mailto:'], a[href^='https://wa.me/']");
      if (!anchor) return;
      const entry = anchor.dataset.buyerPath;
      if (entry === "catalog" || entry === "configuration" || entry === "custom") {
        trackBuyerEvent("buyer_path_click", { entry });
      } else {
        trackBuyerEvent("contact_channel_click", { channel: anchor.href.startsWith("mailto:") ? "email" : "whatsapp" });
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}

export function CookieSettings({ locale }: { locale: Locale }) {
  const consent = useAnalyticsConsent();
  const copy = cookieMessages[locale];
  const [result, setResult] = useState<"idle" | "saved" | "error">("idle");
  function save(value: "essential" | "analytics") {
    setResult(saveAnalyticsConsent(value) ? "saved" : "error");
  }
  return <div className="cookie-settings">
    <p>{consent === "analytics" ? copy.on : consent === "essential" ? copy.off : copy.limited}</p>
    <div className="actions">
      <button className="button secondary" onClick={() => save("essential")}>{copy.reject}</button>
      <button className="button" onClick={() => save("analytics")}>{copy.allow}</button>
    </div>
    <p role="status" aria-live="polite">{result === "idle" ? "" : copy[result]}</p>
  </div>;
}
