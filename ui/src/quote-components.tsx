"use client";
import { useId, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, Plus, X } from "lucide-react";
import type { Locale } from "./i18n";
import { messages } from "./i18n";
import { href, productName } from "./navigation";
import { getQuoteCatalog } from "./quote-catalog";
import { quoteMessages } from "./quote-messages";
import {
  addQuoteModel,
  removeQuoteModel,
  updateQuoteQuantity,
  useQuoteList,
} from "./quote-store";
import styles from "./quote.module.css";

export function quoteHref(locale: Locale) {
  return `${href(locale, "/contact/")}?list=1`;
}

export function AddToQuoteButton({
  model,
  locale,
}: {
  model: string;
  locale: Locale;
}) {
  const { items, persistent } = useQuoteList();
  const [issue, setIssue] = useState(false);
  const copy = quoteMessages[locale];
  const added = items.some((item) => item.model === model);
  return (
    <div className={styles.addWrap}>
      <button
        type="button"
        className={styles.add}
        onClick={() => {
          if (added) window.location.assign(quoteHref(locale));
          else setIssue(!addQuoteModel(model));
        }}
        aria-label={
          added
            ? `${copy.added}: ${model}. ${copy.review}`
            : `${copy.add}: ${model}`
        }
      >
        {added ? (
          <Check size={16} aria-hidden="true" />
        ) : (
          <Plus size={16} aria-hidden="true" />
        )}
        {added ? copy.added : copy.add}
        {added && <ArrowUpRight size={15} aria-hidden="true" />}
      </button>
      <span className={styles.notice} role="status">
        {issue && !added ? copy.limit : added && !persistent ? copy.memory : ""}
      </span>
    </div>
  );
}

export function QuoteListLink({
  locale,
  header = false,
}: {
  locale: Locale;
  header?: boolean;
}) {
  const { items } = useQuoteList();
  const label = items.length
    ? quoteMessages[locale].review
    : messages[locale].quote;
  return (
    <Link
      prefetch={false}
      className={header ? "header-quote" : styles.menuLink}
      href={items.length ? quoteHref(locale) : href(locale, "/contact/")}
    >
      {label}
      {items.length > 0 && <bdi className={styles.count}>{items.length}</bdi>}
      <ArrowUpRight size={16} aria-hidden="true" />
    </Link>
  );
}

export function QuoteSummary({ locale }: { locale: Locale }) {
  const { items } = useQuoteList();
  if (!items.length) return null;
  return (
    <div className={styles.summary}>
      <span>
        {quoteMessages[locale].title}{" "}
        <bdi className={styles.count}>{items.length}</bdi>
      </span>
      <QuoteListLink locale={locale} />
    </div>
  );
}

export function QuoteListEditor({ locale }: { locale: Locale }) {
  const { items, persistent } = useQuoteList();
  const copy = quoteMessages[locale];
  const id = useId();
  const region = useRef<HTMLDivElement>(null);
  return (
    <div
      className={styles.editor}
      ref={region}
      tabIndex={-1}
      role="group"
      aria-labelledby={id}
    >
      <div className={styles.editorHeading}>
        <h2 id={id}>
          {copy.title} <bdi className={styles.count}>{items.length}</bdi>
        </h2>
        <Link prefetch={false} href={href(locale, "/products/")}>
          {copy.browse}
          <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>
      <p className={styles.help}>{copy.help}</p>
      {!persistent && (
        <p role="status" className={styles.notice}>
          {copy.memory}
        </p>
      )}
      {!items.length ? (
        <p role="status">{copy.empty}</p>
      ) : (
        <ul className={styles.rows}>
          {items.map((item) => {
            const product = getQuoteCatalog().find((p) => p.model === item.model);
            if (!product) return null;
            return (
              <li key={item.model}>
                <div className={styles.itemName}>
                  <Link
                    prefetch={false}
                    href={href(locale, `/products/${product.slug}/`)}
                  >
                    <bdi>{item.model}</bdi>
                  </Link>
                  <span>{productName(product, locale)}</span>
                </div>
                <label className={styles.quantity}>
                  <span>
                    {copy.quantity} · {copy.units}
                  </span>
                  <input
                    aria-label={`${copy.quantity}: ${item.model}`}
                    type="text"
                    inputMode="numeric"
                    pattern="0*[1-9][0-9]*"
                    title={copy.invalidQuantity}
                    maxLength={6}
                    placeholder="—"
                    value={item.quantity}
                    dir="ltr"
                    onChange={(event) =>
                      updateQuoteQuantity(item.model, event.target.value)
                    }
                  />
                </label>
                <button
                  type="button"
                  className={styles.remove}
                  aria-label={`${copy.remove}: ${item.model}`}
                  onClick={() => {
                    removeQuoteModel(item.model);
                    region.current?.focus();
                  }}
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
