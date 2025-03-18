import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import sanity from "@sanity/astro";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [
    sanity({
      projectId: "3do82whm",
      dataset: "next",
      useCdn: false,
    }),
    react(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
