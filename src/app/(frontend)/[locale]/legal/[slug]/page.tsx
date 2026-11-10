import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { toRichTextData } from "@/lib/richtext";
import { getPayloadClient } from "@/lib/payload";
import { buildMetadata } from "@/lib/metadata";
import { cleanText } from "@/lib/markers";
import {
  isLegalDocumentSlug,
  type LegalDocumentSlug,
} from "@/lib/legal";
import type { LegalDoc } from "@/payload-types";

/**
 * Detalle de documento legal (Batch J): whitelist estricta a los 3 slugs
 * fijos (AGENTS §4) — URL fuera de la lista → 404. Un slug de la lista
 * sin documento publicado NO es 404: estado "en preparación" (el texto
 * lo aprueba el cliente; nada inventado aquí). Los marcadores del CMS
 * nunca llegan al público: RichText se renderiza solo si está limpio.
 */
export const revalidate = 300;

const MARCADORES = /\[(?:PENDIENTE-CLIENTE|CONTENIDO-FICTICIO-DEMO)\]/;

/** El RichText puede traer marcadores incrustados: se detecta en su forma serializada. */
function tieneMarcadores(content: unknown): boolean {
  if (!content) return false;
  try {
    return MARCADORES.test(JSON.stringify(content));
  } catch {
    return true;
  }
}

function formatearFecha(buscar: string | null | undefined, locale: string): string {
  if (!buscar) return "";
  const fecha = new Date(buscar);
  if (Number.isNaN(fecha.getTime())) return "";
  return new Intl.DateTimeFormat(locale === "ko" ? "ko-KR" : "es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(fecha);
}

export default async function LegalDocPage({
  params,
}: PageProps<"/[locale]/legal/[slug]">) {
  const { locale, slug } = await params;

  if (!isLegalDocumentSlug(slug)) notFound();

  const [t, payload] = await Promise.all([
    getTranslations("legal"),
    getPayloadClient(),
  ]);
  const res = await payload.find({
    collection: "legal-docs",
    where: { slug: { equals: slug } },
    locale: locale as "es" | "ko",
    fallbackLocale: "es",
    limit: 1,
    depth: 0,
  });
  const doc = res.docs[0] as LegalDoc | undefined;
  const titulo = cleanText(doc?.title) || t("pendingTitle");
  const numero = new Map<LegalDocumentSlug, string>([
    ["politica-de-tratamiento-de-datos", "docPolitica"],
    ["terminos-y-condiciones", "docTerminos"],
    ["condiciones-de-viaje", "docViaje"],
  ]).get(slug) as string;
  const cuerpo = tieneMarcadores(doc?.body) ? null : doc?.body;

  return (
    <main className="flex-1">
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <p className="text-sm font-medium uppercase tracking-widest text-borahae-primary">
          {t("eyebrow")}
        </p>
        <h1 className="font-display mt-4 text-3xl text-borahae-text leading-snug md:text-5xl md:leading-tight">
          {titulo}
        </h1>

        {doc && (cleanText(doc.version) || formatearFecha(doc.effectiveDate, locale)) ? (
          <p className="mt-6 text-sm text-borahae-text/70">
            {cleanText(doc.version) && (
              <>
                {t("versionLabel")}: {cleanText(doc.version)}
              </>
            )}
            {cleanText(doc.version) &&
              formatearFecha(doc.effectiveDate, locale) &&
              " · "}
            {formatearFecha(doc.effectiveDate, locale) && (
              <>
                {t("effectiveDateLabel")}:{" "}
                {formatearFecha(doc.effectiveDate, locale)}
              </>
            )}
          </p>
        ) : null}

        {!doc || !cuerpo ? (
          // Sin documento publicado (o contenido aún con marcadores):
          // estado honesto, sin enlaces ni textos inventados.
          <div className="mt-12 max-w-2xl rounded-xl border border-borahae-primary/15 bg-white p-6 md:p-8">
            <h2 className="font-display text-xl text-borahae-text">
              {t("pendingTitle")}
            </h2>
            <p className="mt-3 leading-relaxed text-borahae-text/90">
              {t("pendingText")}
            </p>
            <p className="mt-4 text-sm text-borahae-text/70">
              {t(numero)}
            </p>
          </div>
        ) : (
          <div className="mt-12 max-w-[72ch] text-base leading-relaxed text-borahae-text/90 [&_h2]:font-display [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:text-borahae-text [&_h3]:font-display [&_h3]:mt-6 [&_h3]:mb-2 [&_li]:my-2 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6">
            <RichText data={toRichTextData(cuerpo)} />
          </div>
        )}

        <p className="mt-12">
          <Link
            href="/legal"
            className="text-borahae-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-borahae-text"
          >
            {t("backToLegal")}
          </Link>
        </p>
      </section>
    </main>
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/legal/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  let titulo: string | undefined;
  if (slug && isLegalDocumentSlug(slug)) {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "legal-docs",
      where: { slug: { equals: slug } },
      locale: locale as "es" | "ko",
      fallbackLocale: "es",
      limit: 1,
      depth: 0,
    });
    const doc = res.docs[0] as LegalDoc | undefined;
    titulo = cleanText(doc?.title) || undefined;
  }
  return buildMetadata({
    locale: locale as "es" | "ko",
    path: `/legal/${slug ?? ""}`,
    title: titulo,
  });
}
