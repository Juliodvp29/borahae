import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

/**
 * Tarjeta base de contenido (destacados de programas/eventos en Fase 4).
 * Superficie elevada sobre el fondo de marca, sin anidar sombras.
 */
export function Card({ children, className = "" }: Props) {
  return (
    <div
      className={`rounded-2xl border border-borahae-primary/10 bg-white p-6 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}
