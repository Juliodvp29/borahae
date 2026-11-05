import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from "next";

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

export default withPayload(nextConfig);
