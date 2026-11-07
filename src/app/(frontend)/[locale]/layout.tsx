import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import "@/styles/globals.css";
import { notoSansKr, notoSerifKr } from "@/lib/fonts";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * Root layout del sitio público. Cada locale es una ruta estática:
 * /es → español (por defecto), /ko → coreano. Rutas inválidas → 404.
 */
export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("header");

  return (
    <html
      lang={locale}
      className={`${notoSansKr.variable} ${notoSerifKr.variable} h-full antialiased`}
    >
      {/* suppressHydrationWarning: las extensiones del navegador inyectan
          atributos en <body> (p. ej. cz-shortcut-listen) antes de la
          hidratación; solo silencia esa diferencia a nivel de atributos. */}
      <body
        className="min-h-full flex flex-col font-sans"
        suppressHydrationWarning
      >
        <NextIntlClientProvider>
          <a
            href="#contenido-principal"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-borahae-primary focus:px-4 focus:py-2 focus:text-white"
          >
            {t("skipToContent")}
          </a>
          <Header />
          <div
            id="contenido-principal"
            tabIndex={-1}
            className="flex flex-1 flex-col focus:outline-none"
          >
            {children}
          </div>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

/** Metadatos únicos por idioma (AGENTS.md §5.1). hreflang se añade en Fase 4. */
export async function generateMetadata({
  params,
}: Omit<LayoutProps<"/[locale]">, "children">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    title: t("title"),
    description: t("description"),
  };
}
