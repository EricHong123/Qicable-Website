import { expandLocales } from "./locale-runtime";
import type { Locale } from "./i18n";

type ChromeMessages = {
  carousel: string;
  slide: string;
  previous: string;
  next: string;
  selectSlide: string;
  pagination: string;
  previousPage: string;
  nextPage: string;
  resultSingular: string;
};

export const chromeMessages: Record<Locale, ChromeMessages> = expandLocales({
  en: {
    carousel: "Explore our connections",
    slide: "Slide",
    previous: "Previous slide",
    next: "Next slide",
    selectSlide: "Show slide",
    pagination: "Product pages",
    previousPage: "Previous page",
    nextPage: "Next page",
    resultSingular: "product",
  },
  de: {
    carousel: "Unsere Verbindungen entdecken",
    slide: "Folie",
    previous: "Vorherige Folie",
    next: "Nächste Folie",
    selectSlide: "Folie anzeigen",
    pagination: "Produktseiten",
    previousPage: "Vorherige Seite",
    nextPage: "Nächste Seite",
    resultSingular: "Produkt",
  },
  es: {
    carousel: "Explore nuestras conexiones",
    slide: "Diapositiva",
    previous: "Diapositiva anterior",
    next: "Diapositiva siguiente",
    selectSlide: "Mostrar diapositiva",
    pagination: "Páginas de productos",
    previousPage: "Página anterior",
    nextPage: "Página siguiente",
    resultSingular: "producto",
  },
  fr: {
    carousel: "Découvrez nos connexions",
    slide: "Diapositive",
    previous: "Diapositive précédente",
    next: "Diapositive suivante",
    selectSlide: "Afficher la diapositive",
    pagination: "Pages de produits",
    previousPage: "Page précédente",
    nextPage: "Page suivante",
    resultSingular: "produit",
  },
  pt: {
    carousel: "Explore as nossas ligações",
    slide: "Diapositivo",
    previous: "Diapositivo anterior",
    next: "Diapositivo seguinte",
    selectSlide: "Mostrar diapositivo",
    pagination: "Páginas de produtos",
    previousPage: "Página anterior",
    nextPage: "Página seguinte",
    resultSingular: "produto",
  },
  ar: {
    carousel: "اكتشف توصيلاتنا",
    slide: "شريحة",
    previous: "الشريحة السابقة",
    next: "الشريحة التالية",
    selectSlide: "عرض الشريحة",
    pagination: "صفحات المنتجات",
    previousPage: "الصفحة السابقة",
    nextPage: "الصفحة التالية",
    resultSingular: "منتج",
  },
});
