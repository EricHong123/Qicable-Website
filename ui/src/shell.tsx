import { expandLocales } from "./locale-runtime";
import {certificateCopy} from "./certificates";
import {SocialLinks} from "./social-links";
import { categoryDisplayOrder } from "./navigation";
import selectionStyles from "./selection.module.css";
import serviceStyles from "./service.module.css";
import { serviceContent, servicePaths } from "./service-content";
import { policyContent, policyKinds } from "./policy-content";
import policyStyles from "./policy-footer.module.css";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Cable } from "lucide-react";
import type { ReactNode } from "react";
import { messages, localeNames, locales, type Locale } from "./i18n";
import { categorySlugs, categoryImage, href, products, productName } from "./model";
import { LocalePicker } from "./locale-picker";
import { MobileNavigation, ProductsMegaMenu } from "./header-navigation";
import { ContactDock } from "./contact-dock";
import { QuoteListLink } from "./quote-components";
import { nativeContent, nativeArticle } from "./native-content";
import site from "../../config/site.json";
const navPaths = [
  "/products/",
  "/applications/",
  "/custom-cable-assemblies/",
  "/quality/",
  "/blog/",
  "/about/",
];
export function SiteShell({
  locale,
  path,
  children,
}: {
  locale: Locale;
  path: string;
  children: ReactNode;
}) {
  const t = messages[locale];
  const articlePath = nativeContent?.articles.some(item => path === `/${item.slug}/`);
  const languageTargets = articlePath ? Object.fromEntries(locales.filter(value => nativeArticle(value,path.slice(1,-1))).map(value=>[value,href(value,path)])) : undefined;
  const categories = categoryDisplayOrder.map((index) => { const slug = categorySlugs[index]; return ({
    name: t.categories[index],
    description: t.categoryDescriptions[index],
    url: href(locale, `/products/${slug}/`),
    image: categoryImage(index) ?? "",
    productLabel: (()=>{const p=products.find(p=>p.images[0]===categoryImage(index));return p ? `${p.model} · ${productName(p,locale)}` : t.categories[index];})(),
    interfaces: [
      ...new Set(
        products
          .filter((product) => product.category === slug)
          .map((product) => product.interface),
      ),
    ].map((name) => ({
      name,
      url: `${href(locale, `/products/${slug}/`)}?interface=${encodeURIComponent(name)}`,
    })),
  }); });
  const menuProps = {
    categories,
    catalogUrl: href(locale, "/products/"),
    customUrl: href(locale, "/contact/?type=custom"),
    initialCategory: Math.max(
      0,
      categoryDisplayOrder.findIndex(
        (index) =>
          path.startsWith(`/products/${categorySlugs[index]}/`) ||
          products.some(
            (p) => p.category === categorySlugs[index] && path === `/products/${p.slug}/`,
          ),
      ),
    ),
    labels: {
      products: t.nav[0],
      all: t.all,
      range: t.rangeLabel,
      menu: t.menu,
      close: t.close,
      search: t.search,
      searchLabel: t.searchLabel,
      custom: t.customButton,
      browse: t.browse,
      explore: t.learn,
      interfaces: t.interface,
      customTitle: t.customTitle,
      customText: t.customText,
    },
  };
  return (
    <>
      <a className="skip-link" href="#main-content">
        {t.skip}
      </a>
      <header className="site-header">
        <div className="header-social-bar"><div className="container"><a href={`mailto:${site.email}`}>{site.email}</a><SocialLinks locale={locale}/></div></div>
        <div className="header-inner container">
          <Link
            prefetch={false}
            href={href(locale, "/")}
            className="wordmark"
            dir="ltr"
            aria-label={`Qicable · ${t.home}`}
          >
            <img
              src="/assets/brand/logo.svg"
              width={2400}
              height={565}
              alt="Qicable"
            />
          </Link>
          <nav className="desktop-nav" aria-label={t.menu}>
            <ProductsMegaMenu
              key={`${locale}:${path}`}
              {...menuProps}
              active={path.startsWith("/products/")}
            />
            {navPaths.slice(1).map((p, i) => (
              <Link
                prefetch={false}
                key={p}
                href={href(locale, p)}
                aria-current={path.startsWith(p) ? "page" : undefined}
              >
                {p === "/blog/" ? t.guides : t.nav[i + 1]}
              </Link>
            ))}
          </nav>
          <div className="header-tools">
            <LocalePicker locale={locale} path={path} targets={languageTargets} />
            <QuoteListLink locale={locale} header />
            <MobileNavigation
              key={`${locale}:${path}`}
              {...menuProps}
              languageControl={
                <LocalePicker
                  key="mobile-language"
                  locale={locale}
                  path={path}
                  targets={languageTargets}
                />
              }
              quoteControl={
                <QuoteListLink key="mobile-quote" locale={locale} />
              }
              links={[
                ...navPaths.slice(1).map((p, i) => ({
                  name: p === "/blog/" ? t.guides : t.nav[i + 1],
                  url: href(locale, p),
                  active: path.startsWith(p),
                })),
                {
                  name: t.contact,
                  url: href(locale, "/contact/"),
                  active: path === "/contact/",
                },
              ]}
            />
          </div>
        </div>
      </header>
      {children}
      <footer className="site-footer">
        <div className="footer-main container">
          <div className="footer-brand">
            <Link
              prefetch={false}
              href={href(locale, "/")}
              className="wordmark"
              dir="ltr"
            >
              <img
                src="/assets/brand/logo.svg"
                width={2400}
                height={565}
                alt="Qicable"
                loading="lazy"
              />
            </Link>
            <p>{t.footerText}</p>
            <address className="footer-address" dir="ltr">{site.address}</address>
            <a href={`mailto:${site.email}`} className="footer-email">
              {site.email}
              <ArrowUpRight size={15} />
            </a>
            <a href={`tel:${site.phone.replaceAll(" ", "")}`} dir="ltr">
              {site.phone}
            </a>
          </div>
          <div>
            <h2>{t.nav[0]}</h2>
            {categoryDisplayOrder.map((i) => { const p = categorySlugs[i]; return (
              <Link
                prefetch={false}
                key={p}
                href={href(locale, `/products/${p}/`)}
              >
                {t.categories[i]}
              </Link>
            ); })}
          </div>
          <div className={serviceStyles.footerColumn}>
            <h2>{t.resources}</h2>
            <Link className={serviceStyles.footerLink} prefetch={false} href={href(locale, servicePaths.samples)}>{serviceContent[locale].samples.title}</Link>
            <Link className={serviceStyles.footerLink} prefetch={false} href={href(locale, servicePaths.support)}>{serviceContent[locale].support.title}</Link>
            <Link prefetch={false} href={href(locale, "/blog/")}>
              {t.guides}
            </Link>
            <Link prefetch={false} href={href(locale, "/resources/downloads/")}>
              {t.downloads}
            </Link>
            <Link prefetch={false} href={href(locale, "/resources/faq/")}>
              {t.faq}
            </Link>
            <Link prefetch={false} href={href(locale, "/quality/")}>
              {t.quality}
            </Link>
          </div>
          <div className={serviceStyles.footerColumn}>
            <h2>{t.nav[5]}</h2>
            <Link prefetch={false} href={href(locale,"/certificates/")}>{certificateCopy[locale].title}</Link>
            <Link className={serviceStyles.footerLink} prefetch={false} href={href(locale, servicePaths.partners)}>{serviceContent[locale].partners.title}</Link>
            <Link prefetch={false} href={href(locale, "/about/")}>
              {t.about}
            </Link>
            <Link
              prefetch={false}
              href={href(locale, "/custom-cable-assemblies/")}
            >
              {t.nav[2]}
            </Link>
            <Link prefetch={false} href={href(locale, "/contact/")}>
              {t.contact}
            </Link>
            <a
              href={`https://wa.me/${site.whatsapp}`}
              rel="noreferrer"
              target="_blank"
            >
              WhatsApp
              <ArrowUpRight size={12} />
            </a>
          </div>
        </div>
        <nav className={`container ${selectionStyles.languages}`} aria-label={t.language}>
          {locales.filter(language => !languageTargets || languageTargets[language]).map(language => <Link prefetch={false} key={language} href={href(language,path)} hrefLang={language} lang={language} dir={language === "ar" ? "rtl" : "ltr"} aria-current={language === locale ? "page" : undefined}>{localeNames[language]}</Link>)}
        </nav>
        <div className="footer-bottom container">
          <span>
            © {new Date().getUTCFullYear()} {site.legalName} · Qicable.{" "}
            {t.rights}
          </span>
          <nav className={policyStyles.links} aria-label={policyContent[locale].label}>
            {policyKinds.map((kind) => <Link prefetch={false} key={kind} href={href(locale, `/${kind}/`)}>{policyContent[locale].pages[kind].title}</Link>)}
          </nav>
        </div>
      </footer>
      <ContactDock
        key={`${locale}:${path}`}
        locale={locale}
        product={
          products.find((product) => path === `/products/${product.slug}/`)
            ?.model
        }
      />
    </>
  );
}
export function ArrowLink({
  locale,
  to,
  children,
}: {
  locale: Locale;
  to: string;
  children: ReactNode;
}) {
  return (
    <Link prefetch={false} className="text-link" href={href(locale, to)}>
      {children}
      <ArrowRight size={17} />
    </Link>
  );
}
export function Cta({ locale }: { locale: Locale }) {
  const t = messages[locale];
  return (
    <section className="cta-section">
      <div className="container">
        <div>
          <Cable size={28} />
          <h2>{t.ctaTitle}</h2>
          <p>{t.ctaText}</p>
        </div>
        <Link
          prefetch={false}
          href={href(locale, "/contact/")}
          className="button"
        >
          {t.quote}
          <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
export function PageHeading({
  locale,
  title,
  text,
  crumb,
  banner,
}: {
  locale: Locale;
  title: string;
  text?: string;
  crumb?: string;
  banner?: "catalog" | "machine-vision" | "industrial-ethernet" | "custom";
}) {
  const t = messages[locale];
  const conceptLabels = expandLocales({en:"Cable assembly concept illustration",de:"Konzeptdarstellung von Kabelkonfektionen",es:"Ilustración conceptual de conjuntos de cables",fr:"Illustration conceptuelle de câbles assemblés",pt:"Ilustração conceitual de conjuntos de cabos",ar:"رسم توضيحي تصوري لتجميعات الكابلات"});
  return (
    <section className={`page-heading ${banner ? "page-heading--banner" : ""}`}>
      {banner && <img className="page-heading-banner-image" src={`/assets/banners/${banner}-concept-1920.webp`} srcSet={`/assets/banners/${banner}-concept-960.webp 960w, /assets/banners/${banner}-concept-1920.webp 1920w`} sizes="100vw" width={1920} height={640} alt={conceptLabels[locale]} fetchPriority="high" decoding="async" />}
      <div className="container">
        <div className="breadcrumbs">
          <Link prefetch={false} href={href(locale, "/")}>
            {t.home}
          </Link>
          <span>/</span>
          <span>{crumb ?? title}</span>
        </div>
        <h1>{title}</h1>
        {text && <p>{text}</p>}
      </div>
    </section>
  );
}
