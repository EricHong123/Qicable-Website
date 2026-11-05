"use client";
import { localeNames, locales, messages, type Locale } from "./i18n";
import { href } from "./navigation";

export function LocalePicker({locale,path,targets}:{locale:Locale;path:string;targets?:Partial<Record<Locale,string>>}) {
  return <select className="locale-picker" aria-label={messages[locale].language} value={locale} onChange={(event)=>window.location.assign((targets?.[event.target.value as Locale] ?? href(event.target.value as Locale,path))+window.location.search)}>
    {locales.filter(value=>!targets||targets[value]).map(value=><option key={value} value={value}>{localeNames[value]}</option>)}
  </select>;
}
