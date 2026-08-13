import fs from "node:fs/promises";

await fs.rm("build", { recursive: true, force: true });
