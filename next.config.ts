import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

/**
 * CSP (Fase 6, AGENTS §5.5): compatible con lo que usamos hoy —
 * Vercel Blob (imágenes del CMS y subidas del admin), fuentes autohospedadas
 * por next/font (sin dominios externos) y el panel de Payload (scripts y
 * estilos inline de Next/React). Turnstile aún no está integrado; cuando
 * entre (mejora futura del antispam) hay que añadir
 * https://challenges.cloudflare.com a script-src/frame-src/connect-src.
 * En dev Turbopack necesita 'unsafe-eval'.
 *
 * Las cabeceras aplican a TODO (incluye /admin y /api); probadas contra
 * el panel antes de subir.
 */
const esDev = process.env.NODE_ENV === "development";

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${esDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "media-src 'self' blob: https:",
  "font-src 'self' data:",
  `connect-src 'self'${esDev ? " ws:" : " https://*.public.blob.vercel-storage.com"}`,
  "worker-src 'self' blob:",
  "frame-src 'self'",
  "frame-ancestors 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  // En Vercel (HTTPS siempre activo); en preview también es seguro.
  { key: "Strict-Transport-Security", value: "max-age=15552000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  // cacheComponents deshabilitado: la doc de Payload advierte compatibilidad
  // limitada; se revisará al integrar contenido público (Fase 4).
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

const withNextIntl = createNextIntlPlugin(); // usa src/i18n/request.ts por defecto

export default withNextIntl(withPayload(nextConfig));
