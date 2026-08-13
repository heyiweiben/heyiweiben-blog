import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const manifest = JSON.parse(await fs.readFile("app/generated/content.json", "utf8"));
const postFiles = (await fs.readdir("content/posts")).filter((file) => file.endsWith(".md") && file !== "_index.md");
const expected = new Set();

for (const file of postFiles) {
  const source = await fs.readFile(path.join("content/posts", file), "utf8");
  const parsed = matter(source);
  if (parsed.data.draft === true) continue;
  expected.add(String(parsed.data.slug ?? path.basename(file, path.extname(file))));
}

if (manifest.posts.length !== expected.size) {
  throw new Error(`expected ${expected.size} public posts, found ${manifest.posts.length}`);
}
for (const post of manifest.posts) {
  if (!expected.has(post.slug)) throw new Error(`unexpected public post: ${post.slug}`);
  if (post.draft !== false) throw new Error(`draft leaked: ${post.slug}`);
  if (!post.html || !post.title || !post.date) throw new Error(`incomplete post: ${post.slug}`);
  if (!Array.isArray(post.headings)) throw new Error(`headings missing: ${post.slug}`);
  for (const heading of post.headings) {
    if (![2, 3].includes(heading.depth) || !heading.id || !heading.text) {
      throw new Error(`invalid heading entry: ${post.slug}`);
    }
    if (!post.bodyHtml.includes(`<h${heading.depth} id="${heading.id}">`)) {
      throw new Error(`heading anchor missing from HTML: ${post.slug}#${heading.id}`);
    }
  }
}
for (const slug of expected) {
  if (!manifest.posts.some((post) => post.slug === slug)) throw new Error(`missing public post: ${slug}`);
}
console.log(`content test: ${expected.size} published posts present; drafts excluded`);
