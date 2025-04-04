import { fileURLToPath } from 'url';
import webExtension from '@samrum/vite-plugin-web-extension';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig, loadEnv, type PluginOption } from 'vite';
import { matches } from './src/lib/match';
import { getManifest } from './src/manifest';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');

	return {
		plugins: [
			svelte() as PluginOption,
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
			}) as unknown as PluginOption
		],
		resolve: {
			alias: [{ find: '~', replacement: fileURLToPath(new URL('./src', import.meta.url)) }]
		}
	};
});
