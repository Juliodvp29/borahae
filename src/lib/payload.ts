import { cache } from "react";
import { getPayload, type Payload } from "payload";
import configPromise from "@payload-config";
import type { SiteSetting } from "@/payload-types";

/**
 * Cliente de la **API local** de Payload para Server Components
 * (AGENTS plan Fase 4, decisión aprobada: lectura local, no REST interno).
 *
 * `cache` de React evita inicializar el app más de una vez por request;
 * el módulo Va igual inicializado por el build/prerender (decisión a:
 * prerender en build con DATABASE_URL en CI).
 */
export const getPayloadClient = cache(
  async (): Promise<Payload> => getPayload({ config: configPromise }),
);

/**
 * `site-settings` para el frontend. Con `depth: 1` el logo (upload) viene
 * poblado con su URL y alt; el editor lo administra desde /admin (Fase 3).
 */
export const getSiteSettings = cache(
  async (): Promise<SiteSetting> => {
    const payload = await getPayloadClient();
    return payload.findGlobal({ slug: "site-settings", depth: 1 });
  },
);
