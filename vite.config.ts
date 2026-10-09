import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  // Bundle gsap into the server build: its `gsap/ScrollTrigger` entry isn't
  // importable by name from plain Node ESM, which crashed Vercel's function.
  ssr: { noExternal: ["gsap"] },
  // three.js (~570 kB, in the lazy chunk shared by app/components/art/scenes)
  // is the one large chunk; it loads only near a 3D drawing. Anything else
  // this big should warn.
  build: { chunkSizeWarningLimit: 600 },
});
