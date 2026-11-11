import { getTranslations } from "next-intl/server";
import { ContactForm } from "@/components/site/contact-form";
import { getPayloadClient } from "@/lib/payload";
import { buildMetadata } from "@/lib/metadata";
import { cleanText } from "@/lib/markers";
import type { Metadata } from "next";

/**
 * Contacto (AGENTS §4): datos institucionales desde `site-settings`
 * + formulario general (spec §7.1). El correo se muestra solo si el
 * cliente ya lo configuró; el formulario siempre está disponible.
 */
export const revalidate = 300;

export default async function ContactoPage({
  params,
}: PageProps<"/[locale]/contacto">) {
  await params;

  const [t, payload] = await Promise.all([
    getTranslations("contact"),
    getPayloadClient(),
  ]);
  const settings = await payload.findGlobal({ slug: "site-settings" });
  const correo = cleanText(settings?.contactEmail ?? "");
  const ciudad = cleanText(settings?.city ?? "");

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

        <div className="mt-10 grid gap-8 lg:grid-cols-[2fr_3fr]">
          <aside className="h-fit rounded-xl border border-borahae-primary/15 bg-white p-6 md:p-8">
            <h2 className="font-display text-xl text-borahae-text">
              {t("infoTitle")}
            </h2>
            <dl className="mt-5 space-y-4">
              {(correo || ciudad) && (
                <>
                  {correo && (
                    <div>
                      <dt className="text-sm font-medium uppercase tracking-wide text-borahae-text/60">
                        {t("emailSettingLabel")}
                      </dt>
                      <dd className="mt-1">
                        <a
                          href={`mailto:${correo}`}
                          className="text-borahae-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-borahae-text"
                        >
                          {correo}
                        </a>
                      </dd>
                    </div>
                  )}
                  {ciudad && (
                    <div>
                      <dt className="text-sm font-medium uppercase tracking-wide text-borahae-text/60">
                        {t("cityLabel")}
                      </dt>
                      <dd className="mt-1 text-borahae-text">{ciudad}</dd>
                    </div>
                  )}
                </>
              )}
            </dl>
            <p className="mt-6 text-sm leading-relaxed text-borahae-text/70">
              {t("infoNote")}
            </p>
          </aside>

          <div>
            <h2 className="font-display text-2xl text-borahae-text">
              {t("formTitle")}
            </h2>
            <p className="mt-2 text-base leading-relaxed text-borahae-text/80">
              {t("formIntro")}
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/contacto">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({
    locale: locale as "es" | "ko",
    path: "/contacto",
    title: t("pageTitles.contacto"),
    description: t("pageDescriptions.contacto"),
  });
}
