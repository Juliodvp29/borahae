"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { contactSchema } from "@/lib/contact-schema";

/**
 * Formulario de contacto (AGENTS §5.3). Validación con el MISMO esquema Zod
 * del servidor; los códigos de error del endpoint se traducen con next-intl.
 * Honeypot "website": invisible para teclado/lectores de pantalla; solo los
 * bots lo llenan. El consentimiento es obligatorio y el enlace apunta a la
 * política publicada.
 */

type Issue = { field: string; code: "required" | "invalidEmail" | "tooShort" | "tooLong" | "invalidValue" };

type Estado =
  | { fase: "listo" }
  | { fase: "enviando" }
  | { fase: "exito" }
  | { fase: "error"; error: "rateLimit" | "server" | "desconocido"; issues?: Issue[] };

export function ContactForm(): React.JSX.Element {
  const t = useTranslations("contact");
  const [estado, setEstado] = useState<Estado>({ fase: "listo" });
  const [issues, setIssues] = useState<Issue[]>([]);

  const issueDe = (field: string): string | null => {
    const found = issues.find((item) => item.field === field);
    if (!found) return null;
    if (found.code === "required") {
      return field === "consent" ? t("errors.consent") : t("errors.required");
    }
    if (found.code === "invalidEmail") return t("errors.invalidEmail");
    if (found.code === "tooShort") return t("errors.tooShort");
    if (found.code === "tooLong") return t("errors.tooLong");
    return t("errors.required");
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const raw = Object.fromEntries(new FormData(form).entries());
    const parsed = contactSchema.safeParse(raw);
    if (!parsed.success) {
      const encontrados = contactIssuesLocal(parsed.error);
      // Consentimiento sin marcar: el mapper lo filtra, pero el envío
      // silencioso no es aceptable — mostramos el mensaje y foco en la casilla.
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
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = (await res.json()) as {
        ok: boolean;
        error?: "rateLimit" | "server" | "invalidRequest" | "validation";
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
      if (res.status === 429 && json.error === "rateLimit") {
        setEstado({ fase: "error", error: "rateLimit" });
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
        <h2 className="font-display mt-3 text-xl text-borahae-text">
          {t("successTitle")}
        </h2>
        <p className="mt-3 leading-relaxed text-borahae-text/90">
          {t("successText")}
        </p>
      </div>
    );
  }

  // Estilo compartido para inputs/textarea (44 px de alto → AGENTS §6).
  const claseInput =
    "min-h-11 w-full rounded-lg border border-borahae-primary/25 bg-white px-4 py-3 text-base text-borahae-text placeholder:text-borahae-text/40 focus:border-borahae-primary focus:outline-2 focus:outline-offset-1 focus:outline-borahae-primary aria-invalid:border-borahae-primary-hover";
  const claseLabel =
    "mb-2.5 block text-sm font-medium text-borahae-text after:content-['*'] after:ml-1 after:text-borahae-primary";
  const claseError = "mt-1 text-sm text-borahae-primary-hover";

  const nombreErr = issueDe("name");
  const edadErr = issueDe("ageRange");
  const emailErr = issueDe("email");
  const phoneErr = issueDe("phone");
  const topicErr = issueDe("topic");
  const messageErr = issueDe("message");
  const consentErr = issueDe("consent");

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      className="rounded-xl border border-borahae-primary/15 bg-white p-6 md:p-8"
    >
      <div aria-live="polite" className="sr-only">
        {estado.fase === "error"
          ? estado.error === "rateLimit"
            ? t("rateLimitText")
            : t("errorText")
          : messageErr || emailErr || consentErr
            ? t("errors.summary")
            : ""}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="nombre" className={claseLabel}>
            {t("nameLabel")}
          </label>
          <input
            id="nombre"
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={80}
            aria-describedby={nombreErr ? "err-nombre" : undefined}
            aria-invalid={Boolean(nombreErr) || undefined}
            className={claseInput}
          />
          {nombreErr && (
            <p id="err-nombre" className={claseError}>
              {nombreErr}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="rango-edad" className={claseLabel}>
            {t("ageRangeLabel")}
          </label>
          <select
            id="rango-edad"
            name="ageRange"
            required
            defaultValue=""
            aria-describedby={edadErr ? "err-edad" : undefined}
            aria-invalid={Boolean(edadErr) || undefined}
            className={claseInput}
          >
            <option value="" disabled>
              {t("ageRangePlaceholder")}
            </option>
            <option value="u18">{t("range.u18")}</option>
            <option value="18-24">{t("range.18-24")}</option>
            <option value="25-34">{t("range.25-34")}</option>
            <option value="35-44">{t("range.35-44")}</option>
            <option value="45-54">{t("range.45-54")}</option>
            <option value="55-64">{t("range.55-64")}</option>
            <option value="65+">{t("range.65+")}</option>
          </select>
          {edadErr && (
            <p id="err-edad" className={claseError}>
              {edadErr}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="correo" className={claseLabel}>
            {t("emailLabel")}
          </label>
          <input
            id="correo"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={100}
            aria-describedby={emailErr ? "err-correo" : undefined}
            aria-invalid={Boolean(emailErr) || undefined}
            className={claseInput}
          />
          {emailErr && (
            <p id="err-correo" className={claseError}>
              {emailErr}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="telefono" className={claseLabel}>
            {t("phoneLabel")}
          </label>
          <input
            id="telefono"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            maxLength={25}
            aria-describedby={phoneErr ? "err-telefono" : undefined}
            aria-invalid={Boolean(phoneErr) || undefined}
            className={claseInput}
          />
          {phoneErr && (
            <p id="err-telefono" className={claseError}>
              {phoneErr}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="motivo" className={claseLabel}>
            {t("topicLabel")}
          </label>
          <select
            id="motivo"
            name="topic"
            required
            defaultValue=""
            aria-describedby={topicErr ? "err-motivo" : undefined}
            aria-invalid={Boolean(topicErr) || undefined}
            className={claseInput}
          >
            <option value="" disabled>
              {t("topicPlaceholder")}
            </option>
            <option value="interes">{t("topic.interes")}</option>
            <option value="voluntariado">{t("topic.voluntariado")}</option>
            <option value="alianza">{t("topic.alianza")}</option>
            <option value="donacion">{t("topic.donacion")}</option>
            <option value="prensa">{t("topic.prensa")}</option>
            <option value="otro">{t("topic.otro")}</option>
          </select>
          {topicErr && (
            <p id="err-motivo" className={claseError}>
              {topicErr}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="mensaje" className={claseLabel}>
            {t("messageLabel")}
          </label>
          <textarea
            id="mensaje"
            name="message"
            rows={6}
            required
            maxLength={2000}
            aria-describedby={messageErr ? "err-mensaje" : undefined}
            aria-invalid={Boolean(messageErr) || undefined}
            className={`${claseInput} min-h-32 resize-y`}
          />
          {messageErr && (
            <p id="err-mensaje" className={claseError}>
              {messageErr}
            </p>
          )}
        </div>
      </div>

      {/* Honeypot: campo trampa para bots. Oculto con CSS y fuera del tab order. */}
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

      <div className="mt-6">
        <input
          id="consentimiento"
          name="consent"
          type="checkbox"
          required
          value="true"
          aria-describedby={consentErr ? "err-consentimiento" : undefined}
          aria-invalid={Boolean(consentErr) || undefined}
          className={`size-5 rounded border-borahae-primary/40 text-borahae-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-borahae-primary ${consentErr ? "outline-2 outline-offset-2 outline-borahae-primary-hover" : ""}`}
        />
        <label
          htmlFor="consentimiento"
          className="ml-3 inline align-top text-sm leading-relaxed text-borahae-text/90"
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
          <p id="err-consentimiento" className={`${claseError} mt-2`}>
            {consentErr}
          </p>
        )}
      </div>

      {estado.fase === "error" && (
        <p role="alert" className="mt-5 rounded-lg bg-borahae-surface p-4 text-sm leading-relaxed text-borahae-text">
          {estado.error === "rateLimit" ? t("rateLimitText") : t("errorText")}
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

/** ZodError → códigos concretos (misma lógica que el endpoint en contact-schema). */
function contactIssuesLocal(error: { issues: Array<{ path: Array<unknown>; code: string }> }): Issue[] {
  const mapped = error.issues.map((issue) => {
    const field = String(issue.path[0] ?? "");
    let code: Issue["code"];
    if (issue.code === "invalid_type" || issue.code === "too_small") {
      code = field === "email" && issue.code !== "invalid_type" ? "invalidEmail" : "required";
    } else if (issue.code === "too_big") {
      code = "tooLong";
    } else if (field === "email") {
      code = "invalidEmail";
    } else {
      code = "required";
    }
    return { field, code };
  });
  return mapped.filter(({ field }) => field !== "consent");
}

/** Id del elemento por campo (coincide con los `htmlFor`/`id` del form). */
const campoAId: Record<string, string> = {
  name: "nombre",
  ageRange: "rango-edad",
  email: "correo",
  phone: "telefono",
  topic: "motivo",
  message: "mensaje",
  consent: "consentimiento",
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
