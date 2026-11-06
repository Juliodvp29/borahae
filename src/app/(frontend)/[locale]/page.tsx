import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

/**
 * Página de inicio provisional: solo garantiza jerarquía semántica
 * (un único h1) y CTA. El contenido real se define en Fase 4.
 */
export default async function HomePage({
  params,
}: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");

  return (
    <main id="contenido-principal" className="flex-1">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <p className="font-display text-borahae-primary text-sm tracking-widest uppercase">
          BORAHAE
        </p>
        <h1 className="font-display text-borahae-text mt-4 text-3xl leading-snug md:text-5xl md:leading-tight">
          {t("title")}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-borahae-text/80">
          {t("intro")}
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/programas"
            className="rounded-full bg-borahae-primary px-6 py-3 text-sm font-medium text-white hover:bg-borahae-primary-hover"
          >
            {t("ctaPrograms")}
          </Link>
          <Link
            href="/contacto"
            className="rounded-full border border-borahae-primary px-6 py-3 text-sm font-medium text-borahae-primary hover:bg-borahae-primary/10"
          >
            {t("ctaContact")}
          </Link>
        </div>
      </div>
    </main>
  );
}
