import { Link } from "react-router";
import { formatDate } from "~/content";
import type { Post } from "~/types";

export function ArticleList({ posts, compact = false }: { posts: Post[]; compact?: boolean }) {
  return (
    <div className={compact ? "article-list article-list--compact" : "article-list"}>
      {posts.map((post, index) => (
        <article className={index === 0 ? "article-row article-row--featured" : "article-row"} key={post.slug}>
          <p className="article-row__date">{formatDate(post.date)}</p>
          <div className="article-row__body">
            <h2><Link to={`/posts/${post.slug}`}>{post.title}</Link></h2>
            {!compact && index === 0 && <p>{post.summary}</p>}
          </div>
        </article>
      ))}
    </div>
  );
}
