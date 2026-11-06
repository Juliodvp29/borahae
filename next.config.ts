import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  // cacheComponents deshabilitado: la doc de Payload advierte compatibilidad
  // limitada; se revisará al integrar contenido público (Fase 4).
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
