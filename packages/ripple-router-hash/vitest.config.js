import { mergeConfig, configDefaults, defineConfig } from 'vitest/config';
import viteConfig from './vite.config';
import { ripple } from 'vite-plugin-ripple';
import path from 'node:path';

export default defineConfig({
	plugins: [ripple({})],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
		extensions: ["js"]
	},
	test: {
		include: ['tests/*.test.ripple'],
		environment: 'jsdom',
		...configDefaults.test,
	},
	build: {
		rollupOptions: {
			external: ['virtual:ripple-routes'],
		},
	},
});
