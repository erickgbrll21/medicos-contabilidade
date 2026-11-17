export type CookieConsent = "accepted" | "rejected";

const KEY = "ft-cookie-consent";
export const CONSENT_EVENT = "ft:cookie-consent";

export function readConsent(): CookieConsent | null {
  try {
    const value = localStorage.getItem(KEY);
    return value === "accepted" || value === "rejected" ? value : null;
  } catch {
    return null;
  }
}

export function writeConsent(value: CookieConsent) {
  try {
    localStorage.setItem(KEY, value);
  } catch {
    // Sem armazenamento, o aviso some só nesta visita.
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT));
}

/** Revoga a escolha para o aviso voltar. O art. 8º da LGPD exige revogação gratuita. */
export function clearConsent() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // Sem armazenamento, a revogação vale só para esta visita.
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT));
}
