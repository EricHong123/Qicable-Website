import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import site from "../../config/site.json";
import type { Locale } from "./i18n";
import { href } from "./navigation";
import { policyContent, policyKinds, type PolicyKind } from "./policy-content";
import { CookieSettings } from "./analytics-consent";
import styles from "./policy.module.css";

export function PolicyPage({ locale, kind }: { locale: Locale; kind: PolicyKind }) {
  const copy = policyContent[locale];
  const page = copy.pages[kind];
  const updated = kind === "privacy" || kind === "cookies" ? "2026-10-29" : "2026-10-13";
  const date = new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${updated}T00:00:00Z`));
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className="container">
          <p className={styles.label}>{copy.label}</p>
          <h1>{page.title}</h1>
          <p className={styles.intro}>{page.intro}</p>
          <p className={styles.date}>{copy.updated} <time dateTime={updated}>{date}</time></p>
        </div>
      </header>
      <div className={`container ${styles.layout}`}>
        <aside className={styles.sidebar}>
          <details className={styles.mobileContents}><summary>{copy.contents}</summary><nav aria-label={copy.contents}><ol>{page.sections.map(section=><li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>)}</ol></nav></details>
          <nav className={styles.desktopContents} aria-label={copy.contents}>
            <h2>{copy.contents}</h2>
            <ol>{page.sections.map((section) => <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>)}</ol>
          </nav>
          <nav className={styles.related} aria-label={copy.related}>
            <h2>{copy.related}</h2>
            {policyKinds.map((item) => <Link prefetch={false} key={item} href={href(locale, `/${item}/`)} aria-current={item === kind ? "page" : undefined}>{copy.pages[item].title}</Link>)}
          </nav>
        </aside>
        <article className={styles.article} aria-label={page.title}>
          {page.sections.map((section, index) => <section id={section.id} key={section.id} tabIndex={-1} className={styles.section}>
            <h2><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{section.title}</h2>
            <p>{section.text}</p>
          </section>)}
          {kind === "cookies" && <div className={styles.settings}><CookieSettings locale={locale} /></div>}
          <section className={styles.contact} aria-labelledby="policy-contact-title">
            <Mail size={24} aria-hidden="true" />
            <h2 id="policy-contact-title">{copy.contact}</h2>
            <p>{copy.note}</p>
            <address><strong><bdi>{site.legalName}</bdi></strong><span><bdi>{site.address}</bdi></span></address>
            <a className={styles.email} href={`mailto:${site.email}`}><bdi>{site.email}</bdi><ArrowUpRight size={18} aria-hidden="true" /></a>
          </section>
        </article>
      </div>
    </div>
  );
}
