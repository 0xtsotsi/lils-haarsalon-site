/**
 * Zet de bijschriften en hashtags uit content/posts.json om naar tekst,
 * zodat ze gekopieerd kunnen worden zonder de json te openen.
 *
 *   node scripts/export-captions.mjs
 */
import { readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");

const data = JSON.parse(await readFile(join(ROOT, "content", "posts.json"), "utf8"));
const lines = [
  "# Bijschriften per post",
  "",
  "Kopieer de bijschrift en de hashtags. De bijschrift komt in de eerste regel,",
  "de hashtags eronder.",
  "",
  "De bestanden staan in `output/images/<formaat>/<id>.png`.",
  ""
];

for (const post of data.posts) {
  lines.push(`## ${post.id}`);
  lines.push("");
  lines.push("**Bijschrift**");
  lines.push("");
  lines.push(post.caption);
  lines.push("");
  lines.push("**Hashtags**");
  lines.push("");
  lines.push(post.hashtags.join(" "));
  lines.push("");
}

await writeFile(join(ROOT, "content", "bijschriften-overzicht.md"), lines.join("\n"), "utf8");
console.log(`content/bijschriften-overzicht.md geschreven (${data.posts.length} posts)`);
