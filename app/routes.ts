import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("posts", "routes/archive.tsx"),
  route("posts/:slug", "routes/article.tsx"),
  route("about", "routes/about.tsx"),
  route("categories", "routes/taxonomy-index.tsx", { id: "categories-index" }),
  route("categories/:term", "routes/taxonomy.tsx", { id: "category" }),
  route("tags", "routes/taxonomy-index.tsx", { id: "tags-index" }),
  route("tags/:term", "routes/taxonomy.tsx", { id: "tag" }),
  route("series", "routes/taxonomy-index.tsx", { id: "series-index" }),
  route("series/:term", "routes/taxonomy.tsx", { id: "series" }),
  route("404", "routes/not-found.tsx", { id: "not-found-static" }),
  route("*", "routes/not-found.tsx", { id: "not-found-catchall" }),
] satisfies RouteConfig;
