import { Clock3, FolderClosed, ShieldCheck, Smartphone } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";
import { CtaLink } from "@/components/ui/CtaLink";

const highlights = [
  { icon: Smartphone, label: "Tudo no aplicativo" },
  { icon: ShieldCheck, label: "Acesso protegido" },
  { icon: FolderClosed, label: "Documentos reunidos" },
  { icon: Clock3, label: "Consulta no seu horário" },
];

export function AccountingApp() {
  return (
    <section id="app" aria-labelledby="app-title" className="surface-dark bg-ink relative overflow-hidden py-24 sm:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/3 size-[28rem] rounded-full bg-accent/20 blur-[120px]"
      />
      <div className="container-page relative">
        <h2 id="app-title" className="text-section max-w-[16ch]">
          Um app contábil feito para o dia a dia do médico
        </h2>

        <article className="relative mt-10 overflow-hidden rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-[#0b274f] via-ink to-[#00102a] p-5 shadow-[0_40px_80px_-40px_rgb(0_0_0/0.7)] sm:mt-12 sm:rounded-[2rem] sm:p-10 lg:mt-16 lg:p-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-16 size-80 rounded-full bg-accent/25 blur-[90px]"
          />
          <div className="relative grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <p className="text-xs font-semibold tracking-[0.18em] text-accent-bright uppercase">Fechou Tributo App</p>
              <h3 className="font-display mt-4 max-w-[16ch] text-[clamp(1.875rem,1.4rem+1.6vw,2.75rem)] leading-[1.08] font-normal tracking-[-0.03em]">
                Sua contabilidade na palma da mão
              </h3>
              <p className="mt-5 max-w-[38rem] text-[1.0625rem] leading-relaxed text-white/70">
                Teremos um aplicativo próprio para o médico acompanhar guias, enviar documentos e ver o andamento da
                empresa sem depender de planilha ou de horário comercial. A mesma clareza de um banco digital, aplicada
                à rotina fiscal da sua atividade.
              </p>
              <CtaLink trackingId="app_contabil" className={buttonClasses("primary", "lg", "mt-8 w-full sm:w-auto")}>
                Quero conhecer o app
              </CtaLink>
            </div>

            <ul className="grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-10 lg:col-span-5">
              {highlights.map(({ icon: Icon, label }) => (
                <li key={label} className="flex flex-col items-center gap-4 text-center">
                  <span className="flex size-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-accent-bright shadow-[inset_0_0_0_1px_rgb(255_255_255/0.04)]">
                    <Icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <span className="max-w-[12ch] text-[0.9375rem] leading-snug font-medium text-white/90">{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </article>
      </div>
    </section>
  );
}
