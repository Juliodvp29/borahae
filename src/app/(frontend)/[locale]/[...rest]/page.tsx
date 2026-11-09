import { notFound } from "next/navigation";

/**
 * Catch-all de `[locale]`: toda URL con idioma válido pero sin página
 * (p. ej. /es/no-existe) matchea aquí y lanza `notFound()`. Así el 404 se
 * renderiza con nuestro `[locale]/not-found.tsx` (branding y traducciones)
 * en lugar del default global de Next, que ignora el layout y el idioma.
 */
export default async function NotFoundCatchAll() {
  notFound();
}
