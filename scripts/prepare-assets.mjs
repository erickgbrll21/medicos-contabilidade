// Gera os assets de marca e fotos a partir dos originais em scripts/source/.
// Uso: node scripts/prepare-assets.mjs
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const src = (f) => fileURLToPath(new URL(`./source/${f}`, import.meta.url));
const out = (f) => fileURLToPath(new URL(`../${f}`, import.meta.url));

await mkdir(out("public/brand"), { recursive: true });
await mkdir(out("public/images"), { recursive: true });

// Logo oficial (branco sobre preto) -> branco com transparência por luminância.
const logo = sharp(src("logo-bcc.png"));
const { width, height } = await logo.metadata();
const alpha = await logo.clone().greyscale().raw().toBuffer();
const white = Buffer.alloc(width * height * 4);
for (let i = 0; i < width * height; i++) {
  white[i * 4] = 255;
  white[i * 4 + 1] = 255;
  white[i * 4 + 2] = 255;
  white[i * 4 + 3] = alpha[i];
}
const whiteLogo = sharp(white, { raw: { width, height, channels: 4 } });
await whiteLogo.clone().trim().png().toFile(out("public/brand/logo-bcc-branco.png"));

// Monograma (três quadrados) para os ícones do site.
const monoCrop = await sharp(white, { raw: { width, height, channels: 4 } })
  .extract({ left: 0, top: 0, width: Math.round(width * 0.47), height })
  .png()
  .toBuffer();
const mono = await sharp(monoCrop).trim().png().toBuffer();
async function icon(size, file) {
  const inner = Math.round(size * 0.78);
  const mark = await sharp(mono).resize({ width: inner }).toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: "#101010" } })
    .composite([{ input: mark, gravity: "center" }])
    .png()
    .toFile(out(file));
}
await icon(512, "src/app/icon.png");
await icon(180, "src/app/apple-icon.png");

// Fotos: monocromáticas, contraste leve, WebP.
await sharp(src("hero-medica.jpg"))
  .resize({ width: 2000 })
  .greyscale()
  .linear(1.08, -8)
  .webp({ quality: 80 })
  .toFile(out("public/images/hero-medica.webp"));

await sharp(src("escritorio-reuniao.webp"))
  .greyscale()
  .linear(1.05, -4)
  .webp({ quality: 80 })
  .toFile(out("public/images/escritorio-reuniao.webp"));

// Imagem de compartilhamento (Open Graph / Twitter), 1200x630.
const ogPhoto = await sharp(src("hero-medica.jpg"))
  .resize({ width: 600, height: 630, fit: "cover", position: "right" })
  .greyscale()
  .toBuffer();
const ogLogo = await sharp(out("public/brand/logo-bcc-branco.png")).resize({ width: 300 }).toBuffer();
const ogText = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <style>.h{font-family:'Century Gothic','Futura','Segoe UI',sans-serif;fill:#fff;font-size:43px;letter-spacing:-1px}
  .s{font-family:'Segoe UI',Arial,sans-serif;fill:#bdbdbd;font-size:24px}</style>
  <text class="h" x="64" y="250">Sua carreira médica</text>
  <text class="h" x="64" y="304">merece uma contabilidade</text>
  <text class="h" x="64" y="358">à altura.</text>
  <text class="s" x="64" y="540">Contabilidade para médicos · BC Consultores</text>
</svg>`);
const og = sharp({ create: { width: 1200, height: 630, channels: 3, background: "#101010" } })
  .composite([
    { input: ogPhoto, left: 600, top: 0 },
    {
      input: Buffer.from(`<svg width="1200" height="630"><defs><linearGradient id="g" x1="0" x2="1">
        <stop offset="0.52" stop-color="#101010"/><stop offset="0.68" stop-color="#101010" stop-opacity="0"/></linearGradient></defs>
        <rect width="1200" height="630" fill="url(#g)"/></svg>`),
      left: 0,
      top: 0,
    },
    { input: ogLogo, left: 64, top: 64 },
    { input: ogText, left: 0, top: 0 },
  ])
  .jpeg({ quality: 85 });
await og.clone().toFile(out("src/app/opengraph-image.jpg"));
await og.clone().toFile(out("src/app/twitter-image.jpg"));

console.log("assets ok");
