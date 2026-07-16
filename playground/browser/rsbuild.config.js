// @ts-check
import { defineConfig } from "@rsbuild/core";
import { pluginSass } from "@rsbuild/plugin-sass";

import { join } from "node:path";

// Docs: https://rsbuild.rs/config/
export default defineConfig({
  root: join(__dirname, "pages"),
  source: {
    entry: {
      main: "./main.js",
      best: "./best/index.js",
      codec: "./codec/index.js",
    },
    preEntry: join(__dirname, "./styles/global.scss"),
  },
  html: {
    template({ entryName }) {
      return (
        {
          main: "./index.html",
          best: "./best/index.html",
          codec: "./codec/index.html",
        }[entryName] || "./index.html"
      );
    },
  },
  plugins: [pluginSass()],
});
