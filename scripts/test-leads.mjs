// Testa POST /api/leads contra um servidor rodando com CRM_API_URL apontando para scripts/mock-crm.mjs.
// Uso: node scripts/test-leads.mjs [baseUrl] [ok|fail]
import assert from "node:assert/strict";
import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";

const base = process.argv[2] ?? "http://localhost:3000";
const crmMode = process.argv[3] ?? "ok";
const logFile = new URL("./mock-crm.log", import.meta.url);
writeFileSync(logFile, "");

const crmEntries = () =>
  existsSync(logFile) ? readFileSync(logFile, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l)) : [];

const validLead = {
  nome: "Ana Paula Ribeiro",
  whatsapp: "(31) 98765-4321",
  email: "Ana.Ribeiro@Clinica.com.br",
  especialidade: "Cardiologia",
  cidade: "Belo Horizonte",
  uf: "MG",
  possuiCnpj: "sim",
  objetivo: "reduzir_impostos",
  faturamento: "20k_40k",
  observacoes: "Tenho PJ há 2 anos no Simples.",
  consentimento: true,
};

const attribution = {
  utm_source: "instagram",
  utm_medium: "paid_social",
  utm_campaign: "medicos_bh_nov",
  utm_content: "reels_01",
  utm_term: "contabilidade medicos",
  campaign_id: "120210000000000",
  fbclid: "IwAR-teste",
  landing_page: `${base}/?utm_source=instagram`,
  referrer: "https://l.instagram.com/",
};

async function post(body) {
  const res = await fetch(`${base}/api/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Forwarded-For": `10.0.0.${Math.floor(Math.random() * 250)}` },
    body: JSON.stringify(body),
  });
  return { status: res.status, data: await res.json() };
}

const slowStart = () => Date.now() - 10_000;
let passed = 0;
async function test(name, fn) {
  try {
    await fn();
    passed++;
    console.log(`  ok  ${name}`);
  } catch (err) {
    console.error(`  FALHOU  ${name}\n    ${err.message}`);
    process.exitCode = 1;
  }
}

if (crmMode === "ok") {
  await test("lead válido chega ao CRM com todos os campos", async () => {
    const key = randomUUID();
    const r = await post({ lead: validLead, attribution, idempotencyKey: key, startedAt: slowStart(), website: "" });
    assert.equal(r.status, 200, JSON.stringify(r.data));
    assert.equal(r.data.ok, true);
    const entry = crmEntries().find((e) => e.body?.lead_id === key);
    assert.ok(entry, "CRM não recebeu o lead");
    assert.equal(entry.authorization, "Bearer chave-de-teste-local");
    assert.equal(entry.idempotencyKey, key);
    const b = entry.body;
    assert.equal(b.origem, "Landing Page — Contabilidade para Médicos");
    assert.equal(b.segmento, "Revisão tributária");
    assert.equal(b.telefone, "+5531987654321");
    assert.equal(b.email, "ana.ribeiro@clinica.com.br");
    assert.equal(b.cidade_uf, "Belo Horizonte/MG");
    assert.equal(b.possui_cnpj, "Sim");
    assert.equal(b.objetivo, "Reduzir minha carga tributária");
    assert.equal(b.faturamento, "R$ 20 mil a R$ 40 mil");
    assert.equal(b.utm_source, "instagram");
    assert.equal(b.utm_campaign, "medicos_bh_nov");
    assert.equal(b.utm_term, "contabilidade medicos");
    assert.equal(b.campanha_id, "120210000000000");
    assert.equal(b.fbclid, "IwAR-teste");
    assert.equal(b.referrer, "https://l.instagram.com/");
    assert.ok(!Number.isNaN(Date.parse(b.data_conversao)));
  });

  await test("segmentação: abrir CNPJ → Abertura de CNPJ; contratar → Contabilidade recorrente", async () => {
    for (const [objetivo, segmento] of [["abrir_cnpj", "Abertura de CNPJ"], ["contratar_contabilidade", "Contabilidade recorrente"], ["outros", "Outros"]]) {
      const key = randomUUID();
      const r = await post({ lead: { ...validLead, objetivo, possuiCnpj: "nao", faturamento: "" }, idempotencyKey: key, startedAt: slowStart() });
      assert.equal(r.status, 200);
      const b = crmEntries().find((e) => e.body?.lead_id === key).body;
      assert.equal(b.segmento, segmento);
      assert.equal(b.faturamento, "Não informado");
      assert.equal(b.possui_cnpj, "Não");
    }
  });

  await test("envio duplicado (mesma chave) não duplica no CRM", async () => {
    const key = randomUUID();
    const body = { lead: validLead, attribution, idempotencyKey: key, startedAt: slowStart() };
    const [a, b] = [await post(body), await post(body)];
    assert.equal(a.status, 200);
    assert.equal(b.status, 200);
    assert.equal(crmEntries().filter((e) => e.body?.lead_id === key).length, 1);
  });
} else {
  await test("CRM indisponível sem fila configurada → 502 com orientação de WhatsApp", async () => {
    const key = randomUUID();
    const r = await post({ lead: validLead, attribution, idempotencyKey: key, startedAt: slowStart() });
    assert.equal(r.status, 502, JSON.stringify(r.data));
    assert.equal(r.data.ok, false);
    assert.match(r.data.error, /WhatsApp/);
    assert.equal(crmEntries().filter((e) => e.body?.lead_id === key).length, 3, "deveria tentar 3 vezes");
  });
}

await test("dados inválidos → 400 com mensagens por campo", async () => {
  const r = await post({
    lead: { ...validLead, nome: "Ana", whatsapp: "(31) 1234", email: "ana@", uf: "XX", consentimento: false },
    idempotencyKey: randomUUID(),
    startedAt: slowStart(),
  });
  assert.equal(r.status, 400);
  const paths = r.data.issues.map((i) => i.path);
  for (const p of ["lead.nome", "lead.whatsapp", "lead.email", "lead.uf", "lead.consentimento"]) assert.ok(paths.includes(p), `faltou erro em ${p}`);
});

await test("honeypot preenchido → aceito em silêncio e descartado", async () => {
  const key = randomUUID();
  const r = await post({ lead: validLead, idempotencyKey: key, startedAt: slowStart(), website: "http://spam" });
  assert.equal(r.status, 200);
  assert.equal(crmEntries().filter((e) => e.body?.lead_id === key).length, 0);
});

await test("envio em menos de 2,5 s → descartado", async () => {
  const key = randomUUID();
  const r = await post({ lead: validLead, idempotencyKey: key, startedAt: Date.now() - 500 });
  assert.equal(r.status, 200);
  assert.equal(crmEntries().filter((e) => e.body?.lead_id === key).length, 0);
});

await test("JSON malformado → 400", async () => {
  const res = await fetch(`${base}/api/leads`, { method: "POST", body: "{nao-json" });
  assert.equal(res.status, 400);
});

await test("reprocessamento exige token", async () => {
  const res = await fetch(`${base}/api/leads/reprocess`, { method: "POST", headers: { Authorization: "Bearer errado" } });
  assert.equal(res.status, 401);
});

console.log(`\n${passed} teste(s) passaram.`);
