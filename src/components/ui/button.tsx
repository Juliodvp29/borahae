import { Link } from "@/i18n/navigation";
import { type ReactNode } from "react";

type Variant = "primary" | "outline";
type Size = "md" | "lg";

const base =
  "inline-flex min-h-11 items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2";

const variants: Record<Variant, string> = {
  primary:
    "bg-borahae-primary text-white hover:bg-borahae-primary-hover focus-visible:outline-borahae-text",
  outline:
    "border border-borahae-primary text-borahae-primary hover:bg-borahae-primary-hover hover:text-white focus-visible:outline-borahae-text",
};

const sizes: Record<Size, string> = {
  md: "",
  lg: "px-7 py-3.5 text-base",
};

type Props = {
  href: string;
  variant?: Variant;
  size?: Size;
  external?: boolean;
  children: ReactNode;
  className?: string;
};

/**
 * Botón-enlace reutilizable (CTA). Los href internos pasan por `Link`
 * de next-intl para conservar el prefijo de idioma; `external` usa <a>
 * con rel="noopener noreferrer" (AGENTS.md §5.5).
 */
export function Button({
  href,
  variant = "primary",
  size = "md",
  external = false,
  children,
  className = "",
}: Props) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if (external) {
    return (
      <a
        href={href}
        className={classes}
        rel="noopener noreferrer"
        target="_blank"
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
