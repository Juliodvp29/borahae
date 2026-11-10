import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { toRichTextData } from "@/lib/richtext";
import { getPayloadClient } from "@/lib/payload";
import { buildMetadata } from "@/lib/metadata";
import type { Program } from "@/payload-types";

/**
 * Detalle de programa (AGENTS §4): solo los slugs de la spec; cualquier
 * otro slug cae al 404. Estado `upcoming` → bloque "Próximamente"; el
 * contenido definitivo lo carga el editor desde /admin.
 * El coreano hace fallback al español (fallbackLocale en las queries).
 */
export const revalidate = 300;

const PROGRAM_SLUGS = ["curso-coreano", "becas", "talleres"] as const;

export function generateStaticParams() {
  return PROGRAM_SLUGS.map((slug) => ({ slug }));
}

export default async function ProgramPage({
  params,
}: PageProps<"/[locale]/programas/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  if (!(PROGRAM_SLUGS as readonly string[]).includes(slug)) notFound();

  const [t, tNav, payload] = await Promise.all([
    getTranslations("programs"),
    getTranslations("nav"),
    getPayloadClient(),
  ]);
  const res = await payload.find({
    collection: "programs",
    where: { slug: { equals: slug } },
    locale: locale as "es" | "ko",
    fallbackLocale: "es",
    limit: 1,
  });
  const doc = res.docs[0] as Program | undefined;
  if (!doc) notFound();

  const proximo = doc.state !== "active";

  return (
    <main className="flex-1">
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <p className="text-sm font-medium uppercase tracking-widest text-borahae-primary">
          {t("eyebrow")}
        </p>
        <h1 className="font-display mt-4 text-3xl text-borahae-text leading-snug md:text-5xl md:leading-tight">
          {doc.title}
        </h1>
        {proximo && (
          <p className="mt-4 inline-flex rounded-full bg-borahae-surface px-4 py-1.5 text-sm font-medium text-borahae-text/80">
            {t("comingSoon")}
          </p>
        )}
        {doc.summary && (
          <p className="mt-6 max-w-3xl border-l-4 border-borahae-secondary pl-5 text-lg leading-relaxed text-borahae-text/80 md:pl-6">
            {doc.summary}
          </p>
        )}
        {proximo && (
          <aside
            aria-labelledby="proximo-titulo"
            className="mt-10 max-w-3xl rounded-xl border border-borahae-primary/15 bg-white p-6 md:p-8"
          >
            <h2
              id="proximo-titulo"
              className="font-display text-xl text-borahae-text"
            >
              {t("comingSoonTitle")}
            </h2>
            <p className="mt-3 leading-relaxed text-borahae-text/90">
              {t("comingSoonText")}
            </p>
            <Link
              href="/contacto"
              className="mt-6 inline-flex min-h-11 items-center rounded-full bg-borahae-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-borahae-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-borahae-text"
            >
              {tNav("contact")}
            </Link>
          </aside>
        )}
        {!proximo && doc.content && (
          <div className="mt-12 max-w-3xl text-base leading-relaxed text-borahae-text/90 [&_h2]:font-display [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:text-borahae-text [&_h3]:font-display [&_h3]:mt-6 [&_h3]:mb-2 [&_li]:my-2 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6">
            <RichText data={toRichTextData(doc.content)} />
          </div>
        )}
        <p className="mt-12">
          <Link
            href="/programas"
            className="text-borahae-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-borahae-text"
          >
            {t("backToPrograms")}
          </Link>
        </p>
      </section>
    </main>
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/programas/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  if (!(PROGRAM_SLUGS as readonly string[]).includes(slug)) {
    return buildMetadata({ locale: locale as "es" | "ko", path: "/programas" });
  }
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: "programs",
    where: { slug: { equals: slug } },
    locale: locale as "es" | "ko",
    fallbackLocale: "es",
    limit: 1,
  });
  const doc = res.docs[0] as Program | undefined;
  return buildMetadata({
    locale: locale as "es" | "ko",
    path: `/programas/${slug}`,
    title: doc?.seoTitle || doc?.title || undefined,
    description: doc?.seoDescription || doc?.summary || undefined,
  });
}
