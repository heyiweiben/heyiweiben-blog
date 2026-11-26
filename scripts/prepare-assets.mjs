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
  const sourceStat = await fs.stat(source);
  const targets = [
    {
      path: path.join(outputDir, `${name}.webp`),
      build: () => sharp(source).webp({ quality: name === "paper-grain" ? 72 : 84, effort: 5 }),
    },
    {
      path: path.join(outputDir, `${name}-840.webp`),
      build: () => sharp(source).resize({ width: 840, withoutEnlargement: true }).webp({ quality: 76, effort: 6 }),
    },
  ];

  if (["hero-far", "hero-mid", "hero-near"].includes(name)) {
    targets.push(
      {
        path: path.join(outputDir, `${name}-840.avif`),
        build: () => sharp(source).resize({ width: 840, withoutEnlargement: true }).avif({ quality: 48, effort: 6 }),
      },
      {
        path: path.join(outputDir, `${name}-1672.avif`),
        build: () => sharp(source).resize({ width: 1672, withoutEnlargement: true }).avif({ quality: 48, effort: 6 }),
      },
    );
  }

  for (const target of targets) {
    const targetStat = await fs.stat(target.path).catch(() => null);
    if (targetStat && targetStat.mtimeMs >= sourceStat.mtimeMs) continue;
    await target.build().toFile(target.path);
    console.log(`asset: ${path.basename(target.path)}`);
  }
}
