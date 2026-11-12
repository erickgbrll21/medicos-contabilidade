// Receptor HTTP local para testar a integração sem um CRM real.
// Uso: node scripts/mock-crm.mjs [porta] [modo]
//   /leads      simula o CRM: modo "ok" responde 201, "fail" responde 503.
//   /redis      emula a API REST do Upstash (HSET, HGETALL, HDEL) em memória, para testar a fila de pendentes.
//   POST /__mode/ok | /__mode/fail  troca o modo sem reiniciar.
// No .env.local: CRM_API_URL=http://localhost:4010/leads e, opcionalmente,
// KV_REST_API_URL=http://localhost:4010/redis e KV_REST_API_TOKEN=qualquer-valor.
import { createServer } from "node:http";
import { appendFileSync } from "node:fs";

const port = Number(process.argv[2] ?? 4010);
let mode = process.argv[3] ?? "ok";
const hashes = new Map();

function redis([cmd, key, ...args]) {
  const h = hashes.get(key) ?? new Map();
  hashes.set(key, h);
  switch (String(cmd).toUpperCase()) {
    case "HSET":
      h.set(args[0], args[1]);
      return 1;
    case "HGETALL":
      return [...h.entries()].flat();
    case "HDEL":
      return h.delete(args[0]) ? 1 : 0;
    default:
      throw new Error(`comando não suportado: ${cmd}`);
  }
}

createServer((req, res) => {
  let body = "";
  req.on("data", (chunk) => (body += chunk));
  req.on("end", () => {
    const reply = (status, data) => {
      res.writeHead(status, { "Content-Type": "application/json" });
      res.end(JSON.stringify(data));
    };

    if (req.url.startsWith("/__mode/")) {
      mode = req.url.split("/")[2];
      console.log(`[mock-crm] modo -> ${mode}`);
      return reply(200, { mode });
    }

    if (req.url.startsWith("/redis")) {
      if (!req.headers.authorization?.startsWith("Bearer ")) return reply(401, { error: "Unauthorized" });
      try {
        return reply(200, { result: redis(JSON.parse(body)) });
      } catch (err) {
        return reply(400, { error: err.message });
      }
    }

    const entry = {
      at: new Date().toISOString(),
      method: req.method,
      url: req.url,
      status: mode === "fail" ? 503 : 201,
      authorization: req.headers.authorization ?? null,
      idempotencyKey: req.headers["idempotency-key"] ?? null,
      body: body ? JSON.parse(body) : null,
    };
    appendFileSync(new URL("./mock-crm.log", import.meta.url), JSON.stringify(entry) + "\n");
    console.log(`[mock-crm] ${req.method} ${req.url} -> ${entry.status}`, entry.body?.lead_id ?? "");
    reply(entry.status, mode === "fail" ? { error: "indisponível" } : { id: entry.body?.lead_id });
  });
}).listen(port, () => console.log(`[mock-crm] ouvindo em http://localhost:${port} (modo ${mode})`));
