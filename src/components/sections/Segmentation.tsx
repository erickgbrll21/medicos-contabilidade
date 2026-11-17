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
    corner: "rounded-tl-[3rem]",
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
    corner: "rounded-br-[3rem]",
  },
];

export function Segmentation() {
  return (
    <section aria-labelledby="situacao-title" className="bg-mist py-24 sm:py-32">
      <div className="container-page">
        <h2 id="situacao-title" className="text-section max-w-[20ch]">
          Qual situação representa melhor o seu momento profissional?
        </h2>

        <div className="mt-14 grid gap-5 sm:mt-16 lg:grid-cols-2 lg:gap-6">
          {options.map((option) => (
            <Reveal key={option.id} className="h-full">
              <article
                className={cn(
                  "card-soft group relative flex h-full flex-col overflow-hidden p-7 transition-[transform,box-shadow] duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:shadow-[0_36px_72px_-36px_rgb(0_22_53/0.4)] sm:p-10",
                  option.corner,
                )}
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-accent/10 blur-3xl transition-colors duration-500 group-hover:bg-accent/25"
                />
                <p className="relative inline-flex w-fit items-center gap-2 rounded-full bg-mist px-3.5 py-1.5 text-[0.8125rem] font-medium text-graphite">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
                  {option.status}
                </p>
                <h3 className="mt-7 max-w-[18ch] text-[1.75rem] leading-[1.12] tracking-[-0.02em] sm:text-[2.125rem]">
                  {option.title}
                </h3>
                <p className="mt-4 max-w-[34rem] text-[1.0625rem] leading-relaxed text-muted">{option.text}</p>

                <ul className="mt-8 grid gap-3 rounded-2xl bg-mist p-5 sm:grid-cols-2">
                  {option.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-3 text-[0.9375rem] text-graphite">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-ink">
                        <Check className="size-3.5" strokeWidth={2.75} aria-hidden="true" />
                      </span>
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
