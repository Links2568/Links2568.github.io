// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://lzclink.com",
  // the password-protected transcript is shared by link only
  integrations: [sitemap({ filter: (page) => !page.includes("/j4bf9ck3n3") })],
  redirects: {
    // the page's address while it was password-protected; it went out in emails
    "/projects/mystery-ai-privacy": "/projects/veillens/",
  },
  build: {
    // Inline all CSS into the HTML: GitHub Pages caches HTML for 10 min
    // while deploys delete old hashed assets, so external hashed CSS can
    // 404 right after a deploy. Inlined CSS cannot go stale separately.
    inlineStylesheets: "always",
  },
});
