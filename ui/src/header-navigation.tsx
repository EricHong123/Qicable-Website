"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  ChevronRight,
  Menu,
  Search,
  X,
} from "lucide-react";

export type MenuCategory = {
  name: string;
  description: string;
  url: string;
  image: string;
  productLabel: string;
  interfaces: { name: string; url: string }[];
};
type NavigationLabels = {
  products: string;
  all: string;
  range: string;
  menu: string;
  close: string;
  search: string;
  searchLabel: string;
  custom: string;
  browse: string;
  explore: string;
  interfaces: string;
  customTitle: string;
  customText: string;
};
type ProductMenuProps = {
  categories: MenuCategory[];
  labels: NavigationLabels;
  catalogUrl: string;
  customUrl: string;
  initialCategory: number;
};

function CatalogSearch({
  url,
  labels,
}: {
  url: string;
  labels: NavigationLabels;
}) {
  return (
    <form action={url} className="navigation-search" role="search">
      <Search size={19} aria-hidden="true" />
      <input
        type="search"
        name="q"
        placeholder={labels.search}
        aria-label={labels.searchLabel}
        maxLength={120}
      />
      <button type="submit" aria-label={labels.searchLabel}>
        <ArrowRight size={19} />
      </button>
    </form>
  );
}

export function ProductsMegaMenu({
  categories,
  labels,
  catalogUrl,
  customUrl,
  initialCategory,
  active,
}: ProductMenuProps & { active: boolean }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(initialCategory);
  const selectionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  function cancelDelay() {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  }
  function close(restoreFocus = false) {
    cancelDelay();
    if(selectionTimer.current) clearTimeout(selectionTimer.current);
    setOpen(false);
    if (restoreFocus) trigger.current?.focus();
  }
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
      if (selectionTimer.current) clearTimeout(selectionTimer.current);
    },
    [],
  );
  useEffect(() => {
    if (!open) return;
    function outside(event: PointerEvent) {
      if (event.target instanceof Node && !root.current?.contains(event.target))
        setOpen(false);
    }
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        if (root.current?.contains(document.activeElement))
          trigger.current?.focus();
      }
    }
    const desktop = window.matchMedia("(min-width: 1280px)");
    function changeLayout() {
      setOpen(false);
    }
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    desktop.addEventListener("change", changeLayout);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
      desktop.removeEventListener("change", changeLayout);
    };
  }, [open]);

  return (
    <div
      ref={root}
      className="products-menu"
      onPointerEnter={(event) => {
        cancelDelay();
        if (event.pointerType === "mouse" && !open)
          timer.current = setTimeout(() => setOpen(true), 180);
      }}
      onPointerLeave={() => {
        cancelDelay();
        if (!root.current?.contains(document.activeElement))
          timer.current = setTimeout(() => setOpen(false), 220);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) close();
      }}
    >
      <button
        ref={trigger}
        type="button"
        className="products-menu-trigger"
        aria-expanded={open}
        aria-controls="products-mega-panel"
        data-active={active || undefined}
        onClick={() => {
          cancelDelay();
          setOpen(!open);
        }}
      >
        {labels.products}
        <ChevronDown size={15} aria-hidden="true" />
      </button>
      <div id="products-mega-panel" className="mega-panel" hidden={!open}>
        <div className="container">
          <div className="mega-heading">
            <Link prefetch={false} href={catalogUrl} onClick={() => close()}>
              {labels.all}
              <ArrowUpRight size={18} />
            </Link>
            <CatalogSearch url={catalogUrl} labels={labels} />
            <button
              className="menu-close"
              type="button"
              aria-label={labels.close}
              onClick={() => close(true)}
            >
              <X size={21} />
            </button>
          </div>
          <div className="mega-layout">
            <ul className="mega-families" aria-label={labels.range}>
              {categories.map((category, index) => (
                <li
                  key={category.url}
                  data-selected={selected === index || undefined}
                  onPointerEnter={(event) => {
                    if (event.pointerType === "mouse") {if(selectionTimer.current)clearTimeout(selectionTimer.current);selectionTimer.current=setTimeout(()=>setSelected(index),160);}
                  }}
                  onPointerLeave={()=>{if(selectionTimer.current)clearTimeout(selectionTimer.current);}}
                >
                  <Link
                    onFocus={()=>{if(selectionTimer.current)clearTimeout(selectionTimer.current);setSelected(index);}}
                    prefetch={false}
                    href={category.url}
                    onClick={() => close()}
                  >
                    {category.name}
                  </Link>
                  <button
                    type="button"
                    aria-label={`${labels.explore}: ${category.name}`}
                    aria-expanded={selected === index}
                    aria-controls={`mega-category-${index}`}
                    onClick={() => {if(selectionTimer.current)clearTimeout(selectionTimer.current);setSelected(index);}}
                  >
                    <ChevronRight size={18} />
                  </button>
                </li>
              ))}
            </ul>
            <div className="mega-content">
              {categories.map((category, index) => (
                <div
                  id={`mega-category-${index}`}
                  className="mega-detail"
                  key={category.url}
                  hidden={selected !== index}
                >
                  <div className="mega-selection">
                    <h2>{category.name}</h2>
                    <p>{category.description}</p>
                    <span className="mega-section-label">
                      {labels.interfaces}
                    </span>
                    <ul className="mega-interface-list">
                      {category.interfaces.map((item) => (
                        <li key={item.name}>
                          <a href={item.url} onClick={() => close()}>
                            <bdi>{item.name}</bdi>
                            <ArrowRight size={16} />
                          </a>
                        </li>
                      ))}
                    </ul>
                    <Link
                      prefetch={false}
                      className="text-link"
                      href={category.url}
                      onClick={() => close()}
                    >
                      {labels.browse}: {category.name}
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                  <aside className="mega-preview">
                    <Link
                      prefetch={false}
                      href={category.url}
                      onClick={() => close()}
                      tabIndex={-1}
                      aria-hidden="true"
                    >
                      <img
                        src={category.image}
                        width={320}
                        height={220}
                        alt=""
                        loading="lazy"
                      />
                    </Link>
                    <strong>{category.productLabel}</strong>
                    <Link
                      prefetch={false}
                      className="text-link"
                      href={category.url}
                      onClick={() => close()}
                    >
                      {labels.browse}
                      <ArrowUpRight size={16} />
                    </Link>
                  </aside>
                </div>
              ))}
            </div>
          </div>
          <div className="mega-custom-strip"><div><strong>{labels.customTitle}</strong><p>{labels.customText}</p></div><Link prefetch={false} href={customUrl} onClick={()=>close()}>{labels.custom}<ArrowUpRight size={18}/></Link></div>
        </div>
      </div>
    </div>
  );
}

export function MobileNavigation({
  categories,
  labels,
  catalogUrl,
  customUrl,
  initialCategory,
  links,
  languageControl,
  quoteControl,
}: ProductMenuProps & {
  links: { name: string; url: string; active: boolean }[];
  languageControl: ReactNode;
  quoteControl: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(initialCategory);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const element = dialog.current;
    const triggerElement = trigger.current;
    if (!open || !element) return;
    element.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const desktop = window.matchMedia("(min-width: 1280px)");
    const changeLayout = () => setOpen(false);
    desktop.addEventListener("change", changeLayout);
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
      desktop.removeEventListener("change", changeLayout);
      if (triggerElement?.isConnected && !desktop.matches)
        triggerElement.focus();
    };
  }, [open]);
  return (
    <div className="mobile-menu">
      <button
        ref={trigger}
        className="mobile-menu-trigger"
        type="button"
        aria-label={labels.menu}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen(true)}
      >
        <Menu size={25} />
      </button>
      <dialog
        ref={dialog}
        id="mobile-navigation"
        className="mobile-drawer"
        aria-label={labels.menu}
        onCancel={() => setOpen(false)}
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setOpen(false);
        }}
      >
        <div className="mobile-drawer-inner">
          <div className="mobile-drawer-heading">
            <span>{labels.products}</span>
            <button
              className="menu-close"
              type="button"
              aria-label={labels.close}
              onClick={() => setOpen(false)}
            >
              <X size={24} />
            </button>
          </div>
          <div className="mobile-drawer-body">
            <CatalogSearch url={catalogUrl} labels={labels} />
            <nav
              aria-label={labels.menu}
              onClick={(event) => {
                if (
                  event.target instanceof Element &&
                  event.target.closest("a")
                )
                  setOpen(false);
              }}
            >
              <Link
                prefetch={false}
                className="mobile-view-all"
                href={catalogUrl}
              >
                {labels.all}
                <ArrowUpRight size={18} />
              </Link>
              <ul className="mobile-family-list">
                {categories.map((category, index) => (
                  <li key={category.url}>
                    <div className="mobile-family-heading">
                      <Link prefetch={false} href={category.url}>
                        {category.name}
                      </Link>
                      <button
                        type="button"
                        aria-label={`${labels.explore}: ${category.name}`}
                        aria-expanded={expanded === index}
                        aria-controls={`mobile-family-${index}`}
                        onClick={() =>
                          setExpanded(expanded === index ? null : index)
                        }
                      >
                        <ChevronDown size={18} />
                      </button>
                    </div>
                    <ul
                      id={`mobile-family-${index}`}
                      className="mobile-interface-list"
                      hidden={expanded !== index}
                    >
                      {category.interfaces.map((item) => (
                        <li key={item.name}>
                          <a href={item.url}>
                            <bdi>{item.name}</bdi>
                            <ArrowRight size={15} />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
              <div className="mobile-other-links">
                {links.map((item) => (
                  <Link
                    prefetch={false}
                    key={item.url}
                    href={item.url}
                    aria-current={item.active ? "page" : undefined}
                  >
                    {item.name}
                    <ArrowRight size={17} />
                  </Link>
                ))}
              </div>
              <div>{quoteControl}</div>
              <Link
                prefetch={false}
                href={customUrl}
                className="button mobile-custom"
              >
                {labels.custom}
                <ArrowUpRight size={18} />
              </Link>
            </nav>
            <div className="mobile-language">{languageControl}</div>
          </div>
        </div>
      </dialog>
    </div>
  );
}
