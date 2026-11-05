import assert from "node:assert/strict";
import { test } from "node:test";
import { structuredData } from "../preview/structured-data";
import { routes, products, categorySlugs, href } from "../ui/src/model";
import { locales, messages } from "../ui/src/i18n";
import { companyContent } from "../ui/src/company-content";
import { guideContent, guideReferences } from "../ui/src/guide-content";
import site from "../config/site.json";
import social from "../config/social-links.json";

test("homepage omits a one-item breadcrumb; every inner trail resolves and has at least two positions", () => {
  for (const locale of locales) for (const route of routes) {
    const url = site.origin + href(locale, route.path);
    const graph = structuredData(route, locale)["@graph"];
    const page = graph.find(node => node["@id"] === url + "#webpage")!;
    const breadcrumb = graph.find(node => node["@type"] === "BreadcrumbList");
    if (route.kind === "home") {
      assert.equal(breadcrumb, undefined);
      assert.equal(page.breadcrumb, undefined);
      continue;
    }
    assert.ok(breadcrumb);
    assert.deepEqual(page.breadcrumb, { "@id": breadcrumb["@id"] });
    const entries = breadcrumb.itemListElement as { position: number; item: string }[];
    assert.ok(entries.length >= 2);
    assert.deepEqual(entries.map(entry => entry.position), entries.map((_, index) => index + 1));
    assert.equal(entries.at(-1)!.item, url);
    assert.equal(entries[0].item, site.origin + href(locale, "/"));
    assert.ok(entries.every(entry => new URL(entry.item).origin === site.origin));
  }
});

test("model identity is shared across languages without invented product commerce data", () => {
  for (const product of products) {
    const route = routes.find(item => item.product?.model === product.model)!;
    const identity = site.origin + route.path + "#product";
    for (const locale of locales) {
      const url = site.origin + href(locale, route.path);
      const graph = structuredData(route, locale)["@graph"];
      const entity = graph.find(node => node["@type"] === "Product")!;
      const page = graph.find(node => node["@id"] === url + "#webpage")!;
      assert.equal(entity["@id"], identity);
      assert.equal(entity.sku, product.model);
      assert.equal(entity.model, product.model);
      assert.equal(entity.url, url);
      assert.deepEqual(entity.image, product.images.map(image => site.origin + image));
      assert.deepEqual(page.mainEntity, { "@id": identity });
      assert.deepEqual(entity.mainEntityOfPage, { "@id": page["@id"] });
      const brand = entity.brand as { "@id": string };
      assert.equal(graph.find(node => node["@id"] === brand["@id"])!["@type"], "Brand");
      for (const key of ["offers", "review", "aggregateRating", "gtin", "mpn"]) {
        assert.equal(entity[key], undefined);
      }
    }
  }
});

test("FAQ answers are the actual localized technical and business answers, never generated markup-only claims", () => {
  const route = routes.find(item => item.kind === "faq")!;
  for (const locale of locales) {
    const page = structuredData(route, locale)["@graph"].find(node => node["@type"] === "FAQPage")!;
    const expected = [
      ...messages[locale].faqQuestions.map((question, index) => ({
        question, answer: messages[locale].faqAnswers[index],
      })),
      ...companyContent[locale].faq,
    ];
    const questions = page.mainEntity as { name: string; acceptedAnswer: { text: string } }[];
    assert.deepEqual(questions.map(item => ({ question: item.name, answer: item.acceptedAnswer.text })), expected);
    assert.equal(page.inLanguage, locale);
  }
});

test("guide Article identifies visible editorial content while leaving unrecorded authors and dates unset", () => {
  for (const route of routes.filter(item => item.kind === "guide")) for (const locale of locales) {
    const graph = structuredData(route, locale)["@graph"];
    const article = graph.find(node => node["@type"] === "Article")!;
    assert.equal(article.headline, messages[locale].guideNames[route.index!]);
    assert.equal(article.description, guideContent[locale][route.index!].lead);
    assert.equal(article.inLanguage, locale);
    assert.deepEqual(article.citation, guideReferences[route.index!].map(source => ({
      "@type": "CreativeWork", name: source.title, url: source.url,
    })));
    for (const key of ["author", "datePublished", "dateModified", "image"]) {
      assert.equal(article[key], undefined);
    }
    const page = graph.find(node => node["@id"] === site.origin + href(locale, route.path) + "#webpage")!;
    assert.deepEqual(page.mainEntity, { "@id": article["@id"] });
    assert.deepEqual(article.mainEntityOfPage, { "@id": page["@id"] });
  }
});

test("category lists contain the actual category models and do not mislabel list pages as individual products", () => {
  for (const route of routes.filter(item => item.kind === "catalog")) {
    const graph = structuredData(route, "en")["@graph"];
    const list = graph.find(node => node["@type"] === "ItemList")!;
    const expected = products.filter(product => route.index === undefined || product.category === categorySlugs[route.index]);
    assert.equal(list.numberOfItems, expected.length);
    const entries = list.itemListElement as { item: { "@type": string; url: string } }[];
    assert.deepEqual(entries.map(entry => entry.item.url), expected.map(product => site.origin + `/products/${product.slug}/`));
    assert.ok(entries.every(entry => entry.item["@type"] === "WebPage"));
    assert.equal(graph.some(node => node["@type"] === "Product"), false);
  }
});

test("organization identity uses supplied brand profiles, never the personal LinkedIn profile or a nonexistent search action", () => {
  const graph = structuredData(routes[0], "en")["@graph"];
  const organization = graph.find(node => node["@type"] === "Organization")!;
  assert.deepEqual(organization.sameAs, [social.facebook, social.youtube, social.instagram]);
  assert.ok(!(organization.sameAs as string[]).includes(social.linkedin));
  const website = graph.find(node => node["@type"] === "WebSite")!;
  assert.deepEqual(website.inLanguage, site.locales);
  assert.equal(website.potentialAction, undefined);
  const ids = graph.map(node => node["@id"]);
  assert.equal(ids.length, new Set(ids).size);
});
