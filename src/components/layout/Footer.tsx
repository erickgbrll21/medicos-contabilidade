import { siteConfig, navLinks } from "@/config/site";
import { Logo } from "./Logo";

async function currentYear() {
  "use cache";
  return new Date().getFullYear();
}

/** `linkBase` = "/" fora da landing, para que as âncoras levem de volta à página inicial. */
export async function Footer({ linkBase = "" }: { linkBase?: "" | "/" }) {
  const { contact } = siteConfig;
  const year = await currentYear();

  return (
    <footer className="surface-dark border-t border-white/10">
      <div className="container-page grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr] md:py-20">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-6 text-[0.9375rem] leading-relaxed text-white/60">
            Contabilidade estratégica para médicos, com sede em Belo Horizonte e atuação em todo o Brasil.
          </p>
        </div>

        <div>
          <h2 className="font-sans text-xs font-medium tracking-[0.12em] text-white/50 uppercase">Contato</h2>
          <address className="mt-5 space-y-2 text-[0.9375rem] leading-relaxed not-italic text-white/80">
            <p>
              <a href={contact.phoneHref} className="hover:text-white hover:underline">{contact.phoneDisplay}</a>
            </p>
            <p>
              <a href={`mailto:${contact.email}`} className="break-all hover:text-white hover:underline">{contact.email}</a>
            </p>
            <p className="text-white/60">{contact.hours}</p>
            <p className="text-white/60">
              {contact.address.street}, {contact.address.district}
              <br />
              {contact.address.city} – {contact.address.state}
            </p>
          </address>
        </div>

        <div>
          <h2 className="font-sans text-xs font-medium tracking-[0.12em] text-white/50 uppercase">Navegação</h2>
          <ul className="mt-5 space-y-2 text-[0.9375rem]">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={`${linkBase}${link.href}`} className="text-white/80 hover:text-white hover:underline">{link.label}</a>
              </li>
            ))}
            <li>
              <a href={siteConfig.officialSite} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white hover:underline">
                Site institucional
              </a>
            </li>
            <li>
              <a href={siteConfig.lawFirmSite} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white hover:underline">
                BC Advogados
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container-page flex flex-col gap-3 border-t border-white/10 py-6 pb-24 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between sm:pr-40 sm:pb-6">
        <p>© {year} {siteConfig.legalName}. Todos os direitos reservados.</p>
        <a href="/politica-de-privacidade" className="-my-3 self-start py-3 hover:text-white hover:underline sm:self-auto">Política de Privacidade</a>
      </div>
    </footer>
  );
}
