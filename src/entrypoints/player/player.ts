import Hls from 'hls.js';
import { listenMessages, MessageType, sendMessage } from '@/lib/communication';
import { HostMatchType, hosts } from '@/lib/host';
import { UrlReferer } from '@/lib/settings';

async function playNative(url: string, domain: string, videoElem: HTMLVideoElement) {
	// multiple hosts need to have a correct referer set
	await UrlReferer.addTemporary(new URL(url).hostname, domain);

	videoElem.src = url;
}

async function playHls(url: string, domain: string, videoElem: HTMLVideoElement) {
	if (videoElem.canPlayType('application/vnd.apple.mpegurl')) {
		videoElem.src = url;
	} else if (Hls.isSupported()) {
		const hls = new Hls({
			enableWorker: false,
			xhrSetup: async (xhr: XMLHttpRequest, url: string) => {
				// multiple hosts need to have a correct referer set
				await UrlReferer.addTemporary(new URL(url).hostname, domain);
				xhr.open('GET', url);
			}
		});
		hls.loadSource(url);
		hls.attachMedia(videoElem);
	} else {
		throw 'Failed to play m3u8 video (hls is not supported). Try again or create a new issue';
	}
}

export async function play(videoElem: HTMLVideoElement) {
	const urlQuery = new URLSearchParams(window.location.search);
	const id = urlQuery.get('id') as string;
	const url = decodeURIComponent(urlQuery.get('url') as string);
	const domain = urlQuery.get('domain') as string;
	const type = urlQuery.get('type') as HostMatchType;

	const host = hosts.find((host) => host.id === id);
	if (!host) {
		throw `Invalid id: ${id}. Please report this`;
	}
	document.title = `Stream Bypass (${domain})`;

	initCommunication(id, url, domain);

	switch (type) {
		case HostMatchType.NATIVE:
			await playNative(url, domain, videoElem);
			break;
		case HostMatchType.HLS:
			await playHls(url, domain, videoElem);
			break;
	}
}

function initCommunication(id: string, url: string, domain: string) {
	const notifyActiveMatch = () =>
		sendMessage(MessageType.NotifyActiveMatch, {
			id: id,
			url: url,
			domain: domain
		});

	// if an extension popup is open, it will be notified that a match/player is now active
	notifyActiveMatch();

	// if an extension popup is opened, the listener will recognize it's active match request and send the match/player
	// data
	const cancel = listenMessages((type) => {
		if (type !== MessageType.RequestActiveMatch) return;
		notifyActiveMatch();
	});
	window.onbeforeunload = cancel;
}
