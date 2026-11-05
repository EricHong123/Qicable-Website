import { expandLocales } from "./locale-runtime";
import Link from 'next/link';
import {ArrowUpRight,Check,Cable,FileCheck2,PackageCheck} from 'lucide-react';
import type {Locale} from './i18n';
import {messages} from './i18n';
import {href,categorySlugs,categoryDisplayOrder} from './navigation';
import {qualityContent} from './quality-content';
import {companyContent} from './company-content';
import {clientBrief} from './client-brief';
import {FactoryFacts,CustomStages} from './brief-sections';
import {certificateCopy} from './certificates';
import {PageHeading} from './shell';
import {ResponsiveImage} from './responsive-image';
import site from '../../config/site.json';
const labels:Record<Locale,{identity:string;range:string;project:string;contact:string}>=expandLocales({en:{identity:'The company behind Qicable',range:'Connections for industrial equipment',project:'From requirements to production',contact:'Talk through your project'},de:{identity:'Das Unternehmen hinter Qicable',range:'Verbindungen für Industrieanlagen',project:'Von Anforderungen zur Produktion',contact:'Ihr Projekt besprechen'},es:{identity:'La empresa detrás de Qicable',range:'Conexiones para equipos industriales',project:'De los requisitos a la producción',contact:'Hablemos de su proyecto'},fr:{identity:'L’entreprise derrière Qicable',range:'Des connexions pour les équipements industriels',project:'Des besoins à la production',contact:'Parlons de votre projet'},pt:{identity:'A empresa por trás da Qicable',range:'Conexões para equipamentos industriais',project:'Dos requisitos à produção',contact:'Vamos conversar sobre seu projeto'},ar:{identity:'الشركة وراء Qicable',range:'توصيلات للمعدات الصناعية',project:'من المتطلبات إلى الإنتاج',contact:'لنتحدث عن مشروعك'}});
export function AboutPage({locale}:{locale:Locale}){const t=messages[locale],q=qualityContent[locale],c=companyContent[locale],l=labels[locale];const icons=[Cable,FileCheck2,PackageCheck];return <>
 <PageHeading locale={locale} title={t.aboutTitle} text={t.aboutText}/>
 <section className="section container about-story"><div className="about-story-copy"><span className="model-label">QICABLE</span><h2>{l.identity}</h2><p className="about-lead">{q.relationship}</p><p>{q.about}</p><div className="about-identity"><strong>{site.legalName}</strong><p>{clientBrief[locale].registered}</p><address dir="ltr">{site.address}</address></div></div><figure className="about-story-photo"><ResponsiveImage src="/assets/manufacturing/production-floor.webp" alt={q.photos.production} width={1640} height={641} loading="lazy"/><figcaption>{q.photos.production} · Farsince</figcaption><ResponsiveImage src="/assets/manufacturing/inspection.webp" alt={q.photos.inspection} width={800} height={500} loading="lazy"/></figure></section>
 <section className="section soft-bg"><div className="container about-range-layout"><div><h2>{l.range}</h2><p>{q.scope}</p><Link className="text-link" prefetch={false} href={href(locale,'/products/')}>{t.browse} ↗</Link></div><nav className="about-range" aria-label={t.family}>{categoryDisplayOrder.map(i=><Link key={i} href={href(locale,`/products/${categorySlugs[i]}/`)} prefetch={false}><Check size={18} aria-hidden="true"/><span>{t.categories[i]}</span><ArrowUpRight size={17} aria-hidden="true"/></Link>)}</nav></div></section>
 <section className="section container"><div className="section-heading"><h2>{c.heading}</h2></div><div className="about-practices">{c.sections.map((item,i)=>{const Icon=icons[i%icons.length];return <article key={item.title}><Icon size={28} aria-hidden="true"/><h3>{item.title}</h3><p>{item.text}</p></article>})}</div></section>
 <section className="section container about-capability"><div><h2>{q.overviewTitle}</h2><p>{q.homeText}</p><p>{q.testingNote}</p><div className="about-capability-links"><Link className="button secondary" href={href(locale,'/quality/')} prefetch={false}>{t.quality}<ArrowUpRight size={18}/></Link><Link className="text-link" href={href(locale,'/certificates/')} prefetch={false}>{certificateCopy[locale].title} ↗</Link></div></div><FactoryFacts locale={locale}/></section>
 <section className="section soft-bg"><div className="container"><div className="section-heading"><h2>{l.project}</h2></div><CustomStages locale={locale}/></div></section>
 <section className="section container about-faq"><h2>{c.faqTitle}</h2><div className="faq-list">{c.faq.slice(0,3).map(item=><details key={item.question}><summary>{item.question}<span>+</span></summary><p>{item.answer}</p></details>)}</div></section>
 <section className="section container about-contact"><div><h2>{l.contact}</h2><p>{t.ctaText}</p><a href={`mailto:${site.email}`}>{site.email}</a></div><Link className="button" href={href(locale,'/contact/')} prefetch={false}>{t.contact}<ArrowUpRight size={18}/></Link></section>
 </>}
