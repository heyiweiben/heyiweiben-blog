# OpenClaw Daily Publishing Protocol

This repository is the Hugo blog for https://heyiweiben.com/.

Remote repository:

```text
https://github.com/heyiweiben/heyiweiben-blog.git
```

OpenClaw should publish by copying Markdown files into this repository. Do not replace `content/posts/` with a symlink to an external knowledge base, because GitHub and deployment environments may not have access to the symlink target.

## Inputs

OpenClaw may read the user's knowledge base from the path supplied in its own runtime context. The knowledge base should contain a `post` folder for human-written posts.

Human-written posts are publishable only when their front matter includes:

```yaml
title: "文章标题"
summary: "一句摘要"
category: "项目复盘"
status: ready
```

After successful publishing, OpenClaw should update the source knowledge-base file:

```yaml
status: published
published_at: YYYY-MM-DD
blog_url: https://heyiweiben.com/posts/<slug>/
```

## Blog Output Format

All published blog posts in this Hugo repository must use this front matter:

```yaml
---
title: "文章标题"
date: YYYY-MM-DD
draft: false
summary: "一句摘要"
categories: ["项目复盘"]
---
```

Use exactly one category per post.

Allowed categories:

- `AI 工具与实践`
- `技术折腾`
- `项目复盘`
- `创业观察`
- `生活札记`
- `AI札记`

## AI Notes Column

OpenClaw may generate one article per day for the category `AI札记`.

Rules:

- Generate at most one `AI札记` article for each date.
- Use filename format `YYYY-MM-DD-ai-notes.md`.
- Use `categories: ["AI札记"]`.
- Write 300-600 Chinese characters in the body.
- Answer one clear question.
- Keep the title concrete and easy to quote.
- Do not invent data, people, papers, news, company updates, or source citations.
- Do not chase unverified trending topics.
- End with one reusable judgment or takeaway.

## Publishing Flow

OpenClaw must follow this order:

1. Enter this blog repository.
2. Run `git status --short` and stop if there are unrelated local changes.
3. Run `git pull --ff-only origin main`.
4. Read publishable human-written posts from the knowledge base.
5. Generate today's `AI札记` post only if it does not already exist.
6. Copy or create Markdown files under `content/posts/`.
7. Run `python3 tools/validate_blog_posts.py` on macOS/Linux, or `python tools/validate_blog_posts.py` if the environment exposes Python as `python`.
8. Run `hugo --gc --minify`.
9. If validation or build fails, stop without commit or push.
10. Commit only the new/updated blog files.
11. Push to `origin main`.

Commit message conventions:

```text
Publish AI notes: YYYY-MM-DD
Publish post: <title>
```

If one run publishes both a human-written post and the daily AI column, use:

```text
Publish blog posts: YYYY-MM-DD
```

## Non-Goals

- Do not rewrite human-written posts unless the user explicitly asks.
- Do not publish files without `status: ready`.
- Do not publish `status: published` files again.
- Do not create more than one daily AI article for the same date.
- Do not push when Hugo build fails.
