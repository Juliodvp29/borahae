/**
 * Proxy de locales (next-intl).
 *
 * IMPORTANTE (Next 16): el archivo `middleware.ts` fue deprecado y renombrado
 * a `proxy.ts`. La función de next-intl (`createMiddleware`) es un handler de
 * peticiones plano y se exporta como `proxy` para cumplir la convención nueva.
 *
 * Comportamiento:
 * - `/` → `/es` (español por defecto; next-intl decide Accept-Language solo
 *   cuando no hay prefijo, pero con `localePrefix: "always"` siempre habrá).
 * - Matcher excluye: `/api` (endpoints Payload/forms), `/admin` (panel),
 *   `/_next` (build/hmr), `_vercel` y archivos estáticos (cualquier `*.ext`).
 *   Requisito de AGENTS.md §5.1.
 */
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  return createMiddleware(routing)(request);
}

// Negativa: excluye /api, /admin, /_next/*, _vercel/* y archivos con extensión.
export const config = {
  matcher: ["/((?!api|admin|_next|_vercel|.*\\..*).*)"],
};
