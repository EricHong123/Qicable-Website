"use client";
import { trackBuyerEvent } from "./analytics";
import { buyerFormCopy } from "./buyer-form-copy";
import { inquiryTypes, parseServiceRequest } from "./service-requests";
import { serviceFormMessages } from "./service-form-messages";
import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { Check, ArrowRight, ArrowUpRight, LoaderCircle, X } from "lucide-react";
import { messages, type Locale } from "./i18n";
import { href } from "./navigation";
import { useLocationSearch } from "./use-location-search";
import { inquiryMessages, projectStages } from "./inquiry-messages";
import {
  attachmentFingerprint,
  attachmentPolicy,
  validateAttachments,
  type AttachmentIssue,
} from "./inquiry-attachments";
import styles from "./inquiry-form.module.css";
import quoteStyles from "./quote.module.css";
import { QuoteListEditor } from "./quote-components";
import { useQuoteList, removeSubmittedQuotes } from "./quote-store";
import { QuoteListError } from "./quote-list";
import { quoteMessages } from "./quote-messages";
import {
  buildInquiry,
  InquirySizeError,
  inquiryAttribution,
  type InquiryInput,
} from "./contact-contract";
import site from "../../config/site.json";
import {
  contactFingerprint,
  resolveContactAttempt,
  loadStoredContactAttempt,
  storeContactAttempt,
  clearStoredContactAttempt,
  type ContactAttempt,
} from "./contact-attempt";

const initial: InquiryInput = {
  name: "",
  company: "",
  email: "",
  message: "",
  phone: "",
  product: "",
  type: "quotation",
  quantity: "",
  length: "",
  environment: "",
  drawing: "",
  country: "",
  business: "",
  website: "",
};
export function InquiryForm({
  locale,
  defaultProduct = "",
  defaultType = "quotation",
}: {
  locale: Locale;
  defaultProduct?: string;
  defaultType?: "quotation" | "custom";
}) {
  const t = messages[locale];
  const copy = inquiryMessages[locale];
  const journey = buyerFormCopy[locale];
  const errorId = useId();
  const filesId = useId();
  const [files, setFiles] = useState<File[]>([]);
  const [fileIssue, setFileIssue] = useState<AttachmentIssue | null>(null);
  const [serverIssue, setServerIssue] = useState<
    "uploadError" | "rateLimited" | "conflict" | null
  >(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [overrides, setInput] = useState<Partial<InquiryInput>>({});
  const search = useLocationSearch();
  const params = new URLSearchParams(search);
  const { items: quoteItems } = useQuoteList();
  const quoteCopy = quoteMessages[locale];
  const listMode = params.get("list") === "1";
  const [quoteIssue, setQuoteIssue] = useState<string | null>(null);
  const requestedType = params.get("type") ?? defaultType;
  const input: InquiryInput = {
    ...initial,
    product: (params.get("model") ?? defaultProduct).slice(0, 100),
    type: inquiryTypes.some((value) => value === requestedType)
      ? requestedType
      : "quotation",
    ...overrides,
  };
  const requestTopic = parseServiceRequest(params.get("request"), input.type ?? "quotation");
  const serviceCopy = serviceFormMessages[locale];
  input.request = requestTopic;
  const [status, setStatus] = useState<
    "idle" | "sending" | "received" | "error" | "tooLong"
  >("idle");
  const [oversizeField, setOversizeField] = useState<string | null>(null);
  const request = useRef<ContactAttempt | null>(null);
  const inflight = useRef(false);
  const started = useRef(false);
  useEffect(() => {
    if (["received", "error", "tooLong"].includes(status))
      statusRef.current?.focus();
  }, [status]);
  function update(
    key: Exclude<keyof InquiryInput, "quoteItems">,
    value: string,
  ) {
    setInput((p) => ({ ...p, [key]: value }));
    setOversizeField(null);
    setServerIssue(null);
    if (status !== "sending") setStatus("idle");
  }
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (fileIssue) {
      fileInputRef.current?.focus();
      return;
    }
    if (inflight.current) return;
    inflight.current = true;
    setStatus("sending");
    setServerIssue(null);
    setQuoteIssue(null);
    const submittedItems = quoteItems.map((item) => ({ ...item }));
    const effectiveInput: InquiryInput = listMode
      ? {
          ...input,
          product: undefined,
          quantity: undefined,
          quoteItems: submittedItems,
        }
      : input;
    try {
      const attribution = inquiryAttribution(
        window.location.href,
        document.referrer,
      );
      let storage: Storage | null = null;
      try {
        storage = window.localStorage;
      } catch {
        /* Memory still protects retries when storage is unavailable. */
      }
      // Reserve space for the server-generated, private attachment reference.
      const reserve = files.length ? 512 : 0;
      const fingerprint = await contactFingerprint(
        JSON.stringify({
          inquiry: buildInquiry(
            effectiveInput,
            locale,
            "fingerprint",
            attribution,
            reserve,
          ),
          files: await attachmentFingerprint(files),
        }),
      );
      request.current = resolveContactAttempt(
        fingerprint,
        request.current ?? loadStoredContactAttempt(storage),
      );
      storeContactAttempt(storage, request.current);
      const payload = buildInquiry(
        effectiveInput,
        locale,
        request.current.idempotencyKey,
        attribution,
        reserve,
      );
      const multipart = new FormData();
      if (files.length) {
        multipart.set("payload", JSON.stringify(payload));
        files.forEach((file) => multipart.append("files[]", file));
      }
      const response = await fetch(
        files.length ? "/api/contact-files" : site.contactEndpoint,
        {
          method: "POST",
          headers: files.length
            ? undefined
            : { "Content-Type": "application/json" },
          body: files.length ? multipart : JSON.stringify(payload),
          signal: AbortSignal.timeout(files.length ? 60000 : 20000),
        },
      );
      if (response.status !== 202) {
        if (response.status === 429) setServerIssue("rateLimited");
        else if (response.status === 409) setServerIssue("conflict");
        else if (files.length && [400, 413, 415, 422].includes(response.status))
          setServerIssue("uploadError");
        throw new Error("NOT_ACCEPTED");
      }
      const accepted: unknown = await response.json();
      if (
        !accepted ||
        typeof accepted !== "object" ||
        !("success" in accepted) ||
        accepted.success !== true
      )
        throw new Error("NOT_ACCEPTED");
      clearStoredContactAttempt(storage);
      if (listMode) removeSubmittedQuotes(submittedItems);
      trackBuyerEvent("inquiry_received");
      setStatus("received");
    } catch (err) {
      if (err instanceof QuoteListError)
        setQuoteIssue(
          err.reason === "empty"
            ? quoteCopy.empty
            : err.reason === "limit"
              ? quoteCopy.limit
              : quoteCopy.invalidQuantity,
        );
      setOversizeField(err instanceof InquirySizeError ? err.field : null);
      setStatus(err instanceof RangeError ? "tooLong" : "error");
    } finally {
      inflight.current = false;
    }
  }
  const field = (
    key: Exclude<keyof InquiryInput, "quoteItems">,
    label: string,
    type = "text",
    required = false,
  ) => (
    <label key={key} className="form-field">
      <span>
        {label}
        {required ? " *" : ` (${t.optional})`}
      </span>
      <input
        name={key}
        type={type}
        required={required}
        aria-invalid={oversizeField === key || undefined}
        aria-describedby={oversizeField === key ? errorId : undefined}
        value={input[key] ?? ""}
        onChange={(e) => update(key, e.target.value)}
        maxLength={
          key === "drawing"
            ? 1000
            : key === "name"
              ? 120
              : key === "email"
                ? 254
                : key === "company"
                  ? 180
                  : key === "phone"
                    ? 64
                    : 200
        }
        autoComplete={
          key === "name"
            ? "name"
            : key === "company"
              ? "organization"
              : key === "email"
                ? "email"
                : key === "phone"
                  ? "tel"
                  : undefined
        }
      />
    </label>
  );
  if (status === "received")
    return (
      <div
        className="success-panel"
        role="status"
        tabIndex={-1}
        ref={statusRef}
      >
        <Check size={36} />
        <h2>{t.received}</h2>
        <p>{journey.receivedNext}</p>
        <a className="text-link" href={`mailto:${site.email}`}>
          {site.email}
          <ArrowUpRight size={18} />
        </a>
      </div>
    );
  return (
    <form className={`inquiry-form ${styles.form}`} onSubmit={submit} onFocus={() => {
      if (!started.current) {
        started.current = true;
        trackBuyerEvent("inquiry_start");
      }
    }}>
      <fieldset disabled={status === "sending"}>
        <p className={styles.help}>{journey.startHint}</p>
        {requestTopic && <div className={styles.requestContext} role="status"><strong>{serviceCopy.context}: {serviceCopy.topics[requestTopic].title}</strong><p>{serviceCopy.topics[requestTopic].hint}</p></div>}
        {(listMode || quoteItems.length > 0) && (
          <div className={quoteStyles.mode}>
            <button
              type="button"
              onClick={() => {
                const next = new URL(window.location.href);
                if (listMode) next.searchParams.delete("list");
                else next.searchParams.set("list", "1");
                window.history.replaceState(window.history.state, "", next);
                window.dispatchEvent(new PopStateEvent("popstate"));
                setQuoteIssue(null);
                setStatus("idle");
              }}
            >
              {listMode
                ? quoteCopy.single
                : `${quoteCopy.use} (${quoteItems.length})`}
            </button>
          </div>
        )}
        {listMode && <QuoteListEditor locale={locale} />}
        <div className="form-grid">
          {field("name", t.name, "text", true)}
          {field("company", t.company)}
          {field("email", t.email, "email", true)}
          {!listMode && field("product", t.model)}
          <label className="form-field">
            <span>{t.inquiryType}</span>
            <select
              name="type"
              value={input.type}
              onChange={(e) => update("type", e.target.value)}
            >
              {inquiryTypes.map((v, i) => (
                <option key={v} value={v}>
                  {i < 4 ? t.types[i] : v === "support" ? serviceCopy.support : serviceCopy.partnership}
                </option>
              ))}
            </select>
          </label>
          {!listMode && (input.type === "quotation" || input.type === "sample") && <>
            {field("quantity", t.quantity)}
            {field("arrivalDate", journey.arrivalDate, "date")}
          </>}
          {input.type === "custom" && <>
            {field("connectorA", t.connectorA)}
            {field("connectorB", t.connectorB)}
          </>}
          {input.type === "support" && field("environment", t.environment)}
          <label className="form-field full">
            <span>{t.message} *</span>
            <textarea
              name="message"
              required
              rows={5}
              value={input.message}
              onChange={(e) => update("message", e.target.value)}
              placeholder={input.type === "custom" ? journey.customHint : input.type === "support" ? journey.supportHint : input.type === "quotation" ? journey.quoteHint : journey.messageHint}
              maxLength={4000}
            />
          </label>
        </div>
        <div className={styles.attachments}>
          <span className={styles.title} id={filesId}>
            {copy.attachments} ({t.optional})
          </span>
          <p className={styles.help} id={`${filesId}-help`}>
            {copy.help}
          </p>
          <label className={styles.picker}>
            {copy.choose}
            <input
              ref={fileInputRef}
              type="file"
              name="attachments"
              multiple
              accept={attachmentPolicy.accept}
              aria-label={copy.choose}
              aria-describedby={`${filesId}-help${fileIssue ? ` ${filesId}-error` : ""}`}
              aria-invalid={!!fileIssue}
              onChange={(event) => {
                const next = [
                  ...files,
                  ...Array.from(event.target.files ?? []),
                ];
                const issue = validateAttachments(next);
                setFileIssue(issue);
                if (!issue) {
                  setFiles(next);
                  if (next.length > files.length) trackBuyerEvent("inquiry_attachment");
                  setStatus("idle");
                  setServerIssue(null);
                }
                event.target.value = "";
              }}
            />
          </label>
          {fileIssue && (
            <div className={styles.error} role="alert" id={`${filesId}-error`}>
              <p>{copy[fileIssue]}</p>
              <button
                type="button"
                className={styles.reset}
                onClick={() => {
                  setFiles([]);
                  setFileIssue(null);
                  setStatus("idle");
                  setServerIssue(null);
                }}
              >
                {copy.withoutFiles}
              </button>
            </div>
          )}
          {!!files.length && (
            <ul className={styles.files} aria-label={copy.selected}>
              {files.map((file, index) => (
                <li key={`${file.name}-${index}`}>
                  <span className={styles.file}>
                    <bdi>{file.name}</bdi>
                    <small>
                      <bdi>
                        {file.size < 1024
                          ? `${file.size} B`
                          : file.size < 1024 * 1024
                            ? `${Math.ceil(file.size / 1024)} KB`
                            : `${(file.size / 1024 / 1024).toFixed(2)} MB`}
                      </bdi>
                    </small>
                  </span>
                  <button
                    type="button"
                    className={styles.remove}
                    aria-label={`${copy.remove}: ${file.name}`}
                    onClick={() => {
                      setFiles((current) =>
                        current.filter((_, i) => i !== index),
                      );
                      setFileIssue(null);
                      setStatus("idle");
                      setServerIssue(null);
                    }}
                  >
                    <X size={18} aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <details className="project-details">
          <summary>
            {t.more}
            <span>+</span>
          </summary>
          <div className="form-grid">
          <label className="form-field">
            <span>
              {copy.stage} ({t.optional})
            </span>
            <select
              name="stage"
              value={input.stage ?? ""}
              onChange={(e) => update("stage", e.target.value)}
            >
              <option value="">{copy.select}</option>
              {projectStages.map((value, index) => (
                <option key={value} value={value}>
                  {copy.stages[index]}
                </option>
              ))}
            </select>
          </label>
            {field("phone", t.phone, "tel")}
            {field("country", t.country)}
            {field("business", t.business)}
            {!listMode && input.type !== "quotation" && input.type !== "sample" && field("quantity", t.quantity)}
            {field("length", t.length)}
            {input.type !== "custom" && field("connectorA", t.connectorA)}
            {input.type !== "custom" && field("connectorB", t.connectorB)}
            {field("pinout", copy.pinout)}
            {field("orientation", copy.orientation)}
            {input.type !== "support" && field("environment", t.environment)}
            {field("drawing", t.drawing, "url")}
          </div>
        </details>
        <label className="honeypot" aria-hidden="true">
          Website
          <input
            tabIndex={-1}
            autoComplete="off"
            name="website"
            value={input.website}
            onChange={(e) => update("website", e.target.value)}
          />
        </label>
        <p className="privacy-note">
          <label className={styles.consent}><input type="checkbox" required name="privacyConsent" /> {t.privacyNote}</label>{" "}
          <Link prefetch={false} href={href(locale, "/privacy/")}>
            {t.privacy}
          </Link>
        </p>
        {(status === "error" || status === "tooLong") && (
          <div
            className="form-error"
            role="alert"
            id={errorId}
            tabIndex={-1}
            ref={statusRef}
          >
            <p>
              {status === "tooLong"
                ? `${({ name: t.name, company: t.company, email: t.email, phone: t.phone, product: t.model, message: t.message } as Record<string, string>)[oversizeField ?? ""] ?? t.message}: ${t.tooLong}`
                : quoteIssue
                  ? quoteIssue
                  : serverIssue
                    ? copy[serverIssue]
                    : t.sendError}
            </p>
            {status === "error" && (
              <a href={`mailto:${site.email}`}>{site.email}</a>
            )}
          </div>
        )}
        <button
          className="button"
          type="submit"
          disabled={listMode && quoteItems.length === 0}
        >
          {status === "sending" ? (
            <>
              <LoaderCircle size={18} className="spin" />
              {t.sending}
            </>
          ) : (
            <>
              {t.submit}
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </fieldset>
    </form>
  );
}
