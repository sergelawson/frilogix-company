import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  // One-page site: routes/site.tsx renders every page as a section. The child
  // routes keep their own URLs and meta; site.tsx scrolls to the matching one.
  // Order and paths mirror `pages` in app/content/site.ts.
  layout("routes/site.tsx", [
    index("routes/home.tsx"),
    route("services", "routes/services.tsx"),
    route("work", "routes/work.tsx"),
    route("about", "routes/about.tsx"),
    route("contact", "routes/contact.tsx"),
  ]),
  // Redirects for renamed or merged pages.
  route("ai-engineering", "routes/ai-engineering.tsx"),
  route("case-studies", "routes/case-studies.tsx"),
] satisfies RouteConfig;
