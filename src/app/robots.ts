import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/metadata";

/**
 * Robots (AGENTS §5.1/§5.2): el sitio público es indexable; el panel de
 * Payload y los endpoints de formularios (datos personales) se excluyen.
 * El sitemap dinámico vive en /sitemap.xml.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
