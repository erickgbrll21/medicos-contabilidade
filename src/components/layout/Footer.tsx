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
    <footer className="surface-dark bg-ink border-t border-white/10">
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

      <div className="container-page border-t border-white/10 py-6 pb-28 text-center text-sm leading-relaxed break-words text-white/45 sm:pr-44 sm:pb-8">
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
    </footer>
  );
}
