import Link from "next/link";
import { ArrowUpRight, Check, FileText } from "lucide-react";
import type { Locale } from "./i18n";
import { messages } from "./i18n";
import { href } from "./navigation";
import { serviceContent, serviceKinds, servicePaths, type ServiceKind } from "./service-content";
import { serviceFormMessages } from "./service-form-messages";
import { documentRequests, serviceInquiryHref, type ServiceRequest } from "./service-requests";
import styles from "./service.module.css";

export function ServiceLinks({locale, except}: {locale:Locale; except?:ServiceKind}) {
  const copy=serviceContent[locale];
  return <nav className={styles.related} aria-label={copy.related}>{serviceKinds.filter(kind=>kind!==except).map(kind=><Link prefetch={false} href={href(locale,servicePaths[kind])} key={kind}>{copy[kind].title}<ArrowUpRight size={18} aria-hidden="true" /></Link>)}</nav>;
}
export function ServicePage({locale,kind}:{locale:Locale;kind:ServiceKind}) {
  const copy=serviceContent[locale];
  const page=copy[kind];
  const landing=kind==="samples"||kind==="partners"?copy[kind]:null;
  const primary:ServiceRequest=kind==="samples"?"sample":"partnership";
  const requests:readonly ServiceRequest[]=kind==="downloads"?documentRequests:["compatibility","installation","order-support"];
  return <div className={styles.page}>
    <header className={styles.hero}><div className={`container ${styles.safe}`}>
      <p className={styles.eyebrow}>{copy.label}</p><h1>{page.title}</h1><p className={styles.lead}>{page.intro}</p>
      {landing&&<Link prefetch={false} className="button" href={serviceInquiryHref(locale,primary,servicePaths[kind])}>{landing.cta}<ArrowUpRight size={18} aria-hidden="true" /></Link>}
    </div></header>
    <div className={`container ${styles.safe} ${styles.body}`}>
      {landing?<div className={styles.columns}>
        <section><h2>{copy.process}</h2><ol className={styles.steps}>{landing.steps.map((text,i)=><li key={text}><span aria-hidden="true">0{i+1}</span><p>{text}</p></li>)}</ol></section>
        <aside className={styles.checklist}><h2>{copy.prepare}</h2><ul>{landing.checklist.map(item=><li key={item}><Check size={18} aria-hidden="true"/><span>{item}</span></li>)}</ul><p className={styles.note}>{page.note}</p></aside>
      </div>:<>
        <div className={styles.cards}>{requests.map(request=>{const topic=serviceFormMessages[locale].topics[request];return <article key={request}>
          <FileText size={26} aria-hidden="true"/>{kind==="downloads"&&<p className={styles.status}>{copy.available}</p>}<h2>{topic.title}</h2><p>{topic.hint}</p>
          <Link prefetch={false} href={serviceInquiryHref(locale,request,servicePaths[kind])}>{kind==="downloads"?messages[locale].requestDocument:copy.open}<ArrowUpRight size={18} aria-hidden="true"/></Link>
        </article>;})}</div>
        <p className={styles.notice}>{page.note}</p>
      </>}
      {landing && <section className={styles.requestAction}><div><h2>{copy.prepare}</h2><p>{landing.checklist.join(" · ")}</p></div><Link prefetch={false} className="button" href={serviceInquiryHref(locale,primary,servicePaths[kind])}>{landing.cta}<ArrowUpRight size={18} aria-hidden="true"/></Link></section>}
      <section className={styles.next}><h2>{copy.related}</h2><ServiceLinks locale={locale} except={kind}/><Link prefetch={false} className={styles.catalog} href={href(locale,"/products/")}>{messages[locale].catalogTitle}<ArrowUpRight size={18} aria-hidden="true"/></Link></section>
    </div>
  </div>;
}
