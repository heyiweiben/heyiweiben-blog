import { Link, useLocation, useParams } from "react-router";
import { ArchiveView } from "~/components/ArchiveView";
import { chronologicalPosts, uniqueTerms } from "~/content";
import type { Route } from "./+types/taxonomy";

function kindFromPath(pathname: string): "categories" | "tags" | "series" {
  if (pathname.startsWith("/tags")) return "tags";
  if (pathname.startsWith("/series")) return "series";
  return "categories";
}

export const meta: Route.MetaFunction = ({ params }) => {
  const term = decodeURIComponent(params.term ?? "");
  return [
    { title: term ? `${term}｜何以为本` : "索引｜何以为本" },
    { name: "description", content: term ? `何以为本中与“${term}”有关的公开文章。` : "何以为本内容索引。" },
  ];
};

export default function Taxonomy() {
  const kind = kindFromPath(useLocation().pathname);
  const term = decodeURIComponent(useParams().term ?? "");
  const posts = chronologicalPosts().filter((post) => post[kind].includes(term));
  const terms = uniqueTerms(kind);
  if (!posts.length) {
    return <main className="error-page"><h1>这个索引暂时没有公开文章。</h1><Link to="/posts/">返回全部文章</Link></main>;
  }
  return (
    <main className="archive-page">
      <div className="archive-page__haze" aria-hidden="true" />
      <header className="page-intro page-intro--archive">
        <h1>{term}</h1>
        <p>与这个词有关的公开文章。</p>
      </header>
      <nav className="term-filter" aria-label="切换索引">
        <Link to="/posts/">全部</Link>
        {terms.map((item) => (
          <Link key={item} to={`/${kind}/${encodeURIComponent(item)}/`} aria-current={item === term ? "page" : undefined}>{item}</Link>
        ))}
      </nav>
      <ArchiveView posts={posts} />
    </main>
  );
}
