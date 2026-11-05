import { expandLocales } from "./locale-runtime";
import type { Locale } from "./i18n";

type Question = { question: string; answer: string };
function questions(...items: readonly (readonly [string, string])[]): readonly Question[] {
  return items.map(([question, answer]) => ({ question, answer }));
}

// General selection answers. These are not model-specific drawings or test reports.
export const guideQuestions: Record<Locale, Readonly<Record<number, readonly Question[]>>> = expandLocales({
  en: {
    0: questions(
      ["What should I check on a USB3 Vision screw lock cable?", "Check the camera and host connectors separately, including screw positions, thread requirements, tool access and exit direction. Request views of the exact assembly. A Micro-B connector or screw-lock label alone does not prove the cable's length, power capability or suitability for a moving installation."],
      ["Camera Link MDR vs SDR: can the two ends differ?", "Yes. Specify the camera-side and frame-grabber-side connector independently; an MDR-to-SDR assembly may be needed. Check the equipment manuals for operating mode, required links and PoCL support. Matching the connector family does not establish compatibility with every Camera Link configuration."],
      ["How do I choose CoaXPress BNC, DIN or HD-BNC connectors?", "Read the exact connector designation at both equipment ports rather than ordering by CoaXPress alone. Confirm locking, access, link rate, length and any PoCXP requirement against both manuals. Ask for an assembly review; this checklist does not certify a Qicable model for a particular camera or CXP rate."],
    ),
    1: questions(
      ["M12 D coded vs X coded: are they interchangeable?", "No. D-coded Ethernet connectors typically use four contacts, while X-coded versions use eight with a different coding arrangement. Select the coding required by each device. Contact count or an M12 thread alone does not confirm the complete assembly's Ethernet performance."],
      ["How do I verify an M12 to RJ45 pinout?", "Use the drawing for the exact assembly and state whether each end is shown from the mating face or wiring side. Match contact numbers to RJ45 positions, identify shielding separately and confirm unused contacts. Do not copy a wire-color diagram from another model or manufacturer."],
      ["What must an open-end M8 or M12 sensor cable specify?", "Identify the device port, coding, contact gender, contact count and the wire assignment for every used pin. Confirm exposed-wire length and termination requirements. An open end leaves the equipment-side assignment to be defined; it does not make different sensor interfaces interchangeable."],
    ),
    2: questions(
      ["Continuous flex vs torsion: can one rating cover both?", "Continuous bending in a cable carrier and twisting around an axis are different loads. A continuous-flex statement alone is not evidence of torsion suitability. Describe where each movement occurs and request validation for the actual combination instead of assuming that a flexible cable suits a robot joint."],
      ["How should minimum bend radius and cycle-life claims be compared?", "Keep the exact construction, installed radius, travel, speed, acceleration, temperature, torsion angle and failure criterion with the result. A cycle count without these conditions is not directly comparable. Request the relevant record or agree a sample test; this guide supplies no Qicable cycle-life rating."],
    ),
    3: questions(
      ["Which USB C panel mount cutout dimensions should I use?", "Use the dimensioned drawing and revision for the exact model; there is no universal enclosure cutout for every USB-C panel-mount assembly. Check opening, hole centers, flange, fasteners and mating access. Confirm data, power and video functions separately from the connector's external shape."],
      ["How much panel thickness and rear clearance are needed?", "Confirm the permitted panel stack, fastening method and connector body dimensions with the assembly drawing. Reserve room behind the panel for the cable exit, strain relief and bend, plus access for installation and replacement. Submit your enclosure drawing rather than copying a competitor's dimensions."],
    ),
  },
  de: {
    0: questions(
      ["Was ist bei USB3-Vision-Kabeln mit Schraubverriegelung zu prüfen?", "Kamera- und Hoststecker getrennt prüfen: Schraubpositionen, Gewinde, Werkzeugzugang und Abgang. Fordern Sie Ansichten der konkreten Konfektion an. Micro-B oder Schraubverriegelung allein belegen weder Länge und Versorgung noch Bewegungseignung."],
      ["Camera Link MDR oder SDR: dürfen die Enden unterschiedlich sein?", "Ja. Bestimmen Sie Kamera- und Framegrabber-Stecker unabhängig; gegebenenfalls ist MDR auf SDR erforderlich. Prüfen Sie Betriebsmodus, benötigte Verbindungen und PoCL in beiden Handbüchern. Die Steckerfamilie bestätigt nicht jede Camera-Link-Konfiguration."],
      ["Wie werden CoaXPress BNC, DIN und HD-BNC ausgewählt?", "Lesen Sie die genaue Bezeichnung beider Geräteanschlüsse. Prüfen Sie Verriegelung, Zugang, Linkrate, Länge und gegebenenfalls PoCXP anhand beider Handbücher. Fordern Sie eine Konfektionsprüfung an; die Checkliste zertifiziert kein Qicable-Modell für eine bestimmte Kamera oder CXP-Rate."],
    ),
    1: questions(
      ["M12 D-codiert oder X-codiert: austauschbar?", "Nein. D-codierte Ethernet-Stecker haben üblicherweise vier Kontakte, X-codierte acht und eine andere Codierung. Wählen Sie nach dem jeweiligen Geräteanschluss. Polzahl oder M12-Gewinde allein bestätigen keine Ethernet-Leistung der gesamten Konfektion."],
      ["Wie prüft man die Pinbelegung M12 auf RJ45?", "Verwenden Sie die konkrete Zeichnung und kennzeichnen Sie Steckgesicht oder Verdrahtungsseite beider Enden. Ordnen Sie M12-Kontakte den RJ45-Positionen zu; prüfen Sie Schirmung und unbenutzte Kontakte getrennt. Übernehmen Sie keine Aderfarben eines anderen Modells."],
      ["Was benötigt ein M8/M12-Sensorkabel mit offenem Ende?", "Geben Sie Geräteanschluss, Codierung, Kontaktgeschlecht, Polzahl und Aderzuordnung jedes verwendeten Pins an. Klären Sie freie Aderlänge und Anschlusstechnik. Ein offenes Ende ersetzt keine Definition der geräteseitigen Zuordnung und macht Sensorschnittstellen nicht austauschbar."],
    ),
    2: questions(
      ["Continuous Flex oder Torsion: genügt eine Einstufung?", "Wiederholtes Biegen in der Schleppkette und Torsion um die Achse sind unterschiedliche Belastungen. Continuous Flex allein belegt keine Torsionseignung. Beschreiben Sie beide Bewegungen und verlangen Sie eine Prüfung der tatsächlichen Kombination statt einer pauschalen Robotereignung."],
      ["Wie lassen sich Biegeradius und Lebensdauer vergleichen?", "Dokumentieren Sie Konstruktion, Einbauradius, Weg, Geschwindigkeit, Beschleunigung, Temperatur, Torsionswinkel und Ausfallkriterium. Zyklen ohne diese Bedingungen sind nicht direkt vergleichbar. Fordern Sie Prüfbelege an oder vereinbaren Sie einen Mustertest; hier wird keine Qicable-Lebensdauer zugesagt."],
    ),
    3: questions(
      ["Welche Ausschnittmaße braucht ein USB-C-Einbaukabel?", "Verwenden Sie die bemaßte Zeichnung der konkreten Revision. Für USB-C-Einbaukonfektionen gibt es keinen universellen Gehäuseausschnitt. Prüfen Sie Öffnung, Lochabstände, Flansch, Schrauben und Steckzugang. Daten-, Strom- und Videofunktionen sind unabhängig von der äußeren Form zu bestätigen."],
      ["Welche Wandstärke und welcher rückseitige Freiraum sind nötig?", "Klären Sie zulässigen Panelaufbau, Befestigung und Gehäusemaße anhand der Zeichnung. Reservieren Sie Platz für Abgang, Zugentlastung, Biegung sowie Montage und Austausch. Senden Sie die Gehäusezeichnung, statt Maße eines anderen Herstellers zu übernehmen."],
    ),
  },
  es: {
    0: questions(
      ["¿Qué revisar en un cable USB3 Vision con tornillos?", "Compruebe por separado conectores de cámara y host, posiciones de tornillos, roscas, acceso y salida. Solicite vistas del conjunto concreto. Micro-B o bloqueo por tornillos no prueban longitud, alimentación ni aptitud para movimiento."],
      ["Camera Link MDR frente a SDR: ¿pueden diferir los extremos?", "Sí. Especifique por separado cámara y capturadora; puede necesitar MDR a SDR. Revise modo, enlaces y PoCL en ambos manuales. La familia del conector no valida todas las configuraciones Camera Link."],
      ["¿Cómo elegir BNC, DIN o HD-BNC para CoaXPress?", "Lea la designación exacta en ambos puertos. Compruebe bloqueo, acceso, velocidad, longitud y PoCXP con ambos manuales. Solicite revisión del conjunto; esta lista no certifica un modelo Qicable para una cámara o velocidad CXP concreta."],
    ),
    1: questions(
      ["M12 D coded frente a X coded: ¿son intercambiables?", "No. D suele usar cuatro contactos y X ocho, con distinta codificación. Elija según cada dispositivo. Número de contactos o rosca M12 no prueban las prestaciones Ethernet del conjunto."],
      ["¿Cómo verificar el pinout M12 a RJ45?", "Use el plano del modelo e identifique cara de acoplamiento o lado de cableado. Relacione contactos con posiciones RJ45 y confirme pantalla y contactos sin uso. No copie colores de otro modelo o fabricante."],
      ["¿Qué definir en un cable de sensor M8/M12 abierto?", "Indique puerto, codificación, género, número de contactos y asignación de cada hilo. Confirme longitud libre y terminación. Un extremo abierto no sustituye la definición de conexiones del dispositivo ni hace intercambiables sus interfaces."],
    ),
    2: questions(
      ["Flexión continua frente a torsión: ¿basta una clasificación?", "La flexión en cadena y el giro sobre un eje son cargas distintas. Una declaración continuous-flex no prueba aptitud para torsión. Describa ambas y solicite validación de la combinación real, sin deducir aptitud para una articulación robótica."],
      ["¿Cómo comparar radio mínimo y vida en ciclos?", "Registre construcción, radio, recorrido, velocidad, aceleración, temperatura, ángulo de torsión y criterio de fallo. Los ciclos sin esas condiciones no son comparables. Solicite registros o acuerde una prueba; esta guía no declara vida en ciclos Qicable."],
    ),
    3: questions(
      ["¿Qué dimensiones de recorte usar para USB-C de panel?", "Utilice plano acotado y revisión del modelo exacto; no hay un recorte universal para todos los conjuntos USB-C. Revise abertura, centros, brida, fijaciones y acceso. Confirme datos, potencia y vídeo aparte de la forma externa."],
      ["¿Qué espesor y espacio trasero requiere el panel?", "Confirme espesor admisible, fijación y cuerpo con el plano. Reserve espacio para salida, alivio de tensión, curvatura, montaje y sustitución. Envíe su plano de carcasa en lugar de copiar dimensiones de otra marca."],
    ),
  },
  fr: {
    0: questions(
      ["Que vérifier sur un câble USB3 Vision à verrouillage par vis ?", "Vérifiez séparément connecteurs caméra et hôte, positions des vis, filetage, accès et sortie. Demandez les vues de l’assemblage exact. Micro-B ou verrouillage par vis ne prouvent ni longueur, ni alimentation, ni aptitude au mouvement."],
      ["Camera Link MDR ou SDR : les extrémités peuvent-elles différer ?", "Oui. Définissez séparément caméra et carte d’acquisition ; MDR vers SDR peut être nécessaire. Vérifiez mode, liaisons et PoCL dans les deux manuels. La famille du connecteur ne valide pas toutes les configurations Camera Link."],
      ["Comment choisir BNC, DIN ou HD-BNC pour CoaXPress ?", "Relevez la désignation exacte des deux ports. Contrôlez verrouillage, accès, débit, longueur et PoCXP avec les deux manuels. Demandez une vérification de l’assemblage ; cette liste ne certifie aucun modèle Qicable pour une caméra ou un débit CXP donné."],
    ),
    1: questions(
      ["M12 codé D ou X : interchangeables ?", "Non. Le codage D utilise généralement quatre contacts et le X huit, avec un détrompage différent. Choisissez selon chaque appareil. Nombre de contacts et filetage M12 ne démontrent pas les performances Ethernet de l’ensemble."],
      ["Comment vérifier le brochage M12 vers RJ45 ?", "Utilisez le plan exact et précisez face d’accouplement ou côté câblage. Associez contacts et positions RJ45, puis confirmez blindage et contacts inutilisés. Ne copiez pas les couleurs d’un autre modèle ou fabricant."],
      ["Que définir pour un câble capteur M8/M12 à fils libres ?", "Précisez port, codage, genre, nombre de contacts et affectation des fils. Confirmez longueur dénudée et raccordement. Une extrémité libre ne définit pas la connexion à l’appareil et ne rend pas les interfaces interchangeables."],
    ),
    2: questions(
      ["Flexion continue et torsion : une seule aptitude suffit-elle ?", "La flexion répétée en chaîne et la rotation autour d’un axe sont des charges différentes. Continuous-flex ne prouve pas une aptitude à la torsion. Décrivez les deux et faites valider leur combinaison réelle, sans présumer une aptitude à une articulation robotique."],
      ["Comment comparer rayon minimal et durée de vie ?", "Notez construction, rayon, course, vitesse, accélération, température, angle de torsion et critère de défaillance. Des cycles sans ces conditions ne sont pas comparables. Demandez les relevés ou convenez d’un essai ; ce guide n’annonce aucune durée de vie Qicable."],
    ),
    3: questions(
      ["Quelles dimensions de découpe pour un USB-C de panneau ?", "Utilisez le plan coté et la révision du modèle exact ; aucune découpe universelle ne couvre tous les assemblages USB-C. Vérifiez ouverture, entraxes, bride, fixations et accès. Confirmez données, puissance et vidéo indépendamment de la forme externe."],
      ["Quelle épaisseur et quel dégagement arrière prévoir ?", "Confirmez empilage du panneau, fixation et corps avec le plan. Réservez sortie, reprise d’effort, courbure et accès pour montage ou remplacement. Envoyez votre plan de boîtier au lieu de copier des cotes d’une autre marque."],
    ),
  },
  pt: {
    0: questions(
      ["O que verificar num cabo USB3 Vision com parafusos?", "Verifique separadamente conectores da câmara e host, posições dos parafusos, roscas, acesso e saída. Peça vistas do conjunto exato. Micro-B ou bloqueio por parafusos não provam comprimento, alimentação ou aptidão para movimento."],
      ["Camera Link MDR ou SDR: podem as pontas diferir?", "Sim. Defina separadamente câmara e placa de aquisição; pode ser necessário MDR para SDR. Reveja modo, ligações e PoCL nos dois manuais. A família do conector não valida todas as configurações Camera Link."],
      ["Como escolher BNC, DIN ou HD-BNC para CoaXPress?", "Leia a designação exata nas duas portas. Confirme bloqueio, acesso, débito, comprimento e PoCXP nos manuais. Peça revisão do conjunto; esta lista não certifica um modelo Qicable para uma câmara ou débito CXP específico."],
    ),
    1: questions(
      ["M12 D coded ou X coded: são intercambiáveis?", "Não. D usa normalmente quatro contactos e X oito, com codificação diferente. Selecione segundo cada dispositivo. Número de contactos ou rosca M12 não provam o desempenho Ethernet do conjunto."],
      ["Como verificar a pinagem M12 para RJ45?", "Use o desenho exato e identifique face de acoplamento ou lado da cablagem. Relacione contactos com posições RJ45 e confirme blindagem e contactos livres. Não copie cores de outro modelo ou fabricante."],
      ["O que definir num cabo de sensor M8/M12 aberto?", "Indique porta, codificação, género, número de contactos e atribuição dos fios. Confirme comprimento livre e terminação. Uma ponta aberta não define a ligação ao equipamento nem torna interfaces de sensores intercambiáveis."],
    ),
    2: questions(
      ["Flexão contínua e torção: basta uma classificação?", "Flexão numa esteira e rotação sobre um eixo são cargas diferentes. Continuous-flex não prova aptidão para torção. Descreva ambas e peça validação da combinação real, sem presumir aptidão para uma articulação robótica."],
      ["Como comparar raio mínimo e vida em ciclos?", "Registe construção, raio, curso, velocidade, aceleração, temperatura, ângulo de torção e critério de falha. Ciclos sem essas condições não são comparáveis. Peça registos ou acorde um teste; este guia não declara vida em ciclos Qicable."],
    ),
    3: questions(
      ["Que dimensões de abertura usar para USB-C de painel?", "Use desenho cotado e revisão do modelo exato; não existe uma abertura universal para todos os conjuntos USB-C. Verifique abertura, centros, flange, fixações e acesso. Confirme dados, potência e vídeo separadamente da forma externa."],
      ["Que espessura e espaço traseiro são necessários?", "Confirme espessura admissível, fixação e corpo no desenho. Reserve espaço para saída, alívio de tensão, curvatura, montagem e substituição. Envie o desenho da caixa em vez de copiar dimensões de outra marca."],
    ),
  },
  ar: {
    0: questions(
      ["ماذا أفحص في كابل USB3 Vision بقفل لولبي؟", "افحص طرفي الكاميرا والمضيف منفصلين، بما في ذلك مواضع البراغي والسنون والوصول واتجاه الخروج. اطلب مناظر التجميعة المحددة. لا يثبت اسم Micro-B أو القفل اللولبي الطول أو التغذية أو ملاءمة الحركة."],
      ["Camera Link MDR مقابل SDR: هل يمكن أن يختلف الطرفان؟", "نعم. حدّد موصل الكاميرا وموصل بطاقة الالتقاط منفصلين؛ قد تحتاج تجميعة MDR إلى SDR. راجع الوضع والوصلات المطلوبة وPoCL في الدليلين. عائلة الموصل وحدها لا تثبت توافق جميع تكوينات Camera Link."],
      ["كيف أختار BNC أو DIN أو HD-BNC لوصلة CoaXPress؟", "اقرأ اسم الموصل الدقيق في منفذي الجهازين. تحقق من القفل والوصول ومعدل الوصلة والطول وPoCXP وفق الدليلين. اطلب مراجعة التجميعة؛ لا تعتمد هذه القائمة طراز Qicable لكاميرا أو معدل CXP محدد."],
    ),
    1: questions(
      ["M12 بترميز D مقابل X: هل يمكن استبدالهما؟", "لا. يستخدم D في إيثرنت عادة أربعة تلامسات وX ثمانية مع ترتيب ترميز مختلف. اختر وفق كل جهاز. عدد التلامسات أو سن M12 وحده لا يثبت أداء إيثرنت للتجميعة كاملة."],
      ["كيف أتحقق من مخطط M12 إلى RJ45؟", "استخدم رسم التجميعة المحددة وبيّن وجه التزاوج أو جهة الأسلاك لكل طرف. طابق أرقام التلامسات بمواضع RJ45 وحدّد التدريع والأطراف غير المستخدمة. لا تنسخ ألوان أسلاك طراز أو مصنع آخر."],
      ["ماذا يحدد كابل حساس M8 أو M12 بطرف مفتوح؟", "حدّد المنفذ والترميز ونوع التلامس وعدد الأطراف وتعيين كل سلك. أكّد طول الأسلاك الحرة وطريقة إنهائها. الطرف المفتوح لا يحدد التوصيل بالجهاز ولا يجعل واجهات الحساسات قابلة للاستبدال."],
    ),
    2: questions(
      ["الانثناء المستمر مقابل الالتواء: هل يكفي تصنيف واحد؟", "الانثناء المتكرر في حامل الكابلات والالتواء حول المحور حملان مختلفان. وصف continuous-flex لا يثبت ملاءمة الالتواء. وضّح موقع الحركتين واطلب التحقق من الجمع الفعلي بينهما بدل افتراض ملاءمة مفصل روبوت."],
      ["كيف أقارن نصف قطر الانحناء والعمر الدوري؟", "سجّل البنية ونصف القطر والمشوار والسرعة والتسارع والحرارة وزاوية الالتواء ومعيار الفشل. لا تقارن عدد دورات دون هذه الظروف. اطلب السجل أو اتفق على اختبار؛ لا يقدم هذا الدليل تصنيف عمر دوري لطراز Qicable."],
    ),
    3: questions(
      ["ما أبعاد فتحة تركيب USB-C على اللوحة؟", "استخدم الرسم المحدد بالأبعاد وإصداره للطراز نفسه؛ لا توجد فتحة موحدة لجميع تجميعات USB-C. راجع الفتحة ومراكز الثقوب والشفة والمثبتات والوصول. أكّد وظائف البيانات والطاقة والفيديو منفصلة عن الشكل الخارجي."],
      ["ما سُمك اللوحة والخلوص الخلفي المطلوبان؟", "أكّد سماكة طبقات اللوحة والتثبيت وأبعاد الجسم وفق الرسم. اترك مساحة لخروج الكابل وتخفيف الشد والانحناء والوصول للتركيب والاستبدال. أرسل رسم الهيكل بدل نسخ أبعاد مصنع آخر."],
    ),
  },
});
