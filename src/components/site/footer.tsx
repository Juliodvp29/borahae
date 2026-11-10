import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

/**
 * Footer institucional: identidad, navegación de cierre y legal.
 * El correo institucional y enlaces de redes son [PENDIENTE-CLIENTE];
 * el botón de WhatsApp se añade condicionado a `site-settings` en Fase 4.
 *
 * El año se congela al de build (páginas estáticas); es aceptable porque
 * solo cambia cada 12 meses y el build se ejecuta en cada despliegue.
 * Si alguna página pasa a ISR muy largo, revisar aquí (hallazgo P3 del
 * critique 2026-11-06).
 */
export async function Footer() {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer className="bg-borahae-primary text-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-display text-xl font-semibold tracking-wide">
              BORAHAE
            </p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/80">
              {t("tagline")}
            </p>
          </div>

          <div className="flex flex-col text-sm">
            <Link
              href="/contacto"
              className="inline-flex min-h-11 items-center self-start text-white/90 hover:text-white hover:underline underline-offset-4"
            >
              {tNav("contact")}
            </Link>
            <Link
              href="/legal"
              className="inline-flex min-h-11 items-center self-start text-white/90 hover:text-white hover:underline underline-offset-4"
            >
              {t("legal")}
            </Link>
          </div>
        </div>

        <p className="mt-10 border-t border-white/20 pt-6 text-xs text-white/70">
          {t("rights", { year })}
        </p>
      </div>
    </footer>
  );
}
