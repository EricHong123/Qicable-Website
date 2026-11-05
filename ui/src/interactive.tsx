"use client";
import { expandLocales } from "./locale-runtime";

import { productImageAlt } from "./media-description";
import { categoryDisplayOrder } from "./navigation";
import { MobileCarousel } from "./mobile-carousel";
import { ResponsiveImage } from "./responsive-image";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  Search,
  SlidersHorizontal,
  X,
  ArrowUpRight,
} from "lucide-react";
import { messages, type Locale } from "./i18n";
import { chromeMessages } from "./chrome-messages";
import { categorySlugs, href, inquiryHref, productName } from "./navigation";
import type { Product } from "./model";
import { useLocationSearch } from "./use-location-search";
import { AddToQuoteButton, QuoteSummary } from "./quote-components";
import { pendingMedia } from "./catalog-labels";
export { CookieSettings } from "./analytics-consent";

export { LocalePicker } from "./locale-picker";

export function ProductCard({
  product: p,
  locale,
}: {
  product: Product;
  locale: Locale;
}) {
  const t = messages[locale];
  return (
    <article className="product-card">
      <Link
        prefetch={false}
        href={href(locale, `/products/${p.slug}/`)}
        className="product-image-link"
        aria-label={`${t.view}: ${p.model}`}
      >
        {p.images.length ? <ResponsiveImage
          sizes="(max-width: 720px) calc(100vw - 40px), (max-width: 1100px) 40vw, 320px"
          src={p.images[0] ?? "/assets/products/fallback.webp"}
          alt={productImageAlt(p, locale)}
          width={560}
          height={420}
          loading="lazy"
        /> : <span className="product-media-pending">{pendingMedia[locale]}</span>}
      </Link>
      <div className="product-card-content">
        <span className="model-label" dir="ltr">
          {p.model}
        </span>
        <h3>
          <Link prefetch={false} href={href(locale, `/products/${p.slug}/`)}>
            {productName(p, locale)}
          </Link>
        </h3>
        <p>
          <bdi>{p.connectorA}</bdi>
          <span aria-hidden="true"> ↔ </span>
          <bdi>{p.connectorB}</bdi>
        </p>
        <Link
          prefetch={false}
          className="text-link"
          href={href(locale, `/products/${p.slug}/`)}
        >
          {t.view}
          <ArrowRight size={17} />
        </Link>
        {p.lengths.length > 0 && <p className="card-lengths"><span>{t.lengths}: </span><bdi>{p.lengths.map(length=>`${length} m`).join(" / ")}</bdi></p>}
        <AddToQuoteButton model={p.model} locale={locale} />
      </div>
    </article>
  );
}
export function Catalog({
  items,
  locale,
  category,
}: {
  items: Product[];
  locale: Locale;
  category?: number;
}) {
  const t = messages[locale];
  const chrome = chromeMessages[locale];
  const [page, setPage] = useState(0);
  const resultCount = useRef<HTMLDivElement>(null);
  const [queryOverride, setQuery] = useState<string | null>(null);
  const search = useLocationSearch();
  const query =
    queryOverride ?? new URLSearchParams(search).get("q")?.slice(0, 120) ?? "";
  const [family, setFamily] = useState(
    category === undefined ? "" : categorySlugs[category],
  );
  const [protocolOverride, setProtocol] = useState<string | null>(null);
  const protocols = useMemo(
    () =>
      Array.from(
        new Set(
          items
            .filter((p) => !family || p.category === family)
            .map((p) => p.interface),
        ),
      ).sort(),
    [items, family],
  );
  const requestedProtocol = new URLSearchParams(search).get("interface") ?? "";
  const protocol =
    protocolOverride ??
    (protocols.includes(requestedProtocol) ? requestedProtocol : "");
  const filtered = items.filter(
    (p) =>
      (!family || p.category === family) &&
      (!protocol || p.interface === protocol) &&
      `${p.model} ${p.name} ${productName(p, locale)} ${p.connectorA} ${p.connectorB} ${p.interface}`
        .toLowerCase()
        .includes(query.toLowerCase().trim()),
  );
  const pageSize = 12;
  const pageCount = Math.ceil(filtered.length / pageSize);
  const currentPage = Math.min(page, Math.max(0, pageCount - 1));
  const visibleProducts = filtered.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize,
  );
  function changePage(next: number) {
    setPage(next);
    resultCount.current?.focus({ preventScroll: true });
    resultCount.current?.scrollIntoView({
      block: "start",
      behavior: "instant",
    });
  }
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filterDialog = useRef<HTMLDialogElement>(null);
  const filterTrigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const element = filterDialog.current;
    const triggerElement = filterTrigger.current;
    if (!filtersOpen || !element) return;
    element.showModal();
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const desktop = window.matchMedia("(min-width: 981px)");
    const close = () => setFiltersOpen(false);
    desktop.addEventListener("change", close);
    return () => {
      element.close();
      document.body.style.overflow = oldOverflow;
      desktop.removeEventListener("change", close);
      if (triggerElement?.isConnected && !desktop.matches)
        triggerElement.focus();
    };
  }, [filtersOpen]);
  const renderFilters = (prefix: string) => (
    <>
      <label htmlFor={`${prefix}-catalog-search`}>{t.searchLabel}</label>
      <div className="search-input">
        <Search size={18} />
        <input
          id={`${prefix}-catalog-search`}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(0);
          }}
          placeholder={t.search}
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setPage(0);
            }}
            aria-label={t.reset}
          >
            <X size={16} />
          </button>
        )}
      </div>
      <label htmlFor={`${prefix}-family-filter`}>{t.family}</label>
      <select
        id={`${prefix}-family-filter`}
        value={family}
        onChange={(e) => {
          setFamily(e.target.value as typeof family);
          setProtocol("");
          setPage(0);
        }}
      >
        <option value="">{t.any}</option>
        {categoryDisplayOrder.map((i) => { const s = categorySlugs[i]; return (
          <option key={s} value={s}>
            {t.categories[i]}
          </option>
        ); })}
      </select>
      <label htmlFor={`${prefix}-interface-filter`}>{t.interface}</label>
      <select
        id={`${prefix}-interface-filter`}
        value={protocol}
        onChange={(e) => {
          setProtocol(e.target.value);
          setPage(0);
        }}
      >
        <option value="">{t.any}</option>
        {protocols.map((p) => (
          <option key={p}>{p}</option>
        ))}
      </select>
      <button
        className="text-button"
        type="button"
        onClick={() => {
          setQuery("");
          setFamily("");
          setProtocol("");
          setPage(0);
        }}
      >
        {t.reset}
      </button>
      <div className="filter-help">
        <p>{t.ctaText}</p>
        <Link prefetch={false} href={inquiryHref(locale, undefined, "custom")}>
          {t.customButton}
          <ArrowUpRight size={16} />
        </Link>
      </div>
    </>
  );
  return (
    <section className="catalog-section container">
      <aside className="catalog-filters desktop-filters">
        <h2>
          <SlidersHorizontal size={18} />
          {t.filter}
        </h2>
        {renderFilters("desktop")}
      </aside>
      <div className="catalog-results">
        <div className="catalog-toolbar">
          <div
            ref={resultCount}
            className="result-count"
            role="status"
            tabIndex={-1}
          >
            {pageCount > 1 ? (
              <>
                <bdi>
                  {currentPage * pageSize + 1}–
                  {Math.min((currentPage + 1) * pageSize, filtered.length)} /{" "}
                  {filtered.length}
                </bdi>{" "}
                {t.results}
              </>
            ) : (
              <>
                {filtered.length}{" "}
                {filtered.length === 1 ? chrome.resultSingular : t.results}
              </>
            )}
          </div>
          <button
            ref={filterTrigger}
            type="button"
            className="catalog-filter-trigger"
            aria-haspopup="dialog"
            aria-expanded={filtersOpen}
            aria-controls="catalog-filter-dialog"
            onClick={() => setFiltersOpen(true)}
          >
            <SlidersHorizontal size={18} />
            {t.filter}
          </button>
        </div>
        {(query || family || protocol) && <div className="active-catalog-filters">{query && <button type="button" onClick={()=>{setQuery("");setPage(0);}} aria-label={`${t.reset}: ${query}`}>{query}<X size={14}/></button>}{family && <button type="button" onClick={()=>{setFamily("");setProtocol("");setPage(0);}} aria-label={`${t.reset}: ${t.categories[categorySlugs.findIndex(slug=>slug===family)]}`}>{t.categories[categorySlugs.findIndex(slug=>slug===family)]}<X size={14}/></button>}{protocol && <button type="button" onClick={()=>{setProtocol("");setPage(0);}} aria-label={`${t.reset}: ${protocol}`}>{protocol}<X size={14}/></button>}</div>}
        <QuoteSummary locale={locale} />
        {filtered.length ? (
          <>
            <MobileCarousel key={`${currentPage}:${family}:${protocol}:${query}`} locale={locale} label={t.nav[0]} className="product-grid catalog-rail">
              {visibleProducts.map((p) => (
                <ProductCard key={p.model} product={p} locale={locale} />
              ))}
            </MobileCarousel>
            {pageCount > 1 && (
              <nav
                className="catalog-pagination"
                aria-label={chrome.pagination}
              >
                <button
                  type="button"
                  aria-label={chrome.previousPage}
                  disabled={currentPage === 0}
                  onClick={() => changePage(currentPage - 1)}
                >
                  <ArrowLeft size={18} />
                </button>
                {Array.from({ length: pageCount }, (_, index) => (
                  <button
                    type="button"
                    key={index}
                    aria-label={`${chrome.pagination}: ${index + 1}`}
                    aria-current={currentPage === index ? "page" : undefined}
                    onClick={() => changePage(index)}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  type="button"
                  aria-label={chrome.nextPage}
                  disabled={currentPage === pageCount - 1}
                  onClick={() => changePage(currentPage + 1)}
                >
                  <ArrowRight size={18} />
                </button>
              </nav>
            )}
          </>
        ) : (
          <div className="empty-state">
            <Search size={38} />
            <h2>{t.noResults}</h2>
            <p>{t.noResultsText}</p>
            <button
              className="button"
              onClick={() => {
                setQuery("");
                setFamily("");
                setProtocol("");
                setPage(0);
              }}
            >
              {t.reset}
            </button>
            <Link
              prefetch={false}
              className="text-link"
              href={inquiryHref(locale)}
            >
              {t.quote}
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
      <dialog
        ref={filterDialog}
        id="catalog-filter-dialog"
        className="catalog-drawer"
        aria-label={t.filter}
        onCancel={() => setFiltersOpen(false)}
        onClose={() => setFiltersOpen(false)}
      >
        <div className="catalog-drawer-heading">
          <h2>{t.filter}</h2>
          <button
            type="button"
            className="menu-close"
            aria-label={t.close}
            onClick={() => setFiltersOpen(false)}
          >
            <X size={22} />
          </button>
        </div>
        <div className="catalog-filters">{renderFilters("mobile")}</div>
        <button
          type="button"
          className="button"
          onClick={() => setFiltersOpen(false)}
        >
          {t.browse} ({filtered.length})<ArrowRight size={18} />
        </button>
      </dialog>
    </section>
  );
}
export function ProductGallery({ product: p, locale }: { product: Product; locale: Locale }) {
  const [selected, setSelected] = useState(0);
  const thumbs = useRef<HTMLDivElement>(null);
  const copy = chromeMessages[locale];
  function select(index: number) {
    const next = (index + p.images.length) % p.images.length;
    setSelected(next);
    const thumb = thumbs.current?.children[next];
    // Scroll only the thumbnail strip; never move the product page vertically.
    if (thumb && thumbs.current) {
      const box = thumb.getBoundingClientRect();
      const track = thumbs.current.getBoundingClientRect();
      thumbs.current.scrollBy({ left: box.left - track.left - (track.width - box.width) / 2, behavior: "instant" });
    }
  }
  return <div className="gallery">
    <div className="gallery-main">
      {p.images.length ? <ResponsiveImage src={p.images[selected]} alt={productImageAlt(p, locale, selected)} width={760} height={660} fetchPriority={selected === 0 ? "high" : "auto"}/> : <p className="product-media-pending">{pendingMedia[locale]}</p>}
    </div>
    {p.images.length > 1 && <>
      <div className="gallery-controls">
        <button type="button" aria-label={`${copy.previous}: ${p.model}`} onClick={() => select(selected - 1)}><ArrowLeft size={18}/></button>
        <span aria-live="polite" aria-atomic="true"><bdi>{selected + 1} / {p.images.length}</bdi></span>
        <button type="button" aria-label={`${copy.next}: ${p.model}`} onClick={() => select(selected + 1)}><ArrowRight size={18}/></button>
      </div>
      <div className="gallery-thumbs" ref={thumbs}>
        {p.images.map((src, i) => <button key={src} type="button" aria-pressed={selected === i} aria-label={productImageAlt(p, locale, i)} onClick={() => select(i)}>
          <img src={src.replace(/\.webp$/, ".thumb.webp")} loading="lazy" decoding="async" width={160} height={128} alt=""/>
        </button>)}
      </div>
    </>}
    {p.images.length > 0 && <details className="gallery-links">
      <summary>{(expandLocales({en:"View all product images",de:"Alle Produktbilder ansehen",es:"Ver todas las imágenes del producto",fr:"Voir toutes les images du produit",pt:"Ver todas as imagens do produto",ar:"عرض جميع صور المنتج"}))[locale]} ({p.images.length})</summary>
      <ul>{p.images.map((src,index)=><li key={src}><a href={src} target="_blank" rel="noopener">{productImageAlt(p,locale,index)}</a></li>)}</ul>
    </details>}
  </div>;
}
