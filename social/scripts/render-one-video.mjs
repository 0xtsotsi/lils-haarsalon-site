/** Rendert één video, om snel te kunnen itereren. */
import { readFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { serve } from "./lib/server.mjs";
import { loadPlaywright } from "./lib/playwright.mjs";
import { encode, VIDEOS } from "./render-videos.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const FPS = 30;
const SIZES = { story: { width: 1080, height: 1920 }, square: { width: 1080, height: 1080 } };

const wanted = process.argv[2] ?? VIDEOS[0].id;
const video = VIDEOS.find((v) => v.id === wanted);
if (!video) throw new Error(`Onbekende video: ${wanted}`);

const { chromium } = await loadPlaywright();
const { server, port } = await serve(ROOT);
const base = `http://127.0.0.1:${port}`;
const browser = await chromium.launch();
const size = SIZES[video.format];
const html = await readFile(join(ROOT, "templates", "video", video.template), "utf8");
const page = await browser.newPage({ viewport: size, deviceScaleFactor: 1 });
const ready = html
  .replace(`<html lang="nl" data-format="story">`, `<html lang="nl" data-format="${video.format}">`)
  .replace("<head>", `<head><base href="${base}/templates/video/">`)
  .replace('href="../base.css"', `href="${base}/templates/base.css"`);
await page.setContent(ready, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
const frames = [];
for (let i = 0; i < Math.round(video.duration * FPS); i += 1) {
  await page.evaluate((t) => window.setTime(t), i / FPS);
  frames.push(await page.screenshot({ type: "png" }));
}
await page.close();
await mkdir(join(ROOT, "output", "video"), { recursive: true });
await encode(frames, size, join(ROOT, "output", "video", `${video.id}.mp4`));
await browser.close();
server.close();
console.log(`${video.id}.mp4 opnieuw gerenderd`);
