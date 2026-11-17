"use client";

import { clearConsent } from "@/lib/consent";

/** Reabre o aviso para o titular aceitar ou recusar de novo, sem custo. */
export function CookieSettingsLink({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        clearConsent();
        window.location.reload();
      }}
    >
      Preferências de cookies
    </button>
  );
}
