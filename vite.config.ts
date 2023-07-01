import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	build: {
		target: 'esnext'
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
