"use client";

import type { CnpjStatus, Objective } from "@/types/lead";

export type LeadPrefill = { possuiCnpj?: CnpjStatus; objetivo?: Objective };

export const PREFILL_EVENT = "bc:lead-prefill";

/** CTAs pedem ao formulário que já marque a situação/objetivo escolhidos. */
export function requestLeadPrefill(prefill: LeadPrefill) {
  window.dispatchEvent(new CustomEvent<LeadPrefill>(PREFILL_EVENT, { detail: prefill }));
}
