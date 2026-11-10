import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import {
  eventRegistrationSchema,
  eventRegistrationIssues,
  edadCumplida,
} from "@/lib/event-registration-schema";
import { getPolicyVersion } from "@/lib/legal";
import { submissionRateLimit } from "@/lib/rate-limit";
import { notifyInstitutional } from "@/lib/notify";
import { getPayloadClient } from "@/lib/payload";

/**
 * POST /api/event-registration — inscripción a eventos (spec §7.2,
 * AGENTS §5.3). Flujo: validar (Zod, mismo esquema que el cliente) →
 * honeypot → rate limit → **edad ≥ 18 calculada en servidor** →
 * transacción con `SELECT ... FOR UPDATE` de la fila del evento
 * (lock: las solicitudes simultáneas se serializan y el cupo no se
 * sobrepasa) → duplicado → cupo → INSERT → commit → Resend.
 *
 * REGLA 18+: `dateOfBirth` se usa solo en memoria para calcular la edad;
 * NUNCA se persiste — en la BD queda únicamente la trazabilidad
 * (`adult_eligibility_confirmed_at`). El endpoint recibe el `locale`
 * explícito (next/root-params no cubre Route Handlers, decisión
 * 2026-11-10).
 *
 * Códigos de error (traducidos en la UI con next-intl): validation,
 * rateLimit, notFound, minor, duplicate (409), full (410), server.
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

  // Honeypot: respuesta "feliz" sin guardar nada (los bots no saben que existe).
  const honeypot = (body as { website?: unknown }).website;
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const parsed = eventRegistrationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "validation" as const,
        issues: eventRegistrationIssues(parsed.error),
      },
      { status: 400 },
    );
  }
  const data = parsed.data;

  const limit = await submissionRateLimit("event-registrations", data.email);
  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false, error: "rateLimit" as const },
      { status: 429 },
    );
  }

  const payload = await getPayloadClient();
  // Versión del texto legal que el visitante leyó (doc publicado del CMS;
  // fallback fijo si no hay documento). AGENTS §5.3/§11.
  const policyVersion = await getPolicyVersion();

  // Edad en servidor, ANTES de tocar la BD. La fecha nace con la petición
  // y muere aquí: no entra en logs ni en la BD (AGENTS §5.3/§11).
  const edad = edadCumplida(data.dateOfBirth);
  if (edad === null || edad < 18) {
    return NextResponse.json(
      { ok: false, error: "minor" as const },
      { status: 403 },
    );
  }

  // La modalidad que queda en el registro: la del evento; en eventos
  // híbridos, la que el visitante elige (obligatoria en ese caso).
  let modality: "presencial" | "virtual";

  try {
    modality = await payload.db.drizzle.transaction(async (tx) => {
      // Lock de fila: serializa inscripciones simultáneas al mismo evento
      // y garantiza que conteo + inserción sean atómicos (AGENTS §5.3).
      const evento = await tx.execute<{
        id: number;
        modality: "presencial" | "virtual" | "hibrido";
        capacity_enabled: boolean;
        capacity: string | null;
      }>(
        sql`SELECT id, modality, capacity_enabled, capacity::text AS capacity
            FROM events
            WHERE slug = ${data.eventSlug} AND _status = 'published'
            FOR UPDATE`,
      );
      const row = evento.rows[0];
      if (!row) {
        throw new RegistrationError("notFound", 404);
      }

      if (row.modality === "hibrido") {
        if (!data.modality) {
          throw new RegistrationError("validation", 400, [
            { field: "modality", code: "required" },
          ]);
        }
        modality = data.modality;
      } else {
        modality = row.modality;
      }

      // Duplicado por correo en el mismo evento: mensaje amable, no error duro.
      const duplicado = await tx.execute<{ count: string }>(
        sql`SELECT count(*)::text AS count FROM event_registrations
            WHERE event_id = ${row.id} AND email = ${data.email}`,
      );
      if (Number(duplicado.rows[0]?.count ?? "0") > 0) {
        throw new RegistrationError("duplicate", 409);
      }

      // Cupo opcional: solo si el evento lo activa. Sin lista de espera.
      if (row.capacity_enabled && row.capacity !== null) {
        const ocupados = await tx.execute<{ count: string }>(
          sql`SELECT count(*)::text AS count FROM event_registrations
              WHERE event_id = ${row.id}`,
        );
        if (Number(ocupados.rows[0]?.count ?? "0") >= Number(row.capacity)) {
          throw new RegistrationError("full", 410);
        }
      }

      const insertado = await tx.execute<{ id: number }>(
        sql`INSERT INTO event_registrations
              (event_id, name, email, phone, city, modality,
               adult_eligibility_confirmed_at, policy_version, accepted_at)
            VALUES
              (${row.id}, ${data.name}, ${data.email}, ${data.phone ?? null},
               ${data.city ?? null}, ${modality}::enum_event_registrations_modality,
               now(), ${policyVersion}, now())
            RETURNING id`,
      );
      const nuevoId = insertado.rows[0]?.id;
      if (nuevoId === undefined) {
        throw new RegistrationError("server", 500);
      }
      return modality as "presencial" | "virtual";
    });
  } catch (error) {
    if (error instanceof RegistrationError) {
      return NextResponse.json(
        {
          ok: false,
          error: error.code,
          ...(error.issues ? { issues: error.issues } : {}),
        },
        { status: error.status },
      );
    }
    payload.logger.error({
      msg: "event-registration: transacción fallida; sin detalles del visitante en el log",
    });
    return NextResponse.json(
      { ok: false, error: "server" as const },
      { status: 500 },
    );
  }

  // Notificación con Resend. Falla no bloquea: el registro ya está guardado.
  const envio = await notifyInstitutional({
    subject: `[BORAHAE] Inscripción a evento: ${data.name} (${data.eventSlug})`,
    replyTo: data.email,
    text: [
      "Nueva inscripción a evento desde el sitio web",
      ``,
      `Evento: ${data.eventSlug}`,
      `Nombre: ${data.name}`,
      `Correo: ${data.email}`,
      `Teléfono: ${data.phone ?? "—"}`,
      `Ciudad: ${data.city ?? "—"}`,
      `Modalidad: ${modality}`,
      ``,
      `Consentimiento de política de datos aceptado (versión ${policyVersion}).`,
      `Declaración de mayoría de edad confirmada y validada en servidor.`,
    ].join("\n"),
  });
  if (!envio) {
    payload.logger.error({
      msg: `event-registration/${data.eventSlug}: guardado; notificación Resend falló o no configurada`,
    });
  }

  return NextResponse.json({ ok: true, modality }, { status: 201 });
}

/** Error de dominio con código traducible y status HTTP. */
class RegistrationError extends Error {
  constructor(
    public code:
      | "validation"
      | "notFound"
      | "duplicate"
      | "full"
      | "server",
    public status: number,
    public issues?: Array<{ field: string; code: string }>,
  ) {
    super(code);
    this.name = "RegistrationError";
  }
}
