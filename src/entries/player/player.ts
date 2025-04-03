import { matches } from '~/lib/match';
import Hls from 'hls.js';
import { UrlReferer } from '~/lib/settings';

async function playNative(url: string, domain: string, videoElem: HTMLVideoElement) {
	await UrlReferer.set(new URL(url).hostname, domain);

	videoElem.src = url;
}

async function playHls(url: string, domain: string, videoElem: HTMLVideoElement) {
	if (videoElem.canPlayType('application/vnd.apple.mpegurl')) {
		videoElem.src = url;
	} else if (Hls.isSupported()) {
		const hls = new Hls({
			enableWorker: false,
			xhrSetup: async (xhr: XMLHttpRequest, url: string) => {
				await UrlReferer.set(new URL(url).hostname, domain);
				xhr.open('GET', url);
			}
		});
		hls.loadSource(url);
		hls.attachMedia(videoElem);
	} else {
		throw 'Failed to play m3u8 video (hls is not supported). Try again or create a new issue <a href="https://github.com/ByteDream/stream-bypass/issues/new">here</a>';
	}
}

export async function play(videoElem: HTMLVideoElement) {
	const urlQuery = new URLSearchParams(window.location.search);
	const id = urlQuery.get('id') as string;
	const url = decodeURIComponent(urlQuery.get('url') as string);
	const domain = urlQuery.get('domain') as string;
	const urlType = urlQuery.get('urlType') as string;

	const match = matches[id];
	if (match === undefined) {
		throw `Invalid id: ${id}. Please report this <a href="https://github.com/ByteDream/stream-bypass/issues">here</a>`;
	}
	document.title = `Stream Bypass (${domain})`;

	if (urlType === 'hls') {
		await playHls(url, domain, videoElem);
	} else if (urlType === 'native') {
		await playNative(url, domain, videoElem);
	}
}
