/**
 * Los marcadores `[PENDIENTE-CLIENTE]` / `[CONTENIDO-FICTICIO-DEMO]` ayudan
 * al editor en el CMS a identificar contenido provisional (AGENTS §10).
 * NUNCA deben mostrarse al público: esta utilidad los limpia al renderizar.
 */
const MARKER_RE = /\s*\[[^\]]*(?:PENDIENTE-CLIENTE|CONTENIDO-FICTICIO-DEMO)[^\]]*\]/g;

export function cleanText(value: string | null | undefined): string {
  return (value ?? "").replace(MARKER_RE, "").trim();
}
