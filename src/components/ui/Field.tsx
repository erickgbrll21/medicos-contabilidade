import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const control =
  "block w-full rounded-[3px] border bg-white px-4 text-base text-ink transition-[border-color,box-shadow] duration-150 placeholder:text-stone/80 hover:border-ink/40 focus:border-ink focus:shadow-[0_0_0_1px_var(--color-ink)] focus:outline-none aria-[invalid=true]:border-[#b42318] aria-[invalid=true]:focus:shadow-[0_0_0_1px_#b42318]";

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  className?: string;
  children: React.ReactNode;
};

/** Rótulo + controle + mensagem de erro anunciada por leitores de tela. */
export function Field({ id, label, error, hint, optional, className, children }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 flex items-baseline justify-between gap-3 text-[0.9375rem] font-medium text-graphite">
        {label}
        {optional && <span className="text-[0.8125rem] font-normal text-muted">Opcional</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-2 text-[0.8125rem] text-muted">
          {hint}
        </p>
      )}
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    <p id={id} role="alert" className={cn("text-[0.8125rem] leading-snug text-[#b42318]", message && "mt-2")}>
      {message}
    </p>
  );
}

export function describedBy(id: string, error?: string, hint?: string) {
  return error ? `${id}-error` : hint ? `${id}-hint` : undefined;
}

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { ref?: React.Ref<HTMLInputElement> }) {
  return <input className={cn(control, "h-[3.25rem] border-line", className)} {...props} />;
}

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { ref?: React.Ref<HTMLTextAreaElement> }) {
  return <textarea className={cn(control, "min-h-28 resize-y border-line py-3.5 leading-relaxed", className)} {...props} />;
}

export function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { ref?: React.Ref<HTMLSelectElement> }) {
  return (
    <div className="relative">
      <select className={cn(control, "h-[3.25rem] appearance-none border-line pr-11", className)} {...props}>
        {children}
      </select>
      <ChevronDown aria-hidden="true" className="pointer-events-none absolute top-1/2 right-4 size-[1.125rem] -translate-y-1/2 text-muted" strokeWidth={1.75} />
    </div>
  );
}
