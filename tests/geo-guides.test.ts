import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { test } from "node:test";
import { locales, messages } from "../ui/src/i18n";
import { guideContent, guideReferences, guideTopics } from "../ui/src/guide-content";
import { guideSlugs, products, routes, href, resolveRoute } from "../ui/src/model";
import { categoryGuides } from "../ui/src/navigation";
import covers from "../content/blog-covers.json";

test("all guide routes have six complete localized articles, sources and real covers", () => {
  assert.equal(guideTopics.length, guideSlugs.length);
  assert.equal(guideReferences.length, guideSlugs.length);
  for (const locale of locales) {
    assert.equal(guideContent[locale].length, guideSlugs.length);
    assert.equal(messages[locale].guideNames.length, guideSlugs.length);
    for (const [index, slug] of guideSlugs.entries()) {
      const content = guideContent[locale][index];
      assert.ok(content.lead && content.sections.length && content.prepare.length);
      assert.ok(content.sections.every(section => section.title && section.body));
      assert.ok(guideReferences[index].length);
      assert.ok(existsSync("ui" + covers[slug]));
      const path = href(locale, `/${slug}/`);
      assert.equal(resolveRoute(path.split("/").filter(Boolean))?.route.index, index);
    }
  }
});

test("new topics have inbound category links and related links resolve without self-links", () => {
  for (const [index, topic] of guideTopics.entries()) {
    assert.ok(topic.category >= 0 && topic.category < categoryGuides.length);
    for (const model of topic.examples) assert.ok(products.some(product => product.model === model));
    for (const related of topic.related) {
      assert.notEqual(related, index);
      assert.ok(routes.some(route => route.kind === "guide" && route.index === related));
    }
    if (index >= 6) {
      assert.ok(categoryGuides.some(indices => indices.includes(index)));
      assert.ok(guideTopics.some(other => (other.related as readonly number[]).includes(index)));
    }
  }
});

test("RFQ downloads are localized blank requirement forms rather than sample customer data", () => {
  for (const locale of locales) {
    const template = readFileSync(`ui/assets/documents/cable-assembly-rfq-${locale}.csv`, "utf8");
    const lines = template.replace(/^\uFEFF/, "").trimEnd().split(/\r?\n/);
    assert.equal(lines.length, 15);
    assert.ok(lines.slice(1).every(line => line.endsWith(",")));
    assert.ok(!template.includes("@"));
  }
});
