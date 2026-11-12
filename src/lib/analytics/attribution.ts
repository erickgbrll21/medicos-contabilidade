"use client";

import { UTM_KEYS, type Attribution } from "@/types/lead";

const STORAGE_KEY = "bc_attribution";
const TTL_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * Lê UTMs e identificadores de clique (gclid, fbclid) da URL e guarda por 30 dias.
 * Uma nova visita com parâmetros de campanha substitui a anterior (último clique).
 */
export function captureAttribution() {
  const params = new URLSearchParams(window.location.search);
  const fromUrl: Attribution = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) fromUrl[key] = value.slice(0, 300);
  }

  const stored = readStored();
  if (Object.keys(fromUrl).length === 0 && stored) return;

  const data: Attribution = {
    ...fromUrl,
    landing_page: window.location.href.slice(0, 500),
    referrer: document.referrer.slice(0, 500) || undefined,
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ at: Date.now(), data }));
  } catch {
    // Armazenamento bloqueado: getAttribution() cai para a URL atual.
  }
}

function readStored(): Attribution | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const { at, data } = JSON.parse(raw) as { at: number; data: Attribution };
    if (Date.now() - at > TTL_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function getAttribution(): Attribution {
  const stored = readStored();
  if (stored) return stored;
  const params = new URLSearchParams(window.location.search);
  const data: Attribution = { landing_page: window.location.href, referrer: document.referrer || undefined };
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) data[key] = value;
  }
  return data;
}
