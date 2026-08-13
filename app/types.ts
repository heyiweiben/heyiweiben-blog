export type Post = {
  title: string;
  date: string;
  draft: false;
  summary: string;
  slug: string;
  aliases: string[];
  pinned: boolean;
  categories: string[];
  tags: string[];
  series: string[];
  html: string;
  bodyHtml: string;
  headings: Array<{
    depth: 2 | 3;
    id: string;
    text: string;
  }>;
  plainText: string;
  lead: string;
  wordCount: number;
};

export type Page = {
  title: string;
  html: string;
  plainText: string;
};

export type ContentManifest = {
  generatedAt: string;
  posts: Post[];
  about: Page;
};
