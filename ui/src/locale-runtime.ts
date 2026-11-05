import type { Locale } from "./i18n";

type BaseLocale = "en" | "de" | "es" | "fr" | "pt" | "ar";
type Dictionary = Readonly<Record<string, string>>;
const dictionaries = new Map<string, Dictionary>();
const english = new Set<string>();
const structural = new Set(["id", "href", "url", "src", "path", "type", "kind", "locale", "model", "qicableRole"]);

function visit(value: unknown, transform: (text: string) => string, key = ""): unknown {
  if (typeof value === "string") return structural.has(key) ? value : transform(value);
  if (Array.isArray(value)) return value.map(child => visit(child, transform, key));
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([name, child]) => [name, visit(child, transform, name)]));
  return value;
}

export function registerTranslations(locale: string, dictionary: Dictionary) {
  dictionaries.set(locale, dictionary);
}
export function localeDictionary(locale: Locale): Dictionary { return dictionaries.get(locale) ?? {}; }
export function englishMessages() { return [...english]; }
export function translateText(source: string, locale: Locale): string {
  if (locale === "en") return source;
  let dictionary = dictionaries.get(locale);
  if (!dictionary && typeof document !== "undefined") {
    const seed = document.getElementById("qicable-locale-data");
    if (seed?.textContent) {
      const parsed = JSON.parse(seed.textContent) as { locale: string; strings: Dictionary };
      if (parsed.locale === locale) {
        dictionary = parsed.strings;
        dictionaries.set(locale, dictionary);
      }
    }
  }
  return dictionary?.[source] ?? source;
}

export function expandLocales<T>(base: { en: T } & Record<BaseLocale, unknown>): Record<Locale, T> {
  visit(base.en, text => { english.add(text); return text; });
  const result = { ...base } as Record<Locale, T>;
  for (const locale of ["it", "nl", "pl", "cs", "sv", "da", "fi", "no", "ru", "tr", "ja", "ko", "vi", "id"]) {
    Object.defineProperty(result, locale, {
      enumerable: true,
      get: () => visit(base.en, text => translateText(text, locale as Locale)) as T,
    });
  }
  return result;
}
