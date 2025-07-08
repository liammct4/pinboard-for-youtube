import { defineConfig } from 'vite'
import { patchCssModules } from "vite-css-modules"
import react from '@vitejs/plugin-react'
import svgr from "vite-plugin-svgr"

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [patchCssModules({ exportMode: "both", generateSourceTypes: true }), react(), svgr()],
	css: {
		modules: {
			localsConvention: "camelCaseOnly",
		}
	},
	build: {
		target: 'esnext',
		minify: false,
	},
	resolve: {
		alias: {
			process: "process/browser",
			stream: "stream-browserify",
			zlib: "browserify-zlib",
			util: 'util',
			src: "/src"
		}
	},
})
