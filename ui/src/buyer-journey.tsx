import Link from "next/link";
import { ArrowUpRight, Cable, ClipboardCheck, FileText } from "lucide-react";
import type { Locale } from "./i18n";
import { href, inquiryHref } from "./navigation";
import { serviceInquiryHref } from "./service-requests";
import { buyerJourneyCopy } from "./buyer-journey-copy";

export function BuyerEntryPaths({ locale }: { locale: Locale }) {
  const copy = buyerJourneyCopy[locale];
  const paths = [
    { title: copy.modelTitle, text: copy.modelText, action: copy.modelAction, url: href(locale, "/products/"), icon: Cable, entry: "catalog" },
    { title: copy.reviewTitle, text: copy.reviewText, action: copy.reviewAction, url: serviceInquiryHref(locale, "compatibility", "/"), icon: ClipboardCheck, entry: "configuration" },
    { title: copy.customTitle, text: copy.customText, action: copy.customAction, url: inquiryHref(locale, undefined, "custom"), icon: FileText, entry: "custom" },
  ];
  return <section className="section container buyer-entry">
    <div className="section-heading"><h2>{copy.title}</h2><p>{copy.intro}</p></div>
    <div className="buyer-entry-grid">{paths.map(path => <Link key={path.title} href={path.url} prefetch={false} data-buyer-path={path.entry}>
      <path.icon size={28} aria-hidden="true" /><h3>{path.title}</h3><p>{path.text}</p>
      <span>{path.action}<ArrowUpRight size={18} aria-hidden="true" /></span>
    </Link>)}</div>
  </section>;
}

export function ProjectReviewFlow({ locale }: { locale: Locale }) {
  const copy = buyerJourneyCopy[locale];
  const steps = [
    [copy.requirementsTitle, copy.requirementsText],
    [copy.sampleTitle, copy.sampleText],
    [copy.productionTitle, copy.productionText],
    [copy.deliveryTitle, copy.deliveryText],
  ];
  return <section className="section project-review"><div className="container">
    <div className="section-heading"><h2>{copy.processTitle}</h2><p>{copy.processIntro}</p></div>
    <ol className="project-review-steps">{steps.map(([title, text], index) => <li key={title}>
      <span aria-hidden="true">0{index + 1}</span><h3>{title}</h3><p>{text}</p>
    </li>)}</ol>
    <Link className="text-link" href={inquiryHref(locale, undefined, "custom")} prefetch={false}>{copy.customAction}<ArrowUpRight size={18}/></Link>
  </div></section>;
}
