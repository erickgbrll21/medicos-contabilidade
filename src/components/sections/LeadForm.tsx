import { Clock, Mail, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";
import { ContactForm } from "@/components/forms/ContactForm";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

const nextSteps = [
  "Retorno da nossa equipe em até 24 horas úteis.",
  "Conversa com um especialista sobre o seu cenário.",
  "Apresentação das alternativas adequadas à sua realidade.",
];

export function LeadForm() {
  const { contact } = siteConfig;

  return (
    <section id="contato" aria-labelledby="contato-title" className="bg-mist py-24 sm:py-32">
      <div className="container-page grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <h2 id="contato-title" className="text-section max-w-[14ch]">
            Vamos analisar sua situação contábil?
          </h2>
          <p className="text-lead mt-6 max-w-[32rem] text-muted">
            Preencha seus dados e nossa equipe entrará em contato para entender suas necessidades e apresentar as
            melhores alternativas.
          </p>

          <ol className="mt-10 space-y-3">
            {nextSteps.map((step, i) => (
              <li key={step} className="flex items-start gap-4 rounded-2xl bg-white p-4 text-[1rem] leading-relaxed text-graphite shadow-[0_1px_2px_rgb(0_22_53/0.04)] sm:items-center">
                <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent text-sm font-semibold text-ink tabular-nums">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>

          <div className="mt-12 hidden space-y-3 text-[0.9375rem] text-graphite lg:block">
            <p className="text-sm text-muted">Prefere outro canal?</p>
            <WhatsAppLink trackingId="contato_lateral" className="flex items-center gap-3 hover:underline">
              <WhatsAppIcon className="size-[1.125rem]" />
              WhatsApp
            </WhatsAppLink>
            <a href={contact.phoneHref} className="flex items-center gap-3 hover:underline">
              <Phone className="size-[1.125rem]" strokeWidth={1.5} aria-hidden="true" />
              {contact.phoneDisplay}
            </a>
            <a href={`mailto:${contact.email}`} className="flex items-center gap-3 hover:underline">
              <Mail className="size-[1.125rem]" strokeWidth={1.5} aria-hidden="true" />
              {contact.email}
            </a>
            <p className="flex items-center gap-3 text-muted">
              <Clock className="size-[1.125rem]" strokeWidth={1.5} aria-hidden="true" />
              {contact.hours}
            </p>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="card-soft rounded-[2rem] p-6 shadow-[0_40px_80px_-40px_rgb(0_22_53/0.3)] sm:p-10">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
