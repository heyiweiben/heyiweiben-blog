import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import type { Post } from "~/types";

type ArticleTocProps = {
  headings: Post["headings"];
};

export function ArticleToc({ headings = [] }: ArticleTocProps) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? "");

  useEffect(() => {
    if (!headings.length) return undefined;

    const hashId = decodeURIComponent(window.location.hash.slice(1));
    if (headings.some((heading) => heading.id === hashId)) setActiveId(hashId);

    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => Boolean(element));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-18% 0px -68% 0px", threshold: [0, 1] },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [headings]);

  if (!headings.length) return null;

  function goToHeading(event: MouseEvent<HTMLAnchorElement>, id: string) {
    event.preventDefault();
    setActiveId(id);
    event.currentTarget.closest("details")?.removeAttribute("open");
    window.history.pushState(null, "", `#${id}`);
    document.getElementById(id)?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    });
  }

  const renderLinks = () => headings.map((heading) => (
    <li className={`article-toc__item article-toc__item--level-${heading.depth}`} key={heading.id}>
      <a
        aria-current={activeId === heading.id ? "location" : undefined}
        href={`#${heading.id}`}
        onClick={(event) => goToHeading(event, heading.id)}
      >
        {heading.text}
      </a>
    </li>
  ));

  return (
    <>
      <nav className="article-toc" aria-label="本文目录">
        <p className="article-toc__label">目录</p>
        <ol>{renderLinks()}</ol>
      </nav>
      <details className="article-toc-mobile">
        <summary>本文目录</summary>
        <nav aria-label="本文目录">
          <ol>{renderLinks()}</ol>
        </nav>
      </details>
    </>
  );
}
