/**
 * Rendert alle social templates naar PNG, in elk formaat.
 *
 *   node scripts/render-images.mjs
 *
 * De output komt in output/images/<formaat>/<id>.png.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { serve } from "./lib/server.mjs";
import { loadPlaywright } from "./lib/playwright.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");

export const FORMATS = [
  { id: "square", width: 1080, height: 1080, use: "Instagram vierkant, Facebook, LinkedIn" },
  { id: "portrait", width: 1080, height: 1350, use: "Instagram feed (4:5), Facebook feed" },
  { id: "story", width: 1080, height: 1920, use: "Instagram en Facebook Stories, WhatsApp" },
  { id: "landscape", width: 1200, height: 628, use: "Facebook omslag, LinkedIn, WhatsApp link" }
];

/** Vervangt {{TOKEN}} in de template door de waarde uit de post. */
export function fill(template, values) {
  return template.replace(/\{\{([A-Z]+)\}\}/g, (match, key) => {
    if (!(key in values)) throw new Error(`Onbekende placeholder ${match} in de template`);
    return String(values[key]);
  });
}

async function main() {
  const { posts } = JSON.parse(await readFile(join(ROOT, "content", "posts.json"), "utf8"));
  const { chromium } = await loadPlaywright();
  const { server, port } = await serve(ROOT);
  const base = `http://127.0.0.1:${port}`;
  const browser = await chromium.launch();
  let count = 0;

  try {
    for (const post of posts) {
      const template = await readFile(join(ROOT, "templates", post.template), "utf8");
      for (const format of FORMATS) {
        const page = await browser.newPage({
          viewport: { width: format.width, height: format.height },
          deviceScaleFactor: 1
        });
        const html = fill(template, {
          IMG: post.img,
          FOCAL: post.focal ?? "50% 50%",
          EYEBROW: post.eyebrow ?? "",
          TITLE: post.title ?? "",
          BODY: post.body ?? "",
          PRICE: post.price ?? "",
          CARDLABEL: post.cardlabel ?? "",
          TIPS: (post.tips ?? []).map((tip) => `<li>${tip}</li>`).join("\n        ")
        });
        // De template begint altijd als vierkant; het formaat wordt hier
        // gezet, want de opmaak en de tekstgrootte hangen eraan.
        const ready = html
          .replace('data-format="square"', `data-format="${format.id}"`)
          .replace("<head>", `<head><base href="${base}/templates/">`)
          .replace('href="base.css"', `href="${base}/templates/base.css"`);
        await page.setContent(ready, { waitUntil: "networkidle" });
        await page.evaluate(() => document.fonts.ready);
        const missing = await page.evaluate(() =>
          [...document.images].filter((img) => !img.complete || img.naturalWidth === 0).map((img) => img.src)
        );
        if (missing.length > 0) {
          throw new Error(`Foto's niet geladen in ${post.id} (${format.id}): ${missing.join(", ")}`);
        }
        const dir = join(ROOT, "output", "images", format.id);
        await mkdir(dir, { recursive: true });
        const file = join(dir, `${post.id}.jpg`);
        // JPEG, want dat is het formaat dat je ook uploadt. Het scheelt
        // veel gewicht ten opzichte van PNG bij foto's.
        await page.screenshot({ path: file, type: "jpeg", quality: 92 });
        // Niets mag uit het canvas lopen: elk element wordt gecontroleerd op
        // de rechter- en onderrand.
        const overflow = await page.evaluate(() => {
          const limit = document.documentElement;
          const out = [];
          for (const el of document.querySelectorAll("body *")) {
            const box = el.getBoundingClientRect();
            if (box.width === 0 && box.height === 0) continue;
            if (box.right > limit.clientWidth + 1 || box.bottom > limit.clientHeight + 1 || box.left < -1 || box.top < -1) {
              out.push(`${el.tagName}.${el.className || ""} l=${Math.round(box.left)} t=${Math.round(box.top)} r=${Math.round(box.right)} b=${Math.round(box.bottom)}`);
            }
          }
          return { out, w: limit.clientWidth, h: limit.clientHeight };
        });
        if (overflow.out.length > 0) {
          throw new Error(
            `Inhoud valt buiten het canvas in ${post.id} (${format.id}, ${overflow.w}x${overflow.h}): ${overflow.out.join(" | ")}`
          );
        }
        console.log(`  ${format.id.padEnd(10)} ${post.id}.jpg  ${format.width}x${format.height}`);
        count += 1;
        await page.close();
      }
    }
  } finally {
    await browser.close();
    server.close();
  }
  console.log(`\n${count} afbeeldingen gerenderd.`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
