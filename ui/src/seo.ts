import { expandLocales } from "./locale-runtime";
import {certificateCopy} from "./certificates";
import { pageTitle, productName, type PageRoute } from "./model";
import { messages, type Locale } from "./i18n";
import { categoryContent } from "./category-content";
import { applicationDescriptions } from "./application-content";
import { guideContent } from "./guide-content";
import { nativeArticle } from "./native-content";
import { isPolicyKind, policyContent } from "./policy-content";
import { isServiceKind, serviceContent } from "./service-content";

const summaries: Record<Locale, { resources:string; guides:string; faq:string; applications:string }> = expandLocales({
  en:{resources:"Find cable selection guides, request model-specific documents, and get help with samples, compatibility or an existing order.",guides:"Select industrial cables by interface, M12 coding, movement, panel dimensions, serial signals and shielding. Prepare the details for engineering review.",faq:"Answers to cable selection and ordering questions: connector compatibility, custom requirements, samples, drawings and project review.",applications:"Explore cable connections for machine vision, factory automation, robotics, industrial PCs and equipment integration. Start with your installation requirements."},
  de:{resources:"Finden Sie Kabel-Auswahlhilfen, fordern Sie modellspezifische Unterlagen an und erhalten Sie Hilfe zu Mustern, Kompatibilität oder bestehenden Aufträgen.",guides:"Industriekabel nach Schnittstelle, M12-Codierung, Bewegung, Einbaumaßen, seriellen Signalen und Schirmung auswählen. Technische Anfragen vorbereiten.",faq:"Antworten zur Kabelauswahl und Bestellung: Steckverbinder, individuelle Anforderungen, Muster, Zeichnungen und technische Projektprüfung.",applications:"Kabelverbindungen für Bildverarbeitung, Automatisierung, Robotik, Industrie-PCs und Geräteintegration. Beginnen Sie mit den Einbaubedingungen."},
  es:{resources:"Consulte guías de selección, solicite documentos por modelo y obtenga ayuda con muestras, compatibilidad o pedidos existentes.",guides:"Seleccione cables por interfaz, codificación M12, movimiento, dimensiones de panel, señales serie y apantallamiento. Prepare su consulta técnica.",faq:"Respuestas sobre selección y pedidos de cables: compatibilidad, requisitos personalizados, muestras, planos y revisión del proyecto.",applications:"Explore conexiones para visión artificial, automatización, robótica, PC industriales e integración de equipos según sus condiciones de instalación."},
  fr:{resources:"Consultez les guides, demandez des documents par modèle et obtenez une aide pour les échantillons, la compatibilité ou une commande existante.",guides:"Choisissez les câbles selon l’interface, le codage M12, le mouvement, les dimensions, les signaux série et le blindage. Préparez votre demande technique.",faq:"Réponses sur la sélection et la commande de câbles : compatibilité, besoins spécifiques, échantillons, plans et examen du projet.",applications:"Explorez les connexions pour vision industrielle, automatisation, robotique, PC industriels et intégration selon les conditions d’installation."},
  pt:{resources:"Consulte guias, solicite documentos por modelo e obtenha apoio para amostras, compatibilidade ou encomendas existentes.",guides:"Selecione cabos por interface, codificação M12, movimento, dimensões de painel, sinais série e blindagem. Prepare a sua consulta técnica.",faq:"Respostas sobre seleção e encomenda de cabos: compatibilidade, requisitos personalizados, amostras, desenhos e análise do projeto.",applications:"Explore ligações para visão industrial, automação, robótica, PC industriais e integração de equipamentos segundo as condições de instalação."},
  ar:{resources:"اطّلع على أدلة اختيار الكابلات واطلب وثائق خاصة بالطراز واحصل على المساعدة بشأن العينات أو التوافق أو طلب قائم.",guides:"اختر الكابلات وفق الواجهة وترميز M12 والحركة وأبعاد اللوحة والإشارات التسلسلية والتدريع. جهّز التفاصيل للمراجعة الهندسية.",faq:"إجابات عن اختيار الكابلات وطلبها: توافق الموصلات والمتطلبات المخصصة والعينات والرسومات ومراجعة المشروع.",applications:"استكشف توصيلات الرؤية الصناعية والأتمتة والروبوتات والحواسيب الصناعية وتكامل المعدات، بدءًا من متطلبات التركيب."},
});

export function productSummary(product: NonNullable<PageRoute["product"]>, locale: Locale) {
  // The connector labels and values are the same facts displayed in the visible table.
  const t = messages[locale];
  return `${product.model} — ${productName(product, locale)}. ${t.connectorA}: ${product.connectorA}; ${t.connectorB}: ${product.connectorB}.`;
}
const productAction: Record<Locale,string> = expandLocales({
  en:"Discuss drawings and request a quote.",
  de:"Zeichnungen besprechen und Angebot anfragen.",
  es:"Consulte planos y solicite una cotización.",
  fr:"Discutez des plans et demandez un devis.",
  pt:"Consulte desenhos e solicite uma proposta.",
  ar:"ناقش الرسومات واطلب عرض سعر.",
});

export function pageSeo(route: PageRoute, locale: Locale): {title:string;description:string} {
  const t = messages[locale];
  let title = pageTitle(route, locale);
  let description: string;
  if (isServiceKind(route.kind)) description = serviceContent[locale][route.kind].intro;
  else if (isPolicyKind(route.kind)) description = policyContent[locale].pages[route.kind].intro;
  else switch(route.kind) {
    case "home": description = t.heroText; break;
    case "catalog":
      if (route.index !== undefined) title = categoryContent[locale].families[route.index].title;
      description = route.index === undefined ? t.catalogText : t.categoryDescriptions[route.index]; break;
    case "product":
      title = `${productName(route.product!,locale)} · ${route.product!.model}`;
      description = `${route.product!.model}: ${productName(route.product!,locale)}. ${productAction[locale]}`; break;
    case "application": description = applicationDescriptions[locale][route.index!]; break;
    case "applications": description = summaries[locale].applications; break;
    case "custom": description = t.customText; break;
    case "certificates": description = certificateCopy[locale].intro; break;
    case "quality": description = t.manufactureText; break;
    case "resources": description = summaries[locale].resources; break;
    case "guides": description = summaries[locale].guides; break;
    case "guide": description = nativeArticle(locale, route.path.slice(1,-1))?.description ?? guideContent[locale][route.index!]?.lead ?? ""; break;
    case "faq": description = summaries[locale].faq; break;
    case "about": description = t.aboutText; break;
    case "contact": description = t.contactText; break;
    default: { const neverKind: never = route.kind; throw new Error(`Missing SEO copy: ${neverKind}`); }
  }
  if(route.path === "/resources/guides/"){title = `${t.guides} · ${t.resources}`; description = `${t.guides}: ${description}`;}
  return { title: `${title} | Qicable`, description };
}
