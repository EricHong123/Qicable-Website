import { expandLocales } from "./locale-runtime";
import type { Locale } from "./i18n";

export const geoGuideTitles: Record<Locale, readonly string[]> = expandLocales({
  en: ["USB3 Vision Cable Length: Passive, Active or Optical?", "GigE Vision Packet Loss: Cable or Network?", "Cable Assembly RFQ Checklist: Drawing and Test Scope", "USB-to-RS485 Wiring: Polarity, Termination and Timeouts"],
  de: ["USB3-Vision-Kabellänge: passiv, aktiv oder optisch?", "GigE Vision: Paketverlust am Kabel oder im Netzwerk?", "Kabelkonfektion anfragen: Zeichnung und Prüfumfang", "USB auf RS485: Polarität, Terminierung und Timeouts"],
  es: ["Longitud de cable USB3 Vision: pasivo, activo u óptico", "Pérdida de paquetes GigE Vision: ¿cable o red?", "Consulta de conjuntos de cables: plano y pruebas", "Cableado USB a RS485: polaridad, terminación y tiempos"],
  fr: ["Longueur USB3 Vision : câble passif, actif ou optique ?", "Pertes de paquets GigE Vision : câble ou réseau ?", "Demande de devis de câbles : plan et essais", "Câblage USB vers RS485 : polarité, terminaison et délais"],
  pt: ["Comprimento USB3 Vision: cabo passivo, ativo ou ótico?", "Perda de pacotes GigE Vision: cabo ou rede?", "Pedido de orçamento de cabos: desenho e testes", "Ligação USB a RS485: polaridade, terminação e tempos"],
  ar: ["طول كابل USB3 Vision: سلبي أم نشط أم بصري؟", "فقد حزم GigE Vision: هل السبب الكابل أم الشبكة؟", "قائمة طلب عرض سعر لتجميعات الكابلات: الرسم والاختبارات", "توصيل USB إلى RS485: القطبية والإنهاء ومهلة الاتصال"],
});

