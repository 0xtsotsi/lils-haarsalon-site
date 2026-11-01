/**
 * Rendert de korte video's: frames uit de browser, daarna een mp4 uit ffmpeg.
 *
 *   node scripts/render-videos.mjs
 *
 * De output komt in output/video/<id>-<formaat>.mp4.
 */
import { readFile, mkdir, rm } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { serve } from "./lib/server.mjs";
import { loadPlaywright } from "./lib/playwright.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");

export const VIDEOS = [
  { id: "de-knip", template: "knip.html", duration: 6.4, format: "story" },
  { id: "de-salon", template: "salon.html", duration: 6.4, format: "story" },
  { id: "het-stoplicht", template: "stoplicht.html", duration: 6.4, format: "story" },
  { id: "de-knip-vierkant", template: "knip.html", duration: 6.4, format: "square" }
];

const FPS = 30;

const SIZES = {
  story: { width: 1080, height: 1920 },
  square: { width: 1080, height: 1080 }
};

/** Zet de scene op een bepaald tijdstip en maakt een schermafbeelding. */
async function frame(page, time) {
  await page.evaluate((t) => window.setTime(t), time);
  return page.screenshot({ type: "png" });
}

/** Encodeert een reeks png-frames tot een mp4 met ffmpeg. */
export function encode(frames, size, outFile) {
  return new Promise((resolve, reject) => {
    const args = [
      "-y",
      "-f", "image2pipe",
      "-framerate", String(FPS),
      "-i", "pipe:0",
      "-c:v", "libx264",
      "-profile:v", "high",
      "-preset", "slow",
      "-crf", "20",
      "-pix_fmt", "yuv420p",
      "-movflags", "+faststart",
      "-r", String(FPS),
      outFile
    ];
    const proc = spawn("ffmpeg", args, { stdio: ["pipe", "ignore", "pipe"] });
    let stderr = "";
    proc.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    proc.on("error", reject);
    proc.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg stopte met code ${code}\n${stderr.slice(-2000)}`));
    });
    for (const buffer of frames) {
      proc.stdin.write(buffer);
    }
    proc.stdin.end();
  });
}

async function main() {
  const { chromium } = await loadPlaywright();
  const { server, port } = await serve(ROOT);
  const base = `http://127.0.0.1:${port}`;
  const browser = await chromium.launch();
  const outDir = join(ROOT, "output", "video");
  await mkdir(outDir, { recursive: true });

  try {
    for (const video of VIDEOS) {
      const size = SIZES[video.format];
      const html = await readFile(join(ROOT, "templates", "video", video.template), "utf8");
      const page = await browser.newPage({ viewport: size, deviceScaleFactor: 1 });
      const ready = html
        .replace('<html lang="nl" data-format="story">', `<html lang="nl" data-format="${video.format}">`)
        .replace('<head>', `<head><base href="${base}/templates/video/">`)
        .replace('href="../base.css"', `href="${base}/templates/base.css"`);
      await page.setContent(ready, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);

      const total = Math.round(video.duration * FPS);
      const frames = [];
      for (let i = 0; i < total; i += 1) {
        frames.push(await frame(page, i / FPS));
      }
      await page.close();

      const outFile = join(outDir, `${video.id}.mp4`);
      await encode(frames, size, outFile);
      console.log(`  ${video.id}.mp4  ${size.width}x${size.height}  ${total} frames  ${video.duration}s`);
    }
  } finally {
    await browser.close();
    server.close();
  }
  console.log(`\n${VIDEOS.length} video's gerenderd.`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
