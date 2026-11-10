import { z } from "zod";

/**
 * Esquema compartido cliente/servidor del formulario de contacto
 * (AGENTS §5.3: mismas reglas en ambos lados, p. ej. Zod).
 * Coincide con `contact-submissions` (spec funcional §7.1).
 * El honeypot NO va aquí: solo se inspecciona en el endpoint.
 *
 * Los mensajes no van en el esquema: el endpoint devuelve códigos de error
 * y la UI los traduce con next-intl (es/ko).
 */
export const POLICY_VERSION = "2026-11-10"; // [PENDIENTE-CLIENTE] versión real del texto legal publicado

const topicValues = [
  "interes",
  "voluntariado",
  "alianza",
  "donacion",
  "prensa",
  "otro",
] as const;

const ageRangeValues = [
  "u18",
  "18-24",
  "25-34",
  "35-44",
  "45-54",
  "55-64",
  "65+",
] as const;

export const ageRangeOptions = ageRangeValues;
export type AgeRange = (typeof ageRangeValues)[number];
export type Topic = (typeof topicValues)[number];

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3)
    .max(80),
  ageRange: z.enum(ageRangeValues),
  email: z
    .string()
    .trim()
    .min(5)
    .max(100)
    .email(),
  phone: z
    .string()
    .trim()
    .min(6)
    .max(25),
  topic: z.enum(topicValues),
  message: z
    .string()
    .trim()
    .min(10)
    .max(2000),
  consent: z.literal(true),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Devuelve {campo, código} por cada issue del esquema (sin el checkbox de consentimiento). */
export function contactIssues(error: z.ZodError): Array<{
  field: string;
  code: "required" | "invalidEmail" | "tooShort" | "tooLong" | "invalidValue";
}> {
  return error.issues
    .map((issue) => {
      const field = String(issue.path[0] ?? "");
      let code: string;
      if (issue.code === "invalid_type") code = "required";
      else if (issue.code === "too_small") code = "tooShort";
      else if (issue.code === "too_big") code = "tooLong";
      else if (field === "email") code = "invalidEmail";
      else code = "invalidValue";
      // email vacío → la UI muestra "obligatorio", no "correo inválido".
      if (field === "email" && code === "tooShort") code = "required";
      return { field, code: code as never };
    })
    .filter(({ field }) => field !== "consent");
}
