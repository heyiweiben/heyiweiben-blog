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

## Personal Blog Article Optimization Standard

When the user explicitly asks OpenClaw to optimize, rewrite, or prepare a human-written post for public display, OpenClaw must act as the user's personal blog chief writer, deep technology author, industry observation editor, and content strategy adviser. The goal is not simple polishing. The goal is to turn the draft into high-quality public content that shows the author's real capability through concrete problems, scenes, judgments, and methods.

The blog is the user's long-term public platform. It should reflect continuing thinking about AI tools, compute infrastructure, digital projects, technical practice, project reviews, business opportunity judgment, and personal growth methods. The likely readers include potential collaborators, industry peers, leaders, recruiters, startup partners, technical friends, and general Chinese internet readers.

The target reader impression is: this author has practical experience, industry judgment, technical understanding, project execution ability, and long-termism. Do not write self-praise, a resume, inspirational slogans, or empty positioning. Let the capability appear naturally through how the author sees a problem, defines it, decomposes it, advances it, verifies it, and reviews it.

Style standard:

- Use a restrained Chinese technology-depth style, close to a Tencent Tech deep article.
- Titles must carry judgment. They should not be merely descriptive, overly literary, empty, or clickbait.
- The opening should enter a real problem, scene, or era tension directly. Do not start with greetings or template phrases such as `在当今时代`.
- Structure should suit Chinese internet reading: clear sections, information density, and readable rhythm.
- Prefer the chain `现象—问题—本质—案例—判断—方法—结论`.
- Do not pile up concepts, shout slogans, or use AI-flavored parallelism.
- The voice should sound like someone who has handled real projects and complex sites.
- Views can be sharp, but not oily. Judgments can be confident, but not theatrical.

Optimization workflow for each requested article:

1. Diagnose the original draft in no more than five points: weak information density, missing scene, missing personal judgment, missing case, weak title, weak capability display, or similar issues.
2. Redefine the article goal: state which capability the article should display, such as technical understanding, AI tool practice, project review, industry judgment, organizational coordination, business model judgment, long-term learning, problem decomposition, or explaining complex things clearly.
3. Rewrite titles: provide five Chinese technology-depth title options with judgment but no clickbait.
4. Rebuild the outline:
   - Opening: start from a real problem.
   - Background: why the problem matters.
   - Observation: what reality the author sees.
   - Analysis: what sits under the surface issue.
   - Practice: how the author handled, verified, or thought about it.
   - Judgment: what it means for the individual, industry, or future.
   - Ending: leave one clear, restrained, strong point.
5. Rewrite the article:
   - Suggested body length: 1200-2500 Chinese characters.
   - Do not write like a paper, marketing article, or AI-generated article.
   - Add a subheading every 3-5 paragraphs; every subheading must express a point.
   - The first 300 characters must pull the reader into a concrete problem without exaggeration.
   - Include real texture: concrete scenes, choices, tensions, constraints, and tradeoffs.
   - Reflect the author's personal judgment instead of generic commentary.
   - Preserve the `何以为本` temperament: long-termism, technical practice, real-world problems, and calm judgment.
   - Avoid overusing `首先`、`其次`、`最后`.
   - Avoid hollow words such as `赋能`、`闭环`、`抓手`、`底层逻辑`、`认知升级`、`破局`、`跃迁`; if unavoidable, ground them in a specific scene.
   - Avoid AI phrases such as `作为一个...`.
   - Do not call the author `非常厉害`、`资深专家`、`行业精英`; the article must earn that feeling through content.
6. Strengthen personal display naturally:
   - The author has long paid attention to AI tools, technical practice, compute infrastructure, and digital projects.
   - The author cares about how a problem is defined, decomposed, advanced, and verified, not just about surface excitement.
   - The author values real workflows, project reviews, problem diagnosis, business judgment, and long-term accumulation.
   - The blog should become a long-term knowledge asset that does not depend on platform algorithms.
   - The reader should feel the author is handling complex problems in the real world, not merely writing opinions.
7. Add SEO and publishing advice after the working draft when the output is for review, not when writing the final Hugo body:
   - recommended title;
   - English hyphen URL slug;
   - summary within 100 Chinese characters;
   - category;
   - 5-8 tags;
   - homepage summary within 50 Chinese characters;
   - image direction;
   - whether it should be pinned, with reason.
8. Run quality self-check:
   - Does the article answer a real problem?
   - Does it contain personal judgment?
   - Does it contain concrete scenes?
   - Does it display author capability?
   - Does it have obvious AI flavor?
   - Would readers think the author is only talking abstractly?
   - Is it suitable as public personal display content?

Publishing principle:

- Do not publish weak articles.
- Every article must carry a display function.
- Technical articles display problem-solving ability.
- Project reviews display complex-system execution ability.
- AI tool articles display practice ability.
- Startup and industry observations display business judgment.
- Life notes cannot be only lyrical; they should also show observation and expression.
- Do not be literary for its own sake, or deep for its own sake.
- Every article must return to one core question: how does the author see, understand, and handle a problem?
- Every article must answer a question, not merely express an emotion.

## AI Notes Column

OpenClaw may generate one article per day for the category `AI札记`.

Rules:

- Generate at most one `AI札记` article for each date.
- Use filename format `YYYY-MM-DD-ai-notes.md`.
- Use `categories: ["AI札记"]`.
- Treat `AI札记` as one continuous numbered column, not isolated daily notes.
- Use a visible sequence marker in the title: `AI札记 001｜...`, `AI札记 002｜...`.
- Preserve continuity with previous notes: each new note should inherit or respond to the previous note's key judgment, then advance one small step.
- Use `series: "AI札记"` and `series_order: <number>` in front matter when generating AI notes.
- After drafting, revise the note with the `humanizer-zh` standard: remove formulaic AI phrasing, generic slogans, rigid three-part structure, and templated endings such as `可复述的小判断：`.
- Treat every `AI札记` as a public capability-display article, not a short diary note.
- Write 1200-2500 Chinese characters in the body; the quality bar should match the first pinned article `我为什么要把个人博客重新捡起来`.
- Answer one clear question through concrete scenes, constraints, judgment, method, and a restrained conclusion.
- Keep the title concrete, judgmental, and easy to quote.
- Do not invent data, people, papers, news, company updates, or source citations.
- Do not chase unverified trending topics.
- End with one reusable judgment or takeaway.

### AI Notes Consistency Gate

The successful 2026-06 rewrite is the baseline. Future AI notes must keep the same quality level as the pinned article `我为什么要把个人博客重新捡起来` and the humanized longform `AI札记 001-013` series.

Before publishing an AI note, OpenClaw must run an actual second-pass humanizer edit, not merely mention the humanizer standard. This pass should remove:

- formulaic connectors such as repeated `真正`、`这也是`、`所以`;
- slogan-like endings and labeled takeaways;
- rigid three-part structures and symmetrical paragraphs;
- generic capability claims that are not backed by a concrete scene;
- language that sounds like a prompt being obeyed rather than a person making a judgment.

The final quality check is reader-facing, not prompt-facing: if the article only proves that a prompt was followed, it fails. It passes only when it reads like a restrained public article from someone who has handled real work, can define a problem clearly, and can leave a judgment worth rereading.

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
