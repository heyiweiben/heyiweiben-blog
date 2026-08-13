import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";

const root = process.cwd();
const postsDir = path.join(root, "content", "posts");
const output = path.join(root, "app", "generated", "content.json");

function nodeText(node) {
  if (node.type === "text") return node.value;
  if (!Array.isArray(node.children)) return "";
  return node.children.map(nodeText).join("");
}

function collectHeadings() {
  return (tree, file) => {
    const headings = [];

    function visit(node) {
      if (
        node.type === "element"
        && (node.tagName === "h2" || node.tagName === "h3")
        && typeof node.properties?.id === "string"
      ) {
        headings.push({
          depth: Number(node.tagName.slice(1)),
          id: node.properties.id,
          text: nodeText(node).trim(),
        });
      }
      if (Array.isArray(node.children)) node.children.forEach(visit);
    }

    visit(tree);
    file.data.headings = headings;
  };
}

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeSlug)
  .use(collectHeadings)
  .use(rehypeStringify);

function list(value) {
  if (!value) return [];
  return Array.isArray(value) ? value.map(String) : [String(value)];
}

function dateOnly(value) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value ?? "").slice(0, 10);
}

function plain(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[>*_~|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function wordCount(text) {
  const han = text.match(/[\p{Script=Han}]/gu)?.length ?? 0;
  const words = text.replace(/[\p{Script=Han}]/gu, " ").match(/[\p{L}\p{N}]+/gu)?.length ?? 0;
  return han + words;
}

async function render(markdown) {
  const result = await processor.process(markdown);
  return {
    html: String(result),
    headings: result.data.headings ?? [],
  };
}

async function readPost(file) {
  const source = await fs.readFile(path.join(postsDir, file), "utf8");
  const parsed = matter(source);
  if (parsed.data.draft === true || file === "_index.md") return null;
  const plainText = plain(parsed.content);
  const leadBlock = parsed.content
    .split(/\r?\n\s*\r?\n/)
    .find((block) => block.trim() && !/^\s*#{1,6}\s/.test(block) && !/^\s*[-*+]\s/.test(block));
  const fallbackSlug = path.basename(file, path.extname(file));
  const rendered = await render(parsed.content);
  const html = rendered.html;
  return {
    title: String(parsed.data.title ?? fallbackSlug),
    date: dateOnly(parsed.data.date),
    draft: false,
    summary: String(parsed.data.summary ?? plainText.slice(0, 120)),
    slug: String(parsed.data.slug ?? fallbackSlug),
    aliases: list(parsed.data.aliases),
    pinned: parsed.data.pinned === true,
    categories: list(parsed.data.categories),
    tags: list(parsed.data.tags),
    series: list(parsed.data.series),
    html,
    bodyHtml: html.replace(/^<p>[\s\S]*?<\/p>\s*/, ""),
    headings: rendered.headings,
    plainText,
    lead: plain(leadBlock ?? parsed.data.summary ?? ""),
    wordCount: wordCount(plainText),
  };
}

const files = (await fs.readdir(postsDir)).filter((file) => file.endsWith(".md"));
const posts = (await Promise.all(files.map(readPost))).filter(Boolean);
posts.sort((a, b) => b.date.localeCompare(a.date));

const aboutSource = await fs.readFile(path.join(root, "content", "about.md"), "utf8");
const aboutParsed = matter(aboutSource);
const aboutText = plain(aboutParsed.content);
const about = {
  title: String(aboutParsed.data.title ?? "关于"),
  html: (await render(aboutParsed.content)).html,
  plainText: aboutText,
};

await fs.mkdir(path.dirname(output), { recursive: true });
await fs.writeFile(output, `${JSON.stringify({ generatedAt: new Date().toISOString(), posts, about }, null, 2)}\n`, "utf8");
console.log(`content: ${posts.length} published posts, ${files.length - posts.length - 1} drafts excluded`);
