import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const roots = new Map([
  ["qa/desktop", { width: 1672, height: 941 }],
  ["qa/ultrawide", { width: 2200, height: 1200 }],
  ["qa/mobile", { width: 390, height: 844 }],
]);

for (const [root, targetSize] of roots) {
  const entries = await fs.readdir(root, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".png")) continue;
    const target = path.join(root, entry.name);
    const source = await fs.readFile(target);
    const isPng = source.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    const metadata = await sharp(source).metadata();
    if (!metadata.width || !metadata.height) throw new Error(`cannot read dimensions: ${target}`);
    if (metadata.width > targetSize.width || metadata.height > targetSize.height) {
      throw new Error(`capture exceeds target viewport: ${target}`);
    }
    if (isPng && metadata.width === targetSize.width && metadata.height === targetSize.height) continue;
    const normalized = await sharp(source)
      .extend({
        right: targetSize.width - metadata.width,
        bottom: targetSize.height - metadata.height,
        background: "#f3f0e8",
      })
      .png({ compressionLevel: 9 })
      .toBuffer();
    await fs.writeFile(target, normalized);
  }
}

console.log("qa evidence normalized to PNG");
