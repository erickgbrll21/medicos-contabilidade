// Screenshots por tela (altura da viewport), para revisão visual.
// Uso: node scripts/screens.mjs [baseUrl] [largura...]
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const [base = "http://localhost:3000", ...widths] = process.argv.slice(2);
const dir = fileURLToPath(new URL("../screenshots/", import.meta.url));
mkdirSync(dir, { recursive: true });

const browser = await chromium.launch({ channel: "msedge" });
for (const width of (widths.length ? widths : ["390", "1440"]).map(Number)) {
  const height = width < 768 ? 844 : 900;
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  await page.goto(base);
  await page.waitForLoadState("networkidle");
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let i = 0, y = 0; y < total; i++, y += height) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${dir}${width}-${String(i).padStart(2, "0")}.png` });
  }
  console.log(`${width}px: ${Math.ceil(total / height)} telas`);
  await page.close();
}
await browser.close();
