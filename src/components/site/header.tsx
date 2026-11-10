import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getSiteSettings } from "@/lib/payload";
import { NavLink } from "./nav-link";
import { MobileNav } from "./mobile-nav";
import { LanguageSwitcher } from "./language-switcher";

/**
 * Header del sitio. Componente de servidor; la única interactividad
 * (menú móvil y selector de idioma) son Client Components aislados.
 *
 * Lee `site-settings` (API local): Galería y Patrocinio se ocultan del menú
 * según sus interruptores, y el logo se usa desde el CMS si está cargado
 * (el editor lo sube en /admin); mientras tanto muestra el placeholder de texto.
 */
export async function Header() {
  const tNav = await getTranslations("nav");
  const tRoot = await getTranslations("header");
  const settings = await getSiteSettings();

  const navLabel = tRoot("mainNav");

  const items = [
    { href: "/", label: tNav("home") },
    { href: "/nosotros", label: tNav("about") },
    { href: "/programas", label: tNav("programs") },
    { href: "/viajes", label: tNav("tours") },
    { href: "/eventos", label: tNav("events") },
    // Las opciones ocultables se añaden solo si el negocio las activó.
    ...(settings.galleryEnabled
      ? [{ href: "/galeria", label: tNav("gallery") }]
      : []),
    { href: "/donaciones", label: tNav("donations") },
    ...(settings.sponsorshipEnabled
      ? [{ href: "/patrocinio", label: tNav("sponsorship") }]
      : []),
    { href: "/contacto", label: tNav("contact") },
  ];

  const logo =
    settings.logo && typeof settings.logo !== "number" ? settings.logo : null;

  return (
    <header className="sticky top-0 z-40 border-b border-borahae-primary/10 bg-borahae-surface">
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
        {/* Logo: primero el que administre el editor en /admin (site-settings
            → Media); fallback al asset empacado en el repo si aún no existe.
            Mismo aspecto horizontal (~2.6:1) para que el swap no salte. */}
        <Link
          href="/"
          aria-label={tRoot("homeAria")}
          className="flex min-h-11 items-center bg-transparent"
        >
          {logo?.url ? (
            <Image
              src={logo.url}
              alt={logo.alt ?? tRoot("homeAria")}
              width={0}
              height={0}
              sizes="160px"
              className="h-10 w-auto"
              priority
            />
          ) : (
            <Image
              src="/images/logo-horizontal.webp"
              alt={tRoot("homeAria")}
              width={480}
              height={186}
              sizes="(max-width: 1024px) 160px, 208px"
              className="h-10 w-auto"
              priority
            />
          )}
        </Link>

        <nav aria-label={navLabel} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {items.map((item) => (
              <li key={item.href}>
                <NavLink
                  href={item.href}
                  label={item.label}
                  className="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-borahae-text hover:bg-borahae-primary/10 hover:text-borahae-primary"
                  activeClassName="text-borahae-primary font-semibold"
                />
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <MobileNav
            items={items}
            openLabel={tRoot("openMenu")}
            closeLabel={tRoot("closeMenu")}
            navLabel={navLabel}
          />
        </div>
      </div>
    </header>
  );
}
