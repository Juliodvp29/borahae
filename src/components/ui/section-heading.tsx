import { type ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  /** id opcional para ancoras y jerarquía de página. */
  id?: string;
  className?: string;
};

/**
 * Encabezado de sección con jerarquía consistente:
 * copete (etiqueta pequeña) + título en Noto Serif KR.
 */
export function SectionHeading({ eyebrow, title, id, className = "" }: Props) {
  return (
    <div className={className}>
      {eyebrow && (
        <p className="text-sm font-medium uppercase tracking-widest text-borahae-primary">
          {eyebrow}
        </p>
      )}
      <h2
        id={id}
        className="font-display mt-2 text-2xl leading-snug text-borahae-text md:text-3xl md:leading-tight"
      >
        {title}
      </h2>
    </div>
  );
}
