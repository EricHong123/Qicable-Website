"use client";

import { lazy, Suspense, useEffect, useId, useRef, useState } from "react";
import { FilePenLine, Mail, X } from "lucide-react";
const InquiryForm = lazy(() => import("./inquiry-form").then(module => ({ default: module.InquiryForm })));
import { messages, type Locale } from "./i18n";
import { InquiryBoundary } from "./inquiry-boundary";
import site from "../../config/site.json";

export function ContactDock({
  locale,
  product,
}: {
  locale: Locale;
  product?: string;
}) {
  const t = messages[locale];
  const whatsappNumber = `+${site.whatsapp.replace(/^86/, "86 ")}`;
  const id = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  useEffect(() => {
    const panel = dialog.current;
    if (!open || !panel) return;
    const returnTarget = trigger.current;
    const previousOverflow = document.body.style.overflow;
    panel.showModal();
    document.body.style.overflow = "hidden";
    const focusName = () => {
      const field = panel.querySelector<HTMLInputElement>('input[name="name"]');
      field?.focus();
      return Boolean(field);
    };
    // The form chunk may arrive after showModal; focus when its fields mount.
    const observer = new MutationObserver(() => {
      if (focusName()) observer.disconnect();
    });
    if (!focusName()) observer.observe(panel, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      panel.close();
      document.body.style.overflow = previousOverflow;
      returnTarget?.focus({ preventScroll: true });
    };
  }, [open]);

  return (
    <>
      <nav className="contact-dock" aria-label={t.contact}>
        <a
          className="contact-dock-action contact-dock-whatsapp"
          href={`https://wa.me/${site.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`WhatsApp: ${whatsappNumber}`}
        >
          <img src="/assets/icons/whatsapp.svg" width={25} height={25} alt="" />
          <span className="contact-dock-label" aria-hidden="true">
            <strong>WhatsApp</strong>
            <bdi>{whatsappNumber}</bdi>
          </span>
        </a>
        <a
          className="contact-dock-action contact-dock-email"
          href={`mailto:${site.email}`}
          aria-label={`${t.email}: ${site.email}`}
        >
          <Mail size={25} strokeWidth={1.7} aria-hidden="true" />
          <span className="contact-dock-label" aria-hidden="true">
            <strong>{t.email}</strong>
            <bdi>{site.email}</bdi>
          </span>
        </a>
        <button
          ref={trigger}
          className="contact-dock-action contact-dock-form"
          type="button"
          aria-label={t.quote}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => {
            setHasOpened(true);
            setOpen(true);
          }}
        >
          <FilePenLine size={25} strokeWidth={1.7} aria-hidden="true" />
          <span className="contact-dock-label" aria-hidden="true">
            <strong>{t.quote}</strong>
          </span>
        </button>
      </nav>
      <dialog
        ref={dialog}
        id={id}
        className="contact-dialog"
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-description`}
        onCancel={() => setOpen(false)}
        onClose={() => {
          if (!dialog.current?.open) setOpen(false);
        }}
      >
        <div className="contact-dialog-heading">
          <div>
            <h2 id={`${id}-title`}>{t.quote}</h2>
            <p id={`${id}-description`}>{t.contactText}</p>
          </div>
          <button
            type="button"
            className="contact-dialog-close"
            aria-label={t.close}
            onClick={() => setOpen(false)}
          >
            <X size={23} aria-hidden="true" />
          </button>
        </div>
        <div className="contact-dialog-body">
          {hasOpened && <InquiryBoundary locale={locale}><Suspense fallback={<p role="status" aria-busy="true">{t.quote}…</p>}><InquiryForm locale={locale} defaultProduct={product} /></Suspense></InquiryBoundary>}
        </div>
      </dialog>
    </>
  );
}
