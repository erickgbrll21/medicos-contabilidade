import Image from "next/image";
import { cn } from "@/lib/utils";

/** `onLight` no header branco; `onDark` nas faixas navy (wordmark claro). */
export function Logo({
  className,
  preload,
  tone = "onLight",
}: {
  className?: string;
  preload?: boolean;
  tone?: "onLight" | "onDark";
}) {
  return (
    <Image
      src={tone === "onDark" ? "/brand/logo-fechou-tributo-fundo-escuro.png" : "/brand/logo-fechou-tributo.png"}
      alt="Fechou Tributo — Contabilidade sem complicação"
      width={1024}
      height={340}
      sizes="280px"
      preload={preload}
      className={cn("h-10 w-auto max-w-[46vw] sm:h-12 sm:max-w-none lg:h-14", className)}
    />
  );
}
