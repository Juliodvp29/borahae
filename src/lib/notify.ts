import { getPayloadClient } from "@/lib/payload";

/**
 * Notificación al correo institucional con Resend vía REST (sin SDK).
 * Compartida por los endpoints de contacto e inscripción a eventos.
 *
 * Degradación elegante (AGENTS §5.3): sin `RESEND_API_KEY` o sin correo
 * institucional en site-settings, devuelve false y el registro NO se
 * pierde — ya está guardado antes de llamar aquí. Nunca se registran
 * datos personales en los errores (AGENTS §5.5).
 */
export async function notifyInstitutional(config: {
  subject: string;
  text: string;
  /** Correo del visitante para responder directo (reply_to). */
  replyTo?: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const payload = await getPayloadClient();
  const settings = await payload
    .findGlobal({ slug: "site-settings" })
    .catch(() => null);
  const destino = settings?.contactEmail;
  // Sin dominio verificado ni correo del cliente todavía: no se envía.
  if (!apiKey || !destino) return false;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "BORAHAE Web <onboarding@resend.dev>", // sin dominio propio aún
        to: [destino],
        ...(config.replyTo ? { reply_to: config.replyTo } : {}),
        subject: config.subject,
        text: config.text,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
