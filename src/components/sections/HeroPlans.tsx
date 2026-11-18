import { ArrowRight, Calculator, CalendarCheck, CircleCheck, Files, MapPin, Plus, Store } from "lucide-react";
import { offerConfig, type Plan } from "@/config/offer";
import { CtaLink } from "@/components/ui/CtaLink";
import { cn } from "@/lib/utils";

const iconProps = { className: "size-6 text-accent sm:size-8", strokeWidth: 1.5, "aria-hidden": true } as const;

function PlanIcon({ icon }: { icon: Plan["icon"] }) {
  if (icon === "address") {
    return (
      <span className="flex items-center gap-0.5">
        <MapPin {...iconProps} />
        <Plus className="size-4 text-accent" strokeWidth={2.5} aria-hidden="true" />
        <Calculator {...iconProps} />
      </span>
    );
  }
  return icon === "store" ? <Store {...iconProps} /> : <Files {...iconProps} />;
}

function PlanCard({ plan }: { plan: Plan }) {
  const featured = Boolean(plan.includes);

  return (
    <li
      className={cn(
        "group relative flex flex-col rounded-[1.75rem] bg-white p-5 text-ink shadow-[0_24px_48px_-24px_rgb(0_0_0/0.7)] transition-[transform,box-shadow] duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1.5 hover:shadow-[0_32px_64px_-24px_rgb(100_175_7/0.55)] sm:p-6",
        featured && "ring-2 ring-accent sm:ring-offset-4 sm:ring-offset-ink",
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <span
          aria-hidden="true"
          className="font-display flex size-11 shrink-0 items-center justify-center rounded-2xl bg-ink text-xl font-medium text-white"
        >
          {plan.number}
        </span>
        <PlanIcon icon={plan.icon} />
      </div>

      <h3 className="mt-5 font-sans text-[1.1875rem] leading-tight font-semibold tracking-[-0.01em]">
        <CtaLink
          trackingId={`hero_plano_${plan.id}`}
          prefill={{ objetivo: plan.objetivo, possuiCnpj: plan.possuiCnpj }}
          className="rounded-[1.75rem] after:absolute after:inset-0 after:rounded-[1.75rem] after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-accent"
        >
          {plan.title}
        </CtaLink>
      </h3>

      {featured ? (
        <ul className="mt-3 space-y-1.5">
          {plan.includes?.map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-graphite">
              <CircleCheck className="size-4 shrink-0 fill-accent text-white" strokeWidth={2.25} aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-1.5 text-sm text-muted">({plan.note})</p>
      )}

      <div className="relative mt-5 overflow-hidden rounded-2xl bg-ink px-5 py-4 text-white lg:mt-auto">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -bottom-12 size-32 rounded-full bg-accent/40 opacity-70 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        />
        <div className="relative flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <p className="flex items-baseline gap-1 whitespace-nowrap">
            <span className="text-base font-medium">R$</span>
            <span className="font-display text-[2.25rem] leading-none font-medium tracking-[-0.03em] tabular-nums sm:text-[2.5rem]">
              {plan.price}
            </span>
            <span className="text-sm text-white/75">{plan.period}</span>
          </p>
          {plan.badge && (
            <span className="rounded-full bg-accent px-3 py-1 text-sm font-semibold text-ink">{plan.badge}</span>
          )}
        </div>
        <span
          aria-hidden="true"
          className="relative mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent-bright transition-colors group-hover:text-white"
        >
          Quero este plano
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2} />
        </span>
      </div>
    </li>
  );
}

/** Planos em destaque na hero, no formato do material de lançamento. */
export function HeroPlans({ className }: { className?: string }) {
  if (!offerConfig.enabled) return null;

  return (
    <div id="planos" className={cn("scroll-mt-24", className)}>
      <h2 className="sr-only">Planos de contabilidade</h2>
      <ol className="grid gap-4 md:grid-cols-3 lg:gap-5">
        {offerConfig.plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </ol>
      <p className="mx-auto mt-6 flex w-fit max-w-full flex-wrap items-center justify-center gap-x-2.5 gap-y-1 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2.5 text-center text-[0.9375rem] font-medium text-white backdrop-blur-md sm:px-5">
        <CalendarCheck className="size-5 text-accent-bright" strokeWidth={1.75} aria-hidden="true" />
        {offerConfig.footnote.lead}
        <span className="text-accent-bright">{offerConfig.footnote.highlight}</span>
      </p>
    </div>
  );
}
