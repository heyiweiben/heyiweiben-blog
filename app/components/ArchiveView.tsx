import { Link } from "react-router";
import { formatDate } from "~/content";
import type { Post } from "~/types";

export function ArchiveView({ posts }: { posts: Post[] }) {
  const years = [...new Set(posts.map((post) => post.date.slice(0, 4)))];
  return (
    <div className="archive-years">
      {years.map((year) => (
        <section className="archive-year" key={year} aria-labelledby={`year-${year}`}>
          <h2 id={`year-${year}`}>{year}</h2>
          <div className="archive-year__rows">
            {posts.filter((post) => post.date.startsWith(year)).map((post) => (
              <article className="archive-entry" key={post.slug}>
                <time dateTime={post.date}>{formatDate(post.date).replace(`${year}年`, "")}</time>
                <h3><Link to={`/posts/${post.slug}`}>{post.title}</Link></h3>
                <p>{post.categories[0] ?? "随笔"}</p>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
