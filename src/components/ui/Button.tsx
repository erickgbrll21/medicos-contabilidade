import { cn } from "@/lib/utils";

type Variant = "primary" | "inverse" | "outline" | "outline-light";
type Size = "md" | "lg";

const base =
  "group/btn inline-flex min-h-12 items-center justify-center gap-2.5 rounded-[3px] font-medium tracking-[-0.005em] transition-[background-color,color,border-color,transform] duration-200 ease-out active:translate-y-px disabled:pointer-events-none disabled:opacity-60 select-none";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-ink hover:bg-accent-bright",
  inverse: "bg-accent text-ink hover:bg-accent-bright",
  outline: "border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-white",
  "outline-light": "border border-white/30 text-white hover:border-accent hover:bg-accent hover:text-ink",
};

const sizes: Record<Size, string> = {
  md: "px-5 text-[0.9375rem]",
  lg: "min-h-14 px-7 text-base",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

export function Button({
  variant,
  size,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return <button className={buttonClasses(variant, size, className)} {...props} />;
}
