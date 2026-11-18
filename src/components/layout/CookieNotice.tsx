"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { buttonClasses } from "@/components/ui/Button";
import { CONSENT_EVENT, readConsent, writeConsent } from "@/lib/consent";

function subscribe(onStoreChange: () => void) {
  window.addEventListener(CONSENT_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export function CookieNotice() {
  const consent = useSyncExternalStore(subscribe, readConsent, () => null);
  if (consent) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[70] p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-6">
      <div
        role="dialog"
        aria-labelledby="aviso-cookies-titulo"
        aria-describedby="aviso-cookies-texto"
        className="mx-auto max-w-xl rounded-2xl border border-ink/10 bg-white p-4 text-ink shadow-[0_24px_50px_-12px_rgb(0_0_0/0.45)] sm:rounded-[1.75rem] sm:p-6"
      >
        <h2 id="aviso-cookies-titulo" className="text-sm font-semibold tracking-[-0.01em] sm:text-base">
          Aviso de cookies
        </h2>
        <p id="aviso-cookies-texto" className="mt-1.5 text-[0.8125rem] leading-snug text-muted sm:mt-2 sm:text-sm sm:leading-relaxed">
          Usamos cookies para medir o desempenho desta página e lembrar a origem da sua visita. A medição só começa se
          você aceitar.{" "}
          <Link href="/politica-de-privacidade" className="font-medium text-ink underline">
            Política de Privacidade
          </Link>
        </p>
        <div className="mt-3 flex gap-2 sm:mt-4">
          <button type="button" className={buttonClasses("primary", "md", "flex-1 sm:flex-none")} onClick={() => writeConsent("accepted")}>
            Aceitar
          </button>
          <button type="button" className={buttonClasses("outline", "md", "flex-1 sm:flex-none")} onClick={() => writeConsent("rejected")}>
            Recusar
          </button>
        </div>
      </div>
    </div>
  );
}
