import { expandLocales } from "./locale-runtime";
import type { Locale } from "./i18n";

export const projectStages = [
  "evaluation",
  "prototype",
  "validation",
  "production",
  "reorder",
] as const;
type InquiryMessages = {
  pinout: string;
  orientation: string;
  stage: string;
  select: string;
  stages: [string, string, string, string, string];
  attachments: string;
  choose: string;
  help: string;
  remove: string;
  selected: string;
  withoutFiles: string;
  fileCount: string;
  fileSize: string;
  fileType: string;
  fileEmpty: string;
  fileName: string;
  uploadError: string;
  rateLimited: string;
  conflict: string;
};
export const inquiryMessages: Record<Locale, InquiryMessages> = expandLocales({
  en: {
    pinout: "Pin assignment / drawing reference",
    orientation: "Direction / mounting requirements",
    stage: "Project stage",
    select: "Select if known",
    stages: [
      "Exploring options",
      "Prototype / sample",
      "Testing / qualification",
      "Production sourcing",
      "Repeat order",
    ],
    attachments: "Drawings & project files",
    choose: "Choose files",
    selected: "Selected files",
    help: "PDF, JPG or PNG · up to 3 files, 20 MB each. Files are sent with your inquiry. For CAD files, use a drawing link below or send a PDF export.",
    remove: "Remove",
    fileCount: "Choose up to 3 files.",
    fileSize: "Each file must be 20 MB or smaller.",
    withoutFiles: "Continue without files",
    fileType: "Use PDF, JPG or PNG files.",
    fileEmpty: "An empty file cannot be sent. Choose a valid file.",
    fileName: "Please shorten the file name.",
    uploadError:
      "The files could not be accepted. Check their format and size, or use a drawing link.",
    rateLimited:
      "Too many attempts. Please wait 10 minutes before trying again, or email us. Your entries are still here.",
    conflict:
      "This inquiry conflicts with an earlier submission. Please email us before submitting again to avoid a duplicate.",
  },
  de: {
    pinout: "Pinbelegung / Zeichnungsreferenz",
    orientation: "Ausrichtung / Montageanforderungen",
    stage: "Projektphase",
    select: "Falls bekannt, auswählen",
    stages: [
      "Orientierung / Auswahl",
      "Prototyp / Muster",
      "Prüfung / Qualifizierung",
      "Serienbeschaffung",
      "Nachbestellung",
    ],
    attachments: "Zeichnungen und Projektdateien",
    choose: "Dateien auswählen",
    selected: "Ausgewählte Dateien",
    help: "PDF, JPG oder PNG · bis zu 3 Dateien mit jeweils 20 MB. Die Dateien werden mit Ihrer Anfrage übermittelt. Für CAD-Dateien nutzen Sie bitte einen Zeichnungslink unten oder einen PDF-Export.",
    remove: "Entfernen",
    fileCount: "Wählen Sie maximal 3 Dateien aus.",
    fileSize: "Jede Datei darf höchstens 20 MB groß sein.",
    withoutFiles: "Ohne Dateien fortfahren",
    fileType: "Verwenden Sie PDF-, JPG- oder PNG-Dateien.",
    fileEmpty:
      "Leere Dateien können nicht gesendet werden. Wählen Sie eine gültige Datei.",
    fileName: "Bitte kürzen Sie den Dateinamen.",
    uploadError:
      "Die Dateien konnten nicht angenommen werden. Prüfen Sie Format und Größe oder verwenden Sie einen Zeichnungslink.",
    rateLimited:
      "Zu viele Versuche. Warten Sie bitte 10 Minuten oder schreiben Sie uns eine E-Mail. Ihre Eingaben bleiben erhalten.",
    conflict:
      "Diese Anfrage steht im Konflikt mit einer früheren Übermittlung. Schreiben Sie uns bitte vor einem erneuten Versuch, um eine doppelte Anfrage zu vermeiden.",
  },
  es: {
    pinout: "Asignación de pines / plano",
    orientation: "Orientación / requisitos de montaje",
    stage: "Etapa del proyecto",
    select: "Seleccione si la conoce",
    stages: [
      "Evaluación de opciones",
      "Prototipo / muestra",
      "Pruebas / homologación",
      "Compra para producción",
      "Pedido repetido",
    ],
    attachments: "Planos y archivos del proyecto",
    choose: "Seleccionar archivos",
    selected: "Archivos seleccionados",
    help: "PDF, JPG o PNG · hasta 3 archivos de 20 MB cada uno. Se envían con su consulta. Para archivos CAD, añada un enlace al plano abajo o exporte a PDF.",
    remove: "Eliminar",
    fileCount: "Seleccione hasta 3 archivos.",
    fileSize: "Cada archivo debe pesar como máximo 20 MB.",
    withoutFiles: "Continuar sin archivos",
    fileType: "Utilice archivos PDF, JPG o PNG.",
    fileEmpty: "No se puede enviar un archivo vacío. Seleccione uno válido.",
    fileName: "Acorte el nombre del archivo.",
    uploadError:
      "No se pudieron aceptar los archivos. Revise el formato y el tamaño o utilice un enlace al plano.",
    rateLimited:
      "Demasiados intentos. Espere 10 minutos o escríbanos por correo. Sus datos permanecen en el formulario.",
    conflict:
      "Esta consulta entra en conflicto con un envío anterior. Escríbanos antes de volver a enviarla para evitar duplicados.",
  },
  fr: {
    pinout: "Brochage / référence du plan",
    orientation: "Orientation / exigences de montage",
    stage: "Phase du projet",
    select: "Sélectionnez si vous la connaissez",
    stages: [
      "Étude des options",
      "Prototype / échantillon",
      "Essais / qualification",
      "Approvisionnement de série",
      "Renouvellement de commande",
    ],
    attachments: "Plans et fichiers du projet",
    choose: "Choisir des fichiers",
    selected: "Fichiers sélectionnés",
    help: "PDF, JPG ou PNG · jusqu’à 3 fichiers de 20 Mo chacun. Ils sont envoyés avec votre demande. Pour les fichiers CAO, ajoutez un lien vers le plan ci-dessous ou exportez un PDF.",
    remove: "Retirer",
    fileCount: "Sélectionnez au maximum 3 fichiers.",
    fileSize: "Chaque fichier doit faire 20 Mo maximum.",
    withoutFiles: "Continuer sans fichier",
    fileType: "Utilisez des fichiers PDF, JPG ou PNG.",
    fileEmpty:
      "Un fichier vide ne peut pas être envoyé. Sélectionnez un fichier valide.",
    fileName: "Veuillez raccourcir le nom du fichier.",
    uploadError:
      "Les fichiers n’ont pas pu être acceptés. Vérifiez leur format et leur taille ou utilisez un lien vers le plan.",
    rateLimited:
      "Trop de tentatives. Patientez 10 minutes ou contactez-nous par e-mail. Vos données restent dans le formulaire.",
    conflict:
      "Cette demande est en conflit avec un envoi précédent. Contactez-nous avant de réessayer pour éviter un doublon.",
  },
  pt: {
    pinout: "Pinagem / referência do desenho",
    orientation: "Orientação / requisitos de montagem",
    stage: "Fase do projeto",
    select: "Selecione se souber",
    stages: [
      "Avaliação de opções",
      "Protótipo / amostra",
      "Testes / qualificação",
      "Compra para produção",
      "Repetição de pedido",
    ],
    attachments: "Desenhos e arquivos do projeto",
    choose: "Selecionar arquivos",
    selected: "Arquivos selecionados",
    help: "PDF, JPG ou PNG · até 3 arquivos de 20 MB cada. São enviados com a sua consulta. Para arquivos CAD, inclua um link do desenho abaixo ou exporte para PDF.",
    remove: "Remover",
    fileCount: "Selecione até 3 arquivos.",
    fileSize: "Cada arquivo deve ter no máximo 20 MB.",
    withoutFiles: "Continuar sem arquivos",
    fileType: "Use arquivos PDF, JPG ou PNG.",
    fileEmpty:
      "Não é possível enviar um arquivo vazio. Selecione um arquivo válido.",
    fileName: "Encurte o nome do arquivo.",
    uploadError:
      "Não foi possível aceitar os arquivos. Verifique o formato e o tamanho ou use um link do desenho.",
    rateLimited:
      "Muitas tentativas. Aguarde 10 minutos ou envie um e-mail. Seus dados continuam no formulário.",
    conflict:
      "Esta consulta está em conflito com um envio anterior. Envie-nos um e-mail antes de tentar novamente para evitar duplicação.",
  },
  ar: {
    pinout: "توزيع الأطراف / مرجع الرسم",
    orientation: "الاتجاه / متطلبات التركيب",
    stage: "مرحلة المشروع",
    select: "اختر المرحلة إن كانت معروفة",
    stages: [
      "دراسة الخيارات",
      "نموذج أولي / عينة",
      "الاختبار / التأهيل",
      "التوريد للإنتاج",
      "طلب متكرر",
    ],
    attachments: "الرسومات وملفات المشروع",
    choose: "اختيار الملفات",
    selected: "الملفات المحددة",
    help: "PDF أو JPG أو PNG · حتى 3 ملفات، بحد أقصى 5 ميجابايت لكل ملف. تُرسل الملفات مع استفسارك. لملفات CAD، أضف رابط الرسم أدناه أو صدّر نسخة PDF.",
    remove: "إزالة",
    fileCount: "اختر 3 ملفات كحد أقصى.",
    fileSize: "يجب ألا يتجاوز حجم كل ملف 5 ميجابايت.",
    withoutFiles: "المتابعة بدون ملفات",
    fileType: "استخدم ملفات PDF أو JPG أو PNG.",
    fileEmpty: "لا يمكن إرسال ملف فارغ. اختر ملفًا صالحًا.",
    fileName: "يرجى تقصير اسم الملف.",
    uploadError:
      "تعذّر قبول الملفات. تحقق من الصيغة والحجم أو استخدم رابط الرسم.",
    rateLimited:
      "محاولات كثيرة. انتظر 10 دقائق أو راسلنا عبر البريد الإلكتروني. لا تزال بياناتك في النموذج.",
    conflict:
      "يتعارض هذا الاستفسار مع إرسال سابق. راسلنا قبل إعادة الإرسال لتجنب التكرار.",
  },
});

// Upload policy confirmed in the 2026-10-20 customer workbook.
const uploadHelp = expandLocales({"en": "PDF, JPG, PNG, STEP/STP or ZIP · up to 3 files, 20 MB each. Files are kept with your inquiry for project review. A drawing link is also accepted.", "de": "PDF, JPG, PNG, STEP/STP oder ZIP · bis zu 3 Dateien, jeweils 20 MB. Dateien werden zur Projektprüfung mit Ihrer Anfrage gespeichert. Alternativ einen Zeichnungslink angeben.", "es": "PDF, JPG, PNG, STEP/STP o ZIP · hasta 3 archivos de 20 MB cada uno. Se guardan con la consulta para revisar el proyecto. También puede facilitar un enlace.", "fr": "PDF, JPG, PNG, STEP/STP ou ZIP · 3 fichiers maximum, 20 Mo chacun. Ils sont conservés avec la demande pour étudier le projet. Un lien vers le plan convient aussi.", "pt": "PDF, JPG, PNG, STEP/STP ou ZIP · até 3 ficheiros, 20 MB cada. Os ficheiros ficam associados à consulta para análise do projeto. Pode indicar um link para o desenho.", "ar": "PDF أو JPG أو PNG أو STEP/STP أو ZIP · حتى 3 ملفات، 20 MB لكل ملف. تُحفظ مع الاستفسار لمراجعة المشروع. يمكن أيضًا تقديم رابط للرسم."});
for (const locale of Object.keys(uploadHelp) as Locale[]) { inquiryMessages[locale].help = uploadHelp[locale]; inquiryMessages[locale].fileType = uploadHelp[locale]; }
