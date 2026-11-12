import { timingSafeEqual } from "node:crypto";
import { sendLeadToCrm } from "@/lib/crm/integration";
import { listFailedLeads, removeFailedLead, saveFailedLead } from "@/lib/crm/failed-leads";

export const maxDuration = 60;

function authorized(request: Request) {
  const given = Buffer.from(request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "");
  return [process.env.LEADS_ADMIN_TOKEN, process.env.CRON_SECRET].some((secret) => {
    if (!secret) return false;
    const expected = Buffer.from(secret);
    return given.length === expected.length && timingSafeEqual(given, expected);
  });
}

/**
 * Reenvia ao CRM os leads guardados após falha.
 * Uso: curl -X POST -H "Authorization: Bearer $LEADS_ADMIN_TOKEN" https://SEU-DOMINIO/api/leads/reprocess
 * Também aceita GET com CRON_SECRET (Vercel Cron).
 */
async function handler(request: Request) {
  if (!authorized(request)) return Response.json({ ok: false, error: "Não autorizado." }, { status: 401 });

  let pending;
  try {
    pending = await listFailedLeads();
  } catch (err) {
    return Response.json({ ok: false, error: String(err) }, { status: 503 });
  }

  const report = { total: pending.length, delivered: [] as string[], failed: [] as { leadId: string; error: string }[] };
  for (const entry of pending) {
    const leadId = entry.payload.lead_id;
    const result = await sendLeadToCrm(entry.payload);
    if (result.ok) {
      await removeFailedLead(leadId);
      report.delivered.push(leadId);
    } else {
      await saveFailedLead(entry.payload, result.error, entry.attempts + 1);
      report.failed.push({ leadId, error: result.error });
    }
  }

  console.info("[leads] reprocessamento concluído", { total: report.total, entregues: report.delivered.length, falhas: report.failed.length });
  return Response.json({ ok: true, ...report });
}

export { handler as GET, handler as POST };
