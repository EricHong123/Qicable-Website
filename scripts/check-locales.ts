import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import "../ui/src/locale-server";
import clientSource from "../content/translations/client-source.json";
import { locales } from "../ui/src/i18n";
import { englishMessages, localeDictionary } from "../ui/src/locale-runtime";
const base = new Set(["en","de","es","fr","pt","ar"]);
assert.equal(new Set(locales).size,20);
for (const locale of locales) {
  if (base.has(locale)) continue;
  const dictionary = localeDictionary(locale);
  const missing = [...new Set([...englishMessages(), ...clientSource])].filter(text => !dictionary[text]);
  assert.deepEqual(missing,[],`${locale}: missing UI translation keys`);
  const raw = readFileSync(`content/translations/${locale}.json`,"utf8");
  assert(!/⟪P\d+⟫/.test(raw),`${locale}: unresolved protected token`);
}
console.log("20 locale identities; all registered UI strings and protected placeholders checked");
