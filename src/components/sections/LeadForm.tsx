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

          <ol className="mt-10 space-y-4 border-t border-ink/15 pt-8">
            {nextSteps.map((step) => (
              <li key={step} className="flex gap-4 text-[1rem] leading-relaxed text-graphite">
                <span aria-hidden="true" className="mt-[0.55em] size-2.5 shrink-0 rounded-tl-[3px] bg-accent" />
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
          <div className="rounded-tr-[var(--radius-brand)] border border-line bg-white p-6 sm:p-10">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
