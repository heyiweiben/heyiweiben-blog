import { Link, useParams } from "react-router";
import { ArticleToc } from "~/components/ArticleToc";
import { findPost, formatDate } from "~/content";
import type { Route } from "./+types/article";

export const meta: Route.MetaFunction = ({ params }) => {
  const post = findPost(params.slug ?? "");
  if (!post) return [{ title: "文章未找到｜何以为本" }];
  const url = `https://heyiweiben.com/posts/${post.slug}/`;
  return [
    { title: `${post.title}｜何以为本` },
    { name: "description", content: post.summary },
    { property: "og:title", content: post.title },
    { property: "og:description", content: post.summary },
    { property: "og:type", content: "article" },
    { property: "og:url", content: url },
    { property: "og:image", content: "https://heyiweiben.com/images/share/heyiweiben-default.png" },
    { property: "article:published_time", content: post.date },
    { tagName: "link", rel: "canonical", href: url },
  ];
};

export default function Article() {
  const post = findPost(useParams().slug ?? "");
  if (!post) {
    return <main className="error-page"><h1>这篇文章没有公开。</h1><Link to="/posts">返回全部文章</Link></main>;
  }
  const headings = post.headings ?? [];
  return (
    <main className="article-page">
      <header className="article-hero">
        <div className="article-hero__haze" aria-hidden="true" />
        <div className="article-hero__inner">
          <p className="article-hero__meta">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span>{post.wordCount} 字</span>
          </p>
          <h1>{post.title}</h1>
          <p className="article-hero__summary">{post.lead}</p>
        </div>
      </header>
      <div className={headings.length ? "article-reading" : "article-reading article-reading--without-toc"}>
        <ArticleToc headings={headings} />
        <article className="prose" dangerouslySetInnerHTML={{ __html: post.bodyHtml }} />
      </div>
      <nav className="article-close" aria-label="文章结束">
        <p>写于问题之下。</p>
        <Link to="/posts">返回全部文章</Link>
      </nav>
    </main>
  );
}
