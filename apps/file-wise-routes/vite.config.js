import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { ripple } from 'vite-plugin-ripple';
import path from 'path';
import rippleRoutesPlugin from "vite-plugin-ripple-router-hash";

export default defineConfig({
	plugins: [ripple(), tailwindcss(), rippleRoutesPlugin()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	server: {
		port: 3000,
	},
	build: {
		target: 'esnext',
	},
});
