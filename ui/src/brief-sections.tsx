import Link from "next/link";
import { clientBrief } from "./client-brief";
import { messages, type Locale } from "./i18n";
import { href } from "./navigation";
import styles from "./brief.module.css";

export function FactoryFacts({locale}:{locale:Locale}) {
  const t = clientBrief[locale];
  return <section className={styles.facts} aria-label={t.factory}>
    <h2>{t.factory}</h2>
    <dl><div><dt>{t.area}</dt><dd><bdi>5,000+ m²</bdi></dd></div><div><dt>{t.employees}</dt><dd><bdi>200+</bdi></dd></div></dl>
  </section>;
}
export function EngineeringFeatures({locale}:{locale:Locale}) {
  const t=clientBrief[locale];
  const items=[{title:t.locking,text:t.lockingText,to:"/products/machine-vision/"},{title:t.routing,text:t.routingText,to:"/static-vs-continuous-flex-cables/"},{title:t.panel,text:t.panelText,to:"/products/panel-mount/"}];
  return <section className="section soft-bg"><div className={`container ${styles.features}`}>{items.map(item=><article key={item.to}><h2>{item.title}</h2><p>{item.text}</p><Link prefetch={false} className="text-link" href={href(locale,item.to)}>{item.to.includes("continuous-flex") ? messages[locale].readGuide : t.explore} →</Link></article>)}</div></section>;
}
export function CustomStages({locale}:{locale:Locale}) {
  const t=clientBrief[locale];
  return <ol className={styles.stages}>{[t.requirements,t.drawing,t.sample,t.validation,t.approval,t.production].map((title,i)=><li key={title}><span aria-hidden="true">{String(i+1).padStart(2,"0")}</span><h3>{title}</h3></li>)}</ol>;
}
