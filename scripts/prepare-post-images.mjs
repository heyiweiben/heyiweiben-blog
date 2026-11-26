/**
 * 为文章正文配图生成响应式变体（AVIF + WebP）并写出清单。
 *
 * 为什么：文章里的图原本直接引用 1600px 级别的 WebP，手机只显示 ~350px 宽，
 * 单篇要走 900KB 以上。这里按 720/1080 两档重编码，AVIF 再省一半。
 *
 * 产物：与原图同目录的 `<name>-720.avif`、`<name>-1080.avif`、`<name>-720.webp`、`<name>-1080.webp`
 * 清单：app/generated/images.json（供 rehype 插件改写 <img> → <picture>）
 * 增量：产物比原图新就跳过，构建不会重复编码。
 */

import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const contentDirs = [path.join(root, "content", "posts"), path.join(root, "content")];
const staticRoot = path.join(root, "static");
const manifestPath = path.join(root, "app", "generated", "images.json");

const WIDTHS = [720, 1080];
const MAX_WIDTH = 1080;

async function collectMarkdown(dir) {
  const out = [];
  let entries = [];
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
    const file = path.join(dir, entry.name);
    if (dir === path.join(root, "content") && !entry.name.startsWith("about")) continue;
    out.push(file);
  }
  return out;
}

const refs = new Set();
for (const dir of contentDirs) {
  for (const file of await collectMarkdown(dir)) {
    const text = await fs.readFile(file, "utf8");
    for (const match of text.matchAll(/!\[[^\]]*\]\((\/images\/[^)\s]+)\)/g)) refs.add(match[1]);
  }
}

const manifest = {};
for (const ref of refs) {
  const source = path.join(staticRoot, ref.replace(/^\//, ""));
  try {
    await fs.access(source);
  } catch {
    continue;
  }
  const ext = path.extname(source).toLowerCase();
  if (![".webp", ".jpg", ".jpeg", ".png"].includes(ext)) continue;

  const stat = await fs.stat(source);
  const image = sharp(source);
  const meta = await image.metadata();
  const width = Math.min(meta.width ?? MAX_WIDTH, MAX_WIDTH);
  const height = Math.round(((meta.height ?? 0) * width) / (meta.width ?? width));

  const stem = source.slice(0, -ext.length);
  const variants = { avif: [], webp: [] };

  for (const w of WIDTHS) {
    const target = Math.min(w, width);
    for (const [kind, opts] of [
      ["avif", { quality: 50, effort: 6 }],
      ["webp", { quality: 74 }],
    ]) {
      const out = `${stem}-${w}.${kind}`;
      const exists = await fs
        .stat(out)
        .then((s) => s.mtimeMs >= stat.mtimeMs)
        .catch(() => false);
      if (!exists) {
        await sharp(source)
          .resize({ width: target, withoutEnlargement: true })
          .toFormat(kind, opts)
          .toFile(out);
      }
      variants[kind].push({
        url: `/images/${path.relative(path.join(staticRoot, "images"), out).split(path.sep).join("/")}`,
        width: target,
      });
    }
  }

  manifest[ref] = { width, height, variants };
}

await fs.mkdir(path.dirname(manifestPath), { recursive: true });
await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`images: ${Object.keys(manifest).length} refs, ${WIDTHS.join("/")} variants ready`);
