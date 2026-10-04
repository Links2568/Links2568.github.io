// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://lzclink.com",
  integrations: [
    // password-protected pages stay out of the sitemap (they are also noindex)
    sitemap({ filter: (page) => !page.includes("/projects/mystery-ai-privacy/") }),
  ],
  build: {
    // Inline all CSS into the HTML: GitHub Pages caches HTML for 10 min
    // while deploys delete old hashed assets, so external hashed CSS can
    // 404 right after a deploy. Inlined CSS cannot go stale separately.
    inlineStylesheets: "always",
  },
});
