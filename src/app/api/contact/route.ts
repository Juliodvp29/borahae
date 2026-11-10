import { NextResponse } from "next/server";
import { contactSchema, contactIssues } from "@/lib/contact-schema";
import { getPolicyVersion } from "@/lib/legal";
import { contactRateLimit } from "@/lib/rate-limit";
import { getPayloadClient } from "@/lib/payload";

/**
 * POST /api/contact — flujo AGENTS §5.3: validar (Zod, mismo esquema que
 * el cliente) → antispam (honeypot) → rate limit → guardar en PostgreSQL →
 * notificar con Resend (si hay api key) → responder.
 *
 * Reglas de datos: mínimo necesario, consentimiento con fecha/hora y
 * versión de la política; si el correo falla, el registro NO se pierde
 * (ya está guardado) y al visitante no se le muestran detalles internos.
 */
export async function POST(request: Request): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalidRequest" as const },
      { status: 400 },
    );
  }

  // Honeypot: un campo invisible que solo llenan bots. Respuesta "feliz"
  // sin guardar nada (el bot cree que tuvo éxito y no sabe que existe).
  const honeypot = (body as { website?: unknown }).website;
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation" as const, issues: contactIssues(parsed.error) },
      { status: 400 },
    );
  }
  if (!parsed.data.consent) {
    // Literal(true) ya lo garantiza; doble chequeo explícito por regla de datos.
    return NextResponse.json(
      { ok: false, error: "validation" as const, issues: [] },
      { status: 400 },
    );
  }

  const limit = await contactRateLimit(parsed.data.email);
  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false, error: "rateLimit" as const },
      { status: 429 },
    );
  }

  const data = parsed.data;
  const payload = await getPayloadClient();
  // Versión del texto legal que el visitante leyó (doc publicado del CMS;
  // fallback fijo si no hay documento). AGENTS §5.3/§11.
  const policyVersion = await getPolicyVersion();

  let docId: number;
  try {
    const doc = await payload.create({
      collection: 'contact-submissions',
      data: {
        type: data.topic,
        name: data.name,
        email: data.email,
        phone: data.phone,
        ageRange: data.ageRange,
        message: data.message,
        policyVersion: policyVersion,
        acceptedAt: new Date().toISOString(),
      },
    });
    docId = doc.id;
  } catch {
    return NextResponse.json(
      { ok: false, error: "server" as const },
      { status: 500 },
    );
  }

  // Notificación con Resend vía REST (sin dependencia). Falla no bloquea:
  // el registro ya está en la BD y solo se registra el error (sin PII).
  const envio = await notificar(data, docId, policyVersion);
  if (!envio) {
    payload.logger.error(
      { msg: `contact/${docId}: guardado; notificación Resend falló o no configurada` },
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}

async function notificar(
  data: { name: string; email: string; phone: string; ageRange: string; topic: string; message: string },
  docId: number,
  policyVersion: string,
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const payload = await getPayloadClient();
  const settings = await payload
    .findGlobal({ slug: 'site-settings' })
    .catch(() => null);
  const destino = settings?.contactEmail;
  // Sin dominio verificado ni correo del cliente todavía: guardamos igual.
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
        reply_to: data.email,
        subject: `[BORAHAE] ${data.topic}: ${data.name} (#${docId})`,
        text: [
          `Nuevo contacto desde el sitio web (#${docId})`,
          ``,
          `Nombre: ${data.name}`,
          `Rango de edad: ${data.ageRange}`,
          `Correo: ${data.email}`,
          `Teléfono: ${data.phone}`,
          `Motivo: ${data.topic}`,
          ``,
          `Mensaje:`,
          data.message,
          ``,
          `Consentimiento de política de datos aceptado (versión ${policyVersion}).`,
        ].join("\n"),
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
