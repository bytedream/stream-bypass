import { matches } from '~/lib/match';
import Hls from 'hls.js';
import { storageSet } from '~/lib/settings';

async function playNative(url: string, videoElem: HTMLVideoElement) {
	videoElem.src = url;
}

async function playHls(url: string, videoElem: HTMLVideoElement) {
	if (videoElem.canPlayType('application/vnd.apple.mpegurl')) {
		videoElem.src = url;
	} else if (Hls.isSupported()) {
		const hls = new Hls({
			enableWorker: false
		});
		hls.loadSource(url);
		hls.attachMedia(videoElem);
	} else {
		throw 'Failed to play m3u8 video (hls is not supported). Try again or create a new issue <a href="https://github.com/ByteDream/stream-bypass/issues/new">here</a>';
	}
}

export async function play(videoElem: HTMLVideoElement) {
	const urlQuery = new URLSearchParams(window.location.search);
	const id = urlQuery.get('id');
	const url = decodeURIComponent(urlQuery.get('url'));
	const domain = urlQuery.get('domain');

	const match = matches[id];
	if (match === undefined) {
		throw `Invalid id: ${id}. Please report this <a href="https://github.com/ByteDream/stream-bypass/issues">here</a>`;
	}
	document.title = `Stream Bypass (${domain})`;

	await storageSet('referer', { domain: domain });

	if (new URL(url).pathname.endsWith('.m3u8')) {
		await playHls(url, videoElem);
	} else {
		await playNative(url, videoElem);
	}
}
