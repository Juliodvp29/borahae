import { z } from "zod";

/**
 * Esquema compartido cliente/servidor del formulario de inscripción a
 * eventos (spec funcional §7.2 + AGENTS §5.3). Coincide con
 * `event-registrations`.
 *
 * REGLA 18+ (AGENTS §5.3): `dateOfBirth` es **solo de tránsito** — el
 * endpoint calcula la edad en servidor y NUNCA se persiste; en la BD solo
 * queda la trazabilidad (`adultEligibilityConfirmedAt`). El endpoint
 * recibe además el `locale` explícito (next/root-params no cubre Route
 * Handlers, decisión 2026-11-10).
 *
 * Los mensajes no van en el esquema: el endpoint devuelve códigos de error
 * y la UI los traduce con next-intl (es/ko).
 */

const modalityValues = ["presencial", "virtual"] as const;

export const eventRegistrationSchema = z.object({
  eventSlug: z.string().trim().min(1).max(120),
  locale: z.enum(["es", "ko"]),
  name: z.string().trim().min(3).max(80),
  email: z.string().trim().min(5).max(100).email(),
  // Opcionales (spec §7.2). En vacío se normalizan a undefined.
  phone: z
    .union([z.string().trim().min(6).max(25), z.literal("")])
    .optional()
    .transform((v) => (v ? v : undefined)),
  city: z
    .union([z.string().trim().min(1).max(80), z.literal("")])
    .optional()
    .transform((v) => (v ? v : undefined)),
  // Solo se envía en eventos híbridos; el servidor completa el resto.
  modality: z.enum(modalityValues).optional(),
  // Fecha ISO yyyy-mm-dd. Transitoria: validada y descartada en servidor.
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "invalidDate"),
  // Declaración explícita de mayoría de edad + consentimiento de datos.
  adultDeclaration: z.literal(true),
  consent: z.literal(true),
});

export type EventRegistrationInput = z.infer<typeof eventRegistrationSchema>;

export type IssueCode =
  | "required"
  | "invalidEmail"
  | "tooShort"
  | "tooLong"
  | "invalidValue"
  | "invalidDate";

/** Devuelve {campo, código} por cada issue (sin los checkboxes del esquema). */
export function eventRegistrationIssues(error: z.ZodError): Array<{
  field: string;
  code: IssueCode;
}> {
  const skip = new Set(["consent", "adultDeclaration"]);
  return error.issues
    .map((issue) => {
      const field = String(issue.path[0] ?? "");
      let code: string;
      if (issue.code === "invalid_type") code = "required";
      else if (issue.code === "too_small") code = "tooShort";
      else if (issue.code === "too_big") code = "tooLong";
      else if (field === "email") code = "invalidEmail";
      else if (field === "dateOfBirth") code = "invalidDate";
      else code = "invalidValue";
      // email vacío → "obligatorio", no "correo inválido".
      if (field === "email" && code === "tooShort") code = "required";
      return { field, code: code as IssueCode };
    })
    .filter(({ field }) => !skip.has(field));
}

/**
 * Edad cumplida (años completos) a partir de una fecha ISO yyyy-mm-dd.
 * Devuelve null si la fecha es inválida o futura.
 */
export function edadCumplida(dateOfBirth: string, now = new Date()): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateOfBirth);
  if (!match) return null;
  const [, y, m, d] = match;
  const nacimiento = new Date(Number(y), Number(m) - 1, Number(d));
  if (Number.isNaN(nacimiento.getTime())) return null;
  // La fecha se parseó con componentes separados: validar round-trip
  // (descarta 2026-02-30 → 02 de marzo).
  if (
    nacimiento.getFullYear() !== Number(y) ||
    nacimiento.getMonth() !== Number(m) - 1 ||
    nacimiento.getDate() !== Number(d)
  ) {
    return null;
  }
  if (nacimiento.getTime() > now.getTime()) return null;

  let edad = now.getFullYear() - nacimiento.getFullYear();
  const yaCumplio =
    now.getMonth() > nacimiento.getMonth() ||
    (now.getMonth() === nacimiento.getMonth() && now.getDate() >= nacimiento.getDate());
  if (!yaCumplio) edad -= 1;
  return edad;
}
