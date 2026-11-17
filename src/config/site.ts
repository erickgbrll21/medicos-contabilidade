// Dados institucionais extraídos de https://bcconsultores.adv.br.
// Qualquer alteração de contato ou números deve ser feita somente aqui.

export const siteConfig = {
  name: "BC Consultores",
  legalName: "Botelho e Castro Consultores",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  officialSite: "https://bcconsultores.adv.br",
  officialPrivacyPolicy: "https://bcconsultores.adv.br/politica-de-privacidade",
  officialStructure: "https://bcconsultores.adv.br/#estrutura",
  lawFirmSite: "https://www.bcadvogados.adv.br/",
  leadSource: "Landing Page — Contabilidade para Médicos",

  contact: {
    phoneDisplay: "(31) 3295-0497",
    phoneHref: "tel:+553132950497",
    email: "contabilidade@bcconsultores.adv.br",
    hours: "Segunda a sexta, das 07:30 às 18:00",
    address: {
      street: "Rua Buenos Aires, 10 – 12º andar",
      district: "Carmo",
      city: "Belo Horizonte",
      state: "MG",
      country: "BR",
    },
  },

  whatsappNumber: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5531985614005").replace(/\D/g, ""),

  stats: [
    { value: "+200", label: "clientes ativos" },
    { value: "+15", label: "anos de experiência" },
  ],
} as const;

export const navLinks = [
  { href: "#planos", label: "Planos" },
  { href: "#servicos", label: "Serviços" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#sobre", label: "Sobre" },
  { href: "#contato", label: "Contato" },
] as const;
