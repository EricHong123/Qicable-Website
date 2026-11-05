"use client";
import { expandLocales } from "./locale-runtime";

import { Component, type ReactNode } from "react";
import type { Locale } from "./i18n";
import site from "../../config/site.json";
const copy: Record<Locale, { error: string; reload: string }> = expandLocales({
  en: { error: "The inquiry form could not load. Reload this page or contact us by email.", reload: "Reload page" },
  de: { error: "Das Anfrageformular konnte nicht geladen werden. Laden Sie die Seite neu oder kontaktieren Sie uns per E-Mail.", reload: "Seite neu laden" },
  es: { error: "No se pudo cargar el formulario. Recargue la página o contacte por correo electrónico.", reload: "Recargar página" },
  fr: { error: "Le formulaire n’a pas pu être chargé. Rechargez la page ou contactez-nous par e-mail.", reload: "Recharger la page" },
  pt: { error: "Não foi possível carregar o formulário. Recarregue a página ou contacte-nos por e-mail.", reload: "Recarregar página" },
  ar: { error: "تعذر تحميل نموذج الاستفسار. أعد تحميل الصفحة أو تواصل معنا بالبريد الإلكتروني.", reload: "إعادة تحميل الصفحة" },
});
export class InquiryBoundary extends Component<{ locale: Locale; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (!this.state.failed) return this.props.children;
    const t = copy[this.props.locale];
    return <div className="inquiry-loading" role="alert"><p>{t.error}</p><a href={`mailto:${site.email}`}>{site.email}</a><div className="actions"><button type="button" className="button secondary" onClick={() => window.location.reload()}>{t.reload}</button></div></div>;
  }
}
