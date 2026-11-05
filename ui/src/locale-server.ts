/** Server-only dictionaries. No additional locale corpus enters client bundles. */
import type { Locale } from "./i18n";
import { registerTranslations, localeDictionary } from "./locale-runtime";
import clientSource from "../../content/translations/client-source.json";
import it from "../../content/translations/it.json";
import nl from "../../content/translations/nl.json";
import pl from "../../content/translations/pl.json";
import cs from "../../content/translations/cs.json";
import sv from "../../content/translations/sv.json";
import da from "../../content/translations/da.json";
import fi from "../../content/translations/fi.json";
import no from "../../content/translations/no.json";
import ru from "../../content/translations/ru.json";
import tr from "../../content/translations/tr.json";
import ja from "../../content/translations/ja.json";
import ko from "../../content/translations/ko.json";
import vi from "../../content/translations/vi.json";
import id from "../../content/translations/id.json";
const base = new Set(["en", "de", "es", "fr", "pt", "ar"]);
const dictionaries: Record<string, Record<string,string>> = {it,nl,pl,cs,sv,da,fi,no,ru,tr,ja,ko,vi,id};
for (const [locale, strings] of Object.entries(dictionaries)) registerTranslations(locale, strings);
export function clientLocaleStrings(locale: Locale): Record<string,string> | null {
  if (base.has(locale)) return null;
  const dictionary = localeDictionary(locale);
  const strings = Object.fromEntries(clientSource.filter(key => key in dictionary).map(key => [key, dictionary[key]]));
  return strings;
}
