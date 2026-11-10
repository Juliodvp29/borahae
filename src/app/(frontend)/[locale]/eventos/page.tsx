import Link from "next/link";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getPayloadClient } from "@/lib/payload";
import { buildMetadata } from "@/lib/metadata";
import { cleanText } from "@/lib/markers";
import type { Event } from "@/payload-types";

/**
 * Listado de eventos gratuitos (AGENTS §5.3). Sin formulario en esta fase:
 * la inscripción real (18+ y cupo) llega en Fase 5; aquí solo se presenta
 * el contenido desde `events` con un aviso de "inscripción próximamente".
 */
export const revalidate = 300;

export default async function EventosPage({
  params,
}: PageProps<"/[locale]/eventos">) {
  const { locale } = await params;

  const [t, payload] = await Promise.all([
    getTranslations("events"),
    getPayloadClient(),
  ]);
  const res = await payload.find({
    collection: "events",
    locale: locale as "es" | "ko",
    fallbackLocale: "es",
    limit: 30,
  });
  const eventos = res.docs as Event[];

  const modalityLabel: Record<string, string> = {
    presencial: t("modalityPresencial"),
    virtual: t("modalityVirtual"),
    hibrido: t("modalityHibrido"),
  };

  return (
    <main className="flex-1">
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <p className="text-sm font-medium uppercase tracking-widest text-borahae-primary">
          {t("eyebrow")}
        </p>
        <h1 className="font-display mt-4 text-3xl text-borahae-text leading-snug md:text-5xl md:leading-tight">
          {t("title")}
        </h1>

        {eventos.length === 0 ? (
          <div className="mt-12 max-w-2xl rounded-xl border border-borahae-primary/15 bg-white p-6 md:p-8">
            <h2 className="font-display text-xl text-borahae-text">
              {t("emptyTitle")}
            </h2>
            <p className="mt-3 leading-relaxed text-borahae-text/90">
              {t("emptyText")}
            </p>
          </div>
        ) : (
          <ul className="mt-12 grid gap-6 md:grid-cols-2">
            {eventos.map((doc) => (
              <li key={doc.id}>
                <Link
                  href={`/eventos/${doc.slug}`}
                  className="group flex h-full flex-col rounded-xl border border-borahae-primary/15 bg-white p-6 transition-colors hover:border-borahae-primary/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-borahae-primary"
                >
                  <span className="inline-flex w-fit rounded-full bg-borahae-surface px-3 py-1 text-xs font-medium text-borahae-text/80">
                    {modalityLabel[doc.modality] ?? modalityLabel.presencial}
                  </span>
                  <span className="font-display mt-4 text-xl font-semibold text-borahae-primary group-hover:underline group-hover:underline-offset-4">
                    {doc.title}
                  </span>
                  {cleanText(doc.summary) && (
                    <span className="mt-3 text-base leading-relaxed text-borahae-text/80">
                      {cleanText(doc.summary)}
                    </span>
                  )}
                  {doc.capacityEnabled && doc.capacity && (
                    <span className="mt-2 text-sm text-borahae-text/70">
                      {t("capacityLabel")}:{" "}
                      {t("capacityValue", { count: doc.capacity })}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/eventos">): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale: locale as "es" | "ko",
    path: "/eventos",
  });
}
