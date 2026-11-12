import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";
import { CtaLink } from "@/components/ui/CtaLink";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

const benefits = [
  "Planejamento tributário estratégico",
  "Contabilidade especializada para médicos",
  "Segurança fiscal e jurídica",
];

const delay = (ms: number) => ({ animationDelay: `${ms}ms` });

export function Hero() {
  return (
    <section id="inicio" aria-labelledby="hero-title" className="surface-dark relative overflow-hidden pt-16 lg:pt-[4.5rem]">
      <div className="container-page relative grid lg:min-h-[calc(100svh-4.5rem)] lg:grid-cols-12 lg:items-center">
        <div className="relative z-10 pt-10 pb-12 sm:pt-16 lg:col-span-7 lg:py-24 lg:pr-12 xl:col-span-6 xl:pr-0">
          <h1 id="hero-title" className="text-display animate-rise max-w-[13ch] font-light">
            Sua carreira médica merece uma contabilidade à altura.
          </h1>
          <p className="text-lead animate-rise mt-6 max-w-[38rem] text-white/70 sm:mt-8" style={delay(120)}>
            Reduza legalmente sua carga tributária, organize sua vida financeira e tenha uma contabilidade
            estratégica especializada na realidade dos profissionais da saúde.
          </p>

          <div className="animate-rise mt-9 flex flex-col gap-3 sm:flex-row lg:grid lg:w-fit" style={delay(220)}>
            <CtaLink
              trackingId="hero_principal"
              prefill={{ objetivo: "reduzir_impostos" }}
              className={buttonClasses("inverse", "lg")}
            >
              Quero pagar menos impostos
              <ArrowRight className="size-[1.125rem] transition-transform duration-200 group-hover/btn:translate-x-0.5" strokeWidth={1.75} aria-hidden="true" />
            </CtaLink>
            <WhatsAppLink trackingId="hero_secundario" className={buttonClasses("outline-light", "lg")}>
              <WhatsAppIcon className="size-[1.125rem]" />
              Falar com um especialista
            </WhatsAppLink>
          </div>

          <ul className="animate-rise mt-12 grid gap-4 sm:grid-cols-3 sm:gap-0 lg:mt-16" style={delay(320)} aria-label="Diferenciais">
            {benefits.map((item) => (
              <li
                key={item}
                className="border-l border-white/25 pl-4 text-[0.9375rem] leading-snug text-white/85 sm:pr-5"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <figure className="relative mx-5 mb-10 aspect-[4/3] overflow-hidden rounded-bl-[var(--radius-brand)] sm:mx-8 lg:absolute lg:inset-y-0 lg:right-0 lg:top-[4.5rem] lg:m-0 lg:aspect-auto lg:w-[41%] xl:w-[46%]">
        <Image
          src="/images/hero-medica.webp"
          alt="Médica de jaleco conversando com um colega em um consultório moderno"
          fill
          preload
          sizes="(min-width: 1280px) 46vw, (min-width: 1024px) 41vw, 100vw"
          className="object-cover object-[72%_35%]"
        />
        <div aria-hidden="true" className="absolute inset-y-0 left-0 hidden w-24 bg-gradient-to-r from-ink/60 to-transparent lg:block" />
        <figcaption className="absolute bottom-0 left-0 max-w-[19rem] bg-ink px-5 py-4 text-sm leading-snug text-white/90 lg:bottom-10 lg:left-10 lg:rounded-tr-[1rem]">
          Atendimento humano, sem robôs: você fala direto com um profissional da nossa equipe.
        </figcaption>
      </figure>
    </section>
  );
}
