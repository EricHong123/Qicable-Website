import assert from "node:assert/strict";
import { test } from "node:test";
import { structuredData, serializeStructuredData } from "../preview/structured-data";
import { routes, href } from "../ui/src/model";
import { locales } from "../ui/src/i18n";
import { pageSeo } from "../ui/src/seo";
import { guideReferences } from "../ui/src/guide-content";
import site from "../config/site.json";

test("page entities retain locale metadata and resolve publisher and website references", () => {
  for (const locale of locales) for (const route of routes) {
    const graph = structuredData(route, locale)["@graph"];
    const page = graph.find(node => node["@id"] === site.origin + href(locale, route.path) + "#webpage")!;
    assert.equal(page.description, pageSeo(route, locale).description);
    assert.equal(page.inLanguage, locale);
    for (const key of ["publisher", "isPartOf"]) {
      const reference = page[key] as { "@id": string };
      assert.ok(graph.some(node => node["@id"] === reference["@id"]));
    }
    assert.equal(page.author, undefined);
    assert.equal(page.datePublished, undefined);
    assert.equal(page.dateModified, undefined);
  }
});

test("page subtypes describe the route and organization about is limited to the about page", () => {
  for (const route of routes) {
    const graph = structuredData(route, "en")["@graph"];
    const page = graph.find(node => node["@id"] === site.origin + route.path + "#webpage")!;
    const expected = route.kind === "about" ? "AboutPage"
      : route.kind === "contact" ? "ContactPage"
      : route.kind === "faq" ? "FAQPage"
      : ["catalog", "applications", "resources", "guides"].includes(route.kind) ? "CollectionPage" : "WebPage";
    assert.equal(page["@type"], expected);
    assert.deepEqual(page.about, route.kind === "about" ? { "@id": site.origin + "/#organization" } : undefined);
  }
});

test("guide citations use only the same references rendered by TechnicalGuide", () => {
  for (const locale of locales) for (const route of routes) {
    const graph = structuredData(route, locale)["@graph"];
    const page = graph.find(node => node["@id"] === site.origin + href(locale, route.path) + "#webpage")!;
    if (route.kind !== "guide") {
      assert.equal(page.citation, undefined);
      continue;
    }
    assert.deepEqual(page.citation, guideReferences[route.index!].map(source => ({
      "@type": "CreativeWork", name: source.title, url: source.url,
    })));
    assert.ok(guideReferences[route.index!].every(source => new URL(source.url).protocol === "https:"));
  }
});

test("JSON-LD serialization keeps script delimiters inert without altering parsed content", () => {
  const payload = { description: "</script><script>alert('x')</script>" };
  const serialized = serializeStructuredData(payload);
  assert.ok(!serialized.includes("<"));
  assert.deepEqual(JSON.parse(serialized), payload);
});
