import { expandLocales, translateText } from "./locale-runtime";
import { BuyerEntryPaths, ProjectReviewFlow } from "./buyer-journey";
import { buyerJourneyCopy } from "./buyer-journey-copy";
import { MobileCarousel } from "./mobile-carousel";
import { DeferredInquiryForm as InquiryForm } from "./deferred-inquiry";
import {AboutPage} from "./about-page";
import {ContactMap} from "./contact-map";
import {Certificates,certificateCopy} from "./certificates";
import blogCovers from "../../content/blog-covers.json";
import {DeliveryPlanning} from "./delivery-planning";
import {CategoryFaq, ConfigurationComparison, ResourceTopics} from "./page-completion";
import {FamilyNavigation, ProductSectionNavigation, InstallationReview, CategoryBrief} from "./purchase-layout";
import {BuyerProblems, buyerCopy} from "./buyer-content";
import { productImageAlt, videoDescriptions, bannerVideoCopy } from "./media-description";
import { engineeringLabels, engineeringValue } from "./catalog-labels";
import { clientBrief } from "./client-brief";
import { CustomStages } from "./brief-sections";
import { categoryDisplayOrder } from "./navigation";
import { productSummary } from "./seo";
import { ResponsiveImage } from "./responsive-image";
import { relatedProducts } from "./product-relations";
import { SelectionLinks } from "./selection-links";
import { categoryContent } from "./category-content";
import selectionStyles from "./selection.module.css";
import serviceStyles from "./service.module.css";
import { ServicePage, ServiceLinks } from "./service-pages";
import { isServiceKind } from "./service-content";
import { PolicyPage } from "./policy-page";
import { isPolicyKind } from "./policy-content";
import Link from "next/link";
import { AddToQuoteButton } from "./quote-components";
import { TechnicalGuide } from "./technical-guide";
import { nativeContent, nativeArticle } from "./native-content";
import { NativeArticlePage } from "./native-article";
import { NativeProductDetails } from "./native-product";
import { guideContent, guideLabels } from "./guide-content";
import {
  ArrowRight,
  ArrowUpRight,
  ScanLine,
  Network,
  Cpu,
  Monitor,
  Cable,
  Layers,
  Check,
  Ruler,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { messages, type Locale } from "./i18n";
import {
  applicationSlugs,
  categorySlugs,
  categoryImage,
  guideSlugs,
  href,
  inquiryHref,
  pageTitle,
  products,
  productName,
  type PageRoute,
} from "./model";
import {
  Catalog,
  ProductCard,
  ProductGallery,
} from "./interactive";
import { ArrowLink, Cta, PageHeading } from "./shell";
import { HomeCarousel, type HomeSlide } from "./home-carousel";
import { companyContent } from "./company-content";
import {
  Manufacturing,
  QualityPage,
} from "./manufacturing";
import { applicationDescriptions, applicationRequirements } from "./application-content";
import site from "../../config/site.json";
const icons = [ScanLine, Network, Cable, Cpu, Monitor, Layers];
function NativeFeaturedProducts({locale}:{locale:Locale}) {
  const selected=(nativeContent?.products ?? []).filter(item=>item.agentFeaturedRank!==null&&item.agentFeaturedRank!==undefined)
    .sort((a,b)=>a.agentFeaturedRank!-b.agentFeaturedRank!)
    .map(item=>products.find(product=>product.model===item.model)!).filter(Boolean);
  if(!selected.length)return null;
  const t=messages[locale];
  return <section className="section container"><div className="section-heading"><h2>{t.featuredTitle}</h2><p>{t.featuredText}</p></div><MobileCarousel locale={locale} label={t.featuredTitle} className="product-grid featured-grid">{selected.map(product=><ProductCard key={product.model} product={product} locale={locale}/>)}</MobileCarousel></section>;
}
function ProductFamilies({ locale }: { locale: Locale }) {
  const t = messages[locale];
  return (
    <MobileCarousel locale={locale} label={t.rangeTitle} className="family-grid">
      {categoryDisplayOrder.map((i) => { const slug = categorySlugs[i]; return (
        <Link
          prefetch={false}
          className="family-card"
          href={href(locale, `/products/${slug}/`)}
          key={slug}
        >
          <div className="family-image">
            <ResponsiveImage
              src={categoryImage(i)}
              sizes={i === categoryDisplayOrder[0] ? "(max-width: 720px) 250px, (max-width: 1100px) 90vw, 800px" : "(max-width: 720px) 250px, (max-width: 1100px) 45vw, 420px"}
              width={520}
              height={350}
              alt={productImageAlt(products.find(p=>p.images[0]===categoryImage(i))!,locale)}
              loading="lazy"
            />
          </div>
          <div>
            <h3>{t.categories[i]}</h3>
            <ArrowUpRight size={21} />
          </div>
        </Link>
      ); })}
    </MobileCarousel>
  );
}
function GuideList({ locale, limit = Infinity }: { locale: Locale; limit?: number }) {
  const t = messages[locale];
  const items = nativeContent ? nativeContent.articles.filter(item => item.locale === locale).map(item => ({slug:item.slug,title:item.title,lead:item.description ?? item.excerpt ?? "",cover:item.cover?.src}))
    : guideSlugs.map((slug,i) => ({slug,title:t.guideNames[i],lead:guideContent[locale][i].lead,cover:blogCovers[slug]}));
  return (
    <div className="guide-grid blog-card-grid">
      {items.slice(0, limit).map(item => (
        <Link
          prefetch={false}
          key={item.slug}
          href={href(locale, `/${item.slug}/`)}
          className="guide-card"
        >
          {item.cover && <div className="blog-card-cover"><img src={item.cover} alt={item.title} width={960} height={320} loading="lazy" decoding="async" /></div>}
          <div className="blog-card-copy">
          <h3>{item.title}</h3>
          <p>{item.lead}</p>
          <span>
            {t.readGuide}
            <ArrowUpRight size={18} />
          </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
function CheckList({ locale }: { locale: Locale }) {
  const t = messages[locale];
  return (
    <div className="checklist">
      <h2>{t.checklistTitle}</h2>
      {t.checklist.map((text) => (
        <p key={text}>
          <Check size={18} />
          <span>{text}</span>
        </p>
      ))}
    </div>
  );
}
function Faq({ locale, featured=false }: { locale: Locale; featured?: boolean }) {
  const t = messages[locale];
  return (
    <div className="faq-list">
      {t.faqQuestions.map((q, i) => (
        <details key={q} open={featured && i===0 ? true : undefined}>
          <summary>
            {q}
            <span>+</span>
          </summary>
          <p>{t.faqAnswers[i]}</p>
        </details>
      ))}
    </div>
  );
}
function Home({ locale }: { locale: Locale }) {
  const t = messages[locale];
  const slideProduct = (model: string, label: string) => {
    const product = products.find((p) => p.model === model)!;
    return {
      src: product.images[0],
      alt: productImageAlt(product, locale),
      label,
    };
  };
  const slides: HomeSlide[] = [
    {
      id: "factory-video",
      photograph: true,
      video: true,
      title: t.manufactureTitle,
      url: href(locale, "/quality/"),
      images: [
        slideProduct("QC12A00", "USB3 Vision"),
        slideProduct("QC10B00", "10GigE"),
      ],
    },
    {
      id: "vision",
      title: t.categories[0],
      url: href(locale, "/products/machine-vision/"),
      images: [
        slideProduct("QC12A00", "USB3 Vision"),
        slideProduct("QC10B00", "10GigE"),
      ],
    },
    {
      id: "manufacturing",
      title: t.manufactureTitle,
      url: href(locale, "/quality/"),
      photograph: true,
      images: [
        {
          src: "/assets/manufacturing/inspection.webp",
          alt: t.factoryCaption,
          label: "",
        },
      ],
    },
  ];
  return (
    <>
      <HomeCarousel locale={locale} slides={slides} action={t.learn} videoDescription={videoDescriptions[locale]} videoCopy={bannerVideoCopy[locale]}>
        <h1>{t.heroTitle}</h1>
        <p>{buyerCopy(locale)[15]}</p>
        <div className="actions">
          <Link
            prefetch={false}
            href={href(locale, "/products/")}
            className="button"
          >
            {buyerCopy(locale)[0]}
            <ArrowRight size={18} />
          </Link>
          <Link
            prefetch={false}
            className="button secondary"
            href={inquiryHref(locale, undefined, "custom")}
          >
            {buyerCopy(locale)[1]}
          </Link>
        </div>
      </HomeCarousel>
      <section className="proof-strip">
        <div className="container">
          {t.proofItems.map((item, i) => {
            const Icon = [Ruler, Cable, Check][i];
            return (
              <Link
                prefetch={false}
                key={item}
                href={href(
                  locale,
                  i === 0
                    ? "/resources/guides/"
                    : i === 1
                      ? "/custom-cable-assemblies/"
                      : "/quality/",
                )}
              >
                <Icon size={21} />
                <span>{item}</span>
                <ArrowUpRight size={15} />
              </Link>
            );
          })}
        </div>
      </section>
      <BuyerEntryPaths locale={locale} />
      <section className="section container">
        <div className="section-heading">
          <h2>{t.rangeTitle}</h2>
          <p>{t.rangeText}</p>
        </div>
        <ProductFamilies locale={locale} />
      </section>
      <NativeFeaturedProducts locale={locale}/>
      <BuyerProblems locale={locale} />
      <Manufacturing locale={locale} />
      <div className="container connection-divider"><img src="/assets/banners/industrial-connections-divider-1920.webp" srcSet="/assets/banners/industrial-connections-divider-960.webp 960w, /assets/banners/industrial-connections-divider-1920.webp 1920w" sizes="(max-width: 1400px) calc(100vw - 40px), 1280px" width={1920} height={640} loading="lazy" decoding="async" alt={expandLocales({en:"Concept illustration of industrial cable connections with machine vision and control equipment",de:"Konzeptdarstellung industrieller Kabelverbindungen mit Bildverarbeitungs- und Steuerungstechnik",es:"Ilustración conceptual de conexiones de cables con equipos de visión y control industrial",fr:"Illustration conceptuelle de connexions de câbles avec équipements de vision et de commande",pt:"Ilustração conceitual de conexões de cabos com equipamentos de visão e controle industrial",ar:"رسم تصوري لتوصيلات كابلات صناعية مع معدات الرؤية والتحكم"})[locale]}/></div>
      <section className="section container">
        <div className="section-heading">
          <h2>{t.applicationsTitle}</h2>
          <p>{t.applicationsText}</p>
        </div>
        <div className="application-grid application-grid--cards">
          {[0, 1, 3, 4].map((i) => { const s=applicationSlugs[i];
            const Icon = icons[i];
            return (
              <Link
                prefetch={false}
                key={s}
                href={href(locale, `/applications/${s}/`)}
              >
                <Icon size={31} />
                <div>
                  <h3>{t.applicationNames[i]}</h3>
                  <p>{applicationDescriptions[locale][i]}</p>
                </div>
                <ArrowUpRight size={19} />
              </Link>
            );
          })}
        </div>
      </section>
      <ProjectReviewFlow locale={locale} />
      <DeliveryPlanning locale={locale}/>
      <Certificates locale={locale} home carousel/>
      <section className="section container">
        <div className="section-heading">
          <h2>{t.guides}</h2>
          <p>{t.guideLead}</p>
        </div>
        <GuideList locale={locale} limit={3} />
      </section>
      <section className="section home-faq"><div className="container home-faq-layout"><div className="home-faq-intro"><span className="home-faq-label">FAQ</span><h2>{t.faq}</h2><p>{t.ctaText}</p><Link prefetch={false} className="button secondary" href={href(locale,"/resources/faq/")}>{t.learn}<ArrowUpRight size={18}/></Link><Link prefetch={false} className="text-link" href={inquiryHref(locale)}>{t.quote}<ArrowRight size={17}/></Link></div><Faq locale={locale} featured/></div></section>
      <section className="section container product-inquiry-layout"><div><h2>{t.quote}</h2><p>{t.ctaText}</p><CheckList locale={locale}/></div><InquiryForm locale={locale}/></section>
    </>
  );
}
export function QicablePage({
  route,
  locale,
}: {
  route: PageRoute;
  locale: Locale;
}) {
  const t = messages[locale];
  const title = pageTitle(route, locale);
  if (isServiceKind(route.kind)) return <ServicePage locale={locale} kind={route.kind} />;
  if (route.kind === "home") return <Home locale={locale} />;
  if (route.kind === "catalog")
    return (
      <>
        <PageHeading
          locale={locale}
          banner={route.index === undefined ? "catalog" : route.index === 0 ? "machine-vision" : route.index === 1 ? "industrial-ethernet" : undefined}
          title={route.index === undefined ? title : categoryContent[locale].families[route.index].title}
          text={
            route.index === undefined
              ? t.catalogText
              : t.categoryDescriptions[route.index]
          }
        />
        <FamilyNavigation locale={locale} current={route.index}/>
        {route.index !== undefined && <CategoryBrief locale={locale} category={route.index}/>}
        <Catalog
          key={route.path}
          items={products}
          locale={locale}
          category={route.index}
        />
        {route.index !== undefined ? <section className="section container"><h2>{categoryContent[locale].related}</h2><SelectionLinks locale={locale} category={route.index}/></section> : <section className="section container"><CheckList locale={locale}/></section>}
        {route.index !== undefined && <CategoryFaq locale={locale} category={route.index}/>}
        <Cta locale={locale} />
      </>
    );
  if (route.kind === "product") {
    const p = route.product!;
    const cat = categorySlugs.indexOf(p.category);
    return (
      <>
        <div className="container breadcrumbs">
          <Link prefetch={false} href={href(locale, "/products/")}>
            {t.nav[0]}
          </Link>
          <span>/</span>
          <Link
            prefetch={false}
            href={href(locale, `/products/${p.category}/`)}
          >
            {t.categories[cat]}
          </Link>
          <span>/</span>
          <bdi>{p.model}</bdi>
        </div>
        <section className="product-detail container">
          <header className="product-title">
            <span className="model-label">{p.model}</span>
            <h1>{productName(p, locale)}</h1>
          </header>
          <ProductGallery product={p} locale={locale} />
          <div className="product-summary">
            <p>{productSummary(p, locale)}</p>
            <p>{t.productIntro}</p>
            <dl className="spec-summary">
              {[
                [t.connectorA, p.connectorA],
                [t.connectorB, p.connectorB],
                [t.interface, p.interface],
                ...(p.lengths.length ? [[t.length, p.lengths.map(length=>`${length} m`).join(" / ")]] : []),
              ].map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>
                    <bdi>{v}</bdi>
                  </dd>
                </div>
              ))}
            </dl>
            <div className="actions">
              <Link
                prefetch={false}
                className="button"
                href={inquiryHref(locale, p.model)}
              >
                {t.quote}
                <ArrowRight size={18} />
              </Link>
              <Link
                prefetch={false}
                className="button secondary"
                href={inquiryHref(locale, p.model, "sample")}
              >
                {t.sample}
              </Link>
            </div>
            <AddToQuoteButton model={p.model} locale={locale} />
            <p className="spec-note">{t.specificationNote}</p>
          </div>
        </section>
        <ProductSectionNavigation locale={locale}/>
        <section id="specifications" className="section container product-technical">
          <div>
            <h2>{t.specifications}</h2>
            <dl className="technical-table">
              {[
                [t.model, p.model],
                ...p.engineering.map(field => [engineeringLabels[locale][field.label] ?? translateText(field.label,locale), engineeringValue(field.value, locale)]),
                [t.family, t.categories[cat]],
                [t.connectorA, p.connectorA],
                [t.connectorB, p.connectorB],
                [t.interface, p.interface],
                ...(p.lengths.length
                  ? [[t.lengths, p.lengths.map((l) => `${l} m`).join(" / ")]]
                  : []),
              ].map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>
                    <bdi>{v}</bdi>
                  </dd>
                </div>
              ))}
            </dl>
            <Link
              prefetch={false}
              className="text-link"
              href={inquiryHref(locale, p.model, "document")}
            >
              {t.requestDrawing}
              <ArrowUpRight size={18} />
            </Link>
          </div>
          <CheckList locale={locale} />
        </section>
        <NativeProductDetails model={p.model} locale={locale}/>
        <InstallationReview locale={locale} product={p} category={cat}/>
        <ConfigurationComparison locale={locale} product={p}/>
        <section className={`section container ${selectionStyles.section}`}>
          <h2>{categoryContent[locale].related}</h2>
          <SelectionLinks locale={locale} category={cat} includeCategory/>
        </section>
        <section id="related-products" className="section soft-bg">
          <div className="container">
            <div className="section-heading">
              <h2>{t.related}</h2>
              <p>{t.relatedText}</p>
            </div>
            <MobileCarousel locale={locale} label={t.related} className="product-grid featured-grid">
              {relatedProducts(p, products)
                .map((x) => (
                  <ProductCard key={x.model} product={x} locale={locale} />
                ))}
            </MobileCarousel>
          </div>
        </section>
        <section id="product-inquiry" className="section container product-inquiry-layout"><div><span className="model-label">{p.model}</span><h2>{buyerJourneyCopy[locale].productTitle}</h2><p>{buyerJourneyCopy[locale].productIntro}</p><CheckList locale={locale}/></div><InquiryForm locale={locale} defaultProduct={p.model}/></section>
      </>
    );
  }
  if (route.kind === "contact")
    return (
      <>
        <PageHeading
          locale={locale}
          title={t.contactTitle}
          text={t.contactText}
        />
        <section className="container contact-layout section">
          <InquiryForm locale={locale} eager />
          <aside className="contact-aside">
            <h2>{t.nextTitle}</h2>
            <ol>
              {t.nextSteps.map((s, i) => (
                <li key={s}>
                  <span>{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
            <div className="contact-details">
              <strong>{site.legalName}</strong>
              <a href={`mailto:${site.email}`}>
                <Mail size={20} />
                <bdi>{site.email}</bdi>
              </a>
              <a href={`tel:${site.phone.replaceAll(" ", "")}`}>
                <Phone size={20} />
                <bdi>{site.phone}</bdi>
              </a>
              <p>
                <MapPin size={20} />
                <span>{site.address}</span>
              </p>
              <p>{clientBrief[locale].response}</p>
            </div>
          </aside>
        </section>
        <ContactMap locale={locale}/>
      </>
    );
  if (route.kind === "custom")
    return (
      <>
        <PageHeading
          locale={locale}
          title={t.customTitle}
          banner="custom"
          text={t.customText}
        />

        <section className="section container custom-intro">
          <div>
            <h2>{t.checklistTitle}</h2>
            <p>{t.ctaText}</p>
            <div className="custom-options">
              {[
                t.connectorA,
                t.connectorB,
                t.length,
                t.environment,
                t.quantity,
                t.drawing,
              ].map((s) => (
                <span key={s}>
                  <Check size={17} />
                  {s}
                </span>
              ))}
            </div>
            <Link
              prefetch={false}
              className="button"
              href={inquiryHref(locale, undefined, "custom")}
            >
              {t.customButton}
              <ArrowRight size={18} />
            </Link>
          </div>
          <ResponsiveImage
            src={categoryImage(5)}
            width={700}
            height={520}
            alt={productImageAlt(products.find(p=>p.images[0]===categoryImage(5))!,locale)}
          />
        </section>
        <section className="section soft-bg">
          <div className="container process-wide">
            <div className="section-heading">
              <h2>{t.manufactureTitle}</h2>
              <p>{t.manufactureText}</p>
            </div>
            <CustomStages locale={locale} />
          </div>
        </section>
        <DeliveryPlanning locale={locale}/>
        <section className="section container">
          <h2>{t.faq}</h2>
          <Faq locale={locale} />
        </section>
        <section className="section container product-inquiry-layout"><CheckList locale={locale}/><InquiryForm locale={locale} defaultType="custom"/></section>
      </>
    );
  if (route.kind === "certificates") return <><PageHeading locale={locale} title={certificateCopy[locale].title}/><Certificates locale={locale}/><Cta locale={locale}/></>;
  if (route.kind === "quality") return <QualityPage locale={locale} />;
  if (route.kind === "applications")
    return (
      <>
        <PageHeading
          locale={locale}
          title={t.applicationsTitle}
          text={t.applicationsText}
        />
        <section className="section container application-list">
          {applicationSlugs.map((s, i) => {
            const Icon = icons[i];
            return (
              <Link
                prefetch={false}
                key={s}
                href={href(locale, `/applications/${s}/`)}
              >
                <Icon size={32} />
                <div>
                  <h2>{t.applicationNames[i]}</h2>
                  <p>{applicationDescriptions[locale][i]}</p>
                </div>
                <ArrowUpRight size={24} />
              </Link>
            );
          })}
        </section>
        <Cta locale={locale} />
      </>
    );
  if (route.kind === "application") {
    const c = [0, 1, 0, 5, 3][route.index!];
    return (
      <>
        <PageHeading
          locale={locale}
          title={title}
          text={applicationDescriptions[locale][route.index!]}
        />
        <section className="section container application-detail">
          <ResponsiveImage
            src={categoryImage(c)}
            alt={productImageAlt(products.find(p=>p.images[0]===categoryImage(c))!,locale)}
            width={750}
            height={580}
          />
          <div className={selectionStyles.requirements}><h2>{guideLabels[locale].prepare}</h2><ul>{applicationRequirements[locale][route.index!].map(item => <li key={item}>{item}</li>)}</ul></div>
        </section>
        <section className={`section container ${selectionStyles.section}`}>
          <h2>{categoryContent[locale].related}</h2>
          <SelectionLinks locale={locale} category={c} includeCategory/>
        </section>
        <section className="section soft-bg">
          <div className="container">
            <h2>{t.categories[c]}</h2>
            <MobileCarousel locale={locale} label={t.related} className="product-grid featured-grid">
              {products
                .filter((p) => p.category === categorySlugs[c])
                .slice(0, 3)
                .map((p) => (
                  <ProductCard key={p.model} product={p} locale={locale} />
                ))}
            </MobileCarousel>
          </div>
        </section>
        <Cta locale={locale} />
      </>
    );
  }
  if (route.kind === "resources" || route.kind === "guides")
    return (
      <>
        <PageHeading locale={locale} title={title} text={t.guideLead} />
        <section className={`section container ${route.kind === "resources" ? serviceStyles.safe : "blog-archive"}`}>
          {route.kind === "resources" && <ResourceTopics locale={locale}/>}
          <GuideList locale={locale} />
          {route.kind === "resources" && <ServiceLinks locale={locale} />}
          {route.kind === "resources" && (
            <div className="resource-links">
              <ArrowLink locale={locale} to="/resources/downloads/">
                {t.downloads}
              </ArrowLink>
              <ArrowLink locale={locale} to="/resources/faq/">
                {t.faq}
              </ArrowLink>
            </div>
          )}
        </section>
        <Cta locale={locale} />
      </>
    );
  if (route.kind === "guide") {
    const article = nativeArticle(locale, route.path.slice(1,-1));
    return route.index === undefined && article ? <NativeArticlePage article={article} locale={locale}/> : <TechnicalGuide locale={locale} index={route.index!} />;
  }
  if (route.kind === "faq")
    return (
      <>
        <PageHeading locale={locale} title={t.faq} />
        <section className="section container narrow">
          <Faq locale={locale} />
          <h2 className="business-faq-heading" id="ordering">
            {companyContent[locale].faqTitle}
          </h2>
          <div className="faq-list">
            {companyContent[locale].faq.map((item) => (
              <details key={item.question}>
                <summary>
                  {item.question}
                  <span>+</span>
                </summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
        <Cta locale={locale} />
      </>
    );
  if (route.kind === "about") return <AboutPage locale={locale}/>;
  if (isPolicyKind(route.kind)) return <PolicyPage locale={locale} kind={route.kind} />;
  return null;
}
