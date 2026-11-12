import { siteConfig } from "@/config/site";
import type { LeadFormValues } from "@/lib/validations/lead-schema";
import {
  OBJECTIVES,
  REVENUE_RANGES,
  SEGMENTS,
  type Attribution,
  type CrmLeadPayload,
  type Objective,
  type Segment,
} from "@/types/lead";

const SEGMENT_BY_OBJECTIVE: Record<Objective, Segment> = {
  abrir_cnpj: "abertura_cnpj",
  reduzir_impostos: "revisao_tributaria",
  revisar_contabilidade: "revisao_tributaria",
  contratar_contabilidade: "contabilidade_recorrente",
  outros: "outros",
};

export function buildCrmPayload(
  leadId: string,
  lead: LeadFormValues,
  attribution: Attribution,
  convertedAt = new Date(),
): CrmLeadPayload {
  return {
    lead_id: leadId,
    origem: siteConfig.leadSource,
    segmento: SEGMENTS[SEGMENT_BY_OBJECTIVE[lead.objetivo]],
    nome: lead.nome,
    telefone: `+55${lead.whatsapp.replace(/\D/g, "")}`,
    email: lead.email.toLowerCase(),
    especialidade: lead.especialidade,
    cidade: lead.cidade,
    uf: lead.uf,
    cidade_uf: `${lead.cidade}/${lead.uf}`,
    possui_cnpj: lead.possuiCnpj === "sim" ? "Sim" : "Não",
    objetivo: OBJECTIVES[lead.objetivo],
    faturamento: lead.faturamento ? REVENUE_RANGES[lead.faturamento] : "Não informado",
    observacoes: lead.observacoes ?? "",
    consentimento_lgpd: true,
    data_conversao: convertedAt.toISOString(),
    pagina_origem: attribution.landing_page ?? siteConfig.url,
    referrer: attribution.referrer ?? "",
    utm_source: attribution.utm_source ?? "",
    utm_medium: attribution.utm_medium ?? "",
    utm_campaign: attribution.utm_campaign ?? "",
    utm_content: attribution.utm_content ?? "",
    utm_term: attribution.utm_term ?? "",
    campanha_id: attribution.campaign_id ?? attribution.utm_id ?? "",
    gclid: attribution.gclid ?? "",
    fbclid: attribution.fbclid ?? "",
  };
}

export type DeliveryResult = { ok: true } | { ok: false; error: string; retryable: boolean };

const ATTEMPT_DELAYS_MS = [0, 500, 1500];

/**
 * Envia o lead ao webhook/API do CRM configurado em CRM_API_URL.
 * O cabeçalho Idempotency-Key (= lead_id) permite ao CRM ou à automação descartar reenvios.
 */
export async function sendLeadToCrm(payload: CrmLeadPayload): Promise<DeliveryResult> {
  const url = process.env.CRM_API_URL;
  if (!url) return { ok: false, error: "CRM_API_URL não configurada", retryable: true };

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Idempotency-Key": payload.lead_id,
  };
  const apiKey = process.env.CRM_API_KEY;
  if (apiKey) {
    const headerName = process.env.CRM_AUTH_HEADER || "Authorization";
    headers[headerName] = headerName.toLowerCase() === "authorization" ? `Bearer ${apiKey}` : apiKey;
  }

  let last: DeliveryResult = { ok: false, error: "não enviado", retryable: true };
  for (const delay of ATTEMPT_DELAYS_MS) {
    if (delay) await new Promise((r) => setTimeout(r, delay));
    try {
      const res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(8000),
        cache: "no-store",
      });
      if (res.ok) return { ok: true };
      const retryable = res.status >= 500 || res.status === 429 || res.status === 408;
      last = { ok: false, error: `CRM respondeu HTTP ${res.status}`, retryable };
      if (!retryable) return last;
    } catch (err) {
      last = { ok: false, error: err instanceof Error ? err.message : String(err), retryable: true };
    }
  }
  return last;
}
