import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  // One-page site: routes/site.tsx renders every page as a section. The child
  // routes keep their own URLs and meta; site.tsx scrolls to the matching one.
  layout("routes/site.tsx", [
    index("routes/home.tsx"),
    route("services", "routes/services.tsx"),
    route("about", "routes/about.tsx"),
    route("case-studies", "routes/case-studies.tsx"),
    route("contact", "routes/contact.tsx"),
  ]),
  route("ai-engineering", "routes/ai-engineering.tsx"),
] satisfies RouteConfig;
