import Link from "next/link";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPayloadClient } from "@/lib/payload";
import { buildMetadata } from "@/lib/metadata";
import { cleanText } from "@/lib/markers";

/**
 * Donaciones (spec §6.8): 100 % CMS desde `site-settings` (pestaña
 * Donaciones). PayPal solo si el cliente entregó el enlace; datos de
 * transferencia/Bre-B solo si el editor los llenó; el mensaje de destino
 * es editable en es/ko. Enlaces externos con noopener (AGENTS §5.5).
 */
export const revalidate = 300;

export default async function DonacionesPage({
  params,
}: PageProps<"/[locale]/donaciones">) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, payload] = await Promise.all([
    getTranslations("donations"),
    getPayloadClient(),
  ]);
  const settings = await payload.findGlobal({
    slug: "site-settings",
    locale: locale as "es" | "ko",
    fallbackLocale: "es",
  });

  const paypalUrl = cleanText(settings?.paypalUrl ?? "");
  const paypalValida = /^https:\/\//i.test(paypalUrl);
  const transferencia = cleanText(settings?.transferInfo ?? "");
  const proposito = cleanText(settings?.donationNote ?? "");
  const lineas = transferencia
    .split("\n")
    .map((linea) => linea.trim())
    .filter(Boolean);

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

        {proposito && (
          <p className="mt-8 max-w-3xl border-l-4 border-borahae-secondary pl-5 text-lg leading-relaxed text-borahae-text/85 md:pl-6">
            {proposito}
          </p>
        )}

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {paypalValida ? (
            <div className="flex flex-col rounded-xl border border-borahae-primary/15 bg-white p-6 md:p-8">
              <h2 className="font-display text-xl text-borahae-text">
                {t("paypalTitle")}
              </h2>
              <p className="mt-3 leading-relaxed text-borahae-text/85">
                {t("paypalText")}
              </p>
              <a
                href={paypalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex min-h-11 w-fit items-center rounded-full bg-borahae-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-borahae-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-borahae-text"
              >
                {t("donateButton")}
              </a>
            </div>
          ) : (
            <div className="flex flex-col rounded-xl border border-borahae-primary/15 bg-white p-6 md:p-8">
              <h2 className="font-display text-xl text-borahae-text">
                {t("soonTitle")}
              </h2>
              <p className="mt-3 leading-relaxed text-borahae-text/85">
                {t("soonText")}
              </p>
              <Link
                href="/contacto"
                className="mt-6 inline-flex min-h-11 w-fit items-center rounded-full bg-borahae-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-borahae-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-borahae-text"
              >
                {t("contactCta")}
              </Link>
            </div>
          )}

          {lineas.length > 0 && (
            <div className="rounded-xl border border-borahae-primary/15 bg-borahae-surface p-6 md:p-8">
              <h2 className="font-display text-xl text-borahae-text">
                {t("transferTitle")}
              </h2>
              <dl className="mt-5 space-y-3">
                {lineas.map((linea) => (
                  <dd
                    key={linea}
                    className="text-base leading-relaxed text-borahae-text/90"
                  >
                    {linea}
                  </dd>
                ))}
              </dl>
            </div>
          )}
        </div>

        <p className="mt-12 max-w-2xl text-base leading-relaxed text-borahae-text/70">
          {t("gratitude")}
        </p>
      </section>
    </main>
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/donaciones">): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  return buildMetadata({
    locale: locale as "es" | "ko",
    path: "/donaciones",
  });
}
