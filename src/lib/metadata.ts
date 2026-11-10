import type { Metadata } from "next";

/**
 * URL pública del sitio para canonical/hreflang/OG. En producción la fija
 * `NEXT_PUBLIC_SITE_URL` en Vercel; el fallback es el dominio actual del
 * proyecto (problematic: actualizar con el dominio final cuando el cliente
 * compre el dominio — decisión 2026-11-09).
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://borahae-kappa.vercel.app";

/**
 * Metadata por página e idioma (AGENTS §5.1):
 * - `title`/`description` desde CMS (seoTitle/seoDescription con fallback).
 * - canonical + hreflang es/ko + x-default (es) para cada ruta.
 */
export function buildMetadata(config: {
  locale: "es" | "ko";
  /** Ruta interna sin prefijo de idioma, p. ej. "/nosotros". */
  path: string;
  title?: string | null;
  description?: string | null;
}): Metadata {
  const pathWithLocale = `/${config.locale}${config.path}`;
  return {
    title: config.title || undefined,
    description: config.description || undefined,
    alternates: {
      canonical: pathWithLocale,
      languages: {
        es: `/es${config.path}`,
        ko: `/ko${config.path}`,
        "x-default": `/es${config.path}`,
      },
    },
    metadataBase: new URL(SITE_URL),
  };
}

/**
 * Datos estructurados de la organización (schema.org/NGO). Los enlaces de
 * redes se resumen desde `site-settings`; solo se exponen datos públicos,
 * no personales (AGENTS §5.5/§11).
 */
export function jsonLdOrganization(
  socialLinks?: { platform: string; url: string }[] | null,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: "BORAHAE",
    description:
      "ESAL de intercambio cultural Colombia — Corea del Sur",
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo-borahae.webp`,
    ...(socialLinks && socialLinks.length > 0
      ? { sameAs: socialLinks.map((s) => s.url) }
      : {}),
  };
}
