import { RichText } from "@payloadcms/richtext-lexical/react";

/**
 * Tipo de los datos serializados que `RichText` espera. Se infiere de las
 * props del componente para no importar `lexical` directo (dependencia
 * transitoria de Payload, no resuelta por pnpm de forma estricta).
 */
export type RichTextData = Parameters<typeof RichText>[0]["data"];
/** Cast entre el richText generado por Payload y el que pinta RichText.
 *  El llamador comprueba antes que exista contenido. */
export function toRichTextData(content: unknown): RichTextData {
  return content as RichTextData;
}
