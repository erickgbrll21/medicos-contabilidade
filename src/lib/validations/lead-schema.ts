import { z } from "zod";
import { OBJECTIVES, REVENUE_RANGES, UTM_KEYS } from "@/types/lead";

export const UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA",
  "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
] as const;

const objectiveKeys = Object.keys(OBJECTIVES) as [keyof typeof OBJECTIVES, ...(keyof typeof OBJECTIVES)[]];
const revenueKeys = Object.keys(REVENUE_RANGES) as [keyof typeof REVENUE_RANGES, ...(keyof typeof REVENUE_RANGES)[]];

/** Telefone brasileiro: DDD válido + 8 dígitos (fixo) ou 9 dígitos começando com 9 (celular). */
export function isValidBrazilianPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 10 && digits.length !== 11) return false;
  const ddd = Number(digits.slice(0, 2));
  if (ddd < 11 || ddd > 99 || digits[1] === "0") return false;
  if (digits.length === 11 && digits[2] !== "9") return false;
  return !/^(\d)\1+$/.test(digits.slice(2));
}

export const leadFormSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(1, "Informe seu nome completo.")
    .max(120, "Use no máximo 120 caracteres.")
    .refine((v) => v.split(/\s+/).filter(Boolean).length >= 2, "Informe nome e sobrenome."),
  whatsapp: z
    .string()
    .trim()
    .min(1, "Informe seu WhatsApp com DDD.")
    .refine(isValidBrazilianPhone, "Número inválido. Use o formato (31) 99999-9999."),
  email: z
    .string()
    .trim()
    .min(1, "Informe seu e-mail.")
    .max(160, "Use no máximo 160 caracteres.")
    .pipe(z.email("E-mail inválido. Confira se digitou corretamente.")),
  especialidade: z
    .string()
    .trim()
    .min(2, "Informe sua especialidade médica.")
    .max(80, "Use no máximo 80 caracteres."),
  cidade: z.string().trim().min(2, "Informe sua cidade.").max(80, "Use no máximo 80 caracteres."),
  uf: z.enum(UFS, "Selecione o estado."),
  possuiCnpj: z.enum(["sim", "nao"], "Selecione se você já possui CNPJ."),
  objetivo: z.enum(objectiveKeys, "Selecione seu principal objetivo."),
  faturamento: z.union([z.enum(revenueKeys), z.literal("")]).optional(),
  observacoes: z.string().trim().max(1000, "Use no máximo 1000 caracteres.").optional(),
  consentimento: z.literal(true, "Para continuar, autorize o contato conforme a Política de Privacidade."),
});

export type LeadFormInput = z.input<typeof leadFormSchema>;
export type LeadFormValues = z.output<typeof leadFormSchema>;

const attributionSchema = z
  .object(
    Object.fromEntries(
      [...UTM_KEYS, "landing_page", "referrer"].map((k) => [k, z.string().max(500).optional()]),
    ),
  )
  .partial();

/** Corpo aceito por POST /api/leads. */
export const leadRequestSchema = z.object({
  lead: leadFormSchema,
  attribution: attributionSchema.optional().default({}),
  idempotencyKey: z.uuid(),
  /** Momento da primeira interação com o formulário; 0 quando o navegador não registrou. */
  startedAt: z.number().int().nonnegative(),
  website: z.string().max(200).optional(),
});

export type LeadRequest = z.input<typeof leadRequestSchema>;
