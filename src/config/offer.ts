// Planos exibidos na hero. Qualquer alteração de preço ou item deve ser feita somente aqui.
// Para ocultar os planos, defina `enabled: false`.

export type PlanIcon = "documents" | "address" | "store";

export type Plan = {
  id: string;
  number: string;
  title: string;
  note: string;
  price: string;
  period: string;
  icon: PlanIcon;
  /** Selo destacado abaixo do preço (ex.: prazo da condição). */
  badge?: string;
  includes?: readonly string[];
  objetivo: "abrir_cnpj" | "contratar_contabilidade";
  possuiCnpj?: "sim" | "nao";
};

export const offerConfig = {
  enabled: true,
  eyebrow: "Lançamento da Plataforma FT",
  highlight: "Ofertas especiais para profissionais da saúde",
  footnote: { lead: "Ofertas por", highlight: "tempo limitado." },
  plans: [
    {
      id: "contabilidade",
      number: "1",
      title: "Apenas Contabilidade",
      note: "até 05 notas/mês",
      price: "199",
      period: "/mês",
      icon: "documents",
      objetivo: "contratar_contabilidade",
      possuiCnpj: "sim",
    },
    {
      id: "endereco-contabilidade",
      number: "2",
      title: "Endereço Virtual + Contabilidade",
      note: "até 05 notas/mês",
      price: "299",
      period: "/mês",
      icon: "address",
      objetivo: "contratar_contabilidade",
      possuiCnpj: "sim",
    },
    {
      id: "abertura",
      number: "3",
      title: "Abertura de Empresa",
      note: "até 05 notas/mês",
      price: "399",
      period: "/mês",
      icon: "store",
      badge: "por 12 meses",
      includes: ["Abertura de CNPJ", "Endereço Virtual", "Contabilidade (até 05 notas/mês)"],
      objetivo: "abrir_cnpj",
      possuiCnpj: "nao",
    },
  ] satisfies readonly Plan[],
} as const;
