import "@fontsource-variable/noto-sans-sc";
import "@fontsource-variable/noto-serif-sc";
import "./styles/global.css";

import { useEffect, useRef, useState } from "react";
import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";
import type { Route } from "./+types/root";

const SITE_URL = "https://heyiweiben.com";

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/images/brand/heyiweiben-icon-32.png", type: "image/png", sizes: "32x32" },
  { rel: "icon", href: "/images/brand/heyiweiben-icon-16.png", type: "image/png", sizes: "16x16" },
  { rel: "apple-touch-icon", href: "/images/brand/heyiweiben-icon-180.png", sizes: "180x180" },
  { rel: "manifest", href: "/site.webmanifest" },
  { rel: "alternate", href: "/index.xml", type: "application/rss+xml", title: "何以为本" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#F3F0E8" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function IndexPanel() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const location = useLocation();

  const closePanel = () => {
    setOpen(false);
    window.requestAnimationFrame(() => buttonRef.current?.focus());
  };

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const pageContent = document.querySelector<HTMLElement>(".site-content");
    const wordmark = document.querySelector<HTMLElement>(".wordmark");
    const panel = document.querySelector<HTMLElement>("#site-index");
    document.body.style.overflow = "hidden";
    pageContent?.setAttribute("inert", "");
    wordmark?.setAttribute("inert", "");
    firstLinkRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closePanel();
        return;
      }
      if (event.key === "Tab" && panel) {
        const links = Array.from(panel.querySelectorAll<HTMLElement>("a[href]"));
        const focusable = [buttonRef.current, ...links].filter((item): item is HTMLElement => Boolean(item));
        const first = focusable[0];
        const last = focusable.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      pageContent?.removeAttribute("inert");
      wordmark?.removeAttribute("inert");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        className="index-trigger"
        type="button"
        aria-expanded={open}
        aria-controls="site-index"
        onClick={() => setOpen((value) => !value)}
      >
        <span>{open ? "收起" : "索引"}</span>
        <span className="index-trigger__mark" aria-hidden="true" />
      </button>
      <div id="site-index" className="index-panel" data-open={open || undefined} aria-hidden={!open} role="dialog" aria-modal={open || undefined} aria-label="站点索引">
        <button className="index-panel__scrim" type="button" aria-label="关闭索引" onClick={closePanel} />
        <nav className="index-panel__body" aria-label="站点索引">
          <p className="index-panel__caption">何以为本 · 索引</p>
          <Link ref={firstLinkRef} to="/posts" className="index-panel__link">
            <span>文章</span><span>全部写作</span>
          </Link>
          <Link to="/about" className="index-panel__link">
            <span>关于</span><span>为什么写</span>
          </Link>
          <a href="mailto:heyiweiben@gmail.com" className="index-panel__link">
            <span>联系</span><span>来一封信</span>
          </a>
        </nav>
      </div>
    </>
  );
}

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link to="/" className="wordmark" aria-label="何以为本首页">何以为本</Link>
      <IndexPanel />
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>何以为本 Lab</p>
      <a href="mailto:heyiweiben@gmail.com">heyiweiben@gmail.com</a>
      <p>© {new Date().getFullYear()} 何以为本</p>
    </footer>
  );
}

export default function App() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <div className="site-content">
        <Outlet />
        <SiteFooter />
      </div>
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const message = isRouteErrorResponse(error) && error.status === 404 ? "这页不在山中。" : "页面暂时无法打开。";
  return (
    <main className="error-page">
      <p className="error-page__code">{isRouteErrorResponse(error) ? error.status : "错误"}</p>
      <h1>{message}</h1>
      <Link to="/">回到首页</Link>
    </main>
  );
}

export const handle = { siteUrl: SITE_URL };
