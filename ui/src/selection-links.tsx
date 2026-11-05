import Link from "next/link";
import { categorySlugs, guideSlugs, categoryGuides, href } from "./navigation";
import { categoryContent } from "./category-content";
import { messages, type Locale } from "./i18n";
import { serviceContent } from "./service-content";
import styles from "./selection.module.css";
import { nativeArticle } from "./native-content";

export { categoryGuides } from "./navigation";
export const categoryApplications = [0,1,1,4,3,4] as const;
const applicationPaths = ["machine-vision","factory-automation","robotics","industrial-pc-hmi","equipment-integration"] as const;
export function SelectionLinks({locale,category,includeCategory=false}:{locale:Locale;category:number;includeCategory?:boolean}) {
  const t = messages[locale];
  return <nav className={styles.links} aria-label={categoryContent[locale].related}>
    {includeCategory && <Link prefetch={false} href={href(locale,`/products/${categorySlugs[category]}/`)}>{categoryContent[locale].families[category].title}</Link>}
    {categoryGuides[category].map(index => <Link prefetch={false} key={index} href={href(locale,`/${guideSlugs[index]}/`)}>{nativeArticle(locale, guideSlugs[index])?.title ?? t.guideNames[index]}</Link>)}
    <Link prefetch={false} href={href(locale,`/applications/${applicationPaths[categoryApplications[category]]}/`)}>{t.applicationNames[categoryApplications[category]]}</Link>
    <Link prefetch={false} href={href(locale,"/technical-support/")}>{serviceContent[locale].support.title}</Link>
  </nav>;
}
export function CategorySelection({locale,category}:{locale:Locale;category:number}) {
  const copy=categoryContent[locale];
  const family=copy.families[category];
  return <section className={`section container ${styles.section}`}>
    <h2>{copy.heading}</h2>
    <div className={styles.columns}>
      <div><h3>{copy.fitLabel}</h3><p>{family.fit}</p></div>
      <div><h3>{copy.checkLabel}</h3><p>{family.check}</p></div>
    </div>
    <SelectionLinks locale={locale} category={category}/>
  </section>;
}
