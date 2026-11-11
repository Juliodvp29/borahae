import Link from "next/link";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getPayloadClient } from "@/lib/payload";
import { buildMetadata } from "@/lib/metadata";
import { cleanText } from "@/lib/markers";
import { LEGAL_DOCUMENT_SLUGS, type LegalDocumentSlug } from "@/lib/legal";
import type { SiteSetting } from "@/payload-types";

/**
 * Hub legal (spec §6.10): identidad de la ESAL (site-settings) + índice de
 * los 3 documentos legales. Cada documento se publica solo cuando su
 * texto esté aprobado por el cliente (AGENTS §5.1/§10) — pendiente →
 * "Disponible próximamente", sin enlace y sin marcadores al público.
 *
 * NOTA: el título/intro de este hub son textos de interfaz (next-intl):
 * el seed de la doc `pages/legal` trae contenido ficticio demarcado cuyo
 * interior podría filtrarse aunque se limpien los marcadores — la doc CMS
 * de páginas queda sin uso público (decisión 2026-11-10).
 */
export const revalidate = 300;

/** Nombre público de cada documento cuando el CMS aún no lo tiene. */
const docLabels = {
  "politica-de-tratamiento-de-datos": "docPolitica",
  "terminos-y-condiciones": "docTerminos",
  "condiciones-de-viaje": "docViaje",
} as const satisfies Record<LegalDocumentSlug, string>;

export default async function LegalPage({
  params,
}: PageProps<"/[locale]/legal">) {
  const { locale } = await params;

  const [t, payload] = await Promise.all([
    getTranslations("legal"),
    getPayloadClient(),
  ]);

  const settings = (await payload.findGlobal({
    slug: "site-settings",
  })) as SiteSetting | null;

  // Documentos publicados de la colección legal-docs, por slug.
  const res = await payload.find({
    collection: "legal-docs",
    where: { _status: { equals: "published" } },
    locale: locale as "es" | "ko",
    fallbackLocale: "es",
    limit: 10,
    depth: 0,
  });
  const publicados = new Map(
    (res.docs as Array<{ slug: string; title: string }>).map((d) => [
      d.slug as LegalDocumentSlug,
      d,
    ]),
  );

  const identidad: Array<[string, string]> = [
    [t("legalNameLabel"), cleanText(settings?.legalName)],
    [t("nitLabel"), cleanText(settings?.nit)],
    [t("cityLabel"), cleanText(settings?.city)],
  ];
  const tieneIdentidad = identidad.some(([, valor]) => valor);

  return (
    <main className="flex-1">
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <p className="text-sm font-medium uppercase tracking-widest text-borahae-primary">
          {t("eyebrow")}
        </p>
        <h1 className="font-display mt-4 text-3xl text-borahae-text leading-snug md:text-5xl md:leading-tight">
          {t("title")}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-borahae-text/85">
          {t("intro")}
        </p>

        {tieneIdentidad && (
          <div className="mt-12 max-w-2xl rounded-xl border border-borahae-primary/15 bg-white p-6 md:p-8">
            <h2 className="font-display text-xl text-borahae-text">
              {t("identityTitle")}
            </h2>
            <dl className="mt-4 space-y-3">
              {identidad.map(([etiqueta, valor]) => (
                <div key={etiqueta} className="flex justify-between gap-6">
                  <dt className="text-sm font-medium uppercase tracking-wide text-borahae-text/60">
                    {etiqueta}
                  </dt>
                  <dd className="text-right text-borahae-text">
                    {valor || "—"}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        <div className="mt-8 max-w-2xl">
          <h2 className="font-display text-xl text-borahae-text">
            {t("docsTitle")}
          </h2>
          <ul className="mt-4 divide-y divide-borahae-primary/10 rounded-xl border border-borahae-primary/15 bg-white">
            {LEGAL_DOCUMENT_SLUGS.map((slug) => {
              const doc = publicados.get(slug);
              const nombre = cleanText(doc?.title) || t(docLabels[slug]);
              return (
                <li
                  key={slug}
                  className="flex items-center justify-between gap-4 px-6 py-4"
                >
                  {doc ? (
                    <Link
                      href={`/legal/${slug}`}
                      className="text-borahae-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-borahae-text"
                    >
                      {nombre}
                    </Link>
                  ) : (
                    <>
                      <span className="text-borahae-text/80">{nombre}</span>
                      <span className="shrink-0 rounded-full bg-borahae-surface px-3 py-1 text-xs font-medium text-borahae-text/70">
                        {t("docPending")}
                      </span>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </main>
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/legal">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({
    locale: locale as "es" | "ko",
    path: "/legal",
    title: t("pageTitles.legal"),
    description: t("pageDescriptions.legal"),
  });
}
