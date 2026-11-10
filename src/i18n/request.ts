import * as rootParams from "next/root-params";
import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

/**
 * Config por petición. El locale se lee del segmento raíz `[locale]` con
 * la API nativa `next/root-params` (Next 16.3): ya no hace falta el truco
 * del header del middleware ni `setRequestLocale` (deprecada en next-intl):
 * el layout `[locale]/layout.tsx` es el root layout y el valor está
 * disponible en cualquier Server Component inferior.
 *
 * Si un locale no es válido (o el getter devuelve undefined en un root
 * layout sin el segmento, como el panel de Payload), hace fallback al
 * español (AGENTS.md §5.1; el layout valida y lanza 404 para URLs con
 * idioma no admitido).
 */
export default getRequestConfig(async () => {
  const requested = await rootParams.locale();
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
