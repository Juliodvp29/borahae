import { getPayloadClient } from "@/lib/payload";

/** Nunca almacenamos IP ni datos de red personal. */
const PER_EMAIL_MAX = 3;       // envíos por correo en 24 h
const GLOBAL_WINDOW_MS = 3_600_000; // 1 hora
const GLOBAL_MAX = 50;         // techo global por ventana (freno anti-inundación)

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; reason: "perEmail" | "global" };

/**
 * Rate limit sobre la propia BD de submissions (sin Redis ni IP).
 * Cuenta emails 24 h y total global 1 h; pequeño TOCTOU aceptable
 * (el doble envío simultáneo exacto es marginal y el cap global absorbe).
 * Se aplica por colección para que contacto e inscripción a eventos
 * compartan la regla sin bloquearse entre sí.
 */
export async function submissionRateLimit(
  collection: "contact-submissions" | "event-registrations",
  email: string,
): Promise<RateLimitResult> {
  const payload = await getPayloadClient();
  const now = new Date();

  const [porCorreo, global] = await Promise.all([
    payload.count({
      collection,
      where: {
        and: [
          { email: { equals: email } },
          { createdAt: { greater_than: new Date(now.getTime() - 86_400_000) } },
        ],
      },
    }),
    payload.count({
      collection,
      where: { createdAt: { greater_than: new Date(now.getTime() - GLOBAL_WINDOW_MS) } },
    }),
  ]);

  if (porCorreo.totalDocs >= PER_EMAIL_MAX) {
    return { allowed: false, reason: "perEmail" };
  }
  if (global.totalDocs >= GLOBAL_MAX) {
    return { allowed: false, reason: "global" };
  }
  return { allowed: true };
}
