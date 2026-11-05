import { expandLocales } from "./locale-runtime";
import Link from 'next/link';
import {messages,type Locale} from './i18n';
import {categoryContent} from './category-content';
import {href,inquiryHref} from './navigation';
import {relatedProducts} from './product-relations';
import {products,type Product} from './model';
import {serviceContent} from './service-content';

const labels:Record<Locale,{fit:string;check:string;next:string;compare:string}>=expandLocales({
 en:{fit:'Which connection fits this application?',check:'What should I confirm before ordering?',next:'How do I request a configuration review?',compare:'Compare recorded configurations'},
 de:{fit:'Welche Verbindung passt zu dieser Anwendung?',check:'Was sollte ich vor der Bestellung prüfen?',next:'Wie frage ich eine Konfigurationsprüfung an?',compare:'Dokumentierte Konfigurationen vergleichen'},
 es:{fit:'¿Qué conexión corresponde a esta aplicación?',check:'¿Qué debo confirmar antes de pedir?',next:'¿Cómo solicito revisar una configuración?',compare:'Comparar configuraciones documentadas'},
 fr:{fit:'Quelle connexion convient à cette application ?',check:'Que vérifier avant de commander ?',next:'Comment demander une revue de configuration ?',compare:'Comparer les configurations documentées'},
 pt:{fit:'Qual conexão atende a esta aplicação?',check:'O que confirmar antes de encomendar?',next:'Como solicitar uma análise da configuração?',compare:'Comparar configurações documentadas'},
 ar:{fit:'ما التوصيل المناسب لهذا التطبيق؟',check:'ما الذي يجب تأكيده قبل الطلب؟',next:'كيف أطلب مراجعة التكوين؟',compare:'مقارنة التكوينات المسجلة'},
});
export function CategoryFaq({locale,category}:{locale:Locale;category:number}){
 const t=messages[locale],l=labels[locale],f=categoryContent[locale].families[category];
 return <section className="section container narrow"><h2>{f.title}: {t.faq}</h2><div className="faq-list">{[[l.fit,f.fit],[l.check,f.check]].map(([q,a])=><details key={q}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}<details><summary>{l.next}<span>+</span></summary><p>{t.ctaText}</p><Link className="text-link" href={inquiryHref(locale,undefined,'custom')} prefetch={false}>{t.customButton} →</Link></details></div></section>;
}
export function ConfigurationComparison({locale,product}:{locale:Locale;product:Product}){
 const t=messages[locale];const candidates=[product,...relatedProducts(product,products)];
 return <section className="section container configuration-comparison"><h2>{labels[locale].compare}</h2><p>{t.specificationNote}</p><div className="comparison-scroll" tabIndex={0} role="region" aria-label={labels[locale].compare}><table><caption className="sr-only">{labels[locale].compare}</caption><thead><tr><th scope="col">{t.model}</th><th scope="col">{t.connectorA}</th><th scope="col">{t.connectorB}</th><th scope="col">{t.interface}</th><th scope="col">{t.lengths}</th></tr></thead><tbody>{candidates.map(p=><tr key={p.model} data-current={p.model===product.model}><th scope="row"><Link href={href(locale,`/products/${p.slug}/`)} prefetch={false}><bdi>{p.model}</bdi></Link></th><td><bdi>{p.connectorA}</bdi></td><td><bdi>{p.connectorB}</bdi></td><td><bdi>{p.interface}</bdi></td><td><bdi>{p.lengths.length?p.lengths.map(x=>`${x} m`).join(' / '):'—'}</bdi></td></tr>)}</tbody></table></div></section>;
}
export function ResourceTopics({locale}:{locale:Locale}){
 const t=messages[locale];const s=serviceContent[locale];
 return <nav className="resource-topic-grid" aria-label={t.resources}>{[[t.guides,t.guideLead,'/blog/'],[t.downloads,s.downloads.intro,'/resources/downloads/'],[t.faq,t.specificationNote,'/resources/faq/'],[s.support.title,s.support.intro,'/technical-support/']].map(([title,body,path])=><Link key={path} href={href(locale,path)} prefetch={false}><h2>{title}</h2><p>{body}</p><span aria-hidden="true">↗</span></Link>)}</nav>;
}
