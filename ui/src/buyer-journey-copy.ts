import { expandLocales } from "./locale-runtime";
import type { Locale } from "./i18n";

type BuyerJourneyCopy = {
  title: string;
  intro: string;
  modelTitle: string;
  modelText: string;
  modelAction: string;
  reviewTitle: string;
  reviewText: string;
  reviewAction: string;
  customTitle: string;
  customText: string;
  customAction: string;
  processTitle: string;
  processIntro: string;
  requirementsTitle: string;
  requirementsText: string;
  sampleTitle: string;
  sampleText: string;
  productionTitle: string;
  productionText: string;
  deliveryTitle: string;
  deliveryText: string;
  productTitle: string;
  productIntro: string;
  startHint: string;
  arrivalDate: string;
  messageHint: string;
  quoteHint: string;
  customHint: string;
  supportHint: string;
  receivedNext: string;
};

export const buyerJourneyCopy: Record<Locale, BuyerJourneyCopy> = expandLocales({
  "en": {
    "title": "Start with your project",
    "intro": "Choose the information you already have.",
    "modelTitle": "I have a model",
    "modelText": "Find a cable and include its model in your inquiry.",
    "modelAction": "Find your cable",
    "reviewTitle": "Check a configuration",
    "reviewText": "Share your equipment, interfaces and operating conditions.",
    "reviewAction": "Check my configuration",
    "customTitle": "I need a custom assembly",
    "customText": "Send connector details, cable length or a drawing for review.",
    "customAction": "Send your specification",
    "processTitle": "From requirements to supply",
    "processIntro": "Confirm the configuration and project requirements at each stage.",
    "requirementsTitle": "Requirements & drawing",
    "requirementsText": "Share interfaces, installation space and operating conditions.",
    "sampleTitle": "Configuration & sample",
    "sampleText": "Agree the configuration and sample evaluation requirements.",
    "productionTitle": "Production & inspection",
    "productionText": "Confirm the drawing revision, materials and inspection requirements.",
    "deliveryTitle": "Packaging & delivery",
    "deliveryText": "Agree quantities, labels, packaging and delivery arrangements.",
    "productTitle": "Review this cable for your project",
    "productIntro": "Share the quantity, equipment and required arrival date so we can review the configuration and supply requirements.",
    "startHint": "Start with a model, equipment name, connector photo or drawing. Missing details can be confirmed during the review.",
    "arrivalDate": "Required arrival date",
    "messageHint": "Tell us what you need to connect, the length and where it will be used.",
    "quoteHint": "Your model and quantity help us review the configuration and supply requirements.",
    "customHint": "Share both connectors, length and any drawing or wiring requirements.",
    "supportHint": "Describe your equipment, interfaces and the installation or operating issue.",
    "receivedNext": "We will review the submitted configuration and contact details, then follow up to clarify the project requirements."
  },
  "de": {
    "title": "Beginnen Sie mit Ihrem Projekt",
    "intro": "Wählen Sie die Informationen, die Ihnen bereits vorliegen.",
    "modelTitle": "Ein Modell ist bekannt",
    "modelText": "Finden Sie ein Kabel und geben Sie das Modell in Ihrer Anfrage an.",
    "modelAction": "Kabel finden",
    "reviewTitle": "Konfiguration prüfen",
    "reviewText": "Nennen Sie Geräte, Schnittstellen und Betriebsbedingungen.",
    "reviewAction": "Konfiguration prüfen lassen",
    "customTitle": "Individuelle Konfektion benötigt",
    "customText": "Senden Sie Steckerangaben, Kabellänge oder eine Zeichnung zur Prüfung.",
    "customAction": "Spezifikation senden",
    "processTitle": "Von Anforderungen zur Versorgung",
    "processIntro": "Stimmen Sie Konfiguration und Projektanforderungen in jeder Phase ab.",
    "requirementsTitle": "Anforderungen und Zeichnung",
    "requirementsText": "Nennen Sie Schnittstellen, Einbauraum und Betriebsbedingungen.",
    "sampleTitle": "Konfiguration und Muster",
    "sampleText": "Vereinbaren Sie Konfiguration und Anforderungen an die Musterprüfung.",
    "productionTitle": "Fertigung und Prüfung",
    "productionText": "Bestätigen Sie Zeichnungsstand, Materialien und Prüfanforderungen.",
    "deliveryTitle": "Verpackung und Lieferung",
    "deliveryText": "Stimmen Sie Mengen, Kennzeichnung, Verpackung und Lieferung ab.",
    "productTitle": "Dieses Kabel für Ihr Projekt prüfen",
    "productIntro": "Nennen Sie Menge, Geräte und gewünschten Ankunftstermin zur Prüfung von Konfiguration und Versorgung.",
    "startHint": "Beginnen Sie mit Modell, Gerätename, Steckerfoto oder Zeichnung. Fehlende Angaben können wir bei der Prüfung klären.",
    "arrivalDate": "Gewünschter Ankunftstermin",
    "messageHint": "Beschreiben Sie Anschlüsse, Länge und Einsatzort.",
    "quoteHint": "Modell und Menge helfen bei der Prüfung von Konfiguration und Versorgung.",
    "customHint": "Nennen Sie beide Stecker, Länge sowie Zeichnungs- oder Verdrahtungsanforderungen.",
    "supportHint": "Beschreiben Sie Geräte, Schnittstellen und das Einbau- oder Betriebsproblem.",
    "receivedNext": "Wir prüfen die übermittelte Konfiguration und Kontaktdaten und klären anschließend die Projektanforderungen."
  },
  "es": {
    "title": "Empiece por su proyecto",
    "intro": "Elija la información que ya tiene.",
    "modelTitle": "Tengo un modelo",
    "modelText": "Encuentre un cable e incluya su modelo en la consulta.",
    "modelAction": "Encontrar su cable",
    "reviewTitle": "Revisar una configuración",
    "reviewText": "Comparta equipos, interfaces y condiciones de uso.",
    "reviewAction": "Revisar mi configuración",
    "customTitle": "Necesito un conjunto a medida",
    "customText": "Envíe conectores, longitud o un plano para revisión.",
    "customAction": "Enviar especificaciones",
    "processTitle": "De los requisitos al suministro",
    "processIntro": "Confirme la configuración y los requisitos en cada etapa.",
    "requirementsTitle": "Requisitos y plano",
    "requirementsText": "Indique interfaces, espacio de instalación y condiciones de uso.",
    "sampleTitle": "Configuración y muestra",
    "sampleText": "Acuerde la configuración y los requisitos de evaluación de muestras.",
    "productionTitle": "Producción e inspección",
    "productionText": "Confirme revisión del plano, materiales e inspecciones.",
    "deliveryTitle": "Embalaje y entrega",
    "deliveryText": "Acuerde cantidades, etiquetas, embalaje y entrega.",
    "productTitle": "Revise este cable para su proyecto",
    "productIntro": "Comparta cantidad, equipo y fecha de llegada para revisar la configuración y el suministro.",
    "startHint": "Empiece con un modelo, equipo, foto del conector o plano. Los detalles pendientes se pueden confirmar durante la revisión.",
    "arrivalDate": "Fecha de llegada requerida",
    "messageHint": "Indique qué necesita conectar, la longitud y el lugar de uso.",
    "quoteHint": "El modelo y la cantidad ayudan a revisar la configuración y el suministro.",
    "customHint": "Comparta ambos conectores, longitud y requisitos de planos o cableado.",
    "supportHint": "Describa equipos, interfaces y el problema de instalación o funcionamiento.",
    "receivedNext": "Revisaremos la configuración y los datos de contacto y nos comunicaremos para aclarar los requisitos del proyecto."
  },
  "fr": {
    "title": "Commencez par votre projet",
    "intro": "Choisissez les informations dont vous disposez déjà.",
    "modelTitle": "Je connais le modèle",
    "modelText": "Trouvez un câble et indiquez son modèle dans votre demande.",
    "modelAction": "Trouver votre câble",
    "reviewTitle": "Vérifier une configuration",
    "reviewText": "Précisez équipements, interfaces et conditions de fonctionnement.",
    "reviewAction": "Vérifier ma configuration",
    "customTitle": "Je souhaite un assemblage sur mesure",
    "customText": "Envoyez les connecteurs, la longueur ou un plan pour étude.",
    "customAction": "Envoyer les spécifications",
    "processTitle": "Des exigences à la fourniture",
    "processIntro": "Validez la configuration et les exigences à chaque étape.",
    "requirementsTitle": "Exigences et plan",
    "requirementsText": "Indiquez interfaces, espace disponible et conditions de fonctionnement.",
    "sampleTitle": "Configuration et échantillon",
    "sampleText": "Convenez de la configuration et des exigences d’évaluation des échantillons.",
    "productionTitle": "Production et inspection",
    "productionText": "Confirmez révision du plan, matériaux et exigences de contrôle.",
    "deliveryTitle": "Emballage et livraison",
    "deliveryText": "Convenez des quantités, étiquettes, emballages et livraisons.",
    "productTitle": "Étudions ce câble pour votre projet",
    "productIntro": "Précisez quantité, équipements et date d’arrivée pour étudier la configuration et la fourniture.",
    "startHint": "Commencez par un modèle, un équipement, une photo de connecteur ou un plan. Les informations manquantes seront précisées lors de l’étude.",
    "arrivalDate": "Date d’arrivée souhaitée",
    "messageHint": "Précisez les connexions, la longueur et le lieu d’utilisation.",
    "quoteHint": "Le modèle et la quantité nous aident à étudier la configuration et la fourniture.",
    "customHint": "Précisez les deux connecteurs, la longueur et les exigences de plan ou de câblage.",
    "supportHint": "Décrivez équipements, interfaces et problème d’installation ou de fonctionnement.",
    "receivedNext": "Nous examinerons la configuration et les coordonnées puis vous contacterons pour préciser les exigences du projet."
  },
  "pt": {
    "title": "Comece pelo seu projeto",
    "intro": "Escolha as informações que você já tem.",
    "modelTitle": "Já tenho um modelo",
    "modelText": "Encontre um cabo e inclua o modelo na consulta.",
    "modelAction": "Encontrar seu cabo",
    "reviewTitle": "Verificar uma configuração",
    "reviewText": "Informe equipamentos, interfaces e condições de operação.",
    "reviewAction": "Verificar minha configuração",
    "customTitle": "Preciso de uma montagem personalizada",
    "customText": "Envie conectores, comprimento ou desenho para análise.",
    "customAction": "Enviar especificações",
    "processTitle": "Dos requisitos ao fornecimento",
    "processIntro": "Confirme a configuração e os requisitos em cada etapa.",
    "requirementsTitle": "Requisitos e desenho",
    "requirementsText": "Informe interfaces, espaço de instalação e condições de operação.",
    "sampleTitle": "Configuração e amostra",
    "sampleText": "Combine a configuração e os requisitos de avaliação das amostras.",
    "productionTitle": "Produção e inspeção",
    "productionText": "Confirme revisão do desenho, materiais e inspeções.",
    "deliveryTitle": "Embalagem e entrega",
    "deliveryText": "Combine quantidades, etiquetas, embalagem e entrega.",
    "productTitle": "Analise este cabo para seu projeto",
    "productIntro": "Informe quantidade, equipamentos e data de chegada para analisar configuração e fornecimento.",
    "startHint": "Comece com um modelo, equipamento, foto do conector ou desenho. Os detalhes pendentes podem ser confirmados na análise.",
    "arrivalDate": "Data de chegada desejada",
    "messageHint": "Informe o que precisa conectar, o comprimento e o local de uso.",
    "quoteHint": "Modelo e quantidade ajudam a analisar a configuração e o fornecimento.",
    "customHint": "Informe os dois conectores, comprimento e requisitos de desenho ou fiação.",
    "supportHint": "Descreva equipamentos, interfaces e o problema de instalação ou operação.",
    "receivedNext": "Analisaremos a configuração e os dados de contato e entraremos em contato para esclarecer os requisitos do projeto."
  },
  "ar": {
    "title": "ابدأ بمشروعك",
    "intro": "اختر المعلومات المتوفرة لديك.",
    "modelTitle": "لدي رقم طراز",
    "modelText": "ابحث عن الكابل وأضف رقم الطراز إلى استفسارك.",
    "modelAction": "ابحث عن الكابل",
    "reviewTitle": "مراجعة التكوين",
    "reviewText": "حدد المعدات والواجهات وظروف التشغيل.",
    "reviewAction": "راجع تكويني",
    "customTitle": "أحتاج إلى تجميع مخصص",
    "customText": "أرسل تفاصيل الموصلات والطول أو الرسم للمراجعة.",
    "customAction": "أرسل المواصفات",
    "processTitle": "من المتطلبات إلى التوريد",
    "processIntro": "أكد التكوين ومتطلبات المشروع في كل مرحلة.",
    "requirementsTitle": "المتطلبات والرسم",
    "requirementsText": "حدد الواجهات ومساحة التركيب وظروف التشغيل.",
    "sampleTitle": "التكوين والعينة",
    "sampleText": "اتفق على التكوين ومتطلبات تقييم العينات.",
    "productionTitle": "الإنتاج والفحص",
    "productionText": "أكد إصدار الرسم والمواد ومتطلبات الفحص.",
    "deliveryTitle": "التغليف والتسليم",
    "deliveryText": "اتفق على الكميات والملصقات والتغليف وترتيبات التسليم.",
    "productTitle": "راجع هذا الكابل لمشروعك",
    "productIntro": "حدد الكمية والمعدات وتاريخ الوصول المطلوب لمراجعة التكوين ومتطلبات التوريد.",
    "startHint": "ابدأ بالطراز أو اسم المعدات أو صورة الموصل أو الرسم. يمكن تأكيد التفاصيل الناقصة أثناء المراجعة.",
    "arrivalDate": "تاريخ الوصول المطلوب",
    "messageHint": "حدد ما تريد توصيله والطول ومكان الاستخدام.",
    "quoteHint": "يساعد الطراز والكمية في مراجعة التكوين ومتطلبات التوريد.",
    "customHint": "حدد كلا الموصلين والطول ومتطلبات الرسم أو التوصيلات.",
    "supportHint": "صف المعدات والواجهات ومشكلة التركيب أو التشغيل.",
    "receivedNext": "سنراجع التكوين وبيانات الاتصال ثم نتواصل لتوضيح متطلبات المشروع."
  }
});
