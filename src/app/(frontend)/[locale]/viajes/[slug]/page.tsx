import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { toRichTextData } from "@/lib/richtext";
import { getPayloadClient } from "@/lib/payload";
import { buildMetadata } from "@/lib/metadata";
import { cleanText } from "@/lib/markers";
import type { Tour } from "@/payload-types";

/**
 * Detalle de viaje (AGENTS §4): fechas, destino, itinerario, incluye/no
 * incluye y nota de precios — todo desde `tours`. La inscripción formal es
 * fuera de alcance (fase 2 del negocio): solo CTA de interés → /contacto.
 * Nuevos slugs funcionan solos (sin whitelist); doc inexistente → 404.
 */
export const revalidate = 300;

function formatearFecha(iso: string | null | undefined, locale: string): string {
  if (!iso) return "";
  const fecha = new Date(iso);
  if (Number.isNaN(fecha.getTime())) return "";
  return new Intl.DateTimeFormat(locale === "ko" ? "ko-KR" : "es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(fecha);
}

export default async function TourPage({
  params,
}: PageProps<"/[locale]/viajes/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [t, tNav, payload] = await Promise.all([
    getTranslations("tours"),
    getTranslations("nav"),
    getPayloadClient(),
  ]);
  const res = await payload.find({
    collection: "tours",
    where: { slug: { equals: slug } },
    locale: locale as "es" | "ko",
    fallbackLocale: "es",
    limit: 1,
  });
  const doc = res.docs[0] as Tour | undefined;
  if (!doc) notFound();

  const stateLabel: Record<string, string> = {
    upcoming: t("stateUpcoming"),
    open: t("stateOpen"),
    closed: t("stateClosed"),
  };
  const fechaInicio = formatearFecha(doc.dateStart, locale);
  const fechaFin = formatearFecha(doc.dateEnd, locale);
  const fechas =
    fechaInicio && fechaFin && fechaInicio !== fechaFin
      ? `${fechaInicio} – ${fechaFin}`
      : fechaInicio;
  const itinerario = [...(doc.itinerary ?? [])].sort(
    (a, b) => (a?.day ?? 0) - (b?.day ?? 0),
  );
  const incluye = cleanText(doc.includes)
    .split("\n")
    .map((linea) => linea.trim())
    .filter(Boolean);
  const noIncluye = cleanText(doc.excludes)
    .split("\n")
    .map((linea) => linea.trim())
    .filter(Boolean);
  const price = cleanText(doc.priceNote);
  const cover =
    doc.cover && typeof doc.cover !== "number" && doc.cover.url ? doc.cover : null;

  return (
    <main className="flex-1">
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <p className="text-sm font-medium uppercase tracking-widest text-borahae-primary">
          {t("eyebrow")}
        </p>
        <h1 className="font-display mt-4 text-3xl text-borahae-text leading-snug md:text-5xl md:leading-tight">
          {doc.title}
        </h1>
        <p className="mt-4 inline-flex rounded-full bg-borahae-surface px-4 py-1.5 text-sm font-medium text-borahae-text/80">
          {stateLabel[doc.state] ?? t("stateUpcoming")}
        </p>

        {(cleanText(doc.destination) || fechas) && (
          <dl className="mt-8 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
            {cleanText(doc.destination) && (
              <div>
                <dt className="text-sm font-medium uppercase tracking-wide text-borahae-text/60">
                  {t("destinationLabel")}
                </dt>
                <dd className="mt-1 text-lg text-borahae-text">
                  {cleanText(doc.destination)}
                </dd>
              </div>
            )}
            {fechas && (
              <div>
                <dt className="text-sm font-medium uppercase tracking-wide text-borahae-text/60">
                  {t("datesLabel")}
                </dt>
                <dd className="mt-1 text-lg text-borahae-text">{fechas}</dd>
              </div>
            )}
          </dl>
        )}

        {cleanText(doc.summary) && (
          <p className="mt-8 max-w-3xl border-l-4 border-borahae-secondary pl-5 text-lg leading-relaxed text-borahae-text/80 md:pl-6">
            {cleanText(doc.summary)}
          </p>
        )}

        {cover && (
          <figure className="mt-10">
            <Image
              src={cover.url as string}
              alt={cover.alt || doc.title || ""}
              width={1280}
              height={720}
              className="w-full rounded-xl bg-white object-cover"
              sizes="(min-width: 1024px) 64rem, 100vw"
            />
          </figure>
        )}

        {doc.content && (
          <div className="mt-12 max-w-3xl text-base leading-relaxed text-borahae-text/90 [&_h2]:font-display [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:text-borahae-text [&_h3]:font-display [&_h3]:mt-6 [&_h3]:mb-2 [&_li]:my-2 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6">
            <RichText data={toRichTextData(doc.content)} />
          </div>
        )}

        {itinerario.length > 0 && (
          <section aria-labelledby="itinerario-titulo" className="mt-14">
            <h2
              id="itinerario-titulo"
              className="font-display text-2xl text-borahae-text"
            >
              {t("itineraryTitle")}
            </h2>
            <ol className="mt-6 space-y-4">
              {itinerario.map((dia, idx) => (
                <li
                  key={dia.id ?? idx}
                  className="rounded-xl border border-borahae-primary/15 bg-white p-6"
                >
                  <p className="text-sm font-medium uppercase tracking-wide text-borahae-primary">
                    {t("dayLabel")} {dia.day}
                  </p>
                  {cleanText(dia.title) && (
                    <h3 className="font-display mt-1 text-lg text-borahae-text">
                      {cleanText(dia.title)}
                    </h3>
                  )}
                  {cleanText(dia.description) && (
                    <p className="mt-2 leading-relaxed text-borahae-text/90">
                      {cleanText(dia.description)}
                    </p>
                  )}
                </li>
              ))}
            </ol>
          </section>
        )}

        {(incluye.length > 0 || noIncluye.length > 0) && (
          <section className="mt-14 grid gap-6 md:grid-cols-2">
            {incluye.length > 0 && (
              <div className="rounded-xl border border-borahae-primary/15 bg-white p-6">
                <h2 className="font-display text-xl text-borahae-text">
                  {t("includesTitle")}
                </h2>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-borahae-text/90">
                  {incluye.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {noIncluye.length > 0 && (
              <div className="rounded-xl border border-borahae-primary/15 bg-white p-6">
                <h2 className="font-display text-xl text-borahae-text">
                  {t("excludesTitle")}
                </h2>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-borahae-text/90">
                  {noIncluye.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {price && (
          <section aria-labelledby="precio-titulo" className="mt-10 max-w-3xl">
            <h2
              id="precio-titulo"
              className="font-display text-xl text-borahae-text"
            >
              {t("priceNoteTitle")}
            </h2>
            <p className="mt-3 leading-relaxed text-borahae-text/90">{price}</p>
          </section>
        )}

        <aside className="mt-14 max-w-3xl rounded-xl border border-borahae-primary/15 bg-borahae-surface p-6 md:p-8">
          <h2 className="font-display text-xl text-borahae-text">
            {t("ctaInterest")}
          </h2>
          <p className="mt-3 leading-relaxed text-borahae-text/90">
            {t("ctaInterestText")}
          </p>
          <Link
            href="/contacto"
            className="mt-6 inline-flex min-h-11 items-center rounded-full bg-borahae-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-borahae-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-borahae-text"
          >
            {tNav("contact")}
          </Link>
        </aside>

        <p className="mt-12">
          <Link
            href="/viajes"
            className="text-borahae-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-borahae-text"
          >
            {t("backToTours")}
          </Link>
        </p>
      </section>
    </main>
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/viajes/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: "tours",
    where: { slug: { equals: slug } },
    locale: locale as "es" | "ko",
    fallbackLocale: "es",
    limit: 1,
  });
  const doc = res.docs[0] as Tour | undefined;
  return buildMetadata({
    locale: locale as "es" | "ko",
    path: `/viajes/${slug}`,
    title: doc?.seoTitle || doc?.title || undefined,
    description: doc?.seoDescription || doc?.summary || undefined,
  });
}
