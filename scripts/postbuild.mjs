import fs from "node:fs/promises";
import path from "node:path";

const siteUrl = "https://heyiweiben.com";
const out = path.resolve("build/client");
const manifest = JSON.parse(await fs.readFile("app/generated/content.json", "utf8"));
const contract = `<!--
THESIS: 以当代山水承载“问题之下”的独立写作，拒绝个人品牌首页与卡片门户。
OWN-WORLD: 雾米白纸面、深青墨文字、山林绿与暮色蓝山体、夕照橙细节；开放式编辑排版。
STORY: 先看见问题，再遇见三篇文章，最后进入安静、清楚的长期阅读。
FIRST VIEWPORT: 左侧大标题与副标题占第一焦点，山水由右下向全幅展开，索引保持克制。
FORM: 当代山水网络刊物；已确认参考图；seed 177a5542（用户锁定方向优先）。
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
-->`;

function escapeXml(value) {
  return String(value).replace(/[<>&"']/g, (char) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[char]);
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else files.push(full);
  }
  return files;
}

for (const file of (await walk(out)).filter((file) => file.endsWith(".html"))) {
  const html = await fs.readFile(file, "utf8");
  if (!html.includes("THESIS: 以当代山水")) {
    await fs.writeFile(file, html.replace(/<body([^>]*)>/, `<body$1>${contract}`), "utf8");
  }
}

const notFoundSource = path.join(out, "404", "index.html");
await fs.copyFile(notFoundSource, path.join(out, "404.html"));

for (const post of manifest.posts) {
  for (const alias of post.aliases) {
    const targetDir = path.join(out, alias.replace(/^\/+|\/+$/g, ""));
    await fs.mkdir(targetDir, { recursive: true });
    const destination = `${siteUrl}/posts/${post.slug}/`;
    const html = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0;url=${destination}"><link rel="canonical" href="${destination}"><title>正在前往文章｜何以为本</title></head><body><p><a href="${destination}">前往文章</a></p></body></html>`;
    await fs.writeFile(path.join(targetDir, "index.html"), html, "utf8");
  }
}

function rss(items, title, link, description) {
  const entries = items.map((post) => `<item><title>${escapeXml(post.title)}</title><link>${siteUrl}/posts/${post.slug}/</link><guid>${siteUrl}/posts/${post.slug}/</guid><pubDate>${new Date(`${post.date}T00:00:00+08:00`).toUTCString()}</pubDate><description>${escapeXml(post.summary)}</description></item>`).join("");
  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${escapeXml(title)}</title><link>${link}</link><description>${escapeXml(description)}</description><language>zh-CN</language>${entries}</channel></rss>`;
}

const sorted = [...manifest.posts].sort((a, b) => b.date.localeCompare(a.date));
await fs.writeFile(path.join(out, "index.xml"), rss(sorted, "何以为本", `${siteUrl}/`, "在技术、商业与生活之间。"), "utf8");
await fs.writeFile(path.join(out, "posts", "index.xml"), rss(sorted, "何以为本 · 文章", `${siteUrl}/posts/`, "全部公开文章"), "utf8");

for (const [kind, field] of [["categories", "categories"], ["tags", "tags"], ["series", "series"]]) {
  const terms = [...new Set(sorted.flatMap((post) => post[field]))];
  for (const term of terms) {
    const dir = path.join(out, kind, encodeURIComponent(term));
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, "index.xml"), rss(sorted.filter((post) => post[field].includes(term)), `何以为本 · ${term}`, `${siteUrl}/${kind}/${encodeURIComponent(term)}/`, `与“${term}”有关的公开文章`), "utf8");
  }
}

const urls = [
  "", "posts/", "about/", "categories/", "tags/", "series/",
  ...sorted.map((post) => `posts/${post.slug}/`),
  ...[...new Set(sorted.flatMap((post) => post.categories))].map((term) => `categories/${encodeURIComponent(term)}/`),
  ...[...new Set(sorted.flatMap((post) => post.tags))].map((term) => `tags/${encodeURIComponent(term)}/`),
  ...[...new Set(sorted.flatMap((post) => post.series))].map((term) => `series/${encodeURIComponent(term)}/`),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((url) => `<url><loc>${siteUrl}/${url}</loc></url>`).join("")}</urlset>`;
await fs.writeFile(path.join(out, "sitemap.xml"), sitemap, "utf8");

console.log(`postbuild: ${manifest.posts.length} posts, RSS, sitemap, aliases and 404 ready`);
