"use client";

import { track } from "@/lib/analytics/events";
import { requestLeadPrefill, type LeadPrefill } from "@/lib/lead-prefill";

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  /** Identifica o CTA nos relatórios (ex.: "hero_principal"). */
  trackingId: string;
  prefill?: LeadPrefill;
};

/** Link para o formulário (#contato) que registra o clique e pré-preenche o formulário. */
export function CtaLink({ trackingId, prefill, href = "#contato", onClick, ...props }: Props) {
  return (
    <a
      href={href}
      onClick={(e) => {
        track("click_cta", { cta_id: trackingId, cta_text: e.currentTarget.textContent ?? "" });
        if (prefill) {
          requestLeadPrefill(prefill);
          if (prefill.possuiCnpj) track("select_cnpj_status", { cnpj_status: prefill.possuiCnpj, origin: trackingId });
        }
        onClick?.(e);
      }}
      {...props}
    />
  );
}
