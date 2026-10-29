// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import vercel from "@astrojs/vercel";
import remix from "astro-remix";

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [remix()],

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: vercel(),
});
