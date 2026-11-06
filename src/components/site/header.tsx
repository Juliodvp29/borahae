import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { MobileNav } from "./mobile-nav";
import { LanguageSwitcher } from "./language-switcher";

/**
 * Header del sitio. Componente de servidor; la única interactividad
 * (menú móvil y selector de idioma) son Client Components aislados.
 * Nota: Galería y Patrocinio respetarán los interruptores de
 * `site-settings` cuando llegue la colección global (Fase 4).
 */
export async function Header() {
  const tNav = await getTranslations("nav");
  const tRoot = await getTranslations("header");

  const navLabel = tRoot("mainNav");

  const items = [
    { href: "/", label: tNav("home") },
    { href: "/nosotros", label: tNav("about") },
    { href: "/programas", label: tNav("programs") },
    { href: "/viajes", label: tNav("tours") },
    { href: "/eventos", label: tNav("events") },
    { href: "/galeria", label: tNav("gallery") },
    { href: "/donaciones", label: tNav("donations") },
    { href: "/patrocinio", label: tNav("sponsorship") },
    { href: "/contacto", label: tNav("contact") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-borahae-primary/10 bg-borahae-surface">
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
        <Link
          href="/"
          aria-label={tRoot("homeAria")}
          className="font-display text-xl font-semibold tracking-wide text-borahae-primary"
        >
          BORAHAE
        </Link>

        <nav aria-label={tRoot("mainNav")} className="hidden md:block">
          <ul className="flex items-center gap-1">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-borahae-text hover:bg-borahae-primary/10 hover:text-borahae-primary"
                >
                  {item.label}
                </Link>
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
