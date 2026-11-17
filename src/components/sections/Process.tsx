import { ProcessTimeline } from "./ProcessTimeline";

const steps = [
  {
    title: "Primeiro contato",
    text: "Você preenche nosso formulário e compartilha algumas informações sobre sua atividade médica.",
  },
  {
    title: "Diagnóstico inicial",
    text: "Nossa equipe identifica suas necessidades e entende sua situação contábil e tributária.",
  },
  {
    title: "Consultoria especializada",
    text: "Um especialista analisa seu cenário e apresenta as alternativas adequadas para sua realidade.",
  },
  {
    title: "Contratação e acompanhamento",
    text: "Após a aprovação da proposta, iniciamos o processo de onboarding e acompanhamento contábil.",
  },
];

export function Process() {
  return (
    <section
      id="como-funciona"
      aria-labelledby="processo-title"
      className="surface-dark bg-ink relative overflow-hidden py-24 sm:py-32"
    >
      <div
        aria-hidden="true"
        className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_80%_70%_at_50%_0%,black,transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-accent/15 blur-[130px]"
      />
      <div className="container-page relative">
        <h2 id="processo-title" className="text-section max-w-[18ch]">
          Começar é mais simples do que você imagina.
        </h2>
        <ProcessTimeline steps={steps} />
      </div>
    </section>
  );
}
