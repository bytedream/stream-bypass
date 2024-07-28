import pkg from '../package.json';
import { matches } from './lib/match';

const sharedManifest: Partial<chrome.runtime.ManifestBase> = {
	browser_specific_settings: {
		gecko: {
			id: '{55dd42e8-3dd9-455a-b4fe-86664881b10c}'
		}
	},
	content_scripts: [
		{
			all_frames: true,
			matches: Object.values(matches).flatMap((m) => m.domains.map((d) => `*://${d}/*`)),
			js: ['src/entries/contentScript/main.ts'],
			run_at: 'document_end'
		}
	],
	icons: {
		16: 'icons/stream-bypass@16px.png',
		32: 'icons/stream-bypass@32px.png',
		48: 'icons/stream-bypass@48px.png',
		96: 'icons/stream-bypass@96px.png',
		128: 'icons/stream-bypass@128px.png'
	},
	permissions: ['storage'],
	optional_permissions: ['nativeMessaging']
};

const browserAction = {
	default_icon: {
		16: 'icons/stream-bypass@16px.png',
		32: 'icons/stream-bypass@32px.png'
	},
	default_popup: 'src/entries/popup/index.html'
};

const ManifestV2 = {
	...sharedManifest,
	background: {
		scripts: ['src/entries/background/mv2.ts'],
		persistent: true
	},
	content_scripts: [{ ...sharedManifest.content_scripts![0], matches: ['<all_urls>'] }],
	browser_action: browserAction,
	permissions: [...sharedManifest.permissions, 'webRequest', 'webRequestBlocking', '<all_urls>']
};

const ManifestV3 = {
	...sharedManifest,
	action: browserAction,
	background: {
		service_worker: 'src/entries/background/mv3.ts'
	}
};

export function getManifest(
	manifestVersion: number
): chrome.runtime.ManifestV2 | chrome.runtime.ManifestV3 {
	const manifest = {
		author: pkg.author,
		description: pkg.description,
		name: pkg.displayName ?? pkg.name,
		version: pkg.version
	};

	if (manifestVersion === 2) {
		return {
			...manifest,
			...ManifestV2,
			manifest_version: manifestVersion
		} as chrome.runtime.ManifestV2;
	}

	if (manifestVersion === 3) {
		return {
			...manifest,
			// just like all the adblockers which are unable to fully work under MV3, we need access to every website
			// the user enters in order to work correctly, which is forbidden when using MV3
			name: `${manifest.name} Lite`,
			...ManifestV3,
			manifest_version: manifestVersion
		} as chrome.runtime.ManifestV3;
	}

	throw new Error(`Missing manifest definition for manifestVersion ${manifestVersion}`);
}
