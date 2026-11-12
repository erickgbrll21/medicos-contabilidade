import { ArrowRight, Check } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";
import { CtaLink } from "@/components/ui/CtaLink";
import { Reveal } from "@/components/ui/Reveal";
import type { LeadPrefill } from "@/lib/lead-prefill";
import { cn } from "@/lib/utils";

type Option = {
  id: string;
  status: string;
  title: string;
  text: string;
  benefits: string[];
  cta: string;
  prefill: LeadPrefill;
  corner: string;
};

// Os cantos espelham o monograma BCC: o primeiro quadrado arredonda em cima, o último embaixo.
const options: Option[] = [
  {
    id: "sem_cnpj",
    status: "Ainda não possuo CNPJ",
    title: "Quero abrir meu CNPJ médico.",
    text: "Tenha orientação especializada para estruturar sua empresa, escolher o enquadramento adequado e começar sua atividade com segurança.",
    benefits: ["Abertura de empresa", "Orientação tributária", "Estruturação societária", "Assessoria contábil"],
    cta: "Quero abrir meu CNPJ",
    prefill: { possuiCnpj: "nao", objetivo: "abrir_cnpj" },
    corner: "rounded-tl-[var(--radius-brand)]",
  },
  {
    id: "com_cnpj",
    status: "Já possuo CNPJ",
    title: "Quero reduzir meus custos contábeis e tributários.",
    text: "Descubra se sua empresa está estruturada corretamente e se existem oportunidades de otimização tributária.",
    benefits: [
      "Revisão do regime tributário",
      "Análise de oportunidades fiscais",
      "Planejamento tributário",
      "Acompanhamento especializado",
    ],
    cta: "Quero analisar minha empresa",
    prefill: { possuiCnpj: "sim", objetivo: "reduzir_impostos" },
    corner: "rounded-br-[var(--radius-brand)]",
  },
];

export function Segmentation() {
  return (
    <section aria-labelledby="situacao-title" className="bg-white py-24 sm:py-32">
      <div className="container-page">
        <h2 id="situacao-title" className="text-section max-w-[20ch]">
          Qual situação representa melhor o seu momento profissional?
        </h2>

        <div className="mt-14 grid gap-5 sm:mt-16 lg:grid-cols-2 lg:gap-6">
          {options.map((option) => (
            <Reveal key={option.id} className="h-full">
              <article
                className={cn(
                  "group flex h-full flex-col border border-line bg-white p-7 transition-[border-color,box-shadow] duration-300 hover:border-ink hover:shadow-[0_24px_48px_-28px_rgb(16_16_16/0.35)] sm:p-10",
                  option.corner,
                )}
              >
                <p className="inline-flex w-fit items-center rounded-full border border-line px-3 py-1 text-[0.8125rem] font-medium text-graphite">
                  {option.status}
                </p>
                <h3 className="mt-7 max-w-[18ch] text-[1.75rem] leading-[1.12] tracking-[-0.02em] sm:text-[2.125rem]">
                  {option.title}
                </h3>
                <p className="mt-4 max-w-[34rem] text-[1.0625rem] leading-relaxed text-muted">{option.text}</p>

                <ul className="mt-8 grid gap-3 border-t border-line pt-7 sm:grid-cols-2">
                  {option.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3 text-[0.9375rem] text-graphite">
                      <Check className="mt-0.5 size-4 shrink-0" strokeWidth={2} aria-hidden="true" />
                      {benefit}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-10">
                  <CtaLink
                    trackingId={`situacao_${option.id}`}
                    prefill={option.prefill}
                    className={buttonClasses("primary", "lg", "w-full sm:w-auto")}
                  >
                    {option.cta}
                    <ArrowRight className="size-[1.125rem] transition-transform duration-200 group-hover/btn:translate-x-0.5" strokeWidth={1.75} aria-hidden="true" />
                  </CtaLink>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <p className="mt-8 max-w-[44rem] text-sm leading-relaxed text-muted">
          Toda oportunidade de economia depende da análise individual do seu caso e da legislação aplicável.
        </p>
      </div>
    </section>
  );
}
