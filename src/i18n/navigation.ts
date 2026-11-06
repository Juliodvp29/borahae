import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Helpers de navegación con prefijo de locale.
 * Usar `Link` de aquí en lugar de `next/link` en el sitio público,
 * para que los href se resuelvan a `/es/...` o `/ko/...`.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
