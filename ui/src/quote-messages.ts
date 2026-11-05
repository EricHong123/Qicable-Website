import { expandLocales } from "./locale-runtime";
import type { Locale } from "./i18n";

export const quoteStorageText: Record<Locale, string> = expandLocales({
  en: "Your inquiry list saves only model numbers and quantities in this browser. Remove items from the list to clear them. Form contact details are not saved with the list.",
  de: "Die Anfrageliste speichert nur Modellnummern und Stückzahlen in diesem Browser. Entfernen Sie Einträge, um sie zu löschen. Kontaktdaten aus dem Formular werden nicht mit der Liste gespeichert.",
  es: "La lista guarda solo modelos y cantidades en este navegador. Elimine los artículos de la lista para borrarlos. Los datos de contacto del formulario no se guardan con la lista.",
  fr: "La liste conserve uniquement les modèles et quantités dans ce navigateur. Retirez les articles pour les effacer. Les coordonnées du formulaire ne sont pas enregistrées avec la liste.",
  pt: "A lista salva apenas modelos e quantidades neste navegador. Remova os itens da lista para apagá-los. Os dados de contato do formulário não são salvos com a lista.",
  ar: "تحفظ القائمة أرقام الطرازات والكميات فقط في هذا المتصفح. احذف العناصر من القائمة لإزالتها. لا تُحفظ بيانات الاتصال في النموذج مع القائمة.",
});

type QuoteCopy = {
  add: string;
  added: string;
  review: string;
  title: string;
  quantity: string;
  remove: string;
  empty: string;
  browse: string;
  help: string;
  limit: string;
  invalidQuantity: string;
  memory: string;
  use: string;
  single: string;
  units: string;
};
export const quoteMessages: Record<Locale, QuoteCopy> = expandLocales({
  en: {
    add: "Add to inquiry",
    added: "Added to inquiry",
    review: "Review inquiry",
    title: "Your inquiry list",
    quantity: "Quantity",
    remove: "Remove",
    empty: "Your inquiry list is empty.",
    browse: "Browse cables",
    help: "Combine up to 20 models in one request. Leave quantities blank if they are still to be confirmed.",
    limit: "Your list has reached 20 models. Review it before adding another.",
    invalidQuantity:
      "Enter a whole quantity from 1 to 999999, or leave it blank.",
    memory:
      "Browser storage is unavailable. This list may be lost when you reload or leave the page.",
    use: "Use saved inquiry list",
    single: "Send a single-model inquiry",
    units: "pcs",
  },
  de: {
    add: "Zur Anfrage hinzufügen",
    added: "Zur Anfrage hinzugefügt",
    review: "Anfrageliste ansehen",
    title: "Ihre Anfrageliste",
    quantity: "Stückzahl",
    remove: "Entfernen",
    empty: "Ihre Anfrageliste ist leer.",
    browse: "Kabel auswählen",
    help: "Bis zu 20 Modelle gemeinsam anfragen. Lassen Sie die Stückzahl leer, wenn sie noch nicht feststeht.",
    limit:
      "Ihre Liste enthält bereits 20 Modelle. Prüfen Sie die Liste vor dem Hinzufügen.",
    invalidQuantity:
      "Geben Sie eine ganze Zahl von 1 bis 999999 ein oder lassen Sie das Feld leer.",
    memory:
      "Der Browserspeicher ist nicht verfügbar. Beim Neuladen oder Verlassen der Seite kann die Liste verloren gehen.",
    use: "Gespeicherte Anfrageliste verwenden",
    single: "Einzelnes Modell anfragen",
    units: "Stk.",
  },
  es: {
    add: "Añadir a consulta",
    added: "Añadido a consulta",
    review: "Revisar consulta",
    title: "Su lista de consulta",
    quantity: "Cantidad",
    remove: "Eliminar",
    empty: "Su lista de consulta está vacía.",
    browse: "Explorar cables",
    help: "Incluya hasta 20 modelos en una consulta. Deje la cantidad en blanco si aún no está definida.",
    limit: "La lista ya contiene 20 modelos. Revísela antes de añadir otro.",
    invalidQuantity:
      "Introduzca un número entero de 1 a 999999 o deje el campo vacío.",
    memory:
      "El almacenamiento del navegador no está disponible. La lista podría perderse al recargar o salir de la página.",
    use: "Usar la lista guardada",
    single: "Consultar un solo modelo",
    units: "uds.",
  },
  fr: {
    add: "Ajouter à la demande",
    added: "Ajouté à la demande",
    review: "Voir la demande",
    title: "Votre liste de demande",
    quantity: "Quantité",
    remove: "Retirer",
    empty: "Votre liste de demande est vide.",
    browse: "Choisir des câbles",
    help: "Regroupez jusqu’à 20 modèles dans une demande. Laissez la quantité vide si elle reste à confirmer.",
    limit:
      "Votre liste contient déjà 20 modèles. Vérifiez-la avant d’en ajouter un autre.",
    invalidQuantity:
      "Saisissez un nombre entier de 1 à 999999 ou laissez le champ vide.",
    memory:
      "Le stockage du navigateur est indisponible. La liste peut être perdue en rechargeant ou en quittant la page.",
    use: "Utiliser la liste enregistrée",
    single: "Demander un seul modèle",
    units: "pcs",
  },
  pt: {
    add: "Adicionar à consulta",
    added: "Adicionado à consulta",
    review: "Rever consulta",
    title: "Sua lista de consulta",
    quantity: "Quantidade",
    remove: "Remover",
    empty: "Sua lista de consulta está vazia.",
    browse: "Explorar cabos",
    help: "Inclua até 20 modelos em uma consulta. Deixe a quantidade em branco se ainda não estiver definida.",
    limit: "A lista já contém 20 modelos. Reveja-a antes de adicionar outro.",
    invalidQuantity:
      "Insira um número inteiro de 1 a 999999 ou deixe o campo vazio.",
    memory:
      "O armazenamento do navegador está indisponível. A lista pode ser perdida ao recarregar ou sair da página.",
    use: "Usar a lista salva",
    single: "Consultar um único modelo",
    units: "un.",
  },
  ar: {
    add: "إضافة إلى الاستفسار",
    added: "تمت الإضافة",
    review: "مراجعة الاستفسار",
    title: "قائمة الاستفسار",
    quantity: "الكمية",
    remove: "إزالة",
    empty: "قائمة الاستفسار فارغة.",
    browse: "تصفح الكابلات",
    help: "اجمع حتى 20 طرازًا في طلب واحد. اترك الكمية فارغة إذا لم تتحدد بعد.",
    limit: "تحتوي القائمة على 20 طرازًا. راجعها قبل إضافة طراز آخر.",
    invalidQuantity: "أدخل عددًا صحيحًا من 1 إلى 999999 أو اترك الحقل فارغًا.",
    memory:
      "تخزين المتصفح غير متاح. قد تُفقد القائمة عند إعادة تحميل الصفحة أو مغادرتها.",
    use: "استخدام القائمة المحفوظة",
    single: "الاستفسار عن طراز واحد",
    units: "قطعة",
  },
});
