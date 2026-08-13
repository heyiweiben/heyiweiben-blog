import fs from "node:fs/promises";
import path from "node:path";

const out = path.resolve("build/client");
const manifest = JSON.parse(await fs.readFile("app/generated/content.json", "utf8"));

async function exists(target) {
  return fs.access(target).then(() => true).catch(() => false);
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const target = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(target));
    else files.push(target);
  }
  return files;
}

const required = [
  "index.html", "posts/index.html", "about/index.html", "404.html", "index.xml", "posts/index.xml", "sitemap.xml",
  ...manifest.posts.map((post) => `posts/${post.slug}/index.html`),
];
for (const relative of required) {
  if (!await exists(path.join(out, relative))) throw new Error(`missing build artifact: ${relative}`);
}

const primaryPages = required.filter((file) => file.endsWith("index.html"));
for (const relative of primaryPages) {
  const html = await fs.readFile(path.join(out, relative), "utf8");
  if (!html.includes("seed 177a5542")) throw new Error(`direction contract missing: ${relative}`);
  if (!html.includes("<main")) throw new Error(`real HTML content missing: ${relative}`);
}

const files = await walk(out);
const htmlFiles = files.filter((file) => file.endsWith(".html") && !file.endsWith("__spa-fallback.html"));
const broken = [];
const nonCanonical = [];
for (const file of htmlFiles) {
  const html = await fs.readFile(file, "utf8");
  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    const href = match[1];
    if (!href.startsWith("/") || href.startsWith("//")) continue;
    const clean = href.split(/[?#]/)[0];
    if (!clean) continue;
    const relative = clean.replace(/^\//, "");
    if (clean !== "/" && !path.extname(relative) && !clean.endsWith("/")) {
      nonCanonical.push(`${path.relative(out, file)} -> ${href}`);
    }
    const target = path.join(out, relative);
    const candidates = path.extname(relative) ? [target] : [target, path.join(target, "index.html")];
    if (!(await Promise.all(candidates.map(exists))).some(Boolean)) broken.push(`${path.relative(out, file)} -> ${href}`);
  }
}
if (broken.length) throw new Error(`broken internal links:\n${broken.join("\n")}`);
if (nonCanonical.length) throw new Error(`internal page links must end with a slash:\n${nonCanonical.join("\n")}`);

const publicText = (await Promise.all(files.filter((file) => /\.(html|js|xml)$/.test(file)).map((file) => fs.readFile(file, "utf8")))).join("\n");
if (publicText.includes("2026-07-06-ai-notes") || publicText.includes("2026-06-18-ai-notes")) {
  throw new Error("draft route leaked into public build");
}

console.log(`build check: ${manifest.posts.length} posts, ${htmlFiles.length} HTML files, internal links valid, drafts absent`);
