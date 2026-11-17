import { Building2, ChartPie, FileCheck2, MessagesSquare, ShieldCheck, Stethoscope } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { ServicesViewTracker } from "./ServicesViewTracker";

const services = [
  {
    icon: ChartPie,
    title: "Planejamento Tributário",
    text: "Análise da estrutura tributária para identificar oportunidades de economia fiscal dentro da legislação vigente.",
  },
  {
    icon: Stethoscope,
    title: "Contabilidade Especializada",
    text: "Acompanhamento contábil voltado às particularidades dos profissionais e empresas da área da saúde.",
  },
  {
    icon: Building2,
    title: "Abertura de CNPJ",
    text: "Orientação para constituição da empresa, escolha da estrutura societária e enquadramento tributário adequado.",
  },
  {
    icon: FileCheck2,
    title: "Gestão Fiscal e Tributária",
    text: "Apuração de impostos, obrigações acessórias e acompanhamento das responsabilidades fiscais.",
  },
  {
    icon: MessagesSquare,
    title: "Assessoria Consultiva",
    text: "Suporte estratégico para auxiliar o médico na tomada de decisões relacionadas à sua atividade empresarial.",
  },
  {
    icon: ShieldCheck,
    title: "Regularização e Revisão Contábil",
    text: "Análise da situação atual da empresa e identificação de eventuais inconsistências e oportunidades de melhoria.",
  },
];

export function Services() {
  return (
    <section id="servicos" aria-labelledby="servicos-title" className="bg-mist py-24 sm:py-32">
      <ServicesViewTracker />
      <div className="container-page">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2 id="servicos-title" className="text-section max-w-[16ch] lg:col-span-7">
            Mais do que contabilidade. Estratégia para sua carreira médica.
          </h2>
          <p className="text-lead max-w-[30rem] text-muted lg:col-span-5 lg:justify-self-end">
            Do primeiro CNPJ à revisão da estrutura atual, cada frente é conduzida por especialistas que conhecem a
            rotina do médico.
          </p>
        </div>

        <ul className="mt-14 grid gap-4 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {services.map(({ icon: Icon, ...service }, i) => (
            <Reveal
              as="li"
              key={service.title}
              className="card-soft group relative flex flex-col overflow-hidden p-7 transition-[transform,box-shadow] duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-30px_rgb(0_22_53/0.35)] sm:p-8"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full bg-accent/0 blur-3xl transition-colors duration-500 group-hover:bg-accent/25"
              />
              <div className="relative flex items-center justify-between">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-ink text-accent-bright transition-[background-color,color] duration-300 group-hover:bg-accent group-hover:text-ink">
                  <Icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <span aria-hidden="true" className="font-display text-sm tabular-nums text-ink/30">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="relative mt-8 text-[1.375rem] leading-tight tracking-[-0.015em] sm:text-[1.5rem]">
                {service.title}
              </h3>
              <p className="relative mt-3 text-[1rem] leading-relaxed text-muted">{service.text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
