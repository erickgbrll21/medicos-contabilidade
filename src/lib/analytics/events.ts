"use client";

import { readConsent } from "@/lib/consent";

export type AnalyticsEvent =
  | "page_view"
  | "view_services"
  | "click_whatsapp"
  | "form_start"
  | "form_submit"
  | "lead_generated"
  | "click_cta"
  | "select_cnpj_status";

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

// Eventos que só podem contar uma vez por sessão do navegador.
const ONCE_PER_SESSION: AnalyticsEvent[] = ["view_services", "form_start"];

const META_STANDARD: Partial<Record<AnalyticsEvent, string>> = {
  lead_generated: "Lead",
  click_whatsapp: "Contact",
};

function alreadySent(key: string) {
  try {
    if (sessionStorage.getItem(key)) return true;
    sessionStorage.setItem(key, "1");
  } catch {
    // sessionStorage indisponível (modo privado restrito): segue sem deduplicar.
  }
  return false;
}

/**
 * Dispara o evento para GTM (dataLayer), GA4 (gtag) e Meta Pixel (fbq), quando configurados.
 * `dedupeId` garante que conversões (ex.: lead_generated) contem uma única vez por lead.
 */
export function track(event: AnalyticsEvent, params: Params = {}, dedupeId?: string) {
  if (typeof window === "undefined") return;
  if (readConsent() !== "accepted") return;
  if (ONCE_PER_SESSION.includes(event) && alreadySent(`bc_evt_${event}`)) return;
  if (dedupeId && alreadySent(`bc_evt_${event}_${dedupeId}`)) return;

  const payload = { ...params, ...(dedupeId ? { event_id: dedupeId } : {}) };

  window.dataLayer?.push({ event, ...payload });
  // Com GTM ativo, o GA4 deve ser configurado dentro do GTM para não contar em dobro.
  if (!process.env.NEXT_PUBLIC_GTM_ID) window.gtag?.("event", event, payload);

  const metaEvent = META_STANDARD[event];
  if (metaEvent) window.fbq?.("track", metaEvent, params, dedupeId ? { eventID: dedupeId } : undefined);
  else if (event !== "page_view") window.fbq?.("trackCustom", event, params);
}
