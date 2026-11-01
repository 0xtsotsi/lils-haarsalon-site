import { createRequire } from "node:module";
import { existsSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { join } from "node:path";

const CANDIDATES = [
  "C:/Users/johnb/AppData/Local/GG Coder/sidecar/node_modules/playwright/index.mjs",
  "C:/Users/johnb/AppData/Roaming/npm/node_modules/@kenkaiiii/ggcoder/node_modules/playwright/index.mjs"
];

/** Playwright laden: eerst lokaal geïnstalleerd, daarna de bekende installaties. */
export async function loadPlaywright() {
  const require = createRequire(import.meta.url);
  try {
    return require("playwright");
  } catch {
    /* niet lokaal geïnstalleerd, dan zoeken we verder */
  }
  for (const candidate of CANDIDATES) {
    if (existsSync(candidate)) {
      return import(pathToFileURL(candidate).href);
    }
  }
  throw new Error(
    "Playwright is niet gevonden. Installeer het met: npm install --save-dev playwright && npx playwright install chromium"
  );
}

export const ROOT = join(process.cwd());
