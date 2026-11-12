import { ArrowRight, Check } from "lucide-react";
import { offerConfig } from "@/config/offer";
import { buttonClasses } from "@/components/ui/Button";
import { CtaLink } from "@/components/ui/CtaLink";
import { Reveal } from "@/components/ui/Reveal";

export function Pricing() {
  if (!offerConfig.enabled) return null;

  return (
    <section id="condicao" aria-labelledby="condicao-title" className="surface-dark py-24 sm:py-32">
      <div className="container-page grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-10">
        <div className="lg:col-span-6">
          <h2 id="condicao-title" className="text-section max-w-[17ch]">
            Comece sua jornada empresarial com uma estrutura contábil especializada.
          </h2>
          <p className="mt-8 max-w-[30rem] text-sm leading-relaxed text-white/55">{offerConfig.disclaimer}</p>
        </div>

        <Reveal className="lg:col-span-5 lg:col-start-8">
          <div className="rounded-tl-[var(--radius-brand)] border border-white/15 p-7 sm:p-10">
            <p className="flex items-baseline gap-2">
              <span className="font-display text-[clamp(3.5rem,2.5rem+4vw,5.5rem)] leading-none font-light tracking-[-0.035em] tabular-nums">
                {offerConfig.priceLabel}
              </span>
              <span className="text-lg text-white/60">{offerConfig.period}</span>
            </p>
            <p className="mt-4 text-[1.0625rem] text-white/85">{offerConfig.summary}</p>

            <ul className="mt-8 space-y-3.5 border-t border-white/15 pt-8">
              {offerConfig.items.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[0.9375rem] text-white/85">
                  <Check className="mt-0.5 size-4 shrink-0" strokeWidth={2} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>

            <CtaLink
              trackingId="condicao_comercial"
              prefill={{ possuiCnpj: "nao", objetivo: "abrir_cnpj" }}
              className={buttonClasses("inverse", "lg", "mt-10 w-full")}
            >
              Quero contratar
              <ArrowRight className="size-[1.125rem] transition-transform duration-200 group-hover/btn:translate-x-0.5" strokeWidth={1.75} aria-hidden="true" />
            </CtaLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
