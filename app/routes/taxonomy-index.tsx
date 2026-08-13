import { Link, useLocation } from "react-router";
import { uniqueTerms } from "~/content";
import type { Route } from "./+types/taxonomy-index";

export const meta: Route.MetaFunction = () => [{ title: "内容索引｜何以为本" }];

export default function TaxonomyIndex() {
  const root = useLocation().pathname.split("/").filter(Boolean)[0] as "categories" | "tags" | "series";
  const labels = { categories: "分类", tags: "标签", series: "系列" };
  const terms = uniqueTerms(root);
  return (
    <main className="term-index-page">
      <header className="page-intro">
        <h1>{labels[root]}</h1>
        <p>轻量索引，不打断按时间阅读。</p>
      </header>
      {terms.length ? (
        <ul className="term-index-list">
          {terms.map((term) => <li key={term}><Link to={`/${root}/${encodeURIComponent(term)}`}>{term}</Link></li>)}
        </ul>
      ) : <p className="empty-state">这里暂时没有公开内容。</p>}
    </main>
  );
}
