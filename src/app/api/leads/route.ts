import { buildCrmPayload, sendLeadToCrm } from "@/lib/crm/integration";
import { isFailedLeadStoreConfigured, saveFailedLead } from "@/lib/crm/failed-leads";
import { leadRequestSchema } from "@/lib/validations/lead-schema";

const MIN_FILL_TIME_MS = 2500;
const MAX_BODY_BYTES = 16_000;

// shortcut: memória por instância serverless; protege contra cliques repetidos e abuso básico.
// Se houver abuso real, mover para Redis/Upstash Ratelimit ou Vercel Firewall.
const recentResults = new Map<string, { at: number; body: object; status: number }>();
const hitsByIp = new Map<string, number[]>();
const RATE_WINDOW_MS = 10 * 60_000;
const RATE_MAX = 5;

function rateLimited(ip: string) {
  const now = Date.now();
  const hits = (hitsByIp.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  hits.push(now);
  hitsByIp.set(ip, hits);
  return hits.length > RATE_MAX;
}

function remember(key: string, status: number, body: object) {
  recentResults.set(key, { at: Date.now(), status, body });
  if (recentResults.size > 500) {
    for (const [k, v] of recentResults) if (Date.now() - v.at > 3_600_000) recentResults.delete(k);
  }
  return Response.json(body, { status });
}

export async function POST(request: Request) {
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return Response.json({ ok: false, error: "Requisição muito grande." }, { status: 413 });
  }

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return Response.json({ ok: false, error: "Requisição inválida." }, { status: 400 });
  }

  const parsed = leadRequestSchema.safeParse(json);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: "Confira os campos destacados.", issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })) },
      { status: 400 },
    );
  }

  const { lead, attribution, idempotencyKey, startedAt, website } = parsed.data;

  // Bots preenchem o campo oculto ou enviam rápido demais: respondemos como sucesso e descartamos.
  if (website || (startedAt > 0 && Date.now() - startedAt < MIN_FILL_TIME_MS)) {
    console.warn("[leads] envio descartado pela proteção anti-spam", { honeypot: Boolean(website) });
    return Response.json({ ok: true, leadId: idempotencyKey });
  }

  const previous = recentResults.get(idempotencyKey);
  if (previous) return Response.json(previous.body, { status: previous.status });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "desconhecido";
  if (rateLimited(ip)) {
    return Response.json(
      { ok: false, error: "Muitas tentativas em sequência. Aguarde alguns minutos ou fale conosco pelo WhatsApp." },
      { status: 429 },
    );
  }

  const payload = buildCrmPayload(idempotencyKey, lead, attribution);
  const delivery = await sendLeadToCrm(payload);
  if (delivery.ok) {
    console.info("[leads] lead entregue ao CRM", { leadId: payload.lead_id, segmento: payload.segmento });
    return remember(idempotencyKey, 200, { ok: true, leadId: payload.lead_id });
  }

  console.error("[leads] falha ao entregar ao CRM", { leadId: payload.lead_id, error: delivery.error });

  if (isFailedLeadStoreConfigured()) {
    try {
      await saveFailedLead(payload, delivery.error);
      console.warn("[leads] lead guardado para reprocessamento", { leadId: payload.lead_id });
      return remember(idempotencyKey, 200, { ok: true, leadId: payload.lead_id, queued: true });
    } catch (err) {
      console.error("[leads] falha ao guardar lead pendente", { leadId: payload.lead_id, error: String(err) });
    }
  }

  // Último recurso: o registro completo fica nos logs do servidor para recuperação manual,
  // e o visitante é orientado a seguir pelo WhatsApp.
  console.error("[leads] LEAD_NAO_ENTREGUE", JSON.stringify(payload));
  return Response.json(
    {
      ok: false,
      leadId: payload.lead_id,
      error: "Não conseguimos registrar seus dados agora. Fale com nossa equipe pelo WhatsApp para não perder o atendimento.",
    },
    { status: 502 },
  );
}
