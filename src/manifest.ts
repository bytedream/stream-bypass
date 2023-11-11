import pkg from '../package.json';

const sharedManifest: Partial<chrome.runtime.ManifestBase> = {
	browser_specific_settings: {
		gecko: {
			id: '{55dd42e8-3dd9-455a-b4fe-86664881b10c}'
		}
	},
	content_scripts: [
		{
			all_frames: true,
			matches: ['<all_urls>'],
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
	permissions: ['storage', 'webRequest', 'nativeMessaging', '<all_urls>']
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
		scripts: ['src/entries/background/main.ts'],
		persistent: true
	},
	browser_action: browserAction,
	permissions: [...sharedManifest.permissions]
};

const ManifestV3 = {
	...sharedManifest,
	action: browserAction,
	background: {
		service_worker: 'src/entries/background/main.ts'
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
		};
	}

	if (manifestVersion === 3) {
		return {
			...manifest,
			...ManifestV3,
			manifest_version: manifestVersion
		};
	}

	throw new Error(`Missing manifest definition for manifestVersion ${manifestVersion}`);
}
