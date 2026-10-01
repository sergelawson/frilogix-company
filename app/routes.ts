import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("services", "routes/services.tsx"),
  route("ai-engineering", "routes/ai-engineering.tsx"),
  route("about", "routes/about.tsx"),
  route("case-studies", "routes/case-studies.tsx"),
  route("contact", "routes/contact.tsx"),
] satisfies RouteConfig;
