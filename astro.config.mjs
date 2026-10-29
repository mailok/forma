// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import node from "@astrojs/node";
import remix from "astro-remix";

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [remix()],

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: node({
    mode: "standalone",
  }),
});
