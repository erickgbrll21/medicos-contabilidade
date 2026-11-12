export const OBJECTIVES = {
  abrir_cnpj: "Abrir meu CNPJ",
  reduzir_impostos: "Reduzir minha carga tributária",
  revisar_contabilidade: "Revisar minha contabilidade atual",
  contratar_contabilidade: "Contratar uma contabilidade especializada",
  outros: "Outros",
} as const;

export const REVENUE_RANGES = {
  ate_10k: "Até R$ 10 mil",
  "10k_20k": "R$ 10 mil a R$ 20 mil",
  "20k_40k": "R$ 20 mil a R$ 40 mil",
  "40k_80k": "R$ 40 mil a R$ 80 mil",
  acima_80k: "Acima de R$ 80 mil",
  nao_informar: "Prefiro não informar",
} as const;

export const SEGMENTS = {
  abertura_cnpj: "Abertura de CNPJ",
  revisao_tributaria: "Revisão tributária",
  contabilidade_recorrente: "Contabilidade recorrente",
  outros: "Outros",
} as const;

export type Objective = keyof typeof OBJECTIVES;
export type RevenueRange = keyof typeof REVENUE_RANGES;
export type Segment = keyof typeof SEGMENTS;
export type CnpjStatus = "sim" | "nao";

export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "utm_id",
  "campaign_id",
  "gclid",
  "fbclid",
] as const;

export type Attribution = Partial<Record<(typeof UTM_KEYS)[number], string>> & {
  landing_page?: string;
  referrer?: string;
};

/** Payload enviado ao CRM. Documentado no README. */
export type CrmLeadPayload = {
  lead_id: string;
  origem: string;
  segmento: string;
  nome: string;
  telefone: string;
  email: string;
  especialidade: string;
  cidade: string;
  uf: string;
  cidade_uf: string;
  possui_cnpj: "Sim" | "Não";
  objetivo: string;
  faturamento: string;
  observacoes: string;
  consentimento_lgpd: true;
  data_conversao: string;
  pagina_origem: string;
  referrer: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  campanha_id: string;
  gclid: string;
  fbclid: string;
};
