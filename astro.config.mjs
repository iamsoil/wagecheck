import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://www.wagecheck.co.uk',
	trailingSlash: 'always',
	output: 'static',
	integrations: [
		sitemap({
			filter: (page) => !page.includes('/salary/') && !page.includes('/stamp-duty/'),
		}),
	],
	vite: {
		plugins: [tailwindcss()],
	},
});
