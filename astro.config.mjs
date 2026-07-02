// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  devToolbar: {
    enabled: false,
  },
  site: "https://mld-dev.com",
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
