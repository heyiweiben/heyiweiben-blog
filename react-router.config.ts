import fs from "node:fs";
import path from "node:path";
import type { Config } from "@react-router/dev/config";

type Manifest = {
  posts: Array<{ slug: string; categories: string[]; tags: string[]; series: string[] }>;
};

function loadManifest(): Manifest {
  const target = path.resolve("app/generated/content.json");
  if (!fs.existsSync(target)) return { posts: [] };
  return JSON.parse(fs.readFileSync(target, "utf8")) as Manifest;
}

const manifest = loadManifest();
const paths = new Set(["/", "/posts", "/about", "/categories", "/tags", "/series", "/404"]);

for (const post of manifest.posts) paths.add(`/posts/${post.slug}`);
for (const term of new Set(manifest.posts.flatMap((post) => post.categories))) {
  paths.add(`/categories/${encodeURIComponent(term)}`);
}
for (const term of new Set(manifest.posts.flatMap((post) => post.tags))) {
  paths.add(`/tags/${encodeURIComponent(term)}`);
}
for (const term of new Set(manifest.posts.flatMap((post) => post.series))) {
  paths.add(`/series/${encodeURIComponent(term)}`);
}

export default {
  ssr: true,
  prerender: [...paths],
} satisfies Config;
