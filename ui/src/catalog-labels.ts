import { expandLocales, translateText } from "./locale-runtime";
import type { Locale } from "./i18n";
export const pendingMedia: Record<Locale,string> = expandLocales({
 en:"Product image pending verification", de:"Produktbild wird geprüft", es:"Imagen del producto pendiente de verificación", fr:"Image produit en cours de vérification", pt:"Imagem do produto em verificação", ar:"صورة المنتج قيد التحقق",
});
export const engineeringLabels: Record<Locale,Record<string,string>> = expandLocales({
 en:{}, de:{"Configuration options":"Konfigurationsoptionen","Construction options":"Aufbauoptionen","Installation options":"Installationsoptionen","Cable technology":"Kabeltechnologie","Mounting":"Montage"},
 es:{"Configuration options":"Opciones de configuración","Construction options":"Opciones de construcción","Installation options":"Opciones de instalación","Cable technology":"Tecnología del cable","Mounting":"Montaje"},
 fr:{"Configuration options":"Options de configuration","Construction options":"Options de construction","Installation options":"Options d’installation","Cable technology":"Technologie du câble","Mounting":"Montage"},
 pt:{"Configuration options":"Opções de configuração","Construction options":"Opções de construção","Installation options":"Opções de instalação","Cable technology":"Tecnologia do cabo","Mounting":"Montagem"},
 ar:{"Configuration options":"خيارات التكوين","Construction options":"خيارات البنية","Installation options":"خيارات التركيب","Cable technology":"تقنية الكابل","Mounting":"التثبيت"},
});

const engineeringTranslations: Record<string, readonly string[]> = {
 'Fixed installation / continuous-flex variant; validate bend radius, travel and cycles for the selected configuration.': ['Feste Installation / dauerbewegte Variante; Biegeradius, Verfahrweg und Zyklen für die gewählte Ausführung prüfen.','Instalación fija / variante de flexión continua; validar radio de curvatura, recorrido y ciclos para la configuración elegida.','Installation fixe / variante à flexion continue ; valider le rayon de courbure, la course et les cycles pour la configuration choisie.','Instalação fixa / variante de flexão contínua; validar raio de curvatura, curso e ciclos para a configuração escolhida.','تركيب ثابت / خيار للثني المستمر؛ تحقق من نصف قطر الانحناء ومسافة الحركة وعدد الدورات للتكوين المختار.'],
 'Active optical USB 3.0; power and optical construction require configuration review.': ['Aktives optisches USB 3.0; Stromversorgung und optischen Aufbau prüfen.','USB 3.0 óptico activo; revisar alimentación y construcción óptica.','USB 3.0 optique actif ; vérifier alimentation et construction optique.','USB 3.0 óptico ativo; revisar alimentação e construção óptica.','USB 3.0 بصري نشط؛ يلزم مراجعة التغذية والبنية البصرية.'],
 'Active USB-to-RS232 conversion; connector variant selected per project.': ['Aktive USB-RS232-Umsetzung; Steckervariante projektspezifisch auswählen.','Conversión activa USB a RS232; conector según el proyecto.','Conversion active USB vers RS232 ; connecteur selon le projet.','Conversão ativa USB para RS232; conector conforme o projeto.','تحويل نشط من USB إلى RS232؛ يحدد الموصل حسب المشروع.'],
 'RS422 or RS485 mode must be confirmed for the selected variant.': ['RS422- oder RS485-Modus für die gewählte Variante bestätigen.','Confirmar el modo RS422 o RS485 para la variante elegida.','Confirmer le mode RS422 ou RS485 pour la variante choisie.','Confirmar o modo RS422 ou RS485 para a variante escolhida.','يجب تأكيد وضع RS422 أو RS485 للخيار المحدد.'],
 '3.3 V / 5 V TTL UART options; confirm logic level and pinout.': ['TTL-UART-Optionen mit 3,3 V / 5 V; Logikpegel und Pinbelegung bestätigen.','Opciones TTL UART de 3,3 V / 5 V; confirmar nivel lógico y pinout.','Options TTL UART 3,3 V / 5 V ; confirmer niveau logique et brochage.','Opções TTL UART de 3,3 V / 5 V; confirmar nível lógico e pinagem.','خيارات TTL UART بجهد 3.3 / 5 فولت؛ أكد مستوى الإشارة وتوزيع الأطراف.'],
 'Passive console and active USB console options; confirm device pinout and driver.': ['Passive Konsolen- und aktive USB-Konsolenoptionen; Geräte-Pinbelegung und Treiber bestätigen.','Opciones de consola pasiva y consola USB activa; confirmar pinout y controlador.','Options de console passive et USB active ; confirmer brochage et pilote.','Opções de console passivo e USB ativo; confirmar pinagem e driver.','خيارات وحدة تحكم سلبية وUSB نشطة؛ أكد توزيع الأطراف وبرنامج التشغيل.'],
 'DB9 / DB15 / DB25 / DB37 options; confirm wiring.': ['DB9 / DB15 / DB25 / DB37; Verdrahtung bestätigen.','Opciones DB9 / DB15 / DB25 / DB37; confirmar cableado.','Options DB9 / DB15 / DB25 / DB37 ; confirmer le câblage.','Opções DB9 / DB15 / DB25 / DB37; confirmar fiação.','خيارات DB9 / DB15 / DB25 / DB37؛ أكد التوصيلات.'],
 'Panel mount': ['Schalttafeleinbau','Montaje en panel','Montage sur panneau','Montagem em painel','تركيب على اللوحة'],
 'Dual screw-lock': ['Beidseitige Schraubverriegelung','Bloqueo por tornillos en ambos extremos','Verrouillage à vis aux deux extrémités','Trava por parafusos nas duas extremidades','تثبيت بالبراغي من الطرفين'],
 'Single screw-lock': ['Einseitige Schraubverriegelung','Bloqueo por tornillos en un extremo','Verrouillage à vis à une extrémité','Trava por parafusos em uma extremidade','تثبيت بالبراغي من طرف واحد'],
};
export function engineeringValue(value: string, locale: Locale): string {
 const index = ['de','es','fr','pt','ar'].indexOf(locale);
 return index < 0 ? translateText(value,locale) : engineeringTranslations[value]?.[index] ?? value;
}
