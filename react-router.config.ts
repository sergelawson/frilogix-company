import type { Config } from "@react-router/dev/config";
import { vercelPreset } from "@vercel/react-router/vite";
import { pages } from "./app/content/site";

export default {
  // Server-side render by default, then hydrate on the client.
  // Every marketing page needs to be crawlable, so this stays true.
  ssr: true,
  // Content only changes on deploy, so the pages are rendered to static HTML at
  // build time and Vercel's CDN serves them until the next deploy. The /contact
  // form action and the redirect routes still run as a server function.
  prerender: pages.map((page) => page.path),
  // Ship the whole (tiny) route manifest in the page instead of fetching
  // /__manifest from the server function as pages scroll into view, so moving
  // between pages never needs the server.
  routeDiscovery: { mode: "initial" },
  presets: [vercelPreset()],
} satisfies Config;
