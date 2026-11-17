import { siteConfig } from "@/config/site";
import { OBJECTIVES, type CnpjStatus, type Objective } from "@/types/lead";

export const DEFAULT_WHATSAPP_MESSAGE =
  "Olá! Vim pelo site da Fechou Tributo e gostaria de falar com um especialista em contabilidade para médicos.";

export function whatsappUrl(message: string = DEFAULT_WHATSAPP_MESSAGE) {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function leadWhatsappMessage(lead: { nome: string; possuiCnpj?: CnpjStatus; objetivo?: Objective }) {
  return [
    "Olá! Acabei de preencher o formulário no site da Fechou Tributo e gostaria de receber mais informações sobre os serviços contábeis para médicos.",
    "",
    `Nome: ${lead.nome.trim()}`,
    lead.possuiCnpj ? `Possui CNPJ: ${lead.possuiCnpj === "sim" ? "Sim" : "Não"}` : null,
    lead.objetivo ? `Objetivo: ${OBJECTIVES[lead.objetivo]}` : null,
    "",
    "Aguardo o contato de um especialista!",
  ]
    .filter((line) => line !== null)
    .join("\n");
}
