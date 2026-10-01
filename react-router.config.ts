import type { Config } from "@react-router/dev/config";

export default {
  // Server-side render by default, then hydrate on the client.
  // Every marketing page needs to be crawlable, so this stays true.
  ssr: true,
} satisfies Config;
