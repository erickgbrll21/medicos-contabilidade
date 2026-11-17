import { cn } from "@/lib/utils";

type Variant = "primary" | "inverse" | "outline" | "outline-light";
type Size = "md" | "lg";

const base =
  "group/btn inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full font-semibold tracking-[-0.005em] transition-[background-color,color,border-color,box-shadow,transform] duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0 disabled:pointer-events-none disabled:opacity-60 select-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-ink shadow-[0_10px_24px_-12px_rgb(100_175_7/0.7)] hover:bg-accent-bright hover:shadow-[0_16px_32px_-12px_rgb(100_175_7/0.75)]",
  inverse:
    "bg-accent text-ink shadow-[0_10px_24px_-12px_rgb(100_175_7/0.7)] hover:bg-accent-bright hover:shadow-[0_16px_32px_-12px_rgb(100_175_7/0.75)]",
  outline: "border border-ink/15 bg-white text-ink hover:border-ink hover:bg-ink hover:text-white",
  "outline-light":
    "border border-white/20 bg-white/5 text-white backdrop-blur-sm hover:border-white hover:bg-white hover:text-ink",
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
