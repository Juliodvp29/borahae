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
 * Metadatos por página e idioma (AGENTS §5.1):
 * - `title`/`description` desde CMS (seoTitle/seoDescription con fallback).
 * - canonical + hreflang es/ko + x-default (es) para cada ruta.
 * - Open Graph y Twitter card (Fase 6): sin foto del cliente todavía
 *   ([PENDIENTE-CLIENTE]), el `og:image` es el logo oficial, único asset
 *   de marca autorizado. Se actualiza cuando haya imagen de portada.
 */
export function buildMetadata(config: {
  locale: "es" | "ko";
  /** Ruta interna sin prefijo de idioma, p. ej. "/nosotros". */
  path: string;
  title?: string | null;
  description?: string | null;
}): Metadata {
  const pathWithLocale = `/${config.locale}${config.path}`;
  const title = config.title || undefined;
  const description = config.description || undefined;
  return {
    // Solo se emiten si hay contenido: con `title: undefined` la página
    // pisaría el título/description del layout (hallazgo Fase 6).
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    alternates: {
      canonical: pathWithLocale,
      languages: {
        es: `/es${config.path}`,
        ko: `/ko${config.path}`,
        "x-default": `/es${config.path}`,
      },
    },
    openGraph: {
      type: "website",
      url: pathWithLocale,
      siteName: "BORAHAE",
      locale: config.locale === "ko" ? "ko_KR" : "es_CO",
      // Sin title/description propios, Next hereda los de la metadata.
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      images: [{ url: "/images/logo-borahae.webp", alt: "BORAHAE" }],
    },
    twitter: {
      card: "summary",
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
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

/**
 * Datos estructurados de un evento (schema.org/Event, AGENTS §5.6). Solo
 * datos públicos del CMS — nunca datos personales ni de registro. Las
 * URLs se resuelven sobre `SITE_URL` (canonical) y la modalidad del
 * evento define el `eventAttendanceMode`.
 */
export function jsonLdEvent(config: {
  locale: "es" | "ko";
  slug: string;
  title: string;
  description?: string | null;
  modality: "presencial" | "virtual" | "hibrido";
  dateStart?: string | null;
  dateEnd?: string | null;
  location?: string | null;
  locationUrl?: string | null;
  coverUrl?: string | null;
}): Record<string, unknown> {
  const url = `${SITE_URL}/${config.locale}/eventos/${config.slug}`;
  const attendanceMode: Record<string, string> = {
    presencial: "https://schema.org/OfflineEventAttendanceMode",
    virtual: "https://schema.org/OnlineEventAttendanceMode",
    hibrido: "https://schema.org/MixedEventAttendanceMode",
  };
  // location: solo la URL de schema; en virtual es un VirtualLocation.
  const esVirtual = config.modality !== "presencial";
  const esPresencial = config.modality !== "virtual";
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: config.title,
    url,
    description: config.description || undefined,
    eventAttendanceMode: attendanceMode[config.modality],
    eventStatus: "https://schema.org/EventScheduled",
    isAccessibleForFree: true,
    inLanguage: config.locale,
    ...(config.dateStart
      ? {
          startDate: config.dateStart,
          ...(config.dateEnd ? { endDate: config.dateEnd } : {}),
        }
      : {}),
    ...((esPresencial || esVirtual) && (config.location || esVirtual)
      ? {
          location: esPresencial
            ? {
                "@type": "Place",
                name: config.location || undefined,
                ...(config.locationUrl &&
                /^https?:\/\//i.test(config.locationUrl)
                  ? { hasMap: config.locationUrl }
                  : {}),
              }
            : {
                "@type": "VirtualLocation",
                ...(config.locationUrl &&
                /^https?:\/\//i.test(config.locationUrl)
                  ? { url: config.locationUrl }
                  : {}),
              },
        }
      : {}),
    image: config.coverUrl
      ? config.coverUrl.startsWith("http")
        ? config.coverUrl
        : `${SITE_URL}${config.coverUrl}`
      : `${SITE_URL}/images/logo-borahae.webp`,
    organizer: {
      "@type": "NGO",
      name: "BORAHAE",
      url: SITE_URL,
    },
    // Fase 1: inscripción solo en el sitio; el formulario exige 18+.
    offers: {
      "@type": "Offer",
      price: 0,
      priceCurrency: "COP",
      availability: "https://schema.org/InStock",
      url,
    },
  };
}
