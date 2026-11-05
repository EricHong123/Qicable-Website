import { products } from "./model";
import { productName } from "./navigation";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { messages, type Locale } from "./i18n";
import { categorySlugs, guideSlugs, href } from "./navigation";
import { guideContent, guideLabels, guideReferences, guideTopics } from "./guide-content";
import { PageHeading } from "./shell";
import styles from "./technical-guide.module.css";
import { nativeArticle } from "./native-content";
import { NativeGuideBody } from "./native-article";

export function TechnicalGuide({
  locale,
  index,
}: {
  locale: Locale;
  index: number;
}) {
  const t = messages[locale];
  const guide = guideContent[locale][index];
  const native = nativeArticle(locale, guideSlugs[index]);
  const labels = guideLabels[locale];
  const { category, examples: exampleModels, related, inquiryType } = guideTopics[index];
  const params = new URLSearchParams({
    type: inquiryType,
    from: href(locale, `/${guideSlugs[index]}/`),
  });
  return (
    <>
      <PageHeading
        locale={locale}
        title={native?.title ?? t.guideNames[index]}
        text={native?.description ?? guide.lead}
      />
      <div className={`section container ${styles.layout}`}>
        <article className={styles.article}>
          {native ? <NativeGuideBody article={native} locale={locale}/> : <>
          {guide.sections.map((section, i) => (
            <section
              key={section.title}
              id={`step-${i + 1}`}
              className={styles.step}
            >
              <span className={styles.number} aria-hidden="true">
                0{i + 1}
              </span>
              <div>
                <h2>{section.title}</h2>
                <p>{section.body}</p>
              </div>
            </section>
          ))}
          {guide.questions && <section className={styles.block} aria-labelledby="guide-questions">
            <h2 id="guide-questions">{t.faq}</h2>
            {guide.questions.map(item => <div key={item.question} className={styles.answer}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </div>)}
          </section>}
          <section id="common-mistakes" className={styles.block}>
            <h2>{labels.mistakes}</h2>
            <ul>
              {guide.mistakes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

          </section>
          <section id="inquiry-checklist" className={styles.checklist}>
            <h2>{labels.prepare}</h2>
            <ul>
              {guide.prepare.map((item) => (
                <li key={item}>
                  <Check size={18} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            {index === 8 && <a
              className={styles.download}
              href={`/assets/documents/cable-assembly-rfq-${locale}.csv`}
              download
            >{t.downloads} · RFQ (CSV)<ArrowRight size={18} aria-hidden="true" /></a>}
            <Link
              prefetch={false}
              className="button"
              href={`${href(locale, "/contact/")}?${params}`}
            >
              {t.customButton}
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </section>
          <p className={styles.note}>{labels.note}</p>
          <section className={styles.references}>
            <h2>{labels.references}</h2>
            <ul>
              {guideReferences[index].map((source) => (
                <li key={source.url}>
                  <a href={source.url} rel="noreferrer" target="_blank">
                    <bdi>{source.title}</bdi>
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </section>
          </>}
        </article>
        <aside className={styles.aside}>
          <nav aria-label={labels.steps}>
            <h2>{labels.steps}</h2>
            <ol>
              {(native ? native.sections.filter(section => !["question", "mistakes", "prepare"].includes(section.qicableRole ?? "")).map(section => ({title:section.heading})) : guide.sections).map((section, i) => (
                <li key={section.title}>
                  <a href={`#step-${i + 1}`}>{section.title}</a>
                </li>
              ))}
            </ol>
            {(!native || native.sections.some(section => section.qicableRole === "prepare")) && <a href="#inquiry-checklist" className={styles.checkLink}>
              {labels.prepare}
              <ArrowRight size={16} aria-hidden="true" />
            </a>}
          </nav>
          <div className={styles.related}>
            <h2>{t.categories[category]}</h2>
            <p>{t.categoryDescriptions[category]}</p>
            <Link
              prefetch={false}
              href={href(locale, `/products/${categorySlugs[category]}/`)}
            >
              {t.browse}
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
            {Array.from(new Set(exampleModels)).map(model => {
              const product = products.find(item => item.model === model)!;
              return <Link prefetch={false} key={model} href={href(locale, `/products/${product.slug}/`)}><bdi>{model}</bdi> · {productName(product, locale)}</Link>;
            })}
          </div>
          <nav className={styles.related} aria-label={t.guides}>
            <h2>{t.guides}</h2>
            {related.map(guideIndex => <Link
              key={guideIndex}
              prefetch={false}
              href={href(locale, `/${guideSlugs[guideIndex]}/`)}
            >{nativeArticle(locale, guideSlugs[guideIndex])?.title ?? t.guideNames[guideIndex]}<ArrowUpRight size={16} aria-hidden="true" /></Link>)}
          </nav>
        </aside>
      </div>
    </>
  );
}
