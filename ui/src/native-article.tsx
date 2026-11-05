import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import type { NativeArticle, NativeSection } from "./native-content";
import { messages, type Locale } from "./i18n";
import { href } from "./model";
import { guideLabels, guideTopics } from "./guide-content";
import { PageHeading } from "./shell";
import styles from "./technical-guide.module.css";

type Inline = { text: string; href?: string }[];
function InlineText({ parts }: { parts: Inline }) {
  return <>{parts.map((part, index) => part.href
    ? <a key={index} href={part.href}>{part.text}</a> : <span key={index}>{part.text}</span>)}</>;
}
export function NativeSectionBody({ section }: { section: NativeSection }) {
  if (!section.blocks?.length) return <>
    {section.paragraphs.map((text, index) => <p key={index}>{text}</p>)}
    {!!section.bullets?.length && <ul>{section.bullets.map((text, index) => <li key={index}>{text}</li>)}</ul>}
  </>;
  return <>{section.blocks.map((block, index) => {
    if (block.kind === "paragraph") return <p key={index}><InlineText parts={block.content}/></p>;
    if (block.kind === "image") return <figure key={index}><img src={block.image.src} alt={block.image.alt ?? ""} width={block.image.width} height={block.image.height} loading="lazy" decoding="async"/>{block.caption && <figcaption>{block.caption}</figcaption>}</figure>;
    if (block.kind === "list") {
      const Tag = block.ordered ? "ol" : "ul";
      return <Tag key={index}>{block.items.map((item, i) => <li key={i}><InlineText parts={item}/></li>)}</Tag>;
    }
    return <div key={index} className={styles.tableScroll} role="region" aria-label={section.heading} tabIndex={0}><table className={styles.contentTable}><tbody>{block.rows.map((row, i) => <tr key={i}>{row.map((cell, j) => {
      const Tag = cell.header ? "th" : "td";
      return <Tag key={j} scope={cell.header ? (i === 0 ? "col" : "row") : undefined}><InlineText parts={cell.content}/></Tag>;
    })}</tr>)}</tbody></table></div>;
  })}</>;
}
export function NativeGuideBody({ article, locale }: { article: NativeArticle; locale: Locale }) {
  const t = messages[locale];
  const steps = article.sections.filter(section => !["question", "mistakes", "prepare"].includes(section.qicableRole ?? ""));
  const questions = article.sections.filter(section => section.qicableRole === "question");
  const firstQuestion = article.sections.findIndex(section => section.qicableRole === "question");
  return <>
    {article.sections.map((section, index) => {
      if (section.qicableRole === "question") {
        if (index !== firstQuestion) return null;
        return <section key={index} className={styles.block} aria-labelledby="guide-questions"><h2 id="guide-questions">{t.faq}</h2>{questions.map((item, i) => <div key={i} className={styles.answer}><h3>{item.heading}</h3><NativeSectionBody section={item}/></div>)}</section>;
      }
      if (section.qicableRole === "mistakes") return <section key={index} id="common-mistakes" className={styles.block}><h2>{section.heading}</h2><NativeSectionBody section={section}/></section>;
      if (section.qicableRole === "prepare") return <section key={index} id="inquiry-checklist" className={styles.checklist}>
        <h2>{section.heading}</h2>
        {!section.blocks?.length && !section.paragraphs.length ? <ul>{section.bullets?.map((text, i) => <li key={i}><Check size={18} aria-hidden="true"/><span>{text}</span></li>)}</ul> : <NativeSectionBody section={section}/>}
        {article.qicable?.guideIndex === 8 && <a className={styles.download} href={`/assets/documents/cable-assembly-rfq-${locale}.csv`} download>{t.downloads} · RFQ (CSV)<ArrowRight size={18} aria-hidden="true"/></a>}
        <Link prefetch={false} className="button" href={`${href(locale,"/contact/")}?${new URLSearchParams({type:article.qicable ? guideTopics[article.qicable.guideIndex].inquiryType : "custom",from:href(locale,`/${article.slug}/`)})}`}>{t.customButton}<ArrowRight size={18} aria-hidden="true"/></Link>
      </section>;
      const step = steps.indexOf(section) + 1;
      return <section key={index} id={`step-${step}`} className={styles.step}><span className={styles.number} aria-hidden="true">{String(step).padStart(2,"0")}</span><div><h2>{section.heading}</h2><NativeSectionBody section={section}/></div></section>;
    })}
    {article.qicable && <p className={styles.note}>{guideLabels[locale].note}</p>}
    {!!article.relatedLinks?.length && <section className={styles.references}><h2>{guideLabels[locale].references}</h2><ul>{article.relatedLinks.map((item, i) => <li key={i}><a href={item.href} rel="noreferrer" target="_blank"><bdi>{item.label}</bdi><ArrowUpRight size={15} aria-hidden="true"/></a></li>)}</ul></section>}
  </>;
}
export function NativeArticlePage({ article, locale }: { article: NativeArticle; locale: Locale }) {
  return <><PageHeading locale={locale} title={article.title} text={article.description ?? article.excerpt ?? ""}/><div className={`section container ${styles.layout}`}><article className={styles.article}><NativeGuideBody article={article} locale={locale}/></article><aside className={styles.aside}><Link href={href(locale,"/blog/")} prefetch={false}>{messages[locale].guides}<ArrowUpRight size={16} aria-hidden="true"/></Link></aside></div></>;
}
