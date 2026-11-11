import type { MetadataRoute } from "next";
import { getPayloadClient } from "@/lib/payload";
import { SITE_URL } from "@/lib/metadata";

/**
 * Sitemap con ambas versiones de idioma (AGENTS §5.1): cada URL expone
 * `alternates.languages` (es, ko y x-default = es). Rutas estáticas +
 * slugs dinámicos de `programs`, `tours` y `events` (solo publicados:
 * los drafts del CMS no salen). `/admin` y `/api` nunca van aquí — los
 * bloquea `robots.ts`.
 *
 * ISR 300 s, igual que las páginas: contenido nuevo entra al sitemap sin
 * redeploy (las colecciones ya revalidan sus rutas con hooks).
 */
export const revalidate = 300;

/** Rutas fijas del sitio (AGENTS §4), sin prefijo de idioma. */
const RUTAS_FIJAS = [
  "",
  "/nosotros",
  "/programas",
  "/viajes",
  "/eventos",
  "/galeria",
  "/donaciones",
  "/patrocinio",
  "/contacto",
  "/legal",
  "/legal/politica-de-tratamiento-de-datos",
  "/legal/terminos-y-condiciones",
  "/legal/condiciones-de-viaje",
] as const;

/** Slugs publicados de una colección con drafts. */
async function slugsPublicados(
  collection: "programs" | "tours" | "events",
): Promise<string[]> {
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection,
    where: { _status: { equals: "published" } },
    limit: 200,
    depth: 0,
  });
  return res.docs
    .map((doc) => doc.slug)
    .filter((slug): slug is string => Boolean(slug));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let dinamicas: { base: string; slugs: string[] }[] = [];
  try {
    const [programs, tours, events] = await Promise.all([
      slugsPublicados("programs"),
      slugsPublicados("tours"),
      slugsPublicados("events"),
    ]);
    dinamicas = [
      { base: "/programas", slugs: programs },
      { base: "/viajes", slugs: tours },
      { base: "/eventos", slugs: events },
    ];
  } catch {
    // Sin BD (build aislado), el sitemap sale solo con las rutas fijas.
  }

  const rutas = [
    ...RUTAS_FIJAS.map((path) => ({ path })),
    ...dinamicas.flatMap(({ base, slugs }) =>
      slugs.map((slug) => ({ path: `${base}/${slug}` })),
    ),
  ];

  return rutas.map(({ path }) => ({
    url: `${SITE_URL}/es${path || ""}`,
    lastModified: new Date(),
    alternates: {
      languages: {
        es: `${SITE_URL}/es${path || ""}`,
        ko: `${SITE_URL}/ko${path || ""}`,
        "x-default": `${SITE_URL}/es${path || ""}`,
      },
    },
  }));
}
