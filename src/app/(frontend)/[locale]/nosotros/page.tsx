import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { toRichTextData } from "@/lib/richtext";
import { getPayloadClient } from "@/lib/payload";
import { buildMetadata } from "@/lib/metadata";
import type { Page } from "@/payload-types";

/**
 * ISR (5 min): el contenido viene del CMS; los hooks de revalidación de
 * la colección pages invalidan la ruta al publicar cuando el runtime
 * lo soporta.
 */
export const revalidate = 300;

/**
 * Página /nosotros: contenido institucional editado en el CMS
 * (textos reales aprobados por el cliente: misión, visión, objetivos, pilares).
 * Fallback coreano automático al español por configuración de Payload.
 */
export default async function NosotrosPage({
  params,
}: PageProps<"/[locale]/nosotros">) {
  const { locale } = await params;

  const [t, payload] = await Promise.all([
    getTranslations("home"),
    getPayloadClient(),
  ]);
  const res = await payload.find({
    collection: "pages",
    where: { slug: { equals: "nosotros" } },
    locale: locale as "es" | "ko",
    fallbackLocale: "es",
    limit: 1,
  });
  const doc = res.docs[0] as Page | undefined;
  if (!doc) notFound();

  return (
    <main className="flex-1">
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <p className="text-sm font-medium uppercase tracking-widest text-borahae-primary">
          {t("eyebrow")}
        </p>
        <h1 className="font-display mt-4 text-borahae-text text-3xl leading-snug md:text-5xl md:leading-tight">
          {doc.title}
        </h1>
        {doc.summary && (
          <p className="mt-6 max-w-[72ch] border-l-4 border-borahae-secondary pl-5 text-lg leading-relaxed text-borahae-text/80 md:pl-6">
            {doc.summary}
          </p>
        )}
        {doc.content && (
          <div className="mt-12 max-w-[72ch] text-base leading-relaxed text-borahae-text/90 [&_h2]:font-display [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:text-borahae-text [&_h3]:font-display [&_h3]:mt-6 [&_h3]:mb-2 [&_li]:my-2 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6">
            <RichText data={toRichTextData(doc.content)} />
          </div>
        )}
      </section>
    </main>
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/nosotros">): Promise<Metadata> {
  const { locale } = await params;
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: "pages",
    where: { slug: { equals: "nosotros" } },
    locale: locale as "es" | "ko",
    fallbackLocale: "es",
    limit: 1,
  });
  const doc = res.docs[0] as Page | undefined;
  return buildMetadata({
    locale: locale as "es" | "ko",
    path: "/nosotros",
    title: doc?.seoTitle || doc?.title || undefined,
    description: doc?.seoDescription || doc?.summary || undefined,
  });
}
