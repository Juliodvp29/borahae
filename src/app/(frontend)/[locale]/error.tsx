"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

/**
 * Boundary de error inesperado (Next 16: props `{ error, retry }`).
 * Client Component obligatorio. **No** se muestran detalles internos del
 * error al visitante (AGENTS §5.3): solo se registra en consola.
 */
export default function Error({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const t = useTranslations("errors");

  return (
    <main className="flex-1">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center md:py-32">
        <h1 className="font-display text-borahae-text text-3xl md:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-4 max-w-md text-lg leading-relaxed text-borahae-text/80">
          {t("text")}
        </p>
        <button
          type="button"
          onClick={retry}
          className="mt-10 flex min-h-11 items-center rounded-lg bg-borahae-primary px-5 text-base font-medium text-white transition-colors hover:bg-borahae-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-borahae-primary"
        >
          {t("retry")}
        </button>
      </div>
    </main>
  );
}
