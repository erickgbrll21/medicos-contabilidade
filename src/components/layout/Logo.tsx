import Image from "next/image";
import { cn } from "@/lib/utils";

/** Logo oficial (branca). Usar apenas sobre fundo escuro. */
export function Logo({ className, preload }: { className?: string; preload?: boolean }) {
  return (
    <Image
      src="/brand/logo-bcc-branco.png"
      alt="BC Consultores — Botelho e Castro Consultores"
      width={2447}
      height={442}
      sizes="220px"
      preload={preload}
      className={cn("h-8 w-auto sm:h-9", className)}
    />
  );
}
