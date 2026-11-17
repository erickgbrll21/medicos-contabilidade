import { ArrowRight, Calculator, CalendarCheck, CircleCheck, Files, MapPin, Plus, Store } from "lucide-react";
import { offerConfig, type Plan } from "@/config/offer";
import { CtaLink } from "@/components/ui/CtaLink";
import { cn } from "@/lib/utils";

const iconProps = { className: "size-8 text-accent", strokeWidth: 1.5, "aria-hidden": true } as const;

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
        "group relative flex flex-col rounded-2xl bg-white p-5 text-ink shadow-[0_24px_48px_-24px_rgb(0_0_0/0.7)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_28px_56px_-20px_rgb(100_175_7/0.5)] sm:p-6",
        featured && "ring-2 ring-accent",
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <span
          aria-hidden="true"
          className="font-display flex h-11 w-10 shrink-0 -skew-x-6 items-center justify-center rounded-md bg-ink text-xl font-medium text-white italic"
        >
          {plan.number}
        </span>
        <PlanIcon icon={plan.icon} />
      </div>

      <h3 className="mt-5 font-sans text-[1.1875rem] leading-tight font-semibold tracking-[-0.01em]">
        <CtaLink
          trackingId={`hero_plano_${plan.id}`}
          prefill={{ objetivo: plan.objetivo, possuiCnpj: plan.possuiCnpj }}
          className="rounded-2xl after:absolute after:inset-0 after:rounded-2xl after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-accent"
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

      <div className="relative mt-5 overflow-hidden rounded-xl bg-ink px-5 py-4 text-white lg:mt-auto">
        <span
          aria-hidden="true"
          className="absolute right-0 bottom-0 size-7 bg-accent [clip-path:polygon(100%_0,100%_100%,0_100%)]"
        />
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <p className="flex items-baseline gap-1 whitespace-nowrap">
            <span className="text-base font-medium">R$</span>
            <span className="font-display text-[2.5rem] leading-none font-medium tracking-[-0.03em] tabular-nums">
              {plan.price}
            </span>
            <span className="text-sm text-white/75">{plan.period}</span>
          </p>
          {plan.badge && (
            <span className="rounded-md bg-accent px-3 py-1 text-sm font-semibold text-ink italic">{plan.badge}</span>
          )}
        </div>
        <span
          aria-hidden="true"
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent-bright transition-colors group-hover:text-white"
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
      <p className="mx-auto mt-6 flex w-fit items-center gap-2.5 rounded-full border border-accent/60 bg-white/5 px-5 py-2.5 text-[0.9375rem] font-medium text-white">
        <CalendarCheck className="size-5 text-accent-bright" strokeWidth={1.75} aria-hidden="true" />
        {offerConfig.footnote.lead}
        <span className="text-accent-bright">{offerConfig.footnote.highlight}</span>
      </p>
    </div>
  );
}
