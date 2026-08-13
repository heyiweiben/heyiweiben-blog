import manifest from "./generated/content.json";
import type { ContentManifest, Post } from "./types";

export const content = manifest as ContentManifest;

export function publishedPosts(): Post[] {
  return [...content.posts].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.date.localeCompare(a.date);
  });
}

export function chronologicalPosts(): Post[] {
  return [...content.posts].sort((a, b) => b.date.localeCompare(a.date));
}

export function findPost(slug: string): Post | undefined {
  return content.posts.find((post) => post.slug === slug);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Shanghai",
  }).format(new Date(`${date}T00:00:00+08:00`));
}

export function uniqueTerms(key: "categories" | "tags" | "series"): string[] {
  return [...new Set(content.posts.flatMap((post) => post[key]))].sort((a, b) =>
    a.localeCompare(b, "zh-CN"),
  );
}
