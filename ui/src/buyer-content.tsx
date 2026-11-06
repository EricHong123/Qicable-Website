import { expandLocales } from "./locale-runtime";
import {Cable, Ruler, Settings2, Activity, ArrowRight, ArrowUpRight} from 'lucide-react';
import Link from 'next/link';
import type {Locale} from './i18n';
import {href,inquiryHref} from './navigation';
const copy = expandLocales({
 en:['Find your cable','Send your drawing','Connections that fit your equipment','Match both connectors','Compare interfaces, coding and locking before choosing a cable.','Plan the installation','Check connector direction, panel dimensions and routing space.','Review a custom configuration','Share the connector pair, length and wiring when a standard option does not fit.','Check operating conditions','For moving equipment, confirm bend radius, travel and motion before selecting a version.','Compare cable options','Discuss your drawing','Standard or custom: start with what you know','Have a model? Compare its configuration and add it to your inquiry. Have a drawing? Send the interfaces, length and installation requirements for review.',"Custom cable assemblies for machine vision and industrial automation. From drawing review and connector selection to cable assembly and quality inspection, we manufacture to your confirmed specifications."],
 de:['Kabel finden','Zeichnung senden','Verbindungen passend zu Ihrer Anlage','Beide Anschlüsse abgleichen','Schnittstellen, Codierung und Verriegelung vor der Auswahl vergleichen.','Einbau planen','Steckerrichtung, Panelmaße und Platz für die Kabelführung prüfen.','Sonderkonfiguration besprechen','Steckerpaar, Länge und Verdrahtung angeben, wenn eine Standardlösung nicht passt.','Betriebsbedingungen prüfen','Bei bewegten Anlagen Biegeradius, Verfahrweg und Bewegung vor der Auswahl bestätigen.','Kabel vergleichen','Zeichnung besprechen','Standard oder individuell: mit vorhandenen Angaben starten','Modell vorhanden? Konfiguration vergleichen und zur Anfrage hinzufügen. Zeichnung vorhanden? Schnittstellen, Länge und Einbauanforderungen zur Prüfung senden.',"Individuelle Kabelkonfektionen für Bildverarbeitung und industrielle Automatisierung. Von Zeichnungsprüfung und Steckerauswahl bis zur Konfektionierung und Qualitätsprüfung fertigen wir nach Ihren bestätigten Spezifikationen."],
 es:['Encontrar su cable','Enviar su plano','Conexiones para su equipo','Comparar ambos conectores','Compare interfaces, codificación y bloqueo antes de elegir un cable.','Planificar la instalación','Revise orientación, dimensiones del panel y espacio de tendido.','Consultar una configuración a medida','Indique conectores, longitud y cableado si una opción estándar no encaja.','Revisar las condiciones de uso','En equipos móviles, confirme radio de curvatura, recorrido y movimiento antes de elegir.','Comparar cables','Consultar su plano','Estándar o a medida: empiece con los datos disponibles','¿Tiene un modelo? Compare su configuración y añádalo a la consulta. ¿Tiene un plano? Envíe interfaces, longitud y requisitos de instalación.',"Conjuntos de cables a medida para visión artificial y automatización industrial. Desde la revisión de planos y selección de conectores hasta el montaje y la inspección de calidad, fabricamos según sus especificaciones confirmadas."],
 fr:['Trouver votre câble','Envoyer votre plan','Des connexions adaptées à votre équipement','Comparer les deux connecteurs','Comparez interfaces, codage et verrouillage avant de choisir un câble.','Préparer l’installation','Vérifiez orientation, dimensions du panneau et espace de cheminement.','Étudier une configuration sur mesure','Précisez connecteurs, longueur et câblage si une option standard ne convient pas.','Vérifier les conditions d’utilisation','Pour les équipements mobiles, confirmez rayon de courbure, course et mouvement avant le choix.','Comparer les câbles','Discuter de votre plan','Standard ou sur mesure : partez des informations disponibles','Un modèle identifié ? Comparez sa configuration et ajoutez-le à votre demande. Un plan disponible ? Envoyez interfaces, longueur et contraintes d’installation.',"Câbles assemblés sur mesure pour la vision industrielle et l’automatisation. De la revue des plans et du choix des connecteurs à l’assemblage et au contrôle qualité, nous fabriquons selon vos spécifications validées."],
 pt:['Encontrar seu cabo','Enviar seu desenho','Conexões para seu equipamento','Comparar os dois conectores','Compare interfaces, codificação e travamento antes de escolher um cabo.','Planejar a instalação','Confira orientação, dimensões do painel e espaço para passagem.','Discutir uma configuração personalizada','Informe conectores, comprimento e fiação quando a opção padrão não servir.','Verificar condições de operação','Para equipamentos móveis, confirme raio de curvatura, curso e movimento antes da escolha.','Comparar cabos','Discutir seu desenho','Padrão ou personalizado: comece pelos dados disponíveis','Já tem um modelo? Compare a configuração e adicione à consulta. Tem um desenho? Envie interfaces, comprimento e requisitos de instalação.',"Conjuntos de cabos personalizados para visão industrial e automação. Da análise do desenho e seleção de conectores à montagem e inspeção de qualidade, fabricamos conforme suas especificações confirmadas."],
 ar:['ابحث عن الكابل','أرسل الرسم','توصيلات تناسب معداتك','طابق طرفي التوصيل','قارن الواجهات والترميز والتثبيت قبل اختيار الكابل.','خطط للتركيب','راجع اتجاه الموصل وأبعاد اللوحة ومساحة مسار الكابل.','ناقش تكويناً مخصصاً','حدد الموصلات والطول والتوصيلات عندما لا يناسبك الخيار القياسي.','تحقق من ظروف التشغيل','للمعدات المتحركة، أكد نصف قطر الانحناء ومسافة الحركة ونمطها قبل الاختيار.','قارن خيارات الكابلات','ناقش الرسم','قياسي أو مخصص: ابدأ بالمعلومات المتاحة','لديك طراز؟ قارن تكوينه وأضفه للاستفسار. لديك رسم؟ أرسل الواجهات والطول ومتطلبات التركيب للمراجعة.',"تجميعات كابلات مخصصة للرؤية الآلية والأتمتة الصناعية. من مراجعة الرسومات واختيار الموصلات إلى تجميع الكابلات وفحص الجودة، نصنّع وفق مواصفاتكم المعتمدة."],
}) satisfies Record<Locale,string[]>;
export const buyerCopy=(locale:Locale)=>copy[locale];
export function BuyerProblems({locale}:{locale:Locale}) {
 const t=copy[locale];
 const icons=[Cable,Ruler,Settings2,Activity];
 return <section className="section buyer-problems" aria-labelledby="buyer-flow-title">
  <div className="container buyer-problems-layout">
   <div className="buyer-problems-intro">
    <h2 id="buyer-flow-title">{t[2]}</h2>
    <p>{t[14]}</p>
    <Link prefetch={false} className="button" href={href(locale,'/products/')}>{t[0]}<ArrowUpRight size={18} aria-hidden="true"/></Link>
   </div>
   <ol id="connection-flow" className="buyer-problem-grid" role="list" aria-labelledby="buyer-flow-title">
    {[3,5,7,9].map((i,n)=>{
     const Icon=icons[n];
     return <li key={i}>
      <article>
       <div className="buyer-card-top"><span className="model-label" aria-hidden="true">0{n+1}</span><Icon size={26} aria-hidden="true"/></div>
       <h3>{t[i]}</h3>
       <p>{t[i+1]}</p>
       <Link prefetch={false} className="text-link" href={n===0?href(locale,'/products/'):inquiryHref(locale,undefined,n===3?'support':'custom')}>{n===0?t[11]:t[12]}<ArrowUpRight size={17} aria-hidden="true"/></Link>
      </article>
      {n<3 && <span className="buyer-flow-connector" aria-hidden="true"><ArrowRight size={24}/></span>}
     </li>;
    })}
   </ol>
  </div>
 </section>;
}
export function BuyingPaths({locale}:{locale:Locale}){const t=copy[locale];return <section className="section container buying-paths"><div><h2>{t[13]}</h2><p>{t[14]}</p></div><div className="actions"><Link prefetch={false} className="button" href={href(locale,'/products/')}>{t[0]}</Link><Link prefetch={false} className="button secondary" href={inquiryHref(locale,undefined,'custom')}>{t[1]}</Link></div></section>}
