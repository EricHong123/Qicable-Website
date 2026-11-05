import { expandLocales } from "./locale-runtime";
import type { Locale } from "./i18n";

// Application-specific selection guidance, kept in server-rendered content.
export const applicationDescriptions: Record<
  Locale,
  [string, string, string, string, string]
> = expandLocales({
  en: [
    "Connect industrial cameras, frame grabbers and controllers. Match the interface, data rate, connector orientation and installation space.",
    "Connect sensors, controllers and industrial networks. Specify the connector coding, pinout, cable routing and required environmental protection.",
    "Plan connections for moving equipment. Review bend radius, routing, torsion and the required flex life against the cable specification.",
    "Connect industrial computers, displays and operator panels. Review signal compatibility, locking connectors and access through the enclosure.",
    "Bring power, data and control connections into one equipment design. Coordinate drawings, cable lengths, pin assignments and assembly identification.",
  ],
  de: [
    "Verbinden Sie Industriekameras, Framegrabber und Steuerungen. Stimmen Sie Schnittstelle, Datenrate, Steckerausrichtung und Einbauraum ab.",
    "Verbinden Sie Sensoren, Steuerungen und industrielle Netzwerke. Definieren Sie Steckercodierung, Pinbelegung, Kabelführung und erforderlichen Umgebungsschutz.",
    "Planen Sie Verbindungen für bewegte Anlagen. Prüfen Sie Biegeradius, Verlegung, Torsion und geforderte Biegezyklen anhand der Kabelspezifikation.",
    "Verbinden Sie Industriecomputer, Displays und Bedienpanels. Prüfen Sie Signalkompatibilität, verriegelbare Stecker und Gehäusedurchführungen.",
    "Integrieren Sie Strom-, Daten- und Steuersignale in Ihr Gerät. Stimmen Sie Zeichnungen, Kabellängen, Pinbelegungen und Kennzeichnung ab.",
  ],
  es: [
    "Conecte cámaras industriales, capturadoras y controladores. Revise la interfaz, la velocidad de datos, la orientación y el espacio de instalación.",
    "Conecte sensores, controladores y redes industriales. Defina la codificación, la asignación de pines, el tendido y la protección ambiental requerida.",
    "Planifique conexiones para equipos en movimiento. Compruebe el radio de curvatura, el recorrido, la torsión y los ciclos de flexión según la especificación del cable.",
    "Conecte ordenadores industriales, pantallas y paneles de operador. Revise la compatibilidad de señal, el bloqueo de conectores y el paso por la carcasa.",
    "Integre alimentación, datos y control en el diseño del equipo. Coordine planos, longitudes, asignaciones de pines e identificación de conjuntos.",
  ],
  fr: [
    "Reliez caméras industrielles, cartes d’acquisition et contrôleurs. Vérifiez l’interface, le débit, l’orientation des connecteurs et l’espace disponible.",
    "Reliez capteurs, contrôleurs et réseaux industriels. Précisez le codage, le brochage, le cheminement et la protection environnementale nécessaire.",
    "Préparez les connexions des équipements mobiles. Vérifiez rayon de courbure, cheminement, torsion et cycles de flexion selon la spécification du câble.",
    "Reliez ordinateurs industriels, écrans et pupitres opérateur. Vérifiez la compatibilité des signaux, le verrouillage et les traversées de boîtier.",
    "Intégrez alimentation, données et commande dans votre équipement. Coordonnez plans, longueurs, brochages et identification des assemblages.",
  ],
  pt: [
    "Ligue câmaras industriais, placas de aquisição e controladores. Verifique interface, velocidade de dados, orientação dos conectores e espaço de instalação.",
    "Ligue sensores, controladores e redes industriais. Defina codificação, pinagem, percurso do cabo e proteção ambiental necessária.",
    "Planeie ligações para equipamentos em movimento. Verifique raio de curvatura, percurso, torção e ciclos de flexão face à especificação do cabo.",
    "Ligue computadores industriais, ecrãs e painéis de operador. Verifique compatibilidade do sinal, bloqueio dos conectores e passagem pela caixa.",
    "Integre alimentação, dados e controlo no equipamento. Coordene desenhos, comprimentos, pinagens e identificação dos conjuntos.",
  ],
  ar: [
    "اربط الكاميرات الصناعية وبطاقات التقاط الصور ووحدات التحكم. حدّد الواجهة ومعدل البيانات واتجاه الموصلات والمساحة المتاحة للتركيب.",
    "اربط الحساسات ووحدات التحكم والشبكات الصناعية. حدّد ترميز الموصلات وتوزيع الأطراف ومسار الكابل والحماية البيئية المطلوبة.",
    "خطّط لتوصيلات المعدات المتحركة. راجع نصف قطر الانحناء والمسار والالتواء وعدد دورات الثني المطلوب وفق مواصفات الكابل.",
    "اربط الحواسيب الصناعية والشاشات ولوحات التشغيل. راجع توافق الإشارات وقفل الموصلات ونقاط المرور عبر الهيكل.",
    "ادمج توصيلات الطاقة والبيانات والتحكم في تصميم المعدات. نسّق الرسومات وأطوال الكابلات وتوزيع الأطراف وتعريف التجميعات.",
  ],
});

// Buyer-supplied details needed for each application; no claimed test results.
export const applicationRequirements: Record<Locale, readonly (readonly string[])[]> = expandLocales({
 en:[
  ["Camera and frame grabber models, including the interface revision","Connector locking position, exit direction and route length","Fixed mounting or movement, with the required operating conditions"],
  ["Sensor, controller and network port references","Pin assignments, shielding and the equipment grounding plan","Routing near power cables and any exposure to fluids or dust"],
  ["Which section moves, and whether it bends, twists or both","Motion profile, bend radius and available routing space","Required service life and the evidence needed to validate the selected cable"],
  ["Computer output, display input and required video mode","Panel cut-out, enclosure depth and access to locking hardware","Internal cable route and service access for replacement"],
  ["Equipment drawing revision and connector list for each assembly","Pin mapping, cable lengths and assembly identification","Prototype quantities and the checks required before a production order"],
 ],
 de:[
  ["Kamera- und Framegrabbermodelle einschließlich Schnittstellenversion","Steckerverriegelung, Abgangsrichtung und Verlegelänge","Feste oder bewegte Verlegung und erforderliche Betriebsbedingungen"],
  ["Anschlussreferenzen von Sensor, Steuerung und Netzwerk","Pinbelegung, Schirmung und Erdungskonzept der Anlage","Kabelführung neben Leistungskabeln sowie Kontakt mit Flüssigkeit oder Staub"],
  ["Welcher Abschnitt bewegt wird und ob Biegung, Torsion oder beides auftritt","Bewegungsprofil, Biegeradius und verfügbarer Verlegeraum","Geforderte Lebensdauer und Nachweise zur Prüfung des ausgewählten Kabels"],
  ["Rechnerausgang, Displayeingang und benötigter Videomodus","Panelausschnitt, Gehäusetiefe und Zugang zur Verriegelung","Interner Kabelweg und Zugang für den Austausch"],
  ["Zeichnungsrevision des Geräts und Steckerliste je Baugruppe","Pinzuordnung, Kabellängen und Baugruppenkennzeichnung","Prototypenmengen und Prüfungen vor einem Serienauftrag"],
 ],
 es:[
  ["Modelos de cámara y capturadora, incluida la versión de interfaz","Posición de bloqueo, dirección de salida y longitud del recorrido","Montaje fijo o móvil y condiciones de funcionamiento requeridas"],
  ["Referencias de puertos del sensor, controlador y red","Asignación de pines, apantallamiento y puesta a tierra del equipo","Recorrido junto a cables de potencia y exposición a líquidos o polvo"],
  ["Tramo que se mueve y si se dobla, se torsiona o ambas cosas","Perfil de movimiento, radio de curvatura y espacio disponible","Vida útil requerida y pruebas necesarias para validar el cable elegido"],
  ["Salida del ordenador, entrada de pantalla y modo de vídeo requerido","Abertura del panel, profundidad y acceso al bloqueo","Recorrido interno y acceso para mantenimiento y sustitución"],
  ["Revisión del plano del equipo y lista de conectores por conjunto","Correspondencia de pines, longitudes e identificación","Cantidad de prototipos y comprobaciones antes de la producción"],
 ],
 fr:[
  ["Modèles de caméra et de carte d’acquisition, avec version de l’interface","Position du verrouillage, direction de sortie et longueur du parcours","Montage fixe ou mobile et conditions de fonctionnement requises"],
  ["Références des ports de capteur, de contrôleur et de réseau","Brochage, blindage et plan de mise à la terre de l’équipement","Passage près de câbles de puissance et exposition aux liquides ou à la poussière"],
  ["Partie mobile et présence de flexion, de torsion ou des deux","Profil de mouvement, rayon de courbure et espace de cheminement","Durée de service requise et preuves pour valider le câble choisi"],
  ["Sortie de l’ordinateur, entrée de l’écran et mode vidéo requis","Découpe du panneau, profondeur et accès au verrouillage","Cheminement intérieur et accès pour le remplacement"],
  ["Révision du plan de l’équipement et liste de connecteurs par assemblage","Correspondance des broches, longueurs et identification","Quantités de prototypes et contrôles avant la commande de production"],
 ],
 pt:[
  ["Modelos da câmara e da placa de aquisição, incluindo versão da interface","Posição do bloqueio, direção de saída e comprimento do percurso","Montagem fixa ou móvel e condições de funcionamento necessárias"],
  ["Referências das portas do sensor, controlador e rede","Pinagem, blindagem e plano de ligação à terra do equipamento","Percurso próximo de cabos de potência e exposição a líquidos ou pó"],
  ["Secção móvel e existência de flexão, torção ou ambas","Perfil de movimento, raio de curvatura e espaço de encaminhamento","Vida útil necessária e provas para validar o cabo selecionado"],
  ["Saída do computador, entrada do ecrã e modo de vídeo necessário","Abertura do painel, profundidade e acesso ao bloqueio","Percurso interno e acesso para substituição"],
  ["Revisão do desenho do equipamento e lista de conectores por conjunto","Correspondência de pinos, comprimentos e identificação","Quantidade de protótipos e verificações antes da produção"],
 ],
 ar:[
  ["طراز الكاميرا وبطاقة التقاط الصور بما في ذلك إصدار الواجهة","موضع قفل الموصل واتجاه الخروج وطول المسار","تركيب ثابت أو متحرك وظروف التشغيل المطلوبة"],
  ["مراجع منافذ الحساس ووحدة التحكم والشبكة","توزيع الأطراف والتدريع وخطة تأريض المعدات","المسار قرب كابلات الطاقة والتعرض للسوائل أو الغبار"],
  ["الجزء المتحرك وما إذا كان يتعرض للثني أو الالتواء أو كليهما","نمط الحركة ونصف قطر الانحناء والمساحة المتاحة للمسار","العمر التشغيلي المطلوب وأدلة التحقق من الكابل المختار"],
  ["خرج الحاسوب ودخل الشاشة ووضع الفيديو المطلوب","فتحة اللوحة وعمق الهيكل وإمكانية الوصول إلى القفل","المسار الداخلي وإمكانية الوصول للاستبدال"],
  ["إصدار رسم المعدات وقائمة الموصلات لكل تجميعة","توزيع الأطراف وأطوال الكابلات وتعريف التجميعات","كميات النماذج الأولية والفحوص المطلوبة قبل طلب الإنتاج"],
 ],
});

export const applicationTitles: Record<Locale, readonly [string,string,string,string,string]> = expandLocales({
 en:["Cable Connections for Machine Vision Systems","Cable Connections for Factory Automation","Cable Selection for Robotics","Cable Connections for Industrial PCs & HMI","Cable Assemblies for Equipment Integration"],
 de:["Kabelverbindungen für Bildverarbeitungssysteme","Kabelverbindungen für die Fabrikautomation","Kabelauswahl für die Robotik","Kabelverbindungen für Industrie-PCs und HMI","Kabelkonfektionen für die Geräteintegration"],
 es:["Conexiones de cable para sistemas de visión artificial","Conexiones de cable para automatización industrial","Selección de cables para robótica","Conexiones de cable para PC industriales y HMI","Conjuntos de cables para integración de equipos"],
 fr:["Connexions pour systèmes de vision industrielle","Connexions pour l’automatisation industrielle","Sélection de câbles pour la robotique","Connexions pour PC industriels et IHM","Assemblages de câbles pour l’intégration d’équipements"],
 pt:["Ligações de cabos para sistemas de visão industrial","Ligações de cabos para automação industrial","Seleção de cabos para robótica","Ligações de cabos para PC industriais e HMI","Conjuntos de cabos para integração de equipamentos"],
 ar:["توصيلات الكابلات لأنظمة الرؤية الصناعية","توصيلات الكابلات لأتمتة المصانع","اختيار الكابلات للروبوتات","توصيلات الكابلات للحواسيب الصناعية وواجهات التشغيل","تجميعات الكابلات لتكامل المعدات"],
});
