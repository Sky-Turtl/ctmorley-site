import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { copyFileSync } from "node:fs";
import { resolve } from "node:path";

// GitHub Pages is a static host with no SPA rewrite. Serving a copy of
// index.html as 404.html lets deep links like /products boot
// the app instead of returning a hard 404.
function spaFallback() {
  let outDir;
  return {
    name: "spa-404-fallback",
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      copyFileSync(
        resolve(outDir, "index.html"),
        resolve(outDir, "404.html")
      );
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), spaFallback()],
  base: "/",
});
