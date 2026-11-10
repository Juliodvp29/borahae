import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getPayloadClient } from "@/lib/payload";
import { buildMetadata } from "@/lib/metadata";
import { cleanText } from "@/lib/markers";
import type { Sponsor } from "@/payload-types";

/**
 * Patrocinio (spec §6.9): sección preparada para activarse en el futuro.
 * GATE: solo con contenido si `site-settings.sponsorshipEnabled` está
 * activo; la ruta siempre responde (AGENTS §4 — nunca error al estar
 * desactivada). Propuesta de valor/beneficios: cuando los apruebe el
 * cliente, el editor los agrega desde /admin — nada inventado aquí.
 */
export const revalidate = 300;

export default async function PatrocinioPage({
  params,
}: PageProps<"/[locale]/patrocinio">) {
  const { locale } = await params;

  const [t, payload] = await Promise.all([
    getTranslations("sponsor"),
    getPayloadClient(),
  ]);
  const settings = await payload.findGlobal({ slug: "site-settings" });
  const habilitado = Boolean(settings?.sponsorshipEnabled);

  let sponsors: Sponsor[] = [];
  if (habilitado) {
    const res = await payload.find({
      collection: "sponsors",
      locale: locale as "es" | "ko",
      fallbackLocale: "es",
      sort: "order",
      limit: 30,
    });
    sponsors = res.docs as Sponsor[];
  }

  return (
    <main className="flex-1">
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <p className="text-sm font-medium uppercase tracking-widest text-borahae-primary">
          {t("eyebrow")}
        </p>
        <h1 className="font-display mt-4 text-3xl text-borahae-text leading-snug md:text-5xl md:leading-tight">
          {t("title")}
        </h1>

        {!habilitado ? (
          // Toggle desactivado: estado escueto, sin propuesta de valor.
          <div className="mt-12 max-w-2xl rounded-xl border border-borahae-primary/15 bg-white p-6 md:p-8">
            <h2 className="font-display text-xl text-borahae-text">
              {t("disabledTitle")}
            </h2>
            <p className="mt-3 leading-relaxed text-borahae-text/90">
              {t("disabledText")}
            </p>
            <Link
              href="/contacto"
              className="mt-6 inline-flex min-h-11 items-center rounded-full bg-borahae-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-borahae-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-borahae-text"
            >
              {t("ctaButton")}
            </Link>
          </div>
        ) : (
          <>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-borahae-text/85">
              {t("intro")}
            </p>

            {sponsors.length === 0 ? (
              <div className="mt-12 max-w-2xl rounded-xl border border-borahae-primary/15 bg-white p-6 md:p-8">
                <h2 className="font-display text-xl text-borahae-text">
                  {t("emptyTitle")}
                </h2>
                <p className="mt-3 leading-relaxed text-borahae-text/90">
                  {t("emptyText")}
                </p>
              </div>
            ) : (
              <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {sponsors.map((doc) => (
                  <li
                    key={doc.id}
                    className="rounded-xl border border-borahae-primary/15 bg-white p-6"
                  >
                    {doc.logo && typeof doc.logo !== "number" && doc.logo.url && (
                      <Image
                        src={doc.logo.url as string}
                        alt={doc.logo.alt || doc.name}
                        width={320}
                        height={120}
                        className="max-h-20 w-auto object-contain"
                        sizes="(min-width: 1024px) 20rem, 100vw"
                      />
                    )}
                    <h2 className="font-display text-lg text-borahae-text">
                      {doc.name}
                    </h2>
                    {cleanText(doc.description) && (
                      <p className="mt-2 text-sm leading-relaxed text-borahae-text/80">
                        {cleanText(doc.description)}
                      </p>
                    )}
                    {doc.website && /^https?:\/\//i.test(doc.website) && (
                      <a
                        href={doc.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-block text-sm text-borahae-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-borahae-text"
                      >
                        {t("visitWebsite")}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {habilitado && (
          <aside className="mt-16 max-w-3xl rounded-xl border border-borahae-primary/15 bg-borahae-surface p-6 md:p-8">
            <h2 className="font-display text-xl text-borahae-text">
              {t("ctaTitle")}
            </h2>
            <p className="mt-3 leading-relaxed text-borahae-text/90">
              {t("ctaText")}
            </p>
            <Link
              href="/contacto"
              className="mt-6 inline-flex min-h-11 items-center rounded-full bg-borahae-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-borahae-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-borahae-text"
            >
              {t("ctaButton")}
            </Link>
          </aside>
        )}
      </section>
    </main>
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/patrocinio">): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale: locale as "es" | "ko",
    path: "/patrocinio",
  });
}
