import { BadgeCheck, Building2, Mail, MapPin } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";
import { CtaLink } from "@/components/ui/CtaLink";

const highlights = [
  { icon: MapPin, title: "Endereço comercial", text: "Um ponto fiscal para a PJ médica, sem sala própria." },
  { icon: Building2, title: "Na abertura do CNPJ", text: "Usado desde a constituição da empresa, quando você ainda não tem consultório." },
  { icon: Mail, title: "Correspondência organizada", text: "Recebimento e aviso do que chega em nome da empresa." },
  { icon: BadgeCheck, title: "Junto com a contabilidade", text: "O endereço entra no mesmo acompanhamento da sua rotina fiscal." },
];

export function VirtualAddress() {
  return (
    <section id="endereco-virtual" aria-labelledby="endereco-title" className="bg-mist py-24 sm:py-32">
      <div className="container-page">
        <div className="max-w-[40rem]">
          <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">Endereço virtual</p>
          <h2 id="endereco-title" className="text-section mt-4 max-w-[18ch]">
            Um endereço comercial para o médico, sem alugar sala
          </h2>
          <p className="text-lead mt-6 text-muted">
            Teremos endereço virtual para quem precisa formalizar a atividade e não quer manter um ponto físico só
            para o CNPJ. Ele serve de sede da empresa, recebe a correspondência e acompanha a contabilidade.
          </p>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-5">
          {highlights.map(({ icon: Icon, title, text }) => (
            <li key={title} className="card-soft flex flex-col p-6 sm:p-7">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-ink text-accent-bright">
                <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <h3 className="mt-6 text-[1.25rem] leading-tight tracking-[-0.015em]">{title}</h3>
              <p className="mt-3 text-[0.975rem] leading-relaxed text-muted">{text}</p>
            </li>
          ))}
        </ul>

        <CtaLink
          trackingId="endereco_virtual"
          prefill={{ objetivo: "contratar_contabilidade" }}
          className={buttonClasses("primary", "lg", "mt-10 w-full sm:w-auto")}
        >
          Quero o endereço virtual
        </CtaLink>
      </div>
    </section>
  );
}
