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
    <div className="fixed inset-x-0 bottom-0 z-[70] p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-6">
      <div
        role="dialog"
        aria-labelledby="aviso-cookies-titulo"
        aria-describedby="aviso-cookies-texto"
        className="max-w-xl rounded-[1.75rem] border border-ink/10 bg-white p-5 text-ink shadow-[0_24px_50px_-12px_rgb(0_0_0/0.45)] sm:p-6"
      >
        <h2 id="aviso-cookies-titulo" className="text-base font-semibold tracking-[-0.01em]">
          Aviso de cookies
        </h2>
        <p id="aviso-cookies-texto" className="mt-2 text-sm leading-relaxed text-muted">
          Usamos cookies para medir o desempenho desta página e lembrar a origem da sua visita. A medição só começa se
          você aceitar.{" "}
          <Link href="/politica-de-privacidade" className="font-medium text-ink underline">
            Política de Privacidade
          </Link>
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <button type="button" className={buttonClasses("primary", "md", "w-full sm:w-auto")} onClick={() => writeConsent("accepted")}>
            Aceitar
          </button>
          <button type="button" className={buttonClasses("outline", "md", "w-full sm:w-auto")} onClick={() => writeConsent("rejected")}>
            Recusar
          </button>
        </div>
      </div>
    </div>
  );
}
