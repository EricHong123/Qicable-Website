import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import { CONSENT_KEY, GA_MEASUREMENT_ID, readAnalyticsConsent, saveAnalyticsConsent, syncAnalyticsConsent } from "../ui/src/analytics";

const previousWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
const previousDocument = Object.getOwnPropertyDescriptor(globalThis, "document");
afterEach(() => {
  if (previousWindow) Object.defineProperty(globalThis, "window", previousWindow);
  else Reflect.deleteProperty(globalThis, "window");
  if (previousDocument) Object.defineProperty(globalThis, "document", previousDocument);
  else Reflect.deleteProperty(globalThis, "document");
});
function browser(host = "www.qicable.com", preference: string | null = null, blocked = false) {
  const storage = new Map(preference ? [[CONSENT_KEY, preference]] : []);
  const scripts: { id: string; src: string; async: boolean }[] = [];
  const cookies: string[] = [];
  const fake = {
    location: { hostname: host }, dataLayer: [] as Array<ArrayLike<unknown>>,
    localStorage: {
      getItem(key: string) { if (blocked) throw new Error("blocked"); return storage.get(key) ?? null; },
      setItem(key: string, value: string) { if (blocked) throw new Error("blocked"); storage.set(key, value); },
    },
    dispatchEvent() { return true; },
  };
  const document = {
    get cookie() { return "_ga=123; _ga_MHMSQF6P77=456; product_list=keep"; },
    set cookie(value: string) { cookies.push(value); },
    getElementById(id: string) { return scripts.find(script => script.id === id); },
    createElement() { return { id: "", src: "", async: false }; },
    head: { append(script: typeof scripts[number]) { scripts.push(script); } },
  };
  Object.defineProperty(globalThis, "window", { configurable: true, value: fake });
  Object.defineProperty(globalThis, "document", { configurable: true, value: document });
  return { fake, storage, scripts, cookies, disabled: () => Reflect.get(fake, `ga-disable-${GA_MEASUREMENT_ID}`) };
}

test("legacy essential preferences never load analytics", () => {
  for (const preference of ["essential"]) {
    const b = browser("www.qicable.com", preference);
    syncAnalyticsConsent();
    assert.equal(b.scripts.length, 0);
    assert.equal(b.disabled(), true);
    assert.equal(readAnalyticsConsent(), preference === "essential" ? "essential" : null);
  }
});
test("consent configures the supplied tag once with advertising denied", () => {
  const b = browser();
  assert.equal(saveAnalyticsConsent("analytics"), true);
  syncAnalyticsConsent();
  assert.equal(b.scripts.length, 1);
  assert.equal(b.scripts[0].src, `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`);
  assert.equal(b.scripts[0].async, true);
  assert.equal(b.fake.dataLayer.filter(row => row[0] === "config").length, 1);
  assert.equal(b.fake.dataLayer[0][0], "consent");
  assert.equal(b.fake.dataLayer[0][1], "default");
  assert.deepEqual(b.fake.dataLayer[0][2], { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
  assert.equal(b.disabled(), false);
});
test("revoking consent disables collection and expires only analytics cookies", () => {
  const b = browser("www.qicable.com", "analytics");
  syncAnalyticsConsent();
  assert.equal(saveAnalyticsConsent("essential"), true);
  assert.equal(b.disabled(), true);
  assert.equal(b.storage.get(CONSENT_KEY), "essential");
  assert.equal(b.cookies.length, 6);
  assert.ok(b.cookies.every(cookie => cookie.includes("Max-Age=0") && cookie.startsWith("_ga")));
  assert.deepEqual(Array.from(b.fake.dataLayer.at(-1) ?? []).slice(0, 2), ["consent", "update"]);
  assert.equal(saveAnalyticsConsent("analytics"), true);
  assert.equal(b.scripts.length, 1);
  assert.equal(b.fake.dataLayer.filter(row => row[0] === "config").length, 1);
});
test("blocked storage fails closed without loading the tag", () => {
  const b = browser("www.qicable.com", null, true);
  assert.equal(readAnalyticsConsent(), "essential");
  assert.equal(saveAnalyticsConsent("analytics"), false);
  syncAnalyticsConsent();
  assert.equal(b.scripts.length, 0);
  assert.equal(b.disabled(), true);
});
test("preview and private hosts never send analytics", () => {
  for (const host of ["localhost", "127.0.0.1", "cms.qicable.com", "agent.qicable.com"]) {
    const b = browser(host, "analytics");
    syncAnalyticsConsent();
    assert.equal(b.scripts.length, 0);
    assert.equal(b.disabled(), true);
  }
});

test("revoking an active session still stops collection when preference storage fails", () => {
  const b = browser("www.qicable.com", "analytics");
  syncAnalyticsConsent();
  b.fake.localStorage.setItem = () => { throw new Error("quota or security failure"); };
  assert.equal(saveAnalyticsConsent("essential"), false);
  assert.equal(readAnalyticsConsent(), "essential");
  assert.equal(b.disabled(), true);
  assert.equal(b.cookies.length, 6);
  syncAnalyticsConsent();
  assert.equal(b.disabled(), true);
  assert.deepEqual(b.fake.dataLayer.at(-1)?.[2], { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
});

test("new visitors get standard measurement without overwriting their saved preference", () => {
  const b = browser();
  syncAnalyticsConsent();
  assert.equal(b.scripts.length, 1);
  assert.equal(b.disabled(), false);
  assert.equal(b.storage.get(CONSENT_KEY), undefined);
  assert.deepEqual(b.fake.dataLayer[0][2], { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
  assert.equal(b.fake.dataLayer[1][0], "js");
  assert.equal(b.fake.dataLayer[2][0], "config");
  syncAnalyticsConsent();
  assert.equal(b.fake.dataLayer.at(-1)?.[1], "update");
  assert.equal(b.fake.dataLayer.at(-1)?.[2] && (b.fake.dataLayer.at(-1)![2] as Record<string, string>).analytics_storage, "granted");
  assert.equal(b.fake.dataLayer.filter(row => row[0] === "config").length, 1);
});


test("buyer events honor opt-out and include only the supplied nonpersonal fields", async () => {
  const { trackBuyerEvent } = await import("../ui/src/analytics");
  const b = browser();
  syncAnalyticsConsent();
  trackBuyerEvent("buyer_path_click", {entry:"configuration"});
  const events = b.fake.dataLayer.filter(row => row[0] === "event");
  assert.equal(events.length, 1);
  assert.equal(events[0][1], "buyer_path_click");
  assert.deepEqual(events[0][2], {entry:"configuration"});
  saveAnalyticsConsent("essential");
  trackBuyerEvent("inquiry_received");
  assert.equal(b.fake.dataLayer.filter(row => row[0] === "event").length, 1);
});
