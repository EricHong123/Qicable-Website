import { expandLocales } from "./locale-runtime";
import type { Locale } from "./i18n";

// Company and business content follows the Farsince source map in plans/.
// Kept separate from client-side interface messages so editorial text stays on the server.
type CompanyContent = {
  heading: string;
  sections: { title: string; text: string }[];
  faqTitle: string;
  faq: { question: string; answer: string }[];
  hours: string;
};
export const companyContent: Record<Locale, CompanyContent> = expandLocales({
  en: {
    heading: "How we work",
    sections: [
      {
        title: "Engineering collaboration",
        text: "Start with the application, connector configuration and installation constraints. Technical communication helps define the assembly before a sample or production order.",
      },
      {
        title: "Documented specifications",
        text: "Drawings, pin assignments and specification revisions provide a common reference for the project. Changes are reviewed against the agreed configuration.",
      },
      {
        title: "Production & delivery",
        text: "Assembly, inspection, packaging and identification are coordinated around the order. Discuss labels, barcodes and packaging requirements as part of the quotation.",
      },
    ],
    faqTitle: "Ordering, delivery & after-sales",
    faq: [
      {
        question: "What information is needed for a quotation?",
        answer:
          "Include the model or drawing, connectors, cable length, pinout, quantity, testing requirements and destination. Packaging and delivery requirements also help define the quotation.",
      },
      {
        question: "Which payment and delivery terms are available?",
        answer:
          "Farsince lists T/T, L/C and O/A payment options and EXW, FOB, CIF, DAP and DDP delivery arrangements. The terms applicable to your order are specified in the quotation.",
      },
      {
        question: "Can you supply custom packaging and labels?",
        answer:
          "Neutral or branded packaging, barcode labels and batch identification can be discussed for the project. Share your packaging and labeling specifications with the inquiry.",
      },
      {
        question: "What should I do if there is an issue with an order?",
        answer:
          "Contact sales@qicable.com with the order or batch reference, a description of the issue and relevant photographs. The team reviews the case and discusses the appropriate resolution. Warranty conditions depend on the product and order.",
      },
    ],
    hours: "Monday–Friday, 09:00–18:00 (GMT+8)",
  },
  de: {
    heading: "So arbeiten wir",
    sections: [
      {
        title: "Technische Zusammenarbeit",
        text: "Anwendung, Steckerkonfiguration und Einbaubedingungen bilden den Ausgangspunkt. Die technische Abstimmung definiert die Konfektion vor einem Muster- oder Produktionsauftrag.",
      },
      {
        title: "Dokumentierte Spezifikationen",
        text: "Zeichnungen, Pinbelegungen und Spezifikationsstände bilden die gemeinsame Projektgrundlage. Änderungen werden anhand der vereinbarten Konfiguration geprüft.",
      },
      {
        title: "Fertigung & Lieferung",
        text: "Montage, Prüfung, Verpackung und Kennzeichnung werden auf den Auftrag abgestimmt. Besprechen Sie Etiketten, Barcodes und Verpackungsanforderungen bei der Angebotserstellung.",
      },
    ],
    faqTitle: "Bestellung, Lieferung & Service",
    faq: [
      {
        question: "Welche Angaben werden für ein Angebot benötigt?",
        answer:
          "Nennen Sie Modell oder Zeichnung, Stecker, Kabellänge, Pinbelegung, Menge, Prüfanforderungen und Bestimmungsort. Angaben zu Verpackung und Lieferung helfen ebenfalls.",
      },
      {
        question: "Welche Zahlungs- und Lieferbedingungen sind möglich?",
        answer:
          "Farsince nennt T/T, L/C und O/A als Zahlungsoptionen sowie EXW, FOB, CIF, DAP und DDP als Lieferbedingungen. Die für Ihren Auftrag geltenden Bedingungen stehen im Angebot.",
      },
      {
        question: "Sind individuelle Verpackungen und Etiketten möglich?",
        answer:
          "Neutrale oder kundenspezifische Verpackungen, Barcode-Etiketten und Chargenkennzeichnung können projektbezogen vereinbart werden. Senden Sie die Anforderungen mit Ihrer Anfrage.",
      },
      {
        question: "Was ist bei einem Problem mit einer Bestellung zu tun?",
        answer:
          "Kontaktieren Sie sales@qicable.com mit Auftrags- oder Chargennummer, Fehlerbeschreibung und geeigneten Fotos. Das Team prüft den Fall und bespricht eine Lösung. Garantiebedingungen hängen vom Produkt und Auftrag ab.",
      },
    ],
    hours: "Montag–Freitag, 09:00–18:00 Uhr (GMT+8)",
  },
  es: {
    heading: "Cómo trabajamos",
    sections: [
      {
        title: "Colaboración técnica",
        text: "Partimos de la aplicación, los conectores y las limitaciones de instalación. La comunicación técnica permite definir el conjunto antes de solicitar muestras o producción.",
      },
      {
        title: "Especificaciones documentadas",
        text: "Planos, asignaciones de pines y revisiones de especificaciones forman la referencia común del proyecto. Los cambios se revisan respecto a la configuración acordada.",
      },
      {
        title: "Producción y entrega",
        text: "Montaje, inspección, embalaje e identificación se coordinan según el pedido. Incluya etiquetas, códigos de barras y requisitos de embalaje en la solicitud de presupuesto.",
      },
    ],
    faqTitle: "Pedidos, entrega y posventa",
    faq: [
      {
        question: "¿Qué información se necesita para un presupuesto?",
        answer:
          "Incluya modelo o plano, conectores, longitud, asignación de pines, cantidad, ensayos requeridos y destino. También son útiles los requisitos de embalaje y entrega.",
      },
      {
        question: "¿Qué condiciones de pago y entrega están disponibles?",
        answer:
          "Farsince indica opciones de pago T/T, L/C y O/A y condiciones de entrega EXW, FOB, CIF, DAP y DDP. Las condiciones aplicables a cada pedido se especifican en el presupuesto.",
      },
      {
        question: "¿Se puede personalizar el embalaje y el etiquetado?",
        answer:
          "Pueden acordarse embalajes neutros o de marca, etiquetas con códigos de barras e identificación de lotes. Envíe sus especificaciones con la consulta.",
      },
      {
        question: "¿Qué debo hacer si hay un problema con un pedido?",
        answer:
          "Contacte con sales@qicable.com e indique el pedido o lote, una descripción y fotografías del problema. El equipo revisará el caso y propondrá los siguientes pasos. La garantía depende del producto y del pedido.",
      },
    ],
    hours: "Lunes–viernes, 09:00–18:00 (GMT+8)",
  },
  fr: {
    heading: "Notre méthode de travail",
    sections: [
      {
        title: "Collaboration technique",
        text: "L’application, les connecteurs et les contraintes d’installation définissent le point de départ. Le dialogue technique précise l’assemblage avant une demande d’échantillon ou de production.",
      },
      {
        title: "Spécifications documentées",
        text: "Plans, brochages et révisions des spécifications constituent la référence du projet. Les modifications sont examinées par rapport à la configuration convenue.",
      },
      {
        title: "Production et livraison",
        text: "Assemblage, contrôle, emballage et identification sont coordonnés selon la commande. Précisez les étiquettes, codes-barres et emballages souhaités lors du devis.",
      },
    ],
    faqTitle: "Commande, livraison et après-vente",
    faq: [
      {
        question: "Quelles informations fournir pour un devis ?",
        answer:
          "Indiquez le modèle ou le plan, les connecteurs, la longueur, le brochage, la quantité, les essais requis et la destination. Les exigences d’emballage et de livraison sont également utiles.",
      },
      {
        question: "Quelles sont les modalités de paiement et de livraison ?",
        answer:
          "Farsince mentionne les paiements T/T, L/C et O/A ainsi que les conditions EXW, FOB, CIF, DAP et DDP. Les modalités de votre commande sont précisées dans le devis.",
      },
      {
        question: "Peut-on personnaliser l’emballage et les étiquettes ?",
        answer:
          "Emballages neutres ou de marque, étiquettes à codes-barres et identification des lots peuvent être étudiés. Joignez vos spécifications à la demande.",
      },
      {
        question: "Que faire en cas de problème avec une commande ?",
        answer:
          "Contactez sales@qicable.com avec la référence de commande ou de lot, une description et des photos du problème. L’équipe examinera le dossier et discutera de la solution. La garantie dépend du produit et de la commande.",
      },
    ],
    hours: "Lundi–vendredi, 09:00–18:00 (GMT+8)",
  },
  pt: {
    heading: "Como trabalhamos",
    sections: [
      {
        title: "Colaboração técnica",
        text: "A aplicação, os conectores e as limitações de instalação são o ponto de partida. A comunicação técnica permite definir o conjunto antes de uma amostra ou encomenda de produção.",
      },
      {
        title: "Especificações documentadas",
        text: "Desenhos, pinagens e revisões das especificações constituem a referência comum do projeto. As alterações são analisadas com base na configuração acordada.",
      },
      {
        title: "Produção e entrega",
        text: "Montagem, inspeção, embalagem e identificação são coordenadas em função da encomenda. Inclua etiquetas, códigos de barras e requisitos de embalagem no pedido de orçamento.",
      },
    ],
    faqTitle: "Encomendas, entrega e pós-venda",
    faq: [
      {
        question: "Que informações são necessárias para um orçamento?",
        answer:
          "Indique modelo ou desenho, conectores, comprimento, pinagem, quantidade, ensaios necessários e destino. Os requisitos de embalagem e entrega também ajudam a definir o orçamento.",
      },
      {
        question: "Quais são as condições de pagamento e entrega?",
        answer:
          "A Farsince indica opções de pagamento T/T, L/C e O/A e condições de entrega EXW, FOB, CIF, DAP e DDP. As condições da sua encomenda constam do orçamento.",
      },
      {
        question: "É possível personalizar embalagens e etiquetas?",
        answer:
          "Podem ser acordadas embalagens neutras ou de marca, etiquetas com códigos de barras e identificação de lotes. Envie as especificações com o pedido.",
      },
      {
        question: "O que fazer se houver um problema com uma encomenda?",
        answer:
          "Contacte sales@qicable.com com a referência da encomenda ou lote, uma descrição e fotografias do problema. A equipa analisará o caso e discutirá a solução. A garantia depende do produto e da encomenda.",
      },
    ],
    hours: "Segunda–sexta, 09:00–18:00 (GMT+8)",
  },
  ar: {
    heading: "كيف نعمل",
    sections: [
      {
        title: "التعاون الهندسي",
        text: "نبدأ بالتطبيق وتكوين الموصلات وقيود التركيب. يساعد التواصل الفني في تحديد التجميعة قبل طلب العينة أو بدء الإنتاج.",
      },
      {
        title: "مواصفات موثقة",
        text: "تشكل الرسومات وتوزيع الأطراف وإصدارات المواصفات مرجعًا مشتركًا للمشروع. تُراجع التغييرات مقارنة بالتكوين المتفق عليه.",
      },
      {
        title: "الإنتاج والتسليم",
        text: "تُنسق عمليات التجميع والفحص والتغليف والتعريف وفق الطلب. ناقش الملصقات والرموز الشريطية ومتطلبات التغليف عند طلب عرض السعر.",
      },
    ],
    faqTitle: "الطلبات والتسليم وخدمة ما بعد البيع",
    faq: [
      {
        question: "ما المعلومات اللازمة لعرض السعر؟",
        answer:
          "أرسل الموديل أو الرسم والموصلات والطول وتوزيع الأطراف والكمية ومتطلبات الاختبار والوجهة. تساعد متطلبات التغليف والتسليم أيضًا في إعداد العرض.",
      },
      {
        question: "ما شروط الدفع والتسليم المتاحة؟",
        answer:
          "تذكر Farsince خيارات الدفع T/T وL/C وO/A وترتيبات التسليم EXW وFOB وCIF وDAP وDDP. تُحدد الشروط المطبقة على طلبك في عرض السعر.",
      },
      {
        question: "هل يمكن تخصيص التغليف والملصقات؟",
        answer:
          "يمكن مناقشة التغليف المحايد أو المطبوع بعلامتك والملصقات ذات الرموز الشريطية وتعريف الدفعات. أرسل المواصفات المطلوبة مع الاستفسار.",
      },
      {
        question: "ماذا أفعل عند وجود مشكلة في الطلب؟",
        answer:
          "تواصل عبر sales@qicable.com وأرفق مرجع الطلب أو الدفعة ووصف المشكلة وصورًا مناسبة. يراجع الفريق الحالة ويناقش الحل. تختلف شروط الضمان حسب المنتج والطلب.",
      },
    ],
    hours: "الاثنين–الجمعة، 09:00–18:00 (GMT+8)",
  },
});
