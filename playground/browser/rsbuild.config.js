// @ts-check
import { defineConfig } from "@rsbuild/core";
import { pluginSass } from '@rsbuild/plugin-sass';

// Docs: https://rsbuild.rs/config/
export default defineConfig({
  source: {
		entry: {
			"main": "./main.js",
			"best": "./pages/best/index.js",
			"codec": "./pages/codec/index.js"
		}
	},
	html: {
		template({ entryName }) {
			return ({
				"main": "./index.html",
				"best": "./pages/best/index.html",
				"codec": "./pages/codec/index.html"
			})[entryName] || "./index.html"
		}
	},
	plugins: [
		pluginSass()
	]
});
