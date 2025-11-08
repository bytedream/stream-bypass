import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'wxt';
import { version } from './package.json';

export default defineConfig({
	srcDir: 'src',
	modules: ['@wxt-dev/module-svelte'],
	manifest: ({ browser, manifestVersion }) => ({
		name: manifestVersion === 2 ? 'Stream Bypass' : 'Stream Bypass Lite',
		icons: {
			16: 'icon/stream-bypass@16px.png',
			32: 'icon/stream-bypass@32px.png',
			48: 'icon/stream-bypass@48px.png',
			128: 'icon/stream-bypass@128px.png'
		},
		browser_specific_settings:
			browser === 'firefox'
				? {
						gecko: {
							id: '{55dd42e8-3dd9-455a-b4fe-86664881b10c}',
							data_collection_permissions: {
								required: ['none']
							}
						},
						gecko_android: {}
					}
				: undefined,
		permissions: ['storage', ...(manifestVersion === 2 ? ['webRequest', 'webRequestBlocking', '<all_urls>'] : [])],
		optional_permissions: ['nativeMessaging']
	}),
	zip: {
		artifactTemplate: '{{name}}-{{version}}-{{manifestVersion}}.zip'
	},

	vite: () => ({
		define: {
			'import.meta.env.VERSION': JSON.stringify(version)
		},
		plugins: [tailwindcss()]
	}),

	svelte: {
		vite: {
			preprocess: vitePreprocess({})
		}
	}
});
