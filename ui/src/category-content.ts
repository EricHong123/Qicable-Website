import { expandLocales } from "./locale-runtime";
import type { Locale } from "./i18n";

// Selection questions, not unverified performance or compatibility claims.
type Family = { title: string; fit: string; check: string };
type SelectionCopy = {
  heading: string;
  fitLabel: string;
  checkLabel: string;
  related: string;
  families: [Family, Family, Family, Family, Family, Family];
};
export const categoryContent: Record<Locale, SelectionCopy> = expandLocales({
  en: {
    heading: "Choose the connection for your equipment", fitLabel: "Start with your equipment", checkLabel: "Check before ordering", related: "Selection guides and project support",
    families: [
      {title:"Machine Vision Cables",fit:"Start with the camera and frame grabber interfaces. Compare the connector at each end, screw-lock position and exit direction against the available installation space.",check:"A matching connector alone does not confirm the required data rate or suitability for movement. Share the camera model, cable length and routing conditions for review."},
      {title:"Industrial Ethernet Cables",fit:"Identify both network ports before choosing an assembly. For RJ45 and M12 connections, record the connector coding, pinout and shielding requirements.",check:"Check the complete connection against the equipment documentation. Connector shape alone does not establish the Ethernet category, protocol compatibility or environmental rating."},
      {title:"Circular Cable Assemblies",fit:"Match the sensor or actuator port by connector size, coding, pin count and contact gender. Then decide whether the other end needs a connector or open wires.",check:"Confirm the pin assignment, straight or angled exit and installation clearance. Send the device drawing when the mating connection is uncertain."},
      {title:"Industrial Communication Cables",fit:"Use the equipment wiring diagram to identify the signal interface. For serial, console and D-Sub connections, specify both endpoints and the required pin mapping.",check:"RS232, RS485 and TTL should not be selected by connector appearance. Check the signal specification and wiring with the equipment supplier before choosing a cable."},
      {title:"Industrial Display Cables",fit:"Identify the display output and input interfaces, then measure the route through the equipment. Include connector orientation and any locking or enclosure requirements.",check:"Check the requested video mode and cable length against the equipment specification. Allow space for the connector body and cable exit behind the panel."},
      {title:"Panel Mount Cables",fit:"Start with the enclosure drawing: panel opening, thickness, fixing points and access for assembly. Match the internal and external connector interfaces separately.",check:"Check the mounting dimensions and mating direction before ordering. Send a dimensioned drawing for review instead of relying on the front view of the connector."},
    ],
  },
  de: {
    heading:"Die passende Verbindung für Ihre Anlage",fitLabel:"Ausgangspunkt: Ihr Gerät",checkLabel:"Vor der Bestellung prüfen",related:"Auswahlhilfen und Projektunterstützung",
    families:[
      {title:"Kabel für industrielle Bildverarbeitung",fit:"Beginnen Sie mit den Schnittstellen von Kamera und Framegrabber. Vergleichen Sie beide Stecker, die Schraubverriegelung und die Abgangsrichtung mit dem verfügbaren Einbauraum.",check:"Ein passender Stecker bestätigt weder die erforderliche Datenrate noch die Eignung für Bewegung. Teilen Sie Kameramodell, Kabellänge und Verlegebedingungen zur Prüfung mit."},
      {title:"Industrial-Ethernet-Kabel",fit:"Bestimmen Sie beide Netzwerkanschlüsse. Halten Sie bei RJ45- und M12-Verbindungen Codierung, Pinbelegung und Anforderungen an die Schirmung fest.",check:"Prüfen Sie die gesamte Verbindung anhand der Gerätedokumentation. Die Steckerform allein bestätigt weder Ethernet-Kategorie noch Protokollkompatibilität oder Schutzart."},
      {title:"Rundsteckverbinder-Kabelkonfektionen",fit:"Gleichen Sie den Sensor- oder Aktoranschluss nach Größe, Codierung, Polzahl und Kontaktgeschlecht ab. Bestimmen Sie anschließend, ob das andere Ende einen Stecker oder offene Adern benötigt.",check:"Prüfen Sie Pinbelegung, geraden oder gewinkelten Abgang und Einbauraum. Senden Sie bei unklarer Gegenverbindung die Gerätezeichnung."},
      {title:"Kabel für industrielle Kommunikation",fit:"Bestimmen Sie die Signalschnittstelle anhand des Geräteschaltplans. Geben Sie für serielle, Konsolen- und D-Sub-Verbindungen beide Endpunkte und die Pinzuordnung an.",check:"RS232, RS485 und TTL lassen sich nicht anhand der Steckerform auswählen. Klären Sie Signalspezifikation und Verdrahtung vor der Kabelauswahl mit dem Gerätehersteller."},
      {title:"Kabel für industrielle Displays",fit:"Bestimmen Sie Ein- und Ausgangsschnittstelle des Displays und messen Sie den Kabelweg. Berücksichtigen Sie Steckerausrichtung, Verriegelung und Gehäusedurchführung.",check:"Gleichen Sie Videomodus und Kabellänge mit der Gerätespezifikation ab. Planen Sie hinter dem Panel Platz für Steckergehäuse und Kabelabgang ein."},
      {title:"Kabel mit Einbaubuchse",fit:"Beginnen Sie mit der Gehäusezeichnung: Ausschnitt, Wandstärke, Befestigung und Montagezugang. Stimmen Sie die innere und äußere Schnittstelle getrennt ab.",check:"Prüfen Sie Einbaumaße und Steckrichtung vor der Bestellung. Senden Sie eine bemaßte Zeichnung zur Prüfung; die Frontansicht des Steckers allein reicht nicht aus."},
    ],
  },
  es:{
    heading:"Elija la conexión para su equipo",fitLabel:"Empiece por el equipo",checkLabel:"Compruebe antes de pedir",related:"Guías de selección y asistencia",
    families:[
      {title:"Cables para visión artificial",fit:"Identifique las interfaces de la cámara y la capturadora. Compare ambos conectores, el bloqueo por tornillos y la dirección de salida con el espacio disponible.",check:"Un conector compatible no confirma la velocidad de datos ni la aptitud para movimiento. Indique el modelo de cámara, la longitud y las condiciones del recorrido para su revisión."},
      {title:"Cables Ethernet industriales",fit:"Identifique ambos puertos de red. Para conexiones RJ45 y M12, anote la codificación, la asignación de pines y los requisitos de apantallamiento.",check:"Revise la conexión completa con la documentación del equipo. La forma del conector no determina la categoría Ethernet, la compatibilidad de protocolo ni el grado de protección."},
      {title:"Conjuntos de cables con conectores circulares",fit:"Compare el puerto del sensor o actuador por tamaño, codificación, número de pines y contactos macho o hembra. Defina si el otro extremo requiere conector o hilos libres.",check:"Confirme la asignación de pines, la salida recta o acodada y el espacio de montaje. Envíe el plano del dispositivo si hay dudas sobre el acoplamiento."},
      {title:"Cables de comunicación industrial",fit:"Identifique la interfaz de señal en el esquema del equipo. En conexiones serie, de consola y D-Sub, indique ambos extremos y la correspondencia de pines.",check:"No seleccione RS232, RS485 o TTL por el aspecto del conector. Compruebe la especificación de señal y el cableado con el proveedor del equipo."},
      {title:"Cables para pantallas industriales",fit:"Identifique las interfaces de salida y entrada de vídeo y mida el recorrido. Incluya la orientación, el bloqueo y los requisitos de paso por la carcasa.",check:"Compruebe el modo de vídeo y la longitud con la especificación del equipo. Reserve espacio detrás del panel para el cuerpo del conector y la salida del cable."},
      {title:"Cables para montaje en panel",fit:"Parta del plano de la carcasa: abertura, espesor, puntos de fijación y acceso de montaje. Compruebe por separado las interfaces interna y externa.",check:"Verifique las dimensiones y la dirección de acoplamiento antes de pedir. Envíe un plano acotado para revisión en lugar de basarse solo en la vista frontal."},
    ],
  },
  fr:{
    heading:"Choisir la connexion adaptée à votre équipement",fitLabel:"Partir de votre équipement",checkLabel:"Vérifier avant de commander",related:"Guides de sélection et assistance",
    families:[
      {title:"Câbles de vision industrielle",fit:"Identifiez les interfaces de la caméra et de la carte d’acquisition. Comparez les deux connecteurs, le verrouillage à vis et la direction de sortie avec l’espace disponible.",check:"Un connecteur adapté ne confirme ni le débit requis ni l’aptitude au mouvement. Précisez le modèle de caméra, la longueur et les conditions de cheminement pour examen."},
      {title:"Câbles Ethernet industriels",fit:"Identifiez les deux ports réseau. Pour les connexions RJ45 et M12, précisez le codage, le brochage et les exigences de blindage.",check:"Vérifiez la connexion complète avec la documentation de l’équipement. La forme du connecteur ne détermine pas la catégorie Ethernet, la compatibilité de protocole ou l’indice de protection."},
      {title:"Assemblages à connecteurs circulaires",fit:"Identifiez le port du capteur ou de l’actionneur par taille, codage, nombre de broches et contacts mâles ou femelles. Définissez l’autre extrémité : connecteur ou fils libres.",check:"Confirmez le brochage, la sortie droite ou coudée et le dégagement nécessaire. Envoyez le plan de l’appareil en cas de doute sur l’accouplement."},
      {title:"Câbles de communication industrielle",fit:"Identifiez l’interface de signal sur le schéma de l’équipement. Pour les connexions série, console et D-Sub, précisez les deux extrémités et la correspondance des broches.",check:"Ne choisissez pas RS232, RS485 ou TTL d’après la forme du connecteur. Vérifiez les signaux et le câblage avec le fournisseur de l’équipement."},
      {title:"Câbles pour écrans industriels",fit:"Identifiez les interfaces vidéo d’entrée et de sortie, puis mesurez le cheminement. Précisez l’orientation, le verrouillage et les passages dans le boîtier.",check:"Vérifiez le mode vidéo et la longueur avec la spécification de l’équipement. Prévoyez derrière le panneau l’espace pour le corps du connecteur et la sortie du câble."},
      {title:"Câbles pour montage sur panneau",fit:"Partez du plan du boîtier : découpe, épaisseur, fixations et accès au montage. Vérifiez séparément les interfaces intérieure et extérieure.",check:"Contrôlez les dimensions et le sens d’accouplement avant commande. Envoyez un plan coté pour examen plutôt que de vous fier à la seule vue de face."},
    ],
  },
  pt:{
    heading:"Escolha a ligação para o seu equipamento",fitLabel:"Comece pelo equipamento",checkLabel:"Verifique antes de encomendar",related:"Guias de seleção e apoio ao projeto",
    families:[
      {title:"Cabos para visão industrial",fit:"Identifique as interfaces da câmara e da placa de aquisição. Compare os dois conectores, o bloqueio por parafusos e a direção de saída com o espaço disponível.",check:"Um conector compatível não confirma a velocidade de dados nem a aptidão para movimento. Indique o modelo da câmara, o comprimento e as condições do percurso para análise."},
      {title:"Cabos Ethernet industriais",fit:"Identifique as duas portas de rede. Para ligações RJ45 e M12, registe a codificação, a pinagem e os requisitos de blindagem.",check:"Verifique a ligação completa com a documentação do equipamento. A forma do conector não determina a categoria Ethernet, a compatibilidade de protocolo nem o grau de proteção."},
      {title:"Conjuntos de cabos com conectores circulares",fit:"Identifique a porta do sensor ou atuador por tamanho, codificação, número de pinos e contactos macho ou fêmea. Defina se a outra ponta precisa de conector ou fios livres.",check:"Confirme a pinagem, a saída reta ou angular e o espaço de montagem. Envie o desenho do dispositivo quando houver dúvidas sobre o acoplamento."},
      {title:"Cabos de comunicação industrial",fit:"Identifique a interface de sinal no esquema do equipamento. Para ligações série, de consola e D-Sub, indique as duas pontas e a correspondência dos pinos.",check:"Não escolha RS232, RS485 ou TTL pelo aspeto do conector. Confirme a especificação do sinal e a cablagem com o fornecedor do equipamento."},
      {title:"Cabos para ecrãs industriais",fit:"Identifique as interfaces de entrada e saída de vídeo e meça o percurso. Inclua a orientação, o bloqueio e os requisitos de passagem pela caixa.",check:"Verifique o modo de vídeo e o comprimento com a especificação do equipamento. Reserve espaço atrás do painel para o conector e a saída do cabo."},
      {title:"Cabos para montagem em painel",fit:"Comece pelo desenho da caixa: abertura, espessura, fixações e acesso à montagem. Verifique separadamente as interfaces interna e externa.",check:"Confirme as dimensões e a direção de acoplamento antes de encomendar. Envie um desenho cotado para análise em vez de depender apenas da vista frontal."},
    ],
  },
  ar:{
    heading:"اختر التوصيل المناسب لمعداتك",fitLabel:"ابدأ بمواصفات الجهاز",checkLabel:"تحقق قبل الطلب",related:"أدلة الاختيار ودعم المشروع",
    families:[
      {title:"كابلات الرؤية الصناعية",fit:"حدّد واجهات الكاميرا وبطاقة التقاط الصور. قارن الموصلين وموضع القفل بالبراغي واتجاه خروج الكابل بالمساحة المتاحة للتركيب.",check:"تطابق الموصل لا يؤكد معدل البيانات المطلوب أو ملاءمة الكابل للحركة. أرسل طراز الكاميرا وطول الكابل وظروف المسار للمراجعة."},
      {title:"كابلات إيثرنت الصناعية",fit:"حدّد منفذي الشبكة قبل اختيار التجميعة. في توصيلات RJ45 وM12، سجّل ترميز الموصل وتوزيع الأطراف ومتطلبات التدريع.",check:"راجع التوصيل بالكامل وفق وثائق المعدات. شكل الموصل وحده لا يحدد فئة إيثرنت أو توافق البروتوكول أو درجة الحماية البيئية."},
      {title:"تجميعات كابلات بموصلات دائرية",fit:"طابق منفذ الحساس أو المشغل من حيث الحجم والترميز وعدد الأطراف ونوع التلامس الذكر أو الأنثى. ثم حدّد ما إذا كان الطرف الآخر يحتاج إلى موصل أو أسلاك حرة.",check:"تحقق من توزيع الأطراف والخروج المستقيم أو الزاوي ومساحة التركيب. أرسل رسم الجهاز إذا كانت التوصيلة المقابلة غير واضحة."},
      {title:"كابلات الاتصالات الصناعية",fit:"حدّد واجهة الإشارة من مخطط توصيل الجهاز. للتوصيلات التسلسلية ووحدات التحكم وD-Sub، وضّح الطرفين وتوزيع الأطراف المطلوب.",check:"لا تختَر RS232 أو RS485 أو TTL بناءً على مظهر الموصل. راجع مواصفات الإشارة والتوصيل مع مورّد المعدات قبل اختيار الكابل."},
      {title:"كابلات الشاشات الصناعية",fit:"حدّد واجهتي خرج الفيديو ودخله ثم قِس المسار داخل المعدات. وضّح اتجاه الموصل والقفل ومتطلبات المرور عبر الهيكل.",check:"راجع وضع الفيديو المطلوب وطول الكابل وفق مواصفات المعدات. اترك مساحة خلف اللوحة لجسم الموصل وخروج الكابل."},
      {title:"كابلات التثبيت على اللوحات",fit:"ابدأ برسم الهيكل: الفتحة والسُمك ونقاط التثبيت وإمكانية الوصول أثناء التجميع. طابق الواجهتين الداخلية والخارجية كلًّا على حدة.",check:"راجع أبعاد التثبيت واتجاه التوصيل قبل الطلب. أرسل رسمًا بالأبعاد للمراجعة بدلًا من الاعتماد على المنظر الأمامي للموصل فقط."},
    ],
  },
});

