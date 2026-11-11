import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { toRichTextData } from "@/lib/richtext";
import { getPayloadClient } from "@/lib/payload";
import { buildMetadata, jsonLdEvent } from "@/lib/metadata";
import { cleanText } from "@/lib/markers";
import { EventRegistrationForm } from "@/components/site/event-registration-form";
import type { Event } from "@/payload-types";

/**
 * Detalle de evento (AGENTS §5.3): modalidad, lugar, fechas y descripción
 * desde `events`, con formulario de inscripción (18+, cupo). La edad se
 * valida en el endpoint; aquí solo se pre-verifica el cupo para mostrar
 * "agotado" sin formulario. Doc inexistente → 404.
 */
export const revalidate = 300;

function formatearFecha(buscar: string | null | undefined, locale: string): string {
  if (!buscar) return "";
  const fecha = new Date(buscar);
  if (Number.isNaN(fecha.getTime())) return "";
  return new Intl.DateTimeFormat(locale === "ko" ? "ko-KR" : "es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(fecha);
}

export default async function EventoPage({
  params,
}: PageProps<"/[locale]/eventos/[slug]">) {
  const { locale, slug } = await params;

  const [t, payload] = await Promise.all([
    getTranslations("events"),
    getPayloadClient(),
  ]);
  const res = await payload.find({
    collection: "events",
    where: { slug: { equals: slug } },
    locale: locale as "es" | "ko",
    fallbackLocale: "es",
    limit: 1,
  });
  const doc = res.docs[0] as Event | undefined;
  if (!doc) notFound();

  const modalityLabel: Record<string, string> = {
    presencial: t("modalityPresencial"),
    virtual: t("modalityVirtual"),
    hibrido: t("modalityHibrido"),
  };
  const fechaInicio = formatearFecha(doc.dateStart, locale);
  const fechaFin = formatearFecha(doc.dateEnd, locale);
  const fechas =
    fechaInicio && fechaFin && fechaInicio !== fechaFin
      ? `${fechaInicio} – ${fechaFin}`
      : fechaInicio;
  const lugar = cleanText(doc.location);
  const cover =
    doc.cover && typeof doc.cover !== "number" && doc.cover.url ? doc.cover : null;

  // Pre-verificación del cupo (ISR 300 s): si está lleno, mostramos "agotado"
  // sin formulario; el endpoint vuelve a verificarlo en transacción.
  const cupoLleno =
    doc.capacityEnabled &&
    typeof doc.capacity === "number" &&
    (await payload.count({
      collection: "event-registrations",
      where: { event: { equals: doc.id } },
    })).totalDocs >= doc.capacity;

  return (
    <main className="flex-1">
      {/* Datos estructurados del evento (JSON-LD, AGENTS §5.6): solo datos
          públicos del CMS; el registro (privado) no aparece aquí. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            jsonLdEvent({
              locale: locale as "es" | "ko",
              slug: doc.slug ?? "",
              title: doc.title ?? "",
              description: cleanText(doc.summary) || undefined,
              modality: doc.modality,
              dateStart: doc.dateStart ?? null,
              dateEnd: doc.dateEnd ?? null,
              location: lugar || null,
              locationUrl: doc.locationUrl ?? null,
              coverUrl:
                cover && typeof cover.url === "string" ? cover.url : null,
            }),
          ),
        }}
      />
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <p className="text-sm font-medium uppercase tracking-widest text-borahae-primary">
          {t("eyebrow")}
        </p>
        <h1 className="font-display mt-4 text-3xl text-borahae-text leading-snug md:text-5xl md:leading-tight">
          {doc.title}
        </h1>
        <p className="mt-4 inline-flex rounded-full bg-borahae-surface px-4 py-1.5 text-sm font-medium text-borahae-text/80">
          {modalityLabel[doc.modality] ?? modalityLabel.presencial}
        </p>

        {(fechas || lugar) && (
          <dl className="mt-8 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
            {fechas && (
              <div>
                <dt className="text-sm font-medium uppercase tracking-wide text-borahae-text/60">
                  {t("datesLabel")}
                </dt>
                <dd className="mt-1 text-lg text-borahae-text">{fechas}</dd>
              </div>
            )}
            {lugar && (
              <div>
                <dt className="text-sm font-medium uppercase tracking-wide text-borahae-text/60">
                  {t("locationLabel")}
                </dt>
                <dd className="mt-1 text-lg text-borahae-text">
                  {lugar}
                  {doc.locationUrl && /^https?:\/\//i.test(doc.locationUrl) && (
                    <>
                      {" · "}
                      <a
                        href={doc.locationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-borahae-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-borahae-text"
                      >
                        {doc.locationUrl}
                      </a>
                    </>
                  )}
                </dd>
              </div>
            )}
            {doc.capacityEnabled && doc.capacity && (
              <div>
                <dt className="text-sm font-medium uppercase tracking-wide text-borahae-text/60">
                  {t("capacityLabel")}
                </dt>
                <dd className="mt-1 text-lg text-borahae-text">
                  {t("capacityValue", { count: doc.capacity })}
                </dd>
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
          <div className="mt-12 max-w-[72ch] text-base leading-relaxed text-borahae-text/90 [&_h2]:font-display [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:text-borahae-text [&_h3]:font-display [&_h3]:mt-6 [&_h3]:mb-2 [&_li]:my-2 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6">
            <RichText data={toRichTextData(doc.content)} />
          </div>
        )}

        <aside className="mt-14 max-w-3xl">
          <h2 className="font-display text-xl text-borahae-text">
            {t("registrationTitle")}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-borahae-text/70">
            {t("adultNote")}
          </p>
          <div className="mt-5">
            {cupoLleno ? (
              <p
                role="status"
                className="rounded-xl border border-borahae-primary/15 bg-white p-6 text-base leading-relaxed text-borahae-text"
              >
                {t("fullNotice")}
              </p>
            ) : (
              <EventRegistrationForm
                eventSlug={doc.slug}
                eventModality={doc.modality}
                locale={locale as "es" | "ko"}
              />
            )}
          </div>
        </aside>

        <p className="mt-12">
          <Link
            href="/eventos"
            className="text-borahae-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-borahae-text"
          >
            {t("backToEvents")}
          </Link>
        </p>
      </section>
    </main>
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/eventos/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: "events",
    where: { slug: { equals: slug } },
    locale: locale as "es" | "ko",
    fallbackLocale: "es",
    limit: 1,
  });
  const doc = res.docs[0] as Event | undefined;
  return buildMetadata({
    locale: locale as "es" | "ko",
    path: `/eventos/${slug}`,
    title: doc?.seoTitle || doc?.title || undefined,
    description: doc?.seoDescription || doc?.summary || undefined,
  });
}
