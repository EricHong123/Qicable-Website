import Link from "next/link";
import { ArrowRight, ArrowUpRight, Cpu, Monitor, Network, ScanLine } from "lucide-react";
import { applicationDescriptions } from "./application-content";
import { FactoryFacts } from "./brief-sections";
import { messages, type Locale } from "./i18n";
import { expandLocales } from "./locale-runtime";
import { applicationSlugs, href } from "./navigation";
import { qualityContent } from "./quality-content";
import { ResponsiveImage } from "./responsive-image";
import styles from "./home-editorial.module.css";

const applicationEntries = [
  { index: 0, icon: ScanLine },
  { index: 1, icon: Network },
  { index: 3, icon: Cpu },
  { index: 4, icon: Monitor },
] as const;

const applicationImageAlt = expandLocales({
  en: "Concept illustration of industrial cable connections with machine vision and control equipment",
  de: "Konzeptdarstellung industrieller Kabelverbindungen mit Bildverarbeitungs- und Steuerungstechnik",
  es: "Ilustración conceptual de conexiones de cables con equipos de visión y control industrial",
  fr: "Illustration conceptuelle de connexions de câbles avec équipements de vision et de commande",
  pt: "Ilustração conceitual de conexões de cabos com equipamentos de visão e controle industrial",
  ar: "رسم تصوري لتوصيلات كابلات صناعية مع معدات الرؤية والتحكم",
});

export function HomeApplications({ locale }: { locale: Locale }) {
  const t = messages[locale];
  return (
    <section className={`section ${styles.applications}`} aria-labelledby="home-applications-title">
      <div className={`container ${styles.applicationLayout}`}>
        <div className={styles.applicationIntro}>
          <h2 id="home-applications-title">{t.applicationsTitle}</h2>
          <p>{t.applicationsText}</p>
          <img
            className={styles.applicationImage}
            src="/assets/banners/industrial-connections-divider-1920.webp"
            srcSet="/assets/banners/industrial-connections-divider-960.webp 960w, /assets/banners/industrial-connections-divider-1920.webp 1920w"
            sizes="(max-width: 900px) calc(100vw - 40px), (max-width: 1400px) 44vw, 560px"
            width={1920}
            height={640}
            loading="lazy"
            decoding="async"
            alt={applicationImageAlt[locale]}
          />
        </div>
        <div className={styles.applicationList}>
          {applicationEntries.map(({ index, icon: Icon }) => (
            <Link
              className={styles.applicationLink}
              href={href(locale, `/applications/${applicationSlugs[index]}/`)}
              prefetch={false}
              key={applicationSlugs[index]}
            >
              <Icon className={styles.applicationIcon} size={25} aria-hidden="true" />
              <div>
                <h3>{t.applicationNames[index]}</h3>
                <p>{applicationDescriptions[locale][index]}</p>
              </div>
              <ArrowUpRight className={styles.linkArrow} size={22} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeManufacturing({ locale }: { locale: Locale }) {
  const q = qualityContent[locale];
  return (
    <section
      className={`section ${styles.manufacturing}`}
      id="manufacturing"
      aria-labelledby="manufacturing-title"
    >
      <div className="container">
        <div className={styles.manufacturingHeading}>
          <div>
            <h2 id="manufacturing-title">{messages[locale].manufactureTitle}</h2>
            <p className={styles.lead}>{q.homeText}</p>
          </div>
          <div className={styles.factoryMetrics}>
            <FactoryFacts locale={locale} />
          </div>
        </div>
        <div className={styles.manufacturingLayout}>
          <div className={styles.manufacturingImages}>
            <figure className={styles.photo}>
              <ResponsiveImage
                src="/assets/manufacturing/inspection.webp"
                width={1920}
                height={996}
                sizes="(max-width: 900px) calc(100vw - 40px), (max-width: 1400px) 56vw, 740px"
                alt={q.photos.inspection}
                loading="lazy"
              />
              <figcaption>{q.photos.inspection} · Farsince</figcaption>
            </figure>
            <div className={styles.supportPhotos}>
              <figure className={styles.photo}>
                <ResponsiveImage
                  src="/assets/manufacturing/assembly.webp"
                  width={400}
                  height={330}
                  sizes="(max-width: 540px) calc((100vw - 52px) / 2), (max-width: 900px) 42vw, 360px"
                  alt={q.photos.molding}
                  loading="lazy"
                />
                <figcaption>{q.photos.molding}</figcaption>
              </figure>
              <figure className={styles.photo}>
                <ResponsiveImage
                  src="/assets/manufacturing/testing.webp"
                  width={750}
                  height={500}
                  sizes="(max-width: 540px) calc((100vw - 52px) / 2), (max-width: 900px) 42vw, 360px"
                  alt={q.photos.testing}
                  loading="lazy"
                />
                <figcaption>{q.photos.testing}</figcaption>
              </figure>
            </div>
          </div>
          <div className={styles.manufacturingScope}>
            <ol className={styles.scopeList}>
              {q.homeSteps.map((step, index) => (
                <li key={step.title}>
                  <span className={styles.stepNumber} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <div><h3>{step.title}</h3><p>{step.text}</p></div>
                </li>
              ))}
            </ol>
            <Link prefetch={false} className={`text-link ${styles.qualityLink}`} href={href(locale, "/quality/")}>
              <span>{q.processCta}</span><ArrowRight size={19} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
