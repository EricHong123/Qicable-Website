import { expandLocales } from "./locale-runtime";
import type { Locale } from "./i18n";
import { newGuideContent } from "./geo-guide-content";
import { guideQuestions } from "./geo-guide-questions";

export type GuideContent = {
  lead: string;
  sections: readonly { title: string; body: string }[];
  mistakes: readonly string[];
  prepare: readonly string[];
  questions?: readonly { question: string; answer: string }[];
};
type SixGuides = readonly [
  GuideContent,
  GuideContent,
  GuideContent,
  GuideContent,
  GuideContent,
  GuideContent,
];

export const guideLabels: Record<
  Locale,
  {
    steps: string;
    mistakes: string;
    prepare: string;
    references: string;
    note: string;
  }
> = expandLocales({
  en: {
    steps: "Selection steps",
    mistakes: "Common mistakes",
    prepare: "What to include in your inquiry",
    references: "Technical references",
    note: "Use this checklist to prepare a specification. Confirm the final assembly against your equipment documentation and the agreed drawing.",
  },
  de: {
    steps: "Auswahlschritte",
    mistakes: "Häufige Fehler",
    prepare: "Unterlagen für Ihre Anfrage",
    references: "Technische Quellen",
    note: "Diese Checkliste hilft bei der Spezifikation. Prüfen Sie die endgültige Ausführung anhand Ihrer Gerätedokumentation und der freigegebenen Zeichnung.",
  },
  es: {
    steps: "Pasos de selección",
    mistakes: "Errores frecuentes",
    prepare: "Qué incluir en su consulta",
    references: "Referencias técnicas",
    note: "Use esta lista para preparar la especificación. Confirme el conjunto final con la documentación del equipo y el plano acordado.",
  },
  fr: {
    steps: "Étapes de sélection",
    mistakes: "Erreurs fréquentes",
    prepare: "Éléments à joindre à votre demande",
    references: "Références techniques",
    note: "Cette liste aide à préparer une spécification. Vérifiez l’assemblage final avec la documentation de l’équipement et le plan approuvé.",
  },
  pt: {
    steps: "Etapas de seleção",
    mistakes: "Erros comuns",
    prepare: "O que incluir na consulta",
    references: "Referências técnicas",
    note: "Use esta lista para preparar a especificação. Confirme o conjunto final com a documentação do equipamento e o desenho acordado.",
  },
  ar: {
    steps: "خطوات الاختيار",
    mistakes: "أخطاء شائعة",
    prepare: "ما يجب إرفاقه بالاستفسار",
    references: "مراجع تقنية",
    note: "استخدم هذه القائمة لإعداد المواصفات، ثم تحقق من التجميعة النهائية وفق وثائق المعدات والرسم المتفق عليه.",
  },
});

export const guideReferences = [
  [
    {
      title: "Basler · USB 3.0 cable documentation",
      url: "https://docs.baslerweb.com/basler-cable-usb3-microb-sl-a-p",
    },
    { title: "NI · Camera Link Getting Started Guide", url: "https://www.ni.com/en/support/documentation/supplemental/19/camera-link-getting-started-guide.html" },
    { title: "Basler · CoaXPress equipment and cable requirements", url: "https://docs.baslerweb.com/a2a2448-120cm" },
  ],
  [
    {
      title: "Phoenix Contact · M12 Ethernet connectors",
      url: "https://www.phoenixcontact.com/en-ie/cat/m12-ethernet-connectors-1592",
    },
    { title: "Molex · M12 coding and contact configurations", url: "https://www.molex.com/en-us/products/cable-assemblies/industrial-cable-assemblies/m12-cables" },
  ],
  [
    {
      title: "igus · Robotic cable flexibility",
      url: "https://toolbox.igus.com/motion-plastics-blog/robotic-cable-failures-part-1-what-s-flexibility-got-to-do-with-it/",
    },
  ],
  [
    {
      title: "Phoenix Contact · Rear-mount connector documentation",
      url: "https://www.phoenixcontact.com/en-de/products/device-connector-rear-mounting-sacc-dsi-msd-4con-m12-sco-sh-1552984",
    },
    { title: "DataPro · USB-C panel-mount drawing example", url: "https://www.datapro.net/products/usb-c-panel-mount-extension-cable.html" },
  ],
  [
    {
      title: "Texas Instruments · RS-485 basics",
      url: "https://www.ti.com/document-viewer/lit/html/SSZTCS4",
    },
    {
      title: "FTDI · USB TTL serial cables",
      url: "https://ftdichip.com/product-category/products/cables/usb-ttl-serial-cable-series/",
    },
  ],
  [
    {
      title: "Beckhoff · Ethernet shielding",
      url: "https://infosys.beckhoff.com/content/1033/ethernetcabling/1952414987.html",
    },
    {
      title: "Beckhoff · Analog equipment, shielding and earth",
      url: "https://infosys.beckhoff.com/content/1033/ioanalogmanual/2346576779.html",
    },
  ],
  [
    { title: "Basler · USB 3.0 transmission options", url: "https://www.baslerweb.com/en-us/learning/data-transmission-usb-3-0/" },
    { title: "Basler · USB cable specification example", url: "https://docs.baslerweb.com/basler-cable-usb3-microb-sl-a-p" },
  ],
  [{ title: "Basler · Network-related parameters", url: "https://docs.baslerweb.com/network-related-parameters" }],
  [
    { title: "Qicable · Custom cable assembly review", url: "https://www.qicable.com/custom-cable-assemblies/" },
    { title: "Qicable · Purchasing and after-sales", url: "https://www.qicable.com/purchasing/" },
  ],
  [
    { title: "Texas Instruments · The RS-485 Design Guide", url: "https://www.ti.com/lit/an/slla272d/slla272d.pdf" },
    { title: "FTDI · USB-RS485 cable documentation", url: "https://ftdichip.com/wp-content/uploads/2023/07/DS_USB_RS485_CABLES.pdf" },
  ],
] as const;

const baseGuideContent: Record<Locale, SixGuides> = expandLocales({
  en: [
    {
      lead: "Start a machine vision cable inquiry with the camera, host and installation route. A familiar connector shape is only one part of a reliable imaging connection.",
      sections: [
        {
          title: "Identify both ends of the link",
          body: "Record the camera and host model, interface and mating connector. Include the locking arrangement and cable exit direction. Separate image data, power and trigger connections in your drawing so each has an explicit requirement.",
        },
        {
          title: "Describe the route and movement",
          body: "Measure the installed route, including service loops and access to fasteners. Identify fixed sections, moving carriers and twisting joints. An interface label alone does not establish motion suitability; check the individual cable specification.",
        },
        {
          title: "Define a sample acceptance check",
          body: "Agree how to check mechanical fit and image acquisition on the intended equipment. Record acquisition settings, operating duration and any motion sequence. Keep that setup with the approved drawing for repeat orders.",
        },
      ],
      mistakes: [
        "Choosing a right-angle connector without checking which direction it exits.",
        "Treating a short bench test as acceptance for the full installed route.",
      ],
      prepare: [
        "Camera and host model or port documentation",
        "Connector views, locking details and required length",
        "Route sketch and movement description",
        "Sample quantity and intended acquisition test",
      ],
    },
    {
      lead: "Specify an M12 assembly by coding, contacts and wiring, then confirm its mechanical installation. The M12 name by itself is not a complete purchasing specification.",
      sections: [
        {
          title: "Read the device port designation",
          body: "Copy the full connector designation from the device manual. D and X coding appear in M12 Ethernet products; do not select a replacement from the thread size alone. Confirm the coding required at both ends.",
        },
        {
          title: "Make the pin map unambiguous",
          body: "List contact count, male or female contacts and each pin-to-pin connection. Label whether drawings show the mating face or wiring side. Record shield continuity separately from signal pins and obtain confirmation of any unused contacts.",
        },
        {
          title: "Check the assembled connection",
          body: "Confirm straight or angled bodies, access for tightening, cable exit and mating part. Request the electrical and environmental requirements for the complete assembly. A compatible mechanical coding is not evidence of a tested performance rating.",
        },
      ],
      mistakes: [
        "Ordering only by pin count while omitting coding.",
        "Mirroring a pin map because the drawing view was not identified.",
      ],
      prepare: [
        "Device port designation and mating part number",
        "Coding, contact count and connector orientation",
        "Approved pin map with view direction",
        "Length, installation environment and sample requirement",
      ],
    },
    {
      lead: "Separate fixed installation, repeated bending and torsion before selecting a cable. Describing the actual movement is more useful than asking for a cable that is simply flexible.",
      sections: [
        {
          title: "Classify the movement",
          body: "Mark where the cable stays fixed, bends in a carrier or twists around an axis. Continuous bending and torsion are different loading conditions. If both occur, show their positions and whether they happen simultaneously.",
        },
        {
          title: "Record the installation envelope",
          body: "Provide the available bend radius, travel, speed, acceleration and cycle schedule. Add carrier layout, clamping points and exposure to oil or heat. Identify where movement starts relative to the connector and strain relief.",
        },
        {
          title: "Agree a relevant validation",
          body: "Ask for a cable construction and test proposal that matches this installation. Define the signal checks and inspection intervals for the sample. Compare any cycle-life statement with its stated test conditions before using it in a purchasing specification.",
        },
      ],
      mistakes: [
        "Assuming a soft jacket means the cable is suitable for repeated motion.",
        "Applying a published cycle count to a different bend radius or movement.",
      ],
      prepare: [
        "Movement sketch or short motion recording",
        "Bend radius, travel, speed and cycle schedule",
        "Carrier, clamping and environmental details",
        "Signal requirements and sample test conditions",
      ],
    },
    {
      lead: "A panel cable must fit the enclosure and the mating plug on both sides. Use a dimensioned installation drawing before releasing a panel cutout or cable order.",
      sections: [
        {
          title: "Define the mounting interface",
          body: "Specify front or rear installation, panel thickness and cutout geometry. Include hole spacing, fastener size and any anti-rotation feature. Identify the drawing revision and the face from which dimensions are measured.",
        },
        {
          title: "Reserve space behind the panel",
          body: "Show the connector body, cable exit and space needed to connect or remove the mating plug. Include nearby boards and enclosure walls. Check the available cable bend path after the panel is installed.",
        },
        {
          title: "Review sealing and service access",
          body: "Identify the gasket location, mating connector and installation instructions. Mechanical fit alone does not verify ingress protection. Agree the required assembled condition and inspection method, then approve a sample in the intended panel.",
        },
      ],
      mistakes: [
        "Checking the front flange while overlooking the rear connector depth.",
        "Using a cutout drawing without its tolerances or revision.",
      ],
      prepare: [
        "Panel drawing, thickness and material",
        "Cutout, fastening and anti-rotation details",
        "Front and rear clearance views",
        "Mating plug, seal requirements and cable exit direction",
      ],
    },
    {
      lead: "Before ordering a serial cable or converter, identify the electrical interface at each end. RS-232, RS-485 and TTL-level UART connections are not interchangeable just because the plugs fit.",
      sections: [
        {
          title: "Separate signaling from connector shape",
          body: "RS-232 is single-ended; RS-485 uses differential signaling. TTL-level UART needs its specified logic level. Record the device interface, pin labels and signal voltage requirements before deciding whether an active converter is needed.",
        },
        {
          title: "Document the complete connection",
          body: "Confirm transmit and receive assignments, reference connections and any handshake signals. For RS-485, record the device topology and termination requirements from its manual. Include isolation requirements and the power source for any converter.",
        },
        {
          title: "Check host software with a sample",
          body: "If USB conversion is involved, identify the host operating system and required driver. Agree baud rate, framing and a representative communication test. Keep a known-good wiring diagram with the verified hardware and software configuration.",
        },
      ],
      mistakes: [
        "Using a passive pin adapter where electrical level conversion is required.",
        "Assuming a DB9 connector establishes the pinout or serial standard.",
      ],
      prepare: [
        "Device manuals and interface designation at both ends",
        "Pin map, logic level and handshake requirements",
        "Host operating system and converter power requirements",
        "Communication settings, topology and sample test",
      ],
    },
    {
      lead: "Plan shielding together with the equipment grounding design and cable route. A shielded cable label alone does not describe how the completed installation will handle interference.",
      sections: [
        {
          title: "Map the interference environment",
          body: "Mark drives, motors and switching power equipment near the signal route. Show cabinet entries, parallel runs and grounding points. Record when the fault occurs so the sample test can reproduce the relevant operating conditions.",
        },
        {
          title: "Specify the shield termination",
          body: "Follow the equipment’s EMC guidance for shield bonding and connector termination. Do not apply one universal rule about connecting one or both ends. Document the contact method and keep protective earthing requirements separate from functional shielding.",
        },
        {
          title: "Verify the whole installation",
          body: "Agree checks for the assembly’s specified shield connections and signal operation in the machine. Record routing and grounding changes during troubleshooting. Have the responsible electrical engineer approve the final arrangement before repeating it across equipment.",
        },
      ],
      mistakes: [
        "Changing shield termination without checking the equipment grounding scheme.",
        "Testing communication only while nearby drives are switched off.",
      ],
      prepare: [
        "System grounding and shield termination diagram",
        "Cable route and nearby interference sources",
        "Connector, enclosure entry and shield contact details",
        "Observed fault conditions and acceptance test plan",
      ],
    },
  ],
  de: [
    {
      lead: "Beginnen Sie die Anfrage für Bildverarbeitungskabel mit Kamera, Host und Verlegeweg. Die Steckerform allein beschreibt noch keine zuverlässige Bilddatenverbindung.",
      sections: [
        {
          title: "Beide Anschlussseiten bestimmen",
          body: "Notieren Sie Kamera- und Hostmodell, Schnittstelle und Gegenstecker. Ergänzen Sie Verriegelung und Kabelabgang. Trennen Sie Bilddaten, Versorgung und Trigger in der Zeichnung, damit jede Verbindung eindeutig spezifiziert ist.",
        },
        {
          title: "Verlegeweg und Bewegung beschreiben",
          body: "Messen Sie den eingebauten Verlauf einschließlich Reserveschlaufen und Schraubzugang. Kennzeichnen Sie feste Abschnitte, Energieketten und verdrehte Bereiche. Die Schnittstellenbezeichnung belegt keine Bewegungseignung; maßgeblich ist die jeweilige Kabelspezifikation.",
        },
        {
          title: "Musterprüfung vereinbaren",
          body: "Legen Sie die Prüfung von Einbau und Bildaufnahme an der vorgesehenen Anlage fest. Dokumentieren Sie Aufnahmeparameter, Betriebsdauer und Bewegungsablauf. Bewahren Sie diesen Prüfaufbau zusammen mit der freigegebenen Zeichnung für Folgeaufträge auf.",
        },
      ],
      mistakes: [
        "Einen Winkelstecker ohne Prüfung der Abgangsrichtung auswählen.",
        "Einen kurzen Tischtest als Nachweis für den vollständigen Einbau verwenden.",
      ],
      prepare: [
        "Kamera- und Hostmodell oder Anschlussdokumentation",
        "Steckeransichten, Verriegelung und benötigte Länge",
        "Verlegeskizze und Bewegungsbeschreibung",
        "Mustermenge und geplanter Bildaufnahmetest",
      ],
    },
    {
      lead: "Spezifizieren Sie eine M12-Konfektion nach Codierung, Kontakten und Verdrahtung. Erst anschließend wird der mechanische Einbau geprüft. Die Bezeichnung M12 allein reicht für eine Bestellung nicht aus.",
      sections: [
        {
          title: "Geräteanschluss vollständig erfassen",
          body: "Übernehmen Sie die vollständige Anschlussbezeichnung aus dem Gerätehandbuch. D- und X-Codierung kommen bei M12-Ethernet-Produkten vor. Wählen Sie den Ersatz nicht allein nach Gewindegröße, sondern prüfen Sie die Codierung beider Enden.",
        },
        {
          title: "Pinbelegung eindeutig darstellen",
          body: "Notieren Sie Kontaktzahl, Stift- oder Buchsenkontakte und jede Pinverbindung. Kennzeichnen Sie Steck- oder Verdrahtungsansicht. Führen Sie die Schirmverbindung getrennt von Signalpins auf und lassen Sie unbenutzte Kontakte bestätigen.",
        },
        {
          title: "Kompletten Anschluss prüfen",
          body: "Prüfen Sie gerade oder gewinkelte Bauform, Schraubzugang, Kabelabgang und Gegenstück. Vereinbaren Sie elektrische und umgebungsbezogene Anforderungen für die gesamte Konfektion. Eine passende Codierung ist noch kein geprüfter Leistungsnachweis.",
        },
      ],
      mistakes: [
        "Nur die Polzahl bestellen und die Codierung weglassen.",
        "Eine Pinbelegung durch eine unklare Ansichtsrichtung spiegeln.",
      ],
      prepare: [
        "Anschlussbezeichnung und Teilenummer des Gegenstücks",
        "Codierung, Kontaktzahl und Steckerausrichtung",
        "Freigegebene Pinbelegung mit Ansichtsrichtung",
        "Länge, Einsatzumgebung und Musterbedarf",
      ],
    },
    {
      lead: "Unterscheiden Sie feste Verlegung, wiederholte Biegung und Torsion vor der Kabelauswahl. Der tatsächliche Bewegungsablauf ist aussagekräftiger als die pauschale Forderung nach Flexibilität.",
      sections: [
        {
          title: "Bewegungsart einordnen",
          body: "Markieren Sie feste Bereiche, Biegung in der Energiekette und Verdrehung um eine Achse. Dauerbiegung und Torsion sind unterschiedliche Belastungen. Zeigen Sie bei Kombinationen, wo und ob beide gleichzeitig auftreten.",
        },
        {
          title: "Einbaubedingungen erfassen",
          body: "Nennen Sie verfügbaren Biegeradius, Verfahrweg, Geschwindigkeit, Beschleunigung und Zyklenplan. Ergänzen Sie Kettenführung, Befestigung und Öl- oder Wärmebelastung. Zeigen Sie den Bewegungsbeginn relativ zu Stecker und Zugentlastung.",
        },
        {
          title: "Passende Erprobung vereinbaren",
          body: "Fragen Sie nach einem Kabelaufbau und Prüfplan für diese Anwendung. Definieren Sie Signalprüfungen und Inspektionsintervalle am Muster. Vergleichen Sie genannte Lebensdauerwerte mit deren Prüfbedingungen, bevor Sie diese in die Einkaufsspezifikation übernehmen.",
        },
      ],
      mistakes: [
        "Einen weichen Mantel mit Dauerbewegungseignung gleichsetzen.",
        "Zyklenzahlen auf andere Radien oder Bewegungen übertragen.",
      ],
      prepare: [
        "Bewegungsskizze oder kurze Videoaufnahme",
        "Biegeradius, Weg, Geschwindigkeit und Zyklenplan",
        "Kettenführung, Befestigung und Umgebung",
        "Signalanforderungen und Musterprüfbedingungen",
      ],
    },
    {
      lead: "Ein Einbaukabel muss zum Gehäuse und zu den Gegensteckern auf beiden Seiten passen. Geben Sie Ausschnitt und Kabel erst anhand einer bemaßten Einbauzeichnung frei.",
      sections: [
        {
          title: "Befestigungsschnittstelle definieren",
          body: "Legen Sie Front- oder Rückwandmontage, Plattenstärke und Ausschnitt fest. Ergänzen Sie Lochabstand, Befestigung und Verdrehsicherung. Kennzeichnen Sie Zeichnungsrevision und Bezugsfläche der Maße.",
        },
        {
          title: "Platz hinter der Wand reservieren",
          body: "Zeigen Sie Steckerkörper, Kabelabgang und den Raum zum Stecken oder Lösen. Berücksichtigen Sie benachbarte Leiterplatten und Gehäusewände. Prüfen Sie den verfügbaren Biegeverlauf im eingebauten Zustand.",
        },
        {
          title: "Dichtung und Wartungszugang prüfen",
          body: "Definieren Sie Dichtungsposition, Gegenstecker und Montagevorgaben. Mechanische Passung allein belegt keinen IP-Schutz. Vereinbaren Sie den vollständigen Montagezustand und die Prüfung; bemustern Sie anschließend die vorgesehene Platte.",
        },
      ],
      mistakes: [
        "Nur den Frontflansch und nicht die rückseitige Tiefe prüfen.",
        "Eine Ausschnittzeichnung ohne Toleranzen oder Revisionsstand verwenden.",
      ],
      prepare: [
        "Plattenzeichnung, Stärke und Material",
        "Ausschnitt, Befestigung und Verdrehsicherung",
        "Freiraumansichten vorn und hinten",
        "Gegenstecker, Dichtungsanforderungen und Kabelabgang",
      ],
    },
    {
      lead: "Bestimmen Sie vor der Bestellung eines seriellen Kabels oder Wandlers die elektrische Schnittstelle beider Geräte. Passende Stecker machen RS-232, RS-485 und TTL-UART nicht austauschbar.",
      sections: [
        {
          title: "Signalstandard und Stecker trennen",
          body: "RS-232 arbeitet massebezogen, RS-485 differenziell. TTL-UART benötigt den vorgegebenen Logikpegel. Erfassen Sie Schnittstelle, Pinbezeichnungen und Signalspannungsanforderungen, bevor Sie entscheiden, ob ein aktiver Wandler erforderlich ist.",
        },
        {
          title: "Gesamte Verbindung dokumentieren",
          body: "Prüfen Sie Sende- und Empfangszuordnung, Referenzverbindungen und Handshake-Signale. Erfassen Sie bei RS-485 Topologie und Abschlussvorgaben aus dem Gerätehandbuch. Ergänzen Sie Isolationsbedarf und Stromversorgung eines Wandlers.",
        },
        {
          title: "Hostsoftware am Muster prüfen",
          body: "Bei USB-Wandlung sind Betriebssystem und Treiber zu bestimmen. Vereinbaren Sie Baudrate, Datenformat und einen repräsentativen Kommunikationstest. Bewahren Sie den geprüften Schaltplan zusammen mit Hardware- und Softwarekonfiguration auf.",
        },
      ],
      mistakes: [
        "Einen passiven Adapter statt notwendiger Pegelwandlung einsetzen.",
        "Aus einem DB9-Stecker auf Pinbelegung oder Signalstandard schließen.",
      ],
      prepare: [
        "Gerätehandbücher und beide Schnittstellenbezeichnungen",
        "Pinplan, Logikpegel und Handshake-Anforderungen",
        "Hostbetriebssystem und Versorgung des Wandlers",
        "Kommunikationsparameter, Topologie und Mustertest",
      ],
    },
    {
      lead: "Planen Sie Schirmung gemeinsam mit Erdungskonzept und Kabelweg. Die Bezeichnung geschirmtes Kabel erklärt noch nicht das Störverhalten der vollständigen Anlage.",
      sections: [
        {
          title: "Störumgebung erfassen",
          body: "Markieren Sie Antriebe, Motoren und Schaltnetzteile nahe dem Signalweg. Zeigen Sie Schrankeinführungen, parallele Leitungen und Erdungspunkte. Notieren Sie Fehlerbedingungen, damit die Musterprüfung den relevanten Betriebszustand nachbildet.",
        },
        {
          title: "Schirmanschluss festlegen",
          body: "Befolgen Sie die EMV-Vorgaben des Geräts für Schirmanbindung und Stecker. Verwenden Sie keine allgemeine Regel für ein- oder beidseitigen Anschluss. Dokumentieren Sie die Kontaktierung und behandeln Sie Schutzerdung getrennt von funktionaler Schirmung.",
        },
        {
          title: "Gesamten Einbau verifizieren",
          body: "Vereinbaren Sie Prüfungen der vorgesehenen Schirmverbindungen und des Signalbetriebs in der Maschine. Dokumentieren Sie Änderungen an Verlegung und Erdung bei der Fehlersuche. Lassen Sie die endgültige Ausführung vor Serienübernahme elektrotechnisch freigeben.",
        },
      ],
      mistakes: [
        "Schirmanschlüsse ohne Prüfung des Erdungskonzepts ändern.",
        "Kommunikation ausschließlich bei abgeschalteten Antrieben testen.",
      ],
      prepare: [
        "Erdungs- und Schirmanschlussplan",
        "Kabelweg und benachbarte Störquellen",
        "Stecker, Gehäuseeinführung und Schirmkontaktierung",
        "Fehlerbedingungen und Abnahmeprüfplan",
      ],
    },
  ],
  es: [
    {
      lead: "Empiece la consulta de cables de visión artificial con la cámara, el host y el recorrido de instalación. La forma del conector solo es una parte de una conexión de imagen fiable.",
      sections: [
        {
          title: "Identificar ambos extremos",
          body: "Anote el modelo de cámara y host, la interfaz y el conector correspondiente. Incluya el bloqueo y la dirección de salida. Separe datos de imagen, alimentación y disparo en el plano para definir cada conexión.",
        },
        {
          title: "Describir recorrido y movimiento",
          body: "Mida el recorrido instalado, incluidos los bucles de reserva y el acceso a tornillos. Identifique tramos fijos, cadenas portacables y zonas de torsión. La interfaz no demuestra aptitud para movimiento; revise la especificación del cable concreto.",
        },
        {
          title: "Acordar la aceptación de la muestra",
          body: "Defina cómo comprobar el montaje y la adquisición de imágenes en el equipo previsto. Registre ajustes de captura, duración y secuencia de movimiento. Conserve esa configuración junto al plano aprobado para pedidos posteriores.",
        },
      ],
      mistakes: [
        "Elegir un conector acodado sin comprobar su dirección de salida.",
        "Aceptar todo el recorrido instalado basándose en una prueba breve de sobremesa.",
      ],
      prepare: [
        "Modelos de cámara y host o documentación de puertos",
        "Vistas de conectores, bloqueo y longitud",
        "Esquema del recorrido y movimiento",
        "Cantidad de muestras y prueba de adquisición prevista",
      ],
    },
    {
      lead: "Especifique un conjunto M12 por codificación, contactos y cableado, y después confirme su montaje. El nombre M12 no basta como especificación de compra.",
      sections: [
        {
          title: "Leer la designación del puerto",
          body: "Copie la designación completa del manual del equipo. Las codificaciones D y X aparecen en productos Ethernet M12. No elija un sustituto solo por la rosca: confirme la codificación de ambos extremos.",
        },
        {
          title: "Definir un mapa de pines inequívoco",
          body: "Indique número de contactos, macho o hembra y cada conexión entre pines. Señale si el dibujo muestra la cara de acoplamiento o de cableado. Documente el blindaje aparte y confirme los contactos sin uso.",
        },
        {
          title: "Comprobar la conexión completa",
          body: "Confirme cuerpo recto o acodado, acceso de apriete, salida y pieza de acoplamiento. Solicite requisitos eléctricos y ambientales para todo el conjunto. Una codificación compatible no demuestra por sí sola prestaciones ensayadas.",
        },
      ],
      mistakes: [
        "Pedir solo por número de pines sin indicar codificación.",
        "Invertir un mapa de pines por no identificar la vista del dibujo.",
      ],
      prepare: [
        "Designación del puerto y referencia de acoplamiento",
        "Codificación, contactos y orientación",
        "Mapa de pines aprobado con dirección de vista",
        "Longitud, entorno y necesidad de muestras",
      ],
    },
    {
      lead: "Distinga instalación fija, flexión repetida y torsión antes de elegir el cable. Describir el movimiento real resulta más útil que pedir simplemente un cable flexible.",
      sections: [
        {
          title: "Clasificar el movimiento",
          body: "Marque dónde el cable permanece fijo, se dobla en una cadena o gira sobre su eje. La flexión continua y la torsión son cargas diferentes. Si se combinan, indique dónde y si ocurren simultáneamente.",
        },
        {
          title: "Registrar las condiciones de montaje",
          body: "Facilite radio disponible, recorrido, velocidad, aceleración y programa de ciclos. Añada disposición de la cadena, fijaciones y exposición a aceite o calor. Localice el inicio del movimiento respecto al conector y al alivio de tensión.",
        },
        {
          title: "Acordar una validación representativa",
          body: "Solicite una construcción y un ensayo adecuados a la instalación. Defina comprobaciones de señal e intervalos de inspección. Compare cualquier cifra de vida útil con las condiciones de ensayo antes de incluirla en la especificación de compra.",
        },
      ],
      mistakes: [
        "Suponer que una cubierta blanda implica aptitud para movimiento repetido.",
        "Aplicar una cifra de ciclos a un radio o movimiento diferente.",
      ],
      prepare: [
        "Esquema o vídeo breve del movimiento",
        "Radio, recorrido, velocidad y programa de ciclos",
        "Cadena, fijaciones y condiciones ambientales",
        "Requisitos de señal y ensayo de muestras",
      ],
    },
    {
      lead: "Un cable de panel debe encajar en la carcasa y en los conectores de ambos lados. Prepare un plano acotado antes de aprobar el recorte del panel o el pedido.",
      sections: [
        {
          title: "Definir la fijación",
          body: "Especifique montaje frontal o posterior, espesor y geometría del recorte. Incluya distancia entre taladros, tornillería y elementos antirrotación. Identifique revisión y cara de referencia de las medidas.",
        },
        {
          title: "Reservar espacio detrás del panel",
          body: "Muestre cuerpo del conector, salida del cable y espacio para conectar o retirar el enchufe. Añada placas y paredes próximas. Compruebe la trayectoria de curvatura una vez instalado el panel.",
        },
        {
          title: "Revisar sellado y mantenimiento",
          body: "Identifique junta, conector de acoplamiento e instrucciones de montaje. El ajuste mecánico no verifica por sí solo la protección contra ingreso. Acuerde el estado de montaje y la inspección; apruebe una muestra en el panel previsto.",
        },
      ],
      mistakes: [
        "Revisar la brida frontal sin considerar la profundidad posterior.",
        "Usar un plano de recorte sin tolerancias ni revisión.",
      ],
      prepare: [
        "Plano, espesor y material del panel",
        "Recorte, fijación y antirrotación",
        "Vistas de espacio libre frontal y posterior",
        "Enchufe, sellado y dirección de salida",
      ],
    },
    {
      lead: "Antes de pedir un cable o convertidor serie, identifique la interfaz eléctrica de ambos extremos. RS-232, RS-485 y UART TTL no son intercambiables aunque los enchufes encajen.",
      sections: [
        {
          title: "Separar señal y forma del conector",
          body: "RS-232 utiliza señalización referida a masa; RS-485, diferencial. UART TTL requiere su nivel lógico especificado. Registre interfaz, pines y requisitos de tensión antes de decidir si hace falta un convertidor activo.",
        },
        {
          title: "Documentar toda la conexión",
          body: "Confirme transmisión, recepción, referencias y señales de control de flujo. Para RS-485, consulte topología y terminación en el manual. Incluya requisitos de aislamiento y alimentación de cualquier convertidor.",
        },
        {
          title: "Probar el software con una muestra",
          body: "Si hay conversión USB, identifique sistema operativo y controlador. Acuerde velocidad, formato de datos y una prueba representativa. Guarde el esquema verificado junto con las configuraciones de hardware y software.",
        },
      ],
      mistakes: [
        "Usar un adaptador pasivo cuando se necesita conversión de niveles.",
        "Suponer que un DB9 determina el mapa de pines o el estándar serie.",
      ],
      prepare: [
        "Manuales e interfaces de ambos equipos",
        "Mapa de pines, nivel lógico y control de flujo",
        "Sistema operativo y alimentación del convertidor",
        "Parámetros, topología y prueba de comunicación",
      ],
    },
    {
      lead: "Planifique el blindaje junto al diseño de puesta a tierra y el recorrido. La etiqueta de cable blindado no describe el comportamiento de toda la instalación ante interferencias.",
      sections: [
        {
          title: "Localizar fuentes de interferencia",
          body: "Marque variadores, motores y fuentes conmutadas cerca de la señal. Muestre entradas de armario, recorridos paralelos y puntos de tierra. Registre cuándo aparece el fallo para reproducir las condiciones en la prueba.",
        },
        {
          title: "Especificar la terminación del blindaje",
          body: "Siga las instrucciones CEM del equipo para la conexión del blindaje y los conectores. Evite una regla universal sobre uno o ambos extremos. Documente el contacto y distinga tierra de protección y blindaje funcional.",
        },
        {
          title: "Verificar la instalación completa",
          body: "Acuerde comprobaciones del blindaje especificado y de la señal en la máquina. Registre los cambios de recorrido y tierra durante el diagnóstico. Solicite la aprobación del responsable eléctrico antes de repetir el montaje en otros equipos.",
        },
      ],
      mistakes: [
        "Cambiar el blindaje sin revisar el esquema de tierra del equipo.",
        "Probar la comunicación solo con los variadores apagados.",
      ],
      prepare: [
        "Esquema de tierra y terminación del blindaje",
        "Recorrido y fuentes de interferencia cercanas",
        "Conectores, entradas y detalles de contacto",
        "Condiciones del fallo y plan de aceptación",
      ],
    },
  ],
  fr: [
    {
      lead: "Commencez une demande de câble de vision industrielle par la caméra, l’hôte et le cheminement. La forme du connecteur ne constitue qu’un élément d’une liaison d’image fiable.",
      sections: [
        {
          title: "Identifier les deux extrémités",
          body: "Notez les modèles de caméra et d’hôte, l’interface et le connecteur associé. Précisez verrouillage et orientation de sortie. Séparez données d’image, alimentation et déclenchement sur le plan pour spécifier chaque liaison.",
        },
        {
          title: "Décrire parcours et mouvement",
          body: "Mesurez le parcours installé, avec boucles de réserve et accès aux vis. Identifiez les parties fixes, chaînes porte-câbles et torsions. L’interface seule ne prouve pas l’aptitude au mouvement ; consultez la spécification du câble concerné.",
        },
        {
          title: "Définir la réception de l’échantillon",
          body: "Convenez d’un contrôle du montage et de l’acquisition sur l’équipement prévu. Consignez paramètres d’image, durée et séquence de mouvement. Conservez ce protocole avec le plan approuvé pour les commandes suivantes.",
        },
      ],
      mistakes: [
        "Choisir un connecteur coudé sans vérifier son orientation de sortie.",
        "Valider tout le parcours installé avec un bref essai sur table.",
      ],
      prepare: [
        "Modèles de caméra et d’hôte ou documentation des ports",
        "Vues des connecteurs, verrouillage et longueur",
        "Schéma du parcours et description du mouvement",
        "Quantité d’échantillons et essai d’acquisition prévu",
      ],
    },
    {
      lead: "Définissez un assemblage M12 par son codage, ses contacts et son câblage, puis vérifiez le montage. La seule désignation M12 ne suffit pas à l’achat.",
      sections: [
        {
          title: "Relever la désignation du port",
          body: "Recopiez la désignation complète du manuel de l’appareil. Les codages D et X existent sur les produits Ethernet M12. Ne choisissez pas un remplacement uniquement par le filetage : confirmez le codage aux deux extrémités.",
        },
        {
          title: "Rendre le brochage explicite",
          body: "Indiquez le nombre de contacts, mâles ou femelles, et chaque liaison entre broches. Précisez la vue côté accouplement ou câblage. Documentez le blindage séparément des signaux et faites confirmer les contacts inutilisés.",
        },
        {
          title: "Vérifier la liaison assemblée",
          body: "Confirmez corps droit ou coudé, accès au serrage, sortie et contrepartie. Demandez les exigences électriques et environnementales pour l’ensemble. Un codage mécaniquement compatible ne constitue pas une preuve de performances testées.",
        },
      ],
      mistakes: [
        "Commander selon le nombre de broches sans préciser le codage.",
        "Inverser un brochage faute d’indiquer le sens de vue.",
      ],
      prepare: [
        "Désignation du port et référence de la contrepartie",
        "Codage, nombre de contacts et orientation",
        "Brochage approuvé avec sens de vue",
        "Longueur, environnement et besoin d’échantillons",
      ],
    },
    {
      lead: "Distinguez pose fixe, flexion répétée et torsion avant de choisir le câble. Décrire le mouvement réel est plus utile que demander simplement un câble souple.",
      sections: [
        {
          title: "Classer le mouvement",
          body: "Marquez les zones fixes, celles qui fléchissent en chaîne et celles qui tournent autour d’un axe. Flexion continue et torsion sont des sollicitations différentes. Si elles se combinent, précisez où et si elles sont simultanées.",
        },
        {
          title: "Décrire les contraintes d’installation",
          body: "Fournissez rayon disponible, course, vitesse, accélération et rythme des cycles. Ajoutez chaîne, points de fixation et exposition à l’huile ou à la chaleur. Situez le début du mouvement par rapport au connecteur et à l’anti-traction.",
        },
        {
          title: "Convenir d’une validation pertinente",
          body: "Demandez une construction et un essai adaptés à l’installation. Définissez contrôles du signal et intervalles d’inspection. Comparez toute durée de vie annoncée à ses conditions d’essai avant de l’inscrire dans la spécification d’achat.",
        },
      ],
      mistakes: [
        "Confondre gaine souple et aptitude aux mouvements répétés.",
        "Transposer un nombre de cycles à un autre rayon ou mouvement.",
      ],
      prepare: [
        "Schéma ou courte vidéo du mouvement",
        "Rayon, course, vitesse et rythme des cycles",
        "Chaîne, fixations et environnement",
        "Exigences de signal et conditions d’essai",
      ],
    },
    {
      lead: "Un câble de panneau doit convenir au boîtier et aux connecteurs des deux côtés. Utilisez un plan d’installation coté avant d’approuver la découpe ou la commande.",
      sections: [
        {
          title: "Définir l’interface de fixation",
          body: "Précisez montage avant ou arrière, épaisseur et forme de découpe. Incluez entraxe, visserie et dispositif antirotation. Identifiez la révision du plan et la face de référence des cotes.",
        },
        {
          title: "Réserver l’espace arrière",
          body: "Montrez le corps du connecteur, la sortie du câble et l’espace pour brancher ou retirer la fiche. Ajoutez cartes et parois voisines. Vérifiez la courbure disponible une fois le panneau installé.",
        },
        {
          title: "Contrôler étanchéité et maintenance",
          body: "Identifiez joint, contrepartie et consignes de montage. L’ajustement mécanique seul ne valide pas l’indice de protection. Convenez de l’état assemblé et de son inspection, puis approuvez un échantillon sur le panneau prévu.",
        },
      ],
      mistakes: [
        "Contrôler la bride avant en oubliant la profondeur arrière.",
        "Utiliser un plan de découpe sans tolérances ni révision.",
      ],
      prepare: [
        "Plan, épaisseur et matériau du panneau",
        "Découpe, fixation et antirotation",
        "Vues des dégagements avant et arrière",
        "Fiche, exigences d’étanchéité et sortie du câble",
      ],
    },
    {
      lead: "Avant de commander un câble ou convertisseur série, identifiez l’interface électrique à chaque extrémité. Des fiches compatibles ne rendent pas RS-232, RS-485 et UART TTL interchangeables.",
      sections: [
        {
          title: "Distinguer signal et connecteur",
          body: "RS-232 utilise une signalisation référencée à la masse ; RS-485 est différentiel. L’UART TTL exige son niveau logique spécifié. Relevez interface, broches et tensions requises avant de décider si une conversion active est nécessaire.",
        },
        {
          title: "Documenter toute la liaison",
          body: "Confirmez émission, réception, références et contrôle de flux. Pour RS-485, consultez topologie et terminaison dans le manuel. Ajoutez exigences d’isolation et source d’alimentation de tout convertisseur.",
        },
        {
          title: "Tester le logiciel avec un échantillon",
          body: "Pour une conversion USB, identifiez système d’exploitation et pilote. Convenez du débit, du format des données et d’un essai représentatif. Conservez le câblage vérifié avec les configurations matérielle et logicielle validées.",
        },
      ],
      mistakes: [
        "Employer un adaptateur passif lorsqu’une conversion électrique est nécessaire.",
        "Déduire brochage ou standard série de la présence d’un DB9.",
      ],
      prepare: [
        "Manuels et désignations des deux interfaces",
        "Brochage, niveau logique et contrôle de flux",
        "Système hôte et alimentation du convertisseur",
        "Paramètres, topologie et essai de communication",
      ],
    },
    {
      lead: "Planifiez le blindage avec la mise à la terre et le cheminement. La mention câble blindé ne décrit pas à elle seule la réponse aux perturbations de toute l’installation.",
      sections: [
        {
          title: "Repérer les perturbations",
          body: "Marquez variateurs, moteurs et alimentations à découpage proches du signal. Montrez entrées d’armoire, parcours parallèles et points de terre. Consignez les circonstances du défaut pour les reproduire lors de l’essai.",
        },
        {
          title: "Spécifier les raccordements du blindage",
          body: "Suivez les consignes CEM de l’équipement pour les raccordements et connecteurs. Évitez toute règle universelle sur une ou deux extrémités. Documentez les contacts et distinguez terre de protection et blindage fonctionnel.",
        },
        {
          title: "Vérifier l’installation complète",
          body: "Convenez des contrôles des raccordements prescrits et du signal dans la machine. Consignez les modifications de parcours et de terre pendant le diagnostic. Faites approuver la solution finale par le responsable électrique avant de la reproduire.",
        },
      ],
      mistakes: [
        "Modifier le blindage sans consulter le schéma de terre.",
        "Tester la communication uniquement lorsque les variateurs sont arrêtés.",
      ],
      prepare: [
        "Schéma de terre et de raccordement du blindage",
        "Parcours et sources de perturbations voisines",
        "Connecteurs, entrées et contacts de blindage",
        "Conditions du défaut et protocole de réception",
      ],
    },
  ],
  pt: [
    {
      lead: "Comece a consulta de cabos de visão de máquina pela câmera, pelo host e pelo percurso. O formato do conector é apenas uma parte de uma conexão de imagem confiável.",
      sections: [
        {
          title: "Identificar as duas extremidades",
          body: "Registre os modelos da câmera e do host, a interface e o conector correspondente. Inclua trava e direção de saída. Separe dados de imagem, alimentação e disparo no desenho para especificar cada ligação.",
        },
        {
          title: "Descrever percurso e movimento",
          body: "Meça o percurso instalado, incluindo folgas de manutenção e acesso aos parafusos. Identifique trechos fixos, esteiras e torção. A interface não comprova aptidão para movimento; consulte a especificação do cabo em questão.",
        },
        {
          title: "Definir a aceitação da amostra",
          body: "Combine como verificar montagem e aquisição de imagens no equipamento previsto. Registre parâmetros de captura, duração e sequência de movimento. Guarde essa configuração com o desenho aprovado para novos pedidos.",
        },
      ],
      mistakes: [
        "Escolher um conector angular sem verificar a direção de saída.",
        "Aceitar o percurso completo com base em um breve teste de bancada.",
      ],
      prepare: [
        "Modelos da câmera e do host ou documentação das portas",
        "Vistas dos conectores, trava e comprimento",
        "Esboço do percurso e descrição do movimento",
        "Quantidade de amostras e teste de aquisição previsto",
      ],
    },
    {
      lead: "Especifique um conjunto M12 pela codificação, pelos contatos e pela ligação, e depois confirme a montagem. A designação M12 não basta para uma especificação de compra.",
      sections: [
        {
          title: "Ler a designação da porta",
          body: "Copie a identificação completa do manual do equipamento. As codificações D e X aparecem em produtos Ethernet M12. Não escolha uma substituição apenas pela rosca: confirme a codificação das duas extremidades.",
        },
        {
          title: "Definir uma pinagem clara",
          body: "Indique número de contatos, macho ou fêmea e cada ligação entre pinos. Identifique a vista de acoplamento ou de fiação. Registre a blindagem separadamente dos sinais e confirme os contatos sem uso.",
        },
        {
          title: "Verificar o conjunto montado",
          body: "Confirme corpo reto ou angular, acesso ao aperto, saída e peça correspondente. Solicite requisitos elétricos e ambientais para o conjunto. Uma codificação mecanicamente compatível não comprova um desempenho ensaiado.",
        },
      ],
      mistakes: [
        "Comprar apenas pelo número de pinos, omitindo a codificação.",
        "Espelhar a pinagem por não indicar a direção da vista.",
      ],
      prepare: [
        "Designação da porta e referência da peça correspondente",
        "Codificação, contatos e orientação",
        "Pinagem aprovada com direção da vista",
        "Comprimento, ambiente e necessidade de amostras",
      ],
    },
    {
      lead: "Diferencie instalação fixa, flexão repetida e torção antes de escolher o cabo. Descrever o movimento real é mais útil do que pedir apenas um cabo flexível.",
      sections: [
        {
          title: "Classificar o movimento",
          body: "Marque onde o cabo fica fixo, dobra na esteira ou gira em torno do eixo. Flexão contínua e torção são cargas diferentes. Se ambas ocorrerem, indique os locais e se são simultâneas.",
        },
        {
          title: "Registrar as condições de instalação",
          body: "Informe raio disponível, curso, velocidade, aceleração e programação de ciclos. Acrescente esteira, fixações e exposição a óleo ou calor. Indique onde começa o movimento em relação ao conector e ao alívio de tração.",
        },
        {
          title: "Combinar uma validação pertinente",
          body: "Solicite construção e ensaio adequados à instalação. Defina verificações de sinal e intervalos de inspeção da amostra. Compare qualquer vida útil informada com suas condições de ensaio antes de incluí-la na especificação de compra.",
        },
      ],
      mistakes: [
        "Confundir capa macia com aptidão para movimento repetido.",
        "Aplicar um número de ciclos a outro raio ou movimento.",
      ],
      prepare: [
        "Esboço ou vídeo curto do movimento",
        "Raio, curso, velocidade e programação de ciclos",
        "Esteira, fixações e ambiente",
        "Requisitos de sinal e condições do ensaio",
      ],
    },
    {
      lead: "Um cabo de painel deve caber no gabinete e nos conectores dos dois lados. Use um desenho cotado antes de aprovar o recorte do painel ou o pedido.",
      sections: [
        {
          title: "Definir a fixação",
          body: "Especifique montagem frontal ou traseira, espessura e geometria do recorte. Inclua distância entre furos, parafusos e recurso antirrotação. Identifique a revisão e a face de referência das medidas.",
        },
        {
          title: "Reservar espaço atrás do painel",
          body: "Mostre corpo do conector, saída do cabo e espaço para conectar ou retirar o plugue. Inclua placas e paredes próximas. Verifique a trajetória de curvatura após a instalação do painel.",
        },
        {
          title: "Revisar vedação e manutenção",
          body: "Identifique junta, conector correspondente e instruções de montagem. O encaixe mecânico não verifica sozinho a proteção contra ingresso. Combine condição montada e inspeção; aprove uma amostra no painel previsto.",
        },
      ],
      mistakes: [
        "Verificar a flange frontal e esquecer a profundidade traseira.",
        "Usar um desenho de recorte sem tolerâncias ou revisão.",
      ],
      prepare: [
        "Desenho, espessura e material do painel",
        "Recorte, fixação e antirrotação",
        "Vistas de espaço livre frontal e traseiro",
        "Plugue, requisitos de vedação e saída do cabo",
      ],
    },
    {
      lead: "Antes de comprar um cabo ou conversor serial, identifique a interface elétrica de cada extremidade. RS-232, RS-485 e UART TTL não são intercambiáveis apenas porque os plugues encaixam.",
      sections: [
        {
          title: "Separar sinalização e conector",
          body: "RS-232 usa sinalização referenciada ao terra; RS-485 usa sinalização diferencial. UART TTL exige o nível lógico especificado. Registre interface, pinos e tensões exigidas antes de decidir se precisa de conversão ativa.",
        },
        {
          title: "Documentar a conexão completa",
          body: "Confirme transmissão, recepção, referências e controle de fluxo. Para RS-485, consulte topologia e terminação no manual. Inclua requisitos de isolamento e a fonte de alimentação de qualquer conversor.",
        },
        {
          title: "Testar o software com uma amostra",
          body: "Se houver conversão USB, identifique sistema operacional e driver. Combine taxa de transmissão, formato e teste representativo. Guarde a ligação verificada com as configurações de hardware e software validadas.",
        },
      ],
      mistakes: [
        "Usar um adaptador passivo quando é necessária conversão de níveis.",
        "Deduzir a pinagem ou o padrão serial pela presença de um DB9.",
      ],
      prepare: [
        "Manuais e identificação das duas interfaces",
        "Pinagem, nível lógico e controle de fluxo",
        "Sistema do host e alimentação do conversor",
        "Parâmetros, topologia e teste de comunicação",
      ],
    },
    {
      lead: "Planeje a blindagem junto com o aterramento e o percurso. A indicação cabo blindado não descreve, por si só, o comportamento da instalação completa diante de interferências.",
      sections: [
        {
          title: "Mapear as fontes de interferência",
          body: "Marque inversores, motores e fontes chaveadas próximos ao sinal. Mostre entradas do painel, percursos paralelos e pontos de terra. Registre quando a falha ocorre para reproduzir as condições no ensaio.",
        },
        {
          title: "Especificar a terminação da blindagem",
          body: "Siga as orientações de EMC do equipamento para conexões da blindagem e conectores. Não adote uma regra universal de ligar uma ou ambas as pontas. Documente os contatos e separe aterramento de proteção e blindagem funcional.",
        },
        {
          title: "Verificar toda a instalação",
          body: "Combine verificações das conexões especificadas e da operação do sinal na máquina. Registre alterações de percurso e aterramento durante o diagnóstico. Solicite aprovação do responsável elétrico antes de repetir a configuração em outros equipamentos.",
        },
      ],
      mistakes: [
        "Alterar a blindagem sem verificar o esquema de aterramento.",
        "Testar comunicação somente com os inversores desligados.",
      ],
      prepare: [
        "Diagrama de aterramento e terminação da blindagem",
        "Percurso e fontes de interferência próximas",
        "Conectores, entradas e detalhes dos contatos",
        "Condições da falha e plano de aceitação",
      ],
    },
  ],
  ar: [
    {
      lead: "ابدأ طلب كابل الرؤية الآلية بتحديد الكاميرا والحاسوب المضيف ومسار التركيب. شكل الموصل وحده ليس كافيًا لتحديد وصلة موثوقة لنقل الصور.",
      sections: [
        {
          title: "تحديد طرفي الوصلة",
          body: "سجّل طراز الكاميرا والمضيف والواجهة والموصل المقابل. أضف آلية التثبيت واتجاه خروج الكابل. افصل توصيلات بيانات الصورة والطاقة وإشارة التشغيل في الرسم حتى تكون متطلبات كل منها واضحة.",
        },
        {
          title: "وصف المسار والحركة",
          body: "قس المسار بعد التركيب مع طول الصيانة والمساحة اللازمة للوصول إلى البراغي. حدد الأجزاء الثابتة وسلاسل الكابلات ومناطق الالتواء. اسم الواجهة لا يثبت ملاءمة الحركة؛ راجع مواصفات الكابل المحدد.",
        },
        {
          title: "تحديد اختبار قبول العينة",
          body: "اتفق على فحص الملاءمة والتقاط الصور باستخدام المعدات المقصودة. سجّل إعدادات التصوير ومدة التشغيل وتسلسل الحركة. احتفظ بهذه الإعدادات مع الرسم المعتمد للطلبات اللاحقة.",
        },
      ],
      mistakes: [
        "اختيار موصل زاوي دون التحقق من اتجاه خروجه.",
        "اعتبار اختبار مكتبي قصير قبولًا للمسار المركب بالكامل.",
      ],
      prepare: [
        "طراز الكاميرا والمضيف أو وثائق المنافذ",
        "مناظر الموصلات والتثبيت والطول المطلوب",
        "رسم المسار ووصف الحركة",
        "عدد العينات واختبار التقاط الصور المقترح",
      ],
    },
    {
      lead: "حدد تجميعة M12 بحسب الترميز ونقاط التلامس والتوصيل، ثم تحقق من تركيبها الميكانيكي. تسمية M12 وحدها ليست مواصفة شراء مكتملة.",
      sections: [
        {
          title: "قراءة تعريف منفذ الجهاز",
          body: "انقل التعريف الكامل للموصل من دليل الجهاز. يُستخدم الترميز D وX في منتجات إيثرنت M12. لا تختَر البديل اعتمادًا على مقاس السن وحده؛ تحقق من الترميز المطلوب عند الطرفين.",
        },
        {
          title: "توضيح خريطة الأطراف",
          body: "حدد عدد نقاط التلامس ونوعها ذكرًا أو أنثى وكل توصيل بين الأطراف. بيّن إن كان الرسم من جهة التزاوج أو الأسلاك. دوّن استمرارية التدريع منفصلة عن الإشارات وأكد الأطراف غير المستخدمة.",
        },
        {
          title: "فحص الوصلة بعد التجميع",
          body: "تحقق من الجسم المستقيم أو الزاوي ومساحة الربط واتجاه الخروج والقطعة المقابلة. اطلب المتطلبات الكهربائية والبيئية للتجميعة كاملة. توافق الترميز ميكانيكيًا لا يُثبت تصنيف أداء مختبرًا.",
        },
      ],
      mistakes: [
        "الطلب بعدد الأطراف فقط دون تحديد الترميز.",
        "عكس خريطة الأطراف بسبب عدم توضيح اتجاه النظر.",
      ],
      prepare: [
        "تعريف منفذ الجهاز ورقم القطعة المقابلة",
        "الترميز وعدد نقاط التلامس واتجاه الموصل",
        "خريطة أطراف معتمدة واتجاه النظر",
        "الطول وبيئة التركيب والعينات المطلوبة",
      ],
    },
    {
      lead: "ميّز بين التركيب الثابت والانحناء المتكرر والالتواء قبل اختيار الكابل. وصف الحركة الفعلية أدق من الاكتفاء بطلب كابل مرن.",
      sections: [
        {
          title: "تصنيف الحركة",
          body: "حدد مواضع الثبات والانحناء داخل السلسلة والالتفاف حول المحور. الانحناء المستمر والالتواء حملان مختلفان. عند اجتماعهما، بيّن مكان حدوث كل منهما وهل يحدثان في الوقت نفسه.",
        },
        {
          title: "تسجيل ظروف التركيب",
          body: "قدم نصف قطر الانحناء المتاح ومسافة الحركة والسرعة والتسارع وجدول الدورات. أضف مسار السلسلة ونقاط التثبيت والتعرض للزيت أو الحرارة. حدد بداية الحركة بالنسبة للموصل ومانع الشد.",
        },
        {
          title: "الاتفاق على اختبار مناسب",
          body: "اطلب بنية كابل وخطة اختبار تناسب التركيب. حدد فحوص الإشارة وفترات معاينة العينة. قارن أي رقم للعمر التشغيلي بشروط اختباره قبل إدراجه في مواصفات الشراء.",
        },
      ],
      mistakes: [
        "افتراض أن الغلاف اللين يعني ملاءمة الحركة المتكررة.",
        "تطبيق عدد دورات منشور على نصف قطر أو حركة مختلفة.",
      ],
      prepare: [
        "رسم للحركة أو تسجيل قصير لها",
        "نصف القطر والمسافة والسرعة وجدول الدورات",
        "السلسلة والتثبيت والظروف البيئية",
        "متطلبات الإشارة وشروط اختبار العينة",
      ],
    },
    {
      lead: "يجب أن يناسب كابل اللوحة الحاوية والموصل المقابل على كلا الجانبين. استخدم رسم تركيب بالأبعاد قبل اعتماد فتحة اللوحة أو طلب الكابل.",
      sections: [
        {
          title: "تحديد واجهة التثبيت",
          body: "حدد التركيب الأمامي أو الخلفي وسماكة اللوحة وشكل الفتحة. أضف المسافة بين الثقوب ومقاس البراغي وميزة منع الدوران. بيّن إصدار الرسم والوجه المرجعي لقياس الأبعاد.",
        },
        {
          title: "حجز مساحة خلف اللوحة",
          body: "أظهر جسم الموصل وخروج الكابل والمساحة اللازمة لتوصيل القابس المقابل أو نزعه. أضف اللوحات الإلكترونية والجدران المجاورة. تحقق من مسار انحناء الكابل بعد تركيب اللوحة.",
        },
        {
          title: "مراجعة الإحكام والصيانة",
          body: "حدد موضع الحشية والموصل المقابل وتعليمات التركيب. الملاءمة الميكانيكية وحدها لا تثبت الحماية من دخول الماء أو الغبار. اتفق على حالة التجميع وطريقة الفحص، ثم اعتمد عينة في اللوحة المقصودة.",
        },
      ],
      mistakes: [
        "فحص الحافة الأمامية مع إغفال عمق الموصل الخلفي.",
        "استخدام رسم فتحة دون سماحات أو رقم إصدار.",
      ],
      prepare: [
        "رسم اللوحة وسماكتها ومادتها",
        "الفتحة والتثبيت ومنع الدوران",
        "مناظر الفراغ الأمامي والخلفي",
        "القابس ومتطلبات الإحكام واتجاه خروج الكابل",
      ],
    },
    {
      lead: "قبل طلب كابل أو محول تسلسلي، حدد الواجهة الكهربائية عند كل طرف. توافق القوابس لا يجعل RS-232 وRS-485 وUART بمستوى TTL قابلة للاستبدال.",
      sections: [
        {
          title: "فصل الإشارة عن شكل الموصل",
          body: "تستخدم RS-232 إشارة مرجعية إلى الأرضي، بينما تستخدم RS-485 إشارة تفاضلية. تتطلب UART TTL مستوى منطقيًا محددًا. سجّل الواجهة وتسميات الأطراف ومتطلبات جهد الإشارة قبل تحديد الحاجة إلى محول نشط.",
        },
        {
          title: "توثيق الوصلة كاملة",
          body: "أكد توصيلات الإرسال والاستقبال والمراجع وإشارات التحكم في التدفق. في RS-485، راجع شكل الشبكة ومتطلبات الإنهاء في دليل الجهاز. أضف متطلبات العزل ومصدر طاقة أي محول.",
        },
        {
          title: "فحص البرمجيات مع العينة",
          body: "عند التحويل من USB، حدد نظام تشغيل المضيف والتعريف المطلوب. اتفق على معدل النقل وتنسيق البيانات واختبار اتصال ممثل. احتفظ بمخطط التوصيل المتحقق منه مع إعدادات العتاد والبرمجيات.",
        },
      ],
      mistakes: [
        "استخدام مهيئ أطراف سلبي عند الحاجة إلى تحويل مستويات كهربائية.",
        "افتراض أن موصل DB9 يحدد خريطة الأطراف أو معيار الاتصال.",
      ],
      prepare: [
        "أدلة الأجهزة وتعريف الواجهتين",
        "خريطة الأطراف والمستوى المنطقي والتحكم في التدفق",
        "نظام المضيف ومتطلبات طاقة المحول",
        "إعدادات الاتصال وشكل الشبكة واختبار العينة",
      ],
    },
    {
      lead: "خطط للتدريع مع تصميم تأريض المعدات ومسار الكابل. وصف الكابل بأنه مدرع لا يوضح وحده سلوك التركيب الكامل أمام التداخل.",
      sections: [
        {
          title: "رسم بيئة التداخل",
          body: "حدد المشغلات والمحركات ومصادر الطاقة التبديلية القريبة من مسار الإشارة. أظهر مداخل الخزانة والمسارات المتوازية ونقاط التأريض. سجّل ظروف ظهور العطل لإعادة إنتاجها في اختبار العينة.",
        },
        {
          title: "تحديد توصيل التدريع",
          body: "اتبع إرشادات التوافق الكهرومغناطيسي للمعدات عند ربط التدريع وإنهاء الموصلات. لا تطبق قاعدة عامة لتوصيل طرف واحد أو الطرفين. وثق طريقة التلامس وافصل متطلبات التأريض الوقائي عن التدريع الوظيفي.",
        },
        {
          title: "التحقق من التركيب الكامل",
          body: "اتفق على فحص توصيلات التدريع المحددة وعمل الإشارة في الآلة. سجّل تغييرات المسار والتأريض أثناء التشخيص. اطلب اعتماد المهندس الكهربائي المسؤول للترتيب النهائي قبل تكراره على المعدات.",
        },
      ],
      mistakes: [
        "تغيير توصيل التدريع دون مراجعة مخطط تأريض المعدات.",
        "اختبار الاتصال فقط عند إيقاف المشغلات القريبة.",
      ],
      prepare: [
        "مخطط التأريض وإنهاء التدريع",
        "مسار الكابل ومصادر التداخل المجاورة",
        "الموصلات ومداخل الحاوية وتفاصيل تلامس التدريع",
        "ظروف العطل وخطة اختبار القبول",
      ],
    },
  ],
});

function localizedGuides(locale: Locale): readonly GuideContent[] {
  return [
    ...baseGuideContent[locale].map((item, index) => ({ ...item, questions: guideQuestions[locale][index] })),
    ...newGuideContent[locale],
  ];
}
export const guideContent: Record<Locale, readonly GuideContent[]> = expandLocales({
  en: localizedGuides("en"), de: localizedGuides("de"), es: localizedGuides("es"),
  fr: localizedGuides("fr"), pt: localizedGuides("pt"), ar: localizedGuides("ar"),
});

export const guideTopics = [
  { category: 0, examples: ["QC12A00", "QC10B00"], related: [6, 7, 8], inquiryType: "custom" },
  { category: 2, examples: ["QC31A00", "QC21A00"], related: [7, 8], inquiryType: "custom" },
  { category: 0, examples: [], related: [6, 8], inquiryType: "custom" },
  { category: 5, examples: ["QC51B00", "QC53B00"], related: [8], inquiryType: "custom" },
  { category: 3, examples: ["QC40A00", "QC41A00"], related: [9], inquiryType: "custom" },
  { category: 1, examples: [], related: [7], inquiryType: "custom" },
  { category: 0, examples: ["QC12A00"], related: [0, 2, 8], inquiryType: "custom" },
  { category: 1, examples: ["QC21A00"], related: [1, 5, 8], inquiryType: "support" },
  { category: 0, examples: [], related: [0, 1, 3, 9], inquiryType: "quotation" },
  { category: 3, examples: ["QC41A00"], related: [4, 8], inquiryType: "support" },
] as const;
