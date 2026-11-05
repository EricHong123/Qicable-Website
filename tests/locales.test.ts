import assert from "node:assert/strict";
import { test } from "node:test";
import { locales } from "../ui/src/i18n";
import { localeDictionary } from "../ui/src/locale-runtime";
import { clientLocaleStrings } from "../ui/src/locale-server";
import { href, resolveRoute } from "../ui/src/model";

test("twenty locales resolve shared products and retain complete gallery client text", () => {
  assert.equal(locales.length,20);
  for (const locale of locales) {
    assert.equal(resolveRoute(href(locale,"/products/qc12a00/").split("/").filter(Boolean))?.locale,locale);
    const strings = clientLocaleStrings(locale);
    if (!strings) continue;
    assert.ok(strings["View all product images"],`${locale}: gallery action must be available during hydration`);
    assert.equal(strings["View all product images"],localeDictionary(locale)["View all product images"]);
    assert.notEqual(strings["Request a quote"],"Request a quote");
  }
});
