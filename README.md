# Landing page — Contabilidade para Médicos | BC Consultores

Página de captação para campanhas (Instagram/Facebook Ads e Google) da BC Consultores.
Next.js (App Router) · React · TypeScript · Tailwind CSS · React Hook Form + Zod · Motion.

## Antes de publicar

1. **Condição comercial**: confirmar com a BC Consultores valor e itens de `src/config/offer.ts`
   (para ocultar a seção: `enabled: false`).
2. **Dados institucionais**: revisar `src/config/site.ts` (telefone, e-mail, endereço, WhatsApp, números
   "+200 clientes" e "+15 anos", todos extraídos de https://bcconsultores.adv.br).
3. **CRM**: o site atual não tem integração com CRM (o formulário só abre o WhatsApp). Defina
   `CRM_API_URL` e `CRM_API_KEY` com o webhook/API do CRM usado pelo comercial (contrato abaixo).
4. **Fila de pendentes**: crie um Redis Upstash pelo Marketplace da Vercel (gera `KV_REST_API_URL` e
   `KV_REST_API_TOKEN`), e defina `LEADS_ADMIN_TOKEN` e `CRON_SECRET`.
5. **Rastreamento**: `NEXT_PUBLIC_GTM_ID` ou `NEXT_PUBLIC_GA_ID`, e `NEXT_PUBLIC_META_PIXEL_ID`.

Todas as variáveis estão descritas em `.env.example`. Apenas as com prefixo `NEXT_PUBLIC_` chegam ao
navegador; chaves de CRM e Redis ficam só no servidor.

## Desenvolvimento

```bash
npm install
cp .env.example .env.local   # preencha os valores
npm run dev
```

## Fluxo do lead

1. O visitante envia o formulário → `POST /api/leads`.
2. O servidor valida (Zod), descarta spam (honeypot e envio em menos de 2,5 s), limita a taxa por IP e
   ignora reenvios com a mesma chave de idempotência.
3. O lead vai ao CRM com até 3 tentativas (falhas 5xx, 429, 408 ou timeout).
4. Se o CRM falhar, o lead é guardado no Redis e o visitante vê a tela de sucesso normalmente.
   O Vercel Cron chama `/api/leads/reprocess` a cada 15 minutos até o CRM aceitar.
5. Se CRM **e** Redis falharem, o visitante recebe a orientação de enviar pelo WhatsApp e o lead
   completo é registrado no log da função com a etiqueta `[leads] LEAD_NAO_ENTREGUE`.
6. A tela de sucesso oferece continuar no WhatsApp com mensagem pré-preenchida. Abrir o WhatsApp não
   substitui o envio ao CRM.

Reprocessamento manual:

```bash
curl -X POST -H "Authorization: Bearer $LEADS_ADMIN_TOKEN" https://SEU-DOMINIO/api/leads/reprocess
```

## Contrato com o CRM

`POST CRM_API_URL` com JSON. Cabeçalhos: `Content-Type: application/json`, `Idempotency-Key: <lead_id>`
e `Authorization: Bearer <CRM_API_KEY>` (ou o cabeçalho definido em `CRM_AUTH_HEADER`).
Qualquer resposta 2xx é considerada entregue.

| Campo | Exemplo |
| --- | --- |
| `lead_id` | UUID, igual ao `Idempotency-Key` |
| `origem` | `Landing Page — Contabilidade para Médicos` |
| `segmento` | `Abertura de CNPJ`, `Revisão tributária`, `Contabilidade recorrente` ou `Outros` |
| `nome`, `email`, `especialidade` | texto |
| `telefone` | `+5531987654321` |
| `cidade`, `uf`, `cidade_uf` | `Belo Horizonte`, `MG`, `Belo Horizonte/MG` |
| `possui_cnpj` | `Sim` ou `Não` |
| `objetivo` | texto da opção escolhida |
| `faturamento` | faixa escolhida ou `Não informado` |
| `observacoes` | texto (pode ser vazio) |
| `consentimento_lgpd` | `true` |
| `data_conversao` | ISO 8601 (UTC) |
| `pagina_origem`, `referrer` | URL de entrada com parâmetros e referência |
| `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` | texto ou vazio |
| `campanha_id` | `campaign_id` ou `utm_id` da URL |
| `gclid`, `fbclid` | identificadores de clique do Google e da Meta |

O segmento é derivado do objetivo: abrir CNPJ → Abertura de CNPJ; reduzir impostos ou revisar
contabilidade → Revisão tributária; contratar contabilidade → Contabilidade recorrente.

As UTMs e identificadores de clique ficam salvos no navegador por 30 dias. Uma nova visita vinda de
outra campanha substitui a anterior (modelo de último clique).

## Rastreamento

Eventos enviados ao `dataLayer` (GTM), `gtag` (GA4, quando não há GTM) e Meta Pixel:
`page_view`, `view_services`, `click_whatsapp`, `form_start`, `form_submit`, `lead_generated`,
`click_cta`, `select_cnpj_status`. `lead_generated` leva `event_id` = `lead_id` e só é disparado uma vez
por lead; `view_services` e `form_start`, uma vez por sessão. No Pixel, `lead_generated` vira `Lead` e
`click_whatsapp` vira `Contact`.

## Testes

Com o build de produção rodando (`npm run build && npm start`) e o CRM simulado
(`npm run mock:crm`), com `.env.local` apontando para ele:

```env
CRM_API_URL=http://localhost:4010/leads
CRM_API_KEY=chave-local
KV_REST_API_URL=http://localhost:4010/redis
KV_REST_API_TOKEN=token-local
LEADS_ADMIN_TOKEN=token-admin-teste-local-123456
```

```bash
npm run test:leads       # API: entrega, idempotência, validação, spam, autenticação
npm run test:reprocess   # CRM fora do ar → fila → reprocessamento
npm run test:browser     # navegador (Edge): UTMs, pré-preenchimento, formulário, WhatsApp, eventos, responsivo
npm run screens          # screenshots por tela em ./screenshots
```

Os testes de navegador usam o Microsoft Edge instalado (`playwright-core`, sem baixar navegadores).

## Deploy (Vercel)

1. Importe o repositório na Vercel e configure as variáveis de ambiente de produção.
2. O `vercel.json` agenda o reprocessamento a cada 15 minutos (requer plano Pro, que também é o exigido
   para uso comercial).
3. Após publicar, rode o PageSpeed Insights na URL final e faça um envio real de teste conferindo a
   chegada no CRM.
