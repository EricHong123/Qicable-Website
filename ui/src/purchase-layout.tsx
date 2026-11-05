import Link from 'next/link';
import {messages,type Locale} from './i18n';
import {categorySlugs,href,inquiryHref} from './navigation';
import {categoryContent} from './category-content';
import type {Product} from './model';
import {categoryDisplayOrder} from './navigation';

export function FamilyNavigation({locale,current}:{locale:Locale;current?:number}) {
 const t=messages[locale];
 return <nav className="family-navigation container" aria-label={t.family}>
  <Link prefetch={false} href={href(locale,'/products/')} aria-current={current===undefined?'page':undefined}>{t.any}</Link>
  {categoryDisplayOrder.map(i=><Link prefetch={false} key={i} href={href(locale,`/products/${categorySlugs[i]}/`)} aria-current={current===i?'page':undefined}>{t.categories[i]}</Link>)}
 </nav>;
}
export function ProductSectionNavigation({locale}:{locale:Locale}) {
 const t=messages[locale];const c=categoryContent[locale];
 return <nav className="product-section-navigation container" aria-label={t.productIntro}>
  <a href="#specifications">{t.specifications}</a><a href="#installation">{c.checkLabel}</a><a href="#related-products">{t.related}</a><a href="#product-inquiry">{t.quote}</a>
 </nav>;
}
export function InstallationReview({locale,product,category}:{locale:Locale;product:Product;category:number}) {
 const t=messages[locale];const c=categoryContent[locale];const family=c.families[category];
 return <section id="installation" className="section container installation-review">
  <div><span className="model-label">{product.model}</span><h2>{c.checkLabel}</h2><p>{family.check}</p><Link prefetch={false} className="text-link" href={inquiryHref(locale,product.model,'document')}>{t.requestDrawing} ↗</Link></div>
  <div><h3>{c.fitLabel}</h3><p>{family.fit}</p><dl className="connection-pair"><div><dt>{t.connectorA}</dt><dd><bdi>{product.connectorA}</bdi></dd></div><div><dt>{t.connectorB}</dt><dd><bdi>{product.connectorB}</bdi></dd></div></dl></div>
 </section>;
}

export function CategoryBrief({locale,category}:{locale:Locale;category:number}) {
 const c=categoryContent[locale];const family=c.families[category];
 return <div className="category-brief container"><details><summary>{c.fitLabel}</summary><p>{family.fit}</p></details><details><summary>{c.checkLabel}</summary><p>{family.check}</p></details></div>;
}
