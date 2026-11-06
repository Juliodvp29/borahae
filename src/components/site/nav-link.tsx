"use client";

import { Link, usePathname } from "@/i18n/navigation";

type Props = {
  href: string;
  label: string;
  className?: string;
  activeClassName?: string;
  onClick?: () => void;
};

/**
 * Enlace de navegación con estado de ubicación: aplica `aria-current="page"`
 * y estilos activos según la ruta actual ( critique P1: orientación en una
 * nav de 9 elementos).
 */
export function NavLink({
  href,
  label,
  className = "",
  activeClassName = "",
  onClick,
}: Props) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`${className} ${active ? activeClassName : ""}`}
    >
      {label}
    </Link>
  );
}
