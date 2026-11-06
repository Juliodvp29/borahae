import { getTranslations, setRequestLocale } from "next-intl/server";
import { Button } from "@/components/ui/button";

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
    <main className="flex-1">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <p className="text-sm font-medium uppercase tracking-widest text-borahae-primary">
          {t("eyebrow")}
        </p>
        <div className="mt-4 border-l-4 border-borahae-secondary pl-5 md:pl-6">
          <h1 className="font-display text-borahae-text text-3xl leading-snug md:text-5xl md:leading-tight">
            {t("title")}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-borahae-text/80">
            {t("intro")}
          </p>
        </div>
        <div className="mt-10 flex flex-wrap gap-4">
          <Button href="/programas">{t("ctaPrograms")}</Button>
          <Button href="/contacto" variant="outline">
            {t("ctaContact")}
          </Button>
        </div>
      </div>
    </main>
  );
}
