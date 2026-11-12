import type { CrmLeadPayload } from "@/types/lead";

// Fila de leads que o CRM não aceitou, guardada em Redis (Upstash) via REST.
// Chave = lead_id, então gravar duas vezes o mesmo lead não o duplica.

const KEY = "leads:crm-pendentes";

function credentials() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ""), token } : null;
}

export function isFailedLeadStoreConfigured() {
  return credentials() !== null;
}

async function redis<T>(command: (string | number)[]): Promise<T> {
  const creds = credentials();
  if (!creds) throw new Error("Armazenamento de leads pendentes não configurado (KV_REST_API_URL/KV_REST_API_TOKEN)");
  const res = await fetch(creds.url, {
    method: "POST",
    headers: { Authorization: `Bearer ${creds.token}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    signal: AbortSignal.timeout(5000),
    cache: "no-store",
  });
  const data = (await res.json().catch(() => ({}))) as { result?: T; error?: string };
  if (!res.ok || data.error) throw new Error(data.error || `Redis HTTP ${res.status}`);
  return data.result as T;
}

export type FailedLead = { payload: CrmLeadPayload; error: string; failedAt: string; attempts: number };

export async function saveFailedLead(payload: CrmLeadPayload, error: string, attempts = 1) {
  const entry: FailedLead = { payload, error, failedAt: new Date().toISOString(), attempts };
  await redis(["HSET", KEY, payload.lead_id, JSON.stringify(entry)]);
}

export async function listFailedLeads(): Promise<FailedLead[]> {
  const flat = await redis<string[]>(["HGETALL", KEY]);
  const entries: FailedLead[] = [];
  for (let i = 1; i < flat.length; i += 2) entries.push(JSON.parse(flat[i]) as FailedLead);
  return entries;
}

export async function removeFailedLead(leadId: string) {
  await redis(["HDEL", KEY, leadId]);
}
