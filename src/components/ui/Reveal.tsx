import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li";
};

/** Entrada discreta ao entrar na tela, só com CSS (utilitário `reveal` em globals.css). */
export function Reveal({ children, className, as: Tag = "div" }: Props) {
  return <Tag className={cn("reveal", className)}>{children}</Tag>;
}
