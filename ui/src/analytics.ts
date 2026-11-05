export const GA_MEASUREMENT_ID = "G-MHMSQF6P77";
export const CONSENT_KEY = "qicable-consent";
const CONSENT_EVENT = "qicable-consent-change";
const temporaryConsent = new WeakMap<Window, AnalyticsConsent>();
export type AnalyticsConsent = "essential" | "analytics" | null;

type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  qicableAnalyticsConfigured?: boolean;
} & Partial<Record<`ga-disable-${typeof GA_MEASUREMENT_ID}`, boolean>>;
const denied = {
  analytics_storage: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
};

export function readAnalyticsConsent(): AnalyticsConsent {
  const temporary = temporaryConsent.get(window);
  if (temporary !== undefined) return temporary;
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    return value === "analytics" || value === "essential" ? value : null;
  } catch {
    return "essential";
  }
}

export function subscribeAnalyticsConsent(listener: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== CONSENT_KEY && event.key !== null) return;
    temporaryConsent.delete(window);
    listener();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(CONSENT_EVENT, listener);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CONSENT_EVENT, listener);
  };
}

function clearAnalyticsCookies() {
  const domains = ["", window.location.hostname, ".qicable.com"];
  for (const item of document.cookie.split(";")) {
    const name = item.split("=")[0].trim();
    if (name !== "_ga" && !name.startsWith("_ga_")) continue;
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/;${domain ? ` domain=${domain};` : ""}`;
    }
  }
}

export function syncAnalyticsConsent() {
  const w = window as AnalyticsWindow;
  const consent = readAnalyticsConsent();
  const enabled = consent !== "essential" &&
    ["www.qicable.com", "qicable.com"].includes(window.location.hostname);
  const currentConsent = { ...denied, analytics_storage: "granted" };
  w[`ga-disable-${GA_MEASUREMENT_ID}`] = !enabled;
  if (!enabled) {
    w.gtag?.("consent", "update", denied);
    clearAnalyticsCookies();
    return;
  }
  w.dataLayer ??= [];
  w.gtag ??= function () {
    // eslint-disable-next-line prefer-rest-params -- Preserve Google’s canonical gtag queue protocol.
    w.dataLayer!.push(arguments);
  };
  if (!w.qicableAnalyticsConfigured) {
    // Standard audience measurement is enabled unless this visitor opted out.
    // Set the effective state before config so the first page view is reportable.
    w.gtag("consent", "default", currentConsent);
    w.gtag("js", new Date());
    // Google's default page_view and history tracking avoids duplicate manual events.
    w.gtag("config", GA_MEASUREMENT_ID, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
    w.qicableAnalyticsConfigured = true;
  } else {
    w.gtag("consent", "update", currentConsent);
  }
  if (!document.getElementById("qicable-google-tag")) {
    const script = document.createElement("script");
    script.id = "qicable-google-tag";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.append(script);
  }
}

export function saveAnalyticsConsent(value: Exclude<AnalyticsConsent, null>): boolean {
  let saved = true;
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
    temporaryConsent.delete(window);
  } catch {
    // A failed preference write must never prevent an immediate opt-out.
    temporaryConsent.set(window, "essential");
    saved = false;
  }
  syncAnalyticsConsent();
  window.dispatchEvent(new Event(CONSENT_EVENT));
  return saved;
}

export function trackBuyerEvent(
  event: "buyer_path_click" | "inquiry_start" | "inquiry_attachment" | "inquiry_received" | "contact_channel_click",
  details: { entry?: "catalog" | "configuration" | "custom"; channel?: "email" | "whatsapp" } = {},
) {
  const w = window as AnalyticsWindow;
  if (readAnalyticsConsent() === "essential" || !w.qicableAnalyticsConfigured ||
      !["www.qicable.com", "qicable.com"].includes(window.location.hostname)) return;
  w.gtag?.("event", event, details);
}
