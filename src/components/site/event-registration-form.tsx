"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  eventRegistrationSchema,
  eventRegistrationIssues,
  type IssueCode,
} from "@/lib/event-registration-schema";

/**
 * Formulario de inscripción a eventos (spec §7.2, AGENTS §5.3), modelado
 * sobre `contact-form.tsx`: validación con el MISMO esquema Zod del
 * servidor, honeypot "website", estados de error traducidos y accesibles
 * (`aria-invalid`/`aria-describedby`/`aria-live`). La fecha de nacimiento
 * es transitoria: viaja al endpoint, que calcula la edad y nunca la guarda.
 * El `locale` va explícito (root-params no cubre Route Handlers).
 */

type Issue = { field: string; code: IssueCode };

type Estado =
  | { fase: "listo" }
  | { fase: "enviando" }
  | { fase: "exito" }
  | {
      fase: "error";
      error:
        | "minor"
        | "duplicate"
        | "full"
        | "rateLimit"
        | "server"
        | "desconocido";
      issues?: Issue[];
    };

export function EventRegistrationForm({
  eventSlug,
  eventModality,
  locale,
}: {
  eventSlug: string;
  eventModality: "presencial" | "virtual" | "hibrido";
  locale: "es" | "ko";
}): React.JSX.Element {
  const t = useTranslations("eventReg");
  const [estado, setEstado] = useState<Estado>({ fase: "listo" });
  const [issues, setIssues] = useState<Issue[]>([]);

  const issueDe = (field: string): string | null => {
    const found = issues.find((item) => item.field === field);
    if (!found) return null;
    if (found.code === "required") {
      if (field === "consent") return t("errors.consent");
      if (field === "adultDeclaration") return t("errors.adult");
      return t("errors.required");
    }
    if (found.code === "invalidEmail") return t("errors.invalidEmail");
    if (found.code === "tooShort") return t("errors.tooShort");
    if (found.code === "tooLong") return t("errors.tooLong");
    if (found.code === "invalidDate") return t("errors.invalidDate");
    return t("errors.invalidValue");
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const raw = Object.fromEntries(new FormData(form).entries());
    const parsed = eventRegistrationSchema.safeParse({
      eventSlug,
      locale,
      name: raw.name,
      email: raw.email,
      phone: raw.phone,
      city: raw.city,
      // Solo se envía en eventos híbridos; el servidor completa el resto.
      ...(eventModality === "hibrido" ? { modality: raw.modality } : {}),
      dateOfBirth: raw.dateOfBirth,
      adultDeclaration: raw.adultDeclaration === "true",
      consent: raw.consent === "true",
    });
    if (!parsed.success) {
      const encontrados = eventRegistrationIssues(parsed.error);
      // Casillas sin marcar: los mappers las filtran, pero el envío
      // silencioso no es aceptable — mensajes + foco en la casilla.
      if (raw.adultDeclaration !== "true") {
        encontrados.push({ field: "adultDeclaration", code: "required" });
      }
      if (raw.consent !== "true") {
        encontrados.push({ field: "consent", code: "required" });
      }
      setIssues(encontrados);
      enfocarPrimerInvalido(encontrados);
      setEstado({ fase: "listo" });
      return;
    }
    setIssues([]);
    setEstado({ fase: "enviando" });
    try {
      const res = await fetch("/api/event-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = (await res.json()) as {
        ok: boolean;
        error?:
          | "minor"
          | "duplicate"
          | "full"
          | "rateLimit"
          | "server"
          | "invalidRequest"
          | "validation";
        issues?: Issue[];
      };
      if (res.status === 201 && json.ok) {
        form.reset();
        setEstado({ fase: "exito" });
        return;
      }
      if (res.status === 400 && json.error === "validation") {
        setIssues(json.issues ?? []);
        setEstado({ fase: "listo" });
        return;
      }
      if (
        json.error === "minor" ||
        json.error === "duplicate" ||
        json.error === "full" ||
        json.error === "rateLimit"
      ) {
        setEstado({ fase: "error", error: json.error });
        return;
      }
      setEstado({ fase: "error", error: "server" });
    } catch {
      setEstado({ fase: "error", error: "desconocido" });
    }
  }

  if (estado.fase === "exito") {
    return (
      <div
        role="status"
        className="rounded-xl border border-borahae-primary/20 bg-white p-6 md:p-8"
      >
        <p aria-hidden="true" className="text-3xl">
          🎉
        </p>
        <h3 className="font-display mt-3 text-xl text-borahae-text">
          {t("successTitle")}
        </h3>
        <p className="mt-3 leading-relaxed text-borahae-text/90">
          {t("successText")}
        </p>
      </div>
    );
  }

  // Estilo compartido con el formulario de contacto (44 px de alto → AGENTS §6).
  const claseInput =
    "min-h-11 w-full rounded-lg border border-borahae-primary/25 bg-white px-4 py-3 text-base text-borahae-text placeholder:text-borahae-text/40 focus:border-borahae-primary focus:outline-2 focus:outline-offset-1 focus:outline-borahae-primary aria-invalid:border-borahae-primary-hover";
  // El asterisco (*) solo en campos OBLIGATORIOS: phone/city son opcionales
  // (spec §7.2) y un asterisco mentiroso mina la confianza del formulario.
  const claseLabel =
    "mb-2.5 block text-sm font-medium text-borahae-text" +
    " after:content-['*'] after:ml-1 after:text-borahae-primary";
  const claseLabelOpt = "mb-2.5 block text-sm font-medium text-borahae-text";
  const claseError = "mt-1 text-sm text-borahae-primary-hover";
  const claseCheck =
    "size-5 rounded border-borahae-primary/40 text-borahae-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-borahae-primary";

  const nombreErr = issueDe("name");
  const emailErr = issueDe("email");
  const phoneErr = issueDe("phone");
  const cityErr = issueDe("city");
  const modalityErr = issueDe("modality");
  const dobErr = issueDe("dateOfBirth");
  const adultErr = issueDe("adultDeclaration");
  const consentErr = issueDe("consent");
  const hayIssues =
    nombreErr || emailErr || phoneErr || cityErr || modalityErr || dobErr;

  // Fecha futura bloqueada en el selector; el servidor vuelve a validar.
  const hoy = new Date().toISOString().slice(0, 10);

  const mensajeError: Record<
    Exclude<Estado, { fase: "listo" | "enviando" | "exito" }>["error"],
    string
  > = {
    minor: t("minorText"),
    duplicate: t("duplicateText"),
    full: t("fullText"),
    rateLimit: t("rateLimitText"),
    server: t("errorText"),
    desconocido: t("errorText"),
  };

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      className="rounded-xl border border-borahae-primary/15 bg-white p-6 md:p-8"
    >
      <div aria-live="polite" className="sr-only">
        {estado.fase === "error"
          ? mensajeError[estado.error]
          : hayIssues || adultErr || consentErr
            ? t("errors.summary")
            : ""}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="reg-nombre" className={claseLabel}>
            {t("nameLabel")}
          </label>
          <input
            id="reg-nombre"
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={80}
            aria-describedby={nombreErr ? "err-reg-nombre" : undefined}
            aria-invalid={Boolean(nombreErr) || undefined}
            className={claseInput}
          />
          {nombreErr && (
            <p id="err-reg-nombre" className={claseError}>
              {nombreErr}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="reg-correo" className={claseLabel}>
            {t("emailLabel")}
          </label>
          <input
            id="reg-correo"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={100}
            aria-describedby={emailErr ? "err-reg-correo" : undefined}
            aria-invalid={Boolean(emailErr) || undefined}
            className={claseInput}
          />
          {emailErr && (
            <p id="err-reg-correo" className={claseError}>
              {emailErr}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="reg-telefono" className={claseLabelOpt}>
            {t("phoneLabel")}
          </label>
          <input
            id="reg-telefono"
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={25}
            aria-describedby={phoneErr ? "err-reg-telefono" : undefined}
            aria-invalid={Boolean(phoneErr) || undefined}
            className={claseInput}
          />
          {phoneErr && (
            <p id="err-reg-telefono" className={claseError}>
              {phoneErr}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="reg-ciudad" className={claseLabelOpt}>
            {t("cityLabel")}
          </label>
          <input
            id="reg-ciudad"
            name="city"
            type="text"
            autoComplete="address-level2"
            maxLength={80}
            aria-describedby={cityErr ? "err-reg-ciudad" : undefined}
            aria-invalid={Boolean(cityErr) || undefined}
            className={claseInput}
          />
          {cityErr && (
            <p id="err-reg-ciudad" className={claseError}>
              {cityErr}
            </p>
          )}
        </div>

        {eventModality === "hibrido" && (
          <div className="sm:col-span-2">
            <label htmlFor="reg-modalidad" className={claseLabel}>
              {t("modalityLabel")}
            </label>
            <select
              id="reg-modalidad"
              name="modality"
              required
              defaultValue=""
              aria-describedby={modalityErr ? "err-reg-modalidad" : undefined}
              aria-invalid={Boolean(modalityErr) || undefined}
              className={claseInput}
            >
              <option value="" disabled>
                {t("modalityPlaceholder")}
              </option>
              <option value="presencial">{t("modalityPresencial")}</option>
              <option value="virtual">{t("modalityVirtual")}</option>
            </select>
            {modalityErr && (
              <p id="err-reg-modalidad" className={claseError}>
                {modalityErr}
              </p>
            )}
          </div>
        )}

        <div className="sm:col-span-2">
          <label htmlFor="reg-fecha-nacimiento" className={claseLabel}>
            {t("dobLabel")}
          </label>
          <input
            id="reg-fecha-nacimiento"
            name="dateOfBirth"
            type="date"
            required
            max={hoy}
            aria-describedby={
              dobErr ? "err-reg-fecha-nacimiento" : "nota-reg-fecha-nacimiento"
            }
            aria-invalid={Boolean(dobErr) || undefined}
            className={claseInput}
          />
          <p
            id="nota-reg-fecha-nacimiento"
            className="mt-1 text-sm leading-relaxed text-borahae-text/70"
          >
            {t("dobNote")}
          </p>
          {dobErr && (
            <p id="err-reg-fecha-nacimiento" className={claseError}>
              {dobErr}
            </p>
          )}
        </div>
      </div>

      {/* Honeypot: campo trampa para bots. Oculto y fuera del tab order. */}
      <div hidden aria-hidden="true">
        <label>
          {t("honeypot")}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      <div className="mt-6 flex items-start gap-3">
        <input
          id="reg-mayor-edad"
          name="adultDeclaration"
          type="checkbox"
          required
          value="true"
          aria-describedby={adultErr ? "err-reg-mayor-edad" : undefined}
          aria-invalid={Boolean(adultErr) || undefined}
          className={`mt-1 shrink-0 ${claseCheck}`}
        />
        <div className="min-w-0">
          <label
            htmlFor="reg-mayor-edad"
            className="text-sm leading-relaxed text-borahae-text/90"
          >
            {t("adultDeclaration")}
          </label>
          {adultErr && (
            <p id="err-reg-mayor-edad" className={`${claseError} mt-1`}>
              {adultErr}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-start gap-3">
        <input
          id="reg-consentimiento"
          name="consent"
          type="checkbox"
          required
          value="true"
          aria-describedby={consentErr ? "err-reg-consentimiento" : undefined}
          aria-invalid={Boolean(consentErr) || undefined}
          className={`mt-1 shrink-0 ${claseCheck}`}
        />
        <div className="min-w-0">
          <label
            htmlFor="reg-consentimiento"
            className="text-sm leading-relaxed text-borahae-text/90"
          >
            {t.rich("consentText", {
              link: (chunks) => (
                <Link
                  href="/legal/politica-de-tratamiento-de-datos"
                  className="text-borahae-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-borahae-text"
                >
                  {chunks}
                </Link>
              ),
            })}
          </label>
          {consentErr && (
            <p id="err-reg-consentimiento" className={`${claseError} mt-1`}>
              {consentErr}
            </p>
          )}
        </div>
      </div>

      {estado.fase === "error" && (
        <p
          role="alert"
          className="mt-5 rounded-lg bg-borahae-surface p-4 text-sm leading-relaxed text-borahae-text"
        >
          {mensajeError[estado.error]}
        </p>
      )}

      <button
        type="submit"
        disabled={estado.fase === "enviando"}
        className="mt-8 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-borahae-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-borahae-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-borahae-text disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        {estado.fase === "enviando" ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}

/** Id del elemento por campo (coincide con los `htmlFor`/`id` del form). */
const campoAId: Record<string, string> = {
  name: "reg-nombre",
  email: "reg-correo",
  phone: "reg-telefono",
  city: "reg-ciudad",
  modality: "reg-modalidad",
  dateOfBirth: "reg-fecha-nacimiento",
  adultDeclaration: "reg-mayor-edad",
  consent: "reg-consentimiento",
};

/** Mueve el foco al primer campo con error: sin esto, teclado/SR lo buscan a ciegas. */
function enfocarPrimerInvalido(issues: Issue[]): void {
  for (const { field } of issues) {
    const el = document.getElementById(campoAId[field] ?? field);
    if (el) {
      el.focus();
      return;
    }
  }
}
