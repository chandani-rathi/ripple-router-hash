import { configDefaults, defineConfig } from 'vitest/config';
import { ripple } from 'vite-plugin-ripple';

export default defineConfig({
	plugins: [ripple()],
	test: {
		include: [
			'packages/ripple-router-hash/tests/*.test.ripple',
		],
		environment: 'jsdom',
		...configDefaults.test,
	},
});
