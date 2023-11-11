import { defineConfig, loadEnv } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import webExtension from '@samrum/vite-plugin-web-extension';
import path from 'path';
import { getManifest } from './src/manifest';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');

	return {
		plugins: [
			svelte(),
			webExtension({
				manifest: getManifest(Number(env.MANIFEST_VERSION)),
				additionalInputs: {
					html: [
						{
							fileName: 'src/entries/player/player.html',
							webAccessible: {
								matches: ['<all_urls>'],
								excludeEntryFile: true
							}
						}
					]
				}
			})
		],
		resolve: {
			alias: {
				'~': path.resolve(__dirname, './src')
			}
		}
	};
});
