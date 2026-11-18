import Image from "next/image";
import { ArrowRight, Rocket, Stethoscope } from "lucide-react";
import { offerConfig } from "@/config/offer";
import { buttonClasses } from "@/components/ui/Button";
import { CtaLink } from "@/components/ui/CtaLink";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { HeroPlans } from "./HeroPlans";

const delay = (ms: number) => ({ animationDelay: `${ms}ms` });

export function Hero() {
  return (
    <section id="inicio" aria-labelledby="hero-title" className="surface-dark bg-ink relative overflow-hidden pt-16 lg:pt-[4.5rem]">
      <div
        aria-hidden="true"
        className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_30%_30%,black,transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -right-40 size-[36rem] rounded-full bg-accent/20 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-32 size-[28rem] rounded-full bg-[#1d4ed8]/25 blur-[120px]"
      />

      <div className="container-page relative pb-14 sm:pb-20">
        <div className="grid lg:grid-cols-12 lg:items-center lg:gap-10">
          <div className="relative z-10 pt-10 sm:pt-14 lg:col-span-7 lg:pt-12 lg:pb-32">
            <ul className="animate-rise flex flex-wrap gap-2.5" aria-label="Destaques">
              <li className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2 text-sm font-medium backdrop-blur-md">
                <Rocket className="size-4 text-accent-bright" strokeWidth={1.75} aria-hidden="true" />
                {offerConfig.eyebrow}
              </li>
              <li className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-ink shadow-[0_8px_24px_-10px_rgb(100_175_7/0.8)]">
                <Stethoscope className="size-4" strokeWidth={2} aria-hidden="true" />
                {offerConfig.highlight}
              </li>
            </ul>

            <h1
              id="hero-title"
              className="animate-rise mt-7 max-w-[18ch] text-[clamp(2.125rem,1.4rem+2.4vw,3.75rem)] leading-[1.05] font-light tracking-[-0.03em] sm:max-w-[20ch]"
              style={delay(100)}
            >
              A contabilidade feita para{" "}
              <span className="bg-gradient-to-r from-accent-bright to-[#c8f560] bg-clip-text font-normal text-transparent">
                profissionais da saúde e profissionais liberais
              </span>
              , sem complicação.
            </h1>
            <p className="text-lead animate-rise mt-6 max-w-[36rem] text-white/75" style={delay(180)}>
              Soluções contábeis completas para <strong className="font-semibold text-white">médicos, clínicas</strong> e{" "}
              <strong className="font-semibold text-white">demais profissionais da saúde</strong>, com planos a partir de
              R$ 199/mês.
            </p>

            <div className="animate-rise mt-9 flex flex-col gap-3 sm:flex-row" style={delay(260)}>
              <CtaLink
                trackingId="hero_principal"
                prefill={{ objetivo: "contratar_contabilidade" }}
                className={buttonClasses("inverse", "lg")}
              >
                Quero contratar
                <ArrowRight className="size-[1.125rem] transition-transform duration-200 group-hover/btn:translate-x-0.5" strokeWidth={1.75} aria-hidden="true" />
              </CtaLink>
              <WhatsAppLink trackingId="hero_secundario" className={buttonClasses("outline-light", "lg")}>
                <WhatsAppIcon className="size-[1.125rem]" />
                Tirar dúvidas
              </WhatsAppLink>
            </div>
          </div>

          <figure className="animate-rise relative mt-10 aspect-[4/3] sm:aspect-[16/10] lg:col-span-5 lg:mt-0 lg:aspect-[4/5] lg:self-end" style={delay(160)}>
            <div className="absolute inset-0 overflow-hidden rounded-tr-[var(--radius-brand)] lg:rounded-none lg:[mask-composite:intersect] lg:[mask-image:linear-gradient(to_right,transparent,black_28%,black_82%,transparent),linear-gradient(to_bottom,transparent,black_22%,black_62%,transparent)]">
              <Image
                src="/images/hero-medico.webp"
                alt="Médico de jaleco e estetoscópio sorrindo em seu consultório"
                fill
                preload
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover object-[60%_18%]"
              />
              <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink to-transparent lg:hidden" />
            </div>
          </figure>
        </div>

        <HeroPlans className="animate-rise relative z-10 -mt-16 sm:-mt-24 lg:-mt-24" />
      </div>
    </section>
  );
}
