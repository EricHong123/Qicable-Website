"use client";
import type { ReactNode } from "react";
import type { Locale } from "./i18n";
import { registerTranslations } from "./locale-runtime";
/** Seed before rendering client children, including their server-rendered pass. */
export function LocaleProvider({locale,strings,children}:{locale:Locale;strings:Record<string,string>|null;children:ReactNode}) {
  if (strings) registerTranslations(locale,strings);
  return children;
}
