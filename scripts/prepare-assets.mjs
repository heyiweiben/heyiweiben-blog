import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const sourceDir = path.resolve("static/images/landscape");
const outputDir = path.join(sourceDir, "web");
await fs.mkdir(outputDir, { recursive: true });

const names = [
  "hero-static", "hero-sky", "hero-far", "hero-mid", "hero-near",
  "writing-haze", "archive-haze", "article-heading-haze", "about-valley", "paper-grain",
];

for (const name of names) {
  const source = path.join(sourceDir, `${name}.png`);
  const target = path.join(outputDir, `${name}.webp`);
  const [sourceStat, targetStat] = await Promise.all([
    fs.stat(source),
    fs.stat(target).catch(() => null),
  ]);
  if (targetStat && targetStat.mtimeMs >= sourceStat.mtimeMs) continue;
  await sharp(source).webp({ quality: name === "paper-grain" ? 72 : 84, effort: 5 }).toFile(target);
  console.log(`asset: ${name}.webp`);
}
