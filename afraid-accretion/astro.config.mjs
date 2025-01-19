// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'PubKey',
			logo: {
				light: './src/assets/branding/logo.svg',
				dark: './src/assets/branding/logo-white-txt.svg',
				replacesTitle: true,
			},
			social: {
				twitter: 'https://x.com/PubKeyApp',
				github: 'https://github.com/pubkeyapp',
				discord: 'https://t.co/3IslASU5ak',
			},
			sidebar: [
				{
					label: 'Guides',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Self-Hosting', slug: 'guides/self-hosting' },
						{ label: 'Pricing', slug: 'guides/pricing' },
						{ label: 'Features', slug: 'guides/features' },
					],
				},
				// {
				// 	label: 'Reference',
				// 	autogenerate: { directory: 'reference' },
				// },
			],
		}),
	],
});
