import Image from "next/image";
import { Mail, Phone } from "lucide-react";
import { offerConfig } from "@/config/offer";
import { siteConfig } from "@/config/site";
import { CookieSettingsLink } from "@/components/layout/CookieSettingsLink";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";

async function currentYear() {
  "use cache";
  return new Date().getFullYear();
}

const iconLink =
  "inline-flex size-12 items-center justify-center rounded-full border border-white/25 text-white transition-colors duration-200 hover:border-accent-bright hover:text-accent-bright";

/** `linkBase` = "/" fora da landing, para que as âncoras levem de volta à página inicial. */
export async function Footer({ linkBase = "" }: { linkBase?: "" | "/" }) {
  const { contact } = siteConfig;
  const year = await currentYear();

  return (
    <footer className="border-t border-line">
      <div className="bg-white text-ink">
        <div className="container-page py-14 text-center sm:py-16">
          <h2 className="text-sm font-medium tracking-[0.04em] text-ink/70">Parceiros e Investidores</h2>
          <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-16 gap-y-10">
            <li>
              <Image
                src="/brand/parceiro-rf-coworking.png"
                alt="RF Co-working"
                width={1318}
                height={1711}
                className="h-36 w-auto sm:h-40"
              />
            </li>
            <li>
              <Image
                src="/brand/parceiro-botelho-castro.png"
                alt="Botelho e Castro Consultores"
                width={1095}
                height={257}
                className="h-14 w-auto sm:h-16"
              />
            </li>
          </ul>
        </div>
      </div>

      <div className="surface-dark bg-ink">
      <div className="container-page grid gap-14 py-16 sm:py-20 md:grid-cols-2 md:items-start md:gap-10">
        <div>
          <h2 className="text-xs font-semibold tracking-[0.18em] text-accent-bright uppercase">Planos</h2>
          <ul className="mt-6 space-y-3 text-[0.975rem]">
            {offerConfig.plans.map((plan) => (
              <li key={plan.id}>
                <a href={`${linkBase}#planos`} className="text-white/80 transition-colors hover:text-white">
                  {plan.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:justify-self-end">
          <h2 className="text-xs font-semibold tracking-[0.18em] text-accent-bright uppercase">Contato</h2>
          <div className="mt-6 flex items-center gap-3">
            <WhatsAppLink trackingId="footer" aria-label="Conversar no WhatsApp" className={iconLink}>
              <WhatsAppIcon className="size-5" />
            </WhatsAppLink>
            <a href={`mailto:${contact.email}`} aria-label={`Enviar e-mail para ${contact.email}`} className={iconLink}>
              <Mail className="size-5" strokeWidth={1.75} aria-hidden="true" />
            </a>
            <a href={contact.phoneHref} aria-label={`Ligar para ${contact.phoneDisplay}`} className={iconLink}>
              <Phone className="size-5" strokeWidth={1.75} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      <div className="container-page border-t border-white/10 py-6 pb-24 text-center text-sm leading-relaxed text-white/45 sm:pb-6">
        <p>Todos os direitos reservados © {year} — {siteConfig.legalName}</p>
        <p className="mt-1">
          {contact.address.street}, {contact.address.district}, {contact.address.city}–{contact.address.state}
        </p>
        <p className="mt-2 flex flex-wrap items-center justify-center gap-x-4">
          <a href="/politica-de-privacidade" className="inline-block py-2 hover:text-white hover:underline">
            Política de Privacidade
          </a>
          <CookieSettingsLink className="inline-block cursor-pointer py-2 hover:text-white hover:underline" />
        </p>
      </div>
      </div>
    </footer>
  );
}
