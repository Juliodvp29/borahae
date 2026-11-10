import { getPayloadClient } from "@/lib/payload";
import { POLICY_VERSION } from "@/lib/contact-schema";

/**
 * Documentos legales disponibles (Batch J). Whitelist estricta: la ruta
 * `/legal/[slug]` solo acepta estas 3 URLs (AGENTS §4) — todo lo demás es
 * 404, el editor no puede crear URLs legales nuevas.
 */
export const LEGAL_DOCUMENT_SLUGS = [
  "politica-de-tratamiento-de-datos",
  "terminos-y-condiciones",
  "condiciones-de-viaje",
] as const;

export type LegalDocumentSlug = (typeof LEGAL_DOCUMENT_SLUGS)[number];

export function isLegalDocumentSlug(value: string): value is LegalDocumentSlug {
  return (LEGAL_DOCUMENT_SLUGS as readonly string[]).includes(value);
}

/**
 * Versión de la política de tratamiento de datos vigente (AGENTS §5.3/§11):
 * el consentimiento del formulario guarda la versión del texto que el
 * visitante realmente leyó. Se lee del documento publicado del CMS
 * (preferimos su fecha de vigencia o versión); sin doc publicada o sin
 * versión explícita, cae al fallback fijo de `contact-schema`.
 */
export async function getPolicyVersion(): Promise<string> {
  try {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "legal-docs",
      where: {
        and: [
          { slug: { equals: "politica-de-tratamiento-de-datos" } },
          { _status: { equals: "published" } },
        ],
      },
      limit: 1,
      depth: 0,
    });
    const doc = res.docs[0] as
      | { version?: string | null; effectiveDate?: string | null }
      | undefined;
    const clean = (value: string | null | undefined) =>
      value?.trim() ? value.trim() : null;
    const vigencia = doc?.effectiveDate?.slice(0, 10) ?? null;
    return clean(doc?.version) ?? vigencia ?? POLICY_VERSION;
  } catch {
    return POLICY_VERSION;
  }
}
