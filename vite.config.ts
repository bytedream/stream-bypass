import { defineConfig, loadEnv } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import webExtension from '@samrum/vite-plugin-web-extension';
import path from 'path';
import { getManifest } from './src/manifest';
import { matches } from './src/lib/match';

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
								matches:
									Number(env.MANIFEST_VERSION) === 3
										? Object.values(matches).flatMap((m) => m.domains.map((d) => `*://${d}/*`))
										: ['<all_urls>']
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
