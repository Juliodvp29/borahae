import { getTranslations } from "next-intl/server";
import { getSiteSettings } from "@/lib/payload";

/**
 * Botón flotante de WhatsApp. Se muestra **solo** si `whatsAppEnabled`
 * está activo en `site-settings` y hay número cargado (AGENTS §5.2):
 * el interruptor de negocio respeta ocultar la vía de contacto.
 */
export async function WhatsAppButton() {
  const settings = await getSiteSettings();
  if (!settings.whatsAppEnabled || !settings.whatsAppNumber) return null;

  const t = await getTranslations("whatsapp");
  const ariaLabel = t("ariaLabel");
  const href = `https://wa.me/${settings.whatsAppNumber}${
    settings.whatsAppMessage
      ? `?text=${encodeURIComponent(settings.whatsAppMessage)}`
      : ""
  }`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className="fixed bottom-6 right-6 z-40 flex h-14 min-h-11 min-w-11 items-center justify-center rounded-full bg-borahae-primary text-white shadow-lg shadow-borahae-primary/30 transition-colors focus-visible:bg-borahae-primary-hover hover:bg-borahae-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-borahae-primary md:bottom-8 md:right-8"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-7 w-7 fill-current"
      >
        {/* Icono WhatsApp (simple-icons, licencia CC0 / marca registrada de WhatsApp LLC; uso nominativo) */}
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.881-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.347-.347.52-.52.174-.174.232-.298.347-.495.115-.198.058-.371-.058-.52-.116-.148-.653-1.574-.895-2.157-.24-.583-.481-.506-.653-.515l-.44-.009c-.152 0-.397.073-.604.307-.207.233-.79.767-.79 1.871 0 1.104.81 2.171.922 2.325.113.148 1.582 2.417 3.831 3.391 1.003.433 1.707.548 2.302.556.88.013 1.646-.114 2.253-.327.754-.275 1.372-.731 1.623-1.436.163-.47.163-.903.117-1.007-.099-.098-.295-.297-.672-.462ZM12.05 21.785h-.004a9.87 9.87 0 0 1-5.03-1.378l-.361-.214-3.742.982.999-3.648-.235-.375a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.889-9.884a9.82 9.82 0 0 1 6.988 2.897 9.825 9.825 0 0 1 2.893 6.995c-.003 5.45-4.438 9.885-9.887 9.885Zm8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 0 0 5.743 1.462h.005c6.555 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.483-8.427Z" />
      </svg>
    </a>
  );
}
