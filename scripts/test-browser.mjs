// Teste ponta a ponta no navegador (Edge instalado) + screenshots responsivos.
// Requer: servidor em baseUrl, scripts/mock-crm.mjs em modo "ok".
// Uso: node scripts/test-browser.mjs [baseUrl]
import assert from "node:assert/strict";
import { mkdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const base = process.argv[2] ?? "http://localhost:3000";
const shotsDir = new URL("../screenshots/", import.meta.url);
const shot = (name) => fileURLToPath(new URL(name, shotsDir));
const crmLog = new URL("./mock-crm.log", import.meta.url);
mkdirSync(shotsDir, { recursive: true });
await fetch("http://localhost:4010/__mode/ok", { method: "POST" });

const browser = await chromium.launch({ channel: "msedge" });
const ok = (msg) => console.log(`  ok  ${msg}`);

// 1. Fluxo de conversão no mobile, vindo do Instagram
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  // Sem IDs de GTM/GA no ambiente local, simula a fila do GTM para observar os eventos.
  await context.addInitScript(() => {
    window.dataLayer = window.dataLayer || [];
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

  await page.goto(`${base}/?utm_source=instagram&utm_medium=paid_social&utm_campaign=medicos_nov&utm_content=reels01&utm_term=cnpj&utm_id=12345&fbclid=abc123`);
  await page.waitForLoadState("networkidle");
  // UTM precisa sobreviver a uma navegação sem parâmetros
  await page.goto(`${base}/politica-de-privacidade`);
  await page.goto(`${base}/`);
  ok("UTMs capturadas e mantidas após navegação");

  await page.getByRole("button", { name: /abrir menu|menu/i }).first().click();
  await expectVisible(page.getByRole("navigation").getByRole("link", { name: /Serviços|Soluções/i }).first());
  await page.keyboard.press("Escape");
  ok("menu mobile abre");

  await page.getByRole("link", { name: "Quero abrir meu CNPJ", exact: true }).click();
  await page.waitForTimeout(1200);
  assert.equal(await page.locator('input[name="possuiCnpj"][value="nao"]').isChecked(), true, "CNPJ 'Não' pré-selecionado");
  assert.equal(await page.locator("#objetivo").inputValue(), "abrir_cnpj", "objetivo pré-selecionado");
  ok("card 'Ainda não possuo CNPJ' pré-preenche o formulário");

  await page.getByRole("button", { name: "Solicitar análise gratuita" }).click();
  assert.ok((await page.locator('[aria-invalid="true"]').count()) >= 4, "campos obrigatórios marcados como inválidos");
  assert.equal(await page.evaluate(() => document.activeElement?.id), "nome", "foco vai para o primeiro erro");
  ok("envio vazio mostra erros e foca o primeiro campo");

  await page.fill("#nome", "Mariana Alves Costa");
  await page.locator("#whatsapp").pressSequentially("31987654321");
  assert.equal(await page.locator("#whatsapp").inputValue(), "(31) 98765-4321");
  ok("máscara de telefone aplicada");
  await page.fill("#email", "mariana");
  await page.locator("#especialidade").focus();
  await expectVisible(page.locator("#email-error"));
  ok("validação em tempo real do e-mail");
  await page.fill("#email", "mariana@clinica.com.br");
  await page.fill("#especialidade", "Dermatologia");
  await page.fill("#cidade", "Belo Horizonte");
  await page.selectOption("#uf", "MG");
  await page.selectOption("#faturamento", "20k_40k");
  await page.fill("#observacoes", "Começo a atender em clínica em janeiro.");
  await page.getByRole("checkbox", { name: /Autorizo a BC Consultores/ }).check();
  await page.waitForTimeout(2600);

  const before = readLog().length;
  const submit = page.getByRole("button", { name: "Solicitar análise gratuita" });
  await submit.dblclick();
  const success = page.getByRole("heading", { name: /recebemos|obrigad/i });
  await success.waitFor({ timeout: 15000 });
  await page.screenshot({ path: shot("mobile-390-sucesso.png"), fullPage: false });
  ok("tela de sucesso exibida");

  const sent = readLog().slice(before).filter((e) => e.status === 201);
  assert.equal(sent.length, 1, `duplo clique deve gerar 1 envio ao CRM, gerou ${sent.length}`);
  const lead = sent[0].body;
  assert.equal(lead.origem, "Landing Page — Contabilidade para Médicos");
  assert.equal(lead.segmento, "Abertura de CNPJ");
  assert.equal(lead.telefone, "+5531987654321");
  assert.equal(lead.possui_cnpj, "Não");
  assert.equal(lead.faturamento, "R$ 20 mil a R$ 40 mil");
  assert.equal(lead.utm_source, "instagram");
  assert.equal(lead.utm_campaign, "medicos_nov");
  assert.equal(lead.utm_term, "cnpj");
  assert.equal(lead.campanha_id, "12345");
  assert.equal(lead.fbclid, "abc123");
  assert.ok(lead.pagina_origem.includes("utm_source=instagram"), "página de origem com a URL de entrada");
  ok("CRM recebeu 1 lead com origem, segmento, telefone E.164 e UTMs");

  const wa = await page.getByRole("link", { name: "Continuar pelo WhatsApp" }).getAttribute("href");
  const text = decodeURIComponent(new URL(wa).searchParams.get("text"));
  assert.ok(wa.startsWith("https://wa.me/55"));
  assert.ok(text.includes("Nome: Mariana Alves Costa") && text.includes("Possui CNPJ: Não") && text.includes("Objetivo: Abrir meu CNPJ"));
  ok("link do WhatsApp com mensagem personalizada");

  const events = await page.evaluate(() => (window.dataLayer ?? []).map((e) => e.event).filter(Boolean));
  for (const name of ["page_view", "click_cta", "select_cnpj_status", "form_start", "form_submit", "lead_generated"]) {
    assert.ok(events.includes(name), `evento ${name} ausente: ${events.join(", ")}`);
  }
  assert.equal(events.filter((e) => e === "lead_generated").length, 1, "lead_generated deve ocorrer uma vez");
  ok("eventos de analytics disparados, conversão sem duplicidade");

  assert.deepEqual(errors, [], `erros no console: ${errors.join(" | ")}`);
  ok("nenhum erro de console");
  await context.close();
}

// 2. Screenshots responsivos e verificação de rolagem horizontal
for (const width of [360, 390, 430, 768, 1280, 1440, 1920]) {
  const page = await browser.newPage({ viewport: { width, height: width < 768 ? 800 : 900 } });
  await page.goto(base);
  await page.waitForLoadState("networkidle");
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(600);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  assert.ok(overflow <= 0, `${width}px: rolagem horizontal de ${overflow}px`);
  const small = await page.evaluate(() =>
    [...document.querySelectorAll("a, button, input, select, textarea")]
      .filter((el) => el.offsetParent && !el.closest(".sr-only, [aria-hidden=true]") && el.id !== "website")
      .map((el) => ({ el, r: el.getBoundingClientRect() }))
      .filter(({ el, r }) => r.height < 24 && el.type !== "checkbox" && el.type !== "radio" && !el.closest("p, li"))
      .map(({ el, r }) => `${el.tagName} "${(el.textContent || el.id).trim().slice(0, 30)}" ${Math.round(r.height)}px`),
  );
  await page.screenshot({ path: shot(`home-${width}.png`), fullPage: true });
  if (small.length) console.log(`  !!  ${width}px alvos de toque pequenos: ${small.join("; ")}`);
  ok(`${width}px sem rolagem horizontal`);
  await page.close();
}

await browser.close();
console.log("\nTestes de navegador concluídos.");

function readLog() {
  try {
    return readFileSync(crmLog, "utf8").trim().split("\n").filter(Boolean).map((l) => JSON.parse(l));
  } catch {
    return [];
  }
}

async function expectVisible(locator) {
  await locator.waitFor({ state: "visible", timeout: 5000 });
}
