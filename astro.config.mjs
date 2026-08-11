import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://wagecheck.co.uk',
	output: 'static',
	integrations: [sitemap()],
	vite: {
		plugins: [tailwindcss()],
	},
});
