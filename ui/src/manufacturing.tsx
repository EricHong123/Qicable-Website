import {DeliveryPlanning} from "./delivery-planning";
import {Certificates} from "./certificates";
import { FactoryFacts } from "./brief-sections";
import { ResponsiveImage } from "./responsive-image";
import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { messages, type Locale } from "./i18n";
import { href, inquiryHref } from "./navigation";
import { PageHeading } from "./shell";
import { qualityContent } from "./quality-content";
import styles from "./manufacturing.module.css";

const topicIds = ["manufacturing", "testing", "engineering", "traceability", "compliance"];

function QualityInquiry({ locale, type }: { locale: Locale; type: "custom" | "document" }) {
  const q = qualityContent[locale];
  const destination = `${inquiryHref(locale, undefined, type)}&from=${encodeURIComponent(href(locale, "/quality/"))}`;
  return (
    <Link prefetch={false} className={`button ${type === "document" ? "secondary" : ""}`} href={destination}>
      <span>{type === "document" ? q.documentCta : q.engineeringCta}</span>
      <ArrowRight size={18} aria-hidden="true" />
    </Link>
  );
}

export function ManufacturingPhoto({ locale }: { locale: Locale }) {
  const q = qualityContent[locale];
  return (
    <figure className={styles.photo}>
      <ResponsiveImage src="/assets/manufacturing/inspection.webp" width={1920} height={996} alt={q.photos.inspection} loading="lazy" />
      <figcaption>{q.photos.inspection} · Farsince</figcaption>
    </figure>
  );
}

export function Manufacturing({ locale }: { locale: Locale }) {
  const q = qualityContent[locale];
  return (
    <section className={`section soft-bg ${styles.home}`} id="manufacturing" aria-labelledby="manufacturing-title">
      <div className={`container ${styles.homeGrid}`}>
        <div>
          <ManufacturingPhoto locale={locale} />
          <div className={styles.homePhotos}>
            <figure className={styles.photo}>
              <ResponsiveImage src="/assets/manufacturing/assembly.webp" width={400} height={330} alt={q.photos.molding} loading="lazy" />
              <figcaption>{q.photos.molding}</figcaption>
            </figure>
            <figure className={styles.photo}>
              <ResponsiveImage src="/assets/manufacturing/testing.webp" width={750} height={500} alt={q.photos.testing} loading="lazy" />
              <figcaption>{q.photos.testing}</figcaption>
            </figure>
          </div>
        </div>
        <div>
          <h2 id="manufacturing-title">{messages[locale].manufactureTitle}</h2>
          <p className={styles.lead}>{q.homeText}</p>
          <FactoryFacts locale={locale} />
          <ol className={styles.summary}>
            {q.homeSteps.map((item, index) => (
              <li key={item.title}>
                <span className={styles.number} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <div><h3>{item.title}</h3><p>{item.text}</p></div>
              </li>
            ))}
          </ol>
          <div className={styles.actions}>
            <Link prefetch={false} className="text-link" href={href(locale, "/quality/")}>
              <span>{q.processCta}</span><ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function QualityPage({ locale }: { locale: Locale }) {
  const q = qualityContent[locale];
  return (
    <div className={styles.page} data-quality-page>
      <PageHeading locale={locale} title={messages[locale].quality} text={q.intro} />
      <nav className={`container ${styles.topics}`} aria-label={q.navLabel}>
        {q.nav.map((label, i) => <a href={`#${topicIds[i]}`} key={label}>{label}</a>)}
      </nav>
      <section className="section container" aria-labelledby="quality-overview-title">
        <div className={styles.overview}>
          <div>
            <h2 id="quality-overview-title">{q.overviewTitle}</h2>
            <p>{q.relationship}</p>
            <p>{q.about}</p>
            <FactoryFacts locale={locale} />
            <p className={styles.note}>{q.scope}</p>
          </div>
          <figure className={styles.photo}>
            <ResponsiveImage src="/assets/manufacturing/production-floor.webp" loading="lazy" width={1640} height={641} alt={q.photos.production} />
            <figcaption>{q.photos.production} · Farsince</figcaption>
          </figure>
        </div>
        <div className={styles.actions}>
          <QualityInquiry locale={locale} type="custom" />
          <QualityInquiry locale={locale} type="document" />
        </div>
      </section>
      <section id="manufacturing" className="section soft-bg" aria-labelledby="quality-process-title">
        <div className="container">
          <div className={styles.heading}>
            <h2 id="quality-process-title">{q.processTitle}</h2>
            <p>{q.processText}</p>
          </div>
          <ol className={styles.steps}>
            {q.steps.map((item, index) => (
              <li key={item.title}>
                <span className={styles.number} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <h3>{item.title}</h3><p>{item.text}</p>
              </li>
            ))}
          </ol>
          <div className={styles.photoStrip}>
            {[
              { file: "cutting.webp", width: 400, height: 332, caption: q.photos.cutting },
              { file: "assembly.webp", width: 400, height: 330, caption: q.photos.molding },
              { file: "testing.webp", width: 750, height: 500, caption: q.photos.testing },
            ].map((photo) => (
              <figure className={styles.photo} key={photo.file}>
                <ResponsiveImage src={`/assets/manufacturing/${photo.file}`} width={photo.width} height={photo.height} alt={photo.caption} loading="lazy" />
                <figcaption>{photo.caption}</figcaption>
              </figure>
            ))}
          </div>
          <p className={styles.photoSource}>{q.photos.source}</p>
        </div>
      </section>
      <section id="testing" className="section container" aria-labelledby="quality-testing-title">
        <div className={styles.heading}>
          <h2 id="quality-testing-title">{q.testingTitle}</h2>
          <p>{q.testingText}</p>
        </div>
        <table className={styles.testTable}>
          <caption className="sr-only">{q.testingTitle}</caption>
          <thead><tr>{q.testHeadings.map((heading) => <th key={heading} scope="col">{heading}</th>)}</tr></thead>
          <tbody>
            {q.tests.map((test) => (
              <tr key={test.title}>
                <th scope="row">{test.title}</th>
                <td><span className={styles.mobileLabel} aria-hidden="true">{q.testHeadings[1]}</span>{test.checks}</td>
                <td><span className={styles.mobileLabel} aria-hidden="true">{q.testHeadings[2]}</span>{test.scope}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className={styles.note}>{q.testingNote}</p>
      </section>
      <Certificates locale={locale} home/>
      <section id="engineering" className="section soft-bg" aria-labelledby="quality-engineering-title">
        <div className={`container ${styles.engineering}`}>
          <div>
            <h2 id="quality-engineering-title">{q.engineeringTitle}</h2>
            <p className={styles.lead}>{q.engineeringText}</p>
            <dl className={styles.records}>
              {q.records.map((item) => <div key={item.title}><dt>{item.title}</dt><dd>{item.text}</dd></div>)}
            </dl>
          </div>
          <aside className={styles.change}>
            <FileText size={28} aria-hidden="true" />
            <h3>{q.changeTitle}</h3>
            <p>{q.changeText}</p>
            <div className={styles.actions}><QualityInquiry locale={locale} type="custom" /></div>
          </aside>
        </div>
      </section>
      <section id="traceability" className="section container" aria-labelledby="quality-trace-title">
        <div className={styles.heading}>
          <h2 id="quality-trace-title">{q.traceTitle}</h2>
          <p>{q.traceText}</p>
        </div>
        <div className={styles.delivery}>
          {q.delivery.map((item) => <article key={item.title}><h3>{item.title}</h3><p>{item.text}</p></article>)}
        </div>
        <p className={styles.note}>{q.issueText}</p>
      </section>
      <DeliveryPlanning locale={locale}/>
      <section id="compliance" className="section soft-bg" aria-labelledby="quality-documents-title">
        <div className={`container ${styles.engineering}`}>
          <div>
            <h2 id="quality-documents-title">{q.documentsTitle}</h2>
            <p className={styles.lead}>{q.documentsText}</p>
            <p className={styles.note}>{q.documentNote}</p>
          </div>
          <div>
            <ul className={styles.documents}>{q.documents.map((item) => <li key={item}><FileText size={20} aria-hidden="true" /><span>{item}</span></li>)}</ul>
            <div className={styles.actions}><QualityInquiry locale={locale} type="document" /></div>
          </div>
        </div>
      </section>
      <section className={`section ${styles.inquiry}`} aria-labelledby="quality-inquiry-title">
        <div className="container">
          <h2 id="quality-inquiry-title">{q.inquiryTitle}</h2>
          <p className={styles.lead}>{q.inquiryText}</p>
          <div className={styles.actions}><QualityInquiry locale={locale} type="custom" /></div>
        </div>
      </section>
    </div>
  );
}
