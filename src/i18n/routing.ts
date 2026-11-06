import { defineRouting } from "next-intl/routing";

/**
 * Locales del sitio. Español es el idioma por defecto; `/` redirige a `/es`.
 * Rutas siempre con prefijo (`/es/...`, `/ko/...`) — AGENTS.md §5.1.
 * Los slugs se mantienen en español también bajo `/ko`.
 */
export const routing = defineRouting({
  locales: ["es", "ko"],
  defaultLocale: "es",
  localePrefix: "always",
});
