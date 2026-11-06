"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";

/**
 * Selector de idioma: enlaza a la misma ruta en el otro locale
 * (next-intl mantiene la ruta sin prefijo y aplica el nuevo prefijo).
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
      aria-label={t("label")}
      className="flex min-h-11 items-center rounded-full border border-borahae-primary px-4 py-2 text-sm font-medium text-borahae-primary hover:bg-borahae-primary/10"
    >
      {other === "ko" ? t("ko") : t("es")}
    </Link>
  );
}
