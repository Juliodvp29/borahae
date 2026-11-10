import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { toRichTextData } from "@/lib/richtext";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { getPayloadClient, getSiteSettings } from "@/lib/payload";
import { buildMetadata } from "@/lib/metadata";
import type { Page } from "@/payload-types";

/**
 * ISR: el contenido viene del CMS (recién editado se sirve hasta 5 min
 * después); los hooks de revalidación de la colección pages invalidan
 * la ruta al publicar si el runtime lo soporta.
 */
export const revalidate = 300;

/**
 * Página de inicio. Lee el documento `pages/inicio` (título/intro/presentación
 * y banner editables en CMS). Si el documento no existe, cae a los textos
 * fijos de next-intl para que la home nunca quede en blanco.
 */
export default async function HomePage({
  params,
}: PageProps<"/[locale]">) {
  const { locale } = await params;

  const [t, payload, settings] = await Promise.all([
    getTranslations("home"),
    getPayloadClient(),
    getSiteSettings(),
  ]);

  const inicio = await payload.find({
    collection: "pages",
    where: { slug: { equals: "inicio" } },
    locale: locale as "es" | "ko",
    fallbackLocale: "es",
    limit: 1,
  });
  const doc = inicio.docs[0] as Page | undefined;

  const bannerDesktop =
    doc?.bannerDesktop &&
    typeof doc.bannerDesktop !== "number" &&
    doc.bannerDesktop.url
      ? doc.bannerDesktop
      : null;
  const bannerMobile =
    doc?.bannerMobile &&
    typeof doc.bannerMobile !== "number" &&
    doc.bannerMobile.url
      ? doc.bannerMobile
      : null;

  const cards = [
    {
      href: "/programas",
      title: t("ctaProgramsTitle"),
      text: t("ctaProgramsText"),
    },
    { href: "/viajes", title: t("ctaToursTitle"), text: t("ctaToursText") },
    {
      href: "/eventos",
      title: t("ctaEventsTitle"),
      text: t("ctaEventsText"),
    },
  ];

  return (
    <main className="flex-1">
      {/* Hero: banner + presentación */}
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:items-center">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-borahae-primary">
            {t("eyebrow")}
          </p>
          <h1 className="font-display mt-4 text-borahae-text text-3xl leading-snug md:text-5xl md:leading-tight">
            {doc?.title ?? t("title")}
          </h1>
          <p className="mt-6 max-w-2xl border-l-4 border-borahae-secondary pl-5 text-lg leading-relaxed text-borahae-text/80 md:pl-6">
            {doc?.summary ?? t("intro")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/programas">{t("ctaPrograms")}</Button>
            <Button href="/contacto" variant="outline">
              {t("ctaContact")}
            </Button>
          </div>
        </div>

        {/* Banner editable (CMS); fallback a los WebP empacados. En móvil y
            escritorio se elige por media query para servir solo el necesario. */}
        <figure className="hidden lg:block">
          <Image
            src={bannerDesktop?.url ?? "/images/banner-web.webp"}
            alt={bannerDesktop?.alt || t("bannerAlt")}
            width={2560}
            height={1440}
            sizes="(min-width: 1024px) 28rem"
            className="h-auto w-full rounded-xl bg-white"
            priority
          />
        </figure>
        <figure className="lg:hidden">
          <Image
            src={bannerMobile?.url ?? "/images/banner-mobile.webp"}
            alt={bannerMobile?.alt || bannerDesktop?.alt || t("bannerAlt")}
            width={1350}
            height={1080}
            sizes="100vw"
            className="mx-auto h-auto w-full max-w-md rounded-xl bg-white"
            priority
          />
        </figure>
      </section>

      {/* Presentación editable (`pages/inicio` → Contenido) */}
      {doc?.content && (doc.content as { root?: { children?: unknown[] } }).root && (
        <section className="mx-auto max-w-6xl px-6">
          <div className="max-w-3xl text-lg leading-relaxed text-borahae-text/90 [&_h2]:font-display [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-xl [&_h3]:font-display [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:my-4">
            <RichText data={toRichTextData(doc.content)} />
          </div>
        </section>
      )}

      {/* Destacados: accesos a las secciones principales */}
      <section
        aria-labelledby="destacados"
        className="mx-auto max-w-6xl px-6 py-16 md:py-20"
      >
        <h2
          id="destacados"
          className="font-display text-borahae-text text-2xl md:text-3xl"
        >
          {t("highlightsTitle")}
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group flex min-h-44 flex-col rounded-xl border border-borahae-primary/15 bg-white p-6 transition-colors hover:border-borahae-primary/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-borahae-primary"
            >
              <span className="font-display text-borahae-primary text-xl font-semibold group-hover:underline group-hover:underline-offset-4">
                {card.title}
              </span>
              <span className="mt-3 text-base leading-relaxed text-borahae-text/80">
                {card.text}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Redes (site-settings): solo aparecen si el editor cargó enlaces */}
      {settings.socialLinks && settings.socialLinks.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-20">
          <h2 className="sr-only">{t("socialTitle")}</h2>
          <ul className="flex flex-wrap gap-3">
            {settings.socialLinks.map((social) => (
              <li key={social.id}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-11 items-center rounded-lg border border-borahae-primary/15 bg-white px-4 text-base font-medium text-borahae-primary transition-colors hover:bg-borahae-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-borahae-primary"
                >
                  {social.platform.charAt(0).toUpperCase() +
                    social.platform.slice(1)}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const [t, payload] = await Promise.all([
    getTranslations("home"),
    getPayloadClient(),
  ]);
  const inicio = await payload.find({
    collection: "pages",
    where: { slug: { equals: "inicio" } },
    locale: locale as "es" | "ko",
    fallbackLocale: "es",
    limit: 1,
  });
  const doc = inicio.docs[0] as Page | undefined;
  return buildMetadata({
    locale: locale as "es" | "ko",
    path: "/",
    title: doc?.seoTitle || doc?.title || t("title"),
    description:
      doc?.seoDescription || doc?.summary || t("metaDescriptionFallback"),
  });
}
