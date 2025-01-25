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

					label: 'Self-Hosting',
					items: [
						{ label: 'Get Started', slug: 'self-hosting/start'},
						{ label: 'Step 0: Preparation', slug: 'self-hosting/prep'},
						{ label: 'Step 1: Installation', slug: 'self-hosting/install'},
						{ label: 'Step 2: Configuration', slug: 'self-hosting/config'},
					],
				},
				{ label: 'Features', slug: 'guides/features' },
				{ label: 'Pricing', slug: 'guides/pricing' },
				
				// {
				// 	label: 'Reference',
				// 	autogenerate: { directory: 'reference' },
				// },
			],
		}),
	],
});
