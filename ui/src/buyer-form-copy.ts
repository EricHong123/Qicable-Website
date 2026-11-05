import { expandLocales } from "./locale-runtime";
import type { Locale } from "./i18n";

export const buyerFormCopy = expandLocales({
  "en": {
    "startHint": "Start with a model, equipment name, connector photo or drawing. Missing details can be confirmed during the review.",
    "arrivalDate": "Required arrival date",
    "messageHint": "Tell us what you need to connect, the length and where it will be used.",
    "quoteHint": "Your model and quantity help us review the configuration and supply requirements.",
    "customHint": "Share both connectors, length and any drawing or wiring requirements.",
    "supportHint": "Describe your equipment, interfaces and the installation or operating issue.",
    "receivedNext": "We will review the submitted configuration and contact details, then follow up to clarify the project requirements."
  },
  "de": {
    "startHint": "Beginnen Sie mit Modell, Gerätename, Steckerfoto oder Zeichnung. Fehlende Angaben können wir bei der Prüfung klären.",
    "arrivalDate": "Gewünschter Ankunftstermin",
    "messageHint": "Beschreiben Sie Anschlüsse, Länge und Einsatzort.",
    "quoteHint": "Modell und Menge helfen bei der Prüfung von Konfiguration und Versorgung.",
    "customHint": "Nennen Sie beide Stecker, Länge sowie Zeichnungs- oder Verdrahtungsanforderungen.",
    "supportHint": "Beschreiben Sie Geräte, Schnittstellen und das Einbau- oder Betriebsproblem.",
    "receivedNext": "Wir prüfen die übermittelte Konfiguration und Kontaktdaten und klären anschließend die Projektanforderungen."
  },
  "es": {
    "startHint": "Empiece con un modelo, equipo, foto del conector o plano. Los detalles pendientes se pueden confirmar durante la revisión.",
    "arrivalDate": "Fecha de llegada requerida",
    "messageHint": "Indique qué necesita conectar, la longitud y el lugar de uso.",
    "quoteHint": "El modelo y la cantidad ayudan a revisar la configuración y el suministro.",
    "customHint": "Comparta ambos conectores, longitud y requisitos de planos o cableado.",
    "supportHint": "Describa equipos, interfaces y el problema de instalación o funcionamiento.",
    "receivedNext": "Revisaremos la configuración y los datos de contacto y nos comunicaremos para aclarar los requisitos del proyecto."
  },
  "fr": {
    "startHint": "Commencez par un modèle, un équipement, une photo de connecteur ou un plan. Les informations manquantes seront précisées lors de l’étude.",
    "arrivalDate": "Date d’arrivée souhaitée",
    "messageHint": "Précisez les connexions, la longueur et le lieu d’utilisation.",
    "quoteHint": "Le modèle et la quantité nous aident à étudier la configuration et la fourniture.",
    "customHint": "Précisez les deux connecteurs, la longueur et les exigences de plan ou de câblage.",
    "supportHint": "Décrivez équipements, interfaces et problème d’installation ou de fonctionnement.",
    "receivedNext": "Nous examinerons la configuration et les coordonnées puis vous contacterons pour préciser les exigences du projet."
  },
  "pt": {
    "startHint": "Comece com um modelo, equipamento, foto do conector ou desenho. Os detalhes pendentes podem ser confirmados na análise.",
    "arrivalDate": "Data de chegada desejada",
    "messageHint": "Informe o que precisa conectar, o comprimento e o local de uso.",
    "quoteHint": "Modelo e quantidade ajudam a analisar a configuração e o fornecimento.",
    "customHint": "Informe os dois conectores, comprimento e requisitos de desenho ou fiação.",
    "supportHint": "Descreva equipamentos, interfaces e o problema de instalação ou operação.",
    "receivedNext": "Analisaremos a configuração e os dados de contato e entraremos em contato para esclarecer os requisitos do projeto."
  },
  "ar": {
    "startHint": "ابدأ بالطراز أو اسم المعدات أو صورة الموصل أو الرسم. يمكن تأكيد التفاصيل الناقصة أثناء المراجعة.",
    "arrivalDate": "تاريخ الوصول المطلوب",
    "messageHint": "حدد ما تريد توصيله والطول ومكان الاستخدام.",
    "quoteHint": "يساعد الطراز والكمية في مراجعة التكوين ومتطلبات التوريد.",
    "customHint": "حدد كلا الموصلين والطول ومتطلبات الرسم أو التوصيلات.",
    "supportHint": "صف المعدات والواجهات ومشكلة التركيب أو التشغيل.",
    "receivedNext": "سنراجع التكوين وبيانات الاتصال ثم نتواصل لتوضيح متطلبات المشروع."
  }
}) satisfies Record<Locale, Record<string, string>>;
