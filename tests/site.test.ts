import assert from "node:assert/strict";
import { test } from "node:test";
import { existsSync } from "node:fs";
import { buildInquiry, inquiryAttribution } from "../ui/src/contact-contract";
import translatedNames from "../content/product-names.json";
import { InquirySizeError } from "../ui/src/contact-contract";
test("Connector byte limits identify oversize multilingual fields and omit malformed campaign metadata", () => {
  const input = {
    name: "Buyer",
    email: "buyer@example.org",
    company: "ع".repeat(101),
    message: "Cable requirement",
  };
  assert.throws(
    () =>
      buildInquiry(input, "ar", "test-request-id-1", {
        page: "https://www.qicable.com/contact/",
      }),
    (error) => error instanceof InquirySizeError && error.field === "company",
  );
  assert.doesNotThrow(() =>
    buildInquiry(
      { ...input, company: "ع".repeat(100) },
      "ar",
      "test-request-id-1",
      { page: "https://www.qicable.com/contact/" },
    ),
  );
  assert.throws(
    () =>
      buildInquiry(
        { ...input, company: "Example", phone: "1".repeat(65) },
        "en",
        "test-request-id-1",
        { page: "https://www.qicable.com/contact/" },
      ),
    (error) => error instanceof InquirySizeError && error.field === "phone",
  );
  assert.equal(
    inquiryAttribution(
      "https://www.qicable.com/contact/?utm_source=" +
        encodeURIComponent("ع".repeat(101)),
    ).utm_source,
    undefined,
  );
});
import {
  contactFingerprint,
  resolveContactAttempt,
  storeContactAttempt,
  loadStoredContactAttempt,
} from "../ui/src/contact-attempt";
import {
  routes,
  products,
  href,
  resolveRoute,
  categorySlugs,
  guideSlugs,
} from "../ui/src/model";
import { locales, messages } from "../ui/src/i18n";
test("each page identity has six round-tripping paths including the article exception", () => {
  const paths = new Set<string>();
  for (const locale of locales)
    for (const route of routes) {
      const path = href(locale, route.path);
      assert.ok(!paths.has(path), path);
      paths.add(path);
      const actual = resolveRoute(path.split("/").filter(Boolean));
      assert.equal(actual?.locale, locale);
      assert.equal(actual?.route.path, route.path);
    }
  assert.equal(routes.length, products.length + 31 + guideSlugs.length);
  assert.equal(paths.size, routes.length * locales.length);
  assert.equal(resolveRoute(["en", "products"]), null);
  assert.equal(
    resolveRoute(["de", "machine-vision-cable-selection-guide"]),
    null,
  );
  assert.equal(resolveRoute(["de", "blog", "products"]), null);
});
test("catalog preserves the six families and 80 unique model identities with real assets", () => {
  assert.equal(products.length, 80);
  assert.equal(new Set(products.map((p) => p.model)).size, 80);
  for (const cat of categorySlugs)
    assert.ok(products.some((p) => p.category === cat));
  for (const p of products) {
    assert.ok(p.images.length || p.mediaStatus === "pending-review", p.model);
    for (const img of p.images) assert.ok(existsSync("ui" + img), img);
  }
});
test("six locales cover every interface message and collection shape", () => {
  for (const l of locales) {
    assert.deepEqual(
      Object.keys(messages[l]).sort(),
      Object.keys(messages.en).sort(),
    );
    for (const key of Object.keys(
      messages.en,
    ) as (keyof typeof messages.en)[]) {
      const a = messages[l][key];
      const b = messages.en[key];
      assert.equal(Array.isArray(a), Array.isArray(b));
      if (Array.isArray(a) && Array.isArray(b))
        assert.equal(a.length, b.length, `${l}.${key}`);
    }
  }
});
test("inquiry maps optional technical data into the strict contact contract", () => {
  const p = buildInquiry(
    {
      name: " User ",
      company: " Example ",
      email: "user@example.org",
      message: "Camera connection",
      product: "QC12A00",
      environment: "Repeated bending",
      quantity: "50",
      drawing: "https://example.org/drawing.pdf",
    },
    "de",
    "key-1",
    { page: "https://www.qicable.com/contact/" },
  );
  assert.equal(p.name, "User");
  assert.equal(p.product, "QC12A00");
  assert.match(p.message, /Installation: Repeated bending/);
  assert.match(p.message, /Drawing: https:\/\/example.org/);
  assert.ok(!("quantity" in p));
  assert.equal(p.idempotency_key, "key-1");
});
test("inquiry enforces actual UTF-8 size without truncating Arabic text", () => {
  assert.throws(
    () =>
      buildInquiry(
        {
          name: "N",
          company: "C",
          email: "a@example.org",
          message: "ع".repeat(2100),
        },
        "ar",
        "key",
        { page: "https://www.qicable.com/contact/" },
      ),
    RangeError,
  );
});
test("every model has a translated title draft in all five target languages", () => {
  for (const names of Object.values(translatedNames))
    for (const p of products)
      assert.ok((names as Record<string, string>)[p.model], p.model);
});
test("contact attribution retains product context and excludes foreign URLs and query secrets", () => {
  assert.deepEqual(
    inquiryAttribution(
      "https://www.qicable.com/ar/contact/?from=%2Far%2Fproducts%2Fqc12a00%2F&utm_source=search",
    ),
    {
      page: "https://www.qicable.com/ar/products/qc12a00/",
      utm_source: "search",
      utm_medium: undefined,
      utm_campaign: undefined,
    },
  );
  assert.equal(
    inquiryAttribution(
      "https://www.qicable.com/contact/?from=https://example.org/",
    ).page,
    "https://www.qicable.com/contact/",
  );
  assert.equal(
    inquiryAttribution(
      "https://www.qicable.com/contact/?from=%2F%5Cexample.org%2Fx",
    ).page,
    "https://www.qicable.com/contact/",
  );
  assert.equal(
    inquiryAttribution(
      "https://www.qicable.com/contact/",
      "https://www.qicable.com/products/qc12a00/?token=private",
    ).page,
    "https://www.qicable.com/products/qc12a00/",
  );
});
test("retry identity survives reload without persisting inquiry contents", async () => {
  const entries = new Map<string, string>();
  const storage = {
    getItem: (key: string) => entries.get(key) ?? null,
    setItem: (key: string, value: string) => {
      entries.set(key, value);
    },
    removeItem: (key: string) => {
      entries.delete(key);
    },
  };
  const fingerprint = await contactFingerprint("Private buyer details");
  const attempt = resolveContactAttempt(
    fingerprint,
    null,
    () => "test-attempt-key-123456",
  );
  storeContactAttempt(storage, attempt, 1000);
  assert.equal(
    resolveContactAttempt(fingerprint, loadStoredContactAttempt(storage, 2000))
      .idempotencyKey,
    attempt.idempotencyKey,
  );
  assert.ok(![...entries.values()][0].includes("Private buyer details"));
  assert.equal(
    loadStoredContactAttempt(storage, 8 * 24 * 60 * 60 * 1000),
    null,
  );
  assert.notEqual(
    resolveContactAttempt(
      await contactFingerprint("Changed requirement"),
      attempt,
    ).idempotencyKey,
    attempt.idempotencyKey,
  );
});
