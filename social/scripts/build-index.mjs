/**
 * Vult de beelden in social/index.html, zodat de pagina altijd klopt met
 * de posts in content/posts.json.
 *
 *   node scripts/build-index.mjs
 */
import { readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");

const data = JSON.parse(await readFile(join(ROOT, "content", "posts.json"), "utf8"));
const FORMATS = [
  { id: "square", label: "vierkant 1080 × 1080" },
  { id: "portrait", label: "portret 1080 × 1350" },
  { id: "story", label: "story 1080 × 1920" },
  { id: "landscape", label: "landschap 1200 × 628" }
];

const cards = data.posts
  .map((post) => {
    const links = FORMATS.map(
      (format) =>
        `<a href="output/images/${format.id}/${post.id}.jpg" download title="${format.label}">${format.id}</a>`
    ).join(" ");
    return `      <article class="card">
        <a class="card-image" href="output/images/portrait/${post.id}.jpg" download>
          <img src="output/images/square/${post.id}.jpg" alt="${post.title ?? post.id}" loading="lazy" width="1080" height="1080">
        </a>
        <div class="card-body">
          <p class="card-title">${post.title ?? post.id}</p>
          <p class="card-meta">${post.eyebrow ?? ""}</p>
          <div class="card-formats">${links}</div>
        </div>
      </article>`;
  })
  .join("\n");

const block = `    <!-- BEELDEN -->
    <h2>Beelden</h2>
    <p class="note">Elke post staat in vier formaten. Klik op een formaat om het bestand te krijgen.</p>
    <div class="grid">
${cards}
    </div>
`;

const file = join(ROOT, "index.html");
let html = await readFile(file, "utf8");
const start = html.indexOf("    <!-- BEELDEN -->");
const end = html.indexOf("    <h2>Korte video's</h2>");
if (start === -1 || end === -1) {
  throw new Error("De plek voor de beelden is niet gevonden in index.html");
}
html = html.slice(0, start) + block + "\n" + html.slice(end);
await writeFile(file, html, "utf8");
console.log(`index.html bijgewerkt met ${data.posts.length} beelden`);
