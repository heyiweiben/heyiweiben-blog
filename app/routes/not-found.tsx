import { Link } from "react-router";
import type { Route } from "./+types/not-found";

export const meta: Route.MetaFunction = () => [{ title: "未找到｜何以为本" }];

export default function NotFound() {
  return (
    <main className="error-page">
      <p className="error-page__code">404</p>
      <h1>这页不在山中。</h1>
      <p>也许它被移动了，或者从未公开。</p>
      <Link to="/">回到首页</Link>
    </main>
  );
}
