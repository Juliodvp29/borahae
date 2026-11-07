"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";

/**
 * Selector de idioma: enlaza a la misma ruta en el otro locale
 * (next-intl mantiene la ruta sin prefijo y aplica el nuevo prefijo).
 * El globito es decorativo (aria-hidden); `hrefLang` declara el idioma
 * del destino a usuarios y motores de búsqueda.
 */
export function LanguageSwitcher() {
  const t = useTranslations("language");
  const locale = useLocale();
  const pathname = usePathname();
  const other = locale === "es" ? "ko" : "es";

  return (
    <Link
      href={pathname}
      locale={other}
      hrefLang={other}
      aria-label={t("label")}
      className="flex min-h-11 items-center gap-2 rounded-full border border-borahae-primary px-4 py-2 text-sm font-medium text-borahae-primary hover:bg-borahae-primary/10"
    >
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 24 24"
        className="size-4 shrink-0"
      >
        <circle
          cx="12"
          cy="12"
          r="9"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <ellipse
          cx="12"
          cy="12"
          rx="4"
          ry="9"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path
          d="M3 12h18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        />
      </svg>
      {other === "ko" ? t("ko") : t("es")}
    </Link>
  );
}
