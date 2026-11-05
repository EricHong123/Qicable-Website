import { expandLocales, translateText } from "./locale-runtime";
import { nativeProduct } from "./native-content";
import { messages, type Locale } from "./i18n";

export function NativeProductDetails({model,locale}:{model:string;locale:Locale}) {
  const product=nativeProduct(model);
  if(!product)return null;
  const t=(text:string)=>translateText(text,locale);
  const specs=product.agentSpecifications;
  const hasExtra=product.sellingPoints.length||product.detailSections.length||product.applications.length||product.moq||product.leadTime||product.datasheetUrl||product.agentSkuColors?.length;
  const labels=expandLocales({en:{details:"Product details",moq:"Minimum order",lead:"Lead time",applications:"Applications"},de:{details:"Produktdetails",moq:"Mindestbestellmenge",lead:"Lieferzeit",applications:"Anwendungen"},es:{details:"Detalles del producto",moq:"Pedido mínimo",lead:"Plazo de entrega",applications:"Aplicaciones"},fr:{details:"Détails du produit",moq:"Commande minimale",lead:"Délai",applications:"Applications"},pt:{details:"Detalhes do produto",moq:"Pedido mínimo",lead:"Prazo de entrega",applications:"Aplicações"},ar:{details:"تفاصيل المنتج",moq:"الحد الأدنى للطلب",lead:"مدة التسليم",applications:"التطبيقات"}})[locale];
  // Tables with notes or multiple configuration columns must remain visible,
  // in addition to the compact fields used by the catalog filters.
  const coreLabels=new Set(["Interface","Connector A","Connector B","Mounting","Lengths","Subcategory"]);
  const extendedSpecs=specs&&(specs.columns.length>1||specs.notes.length||specs.groups.length>2||specs.groups[0]?.title!=="Cable configuration"||specs.groups[0]?.rows.some(row=>!coreLabels.has(row.label))||(specs.groups[1]&&specs.groups[1].title!=="Engineering options")||specs.groups.some(group=>group.rows.some(row=>row.note)));
  if(!hasExtra&&!extendedSpecs)return null;
  return <section className="section container narrow">
    <h2>{labels.details}</h2>
    {!!product.sellingPoints.length&&<ul>{product.sellingPoints.map((item,i)=><li key={i}>{t(item)}</li>)}</ul>}
    {(product.moq||product.leadTime)&&<dl>{product.moq&&<><dt>{labels.moq}</dt><dd>{t(product.moq)}</dd></>}{product.leadTime&&<><dt>{labels.lead}</dt><dd>{t(product.leadTime)}</dd></>}</dl>}
    {!!product.applications.length&&<><h3>{labels.applications}</h3><ul>{product.applications.map((item,i)=><li key={i}>{t(item)}</li>)}</ul></>}
    {product.detailSections.map((section,i)=><section key={i}>{section.eyebrow&&<p>{t(section.eyebrow)}</p>}<h3>{t(section.title)}</h3><p>{t(section.summary)}</p>{!!section.bullets.length&&<ul>{section.bullets.map((item,j)=><li key={j}>{t(item)}</li>)}</ul>}</section>)}
    {extendedSpecs&&<><h3>{messages[locale].specifications}</h3>{specs.groups.map((group,i)=><div key={i} style={{overflowX:"auto"}}><h4>{t(group.title)}</h4><table><thead><tr><th scope="col">{messages[locale].specifications}</th>{specs.columns.map((column,j)=><th scope="col" key={j}>{t(column)}</th>)}</tr></thead><tbody>{group.rows.map((row,j)=><tr key={j}><th scope="row">{t(row.label)}{row.note&&<small> — {t(row.note)}</small>}</th>{row.values.length===1?<td colSpan={specs.columns.length}>{t(row.values[0])}</td>:row.values.map((value,k)=><td key={k}>{t(value)}</td>)}</tr>)}</tbody></table></div>)}{specs.notes.map((note,i)=><p key={i}>{t(note)}</p>)}</>}
    {product.agentSkuColors?.map(color=><section key={color.slug}><h3><span aria-hidden="true" style={{display:"inline-block",width:16,height:16,backgroundColor:color.swatch,border:"1px solid #60656b",marginInlineEnd:8}}/>{t(color.label)}</h3><div className="product-grid">{color.images.map(image=><figure key={image.src}><img src={image.src} alt={t(image.alt??color.label)} width={image.width} height={image.height} loading="lazy" decoding="async" style={{width:"100%",height:"auto"}}/></figure>)}</div></section>)}
    {product.datasheetUrl&&<a className="text-link" href={product.datasheetUrl}>{messages[locale].downloads}</a>}
  </section>;
}
