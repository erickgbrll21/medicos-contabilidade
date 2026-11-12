"use client";

import { useEffect, useRef } from "react";
import { Check } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { firstName } from "@/lib/utils";

export function FormSuccess({ nome, whatsappMessage }: { nome: string; whatsappMessage: string }) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div className="py-4">
      <span className="flex size-12 items-center justify-center rounded-tl-[0.75rem] bg-ink text-white">
        <Check className="size-6" strokeWidth={2} aria-hidden="true" />
      </span>
      <h3 ref={headingRef} tabIndex={-1} className="mt-8 text-[2rem] leading-tight tracking-[-0.02em] focus:outline-none">
        Recebemos seus dados, {firstName(nome)}.
      </h3>
      <p className="mt-4 max-w-[34rem] text-[1.0625rem] leading-relaxed text-muted">
        Um especialista da BC Consultores vai entrar em contato pelo WhatsApp ou e-mail informados em até 24 horas
        úteis.
      </p>

      <div className="mt-10 border-t border-line pt-8">
        <p className="text-[0.9375rem] text-graphite">Prefere adiantar a conversa?</p>
        <WhatsAppLink
          trackingId="tela_sucesso"
          message={whatsappMessage}
          className={buttonClasses("primary", "lg", "mt-4 w-full sm:w-auto")}
        >
          <WhatsAppIcon className="size-5" />
          Continuar pelo WhatsApp
        </WhatsAppLink>
        <p className="mt-4 text-sm text-muted">A mensagem já vai preenchida com o seu nome e objetivo.</p>
      </div>
    </div>
  );
}
