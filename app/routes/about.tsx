import { content } from "~/content";
import type { Route } from "./+types/about";

export const meta: Route.MetaFunction = () => [
  { title: "关于｜何以为本" },
  { name: "description", content: "关于何以为本，以及这里长期记录的内容。" },
  { tagName: "link", rel: "canonical", href: "https://heyiweiben.com/about/" },
];

export default function About() {
  return (
    <main className="about-page">
      <div className="about-page__landscape" aria-hidden="true" />
      <header className="page-intro page-intro--about">
        <h1>关于</h1>
      </header>
      <article className="prose prose--about" dangerouslySetInnerHTML={{ __html: content.about.html }} />
    </main>
  );
}
