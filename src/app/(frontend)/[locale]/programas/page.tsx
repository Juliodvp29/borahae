import Link from "next/link";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getPayloadClient } from "@/lib/payload";
import { buildMetadata } from "@/lib/metadata";
import type { Program } from "@/payload-types";

/**
 * Hub de Programas (AGENTS §4): tarjetas con nombre, resumen y estado
 * editados en el CMS. El detalle vive en /programas/[slug]; el editor
 * marca cada programa como `upcoming` hasta que haya contenido definitivo.
 */
export const revalidate = 300;

export default async function ProgramasPage({
  params,
}: PageProps<"/[locale]/programas">) {
  const { locale } = await params;

  const [t, payload] = await Promise.all([
    getTranslations("programs"),
    getPayloadClient(),
  ]);
  const res = await payload.find({
    collection: "programs",
    locale: locale as "es" | "ko",
    fallbackLocale: "es",
    where: { state: { in: ["upcoming", "active", "paused"] } },
    limit: 10,
  });
  const programas = res.docs as Program[];

  const stateLabel: Record<string, string> = {
    upcoming: t("comingSoon"),
    active: t("stateActive"),
    paused: t("statePaused"),
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

        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {programas.map((p) => (
            <li key={p.id}>
              <Link
                href={`/programas/${p.slug}`}
                className="group flex h-full flex-col rounded-xl border border-borahae-primary/15 bg-white p-6 transition-colors hover:border-borahae-primary/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-borahae-primary"
              >
                <span className="inline-flex w-fit rounded-full bg-borahae-surface px-3 py-1 text-xs font-medium text-borahae-text/80">
                  {stateLabel[p.state] ?? t("comingSoon")}
                </span>
                <span className="font-display mt-4 text-xl font-semibold text-borahae-primary group-hover:underline group-hover:underline-offset-4">
                  {p.title}
                </span>
                {p.summary && (
                  <span className="mt-3 text-base leading-relaxed text-borahae-text/80">
                    {p.summary}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/programas">): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale: locale as "es" | "ko",
    path: "/programas",
  });
}
