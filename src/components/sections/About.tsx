import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { buttonClasses } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export function About() {
  return (
    <section id="sobre" aria-labelledby="sobre-title" className="bg-white py-24 sm:py-32">
      <div className="container-page grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-10">
        <Reveal className="lg:col-span-6">
          <div className="relative aspect-[4/3] overflow-hidden rounded-tr-[var(--radius-brand)] bg-mist lg:aspect-[5/6]">
            <Image
              src="/images/escritorio-reuniao.webp"
              alt="Sala de reuniões do Grupo Botelho e Castro em Belo Horizonte"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-[45%_50%]"
            />
          </div>
        </Reveal>

        <div className="lg:col-span-5 lg:col-start-8">
          <h2 id="sobre-title" className="text-section max-w-[16ch]">
            Experiência, estratégia e confiança para cuidar do seu negócio.
          </h2>
          <div className="mt-7 space-y-5 text-[1.0625rem] leading-relaxed text-muted">
            <p>
              Com sede em Belo Horizonte e atuação em todo o Brasil, a{" "}
              <strong className="font-medium text-ink">{siteConfig.legalName}</strong> é referência em assessoria
              contábil.
            </p>
            <p>
              Fazemos parte do Grupo Botelho e Castro, que reúne as frentes contábil, empresarial e consultiva da BC
              Consultores e a atuação jurídica da BC Advogados. Uma estrutura completa para as decisões da sua
              carreira.
            </p>
            <p>Atendimento humanizado, sem robôs, com suporte ilimitado e personalizado.</p>
          </div>

          <dl className="mt-10 grid grid-cols-2 border-t border-line">
            {siteConfig.stats.map((stat) => (
              <div key={stat.label} className="border-b border-line py-6 pr-4">
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="font-display block text-[2.5rem] leading-none font-light tracking-[-0.03em] tabular-nums">
                    {stat.value}
                  </span>
                  <span className="mt-2 block text-[0.9375rem] text-muted">{stat.label}</span>
                </dd>
              </div>
            ))}
          </dl>

          <a
            href={siteConfig.officialStructure}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses("outline", "lg", "mt-10 w-full sm:w-auto")}
          >
            Conheça nossa estrutura
            <ArrowUpRight className="size-[1.125rem]" strokeWidth={1.75} aria-hidden="true" />
            <span className="sr-only">(abre o site institucional em uma nova aba)</span>
          </a>
        </div>
      </div>
    </section>
  );
}
