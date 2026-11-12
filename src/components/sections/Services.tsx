import { Reveal } from "@/components/ui/Reveal";
import { ServicesViewTracker } from "./ServicesViewTracker";

const services = [
  {
    title: "Planejamento Tributário",
    text: "Análise da estrutura tributária para identificar oportunidades de economia fiscal dentro da legislação vigente.",
  },
  {
    title: "Contabilidade Especializada",
    text: "Acompanhamento contábil voltado às particularidades dos profissionais e empresas da área da saúde.",
  },
  {
    title: "Abertura de CNPJ",
    text: "Orientação para constituição da empresa, escolha da estrutura societária e enquadramento tributário adequado.",
  },
  {
    title: "Gestão Fiscal e Tributária",
    text: "Apuração de impostos, obrigações acessórias e acompanhamento das responsabilidades fiscais.",
  },
  {
    title: "Assessoria Consultiva",
    text: "Suporte estratégico para auxiliar o médico na tomada de decisões relacionadas à sua atividade empresarial.",
  },
  {
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

        <ul className="mt-16 border-b border-ink/15 sm:mt-20">
          {services.map((service) => (
            <Reveal
              as="li"
              key={service.title}
              className="group grid gap-3 border-t border-ink/15 py-8 transition-colors duration-300 sm:py-10 lg:grid-cols-12 lg:gap-10"
            >
              <h3 className="text-[1.5rem] leading-tight tracking-[-0.015em] sm:text-[1.875rem] lg:col-span-5">
                {service.title}
              </h3>
              <p className="max-w-[36rem] text-[1.0625rem] leading-relaxed text-muted lg:col-span-6 lg:col-start-7 lg:pt-1.5">
                {service.text}
              </p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
