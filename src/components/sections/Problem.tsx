import { ArrowRight } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";
import { CtaLink } from "@/components/ui/CtaLink";
import { Reveal } from "@/components/ui/Reveal";

const situations = [
  "Sua contabilidade não analisa oportunidades de economia tributária?",
  "Você não sabe se está no regime tributário mais adequado?",
  "Seus custos contábeis parecem elevados?",
  "Você recebe pouca orientação sobre sua organização financeira?",
  "Você não tem clareza sobre quanto realmente paga de impostos?",
];

export function Problem() {
  return (
    <section aria-labelledby="problema-title" className="bg-white py-24 sm:py-32">
      <div className="container-page grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <h2 id="problema-title" className="text-section max-w-[14ch]">
              Você está pagando mais impostos do que deveria?
            </h2>
            <p className="text-lead mt-6 max-w-[34rem] text-muted">
              Muitos profissionais da saúde acabam comprometendo parte significativa dos seus rendimentos por falta
              de planejamento tributário e acompanhamento contábil especializado.
            </p>
          </div>
        </div>

        <div className="lg:col-span-7">
          <ul className="border-b border-line">
            {situations.map((text, i) => (
              <Reveal as="li" key={text} className="flex items-start gap-5 border-t border-line py-6 sm:py-7">
                <span aria-hidden="true" className="mt-[0.4em] w-6 shrink-0 text-sm font-medium tabular-nums text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-[1.3125rem] leading-snug tracking-[-0.01em] text-graphite sm:text-[1.5rem]">
                  {text}
                </span>
              </Reveal>
            ))}
          </ul>

          <Reveal className="mt-12 sm:mt-14">
            <p className="font-display max-w-[30ch] text-[1.5rem] leading-snug tracking-[-0.015em] sm:text-[1.75rem]">
              Uma contabilidade estratégica pode fazer a diferença na rentabilidade da sua atividade médica.
            </p>
            <CtaLink
              trackingId="problema"
              prefill={{ objetivo: "reduzir_impostos" }}
              className={buttonClasses("primary", "lg", "mt-8 w-full sm:w-auto")}
            >
              Quero analisar minha situação tributária
              <ArrowRight className="size-[1.125rem] transition-transform duration-200 group-hover/btn:translate-x-0.5" strokeWidth={1.75} aria-hidden="true" />
            </CtaLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
