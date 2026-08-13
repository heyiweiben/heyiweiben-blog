import { Link } from "react-router";
import { ArticleList } from "~/components/ArticleList";
import { HeroLandscape } from "~/components/HeroLandscape";
import { publishedPosts } from "~/content";
import type { Route } from "./+types/home";

export const meta: Route.MetaFunction = () => [
  { title: "何以为本｜问题之下" },
  { name: "description", content: "在技术、商业与生活之间。何以为本的个人写作与长期思考。" },
  { property: "og:title", content: "何以为本｜问题之下" },
  { property: "og:description", content: "在技术、商业与生活之间。" },
  { property: "og:image", content: "https://heyiweiben.com/images/share/heyiweiben-default.png" },
  { property: "og:type", content: "website" },
  { tagName: "link", rel: "canonical", href: "https://heyiweiben.com/" },
];

export default function Home() {
  const posts = publishedPosts().slice(0, 3);
  return (
    <main className="home-main">
      <HeroLandscape />
      <section id="writing" className="home-writing" aria-labelledby="writing-title">
        <div className="home-writing__haze" aria-hidden="true" />
        <div className="home-writing__heading">
          <h2 id="writing-title">精选</h2>
        </div>
        <ArticleList posts={posts} />
        <Link className="text-link" to="/posts/">查看全部文章<span aria-hidden="true" /></Link>
      </section>
    </main>
  );
}
