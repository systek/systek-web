import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import sanity from "@sanity/astro";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [
    sanity({
      projectId: "s9j0sgbs",
      dataset: "production",
      useCdn: false,
    }),
    react(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
