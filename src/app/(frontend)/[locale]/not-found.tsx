import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

/**
 * 404 del sitio público. Se renderiza dentro de `[locale]/layout.tsx`,
 * que ya ejecuta `setRequestLocale`, así que las traducciones funcionan
 * de forma estática. Una URL sin idioma válido (/xx) no llega aquí sin
 * pasar por el proxy: next-intl redirige a /es/xx y cae en este boundary.
 */
export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <main className="flex-1">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center md:py-32">
        <p
          aria-hidden="true"
          className="font-display text-7xl font-semibold text-borahae-secondary md:text-8xl"
        >
          404
        </p>
        <h1 className="font-display mt-6 text-borahae-text text-3xl md:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-4 max-w-md text-lg leading-relaxed text-borahae-text/80">
          {t("text")}
        </p>
        <Link
          href="/"
          className="mt-10 flex min-h-11 items-center rounded-lg bg-borahae-primary px-5 text-base font-medium text-white transition-colors hover:bg-borahae-primary-hover focus-visible:bg-borahae-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-borahae-primary"
        >
          {t("back")}
        </Link>
      </div>
    </main>
  );
}
