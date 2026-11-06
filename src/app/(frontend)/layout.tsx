import type { Metadata } from "next";
import "../../styles/globals.css";
import { notoSansKr, notoSerifKr } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "BORAHAE — Intercambio cultural Colombia · Corea",
  description:
    "Curso de coreano, becas, talleres, eventos y viajes organizados por BORAHAE, una entidad sin fines de lucro dedicada al intercambio cultural entre Colombia y Corea del Sur.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${notoSansKr.variable} ${notoSerifKr.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
