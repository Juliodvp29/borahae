import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getPayloadClient } from "@/lib/payload";
import { buildMetadata } from "@/lib/metadata";
import { cleanText } from "@/lib/markers";
import type { Gallery as GalleryDoc, SiteSetting } from "@/payload-types";

/**
 * Galería (spec §6.7): fotos autorizadas por el cliente, GATE por
 * `site-settings.galleryEnabled` (el header ya oculta el item del menú;
 * la ruta siempre responde con estado escueto — nunca 404).
 * Mapa de imagen fija, `sizes` por columna, alt = pie de foto editable
 * es/ko con fallback (AGENTS §5.4). Videos: fuera de alcance (spec los
 * deja "si se requieren" y el cliente no los pidió).
 */
export const revalidate = 300;

export default async function GaleriaPage({
  params,
}: PageProps<"/[locale]/galeria">) {
  const { locale } = await params;

  const [t, payload] = await Promise.all([
    getTranslations("gallery"),
    getPayloadClient(),
  ]);
  const settings: SiteSetting | null = await payload
    .findGlobal({ slug: "site-settings" })
    .catch(() => null);
  const habilitado = Boolean(settings?.galleryEnabled);

  let fotos: GalleryDoc[] = [];
  if (habilitado) {
    const res = await payload.find({
      collection: "gallery",
      locale: locale as "es" | "ko",
      fallbackLocale: "es",
      sort: "order",
      limit: 60,
      depth: 1,
    });
    fotos = res.docs as GalleryDoc[];
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
          <div className="mt-12 max-w-2xl rounded-xl border border-borahae-primary/15 bg-white p-6 md:p-8">
            <h2 className="font-display text-xl text-borahae-text">
              {t("disabledTitle")}
            </h2>
            <p className="mt-3 leading-relaxed text-borahae-text/90">
              {t("disabledText")}
            </p>
          </div>
        ) : (
          <>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-borahae-text/85">
              {t("intro")}
            </p>

            {fotos.length === 0 ? (
              <div className="mt-12 max-w-2xl rounded-xl border border-borahae-primary/15 bg-white p-6 md:p-8">
                <h2 className="font-display text-xl text-borahae-text">
                  {t("emptyTitle")}
                </h2>
                <p className="mt-3 leading-relaxed text-borahae-text/90">
                  {t("emptyText")}
                </p>
              </div>
            ) : (
              <ul className="mt-12 columns-1 gap-6 sm:columns-2 lg:columns-3 [&>li]:mb-6 [&>li]:break-inside-avoid">
                {fotos.map((doc) => {
                  const media =
                    doc.image && typeof doc.image !== "number" ? doc.image : null;
                  if (!media?.url) return null;
                  const pie =
                    cleanText(doc.caption) || t("noCaptionFallback");
                  return (
                    <li key={doc.id}>
                      <figure className="rounded-xl border border-borahae-primary/10 bg-white p-3">
                        <Image
                          src={media.url}
                          alt={media.alt || pie}
                          width={media.width ?? 1200}
                          height={media.height ?? 900}
                          className="w-full rounded-lg object-cover"
                          sizes="(min-width: 1024px) 20rem, (min-width: 640px) 30rem, 100vw"
                        />
                        <figcaption className="mt-3 px-1 pb-1 text-sm leading-relaxed text-borahae-text/80">
                          {pie}
                        </figcaption>
                      </figure>
                    </li>
                  );
                })}
              </ul>
            )}

            <p className="mt-12">
              <Link
                href="/eventos"
                className="text-borahae-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-borahae-text"
              >
                {t("ctaEvents")}
              </Link>
            </p>
          </>
        )}
      </section>
    </main>
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/galeria">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({
    locale: locale as "es" | "ko",
    path: "/galeria",
    title: t("pageTitles.galeria"),
    description: t("pageDescriptions.galeria"),
  });
}
