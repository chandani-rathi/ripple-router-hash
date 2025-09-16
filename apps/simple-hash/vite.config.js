import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { ripple } from 'vite-plugin-ripple';
import path from 'path';
import rippleRoutesPlugin from "vite-plugin-ripple-router-hash";

export default defineConfig({
	base: './',
	plugins: [ripple(), tailwindcss(), rippleRoutesPlugin({ pagesDir: "src/pages" })],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	optimizeDeps: {
		exclude: ['virtual:ripple-routes'], 
	},
	server: {
		port: 3000,
	},
	build: {
		target: 'esnext',
	},
});
