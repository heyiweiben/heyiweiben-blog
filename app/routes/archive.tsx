import { Link } from "react-router";
import { ArchiveView } from "~/components/ArchiveView";
import { chronologicalPosts, uniqueTerms } from "~/content";
import type { Route } from "./+types/archive";

export const meta: Route.MetaFunction = () => [
  { title: "文章｜何以为本" },
  { name: "description", content: "按时间浏览何以为本的全部公开文章。" },
  { tagName: "link", rel: "canonical", href: "https://heyiweiben.com/posts/" },
];

export default function Archive() {
  const posts = chronologicalPosts();
  const categories = uniqueTerms("categories");
  return (
    <main className="archive-page">
      <div className="archive-page__haze" aria-hidden="true" />
      <header className="page-intro page-intro--archive">
        <h1>文章</h1>
        <p>按时间，回到问题发生的地方。</p>
      </header>
      <nav className="term-filter" aria-label="按分类查看">
        <Link to="/posts/" aria-current="page">全部</Link>
        {categories.map((category) => (
          <Link key={category} to={`/categories/${encodeURIComponent(category)}/`}>{category}</Link>
        ))}
      </nav>
      <ArchiveView posts={posts} />
    </main>
  );
}
