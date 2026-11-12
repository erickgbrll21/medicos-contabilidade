// Testa a recuperação de falhas: CRM fora do ar → lead guardado → CRM volta → reprocessamento.
// Requer scripts/mock-crm.mjs rodando e KV_REST_API_URL=http://localhost:4010/redis no .env.local.
// Uso: node scripts/test-reprocess.mjs [baseUrl] [adminToken]
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";

const base = process.argv[2] ?? "http://localhost:3000";
const token = process.argv[3] ?? "token-admin-teste-local-123456";
const mock = "http://localhost:4010";

const lead = {
  nome: "Carlos Eduardo Lima", whatsapp: "(11) 91234-5678", email: "carlos@exemplo.com", especialidade: "Ortopedia",
  cidade: "São Paulo", uf: "SP", possuiCnpj: "nao", objetivo: "abrir_cnpj", faturamento: "", observacoes: "", consentimento: true,
};
const reprocess = async () =>
  (await fetch(`${base}/api/leads/reprocess`, { method: "POST", headers: { Authorization: `Bearer ${token}` } })).json();

await fetch(`${mock}/__mode/fail`, { method: "POST" });
const key = randomUUID();
const res = await fetch(`${base}/api/leads`, {
  method: "POST",
  headers: { "Content-Type": "application/json", "X-Forwarded-For": "10.1.1.1" },
  body: JSON.stringify({ lead, idempotencyKey: key, startedAt: Date.now() - 10_000 }),
});
const data = await res.json();
assert.equal(res.status, 200, JSON.stringify(data));
assert.equal(data.queued, true, "lead deveria ficar na fila");
console.log("  ok  CRM fora do ar → visitante recebe sucesso e lead fica na fila");

const stillDown = await reprocess();
assert.equal(stillDown.delivered.length, 0);
assert.equal(stillDown.failed[0]?.leadId, key);
console.log("  ok  reprocessar com CRM ainda fora → lead continua na fila");

await fetch(`${mock}/__mode/ok`, { method: "POST" });
const recovered = await reprocess();
assert.deepEqual(recovered.delivered, [key]);
console.log("  ok  CRM de volta → reprocessamento entrega o lead");

const empty = await reprocess();
assert.equal(empty.total, 0);
console.log("  ok  fila vazia depois da entrega (sem reenvio duplicado)");
