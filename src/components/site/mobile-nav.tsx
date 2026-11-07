"use client";

import { useEffect, useRef, useState } from "react";
import { NavLink } from "./nav-link";

type NavItem = { href: string; label: string };

type Props = {
  items: NavItem[];
  openLabel: string;
  closeLabel: string;
  navLabel: string;
};

/**
 * Menú móvil (solo interactivo real del header). Cierra con Escape,
 * con tap fuera (backdrop de botón cierre accesible), al navegar y
 * devuelve el foco al botón. Los objetivos táctiles tienen ≥ 44 px
 * (AGENTS.md §6). El backdrop vive en el mismo stacking del header
 * (z-40); el panel va después en el DOM y pinta por encima.
 */
export function MobileNav({ items, openLabel, closeLabel, navLabel }: Props) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="nav-movil"
        aria-label={open ? closeLabel : openLabel}
        onClick={() => setOpen((previous) => !previous)}
        className="flex size-11 items-center justify-center rounded-lg text-borahae-primary hover:bg-borahae-primary/10"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6">
          {open ? (
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              d="M5 5l14 14M19 5L5 19"
            />
          ) : (
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              d="M3 6h18M3 12h18M3 18h18"
            />
          )}
        </svg>
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label={closeLabel}
            onClick={close}
            className="fixed inset-0 bg-borahae-text/40"
          />
          <nav
            id="nav-movil"
            aria-label={navLabel}
            className="absolute inset-x-0 top-full border-b border-borahae-primary/10 bg-borahae-surface px-6 py-4 shadow-md"
          >
          <ul>
            {items.map((item) => (
              <li key={item.href}>
                <NavLink
                  href={item.href}
                  label={item.label}
                  onClick={close}
                  className="block min-h-11 border-b border-borahae-primary/5 py-3 text-base font-medium text-borahae-text hover:text-borahae-primary"
                  activeClassName="text-borahae-primary font-semibold"
                />
              </li>
            ))}
          </ul>
        </nav>
        </>
      )}
    </div>
  );
}
