import { Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";

/**
 * Tipografía BORAHAE (AGENTS.md §6) — cargada con next/font para autohospedado,
 * subsets acotados y display: swap.
 *
 * Ambas familias cubren Hangul y Latín (tildes, ñ). El coreano se solicita con
 * el subset "korean"; el latín se usa para la interfaz en español.
 */

/** Texto, menús, formularios y botones (ambos idiomas). */
export const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  // NOTA: next/font no lista subset "korean" para esta familia; los glifos
  // Hangul se sirven por unicode-range a demanda. "latin" precarga tildes y ñ.
  subsets: ["latin"],
  display: "swap",
});

/** Títulos y frases destacadas (ambos idiomas). */
export const notoSerifKr = Noto_Serif_KR({
  variable: "--font-noto-serif-kr",
  subsets: ["latin"], // Hangul via unicode-range on demand (ver nota arriba)
  weight: "variable", // 200–900
  display: "swap",
});
